import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    setMode(router.query.mode === "register" ? "register" : "login");
  }, [router.isReady, router.query.mode]);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "提交失败");
      router.push(typeof router.query.next === "string" ? router.query.next : "/profile?tab=favorites");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>登录注册｜艺集</title></Head>
      <SiteHeader hideFavorites />
      <main className="auth-page">
        <section className="auth-shell">
          <div className="auth-copy">
            <p className="eyebrow">Account</p>
            <h1>登录后收藏、下单和卖家工作台都会记录到后台。</h1>
            <p>登录后可跨页面保存收藏、查看担保订单，并在买家与卖家身份之间顺畅切换。</p>
          </div>
          <form className="auth-card" onSubmit={submit}>
            <div className="profile-tabs auth-tabs">
              <button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>登录</button>
              <button className={mode === "register" ? "active" : ""} type="button" onClick={() => setMode("register")}>注册</button>
            </div>
            {mode === "register" && (
              <label>昵称<input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="例如：一木收藏" required /></label>
            )}
            <label>邮箱<input value={form.email} onChange={(event) => update("email", event.target.value)} type="email" placeholder="you@example.com" required /></label>
            <label>密码<input value={form.password} onChange={(event) => update("password", event.target.value)} type="password" placeholder="至少 8 位" required /></label>
            {mode === "register" && (
              <label>默认身份<select value={form.role} onChange={(event) => update("role", event.target.value)}><option value="buyer">买家</option><option value="seller">卖家</option></select></label>
            )}
            {error && <p className="form-error">{error}</p>}
            <button className="button full" type="submit" disabled={loading}>{loading ? "提交中..." : mode === "login" ? "登录" : "创建账号"}</button>
          </form>
        </section>
      </main>
    </>
  );
}
