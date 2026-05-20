import Head from "next/head";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";

const tabs = [
  {
    title: "买家付款进平台托管",
    body: "下单后资金暂由平台托管，卖家不会立即收款。买家可以在订单页看到资金状态、作品凭证和预计发货节点。",
  },
  {
    title: "卖家按凭证发货",
    body: "卖家发货前上传包装、证书和物流影像，平台把这些信息绑定到订单，方便后续争议复核。",
  },
  {
    title: "买家确认收货",
    body: "作品与页面描述一致后，买家确认收货；如果材质、尺寸、证书或品相明显不符，可以申请平台复核。",
  },
  {
    title: "平台抽佣后放款",
    body: "确认收货后进入放款流程，平台按约定收取服务佣金，余额放款给艺术家或卖家。",
  },
];

export default function TrustPage() {
  return (
    <>
      <Head>
        <title>担保流程｜艺集</title>
        <meta name="description" content="艺集担保交易流程：平台托管付款、凭证发货、买家确认收货、抽佣后放款。" />
      </Head>
      <SiteHeader />
      <main>
        <section className="publish-hero">
          <div>
            <p className="eyebrow">Escrow Flow</p>
            <h1>钱和作品每一步都说清楚。</h1>
            <p>把首页的交易保障说明收拢到这里，买家和卖家需要时可以集中查看。</p>
          </div>
          <div className="status-stack">
            <span>买家</span>
            <span>平台</span>
            <span>卖家</span>
            <span>物流</span>
          </div>
        </section>
        <section className="trust-diagram" aria-label="担保交易流程图">
          <div className="diagram-line" aria-hidden="true" />
          {tabs.map((item, index) => (
            <article className="diagram-step" key={item.title}>
              <span className="diagram-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </section>
        <section className="trust-entry">
          <div>
            <p className="eyebrow">Back to Market</p>
            <h2>回到市场继续浏览</h2>
          </div>
          <Link className="button" href="/#market">查看作品</Link>
        </section>
      </main>
    </>
  );
}
