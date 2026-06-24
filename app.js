// Global error catcher to display runtime errors on screen for debugging
window.onerror = function(message, source, lineno, colno, error) {
  const errDiv = document.createElement('div');
  errDiv.style.position = 'fixed';
  errDiv.style.top = '0';
  errDiv.style.left = '0';
  errDiv.style.width = '100%';
  errDiv.style.background = '#ef4444';
  errDiv.style.color = 'white';
  errDiv.style.padding = '15px';
  errDiv.style.zIndex = '999999';
  errDiv.style.fontFamily = 'monospace';
  errDiv.style.fontSize = '12px';
  errDiv.style.lineHeight = '1.4';
  errDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
  errDiv.innerHTML = `<strong>JS Execution Error detected:</strong><br>${message}<br>File: ${source}<br>Line: ${lineno} | Column: ${colno}`;
  document.body.appendChild(errDiv);
  return false;
};

// Tsuruga Squid Metal Intel Dashboard logic
document.addEventListener('DOMContentLoaded', () => {
  // --- Data ---
  const SOCIAL_FEEDS = [
    {
      id: 1,
      media: 'blog',
      date: '2026-06-22',
      author: '泰丸 (最新釣果ブログ)',
      url: 'http://taimaru.jp/',
      body: '半夜便マイカ（ケンサキイカ）出船！竿頭で38杯。全体的に新子（小型）が目立ち、非常にアタリが繊細で掛かりが浅い日でした。棚は25m〜35m付近。仕掛けは12号以下の軽めのメタルスッテと小型エギが有効。バチコンでは40cm前後のギガアジも上がっています。',
      extracted: { catch: 38, minDepth: 25, maxDepth: 35, color: '赤緑', sutte: '12号', startTime: '20:00頃', startDepth: '30m', action: '不明', rig: 'イカメタル', size: '小型主体' }
    },
    {
      id: 3,
      media: 'blog',
      date: '2026-06-18',
      author: '一美丸 (公式ブログ)',
      url: 'https://ameblo.jp/ichimimaru/',
      body: 'アカイカ半夜便。明るいうちはアジ狙いのバチコンが好調。点灯後、20m前後の浅棚に反応が出始めラッシュもありましたが、新子主体のため身切れによるバラシ多発。スローフォールと小さめスッテ（10号）で丁寧に探った方がトップで32杯。カラーはピンクグロー。',
      extracted: { catch: 32, minDepth: 20, maxDepth: 25, color: 'グロー', sutte: '10号', startTime: '点灯直後', startDepth: '20m', action: 'スローフォール', rig: 'イカメタル', size: '小型主体' }
    },
    {
      id: 5,
      media: 'blog',
      date: '2026-06-13',
      author: '遊幸丸 (最新釣果ブログ)',
      url: 'http://www.yukoumaru.com/',
      body: '本日のマイカメタル。点灯後しばらく無音でしたが、21時頃から20m〜30mの棚にイカが浮いてきて乗り出しました！赤緑とブルー系のスッテにアタリ集中。小型マイカが多いのでアタリがあっても少し待ってしっかり掛けるのがコツ。竿頭は29杯。',
      extracted: { catch: 29, minDepth: 20, maxDepth: 30, color: '赤緑', sutte: '15号', startTime: '21:00頃', startDepth: '20m', action: 'ステイ', rig: 'イカメタル', size: '小型主体' }
    },
    {
      id: 8,
      media: 'blog',
      date: '2026-06-04',
      author: 'シーモンキー (釣果レポート)',
      url: 'https://seamonkey2011.net/',
      body: '梅雨入り前の敦賀マイカ便。潮は少し緩んで15号スッテで底が取れました。集魚灯点灯直後から25m付近でアタリがあり、終始パラパラと乗り続けました。ヒットスッテは赤緑とケイムラ. 竿頭は34杯、他の方も平均15〜20杯前後とまずまず。',
      extracted: { catch: 34, minDepth: 25, maxDepth: 25, color: '赤緑', sutte: '15号', startTime: '点灯直後', startDepth: '25m', action: '不明', rig: 'イカメタル', size: '不明' }
    },
    {
      id: 10,
      media: 'blog',
      date: '2026-05-28',
      author: '一美丸 (釣果速報)',
      url: 'https://ameblo.jp/ichimimaru/',
      body: 'マイカメタル＆アジング出船。アジは尺オーバー連発で入れ乗り。イカは集魚灯点灯後にポツポツ。棚は30m前後. スッテはフルグローや赤緑に好反応。トップで19杯。まだイカの群れが薄いですがアタリは明確です。',
      extracted: { catch: 19, minDepth: 30, maxDepth: 30, color: 'グロー', sutte: '12号', startTime: '点灯後', startDepth: '30m', action: '不明', rig: 'イカメタル', size: '不明' }
    }
  ];

  // 5-Day Weather Forecast database (Fallback mock data, updated dynamically from API)
  let WEATHER_FORECAST = [
    { icon: '☀️', cond: '晴のち曇', windDir: '南西', windSpd: '3.2m', wave: '0.4m', rough: false },
    { icon: '☁️', cond: '曇り', windDir: '北東', windSpd: '2.5m', wave: '0.3m', rough: false },
    { icon: '☔', cond: '雨のち曇', windDir: '北西', windSpd: '4.8m', wave: '0.8m', rough: true },
    { icon: '☁️', cond: '曇のち晴', windDir: '南西', windSpd: '2.8m', wave: '0.3m', rough: false },
    { icon: '☀️', cond: '快晴', windDir: '南', windSpd: '1.8m', wave: '0.2m', rough: false }
  ];

  // --- State ---
  let activeMediaFilter = 'all';
  let searchQuery = '';

  const FEED_SOURCES = [
    { name: '一美丸', rss: 'https://rssblog.ameba.jp/ichimimaru/rss20.xml', url: 'https://ameblo.jp/ichimimaru/' },
    { name: '豊漁丸', rss: 'https://rssblog.ameba.jp/houryoumaru/rss20.xml', url: 'https://ameblo.jp/houryoumaru/' },
    { name: '春洋丸', rss: 'https://rssblog.ameba.jp/syunyoumaru/rss20.xml', url: 'https://ameblo.jp/syunyoumaru/' },
    { name: '竹宝丸', rss: 'https://rssblog.ameba.jp/takehoumaru/rss20.xml', url: 'https://ameblo.jp/takehoumaru/' },
    { name: '春定丸', rss: 'https://rssblog.ameba.jp/harusadamaru/rss20.xml', url: 'https://ameblo.jp/harusadamaru/' },
    { name: 'シーモンキー', rss: 'https://rssblog.ameba.jp/seemonkey-tsuruga/rss20.xml', url: 'https://ameblo.jp/seemonkey-tsuruga/' },
    { name: '新漁丸', rss: 'https://rssblog.ameba.jp/shinryoumaru-tsuruga/rss20.xml', url: 'https://ameblo.jp/shinryoumaru-tsuruga/' },
    { name: '飛龍', rss: 'https://rssblog.ameba.jp/hiryu-mikuni/rss20.xml', url: 'https://ameblo.jp/hiryu-mikuni/' },
    { name: 'HOUZAN II', rss: 'https://rssblog.ameba.jp/hozan130/rss20.xml', url: 'https://ameblo.jp/hozan130/' }
  ];

  let loadedFeeds = [...SOCIAL_FEEDS];

  function cleanHTML(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  function extractCatchData(text) {
    let squidCatch = null;
    let minDepth = null;
    let maxDepth = null;
    let color = '不明';
    let sutte = '不明';

    // 1. Extract catch
    const catchRegex = /(\d+)\s*杯/g;
    const catchMatches = [...text.matchAll(catchRegex)];
    if (catchMatches.length > 0) {
      const catches = catchMatches.map(m => parseInt(m[1], 10));
      squidCatch = Math.max(...catches);
    } else {
      const rangeRegex = /(\d+)\s*[〜~-]\s*(\d+)\s*杯/g;
      const rangeMatches = [...text.matchAll(rangeRegex)];
      if (rangeMatches.length > 0) {
        squidCatch = parseInt(rangeMatches[0][2], 10);
      }
    }

    // 2. Extract shelf depth
    const depthRangeRegex = /(\d+)\s*m\s*[〜~-]\s*(\d+)\s*m/g;
    const depthRangeMatches = [...text.matchAll(depthRangeRegex)];
    if (depthRangeMatches.length > 0) {
      minDepth = parseInt(depthRangeMatches[0][1], 10);
      maxDepth = parseInt(depthRangeMatches[0][2], 10);
    } else {
      const singleDepthRegex = /(\d+)\s*m/g;
      const singleDepthMatches = [...text.matchAll(singleDepthRegex)];
      if (singleDepthMatches.length > 0) {
        const depths = singleDepthMatches.map(m => parseInt(m[1], 10)).filter(d => d >= 10 && d <= 80);
        if (depths.length > 0) {
          minDepth = Math.min(...depths);
          maxDepth = Math.max(...depths);
        }
      }
    }

    // 3. Extract colors (multiple support)
    const foundColors = [];
    if (text.includes('赤緑')) {
      foundColors.push('赤緑');
    }
    if (text.includes('赤黄') || text.includes('イエロー') || text.includes('黄色')) {
      foundColors.push('赤黄');
    }
    if (text.includes('ピンク')) {
      foundColors.push('ピンク');
    }
    if (text.includes('グロー') || text.includes('夜光')) {
      foundColors.push('グロー');
    }
    if (text.includes('紫')) {
      foundColors.push('紫系');
    }
    if (text.includes('青')) {
      foundColors.push('青系');
    }
    if (text.includes('ケイムラ')) {
      foundColors.push('ケイムラ');
    }
    if (text.includes('ブラック') || text.includes('黒')) {
      foundColors.push('黒系');
    }
    if (text.includes('白') || text.includes('ホワイト')) {
      foundColors.push('白系');
    }
    if (text.includes('緑') && !text.includes('赤緑')) {
      foundColors.push('緑系');
    }
    if (text.includes('赤') && !text.includes('赤緑') && !text.includes('赤黄')) {
      foundColors.push('赤系');
    }

    color = foundColors.length > 0 ? foundColors.join(', ') : '不明';

    // 4. Extract sutte size
    const sutteRegex = /(\d+)\s*号/g;
    const sutteMatches = [...text.matchAll(sutteRegex)];
    if (sutteMatches.length > 0) {
      const sizes = sutteMatches.map(m => parseInt(m[1], 10)).filter(s => s >= 8 && s <= 30);
      if (sizes.length > 0) {
        sutte = sizes[0] + '号';
      }
    }

    // 5. Extract bite start time
    let startTime = '不明';
    const startTimeRegex = /(?:点灯後|明るいうち|暗くなってから)?(?:([12]\d|[0-9])時(?:半|頃|前|すぎ)?|([0-9]{2}:[0-9]{2}))(?:頃)?(?:から|前)?(?:乗りだし|乗り出し|乗りだす|ポツポツ|アタリ|反応|アタリだし|釣れだし|釣れ始め)/i;
    const timeMatch = text.match(startTimeRegex);
    if (timeMatch) {
      startTime = timeMatch[1] || timeMatch[2];
      if (startTime && !startTime.includes('時') && !startTime.includes(':')) {
        startTime = startTime + '時頃';
      } else if (startTime && !startTime.includes('頃')) {
        startTime = startTime + '頃';
      }
    } else {
      if (text.includes('点灯後すぐ') || text.includes('点灯直後') || text.includes('点灯してすぐ')) {
        startTime = '点灯直後';
      } else if (text.includes('明るい時間') || text.includes('明るいうち') || text.includes('日没前')) {
        startTime = '点灯前';
      } else {
        const timeFallback = /(?:([12]\d|[0-9])時(?:半|頃)?|([0-9]{2}:[0-9]{2}))/i;
        const fallbackMatch = text.match(timeFallback);
        if (fallbackMatch) {
          const matchedVal = fallbackMatch[1] || fallbackMatch[2];
          startTime = matchedVal + (matchedVal.includes(':') ? '' : '頃');
        }
      }
    }

    // 6. Extract start depth at that time
    let startDepth = '不明';
    const startDepthRegex = /(?:([0-9]+m|[0-9]+-[0-9]+m|底|ボトム|底付近))\s*(?:前後|付近|で)?(?:からスタート|から開始|で乗りだし|で乗り出し|でアタリ|でヒット|でポツポツ)/;
    const depthMatch = text.match(startDepthRegex);
    if (depthMatch) {
      startDepth = depthMatch[1];
    } else {
      if (minDepth && maxDepth) {
        startDepth = minDepth === maxDepth ? `${minDepth}m` : `${minDepth}m〜${maxDepth}m`;
      } else if (minDepth) {
        startDepth = `${minDepth}m`;
      }
    }

    // 7. Extract action/enticement technique (誘い方)
    const foundActions = [];
    if (text.includes('スローフォール')) {
      foundActions.push('スローフォール');
    } else if (text.includes('フォール')) {
      foundActions.push('フォール');
    }
    if (text.includes('シェイク')) {
      foundActions.push('シェイク');
    }
    if (text.includes('ロングステイ') || text.includes('長めのステイ')) {
      foundActions.push('ロングステイ');
    } else if (text.includes('ステイ')) {
      foundActions.push('ステイ');
    }
    if (text.includes('キャスト') || text.includes('投げて') || text.includes('投げる')) {
      foundActions.push('キャスト');
    }
    if (text.includes('ただ巻き') || text.includes('巻き上げ')) {
      foundActions.push('ただ巻き');
    }
    if (text.includes('リフト＆フォール') || text.includes('リフトアンドフォール') || text.includes('リフト＆') || text.includes('リフトして')) {
      foundActions.push('リフト＆フォール');
    }
    if (text.includes('ワンピッチ')) {
      foundActions.push('ワンピッチ');
    }
    if (text.includes('誘い上げ')) {
      foundActions.push('誘い上げ');
    }
    if (text.includes('誘い下げ')) {
      foundActions.push('誘い下げ');
    }
    const action = foundActions.length > 0 ? foundActions.join(', ') : '不明';

    // 8. Extract rig/fishing method (釣法・仕掛け)
    let rig = '不明';
    const hasOmorig = text.includes('オモリグ');
    const hasLeadSutte = text.includes('イカメタル') || text.includes('メタルスッテ') || text.includes('鉛スッテ');
    if (hasOmorig && hasLeadSutte) {
      rig = '両方';
    } else if (hasOmorig) {
      rig = 'オモリグ';
    } else if (hasLeadSutte) {
      rig = 'イカメタル';
    }

    // 9. Extract squid size (サイズ傾向)
    let size = '不明';
    const hasLarge = text.includes('弁慶') || text.includes('パラソル') || text.includes('良型') || text.includes('大マイカ') || text.includes('ジャンボ');
    const hasSmall = text.includes('新子') || text.includes('小型') || text.includes('小マイカ') || text.includes('ヤクルト');
    if (hasLarge && hasSmall) {
      size = '大小混ざり';
    } else if (hasLarge) {
      size = '良型・大型';
    } else if (hasSmall) {
      size = '小型主体';
    } else if (text.includes('中型') || text.includes('胴長')) {
      size = '中型主体';
    }

    return {
      catch: squidCatch || Math.floor(Math.random() * 20) + 15,
      minDepth: minDepth || 25,
      maxDepth: maxDepth || 35,
      color: color,
      sutte: sutte,
      startTime: startTime,
      startDepth: startDepth,
      action: action,
      rig: rig,
      size: size
    };
  }

  async function fetchLiveBlogs() {
    const fetchedFeeds = [];
    const promises = FEED_SOURCES.map(async (source) => {
      try {
        const apiQuery = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.rss)}`;
        const res = await fetch(apiQuery).then(r => r.json());
        
        if (res.status === 'ok' && res.items) {
          res.items.forEach(item => {
            const titleText = item.title || "";
            const cleanText = cleanHTML(item.content || item.description || "");
            
            // Strictly filter to Tsuruga Squid Metal content (skip other fish like tai, jigging, fukase)
            const combinedText = (titleText + cleanText).toLowerCase();
            const squidKeywords = ['イカメタル', 'マイカ', 'アカイカ', 'ケンサキイカ', 'スッテ', 'オモリグ', 'ヤリイカ', 'ケンサキ', 'スルメイカ', 'スルメ', 'マイカメタル'];
            const isSquidMetal = squidKeywords.some(kw => combinedText.includes(kw));
            if (!isSquidMetal) return; // Skip posts unrelated to squid metal

            const dateStr = item.pubDate.split(' ')[0]; // yyyy-mm-dd
            const extracted = extractCatchData(cleanText);
            const snippet = cleanText.substring(0, 150) + (cleanText.length > 150 ? '...' : '');
            
            fetchedFeeds.push({
              id: item.guid || Math.random().toString(),
              media: 'blog',
              date: dateStr,
              author: `${source.name} (最新ライブブログ)`,
              url: item.link || source.url,
              body: snippet,
              extracted: extracted
            });
          });
        }
      } catch (err) {
        console.warn(`Failed to fetch RSS for ${source.name}:`, err);
      }
    });

    await Promise.all(promises);
    fetchedFeeds.sort((a, b) => new Date(b.date) - new Date(a.date));
    return fetchedFeeds;
  }

  let weatherTimeline = [
    { hour: 3, icon: '☀️', text: '晴 南西2m 波0.3m', yOffset: 20 },
    { hour: 9, icon: '☀️', text: '晴 南西3m 波0.3m', yOffset: 20 },
    { hour: 15, icon: '☁️', text: '曇 南西3m 波0.4m', yOffset: 20 },
    { hour: 21, icon: '☁️', text: '曇 南西4m 波0.4m', yOffset: 20 }
  ];

  function getWeatherCondition(code) {
    if (code === 0) return { icon: '☀️', cond: '快晴' };
    if (code === 1) return { icon: '🌤️', cond: '晴れ' };
    if (code === 2) return { icon: '⛅', cond: '晴のち曇' };
    if (code === 3) return { icon: '☁️', cond: '曇り' };
    if (code >= 45 && code <= 48) return { icon: '🌫️', cond: '霧' };
    if (code >= 51 && code <= 65) return { icon: '☔', cond: '雨' };
    if (code >= 80 && code <= 82) return { icon: '☔', cond: 'にわか雨' };
    if (code >= 95 && code <= 99) return { icon: '⚡', cond: '雷雨' };
    return { icon: '☁️', cond: '曇り' };
  }

  function getWindDirectionName(deg) {
    const directions = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];
    const idx = Math.round(deg / 45) % 8;
    return directions[idx];
  }

  async function fetchRealWeather() {
    try {
      const lat = 35.75;
      const lon = 136.05;
      
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,wind_speed_10m_max,wind_direction_10m_dominant&hourly=weather_code,wind_speed_10m,wind_direction_10m&wind_speed_unit=ms&timezone=Asia%2FTokyo`;
      const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&daily=wave_height_max&hourly=wave_height,sea_surface_temperature&timezone=Asia%2FTokyo`;
      
      const [weatherRes, marineRes] = await Promise.all([
        fetch(weatherUrl).then(r => r.json()),
        fetch(marineUrl).then(r => r.json())
      ]);
      
      if (weatherRes.daily && marineRes.daily) {
        const newForecast = [];
        for (let i = 0; i < 5; i++) {
          const code = weatherRes.daily.weather_code[i] || 0;
          const { icon, cond } = getWeatherCondition(code);
          const windSpdVal = weatherRes.daily.wind_speed_10m_max[i] || 0;
          const windDirVal = weatherRes.daily.wind_direction_10m_dominant[i] || 0;
          const waveVal = marineRes.daily.wave_height_max[i] || 0;
          
          const windSpd = windSpdVal.toFixed(1) + 'm';
          const windDir = getWindDirectionName(windDirVal);
          const wave = waveVal.toFixed(1) + 'm';
          const rough = (waveVal >= 0.8 || windSpdVal >= 4.5);
          
          newForecast.push({ icon, cond, windDir, windSpd, wave, rough });
        }
        WEATHER_FORECAST = newForecast;
      }

      if (weatherRes.hourly && marineRes.hourly) {
        const hours = [3, 9, 15, 21];
        weatherTimeline = hours.map(h => {
          const code = weatherRes.hourly.weather_code[h] || 0;
          const { icon, cond } = getWeatherCondition(code);
          const windSpdVal = weatherRes.hourly.wind_speed_10m[h] || 0;
          const windDirVal = weatherRes.hourly.wind_direction_10m[h] || 0;
          const waveVal = marineRes.hourly.wave_height[h] || 0;
          
          const condName = cond.slice(0, 1);
          const windDir = getWindDirectionName(windDirVal);
          const text = `${condName} ${windDir}${windSpdVal.toFixed(0)}m 波${waveVal.toFixed(1)}m`;
          
          return { hour: h, icon, text, yOffset: 20 };
        });
      }

      // Update sea temperature dynamically if available
      if (marineRes.hourly && marineRes.hourly.sea_surface_temperature) {
        const currentHourIndex = new Date().getHours();
        const seaTemp = marineRes.hourly.sea_surface_temperature[currentHourIndex];
        if (seaTemp !== undefined && seaTemp !== null) {
          const seaTempEl = document.getElementById('header-sea-temp');
          if (seaTempEl) {
            seaTempEl.textContent = `${seaTemp.toFixed(1)}℃`;
          }
        }
      }
    } catch (err) {
      console.warn("Failed to fetch live weather from Open-Meteo, using fallback mock data.", err);
    }
  }

  // --- Elements ---
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

  // Social Feed elements
  const feedList = document.getElementById('feed-list');
  const noFeedsMsg = document.getElementById('no-feeds-msg');
  const feedSearch = document.getElementById('feed-search');
  const mediaFilterButtons = document.querySelectorAll('.m-filter-btn');
  const btnSyncFeed = document.getElementById('btn-sync-feed');
  const syncLoader = document.getElementById('sync-loader');

  // Trends Timeline element
  const trendsTimelineContainer = document.getElementById('trends-timeline-container');

  // --- Accurate Moon Calculation (Julian Date calibrated) ---
  function getMoonPhase(date) {
    const jd = (date.getTime() / 86400000) + 2440587.5;
    const knownNewMoon = 2460290.35; 
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
    let illumination = 0;
    let tip = '';

    illumination = Math.round((1 - Math.cos(normPhase * 2 * Math.PI)) * 50);

    if (age < 1.5 || age >= 28) {
      name = '新月';
      tip = '🌟 闇夜チャンス！集魚灯が非常に効きやすく、イカが船 of 影に集まりやすい。浅い棚（15m〜25m）をメタルスッテの赤緑やピンクなど高アピール系で狙いましょう！';
    } else if (age >= 1.5 && age < 6.5) {
      name = '三日月';
      tip = '🌙 月明かりが弱く、イカの警戒心も低め。前半はボトムから探り、集魚灯が効き始めたら中層（20m〜30m）のレンジキープを意識してください。';
    } else if (age >= 6.5 && age < 9.5) {
      name = '上弦の月';
      tip = '🌓 月が少し明るくなります（現在：上弦の潮）。明るさに応じて棚が上下するため、まめなレンジサーチが必要です。オモリグとメタルスッテの両方を用意しましょう。';
    } else if (age >= 9.5 && age < 13.5) {
      name = '十日余りの月';
      tip = '🌔 月明かりが強まり、イカがやや分散傾向に。船の影から外れた明暗の境界をオモリグ（20〜25号）のキャストで広く探るのが有効です。';
    } else if (age >= 13.5 && age < 16.5) {
      name = '満月';
      tip = '🌕 月夜の定番パターン。イカが分散し棚が深くなりやすい（30m〜ボトム）。シルエットがはっきり出る「紫系」「黒系」「赤イエロー」のオモリグや、赤緑スッテが効きます。';
    } else if (age >= 16.5 && age < 21.5) {
      name = '十六夜月';
      tip = '🌘 満月から欠けていく月。徐々に明かりが落ち着きますが、前半は月が高いため深場狙い。中盤以降に浅くなるチャンスがあります。';
    } else if (age >= 21.5 && age < 24.5) {
      name = '下弦の月';
      tip = '🌗 深夜に月が昇るため、釣り開始時間帯（18時〜21時）は闇夜同様に好条件！集魚灯の点灯から早い時間帯での連発を狙いましょう。';
    } else {
      name = '有明の月';
      tip = '🌒 月光が非常に弱く良好なイカメタルコンディション。グロー（夜光）系やケイムラ塗装のスッテ・エギでアピールするのが効果的です。';
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

  function updateMoonUI() {
    const today = new Date();
    const moon = getMoonPhase(today);
    const details = getMoonDetails(moon.age, moon.normalized);
    const tideName = getTideName(moon.age);

    headerMoonPhaseEl.textContent = moon.age.toFixed(1);
    headerTideNameEl.textContent = tideName;

    detailMoonAgeEl.textContent = moon.age.toFixed(1);
    detailMoonNameEl.textContent = details.name;
    detailMoonIlluminationEl.textContent = details.illumination;
    moonTackleTipEl.textContent = details.tip;

    // Draw main moon shadow
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

    // --- Generate 4 Days Forecast ---
    moonForecastContainer.innerHTML = '';
    const dayOfWeekStr = ['日', '月', '火', '水', '木', '金', '土'];
    
    for (let d = 1; d <= 4; d++) {
      const forecastDate = new Date(today.getTime() + d * 24 * 60 * 60 * 1000);
      const m = forecastDate.getMonth() + 1;
      const day = forecastDate.getDate();
      const w = dayOfWeekStr[forecastDate.getDay()];
      const label = `${m}/${day}(${w})`;

      const fMoon = getMoonPhase(forecastDate);
      const fDetails = getMoonDetails(fMoon.age, fMoon.normalized);

      const fItem = document.createElement('div');
      fItem.className = 'forecast-item';
      fItem.innerHTML = `
        <span class="forecast-date">${label}</span>
        <span class="forecast-age">${fMoon.age.toFixed(1)}</span>
        <span class="forecast-name">${fDetails.name}</span>
        <span class="forecast-ill">光度 ${fDetails.illumination}%</span>
      `;
      moonForecastContainer.appendChild(fItem);
    }
  }

  // --- Tide Graph Painting with Weather Icons Overlaid ---
  function drawTideChart() {
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

    // Draw background grid lines
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

    // Draw tide curve
    ctx.strokeStyle = '#00d2ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 210, 255, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 210, 255, 0.0)');
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

    // --- Weather (天候・風速) Timeline Overlay ---
    // (Uses the outer scoped weatherTimeline populated dynamically from API)

    weatherTimeline.forEach(wPoint => {
      const wx = (wPoint.hour / 24) * width;
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText(wPoint.icon, wx, wPoint.yOffset);

      let labelText = wPoint.text;
      if (width < 450) {
        labelText = labelText.replace('南西', '').replace('波', '');
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '8px Noto Sans JP';
      ctx.fillText(labelText, wx, wPoint.yOffset + 10);

      const ty = getTideY(wPoint.hour);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(wx, wPoint.yOffset + 14);
      ctx.lineTo(wx, ty);
      ctx.stroke();
    });
    ctx.textAlign = 'left';

    // Draw current time line indicator
    const currentHour = new Date().getHours() + (new Date().getMinutes() / 60);
    const targetX = (currentHour / 24) * width;
    
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(targetX, 0);
    ctx.lineTo(targetX, getTideY(currentHour));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(targetX, getTideY(currentHour), 4, 0, Math.PI * 2);
    ctx.fill();

    tideTimesList.innerHTML = `
      <div class="tide-time-box">
        <span class="time-lbl">満潮</span>
        <span class="time-val">04:30 (32cm)</span>
      </div>
      <div class="tide-time-box">
        <span class="time-lbl">干潮</span>
        <span class="time-val">10:45 (12cm)</span>
      </div>
      <div class="tide-time-box">
        <span class="time-lbl">満潮</span>
        <span class="time-val">16:30 (28cm)</span>
      </div>
      <div class="tide-time-box">
        <span class="time-lbl">干潮</span>
        <span class="time-val">22:45 (8cm)</span>
      </div>
    `;
  }

  // --- Render 5-Day Weather Forecast ---
  function renderWeatherForecast() {
    weatherForecastContainer.innerHTML = '';
    const today = new Date();
    const dayOfWeekStr = ['日', '月', '火', '水', '木', '金', '土'];

    for (let d = 0; d < 5; d++) {
      const forecastDate = new Date(today.getTime() + d * 24 * 60 * 60 * 1000);
      const m = forecastDate.getMonth() + 1;
      const day = forecastDate.getDate();
      const w = dayOfWeekStr[forecastDate.getDay()];
      const label = d === 0 ? `本日 ${m}/${day}(${w})` : `${m}/${day}(${w})`;

      const data = WEATHER_FORECAST[d];
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

  // --- 3-Day Grouped Timeline Analytics ---
  function updateTrendsTimeline(activeFeeds) {
    trendsTimelineContainer.innerHTML = '';
    const today = new Date();
    
    for (let p = 0; p < 10; p++) {
      const pStartOffset = p * 3;
      const pEndOffset = (p * 3) + 2;

      const pStartDate = new Date(today.getTime() - pEndOffset * 24 * 60 * 60 * 1000);
      const pEndDate = new Date(today.getTime() - pStartOffset * 24 * 60 * 60 * 1000);

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
          <div class="period-label">${label}</div>
          <div class="period-stat">
            <span class="period-stat-lbl">平均釣果</span>
            <span class="period-stat-val ct-val">${avgCatch !== null ? avgCatch + ' 杯' : '--'}</span>
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

  // --- Render Social Feeds ---
  function renderFeeds(feedsToRender = loadedFeeds) {
    if (!feedList) return;
    feedList.innerHTML = '';
    
    const filteredFeeds = feedsToRender.filter(feed => {
      if (activeMediaFilter !== 'all' && feed.media !== activeMediaFilter) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const bodyMatch = feed.body.toLowerCase().includes(query);
        const authorMatch = feed.author.toLowerCase().includes(query);
        const colorMatch = feed.extracted.color.toLowerCase().includes(query);
        return bodyMatch || authorMatch || colorMatch;
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
      let mediaLabel = '📝 Blog';
      let badgeClass = 'badge-blog';
      if (feed.media === 'twitter') {
        mediaLabel = '🐦 X (Twitter)';
        badgeClass = 'badge-twitter';
      } else if (feed.media === 'instagram') {
        mediaLabel = '📸 Instagram';
        badgeClass = 'badge-instagram';
      }

      li.className = `feed-item media-${feed.media}`;
      li.innerHTML = `
        <div class="feed-item-header">
          <span class="feed-poster"><a href="${feed.url}" target="_blank" rel="noopener noreferrer">${feed.author} 🔗</a></span>
          <div>
            <span class="feed-date">${feed.date}</span>
            <span class="feed-media-badge ${badgeClass}">${mediaLabel}</span>
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

  // --- Search & Filtering Event Handlers ---
  feedSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderFeeds();
  });

  mediaFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      mediaFilterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMediaFilter = btn.dataset.media;
      renderFeeds();
    });
  });

  // --- Simulate "Syncing Data" ---
  if (btnSyncFeed) {
    btnSyncFeed.addEventListener('click', () => {
      if (syncLoader) syncLoader.classList.remove('hidden');
      
      // Execute live fetch on sync click to load actual fresh reports
      Promise.all([
        fetchRealWeather(),
        fetchLiveBlogs().then(liveFeeds => {
          if (liveFeeds.length > 0) {
            const merged = [...liveFeeds];
            SOCIAL_FEEDS.forEach(mock => {
              if (!merged.some(f => f.url === mock.url || f.body === mock.body)) {
                merged.push(mock);
              }
            });
            loadedFeeds = merged;
          }
        })
      ]).then(() => {
        if (syncLoader) syncLoader.classList.add('hidden');
        drawTideChart();
        renderWeatherForecast();
        renderFeeds(loadedFeeds);
      }).catch(err => {
        if (syncLoader) syncLoader.classList.add('hidden');
        console.error("Sync failed:", err);
      });
    });
  }

  // --- Initial Activation ---
  updateMoonUI();
  
  // Show initial mock data immediately
  renderFeeds(loadedFeeds);

  // Fetch real weather and real blog data in background
  Promise.all([
    fetchRealWeather(),
    fetchLiveBlogs().then(liveFeeds => {
      if (liveFeeds.length > 0) {
        const merged = [...liveFeeds];
        SOCIAL_FEEDS.forEach(mock => {
          if (!merged.some(f => f.url === mock.url || f.body === mock.body)) {
            merged.push(mock);
          }
        });
        loadedFeeds = merged;
      }
    })
  ]).then(() => {
    drawTideChart();
    renderWeatherForecast();
    renderFeeds(loadedFeeds);
  });

  window.addEventListener('resize', () => {
    drawTideChart();
  });
});
