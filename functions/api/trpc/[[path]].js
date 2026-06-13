const WORKER_URL = "https://cws-ecommerce-api.nadiracemilan25.workers.dev";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  const procedure = path.replace("/api/trpc/", "");

  if (procedure === "auth.me" || procedure.startsWith("auth.me?")) {
    const cookie = context.request.headers.get("Cookie") || "";
    const sessionMatch = cookie.match(/session=([^;]+)/);
    const token = sessionMatch ? sessionMatch[1] : null;

    if (!token) {
      return new Response(JSON.stringify([{result:{data:{json:null}}}]), {
        headers: {"Content-Type": "application/json"}
      });
    }

    const meRes = await fetch(`${WORKER_URL}/api/auth/me`, {
      headers: {"Cookie": `session=${token}`}
    });
    const user = await meRes.json();

    return new Response(JSON.stringify([{result:{data:{json:user}}}]), {
      headers: {"Content-Type": "application/json"}
    });
  }

  if (procedure === "auth.logout" || procedure.startsWith("auth.logout?")) {
    return new Response(JSON.stringify([{result:{data:{json:{success:true}}}}]), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": "session=; HttpOnly; Path=/; Max-Age=0"
      }
    });
  }

  const workerUrl = new URL(context.request.url);
  workerUrl.hostname = new URL(WORKER_URL).hostname;
  workerUrl.protocol = "https:";
  workerUrl.port = "";

  return fetch(new Request(workerUrl.toString(), {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.method !== "GET" ? context.request.body : undefined,
  }));
}