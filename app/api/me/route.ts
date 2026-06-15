import { auth } from "@/lib/better-auth/auth";

export async function GET() {
  const session = await auth.api.getSession();
  const user = session?.user;

  return Response.json({
    id: user?.id,
    name: user?.name,
    email: user?.email,
  });
}
