export async function onRequest(context) {
  const url = new URL(context.request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    // Redirect ke home jika tidak ada token
    return Response.redirect(new URL("/", url.origin).toString(), 302);
  }

  const headers = new Headers();
  headers.set("Location", new URL("/", url.origin).toString());
  headers.append(
    "Set-Cookie",
    `session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`
  );

  return new Response(null, { status: 302, headers });
}