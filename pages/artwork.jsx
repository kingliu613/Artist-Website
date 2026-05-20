import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import SiteHeader from "../components/SiteHeader";
import useLocalStorageState from "../components/useLocalStorageState";
import { getArtist, getWork, platform } from "../data/siteData";

export default function ArtworkPage() {
  const router = useRouter();
  const work = getWork(typeof router.query.work === "string" ? router.query.work : "river-village");
  const artist = getArtist(work.artistId);
  const displayArtist = work.sourceArtist || artist.name;
  const [favorites, setFavorites] = useLocalStorageState("yiji:favorites", []);
  const liked = favorites.includes(work.id);
  const productJson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: work.title,
    image: work.image,
    description: `${displayArtist}创作/署名的${work.category}，${work.medium}，支持艺集一口价担保交易。`,
    creator: { "@type": "Person", name: displayArtist },
    offers: { "@type": "Offer", priceCurrency: "CNY", price: work.price, availability: "https://schema.org/InStock" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: artist.rating, reviewCount: artist.sold },
  };

  function toggleFavorite() {
    setFavorites(liked ? favorites.filter((id) => id !== work.id) : [...favorites, work.id]);
  }

  return (
    <>
      <Head>
        <title>{`${work.title}｜${work.category}｜艺集担保交易`}</title>
        <meta name="description" content={`${work.title}，${displayArtist}创作/署名，${work.medium}，${work.size}，${work.priceLabel}，支持艺集一口价担保交易。`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJson) }} />
      </Head>
      <SiteHeader />
      <main className="detail-page">
        <section className="artwork-hero detail-archive-hero">
          <div className="detail-media detail-media-frame">
            <img src={work.image} alt={`${work.title}，${work.medium}`} />
            <span>{work.category}</span>
          </div>
          <div className="detail-summary paper-label-panel">
            <p className="eyebrow">{work.category} · {work.edition}</p>
            <h1>{work.title}</h1>
            <a className="artist-chip" href={work.sourceUrl} target="_blank" rel="noreferrer"><img src={artist.avatar} alt="" /><span>{displayArtist}</span><em>开放馆藏来源</em></a>
            <p className="detail-story">{work.story}</p>
            <div className="detail-price"><strong>{work.priceLabel}</strong><span>{work.status}</span></div>
            <div className="detail-actions"><Link className="button" href={`/profile?tab=buyer&order=${work.id}`}>立即购买</Link><button className="button ghost" type="button" onClick={toggleFavorite}>{liked ? "已收藏" : "收藏作品"}</button><Link className="button ghost" href={`/profile?user=${artist.id}`}>咨询艺术家</Link></div>
            <div className="assurance-strip"><span>平台托管付款</span><span>凭证复核</span><span>物流追踪</span><span>确认后放款</span></div>
          </div>
        </section>
        <section className="detail-layout detail-archive-layout">
          <article className="detail-main detail-paper-stack">
            <h2>作品信息</h2>
            <dl className="spec-grid">{[["作者/署名", displayArtist], ["年代", work.year], ["材质", work.medium], ["尺寸", work.size], ["馆藏分类", work.edition], ["来源地", work.location]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            <h2>作品介绍</h2><p>{work.story}</p>
            <h2>凭证与出处</h2><div className="ledger-card"><div><span>作品证书</span><strong>{work.certificate}</strong></div><div><span>作品来源</span><strong>{work.provenance}</strong></div><div><span>来源链接</span><strong><a href={work.sourceUrl} target="_blank" rel="noreferrer">查看官方馆藏页</a></strong></div><div><span>信任分</span><strong>{work.trustScore}/100</strong></div></div>
            <h2>物流、退换与佣金</h2><div className="policy-list"><article><h3>物流包装</h3><p>{work.shipping}</p></article><article><h3>退换复核</h3><p>{work.returnPolicy}</p></article><article><h3>平台佣金</h3><p>{work.commission}</p></article></div>
          </article>
          <aside className="checkout-card archive-checkout"><h2>担保订单预览</h2><div className="checkout-row"><span>作品价格</span><strong>{work.priceLabel}</strong></div><div className="checkout-row"><span>资金状态</span><strong>买家付款后进入平台托管</strong></div><div className="checkout-row"><span>卖家放款</span><strong>{platform.escrowDays}</strong></div><Link className="button full" href={`/profile?tab=buyer&order=${work.id}`}>生成订单</Link><p>下单前可查看证书、包装、退换规则；成交后平台向卖家收取服务佣金。</p></aside>
        </section>
      </main>
    </>
  );
}
