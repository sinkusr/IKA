/* ==========================================================================
   イカメタル釣果ログ - Application Logic (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- State & Storage ---
  let fishingLogs = [];
  let trendChartInstance = null;
  let ratioChartInstance = null;

  // Load from LocalStorage
  const loadLogs = () => {
    const rawData = localStorage.getItem('ika_metal_logs');
    if (rawData) {
      try {
        fishingLogs = JSON.parse(rawData);
        // Sort by date descending
        fishingLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
      } catch (e) {
        console.error('Error parsing fishing logs', e);
        fishingLogs = [];
      }
    } else {
      // Clean slate - start with no mock data
      fishingLogs = [];
      saveLogs();
    }
  };

  const saveLogs = () => {
    localStorage.setItem('ika_metal_logs', JSON.stringify(fishingLogs));
  };

  // --- Element Selectors ---
  const tabButtons = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const fishingForm = document.getElementById('fishing-form');
  const historyList = document.getElementById('history-list');
  const historySearch = document.getElementById('history-search');
  const editIdField = document.getElementById('edit-id');

  // Form Fields
  const fieldDate = document.getElementById('field-date');
  const fieldArea = document.getElementById('field-area');
  const countMaika = document.getElementById('count-maika');
  const countSurume = document.getElementById('count-surume');
  const countYari = document.getElementById('count-yari');
  const countAori = document.getElementById('count-aori');
  const fieldTide = document.getElementById('field-tide');
  const fieldRange = document.getElementById('field-range');
  const fieldRigSutte = document.getElementById('field-rig-sutte');
  const fieldRigDropper = document.getElementById('field-rig-dropper');
  const fieldMemo = document.getElementById('field-memo');

  // Stats Elements
  const statTotalSquids = document.getElementById('stat-total-squids');
  const statTotalMaika = document.getElementById('stat-total-maika');
  const statTotalSurume = document.getElementById('stat-total-surume');
  const statTotalYari = document.getElementById('stat-total-yari');
  const statTotalAori = document.getElementById('stat-total-aori');
  const statPersonalBest = document.getElementById('stat-personal-best');
  const statAverageSquids = document.getElementById('stat-average-squids');

  // --- Navigation Router ---
  const switchTab = (tabId) => {
    tabContents.forEach(content => {
      content.classList.toggle('active', content.id === tabId);
    });

    tabButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isTarget);
      
      // Dynamic center button animation support
      if (btn.id === 'nav-btn-form') {
        const icon = btn.querySelector('.center-add-icon i');
        if (icon) {
          if (tabId === 'tab-form') {
            icon.className = 'fa-solid fa-plus';
            // We rotate it via CSS active class
          } else {
            icon.className = 'fa-solid fa-plus';
          }
        }
      }
    });

    // Refresh charts or lists when showing
    if (tabId === 'tab-dashboard') {
      renderStats();
      renderCharts();
    } else if (tabId === 'tab-history') {
      renderHistory();
    } else if (tabId === 'tab-form' && !editIdField.value) {
      // Set default date to today for new records
      const today = new Date().toISOString().split('T')[0];
      fieldDate.value = today;
    }
  };

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      // If clicking form button and already on form tab (in edit mode), reset it
      if (tabId === 'tab-form' && editIdField.value) {
        resetForm();
      }
      switchTab(tabId);
    });
  });

  // Cancel button inside form
  document.getElementById('btn-form-cancel').addEventListener('click', () => {
    resetForm();
    switchTab('tab-dashboard');
  });

  // --- Quick Counters Logic ---
  document.querySelectorAll('.btn-counter-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      input.value = parseInt(input.value) + 1;
      triggerHapticFeedback();
    });
  });

  document.querySelectorAll('.btn-counter-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const val = parseInt(input.value);
      if (val > 0) {
        input.value = val - 1;
        triggerHapticFeedback();
      }
    });
  });

  // Haptic visualization (pulse feedback for iOS safari feel)
  const triggerHapticFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(15); // standard light tap vibration
    }
  };

  // --- Statistics Calculation ---
  const renderStats = () => {
    if (fishingLogs.length === 0) {
      statTotalSquids.innerHTML = `0 <span class="unit">杯</span>`;
      statTotalMaika.textContent = '0 杯';
      statTotalSurume.textContent = '0 杯';
      statTotalYari.textContent = '0 杯';
      statTotalAori.textContent = '0 杯';
      statPersonalBest.textContent = '0 杯';
      statAverageSquids.textContent = '0.0 杯';
      return;
    }

    let totalMaika = 0;
    let totalSurume = 0;
    let totalYari = 0;
    let totalAori = 0;
    let maxSingleLog = 0;

    fishingLogs.forEach(log => {
      const maika = parseInt(log.maika) || 0;
      const surume = parseInt(log.surume) || 0;
      const yari = parseInt(log.yari) || 0;
      const aori = parseInt(log.aori) || 0;
      const sum = maika + surume + yari + aori;
      
      totalMaika += maika;
      totalSurume += surume;
      totalYari += yari;
      totalAori += aori;
      
      if (sum > maxSingleLog) {
        maxSingleLog = sum;
      }
    });

    const grandTotal = totalMaika + totalSurume + totalYari + totalAori;
    const average = grandTotal / fishingLogs.length;

    statTotalSquids.innerHTML = `${grandTotal} <span class="unit">杯</span>`;
    statTotalMaika.textContent = `${totalMaika} 杯`;
    statTotalSurume.textContent = `${totalSurume} 杯`;
    statTotalYari.textContent = `${totalYari} 杯`;
    statTotalAori.textContent = `${totalAori} 杯`;
    statPersonalBest.textContent = `${maxSingleLog} 杯`;
    statAverageSquids.textContent = `${average.toFixed(1)} 杯`;
  };

  // --- Charts Rendering ---
  const renderCharts = () => {
    const sortedChronological = [...fishingLogs].reverse();
    
    // Labels (dates)
    const labels = sortedChronological.map(log => {
      const d = new Date(log.date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });

    // Datasets
    const maikaData = sortedChronological.map(log => log.maika || 0);
    const surumeData = sortedChronological.map(log => log.surume || 0);
    const yariData = sortedChronological.map(log => log.yari || 0);
    const aoriData = sortedChronological.map(log => log.aori || 0);

    // 1. Trend Line/Bar Chart
    const ctxTrend = document.getElementById('trendChart').getContext('2d');
    if (trendChartInstance) {
      trendChartInstance.destroy();
    }
    
    trendChartInstance = new Chart(ctxTrend, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'マイカ',
            data: maikaData,
            backgroundColor: '#ff1493',
            borderRadius: 4,
            stack: 'Stack 0'
          },
          {
            label: 'スルメイカ',
            data: surumeData,
            backgroundColor: '#39ff14',
            borderRadius: 4,
            stack: 'Stack 0'
          },
          {
            label: 'ヤリイカ',
            data: yariData,
            backgroundColor: '#00d2ff',
            borderRadius: 4,
            stack: 'Stack 0'
          },
          {
            label: 'その他',
            data: aoriData,
            backgroundColor: '#fffb14',
            borderRadius: 4,
            stack: 'Stack 0'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#8fa0b5', font: { family: 'Noto Sans JP', size: 10 } },
            position: 'top'
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#8fa0b5', font: { family: 'Outfit' } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#8fa0b5', font: { family: 'Outfit' } }
          }
        }
      }
    });

    // 2. Pie Ratio Chart
    const ctxRatio = document.getElementById('ratioChart').getContext('2d');
    if (ratioChartInstance) {
      ratioChartInstance.destroy();
    }

    let sumMaika = maikaData.reduce((a, b) => a + b, 0);
    let sumSurume = surumeData.reduce((a, b) => a + b, 0);
    let sumYari = yariData.reduce((a, b) => a + b, 0);
    let sumAori = aoriData.reduce((a, b) => a + b, 0);

    const hasData = (sumMaika + sumSurume + sumYari + sumAori) > 0;

    ratioChartInstance = new Chart(ctxRatio, {
      type: 'doughnut',
      data: {
        labels: ['マイカ', 'スルメイカ', 'ヤリイカ', 'その他'],
        datasets: [{
          data: hasData ? [sumMaika, sumSurume, sumYari, sumAori] : [1, 0, 0, 0],
          backgroundColor: ['#ff1493', '#39ff14', '#00d2ff', '#fffb14'],
          borderColor: '#0e1626',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            labels: { color: '#8fa0b5', font: { family: 'Noto Sans JP' } },
            position: 'bottom'
          }
        }
      }
    });
  };

  // --- Form Reset / Edit Mode ---
  const resetForm = () => {
    editIdField.value = '';
    fishingForm.reset();
    countMaika.value = 0;
    countSurume.value = 0;
    countYari.value = 0;
    countAori.value = 0;
    document.getElementById('btn-form-submit').textContent = '記録を保存';
    document.querySelector('input[name="field-weather"][value="晴れ"]').checked = true;
    fieldTide.value = '中潮';
    statusFetchWeather.textContent = '';
  };

  const populateFormForEdit = (logId) => {
    const log = fishingLogs.find(l => l.id === logId);
    if (!log) return;

    editIdField.value = log.id;
    fieldDate.value = log.date;
    fieldArea.value = log.area;
    countMaika.value = log.maika || 0;
    countSurume.value = log.surume || 0;
    countYari.value = log.yari || 0;
    countAori.value = log.aori || 0;
    
    const weatherRadio = document.querySelector(`input[name="field-weather"][value="${log.weather}"]`);
    if (weatherRadio) weatherRadio.checked = true;

    fieldTide.value = log.tide || '中潮';
    fieldRange.value = log.range || '';
    fieldRigSutte.value = log.rigSutte || '';
    fieldRigDropper.value = log.rigDropper || '';
    fieldMemo.value = log.memo || '';

    document.getElementById('btn-form-submit').textContent = '記録を更新';
    switchTab('tab-form');
  };

  // --- History List Rendering ---
  const renderHistory = (searchQuery = '') => {
    historyList.innerHTML = '';
    const query = searchQuery.toLowerCase().trim();

    const filtered = fishingLogs.filter(log => {
      if (!query) return true;
      return (
        log.area.toLowerCase().includes(query) ||
        (log.memo && log.memo.toLowerCase().includes(query)) ||
        log.date.includes(query)
      );
    });

    if (filtered.length === 0) {
      historyList.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p>検索結果が見つかりませんでした。</p>
        </div>`;
      return;
    }

    filtered.forEach(log => {
      const card = document.createElement('div');
      card.className = 'history-card';
      
      const maikaCount = parseInt(log.maika) || 0;
      const surumeCount = parseInt(log.surume) || 0;
      const yariCount = parseInt(log.yari) || 0;
      const aoriCount = parseInt(log.aori) || 0;
      const grandTotal = maikaCount + surumeCount + yariCount + aoriCount;

      card.innerHTML = `
        <div class="history-card-header">
          <div>
            <div class="history-date">${log.date}</div>
            <div class="history-area"><i class="fa-solid fa-ship"></i> ${log.area}</div>
          </div>
          <div class="history-squid-total">${grandTotal} <span>杯</span></div>
        </div>
        <div class="history-body">
          <div class="history-counters-summary" style="flex-wrap: wrap; gap: 8px 12px;">
            <span class="counter-badge b-maika"><i class="fa-solid fa-circle"></i> マイカ: ${maikaCount}杯</span>
            <span class="counter-badge b-surume"><i class="fa-solid fa-circle"></i> スルメ: ${surumeCount}杯</span>
            <span class="counter-badge b-yari" style="color: var(--primary);"><i class="fa-solid fa-circle"></i> ヤリ: ${yariCount}杯</span>
            <span class="counter-badge b-aori" style="color: var(--neon-yellow);"><i class="fa-solid fa-circle"></i> その他: ${aoriCount}杯</span>
          </div>
          <div class="history-details-grid">
            <div class="history-detail-item">
              <span class="lbl">潮汐:</span><span class="val">${log.tide || '未記録'}</span>
            </div>
            <div class="history-detail-item">
              <span class="lbl">天気:</span><span class="val">${log.weather || '未記録'}</span>
            </div>
            <div class="history-detail-item">
              <span class="lbl">レンジ:</span><span class="val">${log.range || '未記録'}</span>
            </div>
          </div>
          ${log.rigSutte || log.rigDropper ? `
            <div class="history-details-grid" style="margin-top: 8px; border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 8px;">
              <div class="history-detail-item" style="grid-column: span 2">
                <span class="lbl"><i class="fa-solid fa-toolbox"></i> スッテ:</span>
                <span class="val">${log.rigSutte || '未記録'} / ${log.rigDropper || '未記録'}</span>
              </div>
            </div>
          ` : ''}
          ${log.memo ? `<div class="history-memo">${log.memo}</div>` : ''}
        </div>
        <div class="history-card-actions">
          <button class="action-btn-sm edit" data-id="${log.id}"><i class="fa-solid fa-pen-to-square"></i> 編集</button>
          <button class="action-btn-sm delete" data-id="${log.id}"><i class="fa-solid fa-trash-can"></i> 削除</button>
        </div>
      `;

      // Event Listeners for actions
      card.querySelector('.edit').addEventListener('click', () => {
        populateFormForEdit(log.id);
      });

      card.querySelector('.delete').addEventListener('click', () => {
        if (confirm('この釣行記録を削除してもよろしいですか？')) {
          fishingLogs = fishingLogs.filter(l => l.id !== log.id);
          saveLogs();
          renderHistory(historySearch.value);
          triggerHapticFeedback();
        }
      });

      historyList.appendChild(card);
    });
  };

  // Search input event
  historySearch.addEventListener('input', (e) => {
    renderHistory(e.target.value);
  });

  // --- Form Submission (Create / Update) ---
  fishingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Custom Validation
    if (!fieldDate.value || !fieldArea.value) {
      alert('日付と船名は必須入力です。');
      return;
    }

    const editId = editIdField.value;
    const newLog = {
      id: editId || 'log-' + Date.now(),
      date: fieldDate.value,
      area: fieldArea.value,
      maika: parseInt(countMaika.value) || 0,
      surume: parseInt(countSurume.value) || 0,
      yari: parseInt(countYari.value) || 0,
      aori: parseInt(countAori.value) || 0,
      weather: document.querySelector('input[name="field-weather"]:checked').value,
      tide: fieldTide.value,
      range: fieldRange.value,
      rigSutte: fieldRigSutte.value,
      rigDropper: fieldRigDropper.value,
      memo: fieldMemo.value
    };

    if (editId) {
      // Update
      const index = fishingLogs.findIndex(l => l.id === editId);
      if (index !== -1) {
        fishingLogs[index] = newLog;
      }
    } else {
      // Create new
      fishingLogs.push(newLog);
    }

    saveLogs();
    resetForm();
    switchTab('tab-dashboard');
    triggerHapticFeedback();
  });

  // --- CSV Export / Import ---
  const exportToCSV = () => {
    if (fishingLogs.length === 0) {
      alert('エクスポートするデータがありません。');
      return;
    }

    const headers = ['ID', '日付', '釣行エリア・船名', 'マイカ杯数', 'スルメイカ杯数', 'ヤリイカ杯数', 'アオリイカ杯数', '天気', '潮汐', 'レンジ', 'メタルスッテ', 'ドロッパー', 'メモ'];
    const csvRows = [headers.join(',')];

    fishingLogs.forEach(log => {
      const values = [
        log.id,
        log.date,
        `"${(log.area || '').replace(/"/g, '""')}"`,
        log.maika || 0,
        log.surume || 0,
        log.yari || 0,
        log.aori || 0,
        log.weather || '',
        log.tide || '',
        `"${(log.range || '').replace(/"/g, '""')}"`,
        `"${(log.rigSutte || '').replace(/"/g, '""')}"`,
        `"${(log.rigDropper || '').replace(/"/g, '""')}"`,
        `"${(log.memo || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(values.join(','));
    });

    const csvContent = "\uFEFF" + csvRows.join('\n'); // Add UTF-8 BOM
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ikametal_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importFromCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      const text = evt.target.result;
      const lines = text.split(/\r?\n/);
      if (lines.length <= 1) return;

      const imported = [];
      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Custom parser to handle quotes and commas properly
        const parts = [];
        let current = '';
        let inQuotes = false;
        
        for (let charIndex = 0; charIndex < line.length; charIndex++) {
          const char = line[charIndex];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            parts.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        parts.push(current);

        if (parts.length >= 7) {
          imported.push({
            id: parts[0] || 'log-' + Date.now() + '-' + i,
            date: parts[1],
            area: parts[2] ? parts[2].replace(/^"|"$/g, '') : '',
            maika: parseInt(parts[3]) || 0,
            surume: parseInt(parts[4]) || 0,
            yari: parseInt(parts[5]) || 0,
            aori: parseInt(parts[6]) || 0,
            weather: parts[7] || '晴れ',
            tide: parts[8] || '中潮',
            range: parts[9] ? parts[9].replace(/^"|"$/g, '') : '',
            rigSutte: parts[10] ? parts[10].replace(/^"|"$/g, '') : '',
            rigDropper: parts[11] ? parts[11].replace(/^"|"$/g, '') : '',
            memo: parts[12] ? parts[12].replace(/^"|"$/g, '') : ''
          });
        }
      }

      if (imported.length > 0) {
        if (confirm(`${imported.length}件の記録を読み込みます。既存のリストに追加してもよろしいですか？`)) {
          // Avoid duplicate IDs
          imported.forEach(newLog => {
            fishingLogs = fishingLogs.filter(l => l.id !== newLog.id);
            fishingLogs.push(newLog);
          });
          saveLogs();
          fishingLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
          renderStats();
          renderCharts();
          renderHistory();
          alert('インポートが完了しました。');
        }
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  document.getElementById('btn-export').addEventListener('click', exportToCSV);
  
  const triggerImport = document.getElementById('btn-import-trigger');
  const fileInput = document.getElementById('csv-import');
  
  triggerImport.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', importFromCSV);

  // Astronomical Moon Phase estimation to calculate Tide (Oshio, Chushio, etc.)
  const calculateTideFromDate = (dateString) => {
    const date = new Date(dateString);
    // Reference New Moon: 2000-01-07 (Moon Age = 0)
    const refDate = new Date('2000-01-07T18:14:00Z');
    const diffMs = date.getTime() - refDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    
    // Moon cycle is ~29.53059 days
    const moonAge = (diffDays % 29.53059 + 29.53059) % 29.53059;

    // Map moon age to Japanese traditional tides
    const age = Math.round(moonAge);
    
    if (age <= 2 || (age >= 14 && age <= 17) || age >= 29) {
      return '大潮';
    } else if ((age >= 3 && age <= 6) || (age >= 12 && age <= 13) || (age >= 18 && age <= 21) || (age >= 27 && age <= 28)) {
      return '中潮';
    } else if ((age >= 7 && age <= 9) || (age >= 22 && age <= 24)) {
      return '小潮';
    } else if (age === 10 || age === 25) {
      return '長潮';
    } else { // age === 11 || age === 26
      return '若潮';
    }
  };

  const handleFetchWeather = async () => {
    const dateVal = fieldDate.value;

    if (!dateVal) {
      statusFetchWeather.textContent = '先に日付を入力してください。';
      statusFetchWeather.style.color = '#ff5e62';
      return;
    }

    statusFetchWeather.textContent = '敦賀の気象データを取得中...';
    statusFetchWeather.style.color = 'var(--text-muted)';

    // 1. Calculate Tide immediately (100% offline, failsafe)
    let tideResult = '中潮';
    try {
      tideResult = calculateTideFromDate(dateVal);
      fieldTide.value = tideResult;
    } catch (e) {
      console.error('Tide calc failed', e);
    }

    try {
      // For iPhone/Safari compatibility, parse date carefully to avoid timezone/invalid date bugs
      // split string to avoid Safari Date constructor bugs with YYYY-MM-DD
      const dateParts = dateVal.split('-');
      const inputYear = parseInt(dateParts[0]);
      const inputMonth = parseInt(dateParts[1]) - 1;
      const inputDay = parseInt(dateParts[2]);
      
      const inputDate = new Date(inputYear, inputMonth, inputDay, 12, 0, 0); // Noon to avoid boundary errors
      
      const today = new Date();
      today.setHours(12, 0, 0, 0);

      const lat = 35.6517;
      const lon = 136.0678;
      
      // Determine if we need Archive API or Forecast API
      let fetchUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${dateVal}&end_date=${dateVal}&hourly=weathercode,temperature_2m,windspeed_10m&timezone=Asia%2FTokyo`;
      if (inputDate >= today) {
        fetchUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=weathercode,temperature_2m,windspeed_10m&timezone=Asia%2FTokyo&forecast_days=3`;
      }

      // Add a small timeout (5 seconds) to fetch request to prevent hanging on Safari
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(fetchUrl, { 
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('API Server responded with code: ' + response.status);
      
      const data = await response.json();
      
      if (data && data.hourly && data.hourly.time) {
        // Find 20:00 index
        let timeIndex = data.hourly.time.findIndex(t => t.endsWith('T20:00') || t.includes('T20:00:00'));
        if (timeIndex === -1) timeIndex = 20; // Fallback to index 20
        
        const weatherCode = (data.hourly.weathercode && data.hourly.weathercode[timeIndex] !== undefined) ? data.hourly.weathercode[timeIndex] : 0;
        const temp = (data.hourly.temperature_2m && data.hourly.temperature_2m[timeIndex] !== undefined) ? data.hourly.temperature_2m[timeIndex] : 22;
        const wind = (data.hourly.windspeed_10m && data.hourly.windspeed_10m[timeIndex] !== undefined) ? data.hourly.windspeed_10m[timeIndex] : 5;

        // Map Weather
        let mappedWeather = '晴れ';
        if (weatherCode >= 2 && weatherCode <= 4) {
          mappedWeather = '曇り';
        } else if (weatherCode >= 50) {
          mappedWeather = '雨';
        }

        const weatherRadio = document.querySelector(`input[name="field-weather"][value="${mappedWeather}"]`);
        if (weatherRadio) weatherRadio.checked = true;

        statusFetchWeather.textContent = `敦賀 取得成功: 潮汐=[${tideResult}], 天気=[${mappedWeather}], 気温=[${temp}℃], 風=[${(wind * 0.27778).toFixed(1)}m/s]`;
        statusFetchWeather.style.color = 'var(--neon-green)';

        // Pre-fill notes nicely if empty
        if (!fieldMemo.value) {
          fieldMemo.value = `【敦賀 気象】20-翌05時頃: 天候 ${mappedWeather} / 気温 約${temp}℃ / 風速 約${(wind * 0.27778).toFixed(1)}m/s。`;
        }
      } else {
        statusFetchWeather.textContent = `潮汐のみ算定: ${tideResult} (気象APIデータ構造不一致)`;
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      // Give visual alert to see if Apple blocks the request (e.g. Mixed Content, CORS or network errors)
      statusFetchWeather.textContent = `潮汐のみ算定: ${tideResult} (天気取得エラー: ${err.message || err})`;
      statusFetchWeather.style.color = '#ffb300';
    }
  };

  // Add click and touchstart event listeners for iOS Safari double-binding compatibility
  btnFetchWeather.addEventListener('click', (e) => {
    e.preventDefault();
    handleFetchWeather();
  });
  
  btnFetchWeather.addEventListener('touchstart', (e) => {
    // Only trigger touchstart logic if we want to bypass 300ms click delay
    // Prevent default to avoid double fire
    e.preventDefault();
    handleFetchWeather();
  }, { passive: false });

  // --- Initial Render ---
  loadLogs();
  renderStats();
  renderCharts();
});

