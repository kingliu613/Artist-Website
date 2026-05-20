const form = document.querySelector("#publishForm");
const priceInput = form.elements.price;
const priceHint = document.querySelector("#priceHint");
const saveDraft = document.querySelector("#saveDraft");

function updatePriceHint() {
  const price = Number(priceInput.value || 0);
  const category = form.elements.category.value;
  let band = "建议补充更多历史成交信息";
  if (category === "限量版画") band = "同类首购友好价常见于 ¥12,000-¥30,000";
  if (category === "陶瓷器物") band = "同类小型器物常见于 ¥28,000-¥60,000";
  if (category === "水墨原作") band = "同类青年原作常见于 ¥60,000-¥180,000";
  const fee = Math.round(price * 0.12);
  priceHint.textContent = `${band}。按 12% 佣金估算，成交服务费约 ${formatCurrency(fee)}。`;
}

function collectDraft() {
  return Object.fromEntries(new FormData(form).entries());
}

function showSubmittedState() {
  const draft = collectDraft();
  localStorage.setItem("yiji:latestDraft", JSON.stringify(draft));
  form.innerHTML = `
    <div class="submitted-state">
      <span>已提交平台审核</span>
      <h1>${draft.title}</h1>
      <p>审核员会核对作品图片、凭证、出处、物流方案和定价说明。通过后作品进入市场，并显示一口价担保交易标识。</p>
      <a class="button" href="./profile.html?mode=seller">查看卖家中心</a>
      <a class="button ghost" href="./index.html#market">返回市场</a>
    </div>
  `;
}

priceInput.addEventListener("input", updatePriceHint);
form.elements.category.addEventListener("change", updatePriceHint);
saveDraft.addEventListener("click", () => {
  localStorage.setItem("yiji:latestDraft", JSON.stringify(collectDraft()));
  saveDraft.textContent = "已保存";
  setTimeout(() => (saveDraft.textContent = "保存草稿"), 1400);
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  showSubmittedState();
});

updatePriceHint();
