import { Response } from 'express';
import { db } from '../db';
import { media, albums, tags, mediaTags } from '../db/schema';
import { eq } from 'drizzle-orm';
import { getPresignedUploadUrl } from '../services/s3';
import { AuthRequest } from '../middleware/auth';
import { detectLabels, indexFace } from '../services/rekognition';

export const getUploadUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { fileName, contentType, albumId } = req.body;
    const key = `albums/${albumId}/${Date.now()}-${fileName}`;
    const uploadUrl = await getPresignedUploadUrl(key, contentType);
    res.json({ uploadUrl, key });
  } catch (error) {
    res.status(500).json({ message: 'Error generating upload URL' });
  }
};

export const registerMedia = async (req: AuthRequest, res: Response) => {
  try {
    const { albumId, s3Key, type } = req.body;
    const uploaderId = req.user!.id;
    const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    
    const newMedia = await db.insert(media).values({
      albumId,
      uploaderId,
      s3Url,
      s3Key,
      type: type || 'PHOTO',
    }).returning();

    const mediaRecord = newMedia[0];
    if (!mediaRecord) return res.status(500).json({ message: 'Failed to insert media' });
    const mediaId = mediaRecord.id;

    if (type === 'PHOTO' || !type) {
      const labelsData = await detectLabels(process.env.S3_BUCKET_NAME!, s3Key);
      if (labelsData.Labels) {
        for (const label of labelsData.Labels) {
          if (label.Name) {
            let tagRecord = await db.select().from(tags).where(eq(tags.name, label.Name));
            let tagId;
            if (tagRecord.length === 0) {
              const newTag = await db.insert(tags).values({ name: label.Name }).returning();
              if (newTag[0]) tagId = newTag[0].id;
            } else {
              tagId = tagRecord[0]?.id;
            }
            if (tagId) {
              await db.insert(mediaTags).values({ mediaId, tagId }).onConflictDoNothing();
            }
          }
        }
      }

      try {
        await indexFace(process.env.S3_BUCKET_NAME!, s3Key, mediaId.toString());
      } catch (faceError) {
        console.error('Error indexing faces:', faceError);
      }
    }
    
    res.status(201).json(mediaRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error registering media' });
  }
};

export const getMediaByAlbum = async (req: AuthRequest, res: Response) => {
  try {
    const { albumId } = req.params;
    const albumMedia = await db.select().from(media).where(eq(media.albumId, parseInt(albumId as string)));
    res.json(albumMedia);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching media' });
  }
};
