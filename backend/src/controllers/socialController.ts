import { Response } from 'express';
import { db } from '../db';
import { likes, comments, favorites, notifications, media } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth';
import { sendNotification } from '../services/socket';

export const likeMedia = async (req: AuthRequest, res: Response) => {
  try {
    const { mediaId } = req.body;
    const userId = req.user!.id;

    const existingLike = await db.select().from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.mediaId, mediaId)));

    if (existingLike.length > 0) {
      await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.mediaId, mediaId)));
      return res.json({ message: 'Unliked' });
    }

    await db.insert(likes).values({ userId, mediaId });

    // Handle notification
    const mediaRecord = await db.select().from(media).where(eq(media.id, mediaId));
    const firstMediaRec = mediaRecord[0];
    if (firstMediaRec && firstMediaRec.uploaderId !== userId) {
      const uploaderId = firstMediaRec.uploaderId;
      const [newNotification] = await db.insert(notifications).values({
        userId: uploaderId,
        actorId: userId,
        type: 'LIKE',
        targetId: mediaId,
      }).returning();
      
      sendNotification(uploaderId, newNotification);
    }

    res.status(201).json({ message: 'Liked' });
  } catch (error) {
    res.status(500).json({ message: 'Error liking media' });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { mediaId, content } = req.body;
    const userId = req.user!.id;

    const [newComment] = await db.insert(comments).values({
      userId,
      mediaId,
      content,
    }).returning();

    // Handle notification
    const mediaRecord = await db.select().from(media).where(eq(media.id, mediaId));
    const firstMediaRec = mediaRecord[0];
    if (firstMediaRec && firstMediaRec.uploaderId !== userId) {
      const uploaderId = firstMediaRec.uploaderId;
      const [newNotification] = await db.insert(notifications).values({
        userId: uploaderId,
        actorId: userId,
        type: 'COMMENT',
        targetId: mediaId,
      }).returning();
      
      sendNotification(uploaderId, newNotification);
    }

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
};

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { mediaId } = req.body;
    const userId = req.user!.id;

    const existingFav = await db.select().from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.mediaId, mediaId)));

    if (existingFav.length > 0) {
      await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.mediaId, mediaId)));
      return res.json({ message: 'Removed from favorites' });
    }

    await db.insert(favorites).values({ userId, mediaId });
    res.status(201).json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling favorite' });
  }
};

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userNotifications = await db.select().from(notifications)
      .where(eq(notifications.userId, req.user!.id))
      .orderBy(notifications.createdAt);
    res.json(userNotifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};
