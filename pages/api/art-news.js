const ONE_DAY_SECONDS = 60 * 60 * 24;
const FEED_TIMEOUT_MS = 8000;
const TRANSLATE_TIMEOUT_MS = 7000;

let cachedPayload = null;

const artFeeds = [
  { source: "ARTnews", label: "艺术新闻社", url: "https://www.artnews.com/feed/" },
  { source: "Hyperallergic", label: "艺术评论", url: "https://hyperallergic.com/feed/" },
  { source: "Artforum", label: "艺术论坛", url: "https://www.artforum.com/feed/" },
];

const artIncludeTerms = [
  "art",
  "artist",
  "artwork",
  "painting",
  "sculpture",
  "museum",
  "gallery",
  "exhibition",
  "biennale",
  "auction",
  "christie",
  "sotheby",
  "phillips",
  "collector",
  "collection",
  "curator",
  "curatorial",
  "installation",
  "contemporary",
  "modern",
  "visual",
  "portrait",
  "canvas",
  "studio",
  "fair",
  "dealer",
  "provenance",
];

const nonArtExcludeTerms = [
  "movie",
  "film festival",
  "television",
  "tv ",
  "music",
  "album",
  "concert",
  "fashion week",
  "sports",
  "football",
  "basketball",
  "restaurant",
];

const titlePhraseMap = [
  ["christie’s", "佳士得"],
  ["christie's", "佳士得"],
  ["sotheby’s", "苏富比"],
  ["sotheby's", "苏富比"],
  ["phillips", "富艺斯"],
  ["art basel", "巴塞尔艺术展"],
  ["frieze", "Frieze 艺术博览会"],
  ["museum", "博物馆"],
  ["gallery", "画廊"],
  ["galleries", "画廊"],
  ["auction", "拍卖"],
  ["auctions", "拍卖"],
  ["sale", "专场"],
  ["sales", "专场"],
  ["exhibition", "展览"],
  ["exhibitions", "展览"],
  ["artist", "艺术家"],
  ["artists", "艺术家"],
  ["painting", "绘画"],
  ["paintings", "绘画"],
  ["sculpture", "雕塑"],
  ["sculptures", "雕塑"],
  ["collection", "收藏"],
  ["collector", "藏家"],
  ["market", "市场"],
  ["record", "纪录"],
  ["records", "纪录"],
  ["biennale", "双年展"],
];

const chineseTitleTemplates = {
  "市场": [
    "艺术市场｜重要拍卖与成交纪录更新",
    "艺术市场｜藏家、拍卖行与价格动态",
    "艺术市场｜高价作品和交易趋势观察",
    "艺术市场｜今日拍卖新闻速览",
  ],
  "展览": [
    "展览现场｜博物馆与策展项目更新",
    "展览现场｜双年展、机构展与公共项目",
    "展览现场｜值得关注的艺术机构动态",
    "展览现场｜全球展览新闻速览",
  ],
  "艺术家": [
    "艺术家动态｜创作、画廊与作品语境更新",
    "艺术家动态｜工作室、代理与展览机会",
    "艺术家动态｜近期作品和行业关注",
    "艺术家动态｜今日艺术家新闻速览",
  ],
  "艺术新闻": [
    "艺术行业｜今日视觉艺术新闻更新",
    "艺术行业｜博物馆、画廊与市场动态",
    "艺术行业｜全球艺术媒体新闻速览",
    "艺术行业｜值得关注的艺术新闻",
  ],
};

const fallbackImages = [
  "https://openaccess-cdn.clevelandart.org/1977.7/1977.7_web.jpg",
  "https://images.metmuseum.org/CRDImages/as/web-large/DP-14153-068.jpg",
  "https://www.artic.edu/iiif/2/f42b07aa-4329-2f6d-6c9b-04896215167d/full/843,/0/default.jpg",
  "https://openaccess-cdn.clevelandart.org/1962.154/1962.154_web.jpg",
  "https://images.metmuseum.org/CRDImages/as/web-large/DP267504.jpg",
];

const fallbackArticles = [
  {
    title: "全球艺术市场观察：画廊、博物馆与拍卖新闻每日更新",
    source: "艺集编辑台",
    url: "/guide",
    image: fallbackImages[0],
    publishedAt: new Date().toISOString(),
    summary: "实时新闻源暂时不可用，先展示编辑精选入口。页面会继续在后台尝试恢复新闻拉取。",
    category: "市场",
  },
  {
    title: "收藏前需要看懂的作品凭证、来源与展览记录",
    source: "艺集指南",
    url: "/guide",
    image: fallbackImages[1],
    publishedAt: new Date().toISOString(),
    summary: "用作品来源、证书、影像存证和物流规则判断一件作品是否适合进入收藏。",
    category: "收藏",
  },
  {
    title: "青年艺术家发布作品前的价格、图像与声明准备",
    source: "艺集指南",
    url: "/publish",
    image: fallbackImages[2],
    publishedAt: new Date().toISOString(),
    summary: "发布作品前，先准备清晰图片、尺寸材质、创作说明、价格区间和运输方式。",
    category: "发布",
  },
];

function dayStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function parseFeedDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function cleanText(value, fallback = "") {
  return String(value || fallback).replace(/\s+/g, " ").trim();
}

function decodeEntities(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(value = "") {
  return cleanText(decodeEntities(value).replace(/<[^>]+>/g, " "));
}

function getTag(xml, tag) {
  const escaped = tag.replace(":", "\\:");
  const match = xml.match(new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)</${escaped}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function getAttr(xml, tagPattern, attr) {
  const match = xml.match(new RegExp(`<${tagPattern}[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function extractImage(item, index) {
  const directImage =
    getAttr(item, "media:content", "url") ||
    getAttr(item, "media:thumbnail", "url") ||
    getAttr(item, "enclosure", "url") ||
    getAttr(getTag(item, "content:encoded"), "img", "src") ||
    getAttr(getTag(item, "description"), "img", "src");
  const imageMatches = [...item.matchAll(/https?:[^\s"'<>]+(?:jpg|jpeg|png|webp|gif)/gi)].map((match) => decodeEntities(match[0]));
  const image = [directImage, ...imageMatches].find((candidate) => {
    const value = String(candidate || "").toLowerCase();
    return value && !value.includes("lazyload") && !value.includes("placeholder") && !value.includes("fallback.gif");
  });
  return image || fallbackImages[index % fallbackImages.length];
}

function articleCategory(title) {
  const lower = title.toLowerCase();
  if (lower.includes("auction") || lower.includes("market") || lower.includes("sale")) return "市场";
  if (lower.includes("museum") || lower.includes("exhibition") || lower.includes("biennale")) return "展览";
  if (lower.includes("gallery") || lower.includes("artist")) return "艺术家";
  return "艺术新闻";
}

function isArtArticle(article) {
  const haystack = `${article.title} ${stripHtml(article.summary || "")} ${article.url}`.toLowerCase();
  const hasArtSignal = artIncludeTerms.some((term) => haystack.includes(term));
  const hasStrongArtSignal = /\b(art|artist|artwork|museum|gallery|exhibition|auction|painting|sculpture)\b/i.test(haystack);
  const excluded = nonArtExcludeTerms.some((term) => haystack.includes(term));
  return hasArtSignal && hasStrongArtSignal && !excluded;
}

function hasLongEnglishText(value) {
  return /[A-Za-z]{2,}/.test(String(value || ""));
}

function makeChineseTitle(title, category, source, index = 0) {
  let translated = title;
  for (const [english, chinese] of titlePhraseMap) {
    translated = translated.replace(new RegExp(english, "gi"), chinese);
  }
  if (translated && !hasLongEnglishText(translated)) return translated;
  const templates = chineseTitleTemplates[category] || chineseTitleTemplates["艺术新闻"];
  return `${templates[index % templates.length]}｜${source}`;
}

function makeChineseSummary(article, category) {
  const topicMap = {
    "市场": "这条新闻涉及艺术市场、拍卖成交、价格纪录或藏家动向，适合关注作品定价和交易热度的用户阅读。",
    "展览": "这条新闻涉及博物馆、展览、双年展或策展项目，适合关注艺术家履历和公共展示机会的用户阅读。",
    "艺术家": "这条新闻涉及艺术家、画廊或创作实践，适合关注作者成长路径和作品语境的用户阅读。",
    "艺术新闻": "这条新闻来自艺术媒体，涉及视觉艺术行业动态，可作为了解市场和展览语境的参考。",
  };
  const sourceText = article.sourceLabel ? `来源：${article.sourceLabel}。` : "";
  return `${sourceText}${topicMap[category] || topicMap["艺术新闻"]}`;
}

async function translateText(text) {
  const clean = cleanText(text);
  if (!clean || /[\u4e00-\u9fff]/.test(clean)) return clean;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TRANSLATE_TIMEOUT_MS);
  try {
    const params = new URLSearchParams({
      client: "gtx",
      sl: "en",
      tl: "zh-CN",
      dt: "t",
      q: clean,
    });
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params.toString()}`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`translate returned ${response.status}`);
    const data = await response.json();
    return cleanText((data?.[0] || []).map((part) => part?.[0] || "").join(""));
  } finally {
    clearTimeout(timeout);
  }
}

async function normalizeArticle(article, index) {
  const title = cleanText(article.title, "Untitled art news");
  const summary = stripHtml(article.summary || article.description || title).slice(0, 180);
  const category = articleCategory(`${title} ${article.url} ${summary}`);
  let titleZh = "";
  let summaryZh = "";
  try {
    [titleZh, summaryZh] = await Promise.all([
      translateText(title),
      translateText(summary),
    ]);
  } catch {
    titleZh = "";
    summaryZh = "";
  }
  return {
    id: `${article.url || title}-${index}`,
    title: titleZh && !hasLongEnglishText(titleZh) ? titleZh : makeChineseTitle(title, category, article.sourceLabel || article.source, index),
    originalTitle: title,
    source: article.sourceLabel || article.source,
    originalSource: article.source,
    url: article.url,
    image: article.image || fallbackImages[index % fallbackImages.length],
    publishedAt: parseFeedDate(article.publishedAt),
    summary: summaryZh || makeChineseSummary(article, category),
    originalSummary: summary,
    category,
  };
}

async function fetchFeed(feed) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);
  try {
    const response = await fetch(feed.url, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`${feed.source} returned ${response.status}`);
    const xml = await response.text();
    const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
    return items.map((item, index) => ({
      title: stripHtml(getTag(item, "title")),
      url: cleanText(getTag(item, "link")),
      source: feed.source,
      sourceLabel: feed.label,
      publishedAt: cleanText(getTag(item, "pubDate") || getTag(item, "dc:date")),
      summary: getTag(item, "description") || getTag(item, "content:encoded"),
      image: extractImage(item, index),
    }));
  } finally {
    clearTimeout(timeout);
  }
}

async function loadNews() {
  const today = dayStamp();
  if (cachedPayload?.day === today) return cachedPayload;

  const feedResults = await Promise.allSettled(artFeeds.map(fetchFeed));
  const articles = feedResults.flatMap((result) => (result.status === "fulfilled" ? result.value : []));

  const seen = new Set();
  const normalized = (await Promise.all(articles
    .filter((article) => article.url && article.title)
    .filter(isArtArticle)
    .slice(0, 20)
    .map(normalizeArticle)))
    .filter((article) => {
      const key = article.url.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 12);

  cachedPayload = {
    day: today,
    generatedAt: new Date().toISOString(),
    source: "艺术媒体聚合",
    refresh: "daily",
    articles: normalized.length ? normalized : fallbackArticles,
  };
  return cachedPayload;
}

export async function getArtNewsPayload() {
  return loadNews();
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", `public, s-maxage=${ONE_DAY_SECONDS}, stale-while-revalidate=${ONE_DAY_SECONDS}`);

  try {
    res.status(200).json(await loadNews());
  } catch (error) {
    res.status(200).json({
      day: dayStamp(),
      generatedAt: new Date().toISOString(),
      source: "艺集 fallback",
      refresh: "daily",
      error: error.message,
      articles: fallbackArticles,
    });
  }
}
