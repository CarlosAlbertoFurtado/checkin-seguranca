import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Rotas que NÃO precisam de login
  const publicRoutes = ['/login', '/auth', '/api/cron/check-checkin'];
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verifica se existe algum cookie de sessão do Supabase
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(cookie => 
    cookie.name.includes('auth-token') || 
    cookie.name.includes('sb-') && cookie.name.includes('-auth')
  );

  // Se não tem cookie de sessão, redireciona pro login
  if (!hasAuthCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
