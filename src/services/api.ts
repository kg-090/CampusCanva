import { dbService } from './dbService';
import {
  FullUserProfile,
  CampusSpot,
  MemorySpace,
  SpaceMember,
  MediaItem,
  MediaTag,
  Reaction,
  Comment,
  NotificationItem,
  ReactionType,
  SpaceType,
  MemberRole,
  User,
  Student,
  Alumni,
  Faculty,
  DBMSInspectData,
} from '../types';

/**
 * CampusCanva API Service Layer
 * 
 * DESIGNED FOR FUTURE BACKEND INTEGRATION:
 * When connecting to your Node.js + Express + MySQL backend, simply toggle
 * USE_MOCK_API to false and point BASE_URL to your server (e.g. http://localhost:5000/api).
 */
const USE_MOCK_API = true;
const BASE_URL = 'http://localhost:5000/api';

// Small async delay helper to simulate realistic network latency in demo
const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // ==================== AUTHENTICATION ====================
  async login(email: string, passwordHash: string): Promise<FullUserProfile> {
    await delay();
    if (!USE_MOCK_API) {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: passwordHash }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
      return res.json();
    }
    const user = dbService.getUserByEmail(email);
    if (!user) throw new Error('No user found with this email. Use quick demo login or register!');
    return user;
  },

  async register(
    userData: Omit<User, 'user_id' | 'joined_at'>,
    specialized: {
      student?: Omit<Student, 'user_id'>;
      alumni?: Omit<Alumni, 'user_id'>;
      faculty?: Omit<Faculty, 'user_id'>;
    }
  ): Promise<FullUserProfile> {
    await delay();
    if (!USE_MOCK_API) {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, ...specialized }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
      return res.json();
    }
    return dbService.registerUser(userData, specialized);
  },

  async getUserProfile(userId: number): Promise<FullUserProfile | null> {
    await delay();
    return dbService.getUserById(userId);
  },

  async updateProfile(userId: number, updates: Partial<User>): Promise<FullUserProfile> {
    await delay();
    return dbService.updateUserProfile(userId, updates);
  },

  async getAllUsers(): Promise<User[]> {
    await delay();
    return dbService.getUsers();
  },

  // ==================== CAMPUS SPOTS ====================
  async getCampusSpots(): Promise<CampusSpot[]> {
    await delay();
    return dbService.getCampusSpots();
  },

  async getCampusSpotById(spotId: number): Promise<CampusSpot | null> {
    await delay();
    return dbService.getCampusSpotById(spotId);
  },

  // ==================== MEMORY SPACES ====================
  async getMemorySpaces(): Promise<MemorySpace[]> {
    await delay();
    return dbService.getMemorySpaces();
  },

  async getMemorySpaceById(spaceId: number): Promise<MemorySpace | null> {
    await delay();
    return dbService.getMemorySpaceById(spaceId);
  },

  async createMemorySpace(
    creatorId: number,
    data: {
      title: string;
      description: string;
      space_type: SpaceType;
      spot_id: number | null;
      cover_url: string;
      is_time_locked: boolean;
      unlock_date: string | null;
    }
  ): Promise<MemorySpace> {
    await delay();
    return dbService.createMemorySpace(creatorId, data);
  },

  async updateMemorySpace(spaceId: number, updates: Partial<MemorySpace>): Promise<MemorySpace> {
    await delay();
    return dbService.updateMemorySpace(spaceId, updates);
  },

  async deleteMemorySpace(spaceId: number): Promise<void> {
    await delay();
    dbService.deleteMemorySpace(spaceId);
  },

  // ==================== SPACE MEMBERSHIP ====================
  async getSpaceMembers(spaceId: number): Promise<(SpaceMember & { user: FullUserProfile })[]> {
    await delay();
    return dbService.getSpaceMembers(spaceId);
  },

  async getUserSpaces(userId: number): Promise<(MemorySpace & { user_role: MemberRole })[]> {
    await delay();
    return dbService.getUserSpaces(userId);
  },

  async addSpaceMember(spaceId: number, userId: number, role: MemberRole): Promise<SpaceMember> {
    await delay();
    return dbService.addSpaceMember(spaceId, userId, role);
  },

  async removeSpaceMember(spaceId: number, userId: number): Promise<void> {
    await delay();
    dbService.removeSpaceMember(spaceId, userId);
  },

  // ==================== MEDIA & SPECIALIZATION ====================
  async getAllMedia(): Promise<MediaItem[]> {
    await delay();
    return dbService.getAllMedia();
  },

  async getMediaBySpaceId(spaceId: number): Promise<MediaItem[]> {
    await delay();
    return dbService.getMediaBySpaceId(spaceId);
  },

  async getMediaById(mediaId: number): Promise<MediaItem | null> {
    await delay();
    return dbService.getMediaById(mediaId);
  },

  async addMediaItem(
    spaceId: number,
    uploaderId: number,
    data: {
      media_url: string;
      media_type: 'PHOTO' | 'VIDEO';
      caption: string;
      tagged_user_ids?: number[];
      photo_meta?: { width?: number; height?: number };
      video_meta?: { duration_seconds?: number };
    }
  ): Promise<MediaItem> {
    await delay();
    return dbService.addMediaItem(spaceId, uploaderId, data);
  },

  async deleteMediaItem(mediaId: number): Promise<void> {
    await delay();
    dbService.deleteMediaItem(mediaId);
  },

  // ==================== TAGS ====================
  async getMediaTags(mediaId: number): Promise<(MediaTag & { user: FullUserProfile })[]> {
    await delay();
    return dbService.getMediaTags(mediaId);
  },

  async tagUser(mediaId: number, taggedUserId: number): Promise<MediaTag> {
    await delay();
    return dbService.tagUserInMedia(mediaId, taggedUserId);
  },

  async removeTag(mediaId: number, taggedUserId: number): Promise<void> {
    await delay();
    dbService.removeTag(mediaId, taggedUserId);
  },

  // ==================== REACTIONS ====================
  async getMediaReactions(mediaId: number): Promise<Reaction[]> {
    await delay();
    return dbService.getMediaReactions(mediaId);
  },

  async toggleReaction(mediaId: number, userId: number, type: ReactionType): Promise<{ added: boolean; reaction: Reaction | null }> {
    await delay();
    return dbService.toggleReaction(mediaId, userId, type);
  },

  // ==================== COMMENTS ====================
  async getMediaComments(mediaId: number): Promise<(Comment & { user: FullUserProfile })[]> {
    await delay();
    return dbService.getMediaComments(mediaId);
  },

  async addComment(mediaId: number, userId: number, text: string): Promise<Comment & { user: FullUserProfile }> {
    await delay();
    return dbService.addComment(mediaId, userId, text);
  },

  async deleteComment(mediaId: number, commentNo: number): Promise<void> {
    await delay();
    dbService.deleteComment(mediaId, commentNo);
  },

  // ==================== NOTIFICATIONS ====================
  async getNotifications(userId: number): Promise<NotificationItem[]> {
    await delay();
    return dbService.getNotifications(userId);
  },

  async markNotificationAsRead(notifId: number): Promise<void> {
    await delay();
    dbService.markNotificationAsRead(notifId);
  },

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    await delay();
    dbService.markAllNotificationsAsRead(userId);
  },

  // ==================== STATS & DBMS META ====================
  async getGlobalStats() {
    await delay();
    return dbService.getGlobalStats();
  },

  getDBMSMeta(type: 'space' | 'media' | 'user' | 'comment', id: number): DBMSInspectData {
    return dbService.getDBMSMetadata(type, id);
  },

  resetDemoDatabase(): void {
    dbService.resetToSeeds();
  },
};
