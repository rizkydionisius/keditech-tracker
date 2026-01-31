import { createBrowserClient } from '@supabase/ssr';

// Validate URL format to prevent crash
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => url.startsWith('http://') || url.startsWith('https://');
const validUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder-project.supabase.co';

if (!isValidUrl(supabaseUrl)) {
    console.error('⚠️ CRITICAL ERROR: Invalid NEXT_PUBLIC_SUPABASE_URL in .env.local.');
}

export const supabase = createBrowserClient(validUrl, supabaseKey);
