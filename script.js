const marketGrid = document.querySelector("#marketGrid");
const categoryFilter = document.querySelector("#categoryFilter");
const priceFilter = document.querySelector("#priceFilter");
const sortFilter = document.querySelector("#sortFilter");
const searchInput = document.querySelector("#searchInput");

const favorites = new Set(JSON.parse(localStorage.getItem("yiji:favorites") || "[]"));

function persistFavorites() {
  localStorage.setItem("yiji:favorites", JSON.stringify([...favorites]));
}

function renderCategoryOptions() {
  const categories = [...new Set(YiJiData.works.map((work) => work.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function matchesPrice(work, value) {
  if (value === "under-50000") return work.price < 50000;
  if (value === "50000-100000") return work.price >= 50000 && work.price <= 100000;
  if (value === "over-100000") return work.price > 100000;
  return true;
}

function getFilteredWorks() {
  const keyword = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const price = priceFilter.value;
  let works = YiJiData.works.filter((work) => {
    const artist = getArtist(work.artistId);
    const haystack = [
      work.title,
      work.category,
      work.medium,
      work.tags.join(" "),
      artist.name,
      artist.city,
    ]
      .join(" ")
      .toLowerCase();
    return (
      (category === "all" || work.category === category) &&
      matchesPrice(work, price) &&
      (!keyword || haystack.includes(keyword))
    );
  });

  if (sortFilter.value === "price-asc") works.sort((a, b) => a.price - b.price);
  if (sortFilter.value === "price-desc") works.sort((a, b) => b.price - a.price);
  if (sortFilter.value === "trust") works.sort((a, b) => b.trustScore - a.trustScore);
  return works;
}

function renderMarket() {
  const works = getFilteredWorks();
  marketGrid.innerHTML = works
    .map((work) => {
      const artist = getArtist(work.artistId);
      const liked = favorites.has(work.id);
      return `
        <article class="art-card">
          <a class="art-image" href="./artwork.html?work=${work.id}" aria-label="查看${work.title}">
            <img src="${safeImage(work)}" alt="${work.title}，${work.category}" loading="lazy" />
            <span>${work.status}</span>
          </a>
          <div class="art-card-body">
            <div class="card-title-row">
              <div>
                <p class="meta">${work.category} · ${work.year}</p>
                <h3><a href="./artwork.html?work=${work.id}">${work.title}</a></h3>
              </div>
              <button class="icon-button favorite" data-favorite="${work.id}" aria-label="收藏${work.title}">
                ${liked ? "★" : "☆"}
              </button>
            </div>
            <p class="artist-line">${artist.name} · ${artist.city}</p>
            <div class="price-row">
              <strong>${work.priceLabel}</strong>
              <span>信任分 ${work.trustScore}</span>
            </div>
            <div class="tag-row">
              ${work.tags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join("")}
            </div>
            <div class="card-actions">
              <a class="button small" href="./artwork.html?work=${work.id}">立即购买</a>
              <button class="button ghost small" data-share="${work.id}">分享</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  if (!works.length) {
    marketGrid.innerHTML = `<div class="empty-state">没有找到匹配作品，试试放宽类别或价格。</div>`;
  }
}

function renderDrops() {
  document.querySelector("#dropList").innerHTML = YiJiData.drops
    .map(
      (drop, index) => `
      <a class="drop-item" href="#market">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${drop.title}</strong>
        <em>${drop.meta}</em>
        <b>${drop.time}</b>
      </a>
    `
    )
    .join("");
}

function renderEditorial() {
  document.querySelector("#editorialGrid").innerHTML = YiJiData.editorial
    .map(
      (item) => `
      <a class="editorial-card" href="./guide.html?article=${item.id}">
        <span>${item.type}</span>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <b>阅读全文</b>
      </a>
    `
    )
    .join("");
}

function shareWork(workId) {
  const work = getWork(workId);
  const url = `${window.location.origin}${window.location.pathname.replace("index.html", "")}artwork.html?work=${work.id}`;
  if (navigator.share) {
    navigator.share({ title: `艺集｜${work.title}`, text: work.seo, url });
    return;
  }
  navigator.clipboard?.writeText(url);
  alert("作品链接已复制");
}

renderCategoryOptions();
renderMarket();
renderDrops();
renderEditorial();

[categoryFilter, priceFilter, sortFilter, searchInput].forEach((control) => {
  control.addEventListener("input", renderMarket);
});

marketGrid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const shareButton = event.target.closest("[data-share]");
  if (favoriteButton) {
    const id = favoriteButton.dataset.favorite;
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    persistFavorites();
    renderMarket();
  }
  if (shareButton) shareWork(shareButton.dataset.share);
});
