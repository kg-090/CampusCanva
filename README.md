# 🏛️ CampusCanva — A Living Digital Archive of Campus Life
**DBMS Lab Project | Netaji Subhas University of Technology (NSUT), Delhi**  
**Faculty Guide:** Prof. Vivek Mehta (Dept. of CSE)  
**Team Members:**  
- **Kavya Gupta** (2025UCS1583) — Database Design & Schema Architecture  
- **Rohan Kumar** (2025UCS1587) — Relational Queries & Media Subsystems  
- **Ansh Dhillon** (2025UCS1589) — UI/UX Lead & Dashboard Feed  
- **Lavanya Jain** (2025UCS1610) — Interactive Lightbox, Tagging & Time Capsules  

---

## 🎯 Project Overview & Motivation

College life generates a high volume of digital memories across fests (Moksha), hackathons (Innovision), societies (ARES Robotics), trips, and day-to-day hangouts. However, these memories usually remain scattered across WhatsApp groups, Google Drives, and personal camera rolls, losing their **shared context**:
- *Who was tagged in this memory?*
- *Which specific campus spot was this taken at (Central Lawn, Admin Block, Nescafe)?*
- *What was the story or reaction behind the event?*

**CampusCanva** solves this by establishing structured, collaborative **Memory Spaces** integrated with campus landmark context, role-based memberships (`Admin`, `Contributor`, `Viewer`), social interactions (weak-entity comments, reactions), and **Time Capsules** (time-locked vaults that automatically reveal content on a future date).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ or v20+
- **npm** v9+

### 2. Installation & Run
Inside the `campuscanva` folder:
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 💎 Features & Highlights

1. **Welcome Landing & 1-Click Evaluator Quick Access**:
   - Evaluator / Viva Demo bar allows entering the application in 1 click as **Student (Kavya)**, **Faculty (Prof. Vivek Mehta)**, or **Alumni (Aman Verma)** without tedious registration.
2. **Main Dashboard**:
   - Live statistics calculated directly from the relational database state (Total Spaces, Photos & Videos, Community Members, Upcoming Time Capsules).
   - Featured memory spaces, recent media feed, and popular campus spots.
3. **Explore Memories**:
   - Real-time search across titles, descriptions, and captions.
   - Filter by **Campus Spot** (*Admin Block, Central Lawn, Amul Parlour, Nescafe, Auditorium, Library*).
   - Filter by **Space Type** (*Event, Batch, Club, Trip, General*).
   - Filter by **Creator** and sort by Newest / Oldest / Popular.
   - Toggle between **Memory Spaces** and **All Media** views.
4. **Memory Space Details**:
   - Cover photograph, landmark spot association, member count, and creation date.
   - Role-based permissions (`Admin`, `Contributor`, `Viewer`).
   - Tabs: *Memories*, *Members (with role badges)*, and *About & Relational Schema*.
5. **Interactive Media Lightbox**:
   - High-resolution photo viewer and HTML5 video player.
   - Reaction bar: Like 👍, Heart ❤️, Nostalgic 💭, Laugh 😂 with optimistic toggle and duplicate prevention.
   - Weak Entity **Comments Thread**: Displays `comment_no` (partial discriminator) + user info + timestamp.
   - Tagged Users pills.
6. **Time Capsules & Live Countdowns**:
   - Real-time ticking countdown timers in Days : Hours : Minutes : Seconds.
   - Frosted glass vault effect for locked capsules ("This memory is waiting for its moment.").
   - Celebratory confetti animation upon opening unlocked capsules.
7. **Campus Spots Directory**:
   - Dedicated showcase of NSUT locations with space and photo counts.
8. **Interactive DBMS Schema Inspector (Evaluation Mode)**:
   - Click the **"Demo Mode"** toggle or **"Inspect SQL Tuple"** button anywhere in the app to open the slide-over drawer.
   - Shows the active entity name, primary key constraints, foreign key referential integrity rules, ER cardinalities, and the exact corresponding SQL query!

---

## 🗄️ Relational Database Schema & DBMS Concepts

CampusCanva was engineered strictly according to Relational Database Management principles:

```
                            ┌────────────────┐
                            │  CAMPUS_SPOT   │
                            └───────┬────────┘
                                    │ 0..1 (associated with)
                                    ▼ 0..N
┌────────────┐ creates 1:N  ┌────────────────┐ 1       N ┌────────────────┐
│   USERS    │─────────────>│  MEMORY_SPACE  │──────────>│   MEDIA_ITEM   │
└─────┬──────┘              └───────┬────────┘ contains  └───────┬────────┘
      │                             │ 1                          │ 1
      │                             ▼ M                          ▼ N (weak entity)
      │                     ┌────────────────┐           ┌────────────────┐
      │                     │  SPACE_MEMBER  │           │    COMMENT     │
      │                     └────────────────┘           │ (media_id,     │
      │                                                  │  comment_no)   │
      │ ISA Specialization                               └────────────────┘
      ├───────────────┬───────────────┐
      ▼               ▼               ▼
┌───────────┐   ┌───────────┐   ┌───────────┐
│  STUDENT  │   │  ALUMNI   │   │  FACULTY  │
└───────────┘   └───────────┘   └───────────┘
```

### 1. Generalization / Specialization (ISA Hierarchy)
- **Table-per-Subclass Strategy**:
  - `users` (Superclass): `user_id (PK)`, `full_name`, `email (UNIQUE)`, `user_type`, `password_hash`, `joined_at`
  - `student` (Subclass): `user_id (PK & FK)`, `roll_number (UNIQUE)`, `department`, `batch_year`
  - `alumni` (Subclass): `user_id (PK & FK)`, `graduation_year`, `current_company`
  - `faculty` (Subclass): `user_id (PK & FK)`, `employee_no (UNIQUE)`, `department`, `designation`
  - `photo` (Subclass of `media_item`): `media_id (PK & FK)`, `width`, `height`
  - `video` (Subclass of `media_item`): `media_id (PK & FK)`, `duration_seconds`

### 2. Weak Entity Modeling: `comment`
- A comment has no independent existence without its parent `media_item`.
- **Composite Primary Key**: `(media_id, comment_no)`
  - `media_id`: Foreign key referencing `media_item(media_id) ON DELETE CASCADE`
  - `comment_no`: Partial key / discriminator (auto-calculated per media item)

### 3. Many-to-Many (M:N) Relationships
- `space_member`: Connects `memory_space` and `users` with attribute `role_type ENUM('Admin', 'Contributor', 'Viewer')`.
- `media_tag`: Connects `media_item` and `users` with attribute `tagged_at`.
- `reaction`: Connects `media_item` and `users` with `reaction_type`.

### 4. Integrity Constraints
- `CHECK ((is_time_locked = FALSE) OR (is_time_locked = TRUE AND unlock_date IS NOT NULL))`
- `ON DELETE CASCADE` across all child relationships ensuring zero orphaned records.

---

## 🔌 Connecting to Node.js + Express + MySQL

The frontend contains a clean, decoupled service layer in `src/services/api.ts`.

To switch from the simulated mock database to your live Express backend:
1. Open `src/services/api.ts`
2. Change `const USE_MOCK_API = true;` to `const USE_MOCK_API = false;`
3. Set `const BASE_URL = 'http://localhost:5000/api';`

All service functions will immediately dispatch real HTTP `fetch` requests to your Express REST endpoints!

---

## 🎓 DBMS Lab Viva Q&A Cheat Sheet

| Question | Model Viva Answer |
| :--- | :--- |
| **Q1: Why is `COMMENT` modeled as a Weak Entity?** | *"Sir, comments cannot exist without a media item. We identify each comment by borrowing the owner's primary key `media_id` combined with a local partial discriminator `comment_no`. If a photo is deleted, its comments cascade-delete automatically."* |
| **Q2: How did you implement Generalization / Specialization?** | *"We adopted the **Table-per-Subclass** mapping. `users` holds shared attributes (`user_id`, `email`, `full_name`), while `student`, `alumni`, and `faculty` share `user_id` as both Primary Key and Foreign Key. This avoids NULL attributes and achieves clean 3NF."* |
| **Q3: What Normal Form is your schema in?** | *"The schema satisfies **BCNF**. Every relation is in 1NF (atomic attributes), 2NF (no partial dependencies on composite keys), 3NF (no transitive dependencies), and in all functional dependencies $X \rightarrow Y$, $X$ is a superkey."* |
| **Q4: How does the Time Capsule work at the database level?** | *"We enforce a `CHECK` constraint ensuring an `unlock_date` is supplied whenever `is_time_locked = TRUE`. When queried, an SQL `CASE` expression or `VIEW` determines whether tuples should be accessible or gated behind the lock status."* |

---

## 📁 Project Structure

```
campuscanva/
├── src/
│   ├── components/
│   │   ├── cards/             # SpaceCard, TimeCapsuleCard
│   │   ├── common/            # DBMSInspectorDrawer, ConfirmDialog, ImageWithFallback
│   │   ├── modals/            # CreateSpaceModal, AddMemoryModal, MediaLightboxModal
│   │   └── navigation/        # Navbar, Sidebar
│   ├── context/               # AuthContext, ToastContext, DemoContext
│   ├── data/                  # seedData.ts (Realistic NSUT community data)
│   ├── layouts/               # AppLayout.tsx
│   ├── pages/                 # WelcomeLanding, Login, Register, Dashboard,
│   │                          # Explore, SpaceDetail, Spots, Capsules, Profile, Notifications
│   ├── services/              # dbService.ts (relational logic), api.ts (REST adapter)
│   ├── types/                 # TypeScript relational schema interfaces
│   ├── App.tsx
│   ├── index.css              # Tailwind CSS v4 styling
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
#   C a m p u s C a n v a  
 