import { createSession, createUser, sessionCookie } from "../../../lib/authStore";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const user = await createUser(req.body || {});
    const token = await createSession(user.id);
    res.setHeader("Set-Cookie", sessionCookie(token));
    return res.status(201).json({ user });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || "注册失败" });
  }
}
