-- Create indexes to enhance performance
CREATE INDEX ON app_user(username);
CREATE INDEX ON room(room_name);
CREATE INDEX ON member(user_id);
CREATE INDEX ON member(room_id);
