import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import useCurrentUser from "../components/useCurrentUser";
import { formatCurrency } from "../data/siteData";

const initialForm = {
  title: "春山听雨",
  artist: "林悦工作室",
  category: "水墨原作",
  year: "2026",
  size: "68 x 88 cm",
  medium: "设色纸本",
  price: "86000",
  commission: "12% 标准佣金",
  certificate: "艺术家亲签证书 + 平台电子凭证",
  provenance: "艺术家工作室直供",
  statement: "这件作品来自 2026 年春季系列，纸张、颜料和装裱批次均可追踪。",
  location: "杭州工作室",
  shipping: "顺丰艺术品专线 + 包装险",
};

export default function PublishPage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const price = Number(form.price || 0);
  const fee = Math.round(price * 0.12);
  const band = form.category === "限量版画" ? "同类首购友好价常见于 ¥12,000-¥30,000" : form.category === "陶瓷器物" ? "同类小型器物常见于 ¥28,000-¥60,000" : "同类青年原作常见于 ¥60,000-¥180,000";

  useEffect(() => {
    if (!loading && !user) router.replace("/auth?mode=register&next=/publish");
  }, [loading, router, user]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    try {
      if (typeof window !== "undefined") window.localStorage?.setItem("yiji:latestDraft", JSON.stringify(form));
    } catch {
      // Draft persistence is a convenience for the local demo; submission still succeeds.
    }
    setSubmitted(true);
  }

  function handleImages(event) {
    const files = Array.from(event.target.files || []).slice(0, 8);
    setImageFiles(files.map((file) => ({ name: file.name, size: file.size, url: URL.createObjectURL(file) })));
  }

  if (loading || !user) {
    return (
      <>
        <Head><title>发布作品｜艺集</title></Head>
        <SiteHeader />
        <main className="publish-page">
          <section className="publish-hero">
            <div>
              <p className="eyebrow">Seller Access</p>
              <h1>注册后发布作品。</h1>
              <p>发布前需要先创建账号，平台会把作品草稿、凭证信息和后续订单记录到你的账号下。</p>
            </div>
            <div className="status-stack">
              <span>账号注册</span>
              <span>作品资料</span>
              <span>平台审核</span>
            </div>
          </section>
          {!loading && (
            <section className="profile-panel">
              <div className="section-head">
                <div><p className="eyebrow">Account Required</p><h2>请先注册或登录</h2></div>
                <Link className="button" href="/auth?mode=register&next=/publish">去注册</Link>
              </div>
            </section>
          )}
        </main>
      </>
    );
  }

  return (
    <>
      <Head><title>发布青年原作｜卖家上架向导｜艺集</title><meta name="description" content="艺术家和卖家可通过艺集发布原作，填写作品信息、定价、凭证、物流和审核材料。" /></Head>
      <SiteHeader />
      <main>
        <section className="publish-hero"><div><p className="eyebrow">Seller Wizard</p><h1>发布一件可被信任的作品。</h1><p>10 分钟内完成基础上架：作品资料、价格、凭证、物流和审核信息一次填清楚。</p></div><div className="status-stack"><span>草稿</span><span>平台审核</span><span>上架销售</span><span>成交放款</span></div></section>
        <section className="wizard-layout">
          <form className="publish-form" onSubmit={submit}>
            {submitted ? (
              <div className="submitted-state"><span>已提交平台审核</span><h1>{form.title}</h1><p>审核员会核对作品图片、凭证、出处、物流方案和定价说明。通过后作品进入市场，并显示一口价担保交易标识。</p><a className="button" href="/profile?tab=seller">查看卖家中心</a></div>
            ) : (
              <>
                <fieldset><legend>0. 作品图片</legend><label className="upload-zone">上传作品图片<input type="file" accept="image/*" multiple onChange={handleImages} /><span>支持整体、细节、背面、证书图，建议至少 4 张。</span></label>{imageFiles.length ? <div className="upload-preview-grid">{imageFiles.map((file) => <figure key={file.name}><img src={file.url} alt={file.name} /><figcaption>{file.name}</figcaption></figure>)}</div> : <div className="upload-placeholder">还没有选择图片。上传后会在这里预览。</div>}</fieldset>
                <fieldset><legend>1. 作品基础信息</legend><div className="form-grid"><label>作品名称<input value={form.title} onChange={(e) => update("title", e.target.value)} required /></label><label>艺术家<input value={form.artist} onChange={(e) => update("artist", e.target.value)} required /></label><label>类别<select value={form.category} onChange={(e) => update("category", e.target.value)}><option>水墨原作</option><option>陶瓷器物</option><option>限量版画</option><option>综合材料</option></select></label><label>创作年份<input value={form.year} onChange={(e) => update("year", e.target.value)} required /></label><label>尺寸<input value={form.size} onChange={(e) => update("size", e.target.value)} required /></label><label>材质<input value={form.medium} onChange={(e) => update("medium", e.target.value)} required /></label></div></fieldset>
                <fieldset><legend>2. 定价与佣金</legend><div className="form-grid"><label>一口价<input type="number" value={form.price} min="1" onChange={(e) => update("price", e.target.value)} required /></label><label>平台佣金<select value={form.commission} onChange={(e) => update("commission", e.target.value)}><option>12% 标准佣金</option><option>10% 种子艺术家扶持</option><option>8% 首发专题佣金</option></select></label></div><p className="form-note">{band}。按 12% 佣金估算，成交服务费约 {formatCurrency(fee)}。</p></fieldset>
                <fieldset><legend>3. 凭证与出处</legend><div className="form-grid"><label>证书类型<select value={form.certificate} onChange={(e) => update("certificate", e.target.value)}><option>艺术家亲签证书 + 平台电子凭证</option><option>限量编号 + 工作室水印</option><option>窑口记录 + 作者签名卡</option></select></label><label>作品来源<input value={form.provenance} onChange={(e) => update("provenance", e.target.value)} /></label></div><label>艺术家声明<textarea value={form.statement} onChange={(e) => update("statement", e.target.value)} /></label></fieldset>
                <fieldset><legend>4. 物流与售后</legend><div className="form-grid"><label>发货地<input value={form.location} onChange={(e) => update("location", e.target.value)} /></label><label>物流方案<select value={form.shipping} onChange={(e) => update("shipping", e.target.value)}><option>顺丰艺术品专线 + 包装险</option><option>木箱运输 + 到付保价</option><option>同城专人配送</option></select></label></div><label className="check-row"><input type="checkbox" defaultChecked /> 同意平台担保付款、确认收货后放款与佣金规则</label></fieldset>
                <div className="form-actions"><button className="button" type="submit">提交平台审核</button><button className="button ghost" type="button" onClick={() => window.localStorage.setItem("yiji:latestDraft", JSON.stringify(form))}>保存草稿</button></div>
              </>
            )}
          </form>
          <aside className="seller-panel"><h2>上架前检查</h2><ul><li>至少 4 张清晰图片：整体、细节、背面、证书。</li><li>价格需要含平台佣金，不要让买家下单后再补费用。</li><li>写清楚包装和破损处理，减少售后争议。</li><li>证书、出处和创作声明会进入作品凭证。</li></ul><div className="mini-ledger"><span>预计审核</span><strong>1-2 个工作日</strong><span>成交放款</span><strong>确认收货后 72 小时内</strong></div></aside>
        </section>
      </main>
    </>
  );
}
