const root = document.querySelector("#profileRoot");
const params = getParams();
const mode = params.get("mode") || "artist";
const selectedArtist = getArtist(params.get("user") || "linyue");
const selectedOrder = params.get("order") ? getWork(params.get("order")) : YiJiData.works[0];
const favorites = JSON.parse(localStorage.getItem("yiji:favorites") || "[]");
const latestDraft = JSON.parse(localStorage.getItem("yiji:latestDraft") || "null");

function artistWorks(artistId) {
  return YiJiData.works.filter((work) => work.artistId === artistId);
}

function renderTabs(active) {
  return `
    <div class="profile-tabs" role="tablist">
      <a class="${active === "artist" ? "active" : ""}" href="./profile.html?user=${selectedArtist.id}">艺术家主页</a>
      <a class="${active === "buyer" ? "active" : ""}" href="./profile.html?mode=buyer">买家中心</a>
      <a class="${active === "seller" ? "active" : ""}" href="./profile.html?mode=seller">卖家中心</a>
    </div>
  `;
}

function renderArtistProfile() {
  const works = artistWorks(selectedArtist.id);
  root.innerHTML = `
    <section class="profile-hero">
      <img src="${selectedArtist.avatar}" alt="" />
      <div>
        <p class="eyebrow">${selectedArtist.city} · ${selectedArtist.school}</p>
        <h1>${selectedArtist.name}</h1>
        <p>${selectedArtist.bio}</p>
        <div class="tag-row">${selectedArtist.badges.map((badge) => `<span>${badge}</span>`).join("")}</div>
      </div>
      <div class="profile-stats">
        <div><strong>${selectedArtist.followers}</strong><span>收藏关注</span></div>
        <div><strong>${selectedArtist.sold}</strong><span>平台成交</span></div>
        <div><strong>${selectedArtist.rating}</strong><span>买家评分</span></div>
      </div>
    </section>
    ${renderTabs("artist")}
    <section class="section-head">
      <div><p class="eyebrow">Portfolio</p><h2>正在展示</h2></div>
      <a class="text-link" href="./publish.html">发布新作品</a>
    </section>
    <section class="art-grid compact-grid">
      ${works
        .map(
          (work) => `
        <article class="art-card">
          <a class="art-image" href="./artwork.html?work=${work.id}">
            <img src="${safeImage(work)}" alt="${work.title}" loading="lazy" />
            <span>${work.status}</span>
          </a>
          <div class="art-card-body">
            <p class="meta">${work.category} · ${work.year}</p>
            <h3><a href="./artwork.html?work=${work.id}">${work.title}</a></h3>
            <div class="price-row"><strong>${work.priceLabel}</strong><span>信任分 ${work.trustScore}</span></div>
          </div>
        </article>`
        )
        .join("")}
    </section>
  `;
}

function renderBuyerCenter() {
  const favoriteWorks = favorites.map(getWork);
  root.innerHTML = `
    <section class="profile-hero buyer">
      <img src="./public/assets/avatars/user.svg" alt="" />
      <div>
        <p class="eyebrow">Buyer Center</p>
        <h1>买家交易中心</h1>
        <p>收藏、订单、关注艺术家和上新提醒集中管理，帮助买家快速回到感兴趣的作品。</p>
      </div>
      <div class="profile-stats">
        <div><strong>${favoriteWorks.length}</strong><span>收藏作品</span></div>
        <div><strong>1</strong><span>担保订单</span></div>
        <div><strong>3</strong><span>关注艺术家</span></div>
      </div>
    </section>
    ${renderTabs("buyer")}
    <section class="dashboard-grid">
      <article class="order-card">
        <h2>当前订单</h2>
        <div class="order-work">
          <img src="${safeImage(selectedOrder)}" alt="${selectedOrder.title}" />
          <div>
            <strong>${selectedOrder.title}</strong>
            <span>${selectedOrder.priceLabel} · 平台托管付款</span>
          </div>
        </div>
        <ol class="timeline">
          <li class="done">已生成订单</li>
          <li class="done">等待付款进入平台托管</li>
          <li>卖家上传包装与物流</li>
          <li>确认收货后放款</li>
        </ol>
      </article>
      <article class="order-card">
        <h2>收藏夹</h2>
        <div class="mini-list">
          ${(favoriteWorks.length ? favoriteWorks : YiJiData.works.slice(0, 3))
            .map((work) => `<a href="./artwork.html?work=${work.id}">${work.title}<span>${work.priceLabel}</span></a>`)
            .join("")}
        </div>
      </article>
      <article class="order-card">
        <h2>上新提醒</h2>
        <p>已关注林悦工作室、陈墨、安岐。新作上架、降价和专题开拍会进入站内消息。</p>
      </article>
    </section>
  `;
}

function renderSellerCenter() {
  root.innerHTML = `
    <section class="profile-hero seller">
      <img src="${selectedArtist.avatar}" alt="" />
      <div>
        <p class="eyebrow">Seller Center</p>
        <h1>卖家中心</h1>
        <p>查看上架、审核、成交、发货和放款状态，让艺术家知道每一笔钱在哪里。</p>
      </div>
      <div class="profile-stats">
        <div><strong>6</strong><span>展示中</span></div>
        <div><strong>2</strong><span>审核中</span></div>
        <div><strong>¥42.6万</strong><span>本月成交</span></div>
      </div>
    </section>
    ${renderTabs("seller")}
    <section class="dashboard-grid">
      <article class="order-card wide">
        <h2>上架状态</h2>
        <div class="seller-table">
          <div><span>作品</span><span>状态</span><span>下一步</span></div>
          <div><strong>江村渔乐</strong><span>销售中</span><span>等待买家下单</span></div>
          <div><strong>巫峡云涛</strong><span>买家咨询</span><span>回复物流与证书问题</span></div>
          <div><strong>${latestDraft?.title || "春山听雨"}</strong><span>平台审核</span><span>补充背面细节图</span></div>
        </div>
      </article>
      <article class="order-card">
        <h2>放款说明</h2>
        <p>${YiJiData.platform.escrowDays}。平台抽佣后余额进入卖家账户，异常订单会先进入人工复核。</p>
      </article>
      <article class="order-card">
        <h2>增长建议</h2>
        <p>本周建议发布 1 篇创作过程、补齐 2 件作品证书图片，并参加“九五后水墨”专题。</p>
      </article>
    </section>
  `;
}

if (mode === "buyer") renderBuyerCenter();
else if (mode === "seller") renderSellerCenter();
else renderArtistProfile();
