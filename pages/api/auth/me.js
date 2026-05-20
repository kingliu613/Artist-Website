import { getUserFromRequest } from "../../../lib/authStore";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const user = await getUserFromRequest(req);
  return res.status(200).json({ user });
}
