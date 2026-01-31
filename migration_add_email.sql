-- 1. Add email column to team_members
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS email text UNIQUE;

-- 2. Populate placeholder emails for existing staff
-- IMPORTANT: You should update one of these to match the email you actually used to Login/Sign Up.
-- For example: UPDATE team_members SET email = 'your.real.email@gmail.com' WHERE name = 'Dion';

UPDATE team_members SET email = 'kevin@keditech.com' WHERE name = 'Kevin';
UPDATE team_members SET email = 'dion@keditech.com' WHERE name = 'Dion';
UPDATE team_members SET email = 'indri@keditech.com' WHERE name = 'Indri';
UPDATE team_members SET email = 'iqbal@keditech.com' WHERE name = 'Iqbal';
UPDATE team_members SET email = 'syahrun@keditech.com' WHERE name = 'Syahrun';

-- 3. Verify
SELECT * FROM team_members;
