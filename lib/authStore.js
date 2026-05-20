import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { promisify } from "util";

const scrypt = promisify(crypto.scrypt);
const DB_PATH = path.join(process.cwd(), "data", "auth-db.json");
const SESSION_COOKIE = "yiji_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const db = JSON.parse(raw);
    return { users: db.users || [], sessions: db.sessions || [] };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { users: [], sessions: [] };
  }
}

async function writeDb(db) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

async function verifyPassword(password, stored) {
  const [salt, hashHex] = String(stored || "").split(":");
  if (!salt || !hashHex) return false;
  const hash = await scrypt(password, salt, 64);
  const expected = Buffer.from(hashHex, "hex");
  return expected.length === hash.length && crypto.timingSafeEqual(expected, hash);
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function parseCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

export function sessionCookie(token, maxAge = SESSION_MAX_AGE) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearSessionCookie() {
  return sessionCookie("", 0);
}

export async function createUser({ name, email, password, role = "buyer" }) {
  const cleanEmail = normalizeEmail(email);
  const cleanName = String(name || "").trim();
  if (!cleanName) throw Object.assign(new Error("请输入昵称"), { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw Object.assign(new Error("请输入有效邮箱"), { status: 400 });
  if (String(password || "").length < 8) throw Object.assign(new Error("密码至少 8 位"), { status: 400 });

  const db = await readDb();
  if (db.users.some((user) => user.email === cleanEmail)) throw Object.assign(new Error("该邮箱已注册"), { status: 409 });

  const user = {
    id: crypto.randomUUID(),
    name: cleanName,
    email: cleanEmail,
    role: role === "seller" ? "seller" : "buyer",
    avatar: "/assets/avatars/user.svg",
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  await writeDb(db);
  return publicUser(user);
}

export async function authenticateUser({ email, password }) {
  const db = await readDb();
  const user = db.users.find((item) => item.email === normalizeEmail(email));
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw Object.assign(new Error("邮箱或密码不正确"), { status: 401 });
  }
  return publicUser(user);
}

export async function createSession(userId) {
  const db = await readDb();
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString();
  db.sessions = db.sessions.filter((session) => new Date(session.expiresAt).getTime() > Date.now());
  db.sessions.push({ tokenHash: hashToken(token), userId, expiresAt, createdAt: new Date().toISOString() });
  await writeDb(db);
  return token;
}

export async function getUserFromRequest(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token) return null;
  const db = await readDb();
  const tokenHash = hashToken(token);
  const session = db.sessions.find((item) => item.tokenHash === tokenHash && new Date(item.expiresAt).getTime() > Date.now());
  if (!session) return null;
  return publicUser(db.users.find((user) => user.id === session.userId));
}

export async function deleteSession(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token) return;
  const db = await readDb();
  db.sessions = db.sessions.filter((session) => session.tokenHash !== hashToken(token));
  await writeDb(db);
}
