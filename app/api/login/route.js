import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const SECRET_KEY = "SECRET_BANJIR";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const result = await pool.query("SELECT * FROM admin WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return Response.json(
        { error: "Username tidak ditemukan" },
        { status: 401 },
      );
    }

    const admin = result.rows[0];

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      return Response.json({ error: "Password salah" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: admin.id_admin,
        username: admin.username,
      },
      SECRET_KEY,
      { expiresIn: "1d" },
    );

    const cookie = serialize("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login berhasil",
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
