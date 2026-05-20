import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import SiteHeader from "../components/SiteHeader";
import { drops, getArtist, getWork } from "../data/siteData";

export default function DropPage() {
  const router = useRouter();
  const drop = drops[typeof router.query.drop === "string" ? router.query.drop : "china-open"] || drops["china-open"];
  const curator = getArtist(drop.curator);
  const dropWorks = drop.works.map(getWork);
  return (
    <>
      <Head><title>{`${drop.title}｜艺集新作专题`}</title></Head>
      <SiteHeader />
      <main>
        <section className="publish-hero"><div><p className="eyebrow">新作专题 {drop.number}</p><h1>{drop.title}</h1><p>{drop.hero}</p></div><div className="status-stack"><span>{drop.subtitle}</span><span>策展：{curator.name}</span><span>平台担保交易</span></div></section>
        <section className="section-head"><div><p className="eyebrow">Drop Works</p><h2>可直接购买的专题作品</h2></div><Link className="text-link" href="/#market">返回市场</Link></section>
        <section className="art-grid">{dropWorks.map((work) => <article className="art-card" key={work.id}><Link className="art-image" href={`/artwork?work=${work.id}`}><img src={work.image} alt={work.title} /><span>{work.status}</span></Link><div className="art-card-body"><p className="meta">{work.category} · {work.year}</p><h3><Link href={`/artwork?work=${work.id}`}>{work.title}</Link></h3><p className="artist-line">{work.sourceArtist || getArtist(work.artistId).name}</p><div className="price-row"><strong>{work.priceLabel}</strong><span>信任分 {work.trustScore}</span></div></div></article>)}</section>
      </main>
    </>
  );
}
