import { Request, Response } from 'express';
import { db } from '../db';
import { events, albums } from '../db/schema';
import { eq } from 'drizzle-orm';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, description, date, category } = req.body;
    const newEvent = await db.insert(events).values({
      name,
      description,
      date: date ? new Date(date) : null,
      category,
    }).returning();
    res.status(201).json(newEvent[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const allEvents = await db.select().from(events);
    res.json(allEvents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await db.select().from(events).where(eq(events.id, parseInt(id)));
    if (event.length === 0) return res.status(404).json({ message: 'Event not found' });
    res.json(event[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event' });
  }
};

export const createAlbum = async (req: Request, res: Response) => {
  try {
    const { eventId, name, visibility } = req.body;
    const [newAlbum] = await db.insert(albums).values({
      eventId,
      name,
      visibility: visibility || 'PUBLIC',
    }).returning();
    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(500).json({ message: 'Error creating album' });
  }
};

export const getAlbumsByEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const eventAlbums = await db.select().from(albums).where(eq(albums.eventId, parseInt(eventId)));
    res.json(eventAlbums);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching albums' });
  }
};
