import { pgTable, serial, text, timestamp, varchar, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'PHOTOGRAPHER', 'CLUB_MEMBER', 'VIEWER']);
export const mediaTypeEnum = pgEnum('media_type', ['PHOTO', 'VIDEO']);
export const visibilityEnum = pgEnum('visibility', ['PUBLIC', 'PRIVATE']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').default('VIEWER').notNull(),
  selfieS3Key: text('selfie_s3_key'),
  rekognitionFaceId: text('rekognition_face_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  date: timestamp('date'),
  category: varchar('category', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const albums = pgTable('albums', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  visibility: visibilityEnum('visibility').default('PUBLIC').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  albumId: integer('album_id').references(() => albums.id, { onDelete: 'cascade' }).notNull(),
  uploaderId: integer('uploader_id').references(() => users.id).notNull(),
  s3Url: text('s3_url').notNull(),
  s3Key: text('s3_key').notNull(),
  type: mediaTypeEnum('type').default('PHOTO').notNull(),
  uploadDate: timestamp('upload_date').defaultNow().notNull(),
});

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
});

export const mediaTags = pgTable('media_tags', {
  mediaId: integer('media_id').references(() => media.id, { onDelete: 'cascade' }).notNull(),
  tagId: integer('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  pk: [table.mediaId, table.tagId],
}));

export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  mediaId: integer('media_id').references(() => media.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  mediaId: integer('media_id').references(() => media.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  mediaId: integer('media_id').references(() => media.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  actorId: integer('actor_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  targetId: integer('target_id'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
