import { clerkMiddleware ,createRouteMatcher} from "@clerk/nextjs/server";


const protectedRoutes = createRouteMatcher([
    '/',
    '/upcoming',
    '/prervious',    
    '/recordings',
    '/personal-room',
    '/meeting(.*)',
])
export default clerkMiddleware((auth , req) =>{
    if(protectedRoutes(req)) auth().protect();
    return;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};