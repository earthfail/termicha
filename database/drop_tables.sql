-- Delete the tables
DROP TRIGGER IF EXISTS remove_user_from_member_table ON app_user;
DROP TRIGGER IF EXISTS reassign_room_admin ON app_user;

DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS app_user;

DROP FUNCTION IF EXISTS remove_user_from_member_table;
DROP FUNCTION IF EXISTS reassign_room_admin;
