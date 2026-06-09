import { Response } from 'express';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../services/s3';
import sharp from 'sharp';
import { AuthRequest } from '../middleware/auth';

export const downloadWithWatermark = async (req: AuthRequest, res: Response) => {
  try {
    const { key, eventName, clubName } = req.query;
    if (!key) return res.status(400).json({ message: 'S3 Key is required' });

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key as string,
    });

    const s3Response = await s3Client.send(command);
    const stream = s3Response.Body as any;

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const watermarkText = `${clubName || 'Club'} | ${eventName || 'Event'} | ${req.user?.role || 'User'}`;
    
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    const svgWatermark = `
      <svg width="${metadata.width}" height="${metadata.height}">
        <style>
          .text { fill: rgba(255, 255, 255, 0.5); font-size: ${Math.floor((metadata.width || 1000) / 30)}px; font-weight: bold; font-family: sans-serif; }
        </style>
        <text x="50%" y="95%" text-anchor="middle" class="text">${watermarkText}</text>
      </svg>
    `;

    const watermarkedBuffer = await image
      .composite([{ input: Buffer.from(svgWatermark), top: 0, left: 0 }])
      .toBuffer();

    res.setHeader('Content-Type', s3Response.ContentType || 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="watermarked_${(key as string).split('/').pop()}"`);
    res.send(watermarkedBuffer);

  } catch (error) {
    res.status(500).json({ message: 'Error processing download' });
  }
};
