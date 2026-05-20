const article = getArticle(getParams().get("article"));
const root = document.querySelector("#guideRoot");

document.title = `${article.title}｜艺集指南`;
document.querySelector("meta[name='description']").setAttribute("content", article.summary);

root.innerHTML = `
  <section class="publish-hero">
    <div>
      <p class="eyebrow">${article.type}</p>
      <h1>${article.title}</h1>
      <p>${article.summary}</p>
    </div>
    <div class="status-stack">
      <span>买家体验</span>
      <span>平台信任</span>
      <span>交易转化</span>
    </div>
  </section>
  <section class="guide-layout">
    <article class="guide-article">
      ${article.sections
        .map(
          ([title, body], index) => `
        <section>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <h2>${title}</h2>
          <p>${body}</p>
        </section>
      `
        )
        .join("")}
    </article>
    <aside class="checkout-card">
      <h2>继续浏览</h2>
      <p>指南内容用于把搜索流量转化为明确的购买或上架行动。</p>
      <a class="button full" href="./index.html#market">浏览作品市场</a>
      <a class="button ghost full" href="./publish.html">发布作品</a>
    </aside>
  </section>
`;
