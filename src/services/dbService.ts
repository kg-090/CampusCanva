import {
  User,
  Student,
  Alumni,
  Faculty,
  FullUserProfile,
  CampusSpot,
  MemorySpace,
  SpaceMember,
  MediaItem,
  Photo,
  Video,
  MediaTag,
  Reaction,
  Comment,
  NotificationItem,
  ReactionType,
  SpaceType,
  MemberRole,
  DBMSInspectData,
} from '../types';
import {
  SEED_USERS,
  SEED_STUDENTS,
  SEED_ALUMNI,
  SEED_FACULTY,
  SEED_CAMPUS_SPOTS,
  SEED_MEMORY_SPACES,
  SEED_SPACE_MEMBERS,
  SEED_MEDIA_ITEMS,
  SEED_PHOTOS,
  SEED_VIDEOS,
  SEED_MEDIA_TAGS,
  SEED_REACTIONS,
  SEED_COMMENTS,
  SEED_NOTIFICATIONS,
} from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'cc_db_users',
  STUDENTS: 'cc_db_students',
  ALUMNI: 'cc_db_alumni',
  FACULTY: 'cc_db_faculty',
  CAMPUS_SPOTS: 'cc_db_spots',
  MEMORY_SPACES: 'cc_db_spaces',
  SPACE_MEMBERS: 'cc_db_members',
  MEDIA_ITEMS: 'cc_db_media',
  PHOTOS: 'cc_db_photos',
  VIDEOS: 'cc_db_videos',
  MEDIA_TAGS: 'cc_db_tags',
  REACTIONS: 'cc_db_reactions',
  COMMENTS: 'cc_db_comments',
  NOTIFICATIONS: 'cc_db_notifications',
};

// Generic storage helpers
function loadTable<T>(key: string, defaultData: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      saveTable(key, defaultData);
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return defaultData;
  }
}

function saveTable<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

class RelationalDatabaseService {
  // RESET DATABASE TO SEEDS
  public resetToSeeds(): void {
    saveTable(STORAGE_KEYS.USERS, SEED_USERS);
    saveTable(STORAGE_KEYS.STUDENTS, SEED_STUDENTS);
    saveTable(STORAGE_KEYS.ALUMNI, SEED_ALUMNI);
    saveTable(STORAGE_KEYS.FACULTY, SEED_FACULTY);
    saveTable(STORAGE_KEYS.CAMPUS_SPOTS, SEED_CAMPUS_SPOTS);
    saveTable(STORAGE_KEYS.MEMORY_SPACES, SEED_MEMORY_SPACES);
    saveTable(STORAGE_KEYS.SPACE_MEMBERS, SEED_SPACE_MEMBERS);
    saveTable(STORAGE_KEYS.MEDIA_ITEMS, SEED_MEDIA_ITEMS);
    saveTable(STORAGE_KEYS.PHOTOS, SEED_PHOTOS);
    saveTable(STORAGE_KEYS.VIDEOS, SEED_VIDEOS);
    saveTable(STORAGE_KEYS.MEDIA_TAGS, SEED_MEDIA_TAGS);
    saveTable(STORAGE_KEYS.REACTIONS, SEED_REACTIONS);
    saveTable(STORAGE_KEYS.COMMENTS, SEED_COMMENTS);
    saveTable(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  }

  // ==================== USERS & ISA SPECIALIZATION ====================
  public getUsers(): User[] {
    return loadTable<User>(STORAGE_KEYS.USERS, SEED_USERS);
  }

  public getUserById(userId: number): FullUserProfile | null {
    const users = this.getUsers();
    const user = users.find((u) => u.user_id === userId);
    if (!user) return null;

    const students = loadTable<Student>(STORAGE_KEYS.STUDENTS, SEED_STUDENTS);
    const alumni = loadTable<Alumni>(STORAGE_KEYS.ALUMNI, SEED_ALUMNI);
    const faculty = loadTable<Faculty>(STORAGE_KEYS.FACULTY, SEED_FACULTY);

    return {
      ...user,
      student: students.find((s) => s.user_id === userId),
      alumni: alumni.find((a) => a.user_id === userId),
      faculty: faculty.find((f) => f.user_id === userId),
    };
  }

  public getUserByEmail(email: string): FullUserProfile | null {
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    return this.getUserById(user.user_id);
  }

  // Atomic Registration simulating SQL Transaction with ISA Subtype insertion
  public registerUser(
    userData: Omit<User, 'user_id' | 'joined_at'>,
    specializedData: {
      student?: Omit<Student, 'user_id'>;
      alumni?: Omit<Alumni, 'user_id'>;
      faculty?: Omit<Faculty, 'user_id'>;
    }
  ): FullUserProfile {
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error(`Email ${userData.email} is already registered.`);
    }

    const newUserId = users.length > 0 ? Math.max(...users.map((u) => u.user_id)) + 1 : 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newUser: User = {
      ...userData,
      user_id: newUserId,
      joined_at: now,
    };

    users.push(newUser);
    saveTable(STORAGE_KEYS.USERS, users);

    // ISA Subtable Insert
    if (userData.user_type === 'STUDENT' && specializedData.student) {
      const students = loadTable<Student>(STORAGE_KEYS.STUDENTS, SEED_STUDENTS);
      students.push({ user_id: newUserId, ...specializedData.student });
      saveTable(STORAGE_KEYS.STUDENTS, students);
    } else if (userData.user_type === 'ALUMNI' && specializedData.alumni) {
      const alumni = loadTable<Alumni>(STORAGE_KEYS.ALUMNI, SEED_ALUMNI);
      alumni.push({ user_id: newUserId, ...specializedData.alumni });
      saveTable(STORAGE_KEYS.ALUMNI, alumni);
    } else if (userData.user_type === 'FACULTY' && specializedData.faculty) {
      const faculty = loadTable<Faculty>(STORAGE_KEYS.FACULTY, SEED_FACULTY);
      faculty.push({ user_id: newUserId, ...specializedData.faculty });
      saveTable(STORAGE_KEYS.FACULTY, faculty);
    }

    return this.getUserById(newUserId)!;
  }

  public updateUserProfile(userId: number, updates: Partial<User>): FullUserProfile {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.user_id === userId);
    if (idx === -1) throw new Error('User not found');

    users[idx] = { ...users[idx], ...updates };
    saveTable(STORAGE_KEYS.USERS, users);
    return this.getUserById(userId)!;
  }

  // ==================== CAMPUS SPOTS ====================
  public getCampusSpots(): CampusSpot[] {
    return loadTable<CampusSpot>(STORAGE_KEYS.CAMPUS_SPOTS, SEED_CAMPUS_SPOTS);
  }

  public getCampusSpotById(spotId: number): CampusSpot | null {
    const spots = this.getCampusSpots();
    return spots.find((s) => s.spot_id === spotId) || null;
  }

  // ==================== MEMORY SPACES ====================
  public getMemorySpaces(): MemorySpace[] {
    return loadTable<MemorySpace>(STORAGE_KEYS.MEMORY_SPACES, SEED_MEMORY_SPACES);
  }

  public getMemorySpaceById(spaceId: number): MemorySpace | null {
    const spaces = this.getMemorySpaces();
    return spaces.find((s) => s.space_id === spaceId) || null;
  }

  public createMemorySpace(
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
  ): MemorySpace {
    const spaces = this.getMemorySpaces();
    const newId = spaces.length > 0 ? Math.max(...spaces.map((s) => s.space_id)) + 1 : 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newSpace: MemorySpace = {
      space_id: newId,
      creator_id: creatorId,
      spot_id: data.spot_id,
      title: data.title,
      description: data.description,
      space_type: data.space_type,
      cover_url: data.cover_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
      is_time_locked: data.is_time_locked,
      unlock_date: data.is_time_locked ? data.unlock_date : null,
      created_at: now,
      updated_at: now,
    };

    spaces.unshift(newSpace);
    saveTable(STORAGE_KEYS.MEMORY_SPACES, spaces);

    // Trigger simulation: Auto-insert creator as 'Admin' into space_member
    this.addSpaceMember(newId, creatorId, 'Admin');

    return newSpace;
  }

  public updateMemorySpace(spaceId: number, updates: Partial<MemorySpace>): MemorySpace {
    const spaces = this.getMemorySpaces();
    const idx = spaces.findIndex((s) => s.space_id === spaceId);
    if (idx === -1) throw new Error('Space not found');

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    spaces[idx] = { ...spaces[idx], ...updates, updated_at: now };
    saveTable(STORAGE_KEYS.MEMORY_SPACES, spaces);
    return spaces[idx];
  }

  public deleteMemorySpace(spaceId: number): void {
    let spaces = this.getMemorySpaces();
    spaces = spaces.filter((s) => s.space_id !== spaceId);
    saveTable(STORAGE_KEYS.MEMORY_SPACES, spaces);

    // Cascade delete members, media items, tags, comments, reactions
    let members = loadTable<SpaceMember>(STORAGE_KEYS.SPACE_MEMBERS, SEED_SPACE_MEMBERS);
    members = members.filter((m) => m.space_id !== spaceId);
    saveTable(STORAGE_KEYS.SPACE_MEMBERS, members);

    const mediaList = this.getMediaBySpaceId(spaceId);
    mediaList.forEach((m) => this.deleteMediaItem(m.media_id));
  }

  // ==================== SPACE MEMBERS (M:N) ====================
  public getSpaceMembers(spaceId: number): (SpaceMember & { user: FullUserProfile })[] {
    const members = loadTable<SpaceMember>(STORAGE_KEYS.SPACE_MEMBERS, SEED_SPACE_MEMBERS);
    return members
      .filter((m) => m.space_id === spaceId)
      .map((m) => {
        const u = this.getUserById(m.user_id)!;
        return { ...m, user: u };
      });
  }

  public getUserSpaces(userId: number): (MemorySpace & { user_role: MemberRole })[] {
    const members = loadTable<SpaceMember>(STORAGE_KEYS.SPACE_MEMBERS, SEED_SPACE_MEMBERS);
    const spaces = this.getMemorySpaces();

    const userMemberships = members.filter((m) => m.user_id === userId);
    return userMemberships
      .map((m) => {
        const space = spaces.find((s) => s.space_id === m.space_id);
        if (!space) return null;
        return { ...space, user_role: m.role_type };
      })
      .filter(Boolean) as (MemorySpace & { user_role: MemberRole })[];
  }

  public addSpaceMember(spaceId: number, userId: number, role: MemberRole = 'Contributor'): SpaceMember {
    const members = loadTable<SpaceMember>(STORAGE_KEYS.SPACE_MEMBERS, SEED_SPACE_MEMBERS);
    const existing = members.find((m) => m.space_id === spaceId && m.user_id === userId);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (existing) {
      existing.role_type = role;
      saveTable(STORAGE_KEYS.SPACE_MEMBERS, members);
      return existing;
    }

    const newMember: SpaceMember = {
      space_id: spaceId,
      user_id: userId,
      role_type: role,
      joined_at: now,
    };
    members.push(newMember);
    saveTable(STORAGE_KEYS.SPACE_MEMBERS, members);
    return newMember;
  }

  public removeSpaceMember(spaceId: number, userId: number): void {
    let members = loadTable<SpaceMember>(STORAGE_KEYS.SPACE_MEMBERS, SEED_SPACE_MEMBERS);
    members = members.filter((m) => !(m.space_id === spaceId && m.user_id === userId));
    saveTable(STORAGE_KEYS.SPACE_MEMBERS, members);
  }

  // ==================== MEDIA ITEMS & ISA (PHOTO / VIDEO) ====================
  public getAllMedia(): MediaItem[] {
    return loadTable<MediaItem>(STORAGE_KEYS.MEDIA_ITEMS, SEED_MEDIA_ITEMS);
  }

  public getMediaBySpaceId(spaceId: number): MediaItem[] {
    const all = this.getAllMedia();
    return all.filter((m) => m.space_id === spaceId);
  }

  public getMediaById(mediaId: number): MediaItem | null {
    const all = this.getAllMedia();
    return all.find((m) => m.media_id === mediaId) || null;
  }

  public addMediaItem(
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
  ): MediaItem {
    const mediaList = this.getAllMedia();
    const newId = mediaList.length > 0 ? Math.max(...mediaList.map((m) => m.media_id)) + 1 : 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newMedia: MediaItem = {
      media_id: newId,
      space_id: spaceId,
      uploader_id: uploaderId,
      media_url: data.media_url,
      media_type: data.media_type,
      caption: data.caption,
      uploaded_at: now,
    };

    mediaList.unshift(newMedia);
    saveTable(STORAGE_KEYS.MEDIA_ITEMS, mediaList);

    // Insert into Photo or Video subtype table
    if (data.media_type === 'PHOTO') {
      const photos = loadTable<Photo>(STORAGE_KEYS.PHOTOS, SEED_PHOTOS);
      photos.push({ media_id: newId, width: data.photo_meta?.width || 1920, height: data.photo_meta?.height || 1080 });
      saveTable(STORAGE_KEYS.PHOTOS, photos);
    } else {
      const videos = loadTable<Video>(STORAGE_KEYS.VIDEOS, SEED_VIDEOS);
      videos.push({ media_id: newId, duration_seconds: data.video_meta?.duration_seconds || 30 });
      saveTable(STORAGE_KEYS.VIDEOS, videos);
    }

    // Insert tagged users into media_tag
    if (data.tagged_user_ids && data.tagged_user_ids.length > 0) {
      data.tagged_user_ids.forEach((uid) => this.tagUserInMedia(newId, uid));
    }

    return newMedia;
  }

  public deleteMediaItem(mediaId: number): void {
    let mediaList = this.getAllMedia();
    mediaList = mediaList.filter((m) => m.media_id !== mediaId);
    saveTable(STORAGE_KEYS.MEDIA_ITEMS, mediaList);

    // Subtypes
    let photos = loadTable<Photo>(STORAGE_KEYS.PHOTOS, SEED_PHOTOS);
    photos = photos.filter((p) => p.media_id !== mediaId);
    saveTable(STORAGE_KEYS.PHOTOS, photos);

    let videos = loadTable<Video>(STORAGE_KEYS.VIDEOS, SEED_VIDEOS);
    videos = videos.filter((v) => v.media_id !== mediaId);
    saveTable(STORAGE_KEYS.VIDEOS, videos);

    // Tags, Reactions, Comments (Cascaded)
    let tags = loadTable<MediaTag>(STORAGE_KEYS.MEDIA_TAGS, SEED_MEDIA_TAGS);
    tags = tags.filter((t) => t.media_id !== mediaId);
    saveTable(STORAGE_KEYS.MEDIA_TAGS, tags);

    let reactions = loadTable<Reaction>(STORAGE_KEYS.REACTIONS, SEED_REACTIONS);
    reactions = reactions.filter((r) => r.media_id !== mediaId);
    saveTable(STORAGE_KEYS.REACTIONS, reactions);

    let comments = loadTable<Comment>(STORAGE_KEYS.COMMENTS, SEED_COMMENTS);
    comments = comments.filter((c) => c.media_id !== mediaId);
    saveTable(STORAGE_KEYS.COMMENTS, comments);
  }

  // ==================== TAGS ====================
  public getMediaTags(mediaId: number): (MediaTag & { user: FullUserProfile })[] {
    const tags = loadTable<MediaTag>(STORAGE_KEYS.MEDIA_TAGS, SEED_MEDIA_TAGS);
    return tags
      .filter((t) => t.media_id === mediaId)
      .map((t) => ({ ...t, user: this.getUserById(t.tagged_user_id)! }))
      .filter((t) => Boolean(t.user));
  }

  public tagUserInMedia(mediaId: number, taggedUserId: number): MediaTag {
    const tags = loadTable<MediaTag>(STORAGE_KEYS.MEDIA_TAGS, SEED_MEDIA_TAGS);
    const existing = tags.find((t) => t.media_id === mediaId && t.tagged_user_id === taggedUserId);
    if (existing) return existing;

    const newTagId = tags.length > 0 ? Math.max(...tags.map((t) => t.tag_id)) + 1 : 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newTag: MediaTag = {
      tag_id: newTagId,
      media_id: mediaId,
      tagged_user_id: taggedUserId,
      tagged_at: now,
    };
    tags.push(newTag);
    saveTable(STORAGE_KEYS.MEDIA_TAGS, tags);
    return newTag;
  }

  public removeTag(mediaId: number, taggedUserId: number): void {
    let tags = loadTable<MediaTag>(STORAGE_KEYS.MEDIA_TAGS, SEED_MEDIA_TAGS);
    tags = tags.filter((t) => !(t.media_id === mediaId && t.tagged_user_id === taggedUserId));
    saveTable(STORAGE_KEYS.MEDIA_TAGS, tags);
  }

  // ==================== REACTIONS ====================
  public getMediaReactions(mediaId: number): Reaction[] {
    const reactions = loadTable<Reaction>(STORAGE_KEYS.REACTIONS, SEED_REACTIONS);
    return reactions.filter((r) => r.media_id === mediaId);
  }

  public toggleReaction(mediaId: number, userId: number, type: ReactionType): { added: boolean; reaction: Reaction | null } {
    let reactions = loadTable<Reaction>(STORAGE_KEYS.REACTIONS, SEED_REACTIONS);
    const existingIdx = reactions.findIndex(
      (r) => r.media_id === mediaId && r.user_id === userId && r.reaction_type === type
    );

    if (existingIdx !== -1) {
      // Remove reaction
      reactions.splice(existingIdx, 1);
      saveTable(STORAGE_KEYS.REACTIONS, reactions);
      return { added: false, reaction: null };
    } else {
      // Add reaction
      const newId = reactions.length > 0 ? Math.max(...reactions.map((r) => r.reaction_id)) + 1 : 1;
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newReaction: Reaction = {
        reaction_id: newId,
        media_id: mediaId,
        user_id: userId,
        reaction_type: type,
        created_at: now,
      };
      reactions.push(newReaction);
      saveTable(STORAGE_KEYS.REACTIONS, reactions);
      return { added: true, reaction: newReaction };
    }
  }

  // ==================== COMMENTS (WEAK ENTITY) ====================
  public getMediaComments(mediaId: number): (Comment & { user: FullUserProfile })[] {
    const comments = loadTable<Comment>(STORAGE_KEYS.COMMENTS, SEED_COMMENTS);
    return comments
      .filter((c) => c.media_id === mediaId)
      .sort((a, b) => a.comment_no - b.comment_no)
      .map((c) => ({ ...c, user: this.getUserById(c.user_id)! }))
      .filter((c) => Boolean(c.user));
  }

  // Weak entity creation: calculates comment_no as MAX(comment_no) + 1 for this media_id
  public addComment(mediaId: number, userId: number, text: string): Comment & { user: FullUserProfile } {
    const comments = loadTable<Comment>(STORAGE_KEYS.COMMENTS, SEED_COMMENTS);
    const mediaComments = comments.filter((c) => c.media_id === mediaId);
    const nextCommentNo = mediaComments.length > 0 ? Math.max(...mediaComments.map((c) => c.comment_no)) + 1 : 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newComment: Comment = {
      media_id: mediaId,
      comment_no: nextCommentNo,
      user_id: userId,
      comment_text: text,
      created_at: now,
    };

    comments.push(newComment);
    saveTable(STORAGE_KEYS.COMMENTS, comments);

    return {
      ...newComment,
      user: this.getUserById(userId)!,
    };
  }

  public deleteComment(mediaId: number, commentNo: number): void {
    let comments = loadTable<Comment>(STORAGE_KEYS.COMMENTS, SEED_COMMENTS);
    comments = comments.filter((c) => !(c.media_id === mediaId && c.comment_no === commentNo));
    saveTable(STORAGE_KEYS.COMMENTS, comments);
  }

  // ==================== NOTIFICATIONS ====================
  public getNotifications(userId: number): NotificationItem[] {
    const notifs = loadTable<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    return notifs.filter((n) => n.user_id === userId);
  }

  public markNotificationAsRead(notificationId: number): void {
    const notifs = loadTable<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    const target = notifs.find((n) => n.notification_id === notificationId);
    if (target) {
      target.is_read = true;
      saveTable(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  }

  public markAllNotificationsAsRead(userId: number): void {
    const notifs = loadTable<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    notifs.forEach((n) => {
      if (n.user_id === userId) n.is_read = true;
    });
    saveTable(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  // ==================== AGGREGATE CALCULATIONS ====================
  public getGlobalStats() {
    const spaces = this.getMemorySpaces();
    const media = this.getAllMedia();
    const users = this.getUsers();
    const now = new Date();

    const upcomingCapsules = spaces.filter(
      (s) => s.is_time_locked && s.unlock_date && new Date(s.unlock_date) > now
    ).length;

    return {
      totalSpaces: spaces.length,
      totalMedia: media.length,
      totalUsers: users.length,
      upcomingCapsules,
    };
  }

  // ==================== DBMS RELATIONSHIP INSPECTOR ====================
  public getDBMSMetadata(type: 'space' | 'media' | 'user' | 'comment', id: number): DBMSInspectData {
    if (type === 'space') {
      const space = this.getMemorySpaceById(id);
      return {
        entity: 'MEMORY_SPACE',
        primaryKey: `space_id = ${id}`,
        foreignKeys: [
          `creator_id (${space?.creator_id}) -> users(user_id)`,
          `spot_id (${space?.spot_id || 'NULL'}) -> campus_spot(spot_id)`,
        ],
        relationships: [
          '1:N with media_item (space_id)',
          'M:N with users resolved through space_member (space_id, user_id)',
          '0..1:N with campus_spot (spot_id)',
        ],
        sampleSQL: `SELECT ms.*, u.full_name as creator, cs.spot_name\nFROM memory_space ms\nJOIN users u ON ms.creator_id = u.user_id\nLEFT JOIN campus_spot cs ON ms.spot_id = cs.spot_id\nWHERE ms.space_id = ${id};`,
        attributes: space ? { ...space } : {},
      };
    } else if (type === 'media') {
      const media = this.getMediaById(id);
      return {
        entity: `MEDIA_ITEM (ISA ${media?.media_type || 'PHOTO'})`,
        primaryKey: `media_id = ${id}`,
        foreignKeys: [
          `space_id (${media?.space_id}) -> memory_space(space_id)`,
          `uploader_id (${media?.uploader_id}) -> users(user_id)`,
        ],
        relationships: [
          '1:N Weak Entity Owner of comment(media_id, comment_no)',
          'M:N with users through media_tag(media_id, tagged_user_id)',
          '1:N with reaction(media_id, user_id)',
          `Specialization ISA: ${media?.media_type === 'PHOTO' ? 'photo(media_id)' : 'video(media_id)'}`,
        ],
        sampleSQL: `SELECT m.*, u.full_name as uploader, ms.title as space_title\nFROM media_item m\nJOIN users u ON m.uploader_id = u.user_id\nJOIN memory_space ms ON m.space_id = ms.space_id\nWHERE m.media_id = ${id};`,
        attributes: media ? { ...media } : {},
      };
    } else if (type === 'user') {
      const user = this.getUserById(id);
      return {
        entity: `USERS (ISA ${user?.user_type})`,
        primaryKey: `user_id = ${id}`,
        foreignKeys: [
          `Specialization table PK/FK -> ${user?.user_type.toLowerCase()}(user_id)`,
        ],
        relationships: [
          '1:N creator of memory_space',
          '1:N uploader of media_item',
          'M:N member of space_member',
          'M:N tagged in media_tag',
        ],
        sampleSQL: `SELECT u.*, s.roll_number, s.department, s.batch_year\nFROM users u\nLEFT JOIN student s ON u.user_id = s.user_id\nWHERE u.user_id = ${id};`,
        attributes: user ? { ...user } : {},
      };
    } else {
      return {
        entity: 'COMMENT (Weak Entity)',
        primaryKey: 'COMPOSITE: (media_id, comment_no)',
        foreignKeys: [
          'media_id -> media_item(media_id) [ON DELETE CASCADE]',
          'user_id -> users(user_id)',
        ],
        relationships: ['Weak entity dependent on media_item existence'],
        sampleSQL: `SELECT c.*, u.full_name\nFROM comment c\nJOIN users u ON c.user_id = u.user_id\nWHERE c.media_id = ${id};`,
        attributes: {},
      };
    }
  }
}

export const dbService = new RelationalDatabaseService();
