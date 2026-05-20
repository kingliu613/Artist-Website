import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { getArtNewsPayload } from "./api/art-news";

const tabs = [
  { id: "all", label: "全部" },
  { id: "market", label: "市场" },
  { id: "exhibition", label: "展览" },
  { id: "artist", label: "艺术家" },
];

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "今日更新";
  return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function categoryToTab(category) {
  if (category === "市场") return "market";
  if (category === "展览") return "exhibition";
  if (category === "艺术家") return "artist";
  return "all";
}

function NewsCard({ article, lead = false }) {
  return (
    <article className={`news-card ${lead ? "lead" : ""}`}>
      <a className="news-image" href={article.url}>
        <img src={article.image} alt={article.title} />
        <span>{article.category}</span>
      </a>
      <div className="news-card-body">
        <div className="news-meta"><span>{article.source}</span><time>{formatDate(article.publishedAt)}</time></div>
        <h3><a href={article.url}>{article.title}</a></h3>
        <p>{article.summary}</p>
        <a className="text-link" href={article.url}>打开原文</a>
      </div>
    </article>
  );
}

export default function NewsPage({ initialPayload }) {
  const [payload, setPayload] = useState(initialPayload || null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(!initialPayload);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const today = new Date().toISOString().slice(0, 10);
    fetch(`/api/art-news?day=${today}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!alive) return;
        setPayload(data);
        setError(data.error || "");
      })
      .catch(() => {
        if (alive) setError("新闻源暂时无法连接");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const articles = payload?.articles || [];
  const visibleArticles = useMemo(() => {
    if (activeTab === "all") return articles;
    return articles.filter((article) => categoryToTab(article.category) === activeTab);
  }, [activeTab, articles]);
  const leadArticle = visibleArticles[0];
  const restArticles = visibleArticles.slice(1);

  return (
    <>
      <Head>
        <title>艺术新闻｜艺集</title>
        <meta name="description" content="艺集艺术新闻聚合全球艺术市场、展览、画廊、拍卖与艺术家动态，每天刷新。" />
      </Head>
      <SiteHeader />
      <main className="news-page">
        <section className="news-hero">
          <div>
            <p className="eyebrow">艺术新闻</p>
            <h1>每天刷新艺术市场和展览动态。</h1>
            <p>聚合全球艺术媒体中的博物馆、画廊、拍卖、展览和青年艺术家新闻，帮助买家和创作者更快进入行业语境。</p>
          </div>
          <div className="status-stack">
            <span>{payload?.source || "艺术媒体聚合"}</span>
            <span>{payload?.day ? `${payload.day} 更新` : "每日刷新"}</span>
            <span>图文新闻</span>
          </div>
        </section>

        <section className="news-tabs" aria-label="新闻分类">
          {tabs.map((tab) => (
            <button className={activeTab === tab.id ? "active" : ""} type="button" onClick={() => setActiveTab(tab.id)} key={tab.id}>{tab.label}</button>
          ))}
        </section>

        {loading && <div className="empty-state">正在加载艺术新闻...</div>}
        {!loading && error && <div className="empty-state">实时新闻源暂时不可用，已显示备用内容。</div>}
        {!loading && !visibleArticles.length && <div className="empty-state">当前分类暂无新闻，稍后会随每日更新补充。</div>}

        {!!leadArticle && (
          <section className="news-layout">
            <NewsCard article={leadArticle} lead />
            <div className="news-grid">
              {restArticles.map((article) => <NewsCard article={article} key={article.id} />)}
            </div>
          </section>
        )}

        <section className="trust-entry">
          <div>
            <p className="eyebrow">交易语境</p>
            <h2>从新闻回到交易判断</h2>
            <p>市场变化会影响题材热度、价格区间和买家信心；收藏前仍要回到凭证、来源、材质、尺寸和物流规则。</p>
          </div>
          <Link className="button" href="/#market">回到市场</Link>
        </section>
      </main>
      <footer className="site-footer"><strong>艺集</strong><span>艺术新闻 · 市场语境 · 每日刷新</span></footer>
    </>
  );
}

export async function getServerSideProps() {
  try {
    return { props: { initialPayload: await getArtNewsPayload() } };
  } catch {
    return { props: { initialPayload: null } };
  }
}
