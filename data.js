const YiJiData = {
  platform: {
    commissionRate: "12%",
    escrowDays: "买家确认收货后 72 小时内放款",
    firstBuyerBenefit: "首单平台鉴证与包装险免费",
    seedArtistBenefit: "首批入驻艺术家 90 天低佣金扶持",
  },
  artists: {
    linyue: {
      id: "linyue",
      name: "林悦工作室",
      role: "青年水墨艺术家",
      city: "杭州",
      school: "中国美术学院",
      avatar: "./public/assets/avatars/me.svg",
      followers: "9.1 万",
      sold: 38,
      rating: "4.9",
      statement:
        "我把纸本水墨当作一套可被追踪的时间系统：每一层墨色、纸张批次和装裱方式都记录在作品凭证里。",
      bio:
        "林悦长期关注江南水系、城市边缘与手工纸的材料变化，作品被青年藏家和空间设计师持续收藏。",
      badges: ["平台认证艺术家", "7 日内发货", "支持担保交易"],
    },
    chenmo: {
      id: "chenmo",
      name: "陈墨",
      role: "版画与综合材料",
      city: "上海",
      school: "上海大学美术学院",
      avatar: "./public/assets/avatars/curator.svg",
      followers: "4.8 万",
      sold: 24,
      rating: "4.8",
      statement:
        "一层朱色不是符号，而是我在苏河边行走时留下的时间戳。",
      bio:
        "陈墨的作品以限量版画和城市材料拓印为主，适合第一次购买原作和小尺幅收藏。",
      badges: ["限量编号完整", "工作室直发", "可开发票"],
    },
    anqi: {
      id: "anqi",
      name: "安岐",
      role: "陶瓷器物创作者",
      city: "景德镇",
      school: "景德镇陶瓷大学",
      avatar: "./public/assets/avatars/collector.svg",
      followers: "6.3 万",
      sold: 31,
      rating: "4.9",
      statement:
        "限量版可以像设计物一样交易，也要保留进入工作室的亲密感。",
      bio:
        "安岐专注小型陶瓷器物、手工釉色和桌面收藏，作品适合家居陈设与礼赠。",
      badges: ["破损包赔", "附窑口记录", "可预约工作室"],
    },
  },
  works: [
    {
      id: "river-village",
      title: "江村渔乐",
      artistId: "linyue",
      category: "水墨原作",
      price: 128000,
      priceLabel: "¥128,000",
      status: "可一口价购买",
      image: "./public/assets/generated-art/yiji-art-01.svg",
      fallbackImage: "./public/assets/pearl-river-loop.svg",
      medium: "设色纸本",
      size: "68 x 92 cm",
      year: "2025",
      edition: "唯一原作",
      location: "杭州工作室",
      condition: "品相良好，已完成无酸装裱",
      certificate: "平台电子凭证 + 艺术家亲签证书",
      provenance: "艺术家本人委托艺集首发",
      shipping: "顺丰艺术品专线，木箱加防潮膜，平台包装险覆盖",
      returnPolicy: "签收后 48 小时内如与描述明显不符，可申请平台复核",
      commission: "成交后平台向卖家收取 12% 服务佣金",
      trustScore: 96,
      tags: ["青年原作", "水墨", "江南", "平台担保"],
      story:
        "作品来自艺术家 2025 年春季的江南水系系列，画面保留纸张纤维和多次罩染痕迹，适合客厅、书房与小型机构空间。",
      seo: "青年艺术家水墨原作 江村渔乐 设色纸本 一口价担保交易",
    },
    {
      id: "clouds-waves",
      title: "巫峡云涛",
      artistId: "linyue",
      category: "水墨原作",
      price: 196000,
      priceLabel: "¥196,000",
      status: "可一口价购买",
      image: "./public/assets/generated-art/yiji-art-02.svg",
      fallbackImage: "./public/assets/porcelain-signal.svg",
      medium: "水墨纸本",
      size: "96 x 120 cm",
      year: "2024",
      edition: "唯一原作",
      location: "杭州工作室",
      condition: "画芯完整，附装裱前影像",
      certificate: "纸质证书 + 平台影像存证",
      provenance: "艺术家工作室直供",
      shipping: "专业画箱运输，发货前二次拍照确认",
      returnPolicy: "平台鉴证信息不一致时支持复核退款",
      commission: "成交后平台向卖家收取 12% 服务佣金",
      trustScore: 94,
      tags: ["大尺幅", "山水", "机构空间", "可议展陈"],
      story:
        "以峡江云气为线索，将传统皴法转译成更适合当代空间的灰阶层次。",
      seo: "青年水墨艺术家 山水原作 巫峡云涛 担保购买",
    },
    {
      id: "spiral-jar",
      title: "螺旋纹陶罐",
      artistId: "anqi",
      category: "陶瓷器物",
      price: 36000,
      priceLabel: "¥36,000",
      status: "可一口价购买",
      image: "./public/assets/generated-art/yiji-art-03.svg",
      fallbackImage: "./public/assets/red-terrace.svg",
      medium: "手工拉坯、铁釉",
      size: "高 31 cm",
      year: "2025",
      edition: "1/6",
      location: "景德镇工作室",
      condition: "无磕碰，底部有作者刻款",
      certificate: "窑口记录 + 作者签名卡",
      provenance: "景德镇春季小器物专题",
      shipping: "双层抗震包装，破损包赔",
      returnPolicy: "签收开箱视频完整时支持破损理赔",
      commission: "成交后平台向卖家收取 10% 早期扶持佣金",
      trustScore: 92,
      tags: ["陶瓷", "限量", "景德镇", "陈设"],
      story:
        "螺旋纹来自手部转速与釉色流动的叠加，适合桌面、玄关和小型收藏柜。",
      seo: "景德镇青年陶瓷艺术 螺旋纹陶罐 限量器物",
    },
    {
      id: "bamboo-studio",
      title: "十竹斋画谱",
      artistId: "chenmo",
      category: "限量版画",
      price: 19800,
      priceLabel: "¥19,800",
      status: "可一口价购买",
      image: "./public/assets/generated-art/yiji-art-04.svg",
      fallbackImage: "./public/assets/afterimage-market.svg",
      medium: "木版水印、宣纸",
      size: "42 x 58 cm",
      year: "2025",
      edition: "8/24",
      location: "上海版画工作室",
      condition: "未装框，纸面平整",
      certificate: "限量编号 + 工作室水印",
      provenance: "苏河湾限量版画专题首发",
      shipping: "画筒或平装箱可选",
      returnPolicy: "编号、纸张或签名不符支持平台复核",
      commission: "成交后平台向卖家收取 8% 首发佣金",
      trustScore: 90,
      tags: ["版画", "小预算", "首购友好", "限量"],
      story:
        "从古籍图像中抽取竹影和窗格，适合第一次购买艺术作品的年轻藏家。",
      seo: "青年艺术家限量版画 十竹斋画谱 首购艺术品",
    },
    {
      id: "ancient-masters",
      title: "古意册页",
      artistId: "linyue",
      category: "册页",
      price: 68000,
      priceLabel: "¥68,000",
      status: "可一口价购买",
      image: "./public/assets/generated-art/yiji-art-05.svg",
      fallbackImage: "./public/assets/mountain-ledger.svg",
      medium: "水墨设色册页",
      size: "12 开，每开 28 x 34 cm",
      year: "2023",
      edition: "唯一原作",
      location: "杭州工作室",
      condition: "函套完整，轻微翻阅痕迹",
      certificate: "平台电子凭证 + 艺术家签名页",
      provenance: "艺术家早期系列回流",
      shipping: "恒温包装，保价运输",
      returnPolicy: "与品相描述不符时支持平台复核",
      commission: "成交后平台向卖家收取 12% 服务佣金",
      trustScore: 93,
      tags: ["册页", "早期作品", "纸本", "可收藏"],
      story:
        "一组更安静的早期册页，适合偏爱传统形式和可翻阅作品的藏家。",
      seo: "青年艺术家册页 古意册页 水墨设色 担保交易",
    },
    {
      id: "lion-jar",
      title: "狮首耳罐",
      artistId: "anqi",
      category: "陶瓷器物",
      price: 52000,
      priceLabel: "¥52,000",
      status: "可一口价购买",
      image: "./public/assets/generated-art/yiji-art-06.svg",
      fallbackImage: "./public/assets/ink-current.svg",
      medium: "手工塑形、青白釉",
      size: "高 38 cm",
      year: "2024",
      edition: "唯一器物",
      location: "景德镇工作室",
      condition: "釉面完整，耳部无修补",
      certificate: "作者签名证书 + 烧成记录",
      provenance: "艺术家工作室直供",
      shipping: "木箱运输，开箱验收指引",
      returnPolicy: "运输破损由平台协助理赔",
      commission: "成交后平台向卖家收取 10% 早期扶持佣金",
      trustScore: 91,
      tags: ["陶瓷", "唯一器物", "空间陈设", "工作室直发"],
      story:
        "狮首耳部以手工塑形完成，釉色在肩部形成自然流动，是一件有体量感的空间器物。",
      seo: "青年陶瓷艺术 狮首耳罐 唯一器物 一口价交易",
    },
  ],
  drops: [
    {
      title: "苏河湾限量版画",
      meta: "上海版画工作室 · 24 件作品",
      time: "周五 20:00",
    },
    {
      title: "景德镇小器物",
      meta: "陶瓷原作与小型器物 · 16 件作品",
      time: "周六 14:00",
    },
    {
      title: "九五后水墨",
      meta: "青年艺术家专题 · 31 件作品",
      time: "周日 19:30",
    },
  ],
  editorial: [
    {
      id: "buyer-six-checks",
      title: "第一次买青年原作，先看哪 6 个信息？",
      type: "买家指南",
      summary: "价格、材质、尺寸、凭证、物流和退换规则要在下单前一次看懂。",
      sections: [
        ["价格", "确认标价是否为一口价，以及是否包含装裱、包装、运输和保险。"],
        ["材质", "纸本、陶瓷、版画和综合材料的保存方式不同，页面要写清楚媒介和工艺。"],
        ["尺寸", "下单前用墙面、桌面或收藏柜尺寸对照，避免作品到手后无法安置。"],
        ["凭证", "优先选择有艺术家声明、证书、编号、影像存证或工作室记录的作品。"],
        ["物流", "艺术品需要包装说明、发货前影像、物流单号和签收状态。"],
        ["退换", "看清楚复核条件、申请时限和平台介入方式。"],
      ],
    },
    {
      id: "ledger-lifecycle",
      title: "一张电子凭证如何记录作品的生命周期",
      type: "平台透明度",
      summary: "从艺术家声明、上架审核到成交、物流和再次转售，都可被追踪。",
      sections: [
        ["上架", "艺术家提交作品资料、细节图和证书材料，平台形成第一版电子凭证。"],
        ["审核", "平台核对作品基础信息、图片、出处、价格和物流方案。"],
        ["成交", "订单生成后记录成交价格、买卖双方确认节点和平台佣金规则。"],
        ["物流", "发货前包装影像、物流单号和签收状态进入作品记录。"],
        ["复核", "如买家提出争议，凭证记录可以帮助平台判断描述是否一致。"],
        ["再流通", "未来转售时，历史成交和凭证记录会降低新买家的信任成本。"],
      ],
    },
    {
      id: "artist-sales-channel",
      title: "青年艺术家如何把工作室变成稳定销售渠道",
      type: "卖家入驻",
      summary: "用系列化作品、清楚定价和持续内容更新，让藏家敢于第一次下单。",
      sections: [
        ["系列化", "用 6-12 件同主题作品建立可理解的价格梯度。"],
        ["定价", "给出尺寸、材料、创作周期和近期成交依据。"],
        ["凭证", "每件作品准备签名证书、创作声明、细节图和工作室记录。"],
        ["内容", "持续更新创作过程、材料实验和布展照片。"],
        ["服务", "提前写好包装、发货、破损处理和复核规则。"],
        ["复购", "用收藏提醒、新作 Drop 和专题页，让老买家知道下一次该看什么。"],
      ],
    },
  ],
};

const staticSampleTemplates = YiJiData.works.map((work) => ({
  ...work,
  baseTitle: work.title,
}));

while (YiJiData.works.length < 50) {
  const index = YiJiData.works.length - 6;
  const template = staticSampleTemplates[index % staticSampleTemplates.length];
  const price = 18000 + ((index * 7300) % 162000);
  YiJiData.works.push({
    ...template,
    id: `sample-${String(index + 1).padStart(2, "0")}`,
    title: `${template.baseTitle} 样品${index + 1}`,
    image: `./public/assets/generated-art/yiji-art-${String(index + 7).padStart(2, "0")}.svg`,
    price,
    priceLabel: `¥${price.toLocaleString("zh-CN")}`,
    year: String(2022 + (index % 5)),
    status: "可一口价购买",
    trustScore: 88 + (index % 10),
    condition: "品相良好，页面已记录细节图、背面图和证书图",
    certificate: "平台电子凭证 + 作者/工作室确认材料",
    provenance: "艺术家工作室直供，平台审核后上架",
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(value);
}

function getArtist(id) {
  return YiJiData.artists[id] || YiJiData.artists.linyue;
}

function getWork(id) {
  return YiJiData.works.find((work) => work.id === id) || YiJiData.works[0];
}

function getArticle(id) {
  return YiJiData.editorial.find((item) => item.id === id) || YiJiData.editorial[0];
}

function getParams() {
  return new URLSearchParams(window.location.search);
}

function safeImage(work) {
  return work.image || work.fallbackImage;
}
