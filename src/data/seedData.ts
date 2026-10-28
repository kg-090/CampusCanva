import {
  User,
  Student,
  Alumni,
  Faculty,
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
} from '../types';

export const SEED_USERS: User[] = [
  {
    user_id: 1,
    full_name: 'Kavya Gupta',
    email: 'kavya.cse@nsut.ac.in',
    phone: '+91 98765 43210',
    user_type: 'STUDENT',
    password_hash: 'demo_hash_1',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: '2nd Year CSE undergrad @ NSUT | Database enthusiast & open-source builder.',
    joined_at: '2024-08-10 10:00:00',
  },
  {
    user_id: 2,
    full_name: 'Rohan Kumar',
    email: 'rohan.cse@nsut.ac.in',
    phone: '+91 98765 43211',
    user_type: 'STUDENT',
    password_hash: 'demo_hash_2',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    bio: 'Backend nerd & music lover. Capturing NSUT campus life one frame at a time.',
    joined_at: '2024-08-11 11:30:00',
  },
  {
    user_id: 3,
    full_name: 'Ansh Dhillon',
    email: 'ansh.cse@nsut.ac.in',
    phone: '+91 98765 43212',
    user_type: 'STUDENT',
    password_hash: 'demo_hash_3',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Building intuitive user interfaces. Photography enthusiast.',
    joined_at: '2024-08-12 14:15:00',
  },
  {
    user_id: 4,
    full_name: 'Lavanya Jain',
    email: 'lavanya.cse@nsut.ac.in',
    phone: '+91 98765 43213',
    user_type: 'STUDENT',
    password_hash: 'demo_hash_4',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    bio: 'Designing digital spaces & documenting college fests.',
    joined_at: '2024-08-14 09:20:00',
  },
  {
    user_id: 5,
    full_name: 'Prof. Vivek Mehta',
    email: 'vivek.mehta@nsut.ac.in',
    phone: '+91 98111 22334',
    user_type: 'FACULTY',
    password_hash: 'demo_hash_5',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    bio: 'Assistant Professor, Department of Computer Science & Engineering, NSUT.',
    joined_at: '2022-01-15 09:00:00',
  },
  {
    user_id: 6,
    full_name: 'Dr. Geeta Sikka',
    email: 'geeta.sikka@nsut.ac.in',
    phone: '+91 98222 33445',
    user_type: 'FACULTY',
    password_hash: 'demo_hash_6',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    bio: 'Professor & Head, Software Engineering and DBMS Research Group.',
    joined_at: '2020-07-20 10:00:00',
  },
  {
    user_id: 7,
    full_name: 'Aman Verma',
    email: 'aman.alumni@nsut.ac.in',
    phone: '+91 99999 11223',
    user_type: 'ALUMNI',
    password_hash: 'demo_hash_7',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    bio: 'NSUT CSE Class of 2023 | Software Engineer @ Google India | Still missing Nescafe maggi.',
    joined_at: '2019-08-01 08:00:00',
  },
  {
    user_id: 8,
    full_name: 'Tanya Roy',
    email: 'tanya.alumni@nsut.ac.in',
    phone: '+91 99888 77665',
    user_type: 'ALUMNI',
    password_hash: 'demo_hash_8',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    bio: 'NSUT IT Class of 2022 | Product Designer @ Microsoft | Former Design Head, Moksha.',
    joined_at: '2018-08-01 08:00:00',
  },
];

export const SEED_STUDENTS: Student[] = [
  { user_id: 1, roll_number: '2025UCS1583', department: 'Computer Science & Engineering', batch_year: 2025 },
  { user_id: 2, roll_number: '2025UCS1587', department: 'Computer Science & Engineering', batch_year: 2025 },
  { user_id: 3, roll_number: '2025UCS1589', department: 'Computer Science & Engineering', batch_year: 2025 },
  { user_id: 4, roll_number: '2025UCS1610', department: 'Computer Science & Engineering', batch_year: 2025 },
];

export const SEED_ALUMNI: Alumni[] = [
  { user_id: 7, graduation_year: 2023, current_company: 'Google' },
  { user_id: 8, graduation_year: 2022, current_company: 'Microsoft' },
];

export const SEED_FACULTY: Faculty[] = [
  { user_id: 5, employee_no: 'FAC-CSE-104', department: 'Computer Science & Engineering', designation: 'Assistant Professor' },
  { user_id: 6, employee_no: 'FAC-IT-089', department: 'Information Technology', designation: 'Professor & Head' },
];

export const SEED_CAMPUS_SPOTS: CampusSpot[] = [
  {
    spot_id: 1,
    spot_name: 'Central Lawn',
    description: 'The green heart of NSUT campus where winter sunbathing, acoustic jam sessions, and Moksha mainstage crowds unite.',
    cover_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
  },
  {
    spot_id: 2,
    spot_name: 'Admin Block',
    description: 'The iconic red-brick administrative building with high colonnades, heritage steps, and official university ceremonies.',
    cover_url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
  },
  {
    spot_id: 3,
    spot_name: 'Nescafe',
    description: 'The legendary caffeine station behind the central library. Home of late-night iced tea, hot maggi, and pre-exam cramming.',
    cover_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
  },
  {
    spot_id: 4,
    spot_name: 'Auditorium',
    description: 'The 1200-seater main auditorium hosting international symposiums, stage dramatics (Aakanksha), and guest lectures.',
    cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  },
  {
    spot_id: 5,
    spot_name: 'Amul Parlour',
    description: 'The post-lunch gathering hub near the sports complex for ice cream sandwiches, cold coffee bottles, and squad hangouts.',
    cover_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  },
  {
    spot_id: 6,
    spot_name: 'Library',
    description: 'Three floors of air-conditioned silence, thesis archives, and private discussion cubicles for semester end sprints.',
    cover_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
  },
];

export const SEED_MEMORY_SPACES: MemorySpace[] = [
  {
    space_id: 1,
    creator_id: 1, // Kavya
    spot_id: 1, // Central Lawn
    title: 'Moksha 2025: Annual Cultural Fest',
    description: 'Three electrifying days of star nights, battle of the bands, street play competitions, and endless campus memories.',
    space_type: 'Event',
    cover_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
    is_time_locked: false,
    unlock_date: null,
    created_at: '2025-03-20 18:30:00',
    updated_at: '2025-03-25 12:00:00',
  },
  {
    space_id: 2,
    creator_id: 2, // Rohan
    spot_id: 4, // Auditorium
    title: 'Innovision Hackathon 2025',
    description: '36 hours of non-stop code, pizza boxes, energy drinks, and shipping real AI solutions with our college squads.',
    space_type: 'Event',
    cover_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
    is_time_locked: false,
    unlock_date: null,
    created_at: '2025-02-14 10:00:00',
    updated_at: '2025-02-16 18:00:00',
  },
  {
    space_id: 3,
    creator_id: 3, // Ansh
    spot_id: 2, // Admin Block
    title: 'CSE Batch of 2025 Chronicles',
    description: 'From 8:00 AM tutorial drowsiness in block 6 to our final lab submissions and group photographs.',
    space_type: 'Batch',
    cover_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    is_time_locked: false,
    unlock_date: null,
    created_at: '2024-09-01 10:00:00',
    updated_at: '2025-04-10 16:30:00',
  },
  {
    space_id: 4,
    creator_id: 4, // Lavanya
    spot_id: 1, // Central Lawn
    title: 'ARES Robotics Club Showcase',
    description: 'Designing autonomous rovers, testing drone flight paths, and triumphing at national robotics championships.',
    space_type: 'Club',
    cover_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
    is_time_locked: false,
    unlock_date: null,
    created_at: '2024-10-15 14:00:00',
    updated_at: '2025-01-20 11:00:00',
  },
  {
    space_id: 5,
    creator_id: 2, // Rohan
    spot_id: null,
    title: 'Old Manali Batch Trip 2024',
    description: 'Snowy ridges, midnight bonfire guitar sessions, cafe hopping, and a bus ride back we will never forget.',
    space_type: 'Trip',
    cover_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    is_time_locked: false,
    unlock_date: null,
    created_at: '2024-12-28 20:00:00',
    updated_at: '2025-01-05 15:00:00',
  },
  {
    space_id: 6,
    creator_id: 1, // Kavya
    spot_id: 3, // Nescafe
    title: 'Sunset Nescafe & Chai Stories',
    description: 'The sacred routine: hot cutting chai, debates about semester grades, placement prep, and life dreams.',
    space_type: 'General',
    cover_url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80',
    is_time_locked: false,
    unlock_date: null,
    created_at: '2024-11-05 17:30:00',
    updated_at: '2025-03-01 19:00:00',
  },
  // TIME CAPSULES
  {
    space_id: 7,
    creator_id: 1, // Kavya
    spot_id: 1, // Central Lawn
    title: 'Moksha 2027 Time Vault 🔒',
    description: 'Sealed predictions, candid voice notes, and secret batch messages to be automatically unveiled at our farewell week.',
    space_type: 'Event',
    cover_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    is_time_locked: true,
    unlock_date: '2027-04-15T18:00:00Z', // Future lock!
    created_at: '2025-04-01 12:00:00',
    updated_at: '2025-04-01 12:00:00',
  },
  {
    space_id: 8,
    creator_id: 3, // Ansh
    spot_id: 6, // Library
    title: 'Letter to our Final Year Selves 🔒',
    description: 'A sealed vault of hopes, career goals, and memories recorded by the batch of 2025 right before semester finals.',
    space_type: 'Batch',
    cover_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80',
    is_time_locked: true,
    unlock_date: '2026-12-31T23:59:59Z', // Future lock!
    created_at: '2025-04-10 10:00:00',
    updated_at: '2025-04-10 10:00:00',
  },
  {
    space_id: 9,
    creator_id: 7, // Aman (Alumni)
    spot_id: 2, // Admin Block
    title: 'Freshers 2023 Nostalgia Vault 🔓',
    description: 'A time capsule sealed on our first orientation day in 2023, now unlocked for alumni and juniors to browse!',
    space_type: 'Event',
    cover_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=80',
    is_time_locked: true,
    unlock_date: '2024-01-01T00:00:00Z', // Unlocked capsule!
    created_at: '2023-08-01 09:00:00',
    updated_at: '2024-01-01 00:00:00',
  },
];

export const SEED_SPACE_MEMBERS: SpaceMember[] = [
  // Space 1 (Moksha 2025)
  { space_id: 1, user_id: 1, role_type: 'Admin', joined_at: '2025-03-20 18:30:00' },
  { space_id: 1, user_id: 2, role_type: 'Contributor', joined_at: '2025-03-21 09:00:00' },
  { space_id: 1, user_id: 3, role_type: 'Contributor', joined_at: '2025-03-21 10:00:00' },
  { space_id: 1, user_id: 4, role_type: 'Admin', joined_at: '2025-03-21 11:00:00' },
  { space_id: 1, user_id: 5, role_type: 'Viewer', joined_at: '2025-03-22 14:00:00' },
  { space_id: 1, user_id: 7, role_type: 'Viewer', joined_at: '2025-03-22 16:00:00' },

  // Space 2 (Innovision)
  { space_id: 2, user_id: 2, role_type: 'Admin', joined_at: '2025-02-14 10:00:00' },
  { space_id: 2, user_id: 1, role_type: 'Contributor', joined_at: '2025-02-14 11:00:00' },
  { space_id: 2, user_id: 3, role_type: 'Contributor', joined_at: '2025-02-14 12:00:00' },
  { space_id: 2, user_id: 5, role_type: 'Viewer', joined_at: '2025-02-15 10:00:00' },

  // Space 3 (CSE Batch)
  { space_id: 3, user_id: 3, role_type: 'Admin', joined_at: '2024-09-01 10:00:00' },
  { space_id: 3, user_id: 1, role_type: 'Contributor', joined_at: '2024-09-01 11:00:00' },
  { space_id: 3, user_id: 2, role_type: 'Contributor', joined_at: '2024-09-01 11:30:00' },
  { space_id: 3, user_id: 4, role_type: 'Contributor', joined_at: '2024-09-01 12:00:00' },
  { space_id: 3, user_id: 5, role_type: 'Viewer', joined_at: '2024-09-02 09:00:00' },

  // Space 4 (Robotics)
  { space_id: 4, user_id: 4, role_type: 'Admin', joined_at: '2024-10-15 14:00:00' },
  { space_id: 4, user_id: 1, role_type: 'Contributor', joined_at: '2024-10-16 10:00:00' },
  { space_id: 4, user_id: 3, role_type: 'Contributor', joined_at: '2024-10-16 11:00:00' },

  // Space 5 (Trip)
  { space_id: 5, user_id: 2, role_type: 'Admin', joined_at: '2024-12-28 20:00:00' },
  { space_id: 5, user_id: 1, role_type: 'Contributor', joined_at: '2024-12-28 21:00:00' },
  { space_id: 5, user_id: 3, role_type: 'Contributor', joined_at: '2024-12-28 21:30:00' },
  { space_id: 5, user_id: 4, role_type: 'Contributor', joined_at: '2024-12-28 22:00:00' },

  // Space 6 (Nescafe)
  { space_id: 6, user_id: 1, role_type: 'Admin', joined_at: '2024-11-05 17:30:00' },
  { space_id: 6, user_id: 2, role_type: 'Contributor', joined_at: '2024-11-06 10:00:00' },

  // Space 7 & 8 (Capsules)
  { space_id: 7, user_id: 1, role_type: 'Admin', joined_at: '2025-04-01 12:00:00' },
  { space_id: 7, user_id: 2, role_type: 'Contributor', joined_at: '2025-04-02 10:00:00' },
  { space_id: 8, user_id: 3, role_type: 'Admin', joined_at: '2025-04-10 10:00:00' },

  // Space 9 (Unlocked capsule)
  { space_id: 9, user_id: 7, role_type: 'Admin', joined_at: '2023-08-01 09:00:00' },
  { space_id: 9, user_id: 8, role_type: 'Contributor', joined_at: '2023-08-01 09:30:00' },
  { space_id: 9, user_id: 1, role_type: 'Viewer', joined_at: '2024-01-02 10:00:00' },
];

export const SEED_MEDIA_ITEMS: MediaItem[] = [
  {
    media_id: 1,
    space_id: 1,
    uploader_id: 1,
    media_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'EDM night at Moksha 2025! The bass dropping on the Central Lawn was pure magic. ✨',
    uploaded_at: '2025-03-21 23:45:00',
  },
  {
    media_id: 2,
    space_id: 1,
    uploader_id: 4,
    media_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'Street play finals (Aakanksha) in front of the fountain. Goosebumps throughout!',
    uploaded_at: '2025-03-22 14:10:00',
  },
  {
    media_id: 3,
    space_id: 1,
    uploader_id: 2,
    media_url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'Concert fireworks illuminating the entire sky over Admin Block. Unforgettable fest.',
    uploaded_at: '2025-03-23 22:30:00',
  },
  {
    media_id: 4,
    space_id: 2,
    uploader_id: 2,
    media_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'Hour 28 of Innovision: debugging our neural network pipeline on 4 cups of Nescafe coffee.',
    uploaded_at: '2025-02-15 04:30:00',
  },
  {
    media_id: 5,
    space_id: 2,
    uploader_id: 1,
    media_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'Winning 1st Runner Up prize at Innovision Hackathon! Team CampusCanva represented! 🏆',
    uploaded_at: '2025-02-16 17:00:00',
  },
  {
    media_id: 6,
    space_id: 3,
    uploader_id: 3,
    media_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'The legendary steps of Admin Block. 4 years summarized in one wide-angle frame.',
    uploaded_at: '2024-09-15 16:00:00',
  },
  {
    media_id: 7,
    space_id: 3,
    uploader_id: 4,
    media_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'Post DBMS Lab evaluation smile with Vivek Sir! Relational schemas finally conquered.',
    uploaded_at: '2025-04-05 13:15:00',
  },
  {
    media_id: 8,
    space_id: 4,
    uploader_id: 4,
    media_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'Rover testing session on the rough gravel track near Central Lawn. Ready for nationals!',
    uploaded_at: '2024-11-10 11:20:00',
  },
  {
    media_id: 9,
    space_id: 4,
    uploader_id: 3,
    media_url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'Robotics team solder marathon late Friday evening in the lab.',
    uploaded_at: '2024-11-20 19:40:00',
  },
  {
    media_id: 10,
    space_id: 5,
    uploader_id: 2,
    media_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'First snowfall in Solang Valley! The entire squad was freezing but ecstatic.',
    uploaded_at: '2024-12-30 08:30:00',
  },
  {
    media_id: 11,
    space_id: 5,
    uploader_id: 1,
    media_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'River crossing and cafe hopping in Old Manali. Core memory created.',
    uploaded_at: '2024-12-31 16:45:00',
  },
  {
    media_id: 12,
    space_id: 6,
    uploader_id: 1,
    media_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'That iconic evening golden hour light hitting the Nescafe benches. Best chai in West Delhi.',
    uploaded_at: '2024-11-18 17:15:00',
  },
  {
    media_id: 13,
    space_id: 6,
    uploader_id: 2,
    media_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'Maggi plates stacked 4 high during end-term revision week.',
    uploaded_at: '2024-11-25 21:00:00',
  },
  {
    media_id: 14,
    space_id: 1,
    uploader_id: 3,
    media_url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'Acoustic jam on the grass before the celebrity performance.',
    uploaded_at: '2025-03-22 17:00:00',
  },
  {
    media_id: 15,
    space_id: 3,
    uploader_id: 1,
    media_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'Guest lecture on Distributed Databases in Auditorium Hall B.',
    uploaded_at: '2025-01-18 11:30:00',
  },
  {
    media_id: 16,
    space_id: 9,
    uploader_id: 7,
    media_url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'Freshers orientation day batch photo! Looking at this 3 years later brings so many smiles. 🎓',
    uploaded_at: '2023-08-01 13:00:00',
  },
  {
    media_id: 17,
    space_id: 9,
    uploader_id: 8,
    media_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'Our first ever society pitch in the Student Activity Centre.',
    uploaded_at: '2023-08-10 15:30:00',
  },
  {
    media_id: 18,
    space_id: 2,
    uploader_id: 3,
    media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    media_type: 'VIDEO',
    caption: 'Final 10-second countdown before submitting our hackathon repository! 🚀',
    uploaded_at: '2025-02-16 11:59:00',
  },
  {
    media_id: 19,
    space_id: 1,
    uploader_id: 4,
    media_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'Moksha carnival lights glowing behind Central Lawn trees.',
    uploaded_at: '2025-03-22 20:00:00',
  },
  {
    media_id: 20,
    space_id: 5,
    uploader_id: 4,
    media_url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
    media_type: 'PHOTO',
    caption: 'Mountain peak sunrise hike at 5:30 AM. Worth every shivering step.',
    uploaded_at: '2024-12-31 06:15:00',
  },
];

export const SEED_PHOTOS: Photo[] = [
  { media_id: 1, width: 1920, height: 1080 },
  { media_id: 2, width: 1920, height: 1280 },
  { media_id: 3, width: 1920, height: 1080 },
  { media_id: 4, width: 1920, height: 1280 },
  { media_id: 5, width: 1920, height: 1080 },
  { media_id: 6, width: 1920, height: 1280 },
  { media_id: 7, width: 1920, height: 1280 },
  { media_id: 8, width: 1920, height: 1280 },
  { media_id: 9, width: 1920, height: 1080 },
  { media_id: 10, width: 1920, height: 1280 },
  { media_id: 11, width: 1920, height: 1280 },
  { media_id: 12, width: 1920, height: 1080 },
  { media_id: 13, width: 1920, height: 1280 },
  { media_id: 14, width: 1920, height: 1080 },
  { media_id: 15, width: 1920, height: 1280 },
  { media_id: 16, width: 1920, height: 1080 },
  { media_id: 17, width: 1920, height: 1280 },
  { media_id: 19, width: 1920, height: 1080 },
  { media_id: 20, width: 1920, height: 1280 },
];

export const SEED_VIDEOS: Video[] = [
  { media_id: 18, duration_seconds: 15 },
];

export const SEED_MEDIA_TAGS: MediaTag[] = [
  { tag_id: 1, media_id: 1, tagged_user_id: 2, tagged_at: '2025-03-21 23:50:00' },
  { tag_id: 2, media_id: 1, tagged_user_id: 3, tagged_at: '2025-03-21 23:50:00' },
  { tag_id: 3, media_id: 1, tagged_user_id: 4, tagged_at: '2025-03-21 23:50:00' },
  { tag_id: 4, media_id: 4, tagged_user_id: 1, tagged_at: '2025-02-15 04:35:00' },
  { tag_id: 5, media_id: 4, tagged_user_id: 3, tagged_at: '2025-02-15 04:35:00' },
  { tag_id: 6, media_id: 5, tagged_user_id: 2, tagged_at: '2025-02-16 17:05:00' },
  { tag_id: 7, media_id: 5, tagged_user_id: 3, tagged_at: '2025-02-16 17:05:00' },
  { tag_id: 8, media_id: 7, tagged_user_id: 1, tagged_at: '2025-04-05 13:20:00' },
  { tag_id: 9, media_id: 7, tagged_user_id: 2, tagged_at: '2025-04-05 13:20:00' },
  { tag_id: 10, media_id: 7, tagged_user_id: 3, tagged_at: '2025-04-05 13:20:00' },
  { tag_id: 11, media_id: 7, tagged_user_id: 5, tagged_at: '2025-04-05 13:20:00' }, // Tagged Vivek Sir
  { tag_id: 12, media_id: 10, tagged_user_id: 1, tagged_at: '2024-12-30 08:35:00' },
  { tag_id: 13, media_id: 10, tagged_user_id: 4, tagged_at: '2024-12-30 08:35:00' },
  { tag_id: 14, media_id: 16, tagged_user_id: 8, tagged_at: '2023-08-01 13:05:00' },
];

export const SEED_REACTIONS: Reaction[] = [
  { reaction_id: 1, media_id: 1, user_id: 2, reaction_type: 'Heart', created_at: '2025-03-21 23:55:00' },
  { reaction_id: 2, media_id: 1, user_id: 3, reaction_type: 'Like', created_at: '2025-03-22 00:05:00' },
  { reaction_id: 3, media_id: 1, user_id: 4, reaction_type: 'Nostalgic', created_at: '2025-03-22 01:10:00' },
  { reaction_id: 4, media_id: 4, user_id: 1, reaction_type: 'Laugh', created_at: '2025-02-15 05:00:00' },
  { reaction_id: 5, media_id: 4, user_id: 4, reaction_type: 'Heart', created_at: '2025-02-15 06:12:00' },
  { reaction_id: 6, media_id: 5, user_id: 1, reaction_type: 'Heart', created_at: '2025-02-16 17:10:00' },
  { reaction_id: 7, media_id: 5, user_id: 5, reaction_type: 'Like', created_at: '2025-02-16 18:30:00' }, // Sir liked it!
  { reaction_id: 8, media_id: 7, user_id: 2, reaction_type: 'Heart', created_at: '2025-04-05 13:30:00' },
  { reaction_id: 9, media_id: 7, user_id: 3, reaction_type: 'Nostalgic', created_at: '2025-04-05 14:00:00' },
  { reaction_id: 10, media_id: 7, user_id: 5, reaction_type: 'Heart', created_at: '2025-04-05 15:00:00' },
  { reaction_id: 11, media_id: 12, user_id: 7, reaction_type: 'Nostalgic', created_at: '2024-11-19 10:00:00' },
  { reaction_id: 12, media_id: 16, user_id: 1, reaction_type: 'Heart', created_at: '2024-01-02 11:00:00' },
];

// WEAK ENTITY COMMENT: Composite PK (media_id, comment_no)
export const SEED_COMMENTS: Comment[] = [
  {
    media_id: 1,
    comment_no: 1,
    user_id: 2,
    comment_text: 'Still haven’t recovered from this night! The crowd energy was unmatched 🔥',
    created_at: '2025-03-22 00:15:00',
  },
  {
    media_id: 1,
    comment_no: 2,
    user_id: 4,
    comment_text: 'Best Moksha edition so far! Our college truly comes alive in spring.',
    created_at: '2025-03-22 01:20:00',
  },
  {
    media_id: 4,
    comment_no: 1,
    user_id: 1,
    comment_text: 'Remember when the merge conflict happened at 3 AM? 😂 Glad we survived!',
    created_at: '2025-02-15 05:10:00',
  },
  {
    media_id: 5,
    comment_no: 1,
    user_id: 5, // Prof. Vivek Mehta
    comment_text: 'Well deserved team! Solid schema architecture and dedication shown.',
    created_at: '2025-02-16 18:45:00',
  },
  {
    media_id: 7,
    comment_no: 1,
    user_id: 3,
    comment_text: 'Vivek Sir’s normalization questions were tough but we aced the BCNF proofs! 🙌',
    created_at: '2025-04-05 14:10:00',
  },
  {
    media_id: 7,
    comment_no: 2,
    user_id: 5,
    comment_text: 'Great work team. Consistent effort always pays off in engineering.',
    created_at: '2025-04-05 15:20:00',
  },
  {
    media_id: 12,
    comment_no: 1,
    user_id: 7, // Aman (Alumni)
    comment_text: 'As an alumnus, seeing this makes me miss campus so deeply. Cherish every second guys!',
    created_at: '2024-11-19 10:15:00',
  },
  {
    media_id: 16,
    comment_no: 1,
    user_id: 8,
    comment_text: 'Time flies so quickly. Feels like just yesterday we stepped onto NSUT campus for the first time.',
    created_at: '2024-01-02 12:00:00',
  },
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    notification_id: 1,
    user_id: 1, // To Kavya
    sender_id: 5, // From Vivek Sir
    title: 'New Comment',
    message: 'Prof. Vivek Mehta commented on your Innovision Hackathon victory photo.',
    type: 'comment',
    target_url: '/spaces/2',
    is_read: false,
    created_at: '2025-02-16 18:45:00',
  },
  {
    notification_id: 2,
    user_id: 1,
    sender_id: 2,
    title: 'Reaction Received',
    message: 'Rohan Kumar reacted with ❤️ to your Moksha 2025 EDM night photo.',
    type: 'reaction',
    target_url: '/spaces/1',
    is_read: false,
    created_at: '2025-03-21 23:55:00',
  },
  {
    notification_id: 3,
    user_id: 1,
    sender_id: 4,
    title: 'Tagged in Memory',
    message: 'Lavanya Jain tagged you in "Post DBMS Lab evaluation smile".',
    type: 'tag',
    target_url: '/spaces/3',
    is_read: true,
    created_at: '2025-04-05 13:20:00',
  },
  {
    notification_id: 4,
    user_id: 1,
    sender_id: 7,
    title: 'Time Capsule Unlocked! 🔓',
    message: 'The "Freshers 2023 Nostalgia Vault" capsule is now open for browsing.',
    type: 'capsule',
    target_url: '/spaces/9',
    is_read: true,
    created_at: '2024-01-01 00:00:00',
  },
];
