-- Create Tables
CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "Library" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) UNIQUE NOT NULL,
  "open_time" TIME NOT NULL DEFAULT '08:00',
  "close_time" TIME NOT NULL DEFAULT '22:00'
);

CREATE TABLE "Room" (
  "id" SERIAL PRIMARY KEY,
  "room_code" VARCHAR(50) UNIQUE NOT NULL, -- The long PAR-177... format
  "name" VARCHAR(100) NOT NULL,
  "floor" VARCHAR(5) NOT NULL,             -- 'G', '1', '2', etc.
  "capacity" INT NOT NULL DEFAULT 1,
  "has_projector" BOOLEAN DEFAULT FALSE,
  "has_whiteboard" BOOLEAN DEFAULT FALSE,
  "is_accessible" BOOLEAN DEFAULT TRUE,
  "library_id" INT REFERENCES "Library"("id")
);

CREATE TABLE "Booking" (
  "id" SERIAL PRIMARY KEY,
  "booking_name" VARCHAR(100) DEFAULT 'Study Session',
  "start_time" TIMESTAMPTZ NOT NULL, 
  "end_time" TIMESTAMPTZ NOT NULL,
  "user_id" INT NOT NULL REFERENCES "User"("id"),
  "room_id" INT NOT NULL REFERENCES "Room"("id")
);

ALTER TABLE "Room" ADD CONSTRAINT unique_room_per_library UNIQUE (name, library_id);