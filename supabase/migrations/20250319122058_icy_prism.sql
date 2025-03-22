/*
  # Initial Schema Setup for Certification Portal

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `created_at` (timestamp)
      - `created_by` (uuid, references auth.users)

    - `participants`
      - `id` (uuid, primary key)
      - `email` (text)
      - `full_name` (text)
      - `organization` (text)
      - `created_at` (timestamp)

    - `certificates`
      - `id` (uuid, primary key)
      - `participant_id` (uuid, references participants)
      - `event_id` (uuid, references events)
      - `certificate_number` (text, unique)
      - `issue_date` (timestamp)
      - `template_data` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users (admins)
    - Add policies for public certificate verification
*/

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create participants table
CREATE TABLE participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text NOT NULL,
  organization text,
  created_at timestamptz DEFAULT now()
);

-- Create certificates table
CREATE TABLE certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES participants(id),
  event_id uuid REFERENCES events(id),
  certificate_number text UNIQUE NOT NULL,
  issue_date timestamptz DEFAULT now(),
  template_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Allow public read access to events"
  ON events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage events"
  ON events FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Policies for participants
CREATE POLICY "Allow authenticated users to manage participants"
  ON participants FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Policies for certificates
CREATE POLICY "Allow public read access to certificates"
  ON certificates FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage certificates"
  ON certificates FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_certificates_participant_id ON certificates(participant_id);
CREATE INDEX idx_certificates_event_id ON certificates(event_id);
CREATE INDEX idx_certificates_certificate_number ON certificates(certificate_number);
CREATE INDEX idx_participants_email ON participants(email);