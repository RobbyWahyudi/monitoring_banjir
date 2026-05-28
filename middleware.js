import { NextResponse } from "next/server";

const SECRET_KEY = "SECRET_BANJIR";

// Helper function to verify HMAC SHA-256 JWT in Edge/Middleware runtime
async function verifyJWT(token, secret) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [headerB64, payloadB64, signatureB64] = parts;

    const decodeBase64Url = (str) => {
      const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      const pad = base64.length % 4;
      const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
      return atob(padded);
    };

    const payload = JSON.parse(decodeBase64Url(payloadB64));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureStr = decodeBase64Url(signatureB64);
    const signatureBytes = new Uint8Array(signatureStr.length);
    for (let i = 0; i < signatureStr.length; i++) {
      signatureBytes[i] = signatureStr.charCodeAt(i);
    }

    return await crypto.subtle.verify("HMAC", key, signatureBytes, data);
  } catch (err) {
    return false;
  }
}

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  // Route yang diproteksi
  const protectedRoutes = ["/admin"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Jika bukan route admin → lanjut
  if (!isProtected) {
    return NextResponse.next();
  }

  // Jika tidak ada token
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const isValid = await verifyJWT(token, SECRET_KEY);
  if (!isValid) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}