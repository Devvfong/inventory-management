// Initialize Supabase client using environment variables SUPABASE_URL and SUPABASE_KEY
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL and Key must be provided in .env file");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Export supabase object for use in routes
module.exports = supabase;