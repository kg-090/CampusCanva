// Database Relational Schema Types mirroring MySQL Relational Tables

export type UserType = 'STUDENT' | 'ALUMNI' | 'FACULTY';

export interface User {
  user_id: number;
  full_name: string;
  email: string;
  phone?: string;
  user_type: UserType;
  password_hash: string;
  avatar_url: string;
  bio?: string;
  joined_at: string;
}

// Specialization: Student ISA User
export interface Student {
  user_id: number; // PK & FK -> users(user_id)
  roll_number: string;
  department: string;
  batch_year: number;
}

// Specialization: Alumni ISA User
export interface Alumni {
  user_id: number; // PK & FK -> users(user_id)
  graduation_year: number;
  current_company: string;
}

// Specialization: Faculty ISA User
export interface Faculty {
  user_id: number; // PK & FK -> users(user_id)
  employee_no: string;
  department: string;
  designation: string;
}

// Merged User Profile for Frontend Presentation
export type FullUserProfile = User & {
  student?: Student;
  alumni?: Alumni;
  faculty?: Faculty;
};

export interface CampusSpot {
  spot_id: number;
  spot_name: string;
  description: string;
  cover_url: string;
}

export type SpaceType = 'Event' | 'Batch' | 'Club' | 'Trip' | 'General';
export type MemberRole = 'Admin' | 'Contributor' | 'Viewer';

export interface MemorySpace {
  space_id: number;
  creator_id: number; // FK -> users(user_id)
  spot_id: number | null; // FK -> campus_spot(spot_id)
  title: string;
  description: string;
  space_type: SpaceType;
  cover_url: string;
  is_time_locked: boolean;
  unlock_date: string | null;
  created_at: string;
  updated_at: string;
}

// M:N Relationship table between MemorySpace and User with role
export interface SpaceMember {
  space_id: number; // PK & FK -> memory_space
  user_id: number;  // PK & FK -> users
  role_type: MemberRole;
  joined_at: string;
}

export type MediaType = 'PHOTO' | 'VIDEO';

export interface MediaItem {
  media_id: number;
  space_id: number; // FK -> memory_space
  uploader_id: number; // FK -> users
  media_url: string;
  media_type: MediaType;
  caption: string;
  uploaded_at: string;
}

// Specialization: Photo ISA MediaItem
export interface Photo {
  media_id: number; // PK & FK -> media_item
  width?: number;
  height?: number;
}

// Specialization: Video ISA MediaItem
export interface Video {
  media_id: number; // PK & FK -> media_item
  duration_seconds?: number;
}

// M:N Tagged Users in Media
export interface MediaTag {
  tag_id: number;
  media_id: number; // FK -> media_item
  tagged_user_id: number; // FK -> users
  tagged_at: string;
}

export type ReactionType = 'Like' | 'Heart' | 'Nostalgic' | 'Laugh';

export interface Reaction {
  reaction_id: number;
  media_id: number; // FK -> media_item
  user_id: number; // FK -> users
  reaction_type: ReactionType;
  created_at: string;
}

// WEAK ENTITY: Identified by owner key (media_id) + partial key (comment_no)
export interface Comment {
  media_id: number; // PK & FK -> media_item
  comment_no: number; // PK (partial discriminator)
  user_id: number; // FK -> users
  comment_text: string;
  created_at: string;
}

export interface NotificationItem {
  notification_id: number;
  user_id: number; // recipient
  sender_id: number;
  title: string;
  message: string;
  type: 'reaction' | 'comment' | 'member' | 'capsule' | 'tag';
  target_url?: string;
  is_read: boolean;
  created_at: string;
}

// DBMS Inspection Meta for Evaluation Mode
export interface DBMSInspectData {
  entity: string;
  primaryKey: string;
  foreignKeys: string[];
  relationships: string[];
  sampleSQL: string;
  attributes: Record<string, unknown>;
}
