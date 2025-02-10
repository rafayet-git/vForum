import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.DB_URL;
const API_KEY = import.meta.env.DB_API_KEY;

export const supabase = createClient(URL, API_KEY);