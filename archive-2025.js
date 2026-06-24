// 2025 Archive data and calculations
document.addEventListener('DOMContentLoaded', () => {
  // --- 2025 Historical Dataset (June 20 to July 20, 2025 - Peak Squid Metal Season) ---
  const ARCHIVE_FEEDS = [
    {
      id: "a1",
      media: 'blog',
      date: '2025-07-19',
      author: '一美丸 (2025年釣果アーカイブ)',
      url: 'https://ameblo.jp/ichimimaru/',
      body: 'マイカメタル＆アジング出船！深夜の時合にオモリグで大剣（弁慶サイズ）が連発！棚はボトム付近の45m。潮が早く25号シンカーのオモリグが有利でした。スッテは赤黄とブラック系エギに反応。竿頭で35杯、良型主体でお土産十分でした。',
      extracted: { catch: 35, minDepth: 45, maxDepth: 48, color: '赤黄, 黒系', sutte: '25号', startTime: '22:00頃', startDepth: '45m', action: 'ステイ', rig: 'オモリグ', size: '良型・大型' }
    },
    {
      id: "a2",
      media: 'blog',
      date: '2025-07-17',
      author: '竹宝丸 (2025年釣果アーカイブ)',
      url: 'https://ameblo.jp/takehoumaru/',
      body: '半夜便マイカメタル！点灯直後から中層30m付近でラッシュあり！イカメタル仕掛けの軽いメタル（12号）でスローフォールすると高反応でした。カラーはピンクグローと赤緑。新子（小型）が多いですがアタリが多くて楽しめました。トップ42杯！',
      extracted: { catch: 42, minDepth: 25, maxDepth: 35, color: 'ピンク, グロー, 赤緑', sutte: '12号', startTime: '点灯直後', startDepth: '30m', action: 'スローフォール', rig: 'イカメタル', size: '小型主体' }
    },
    {
      id: "a3",
      media: 'blog',
      date: '2025-07-14',
      author: '豊漁丸 (2025年釣果アーカイブ)',
      url: 'https://ameblo.jp/houryoumaru/',
      body: '本日のマイカメタル。潮がやや緩みイカメタル15号で快適に釣れました。棚は20m〜30mと浅めで安定。アタリカラーはケイムラと赤緑。シェイクして長めのステイでアタリが出ました。サイズは大小混ざり。竿頭は31杯。',
      extracted: { catch: 31, minDepth: 20, maxDepth: 30, color: 'ケイムラ, 赤緑', sutte: '15号', startTime: '20:30頃', startDepth: '20m', action: 'シェイク, ステイ', rig: 'イカメタル', size: '大小混ざり' }
    },
    {
      id: "a4",
      media: 'blog',
      date: '2025-07-11',
      author: '新漁丸 (2025年釣果アーカイブ)',
      url: 'https://ameblo.jp/shinryoumaru-tsuruga/',
      body: 'マイカ半夜便。集魚灯点灯後、しばらくボトムでオモリグが好調。21時半頃から棚が30m前後に浮き、イカメタルでも乗り出しました。エギはパープル系と赤黄。トップは38杯で良型マイカがよく混ざりました。',
      extracted: { catch: 38, minDepth: 30, maxDepth: 45, color: '紫系, 赤黄', sutte: '20号', startTime: '21:30頃', startDepth: '45m', action: '不明', rig: '両方', size: '良型・大型' }
    },
    {
      id: "a5",
      media: 'blog',
      date: '2025-07-08',
      author: 'シーモンキー (2025年釣果アーカイブ)',
      url: 'https://seamonkey2011.net/',
      body: '敦賀沖イカメタル便。ウネリが少しありましたが集魚灯点灯後からコンスタントに乗りました。棚は25m〜35m。ヒットスッテはフルグローとピンク。キャストして広く探るとアタリが多かったです。竿頭は29杯。新子が主体です。',
      extracted: { catch: 29, minDepth: 25, maxDepth: 35, color: 'グロー, ピンク', sutte: '15号', startTime: '点灯後', startDepth: '25m', action: 'キャスト', rig: 'イカメタル', size: '小型主体' }
    },
    {
      id: "a6",
      media: 'blog',
      date: '2025-07-05',
      author: '一美丸 (2025年釣果アーカイブ)',
      url: 'https://ameblo.jp/ichimimaru/',
      body: 'アカイカ半夜便。本日も潮が早くオモリグ大活躍！25〜30号シンカー必須でした。ボトム付近で丁寧にステイさせると良型がヒット。カラーは赤緑とケイムラ。竿頭は34杯。',
      extracted: { catch: 34, minDepth: 40, maxDepth: 50, color: '赤緑, ケイムラ', sutte: '25号', startTime: '21:00頃', startDepth: '40m', action: 'ステイ', rig: 'オモリグ', size: '良型・大型' }
    },
    {
      id: "a7",
      media: 'blog',
      date: '2025-07-02',
      author: '豊漁丸 (2025年釣果アーカイブ)',
      url: 'https://ameblo.jp/houryoumaru/',
      body: 'マイカ便出船！月夜のためかイカが深く散らばりボトムの45m付近に反応が集中。オモリグのキャスト＆スローフォールでしか喰わないテクニカルな一日。アタリカラーは黒系と赤黄。トップは22杯と月夜の試練でした。大小混ざり。',
      extracted: { catch: 22, minDepth: 40, maxDepth: 48, color: '黒系, 赤黄', sutte: '25号', startTime: '20:30頃', startDepth: '45m', action: 'キャスト, スローフォール', rig: 'オモリグ', size: '大小混ざり' }
    },
    {
      id: "a8",
      media: 'blog',
      date: '2025-06-29',
      author: '竹宝丸 (2025年釣果アーカイブ)',
      url: 'https://ameblo.jp/takehoumaru/',
      body: 'マイカメタル出船。闇夜に入り、集魚灯の効きが抜群！15m〜25mの超浅棚で新子の数釣りが楽しめました！イカメタル10〜12号仕掛けでフォール中心に誘うのがベスト。ヒットカラーは赤緑とピンク。トップで48杯と大爆発！',
      extracted: { catch: 48, minDepth: 15, maxDepth: 25, color: '赤緑, ピンク', sutte: '12号', startTime: '点灯直後', startDepth: '20m', action: 'フォール', rig: 'イカメタル', size: '小型主体' }
    },
    {
      id: "a9",
      media: 'blog',
      date: '2025-06-26',
      author: '新漁丸 (2025年釣果アーカイブ)',
      url: 'https://ameblo.jp/shinryoumaru-tsuruga/',
      body: '本日のマイカメタル。浅棚の20m付近で順調に釣れました。スローフォールでじっくりスッテを見せるのがコツ。赤緑、ブルーグローにアタリ。サイズは中小型主体。トップで36杯でした。',
      extracted: { catch: 36, minDepth: 20, maxDepth: 25, color: '赤緑, 青系, グロー', sutte: '15号', startTime: '20:00頃', startDepth: '20m', action: 'スローフォール', rig: 'イカメタル', size: '小型主体' }
    },
    {
      id: "a10",
      media: 'blog',
      date: '2025-06-23',
      author: '春定丸 (2025年釣果アーカイブ)',
      url: 'https://ameblo.jp/harusadamaru/',
      body: 'マイカ・スルメ便。点灯後しばらく無音でしたが、21時頃から25m付近でアタリ連発！仕掛けはオモリグとイカメタルの両方で釣れました。赤緑とピンクに好反応。竿頭32杯。中型マイカがよく交ざりました。',
      extracted: { catch: 32, minDepth: 25, maxDepth: 30, color: '赤緑, ピンク', sutte: '15号', startTime: '21:00頃', startDepth: '25m', action: '不明', rig: '両方', size: '中型主体' }
    },
    {
      id: "a11",
      media: 'blog',
      date: '2025-06-20',
      author: '一美丸 (2025年釣果アーカイブ)',
      url: 'https://ameblo.jp/ichimimaru/',
      body: 'シーズン初期のマイカメタル便！棚はボトム付近（35m〜40m）で開始。点灯後に25m付近まで浮いてきました。オモリグのロングステイで良型マイカがよく乗りました。パープルエギ、赤緑。トップで26杯。良型混ざり。',
      extracted: { catch: 26, minDepth: 25, maxDepth: 40, color: '紫系, 赤緑', sutte: '20号', startTime: '点灯後', startDepth: '35m', action: 'ロングステイ, ステイ', rig: 'オモリグ', size: '良型・大型' }
    }
  ];

  // Static weather history matching simulated days (June 20 - July 20, 2025)
  const STATIC_WEATHER_LOG = [
    { icon: '☀️', cond: '快晴', windDir: '南西', windSpd: '2.5m', wave: '0.3m', rough: false },
    { icon: '☁️', cond: '曇り', windDir: '北東', windSpd: '3.1m', wave: '0.4m', rough: false },
    { icon: '☔', cond: '雨', windDir: '北西', windSpd: '5.2m', wave: '0.9m', rough: true },
    { icon: '☁️', cond: '曇のち晴', windDir: '南', windSpd: '2.0m', wave: '0.2m', rough: false },
    { icon: '☀️', cond: '晴れ', windDir: '南西', windSpd: '3.0m', wave: '0.4m', rough: false }
  ];

  // --- UI Elements ---
  const headerMoonPhaseEl = document.getElementById('header-moon-phase');
  const headerTideNameEl = document.getElementById('header-tide-name');
  
  const detailMoonAgeEl = document.getElementById('detail-moon-age');
  const detailMoonNameEl = document.getElementById('detail-moon-name');
  const detailMoonIlluminationEl = document.getElementById('detail-moon-illumination');
  const moonTackleTipEl = document.getElementById('moon-tackle-tip');
  const moonShadowGraphic = document.getElementById('moon-shadow-graphic');
  const moonForecastContainer = document.getElementById('moon-forecast-container');

  const tideCanvas = document.getElementById('tide-canvas');
  const tideTimesList = document.getElementById('tide-times-list');
  const weatherForecastContainer = document.getElementById('weather-forecast-container');
  const datePicker = document.getElementById('archive-date-picker');

  // Search & Feeds list
  const feedList = document.getElementById('feed-list');
  const noFeedsMsg = document.getElementById('no-feeds-msg');
  const feedSearch = document.getElementById('feed-search');
  const trendsTimelineContainer = document.getElementById('trends-timeline-container');

  let searchQuery = '';

  // --- Moon Calculation (Calibrated for 2025 dates) ---
  function getMoonPhase(date) {
    const jd = (date.getTime() / 86400000) + 2440587.5;
    const knownNewMoon = 2460290.35; // Known reference point
    const synodicMonth = 29.530588853;
    
    let age = (jd - knownNewMoon) % synodicMonth;
    if (age < 0) age += synodicMonth;
    
    return {
      age: Math.round(age * 10) / 10,
      normalized: age / synodicMonth
    };
  }

  function getMoonDetails(age, normPhase) {
    let name = '若葉月';
    let illumination = Math.round((1 - Math.cos(normPhase * 2 * Math.PI)) * 50);
    let tip = '';

    if (age < 1.5 || age >= 28) {
      name = '新月';
      tip = '🌟 闇夜チャンス！集魚灯が効きやすく、浅棚（15m〜25m）でイカメタルが爆発しやすい時期です。赤緑やピンク系のスッテが効果的。';
    } else if (age >= 1.5 && age < 6.5) {
      name = '三日月';
      tip = '🌙 月明かりが弱く好条件。前半はボトムからじっくり探し、点灯後は中層（25m〜35m）のスローフォールで狙いましょう。';
    } else if (age >= 6.5 && age < 9.5) {
      name = '上弦の月';
      tip = '🌓 月が少し明るくなります。潮が動くためレンジが散らばりやすい。イカメタルとオモリグの両仕掛けを準備してください。';
    } else if (age >= 9.5 && age < 13.5) {
      name = '十日余りの月';
      tip = '🌔 月明かりが強まり、イカの警戒心が高まります。船の明暗の境界にキャストして広く探るのが有効。';
    } else if (age >= 13.5 && age < 16.5) {
      name = '満月';
      tip = '🌕 満月期の大潮・中潮。月光でイカが分散し、棚が40m〜ボトム付近と深くなりやすい。シルエットの際立つ黒系や赤黄エギでのオモリグが強力。';
    } else if (age >= 16.5 && age < 21.5) {
      name = '十六夜月';
      tip = '🌘 満月から欠けていく月。前半は月が高いため深場狙い、深夜に向かって浅棚に浮いてくるチャンスがあります。';
    } else if (age >= 21.5 && age < 24.5) {
      name = '下弦の月';
      tip = '🌗 深夜に月が昇るため、ゴールデンタイム（19時〜21時）は闇夜並みの好条件！メタルスッテで手返し良く狙いましょう。';
    } else {
      name = '有明の月';
      tip = '🌒 月光が非常に弱く良好なコンディション。グロー系やケイムラ塗装のエギでアピールするのが効果的。';
    }

    return { name, illumination, tip };
  }

  function getTideName(age) {
    const roundedAge = Math.floor(age);
    if (roundedAge >= 0 && roundedAge <= 2) return '大潮';
    if (roundedAge >= 3 && roundedAge <= 6) return '中潮';
    if (roundedAge >= 7 && roundedAge <= 9) return '小潮';
    if (roundedAge === 10) return '長潮';
    if (roundedAge === 11) return '若潮';
    if (roundedAge >= 12 && roundedAge <= 14) return '中潮';
    if (roundedAge >= 15 && roundedAge <= 17) return '大潮';
    if (roundedAge >= 18 && roundedAge <= 21) return '中潮';
    if (roundedAge >= 22 && roundedAge <= 24) return '小潮';
    if (roundedAge === 25) return '長潮';
    if (roundedAge === 26) return '若潮';
    return '中潮';
  }

  // --- Tide Chart Drawer ---
  function drawTideChart(selectedDate) {
    const ctx = tideCanvas.getContext('2d');
    const container = tideCanvas.parentElement;
    const width = container.clientWidth;
    const height = 120;
    
    tideCanvas.width = width * window.devicePixelRatio;
    tideCanvas.height = height * window.devicePixelRatio;
    tideCanvas.style.width = width + 'px';
    tideCanvas.style.height = height + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const points = [];
    const getTideY = (h) => {
      return 60 + 25 * Math.sin((h - 1.5) * (Math.PI / 6)) + 10 * Math.sin(h * (Math.PI / 3));
    };

    for (let h = 0; h <= 24; h += 0.25) {
      points.push({ x: (h / 24) * width, y: getTideY(h) });
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const gx = (i / 4) * width;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '9px Outfit';
      ctx.fillText(`${i*6}h`, gx - 10, height - 5);
    }

    // Tide curve
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(167, 139, 250, 0.25)');
    gradient.addColorStop(1, 'rgba(167, 139, 250, 0.0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    tideTimesList.innerHTML = `
      <div class="tide-time-box" style="border-color: rgba(167, 139, 250, 0.2);">
        <span class="time-lbl" style="color: #c084fc;">満潮</span>
        <span class="time-val">03:45 (34cm)</span>
      </div>
      <div class="tide-time-box" style="border-color: rgba(167, 139, 250, 0.2);">
        <span class="time-lbl" style="color: #c084fc;">干潮</span>
        <span class="time-val">09:50 (14cm)</span>
      </div>
      <div class="tide-time-box" style="border-color: rgba(167, 139, 250, 0.2);">
        <span class="time-lbl" style="color: #c084fc;">満潮</span>
        <span class="time-val">15:40 (29cm)</span>
      </div>
      <div class="tide-time-box" style="border-color: rgba(167, 139, 250, 0.2);">
        <span class="time-lbl" style="color: #c084fc;">干潮</span>
        <span class="time-val">22:00 (10cm)</span>
      </div>
    `;
  }

  // --- Update Sea Conditions UI for Selected Date ---
  function updateConditionsUI(date) {
    const moon = getMoonPhase(date);
    const details = getMoonDetails(moon.age, moon.normalized);
    const tideName = getTideName(moon.age);

    headerMoonPhaseEl.textContent = moon.age.toFixed(1);
    headerTideNameEl.textContent = tideName;

    detailMoonAgeEl.textContent = moon.age.toFixed(1);
    detailMoonNameEl.textContent = details.name;
    detailMoonIlluminationEl.textContent = details.illumination;
    moonTackleTipEl.textContent = details.tip;

    // Moon disk visual
    let shadowShift = 0;
    if (moon.normalized <= 0.5) {
      shadowShift = moon.normalized * 200;
      moonShadowGraphic.style.transform = `translateX(${shadowShift}%)`;
      moonShadowGraphic.style.left = '0';
      moonShadowGraphic.style.right = 'auto';
    } else {
      shadowShift = (moon.normalized - 0.5) * 200;
      moonShadowGraphic.style.transform = `translateX(${shadowShift - 100}%)`;
      moonShadowGraphic.style.left = 'auto';
      moonShadowGraphic.style.right = '0';
    }

    // 4 Days Forecast
    moonForecastContainer.innerHTML = '';
    const dayOfWeekStr = ['日', '月', '火', '水', '木', '金', '土'];
    for (let d = 1; d <= 4; d++) {
      const forecastDate = new Date(date.getTime() + d * 24 * 60 * 60 * 1000);
      const m = forecastDate.getMonth() + 1;
      const day = forecastDate.getDate();
      const w = dayOfWeekStr[forecastDate.getDay()];
      const label = `${m}/${day}(${w})`;

      const fMoon = getMoonPhase(forecastDate);
      const fDetails = getMoonDetails(fMoon.age, fMoon.normalized);

      const fItem = document.createElement('div');
      fItem.className = 'forecast-item';
      fItem.style.borderColor = 'rgba(167, 139, 250, 0.15)';
      fItem.innerHTML = `
        <span class="forecast-date">${label}</span>
        <span class="forecast-age" style="color: #c084fc;">${fMoon.age.toFixed(1)}</span>
        <span class="forecast-name">${fDetails.name}</span>
        <span class="forecast-ill">光度 ${fDetails.illumination}%</span>
      `;
      moonForecastContainer.appendChild(fItem);
    }

    drawTideChart(date);
    renderWeatherForecast(date);
  }

  // --- Render Weather (Static logs) ---
  function renderWeatherForecast(date) {
    weatherForecastContainer.innerHTML = '';
    const dayOfWeekStr = ['日', '月', '火', '水', '木', '金', '土'];

    for (let d = 0; d < 5; d++) {
      const forecastDate = new Date(date.getTime() + d * 24 * 60 * 60 * 1000);
      const m = forecastDate.getMonth() + 1;
      const day = forecastDate.getDate();
      const w = dayOfWeekStr[forecastDate.getDay()];
      const label = d === 0 ? `基準日 ${m}/${day}(${w})` : `${m}/${day}(${w})`;

      const data = STATIC_WEATHER_LOG[d % STATIC_WEATHER_LOG.length];
      const card = document.createElement('div');
      card.className = `weather-forecast-card ${data.rough ? 'rough-sea' : ''}`;

      card.innerHTML = `
        <span class="w-date">${label}</span>
        <span class="w-icon">${data.icon}</span>
        <span class="w-cond">${data.cond}</span>
        <span class="w-wind">${data.windDir}<br>${data.windSpd}</span>
        <span class="w-wave">${data.wave}</span>
      `;
      weatherForecastContainer.appendChild(card);
    }
  }

  // --- 3-Day Grouped Trends Timeline ---
  function updateTrendsTimeline(activeFeeds) {
    trendsTimelineContainer.innerHTML = '';
    
    // Hardcoded date bounds matching simulated 2025 dates (June 20 - July 20, 2025)
    const baseDate = new Date('2025-07-20');
    
    for (let p = 0; p < 10; p++) {
      const pStartOffset = p * 3;
      const pEndOffset = (p * 3) + 2;

      const pStartDate = new Date(baseDate.getTime() - pEndOffset * 24 * 60 * 60 * 1000);
      const pEndDate = new Date(baseDate.getTime() - pStartOffset * 24 * 60 * 60 * 1000);

      const mStart = pStartDate.getMonth() + 1;
      const dStart = pStartDate.getDate();
      const mEnd = pEndDate.getMonth() + 1;
      const dEnd = pEndDate.getDate();
      const label = `${mStart}/${dStart}〜${mEnd}/${dEnd}`;

      const startStr = pStartDate.toISOString().split('T')[0];
      const endStr = pEndDate.toISOString().split('T')[0];

      const periodFeeds = activeFeeds.filter(feed => {
        return feed.date >= startStr && feed.date <= endStr;
      });

      const card = document.createElement('div');
      
      if (periodFeeds.length === 0) {
        card.className = 'timeline-period-card no-data';
        card.innerHTML = `
          <div class="period-label">${label}</div>
          <div class="empty-message" style="padding: 1rem 0; font-size: 0.7rem;">投稿データなし</div>
        `;
      } else {
        card.className = 'timeline-period-card has-data';
        card.style.borderColor = 'rgba(167, 139, 250, 0.2)';

        let totalCatch = 0;
        let catchCount = 0;
        let totalMinDepth = 0;
        let totalMaxDepth = 0;
        let depthCount = 0;
        const colorFrequency = {};
        const sutteFrequency = {};
        const startTimeFrequency = {};
        const startDepthFrequency = {};
        const rigFrequency = {};
        const sizeFrequency = {};
        const actionFrequency = {};

        periodFeeds.forEach(feed => {
          const ext = feed.extracted;
          if (ext.catch) {
            totalCatch += ext.catch;
            catchCount++;
          }
          if (ext.minDepth && ext.maxDepth) {
            totalMinDepth += ext.minDepth;
            totalMaxDepth += ext.maxDepth;
            depthCount++;
          }
          if (ext.color && ext.color !== '不明') {
            const splitColors = ext.color.split(', ');
            splitColors.forEach(c => {
              colorFrequency[c] = (colorFrequency[c] || 0) + 1;
            });
          }
          if (ext.sutte && ext.sutte !== '不明') {
            sutteFrequency[ext.sutte] = (sutteFrequency[ext.sutte] || 0) + 1;
          }
          if (ext.startTime && ext.startTime !== '不明') {
            startTimeFrequency[ext.startTime] = (startTimeFrequency[ext.startTime] || 0) + 1;
          }
          if (ext.startDepth && ext.startDepth !== '不明') {
            startDepthFrequency[ext.startDepth] = (startDepthFrequency[ext.startDepth] || 0) + 1;
          }
          if (ext.rig && ext.rig !== '不明') {
            rigFrequency[ext.rig] = (rigFrequency[ext.rig] || 0) + 1;
          }
          if (ext.size && ext.size !== '不明') {
            sizeFrequency[ext.size] = (sizeFrequency[ext.size] || 0) + 1;
          }
          if (ext.action && ext.action !== '不明') {
            const splitActions = ext.action.split(', ');
            splitActions.forEach(a => {
              actionFrequency[a] = (actionFrequency[a] || 0) + 1;
            });
          }
        });

        const avgCatch = catchCount > 0 ? Math.round(totalCatch / catchCount) : null;
        const avgMin = depthCount > 0 ? Math.round(totalMinDepth / depthCount) : null;
        const avgMax = depthCount > 0 ? Math.round(totalMaxDepth / depthCount) : null;

        const sortedColors = Object.entries(colorFrequency).sort((a, b) => b[1] - a[1]);
        let hotColorHTML = '<span style="font-size:0.65rem;color:var(--text-secondary);">データ無</span>';
        if (sortedColors.length > 0) {
          hotColorHTML = sortedColors.map(([colorName]) => {
            let colorClass = 'col-blue';
            if (colorName.includes('赤緑')) colorClass = 'col-redgreen';
            else if (colorName.includes('紫')) colorClass = 'col-purple';
            else if (colorName.includes('グロー')) colorClass = 'col-glow';
            else if (colorName.includes('赤黄')) colorClass = 'col-redyellow';
            else if (colorName.includes('ピンク')) colorClass = 'col-pink';
            else if (colorName.includes('白')) colorClass = 'col-white';
            else if (colorName.includes('赤')) colorClass = 'col-red';
            else if (colorName.includes('緑')) colorClass = 'col-green';
            else if (colorName.includes('黒')) colorClass = 'col-black';
            else if (colorName.includes('青')) colorClass = 'col-blue';
            else if (colorName.includes('ケイムラ')) colorClass = 'col-keimura';
            return `<span class="color-tag ${colorClass}" style="margin: 1px 2px; display: inline-block;">${colorName}</span>`;
          }).join('');
        }

        const sortedSuttes = Object.entries(sutteFrequency).sort((a, b) => b[1] - a[1]);
        const avgSutteText = sortedSuttes.length > 0 ? sortedSuttes[0][0] : '不明';

        const sortedTimes = Object.entries(startTimeFrequency).sort((a, b) => b[1] - a[1]);
        const predominantTime = sortedTimes.length > 0 ? sortedTimes[0][0] : '不明';

        const sortedStartDepths = Object.entries(startDepthFrequency).sort((a, b) => b[1] - a[1]);
        const predominantStartDepth = sortedStartDepths.length > 0 ? sortedStartDepths[0][0] : '不明';

        const sortedRigs = Object.entries(rigFrequency).sort((a, b) => b[1] - a[1]);
        const predominantRig = sortedRigs.length > 0 ? sortedRigs[0][0] : '不明';

        const sortedSizes = Object.entries(sizeFrequency).sort((a, b) => b[1] - a[1]);
        const predominantSize = sortedSizes.length > 0 ? sortedSizes[0][0] : '不明';

        const sortedActions = Object.entries(actionFrequency).sort((a, b) => b[1] - a[1]);
        const predominantAction = sortedActions.length > 0 ? sortedActions[0][0] : '不明';

        const depthText = (avgMin !== null && avgMax !== null) ? 
          (avgMin === avgMax ? `${avgMin}m` : `${avgMin}-${avgMax}m`) : '不明';

        card.innerHTML = `
          <div class="period-label" style="background: rgba(167, 139, 250, 0.15); color: #c084fc;">${label}</div>
          <div class="period-stat">
            <span class="period-stat-lbl">平均釣果</span>
            <span class="period-stat-val ct-val" style="color: #c084fc;">${avgCatch !== null ? avgCatch + ' 杯' : '--'}</span>
          </div>
          <div class="period-stat">
            <span class="period-stat-lbl">ヒットレンジ</span>
            <span class="period-stat-val">${depthText}</span>
          </div>
          <div class="period-stat">
            <span class="period-stat-lbl">頻出カラー</span>
            <span style="margin-top:2px;">${hotColorHTML}</span>
          </div>
          <div class="period-stat">
            <span class="period-stat-lbl">主流スッテ</span>
            <span class="period-stat-val" style="color: #a78bfa;">${avgSutteText}</span>
          </div>
          <div class="period-stat">
            <span class="period-stat-lbl">開始時間/棚</span>
            <span class="period-stat-val" style="color: #60a5fa; font-size: 0.75rem;">${predominantTime} / ${predominantStartDepth}</span>
          </div>
          <div class="period-stat">
            <span class="period-stat-lbl">仕掛け / サイズ</span>
            <span class="period-stat-val" style="color: #f43f5e; font-size: 0.75rem;">${predominantRig} / ${predominantSize}</span>
          </div>
          <div class="period-stat">
            <span class="period-stat-lbl">主流の誘い方</span>
            <span class="period-stat-val" style="color: #34d399; font-size: 0.75rem;">${predominantAction}</span>
          </div>
          <div class="period-stat" style="font-size: 0.6rem; color: var(--text-secondary); text-align: right; border-top: 1px dashed rgba(255,255,255,0.05); padding-top:4px; margin-top:2px;">
            サンプル: ${periodFeeds.length}件
          </div>
        `;
      }
      trendsTimelineContainer.appendChild(card);
    }
  }

  // --- Render SOCIAL_FEEDS list ---
  function renderFeeds(feedsToRender = ARCHIVE_FEEDS) {
    if (!feedList) return;
    feedList.innerHTML = '';

    const filteredFeeds = feedsToRender.filter(feed => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const bodyMatch = feed.body.toLowerCase().includes(query);
        const authorMatch = feed.author.toLowerCase().includes(query);
        const colorMatch = feed.extracted.color.toLowerCase().includes(query);
        const methodMatch = feed.extracted.rig.toLowerCase().includes(query);
        const sizeMatch = feed.extracted.size.toLowerCase().includes(query);
        return bodyMatch || authorMatch || colorMatch || methodMatch || sizeMatch;
      }
      return true;
    });

    if (filteredFeeds.length === 0) {
      if (noFeedsMsg) noFeedsMsg.classList.remove('hidden');
      updateTrendsTimeline([]);
      return;
    }
    if (noFeedsMsg) noFeedsMsg.classList.add('hidden');

    filteredFeeds.forEach(feed => {
      const li = document.createElement('li');
      li.className = 'feed-item media-blog';
      li.style.borderColor = '#a78bfa';
      
      li.innerHTML = `
        <div class="feed-item-header">
          <span class="feed-poster"><a href="${feed.url}" target="_blank" rel="noopener noreferrer">${feed.author} 🔗</a></span>
          <div>
            <span class="feed-date" style="color: #c084fc;">${feed.date}</span>
            <span class="feed-media-badge badge-blog" style="background: #a78bfa;">📝 2025実績</span>
          </div>
        </div>
        <p class="feed-body">${feed.body}</p>
        <div class="feed-extracted-data">
          <span class="extracted-badge ext-catch">釣果: ${feed.extracted.catch}杯</span>
          <span class="extracted-badge ext-depth">棚: ${feed.extracted.minDepth === feed.extracted.maxDepth ? feed.extracted.minDepth : feed.extracted.minDepth + '-' + feed.extracted.maxDepth}m</span>
          <span class="extracted-badge ext-color">カラー: ${feed.extracted.color}</span>
          <span class="extracted-badge ext-sutte">スッテ: ${feed.extracted.sutte || '不明'}</span>
          <span class="extracted-badge ext-time" style="background: rgba(167, 139, 250, 0.12); color: #c084fc; border: 1px solid rgba(167, 139, 250, 0.25);">🕒 開始時間/棚: ${feed.extracted.startTime || '不明'} (${feed.extracted.startDepth || '不明'})</span>
          <span class="extracted-badge ext-action" style="background: rgba(52, 211, 153, 0.12); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.25);">🎣 誘い方: ${feed.extracted.action || '不明'}</span>
          <span class="extracted-badge ext-rig" style="background: rgba(244, 63, 94, 0.12); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.25);">🔗 仕掛け: ${feed.extracted.rig || '不明'}</span>
          <span class="extracted-badge ext-size" style="background: rgba(251, 146, 60, 0.12); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.25);">📏 サイズ: ${feed.extracted.size || '不明'}</span>
        </div>
      `;
      feedList.appendChild(li);
    });

    updateTrendsTimeline(filteredFeeds);
  }

  // --- Date Picker simulation events ---
  datePicker.addEventListener('change', (e) => {
    const selectedDate = new Date(e.target.value);
    updateConditionsUI(selectedDate);
  });

  // Search input handler
  feedSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderFeeds();
  });

  // --- Initial Launch ---
  const initialSimDate = new Date(datePicker.value);
  updateConditionsUI(initialSimDate);
  renderFeeds();

  window.addEventListener('resize', () => {
    const currentSimDate = new Date(datePicker.value);
    drawTideChart(currentSimDate);
  });
});
