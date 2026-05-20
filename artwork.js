const root = document.querySelector("#artworkRoot");
const work = getWork(getParams().get("work"));
const artist = getArtist(work.artistId);
const favorites = new Set(JSON.parse(localStorage.getItem("yiji:favorites") || "[]"));

document.title = `${work.title}｜${work.category}｜艺集担保交易`;
document.querySelector("meta[name='description']").setAttribute(
  "content",
  `${work.title}，${artist.name}创作，${work.medium}，${work.size}，${work.priceLabel}，支持艺集一口价担保交易。`
);

function writeJsonLd() {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: work.title,
    image: safeImage(work),
    description: work.seo,
    brand: { "@type": "Brand", name: "艺集" },
    creator: { "@type": "Person", name: artist.name },
    material: work.medium,
    offers: {
      "@type": "Offer",
      priceCurrency: "CNY",
      price: work.price,
      availability: "https://schema.org/InStock",
      url: window.location.href,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: artist.rating,
      reviewCount: artist.sold,
    },
  });
  document.head.appendChild(script);
}

function renderArtwork() {
  const liked = favorites.has(work.id);
  root.innerHTML = `
    <section class="artwork-hero">
      <div class="detail-media">
        <img src="${safeImage(work)}" alt="${work.title}，${work.medium}" />
      </div>
      <div class="detail-summary">
        <p class="eyebrow">${work.category} · ${work.edition}</p>
        <h1>${work.title}</h1>
        <a class="artist-chip" href="./profile.html?user=${artist.id}">
          <img src="${artist.avatar}" alt="" />
          <span>${artist.name}</span>
          <em>${artist.role}</em>
        </a>
        <p class="detail-story">${work.story}</p>
        <div class="detail-price">
          <strong>${work.priceLabel}</strong>
          <span>${work.status}</span>
        </div>
        <div class="detail-actions">
          <button class="button" id="buyNow">立即购买</button>
          <button class="button ghost" id="favoriteToggle">${liked ? "已收藏" : "收藏作品"}</button>
          <button class="button ghost" id="messageSeller">咨询艺术家</button>
        </div>
        <div class="assurance-strip">
          <span>平台托管付款</span>
          <span>凭证复核</span>
          <span>物流追踪</span>
          <span>确认后放款</span>
        </div>
      </div>
    </section>

    <section class="detail-layout">
      <article class="detail-main">
        <h2>作品信息</h2>
        <dl class="spec-grid">
          <div><dt>艺术家</dt><dd>${artist.name}</dd></div>
          <div><dt>年份</dt><dd>${work.year}</dd></div>
          <div><dt>材质</dt><dd>${work.medium}</dd></div>
          <div><dt>尺寸</dt><dd>${work.size}</dd></div>
          <div><dt>品相</dt><dd>${work.condition}</dd></div>
          <div><dt>所在地</dt><dd>${work.location}</dd></div>
        </dl>

        <h2>艺术家声明</h2>
        <p>${artist.statement}</p>

        <h2>凭证与出处</h2>
        <div class="ledger-card">
          <div><span>作品证书</span><strong>${work.certificate}</strong></div>
          <div><span>作品来源</span><strong>${work.provenance}</strong></div>
          <div><span>信任分</span><strong>${work.trustScore}/100</strong></div>
        </div>

        <h2>物流、退换与佣金</h2>
        <div class="policy-list">
          <article><h3>物流包装</h3><p>${work.shipping}</p></article>
          <article><h3>退换复核</h3><p>${work.returnPolicy}</p></article>
          <article><h3>平台佣金</h3><p>${work.commission}</p></article>
        </div>
      </article>

      <aside class="checkout-card">
        <h2>担保订单预览</h2>
        <div class="checkout-row"><span>作品价格</span><strong>${work.priceLabel}</strong></div>
        <div class="checkout-row"><span>资金状态</span><strong>买家付款后进入平台托管</strong></div>
        <div class="checkout-row"><span>卖家放款</span><strong>${YiJiData.platform.escrowDays}</strong></div>
        <a class="button full" href="./profile.html?mode=buyer&order=${work.id}">生成订单</a>
        <p>下单前可查看证书、包装、退换规则；成交后平台向卖家收取服务佣金。</p>
      </aside>
    </section>
  `;
}

renderArtwork();
writeJsonLd();

root.addEventListener("click", (event) => {
  if (event.target.id === "favoriteToggle") {
    favorites.has(work.id) ? favorites.delete(work.id) : favorites.add(work.id);
    localStorage.setItem("yiji:favorites", JSON.stringify([...favorites]));
    renderArtwork();
  }
  if (event.target.id === "buyNow") {
    window.location.href = `./profile.html?mode=buyer&order=${work.id}`;
  }
  if (event.target.id === "messageSeller") {
    alert("已为你打开站内咨询：请确认作品、证书、物流和交付时间。");
  }
});
