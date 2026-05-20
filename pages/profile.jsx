import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SiteHeader from "../components/SiteHeader";
import useCurrentUser from "../components/useCurrentUser";
import useLocalStorageState from "../components/useLocalStorageState";
import { getArtist, getWork, platform, workList } from "../data/siteData";

const accountTabs = [
  { id: "favorites", label: "收藏夹", href: "/profile?tab=favorites" },
  { id: "buyer", label: "买家中心", href: "/profile?tab=buyer" },
  { id: "seller", label: "卖家中心", href: "/profile?tab=seller" },
];

function roleTabs(role) {
  return accountTabs.filter((tab) => tab.id === "favorites" || tab.id === role);
}

function AccountTabs({ active, role }) {
  const tabs = roleTabs(role);
  return (
    <nav className="profile-tabs account-tabs" aria-label="个人主页功能切换">
      {tabs.map((tab) => (
        <Link className={active === tab.id ? "active" : ""} href={tab.href} key={tab.id}>{tab.label}</Link>
      ))}
    </nav>
  );
}

function FavoriteCard({ work, isFavorite, onAdd, onRemove }) {
  const artist = getArtist(work.artistId);
  return (
    <article className="favorite-card">
      <Link className="favorite-card-image" href={`/artwork?work=${work.id}`}>
        <img src={work.image} alt={work.title} />
        <span>{work.status}</span>
      </Link>
      <div>
        <p className="meta">{work.category} · {work.year}</p>
        <h3><Link href={`/artwork?work=${work.id}`}>{work.title}</Link></h3>
        <p>{work.sourceArtist || artist.name}</p>
        <div className="price-row"><strong>{work.priceLabel}</strong><span>信任分 {work.trustScore}</span></div>
        <div className="card-actions">
          <Link className="button small" href={`/artwork?work=${work.id}`}>查看作品</Link>
          {isFavorite ? (
            <button className="button ghost small" type="button" onClick={() => onRemove(work.id)}>取消收藏</button>
          ) : (
            <button className="button ghost small" type="button" onClick={() => onAdd(work.id)}>加入收藏</button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const legacyMode = typeof router.query.mode === "string" ? router.query.mode : "";
  const requestedTab = typeof router.query.tab === "string" ? router.query.tab : legacyMode;
  const artist = getArtist(typeof router.query.user === "string" ? router.query.user : "linyue");
  const { user } = useCurrentUser();
  const role = user?.role === "seller" ? "seller" : "buyer";
  const activeTab = requestedTab === "seller" || requestedTab === "buyer" || requestedTab === "favorites" ? requestedTab : "favorites";
  const allowedTabs = roleTabs(role).map((tab) => tab.id);
  const visibleTab = allowedTabs.includes(activeTab) ? activeTab : role;
  const selectedOrder = getWork(typeof router.query.order === "string" ? router.query.order : "river-village");
  const [favorites, setFavorites] = useLocalStorageState("yiji:favorites", []);
  const favoriteWorks = favorites.map(getWork).filter(Boolean);
  const artistWorks = workList.filter((work) => work.artistId === artist.id);
  const sellerRows = [
    { work: getWork("sample-01"), status: "销售中", next: "等待买家下单" },
    { work: getWork("sample-32"), status: "买家咨询", next: "回复物流与证书问题" },
    { work: getWork("sample-90"), status: "平台审核", next: "补充背面细节图" },
  ];

  function removeFavorite(id) {
    setFavorites(favorites.filter((item) => item !== id));
  }

  function addFavorite(id) {
    if (!favorites.includes(id)) setFavorites([...favorites, id]);
  }

  useEffect(() => {
    if (!router.isReady || allowedTabs.includes(activeTab)) return;
    router.replace(`/profile?tab=${role}`, undefined, { shallow: true });
  }, [activeTab, allowedTabs, role, router]);

  return (
    <>
      <Head><title>{`${artist.name}｜个人主页｜艺集`}</title></Head>
      <SiteHeader hideFavorites profileAvatar={visibleTab === "seller" ? artist.avatar : user?.avatar || "/assets/avatars/user.svg"} />
      <main className="profile-page">
        <section className="profile-hero account-home">
          <img src={visibleTab === "seller" ? artist.avatar : user?.avatar || "/assets/avatars/user.svg"} alt="" />
          <div>
            <p className="eyebrow">Account Home</p>
            <h1>{user ? `${user.name}的艺集` : "我的艺集"}</h1>
            <p>{user ? `已登录为 ${user.email}，收藏、订单和卖家工作台都会记录在后台账号里。` : "像淘宝个人中心一样，把收藏、订单和卖家工作台收进同一个主页；登录后数据会记录到后台账号。"}</p>
            <div className="tag-row">
              <span>收藏实时同步</span>
              <span>担保订单</span>
              <span>卖家工作台</span>
              {!user && <Link href="/auth">登录/注册</Link>}
            </div>
          </div>
          <div className="profile-stats">
            <div><strong>{favoriteWorks.length}</strong><span>收藏作品</span></div>
            <div><strong>1</strong><span>待处理订单</span></div>
            <div><strong>{artistWorks.length}</strong><span>在展作品</span></div>
          </div>
        </section>

        <AccountTabs active={visibleTab} role={role} />

        {visibleTab === "favorites" && (
          <section className="profile-panel favorites-panel">
            <div className="section-head">
              <div><p className="eyebrow">Favorites</p><h2>收藏夹</h2></div>
              <p>{favoriteWorks.length ? "这里会随着你在首页或详情页的收藏操作实时更新。" : "收藏夹暂无内容。"}</p>
            </div>
            {favoriteWorks.length ? (
              <div className="favorites-grid">
                {favoriteWorks.map((work) => <FavoriteCard work={work} isFavorite={favorites.includes(work.id)} onAdd={addFavorite} onRemove={removeFavorite} key={work.id} />)}
              </div>
            ) : (
              <div className="empty-state favorites-empty">收藏夹暂无内容</div>
            )}
          </section>
        )}

        {visibleTab === "buyer" && (
          <section className="profile-panel buyer-panel">
            <div className="section-head">
              <div><p className="eyebrow">Buyer Center</p><h2>买家中心</h2></div>
              <p>收藏、订单、关注和提醒被放在买家路径里，不再和卖家工具混在一起。</p>
            </div>
            <div className="dashboard-grid account-dashboard">
              <article className="order-card primary-order">
                <h2>当前订单</h2>
                <div className="order-work"><img src={selectedOrder.image} alt={selectedOrder.title} /><div><strong>{selectedOrder.title}</strong><span>{selectedOrder.priceLabel} · 平台托管付款</span></div></div>
                <ol className="timeline"><li className="done">已生成订单</li><li className="done">等待付款进入平台托管</li><li>卖家上传包装与物流</li><li>确认收货后放款</li></ol>
              </article>
              <article className="order-card">
                <h2>我的收藏</h2>
                {favoriteWorks.length ? (
                  <div className="mini-list">{favoriteWorks.slice(0, 4).map((work) => <Link key={work.id} href={`/artwork?work=${work.id}`}>{work.title}<span>{work.priceLabel}</span></Link>)}</div>
                ) : (
                  <p>收藏夹暂无内容。</p>
                )}
              </article>
              <article className="order-card">
                <h2>关注与提醒</h2>
                <p>已关注林悦工作室、陈墨、安岐。新作上架、降价和专题开拍会进入站内消息。</p>
              </article>
            </div>
          </section>
        )}

        {visibleTab === "seller" && (
          <section className="profile-panel seller-panel-page">
            <div className="section-head">
              <div><p className="eyebrow">Seller Center</p><h2>卖家中心</h2></div>
              <Link className="text-link" href="/publish">发布新作品</Link>
            </div>
            <div className="seller-tools">
              <Link href="/publish"><strong>发布作品</strong><span>上传图片、价格、证书与物流规则</span></Link>
              <Link href="/trust"><strong>担保设置</strong><span>{platform.escrowDays}</span></Link>
              <Link href="/profile?tab=buyer"><strong>买家咨询</strong><span>3 条待回复</span></Link>
              <Link href="/#guide"><strong>运营指南</strong><span>学习上新、定价和内容引流</span></Link>
            </div>
            <section className="seller-table" aria-label="卖家作品状态">
              <div><span>作品</span><span>状态</span><span>下一步</span></div>
              {sellerRows.map(({ work, status, next }) => <Link href={`/artwork?work=${work.id}`} key={work.id}><strong>{work.title}</strong><span>{status}</span><span>{next}</span></Link>)}
            </section>
          </section>
        )}

        <section className="section-head profile-portfolio-head">
          <div><p className="eyebrow">Portfolio</p><h2>{artist.name} 正在展示</h2></div>
          <Link className="text-link" href="/publish">发布新作品</Link>
        </section>
        <section className="art-grid compact-grid">
          {artistWorks.map((work) => <article className="art-card" key={work.id}><Link className="art-image" href={`/artwork?work=${work.id}`}><img src={work.image} alt={work.title} /><span>{work.status}</span></Link><div className="art-card-body"><p className="meta">{work.category} · {work.year}</p><h3><Link href={`/artwork?work=${work.id}`}>{work.title}</Link></h3><p className="artist-line">{work.sourceArtist}</p><div className="price-row"><strong>{work.priceLabel}</strong><span>信任分 {work.trustScore}</span></div></div></article>)}
        </section>
      </main>
    </>
  );
}
