-- Add unique constraint on participants email column to support ON CONFLICT operations
ALTER TABLE participants
ADD CONSTRAINT unique_email UNIQUE (email);

-- Appropriate comment explaining the migration
COMMENT ON CONSTRAINT unique_email ON participants IS 'Ensures participant emails are unique for proper upsert operations'; 