import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export const updateSession = async (request: NextRequest) => {
  // 1. Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the request cookies
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request cookies
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // 2. Check Authentication
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // 3. Define Protected Routes Logic
  // A. Redirect Unauthenticated Users
  if (!user && !path.startsWith('/login') && !path.startsWith('/auth')) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
  }

  // B. Redirect Authenticated Users
  // If user IS logged in and tries to access Login page
  if (user && path.startsWith('/login')) {
      // Redirect to Dashboard (Home)
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
  }

  // 4. Return the response (with updated cookies if any)
  return response;
};
