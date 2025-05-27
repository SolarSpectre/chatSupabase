import { createClient } from '@supabase/supabase-js'

const supabase_url = 'https://emdygoofltkbjibzftai.supabase.co'
const anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtZHlnb29mbHRrYmppYnpmdGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTcxNzcsImV4cCI6MjA2Mzg3MzE3N30.5XOaFp3E4HWTzQtYebxMxRPvUq8O6NordYYVPJ42yGM'

export const supabase = createClient(supabase_url, anon_key)