// Initialize Supabase client using environment variables SUPABASE_URL and SUPABASE_KEY
// This should use the service role key for server-side operations
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // This should be the service role key

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL and Key must be provided in .env file");
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Export supabase object for use in routes
module.exports = supabase;