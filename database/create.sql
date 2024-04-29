CREATE TABLE app_user (
  user_id SERIAL PRIMARY KEY,  -- Auto-incrementing integer for unique ID
  username VARCHAR(255) NOT NULL UNIQUE,  -- Unique username for login
  password_hash VARCHAR(255) NOT NULL,  -- Securely hashed password
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE room (
  room_id SERIAL PRIMARY KEY,
  room_name VARCHAR(255) NOT NULL,  -- Descriptive room name
  admin_id INTEGER NOT NULL REFERENCES app_user(user_id),  -- Foreign key to user's ID
  is_protected BOOLEAN NOT NULL DEFAULT FALSE,  -- Room privacy setting (default public)
  password_hash VARCHAR(255) DEFAULT NULL,  -- Optional password for protected rooms
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Creation timestamp
  description TEXT  -- Optional room description
);



CREATE TABLE member (
  user_id INTEGER NOT NULL REFERENCES app_user(user_id),  -- Foreign key to user's ID
  room_id INTEGER NOT NULL REFERENCES room(room_id),  -- Foreign key to room's ID
  member_name VARCHAR(50) NOT NULL,  -- Display name within the room
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of user joining the room
  PRIMARY KEY (user_id, room_id),  -- Combined primary key
  UNIQUE (room_id, member_name)  -- Enforces unique display name within each room
);


-- Following lines could be executed only after tables creation


-- Function to remove a user from the member table
CREATE OR REPLACE FUNCTION remove_user_from_member_table()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM member WHERE user_id = OLD.id;
    RETURN OLD;
END;
$$;

-- Trigger to remove a user from the member table
CREATE TRIGGER remove_user_from_member_table
AFTER DELETE ON app_user
FOR EACH ROW EXECUTE FUNCTION remove_user_from_member_table();

-- Function to reassign room admin if the admin is deleted
CREATE OR REPLACE FUNCTION reassign_room_admin()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    new_admin_id INT;
BEGIN
    -- Find the oldest member 
    SELECT user_id INTO new_admin_id
    FROM member
    WHERE room_id IN (SELECT room_id FROM member WHERE user_id = OLD.id)
    ORDER BY joined_at ASC 
    LIMIT 1;
  
    IF new_admin_id IS NOT NULL THEN
        UPDATE room SET admin_id = new_admin_id WHERE admin_id = OLD.id;
    END IF;

    RETURN OLD;
END;
$$;

-- Trigger to reassign room admin if the admin is deleted
CREATE TRIGGER reassign_room_admin
AFTER DELETE ON app_user
FOR EACH ROW EXECUTE FUNCTION reassign_room_admin();
