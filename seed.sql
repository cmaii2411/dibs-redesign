-- Insert Libraries
INSERT INTO "Library" (name, open_time, close_time) VALUES
('Baillieu',  '08:00', '22:00'),
('ERC',       '08:00', '22:00'),
('Giblin',    '08:00', '18:00'),
('1888',      '08:00', '22:00'),
('Southbank', '09:00', '18:00'),
('Law',       '08:00', '22:00'),
('MSD',       '08:00', '20:00')
ON CONFLICT (name) DO NOTHING;

-- Insert Users (Short names)
INSERT INTO "User" (email) VALUES 
('tom@student.unimelb.edu.au'),
('john@student.unimelb.edu.au'),
('mai@student.unimelb.edu.au'),
('chi@student.unimelb.edu.au'),
('sam@unimelb.edu.au'),
('ali@unimelb.edu.au')
ON CONFLICT (email) DO NOTHING;

-- Insert Rooms with full metadata (Extended List)
INSERT INTO "Room" (room_code, name, floor, capacity, has_projector, has_whiteboard, is_accessible, library_id) VALUES 
-- BAILLIEU (Library ID 1)
('PAR-177-G-P01', 'Pod 01', 'G', 1, false, false, true, 1),
('PAR-177-1-G17', 'Project Room 5', '1', 8, true, true, true, 1),
('PAR-177-2-212', 'Quiet Study 212', '2', 1, false, false, true, 1),
('PAR-177-3-305', 'Large Group Hub', '3', 12, true, true, false, 1),

-- ERC (Library ID 2)
('PAR-171-G-G05', 'Quick Meet G05', 'G', 2, false, true, true, 2),
('PAR-171-2-201', 'Group Room 201', '2', 6, true, true, true, 2),
('PAR-171-3-310', 'Deep Work 310', '3', 1, false, false, true, 2),

-- GIBLIN EUNSON (Library ID 3)
('PAR-105-1-102', 'Finance Lab A', '1', 10, true, false, true, 3),
('PAR-105-2-205', 'Consultation Rm', '2', 4, false, true, true, 3),

-- 1888 BUILDING (Library ID 4)
('PAR-199-G-G10', 'Grad Pod 1', 'G', 1, false, false, true, 4),
('PAR-199-1-105', 'The Loft', '1', 6, true, true, false, 4),

-- SOUTHBANK (Library ID 5)
('PAR-VCA-G-P1', 'Piano Room 1', 'G', 2, false, false, true, 5),
('PAR-VCA-1-102', 'Ensemble Room', '1', 15, true, true, true, 5),

-- LAW (Library ID 6)
('PAR-106-4-401', 'Moot Court Prep', '4', 8, true, true, true, 6),
('PAR-106-5-512', 'Law Pod 12', '5', 1, false, false, true, 6),

-- MSD / ARCHITECTURE (Library ID 7)
('PAR-133-G-M1', 'Maker Table 1', 'G', 4, false, true, true, 7),
('PAR-133-3-M30', 'Design Studio', '3', 20, true, true, false, 7),
('PAR-133-2-215', 'VR Lab', '2', 5, true, false, true, 7)

ON CONFLICT (room_code) DO NOTHING;
-- Add some initial bookings 
-- 4. Add initial bookings using Room Codes
-- Insert fresh bookings with names
INSERT INTO "Booking" (booking_name, start_time, end_time, user_id, room_id) VALUES
(
  'SWEN Project Sprint',
  '2026-04-07 10:00:00+11',
  '2026-04-07 12:00:00+11',
  (SELECT id FROM "User" WHERE email = 'tom@student.unimelb.edu.au'),
  (SELECT id FROM "Room" WHERE room_code = 'PAR-177-1-G17')
),
(
  'Calculus Revision',
  '2026-04-07 14:00:00+11',
  '2026-04-07 16:00:00+11',
  (SELECT id FROM "User" WHERE email = 'john@student.unimelb.edu.au'),
  (SELECT id FROM "Room" WHERE room_code = 'PAR-171-G-G05')
),
(
  'Internship Sync',
  '2026-04-08 09:00:00+11',
  '2026-04-08 11:00:00+11',
  (SELECT id FROM "User" WHERE email = 'mai@student.unimelb.edu.au'),
  (SELECT id FROM "Room" WHERE room_code = 'PAR-106-4-401')
);