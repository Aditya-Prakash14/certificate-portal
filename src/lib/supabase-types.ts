export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          name: string
          description: string | null
          start_date: string
          end_date: string
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          start_date: string
          end_date: string
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string
          created_at?: string
          created_by?: string
        }
      }
      participants: {
        Row: {
          id: string
          email: string
          full_name: string
          organization: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          organization?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          organization?: string | null
          created_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          participant_id: string
          event_id: string
          certificate_number: string
          issue_date: string
          template_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          event_id: string
          certificate_number: string
          issue_date?: string
          template_data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          event_id?: string
          certificate_number?: string
          issue_date?: string
          template_data?: Json
          created_at?: string
        }
      }
    }
  }
}