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
      // Mock data for initial gorgeous feel
      fishingLogs = [
        {
          id: 'mock-1',
          date: '2026-06-15',
          area: '敦賀・ビッグワン',
          maika: 22,
          surume: 5,
          weather: '晴れ',
          tide: '中潮',
          range: '15-20m',
          rigSutte: '四つ目 15号 赤黄',
          rigDropper: 'おもりスッテ 赤緑',
          memo: '月夜で棚が浅め。20mラインでアタリが頻発した。ドロッパーは赤黄への反応が特によかった。'
        },
        {
          id: 'mock-2',
          date: '2026-06-08',
          area: '越前・泰丸',
          maika: 12,
          surume: 8,
          weather: '曇り',
          tide: '小潮',
          range: '25-35m',
          rigSutte: 'TGスッテ 20号 赤緑',
          rigDropper: 'イージースリム 赤ピンク',
          memo: 'うねりが少しあり。棚がバラけて絞りづらかったが、ボトム付近のスローな誘いでスルメイカが混じった。'
        },
        {
          id: 'mock-3',
          date: '2026-05-25',
          area: '小浜・佐藤丸',
          maika: 31,
          surume: 2,
          weather: '晴れ',
          tide: '大潮',
          range: '10-15m',
          rigSutte: 'メタラー 12号 赤白',
          rigDropper: 'スッテ 赤緑',
          memo: '大爆釣！集魚灯が効き始めてから15m付近で入れ乗り状態。軽い仕掛けが有利だった。'
        }
      ];
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
  const fieldTide = document.getElementById('field-tide');
  const fieldRange = document.getElementById('field-range');
  const fieldRigSutte = document.getElementById('field-rig-sutte');
  const fieldRigDropper = document.getElementById('field-rig-dropper');
  const fieldMemo = document.getElementById('field-memo');

  // Stats Elements
  const statTotalSquids = document.getElementById('stat-total-squids');
  const statTotalMaika = document.getElementById('stat-total-maika');
  const statTotalSurume = document.getElementById('stat-total-surume');
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
      statPersonalBest.textContent = '0 杯';
      statAverageSquids.textContent = '0.0 杯';
      return;
    }

    let totalMaika = 0;
    let totalSurume = 0;
    let maxSingleLog = 0;

    fishingLogs.forEach(log => {
      const maika = parseInt(log.maika) || 0;
      const surume = parseInt(log.surume) || 0;
      const sum = maika + surume;
      totalMaika += maika;
      totalSurume += surume;
      if (sum > maxSingleLog) {
        maxSingleLog = sum;
      }
    });

    const grandTotal = totalMaika + totalSurume;
    const average = grandTotal / fishingLogs.length;

    statTotalSquids.innerHTML = `${grandTotal} <span class="unit">杯</span>`;
    statTotalMaika.textContent = `${totalMaika} 杯`;
    statTotalSurume.textContent = `${totalSurume} 杯`;
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
    const maikaData = sortedChronological.map(log => log.maika);
    const surumeData = sortedChronological.map(log => log.surume);
    const totalData = sortedChronological.map(log => log.maika + log.surume);

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
            borderRadius: 6,
            stack: 'Stack 0'
          },
          {
            label: 'スルメイカ',
            data: surumeData,
            backgroundColor: '#39ff14',
            borderRadius: 6,
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
            ticks: { color: '#8fa0b5', font: { family: 'Outfit' }, stepSize: 10 }
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

    ratioChartInstance = new Chart(ctxRatio, {
      type: 'doughnut',
      data: {
        labels: ['マイカ', 'スルメイカ'],
        datasets: [{
          data: [sumMaika || 1, sumSurume], // default 1 to avoid empty chart display bug
          backgroundColor: ['#ff1493', '#39ff14'],
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
    document.getElementById('btn-form-submit').textContent = '記録を保存';
    document.querySelector('input[name="field-weather"][value="晴れ"]').checked = true;
    fieldTide.value = '中潮';
  };

  const populateFormForEdit = (logId) => {
    const log = fishingLogs.find(l => l.id === logId);
    if (!log) return;

    editIdField.value = log.id;
    fieldDate.value = log.date;
    fieldArea.value = log.area;
    countMaika.value = log.maika;
    countSurume.value = log.surume;
    
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
      const grandTotal = maikaCount + surumeCount;

      card.innerHTML = `
        <div class="history-card-header">
          <div>
            <div class="history-date">${log.date}</div>
            <div class="history-area"><i class="fa-solid fa-location-dot"></i> ${log.area}</div>
          </div>
          <div class="history-squid-total">${grandTotal} <span>杯</span></div>
        </div>
        <div class="history-body">
          <div class="history-counters-summary">
            <span class="counter-badge b-maika"><i class="fa-solid fa-circle"></i> マイカ: ${maikaCount}杯</span>
            <span class="counter-badge b-surume"><i class="fa-solid fa-circle"></i> スルメイカ: ${surumeCount}杯</span>
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
      alert('日付と釣行エリア/船名は必須入力です。');
      return;
    }

    const editId = editIdField.value;
    const newLog = {
      id: editId || 'log-' + Date.now(),
      date: fieldDate.value,
      area: fieldArea.value,
      maika: parseInt(countMaika.value) || 0,
      surume: parseInt(countSurume.value) || 0,
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

    const headers = ['ID', '日付', '釣行エリア・船名', 'マイカ杯数', 'スルメイカ杯数', '天気', '潮汐', 'レンジ', 'メタルスッテ', 'ドロッパー', 'メモ'];
    const csvRows = [headers.join(',')];

    fishingLogs.forEach(log => {
      const values = [
        log.id,
        log.date,
        `"${(log.area || '').replace(/"/g, '""')}"`,
        log.maika,
        log.surume,
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

        if (parts.length >= 5) {
          imported.push({
            id: parts[0] || 'log-' + Date.now() + '-' + i,
            date: parts[1],
            area: parts[2] ? parts[2].replace(/^"|"$/g, '') : '',
            maika: parseInt(parts[3]) || 0,
            surume: parseInt(parts[4]) || 0,
            weather: parts[5] || '晴れ',
            tide: parts[6] || '中潮',
            range: parts[7] ? parts[7].replace(/^"|"$/g, '') : '',
            rigSutte: parts[8] ? parts[8].replace(/^"|"$/g, '') : '',
            rigDropper: parts[9] ? parts[9].replace(/^"|"$/g, '') : '',
            memo: parts[10] ? parts[10].replace(/^"|"$/g, '') : ''
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

  // --- Initial Render ---
  loadLogs();
  renderStats();
  renderCharts();
});
