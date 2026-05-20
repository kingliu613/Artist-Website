import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import SiteHeader from "../components/SiteHeader";
import { editorial, getArticle } from "../data/siteData";

export default function GuidePage() {
  const router = useRouter();
  const article = getArticle(typeof router.query.article === "string" ? router.query.article : "buyer-six-checks");

  return (
    <>
      <Head>
        <title>{`${article.title}｜艺集指南`}</title>
        <meta name="description" content={article.summary} />
      </Head>
      <SiteHeader />
      <main>
        <section className="publish-hero">
          <div>
            <p className="eyebrow">{article.type}</p>
            <h1>{article.title}</h1>
            <p>{article.summary}</p>
          </div>
          <div className="status-stack">
            <span>买家体验</span>
            <span>平台信任</span>
            <span>交易转化</span>
          </div>
        </section>

        <section className="guide-layout">
          <article className="guide-article">
            {article.sections.map(([title, body], index) => (
              <section key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{title}</h2>
                <p>{body}</p>
              </section>
            ))}
          </article>
          <aside className="checkout-card">
            <h2>继续浏览</h2>
            <p>指南内容用于把搜索流量转化为明确的购买或上架行动。</p>
            <Link className="button full" href="/#market">浏览作品市场</Link>
            <Link className="button ghost full" href="/publish">发布作品</Link>
            <div className="mini-list">
              {editorial.filter((item) => item.id !== article.id).map((item) => (
                <Link href={`/guide?article=${item.id}`} key={item.id}>
                  {item.type}
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
