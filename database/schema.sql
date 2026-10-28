-- =====================================================================
-- CAMPUSCANVA: A LIVING DIGITAL ARCHIVE OF CAMPUS LIFE
-- DBMS Lab Project | Netaji Subhas University of Technology (NSUT)
-- Faculty Guide: Prof. Vivek Mehta
-- Team: Kavya Gupta, Rohan Kumar, Ansh Dhillon, Lavanya Jain
-- Target RDBMS: MySQL 8.0+ / MariaDB (XAMPP Compatible)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS campuscanva_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campuscanva_db;

-- Drop tables in reverse order of foreign key dependencies
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS reaction;
DROP TABLE IF EXISTS media_tag;
DROP TABLE IF EXISTS video;
DROP TABLE IF EXISTS photo;
DROP TABLE IF EXISTS media_item;
DROP TABLE IF EXISTS space_member;
DROP TABLE IF EXISTS memory_space;
DROP TABLE IF EXISTS campus_spot;
DROP TABLE IF EXISTS faculty;
DROP TABLE IF EXISTS alumni;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS users;

-- ---------------------------------------------------------------------
-- 1. BASE USERS ENTITY
-- ---------------------------------------------------------------------
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NULL,
    user_type ENUM('STUDENT', 'ALUMNI', 'FACULTY') NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(2048) NULL,
    bio TEXT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. GENERALIZATION / SPECIALIZATION (ISA) SUB-ENTITIES
-- ---------------------------------------------------------------------

-- Subtype 1: STUDENT
CREATE TABLE student (
    user_id INT PRIMARY KEY,
    roll_number VARCHAR(30) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    batch_year SMALLINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Subtype 2: ALUMNI
CREATE TABLE alumni (
    user_id INT PRIMARY KEY,
    graduation_year SMALLINT NOT NULL,
    current_company VARCHAR(150) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Subtype 3: FACULTY
CREATE TABLE faculty (
    user_id INT PRIMARY KEY,
    employee_no VARCHAR(30) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. CAMPUS SPOT (Recognizable NSUT geographical landmarks)
-- ---------------------------------------------------------------------
CREATE TABLE campus_spot (
    spot_id INT AUTO_INCREMENT PRIMARY KEY,
    spot_name VARCHAR(120) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    cover_url VARCHAR(2048) NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. MEMORY SPACE (Collaborative unit for fests, batches, clubs)
-- ---------------------------------------------------------------------
CREATE TABLE memory_space (
    space_id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    spot_id INT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    space_type ENUM('Event', 'Batch', 'Club', 'Trip', 'General') NOT NULL,
    cover_url VARCHAR(2048) NULL,
    is_time_locked BOOLEAN DEFAULT FALSE,
    unlock_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (spot_id) REFERENCES campus_spot(spot_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_timelock CHECK (
        (is_time_locked = FALSE) OR 
        (is_time_locked = TRUE AND unlock_date IS NOT NULL)
    )
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. SPACE MEMBERSHIP (M:N Relationship between USERS & MEMORY_SPACE)
-- ---------------------------------------------------------------------
CREATE TABLE space_member (
    space_id INT NOT NULL,
    user_id INT NOT NULL,
    role_type ENUM('Admin', 'Contributor', 'Viewer') DEFAULT 'Contributor',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (space_id, user_id),
    FOREIGN KEY (space_id) REFERENCES memory_space(space_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. MEDIA ITEM (Base entity for uploaded college memories)
-- ---------------------------------------------------------------------
CREATE TABLE media_item (
    media_id INT AUTO_INCREMENT PRIMARY KEY,
    space_id INT NOT NULL,
    uploader_id INT NOT NULL,
    media_url VARCHAR(2048) NOT NULL,
    media_type ENUM('PHOTO', 'VIDEO') NOT NULL,
    caption TEXT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (space_id) REFERENCES memory_space(space_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (uploader_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. MEDIA SPECIALIZATION (ISA)
-- ---------------------------------------------------------------------
CREATE TABLE photo (
    media_id INT PRIMARY KEY,
    width INT NULL,
    height INT NULL,
    FOREIGN KEY (media_id) REFERENCES media_item(media_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE video (
    media_id INT PRIMARY KEY,
    duration_seconds INT NULL,
    FOREIGN KEY (media_id) REFERENCES media_item(media_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8. MEDIA TAG (M:N Tagged people inside media)
-- ---------------------------------------------------------------------
CREATE TABLE media_tag (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    media_id INT NOT NULL,
    tagged_user_id INT NOT NULL,
    tagged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_media_user (media_id, tagged_user_id),
    FOREIGN KEY (media_id) REFERENCES media_item(media_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tagged_user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 9. REACTIONS
-- ---------------------------------------------------------------------
CREATE TABLE reaction (
    reaction_id INT AUTO_INCREMENT PRIMARY KEY,
    media_id INT NOT NULL,
    user_id INT NOT NULL,
    reaction_type ENUM('Like', 'Heart', 'Nostalgic', 'Laugh') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_reaction (media_id, user_id, reaction_type),
    FOREIGN KEY (media_id) REFERENCES media_item(media_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 10. COMMENT (WEAK ENTITY: Borrowed PK media_id + Partial Key comment_no)
-- ---------------------------------------------------------------------
CREATE TABLE comment (
    media_id INT NOT NULL,
    comment_no INT NOT NULL,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (media_id, comment_no),
    FOREIGN KEY (media_id) REFERENCES media_item(media_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 11. TRIGGERS FOR LAB VIVA DEMONSTRATION
-- ---------------------------------------------------------------------

-- Trigger 1: Auto-generate Weak Entity comment_no
DELIMITER //
CREATE TRIGGER trg_before_insert_comment
BEFORE INSERT ON comment
FOR EACH ROW
BEGIN
    DECLARE next_no INT;
    SELECT COALESCE(MAX(comment_no), 0) + 1 INTO next_no
    FROM comment
    WHERE media_id = NEW.media_id;
    SET NEW.comment_no = next_no;
END //
DELIMITER ;

-- Trigger 2: Auto-add creator as Admin in space_member
DELIMITER //
CREATE TRIGGER trg_after_insert_space
AFTER INSERT ON memory_space
FOR EACH ROW
BEGIN
    INSERT INTO space_member (space_id, user_id, role_type)
    VALUES (NEW.space_id, NEW.creator_id, 'Admin');
END //
DELIMITER ;

-- ---------------------------------------------------------------------
-- 12. ADVANCED VIEWS FOR VIVA PRESENTATION
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_space_analytics AS
SELECT 
    ms.space_id,
    ms.title,
    ms.space_type,
    cs.spot_name,
    u.full_name AS creator_name,
    COUNT(DISTINCT mi.media_id) AS total_media,
    COUNT(DISTINCT sm.user_id) AS total_members,
    ms.is_time_locked,
    ms.unlock_date,
    CASE 
        WHEN ms.is_time_locked = 1 AND ms.unlock_date > NOW() THEN 'LOCKED'
        ELSE 'ACCESSIBLE'
    END AS vault_status
FROM memory_space ms
JOIN users u ON ms.creator_id = u.user_id
LEFT JOIN campus_spot cs ON ms.spot_id = cs.spot_id
LEFT JOIN media_item mi ON ms.space_id = mi.space_id
LEFT JOIN space_member sm ON ms.space_id = sm.space_id
GROUP BY ms.space_id;
