import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import useLocalStorageState from "../components/useLocalStorageState";
import { dropList, editorial, getArtist, workList } from "../data/siteData";

const PAGE_SIZE = 9;

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("featured");
  const [activeTag, setActiveTag] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [favorites, setFavorites] = useLocalStorageState("yiji:favorites", []);
  const loadMoreRef = useRef(null);

  const categories = useMemo(() => Array.from(new Set(workList.map((work) => work.category))), []);
  const collectionTags = useMemo(() => Array.from(new Set(workList.map((work) => work.tags[0]).filter(Boolean))), []);
  const visibleWorks = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const list = workList.filter((work) => {
      const artist = getArtist(work.artistId);
      const haystack = [work.title, work.originalTitle, work.category, work.medium, work.sourceArtist, artist.name, artist.city, ...work.tags].join(" ").toLowerCase();
      const priceMatch = price === "all" || (price === "under-50000" && work.price < 50000) || (price === "50000-100000" && work.price >= 50000 && work.price <= 100000) || (price === "over-100000" && work.price > 100000);
      return (category === "all" || work.category === category) && (activeTag === "all" || work.tags.includes(activeTag)) && priceMatch && (!keyword || haystack.includes(keyword));
    });
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "trust") list.sort((a, b) => b.trustScore - a.trustScore);
    return list;
  }, [activeTag, category, price, query, sort]);

  const pagedWorks = visibleWorks.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeTag, category, price, query, sort]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || visibleCount >= visibleWorks.length) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisibleCount((count) => Math.min(count + PAGE_SIZE, visibleWorks.length));
      }
    }, { rootMargin: "500px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [visibleCount, visibleWorks.length]);

  function toggleFavorite(id) {
    setFavorites(favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id]);
  }

  function toggleTag(tag) {
    setActiveTag((current) => (current === tag ? "all" : tag));
  }

  return (
    <>
      <Head>
        <title>艺集｜青年艺术家原作担保交易平台</title>
        <meta name="description" content="艺集是面向青年艺术家原作的一口价担保交易平台，提供作品凭证、平台托管付款、物流保障和策展式发现体验。" />
      </Head>
      <SiteHeader />
      <main className="home-page">
        <section className="hero-market">
          <div className="hero-curation-collage" aria-hidden="true">
            <img src={workList[0].image} alt="" />
            <img src={workList[1].image} alt="" />
            <img src={workList[2].image} alt="" />
            <span>艺集策展号 001</span>
          </div>
          <div className="hero-copy">
            <p className="eyebrow">青年艺术家原作 · 一口价担保交易</p>
            <h1>先看懂作品，再放心下单。</h1>
            <p>艺集把艺术家声明、作品凭证、价格、物流和放款节点放在同一个交易路径里，让第一次买原作也像成熟电商一样清楚。</p>
            <div className="hero-proof" aria-label="平台亮点">
              <span>48h 凭证复核</span>
              <span>独立物流险</span>
              <span>策展式上新</span>
            </div>
            <div className="hero-actions">
              <Link className="button" href="#market">浏览精选原作</Link>
              <Link className="button ghost" href="/trust">查看担保流程</Link>
            </div>
          </div>
          <aside className="hero-panel">
            <p className="panel-kicker">Collector safeguards</p>
            <div><span>平台托管</span><strong>确认收货后放款</strong></div>
            <div><span>作品凭证</span><strong>证书 + 影像存证</strong></div>
            <div><span>佣金模式</span><strong>成交后抽佣 8%-15%</strong></div>
          </aside>
        </section>

        <section className="home-control-stage" aria-label="市场筛选与合集">
        <section className="collection-tabs" aria-label="合集筛选">
          <button type="button" className={activeTag === "all" ? "active" : ""} onClick={() => setActiveTag("all")}>全部合集</button>
          {collectionTags.map((tag) => (
            <button type="button" className={activeTag === tag ? "active" : ""} onClick={() => toggleTag(tag)} key={tag}>{tag}</button>
          ))}
        </section>

        <section className="filter-bar" aria-label="市场筛选">
          <label>搜索<input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="水墨、陶瓷、艺术家、城市" /></label>
          <label>类别<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">全部类别</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>价格<select value={price} onChange={(event) => setPrice(event.target.value)}><option value="all">全部价格</option><option value="under-50000">5 万以下</option><option value="50000-100000">5-10 万</option><option value="over-100000">10 万以上</option></select></label>
          <label>排序<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">策展推荐</option><option value="price-asc">价格从低到高</option><option value="price-desc">价格从高到低</option><option value="trust">信任分优先</option></select></label>
        </section>
        </section>

        <section className="section-head market-head" id="market">
          <div>
            <p className="eyebrow">Curated Market</p>
            <h2>{activeTag === "all" ? "精选青年原作" : activeTag}</h2>
          </div>
          <p>{visibleWorks.length} 件作品正在展售，按题材、价格与信任分重新编排。</p>
        </section>
        <section className="home-curation-grid art-grid">
          {pagedWorks.map((work, index) => {
            const artist = getArtist(work.artistId);
            const displayArtist = work.sourceArtist || artist.name;
            const liked = favorites.includes(work.id);
            return (
              <article className={`home-art-card art-card ${index % 7 === 0 ? "feature" : ""} ${index % 7 === 3 ? "slim" : ""} ${index % 7 === 5 ? "wide-note" : ""}`} key={work.id}>
                <Link className="art-image" href={`/artwork?work=${work.id}`}>
                  <img src={work.image} alt={`${work.title}，${work.category}`} />
                  <span>{work.status}</span>
                  <em>{work.category}</em>
                </Link>
                <div className="art-card-body">
                  <div className="card-title-row"><div><p className="meta">{work.category} · {work.year}</p><h3><Link href={`/artwork?work=${work.id}`}>{work.title}</Link></h3></div><button className="icon-button favorite" type="button" aria-label={liked ? "取消收藏" : "收藏作品"} onClick={() => toggleFavorite(work.id)}>{liked ? "★" : "☆"}</button></div>
                  <p className="artist-line">{displayArtist} · {work.year}</p>
                  <div className="price-row"><strong>{work.priceLabel}</strong><span>信任分 {work.trustScore}</span></div>
                  <div className="tag-row">{work.tags.slice(0, 3).map((tag) => <button type="button" className={activeTag === tag ? "active" : ""} onClick={() => toggleTag(tag)} key={tag}>{tag}</button>)}</div>
                  <div className="card-actions"><Link className="button small" href={`/artwork?work=${work.id}`}>立即购买</Link><Link className="button ghost small" href={`/profile?user=${artist.id}`}>艺术家</Link></div>
                </div>
              </article>
            );
          })}
        </section>
        <div className="load-more-sentinel" ref={loadMoreRef}>
          {visibleCount < visibleWorks.length ? "继续下滑加载更多作品" : "已显示当前筛选下的全部作品"}
        </div>

        <section className="trust-entry" id="trust">
          <div>
            <p className="eyebrow">Escrow Flow</p>
            <h2>钱和作品每一步都说清楚</h2>
            <p>担保付款、凭证复核、物流追踪和抽佣放款已整理到单独页面。</p>
          </div>
          <Link className="button" href="/trust">打开担保流程</Link>
        </section>

        <section className="home-exhibit-band drops-section" id="drops">
          <div className="section-head">
            <div>
              <p className="eyebrow">Weekly Drops</p>
              <h2>本周新作专题</h2>
            </div>
            <Link className="text-link" href="/profile?user=linyue">查看艺术家</Link>
          </div>
          <div className="drop-list">{dropList.map((drop, index) => <Link className="drop-item" href={`/drop?drop=${drop.id}`} key={drop.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{drop.title}</strong><em>{drop.meta}</em><b>{drop.time}</b></Link>)}</div>
        </section>

        <section className="home-paper-guide guide-section" id="guide">
          <div className="section-head">
            <div>
              <p className="eyebrow">Traffic Content</p>
              <h2>让用户愿意反复回来看的内容</h2>
            </div>
          </div>
          <div className="home-editorial-grid editorial-grid">{editorial.map((item, index) => <Link className="home-paper-card editorial-card" href={`/guide?article=${item.id}`} key={item.id}><span>{String(index + 1).padStart(2, "0")} · {item.type}</span><h3>{item.title}</h3><p>{item.summary}</p><b>阅读全文</b></Link>)}</div>
        </section>
      </main>
      <footer className="site-footer"><strong>艺集</strong><span>青年原作 · 可信凭证 · 担保交易</span></footer>
    </>
  );
}
