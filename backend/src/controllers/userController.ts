import { Response } from 'express';
import { db } from '../db';
import { users, media } from '../db/schema';
import { eq, inArray } from 'drizzle-orm';
import { getPresignedUploadUrl } from '../services/s3';
import { AuthRequest } from '../middleware/auth';
import { searchFaces } from '../services/rekognition';

export const getSelfieUploadUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { fileName, contentType } = req.body;
    const key = `selfies/${req.user!.id}/${Date.now()}-${fileName}`;
    const uploadUrl = await getPresignedUploadUrl(key, contentType);
    res.json({ uploadUrl, key });
  } catch (error) {
    res.status(500).json({ message: 'Error generating selfie upload URL' });
  }
};

export const registerSelfie = async (req: AuthRequest, res: Response) => {
  try {
    const { s3Key } = req.body;
    await db.update(users)
      .set({ selfieS3Key: s3Key })
      .where(eq(users.id, req.user!.id));
    res.json({ message: 'Selfie registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering selfie' });
  }
};

export const getMyPhotos = async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, req.user!.id));
    if (!user[0].selfieS3Key) {
      return res.status(400).json({ message: 'Please upload a selfie first' });
    }

    const searchResults = await searchFaces(process.env.S3_BUCKET_NAME!, user[0].selfieS3Key);
    
    if (!searchResults.FaceMatches || searchResults.FaceMatches.length === 0) {
      return res.json([]);
    }

    const mediaIds = searchResults.FaceMatches
      .map(match => match.Face?.ExternalImageId)
      .filter(id => id !== undefined)
      .map(id => parseInt(id!));

    if (mediaIds.length === 0) return res.json([]);

    const matchedMedia = await db.select().from(media).where(inArray(media.id, mediaIds));
    res.json(matchedMedia);
  } catch (error) {
    console.error('Error finding photos:', error);
    res.status(500).json({ message: 'Error searching for photos' });
  }
};
