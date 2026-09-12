/**
 * 🍌 PAZHAM PORI ECONOMY™ UI Controller
 * "Kerala's Most Unnecessary Financial Market"
 * Manages Bloomberg Terminal canvas charts, live Market Share Dashboard, Leaderboard Battles,
 * Scatter plots, Trade Marketing Metrics, Toast Notifications, and AI Analyst.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.PazhamPoriEngine) return;

  const engine = window.PazhamPoriEngine;

  // DOM Elements
  const tickerTrack = document.getElementById('tickerTrack');
  const ksiValEl = document.getElementById('ksiVal');
  const ksiPctEl = document.getElementById('ksiPct');

  const marketShareDashboard = document.getElementById('marketShareDashboard');
  const battleLeaderboard = document.getElementById('battleLeaderboard');
  const metricsCardsGrid = document.getElementById('metricsCardsGrid');
  const insightsList = document.getElementById('insightsList');
  const snackGrid = document.getElementById('snackGrid');
  const sentimentMood = document.getElementById('sentimentMood');
  const sentimentText = document.getElementById('sentimentText');
  const newsFeedList = document.getElementById('newsFeedList');
  const portCash = document.getElementById('portCash');
  const portVal = document.getElementById('portVal');
  const portPL = document.getElementById('portPL');
  const holdingsList = document.getElementById('holdingsList');
  const toastContainer = document.getElementById('toastContainer');
  const scatterInsightText = document.getElementById('scatterInsightText');

  // Modals & Drawers
  const tradeModal = document.getElementById('tradeModal');
  const tradeModalTitle = document.getElementById('tradeModalTitle');
  const tradeQtyInput = document.getElementById('tradeQtyInput');
  const tradeTotalCalc = document.getElementById('tradeTotalCalc');
  const confirmTradeBtn = document.getElementById('confirmTradeBtn');
  const cancelTradeBtn = document.getElementById('cancelTradeBtn');

  const crashOverlay = document.getElementById('crashOverlay');
  const crashPct = document.getElementById('crashPct');
  const crashCauseText = document.getElementById('crashCauseText');
  const ackCrashBtn = document.getElementById('ackCrashBtn');

  const endDayBtn = document.getElementById('endDayBtn');
  const endDayModal = document.getElementById('endDayModal');
  const endDayTitle = document.getElementById('endDayTitle');
  const endDayKSI = document.getElementById('endDayKSI');
  const endDayPortVal = document.getElementById('endDayPortVal');
  const endDayPL = document.getElementById('endDayPL');
  const endDayBest = document.getElementById('endDayBest');
  const endDayWorst = document.getElementById('endDayWorst');
  const restartTradingBtn = document.getElementById('restartTradingBtn');

  const analystFloatBtn = document.getElementById('analystFloatBtn');
  const analystModal = document.getElementById('analystModal');
  const analystInput = document.getElementById('analystInput');
  const askAnalystBtn = document.getElementById('askAnalystBtn');
  const analystResponseBox = document.getElementById('analystResponseBox');
  const closeAnalystBtn = document.getElementById('closeAnalystBtn');

  // Canvas Charts
  const ksiCanvas = document.getElementById('ksiChart');
  let ksiCtx = ksiCanvas ? ksiCanvas.getContext('2d') : null;

  const shareCanvas = document.getElementById('shareChart');
  let shareCtx = shareCanvas ? shareCanvas.getContext('2d') : null;

  const scatterCanvas = document.getElementById('scatterChart');
  let scatterCtx = scatterCanvas ? scatterCanvas.getContext('2d') : null;

  let activeTradeContext = null;

  // Colors for snack line series
  const ASSET_COLORS = {
    PZP: '#f59e0b',
    PRT: '#ec4899',
    CHY: '#8b5cf6',
    PPV: '#10b981',
    BHJ: '#06b6d4',
    SMB: '#f43f5e'
  };

  // Rank Badges
  const RANK_BADGES = { 1: '🥇', 2: '🥈', 3: '🥉', 4: '4️⃣', 5: '5️⃣', 6: '6️⃣' };

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  // --------------------------------------------------------------------------
  // 1. TICKER TAPE RENDERER
  // --------------------------------------------------------------------------
  function renderTickerTape() {
    if (!tickerTrack) return;
    const { assets } = engine.getState();
    let html = '';

    for (let i = 0; i < 2; i++) {
      for (const t in assets) {
        const a = assets[t];
        const pct = (((a.price - a.prevClose) / a.prevClose) * 100).toFixed(1);
        const isUp = pct >= 0;
        const arrow = isUp ? '▲' : '▼';
        const cls = isUp ? 'up' : 'down';

        html += `
          <div class="ticker-item">
            <span class="ticker-symbol">${a.emoji} ${a.ticker}</span>
            <span class="ticker-price">₹${a.price.toFixed(2)}</span>
            <span class="ticker-change ${cls}">${arrow}${Math.abs(pct)}%</span>
            <span style="color: #9ca3af; font-size: 0.72rem;">(${a.marketShare}% share)</span>
          </div>
        `;
      }
    }
    tickerTrack.innerHTML = html;
  }

  // --------------------------------------------------------------------------
  // 2. MARKET SHARE DASHBOARD RENDERER
  // --------------------------------------------------------------------------
  function renderMarketShareDashboard() {
    if (!marketShareDashboard) return;
    const { assets } = engine.getState();
    const sortedAssets = Object.values(assets).sort((a, b) => b.marketShare - a.marketShare);

    let html = '';
    sortedAssets.forEach(a => {
      const isLeader = a.rank === 1;
      const ppChange = a.marketSharePPChange || 0;
      const ppSign = ppChange >= 0 ? '+' : '';
      const ppCls = ppChange >= 0 ? 'up' : 'down';
      const badge = RANK_BADGES[a.rank] || '▫️';

      html += `
        <div class="share-row-item ${isLeader ? 'leader' : ''}">
          <div class="share-meta-row">
            <div class="share-asset-title">
              <span class="rank-badge">${badge}</span>
              <span>${a.emoji} ${a.name.toUpperCase()} (${a.ticker})</span>
            </div>
            <div class="share-values-col">
              <span class="share-pct-val">${a.marketShare.toFixed(1)}%</span>
              <span class="share-pp-change ${ppCls}">${ppSign}${ppChange.toFixed(1)} pp</span>
            </div>
          </div>

          <div class="share-bar-wrapper">
            <div class="share-bar-fill ${a.ticker}" style="width: ${Math.max(3, a.marketShare)}%;"></div>
          </div>

          <div class="share-sub-stats">
            <span>Sales Volume: <strong>${a.salesVolume} units</strong></span>
            <span>Demand: <strong>${a.demand}%</strong></span>
            <span>Availability: <strong>${a.stockAvailability}%</strong></span>
          </div>
        </div>
      `;
    });

    marketShareDashboard.innerHTML = html;
  }

  // --------------------------------------------------------------------------
  // 3. SNACK MARKET BATTLE LEADERBOARD RENDERER
  // --------------------------------------------------------------------------
  function renderLeaderboard() {
    if (!battleLeaderboard) return;
    const { assets } = engine.getState();
    const sorted = Object.values(assets).sort((a, b) => b.marketShare - a.marketShare);

    let html = '';
    sorted.forEach(a => {
      const badge = RANK_BADGES[a.rank] || '';
      html += `
        <div class="leaderboard-item rank-${a.rank}">
          <div>
            <strong>${badge} ${a.emoji} ${a.shortName}</strong>
            <span style="font-size: 0.72rem; color: var(--text-dim); margin-left: 6px;">(${a.ticker})</span>
          </div>
          <div>
            <strong style="font-family: var(--font-mono); color: #ffffff;">${a.marketShare.toFixed(1)}%</strong>
            <span style="font-size: 0.72rem; color: #38bdf8; margin-left: 6px;">${a.sentiment}</span>
          </div>
        </div>
      `;
    });
    battleLeaderboard.innerHTML = html;
  }

  // --------------------------------------------------------------------------
  // 4. TRADE MARKETING METRICS CARDS RENDERER
  // --------------------------------------------------------------------------
  function renderTradeMetrics() {
    if (!metricsCardsGrid) return;
    const { assets } = engine.getState();
    let html = '';

    for (const t in assets) {
      const a = assets[t];
      html += `
        <div class="metric-card-item">
          <div class="m-card-title">
            <span>${a.emoji} ${a.shortName}</span>
            <span style="color: #f59e0b;">${a.marketShare}% Share</span>
          </div>
          <div class="m-card-row">
            <span>Sales Volume:</span> <span class="m-card-val">${a.salesVolume} units</span>
          </div>
          <div class="m-card-row">
            <span>Demand Index:</span> <span class="m-card-val">${a.demand}/100</span>
          </div>
          <div class="m-card-row">
            <span>Availability:</span> <span class="m-card-val">${a.stockAvailability}%</span>
          </div>
          <div class="m-card-row">
            <span>Promo Boost:</span> <span class="m-card-val" style="color: #10b981;">+${a.promotionEffect}%</span>
          </div>
          <div class="m-card-row">
            <span>Sentiment:</span> <span class="m-card-val">${a.sentiment}</span>
          </div>
        </div>
      `;
    }
    metricsCardsGrid.innerHTML = html;
  }

  // --------------------------------------------------------------------------
  // 5. TRADE MARKETING INSIGHTS RENDERER
  // --------------------------------------------------------------------------
  function renderInsights() {
    if (!insightsList) return;
    const list = engine.generateMarketInsights();
    let html = '';
    list.forEach(txt => {
      html += `<div class="insight-item">💡 ${txt}</div>`;
    });
    insightsList.innerHTML = html;
  }

  // --------------------------------------------------------------------------
  // 6. MARKET SHARE HISTORY CANVAS CHART (MULTI-SERIES)
  // --------------------------------------------------------------------------
  function renderShareChart() {
    if (!shareCanvas || !shareCtx) return;

    const rect = shareCanvas.getBoundingClientRect();
    shareCanvas.width = rect.width * window.devicePixelRatio || 600;
    shareCanvas.height = rect.height * window.devicePixelRatio || 240;

    const width = shareCanvas.width;
    const height = shareCanvas.height;
    const { assets } = engine.getState();

    shareCtx.clearRect(0, 0, width, height);

    const padding = 30;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    // Draw Grid Lines (0% to 60%)
    shareCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    shareCtx.lineWidth = 1;
    for (let y = 0; y <= 60; y += 15) {
      const gridY = height - padding - (y / 60) * chartHeight;
      shareCtx.beginPath();
      shareCtx.moveTo(padding, gridY);
      shareCtx.lineTo(width - padding, gridY);
      shareCtx.stroke();
    }

    // Render line per asset
    for (const t in assets) {
      const a = assets[t];
      const history = a.shareHistory || [a.marketShare];
      if (history.length < 2) continue;

      const points = history.map((val, idx) => {
        const x = padding + (idx / (history.length - 1)) * chartWidth;
        const y = height - padding - (val / 60) * chartHeight;
        return { x, y };
      });

      shareCtx.beginPath();
      shareCtx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        shareCtx.lineTo(points[i].x, points[i].y);
      }
      shareCtx.strokeStyle = ASSET_COLORS[t] || '#ffffff';
      shareCtx.lineWidth = (a.rank === 1 ? 3.5 : 2) * window.devicePixelRatio;
      shareCtx.stroke();
    }
  }

  // --------------------------------------------------------------------------
  // 7. PRICE VS MARKET SHARE SCATTER PLOT CANVAS
  // --------------------------------------------------------------------------
  function renderScatterChart() {
    if (!scatterCanvas || !scatterCtx) return;

    const rect = scatterCanvas.getBoundingClientRect();
    scatterCanvas.width = rect.width * window.devicePixelRatio || 600;
    scatterCanvas.height = rect.height * window.devicePixelRatio || 220;

    const width = scatterCanvas.width;
    const height = scatterCanvas.height;
    const { assets } = engine.getState();

    scatterCtx.clearRect(0, 0, width, height);

    const padding = 35;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    // Axes
    scatterCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    scatterCtx.lineWidth = 1;
    scatterCtx.beginPath();
    scatterCtx.moveTo(padding, padding);
    scatterCtx.lineTo(padding, height - padding);
    scatterCtx.lineTo(width - padding, height - padding);
    scatterCtx.stroke();

    // Plot Points (X = Price ₹5 to ₹35, Y = Share 0% to 60%)
    for (const t in assets) {
      const a = assets[t];
      const x = padding + (clamp(a.price, 5, 35) - 5) / 30 * chartWidth;
      const y = height - padding - (clamp(a.marketShare, 0, 60) / 60) * chartHeight;

      scatterCtx.beginPath();
      scatterCtx.arc(x, y, 8 * window.devicePixelRatio, 0, Math.PI * 2);
      scatterCtx.fillStyle = ASSET_COLORS[t] || '#38bdf8';
      scatterCtx.fill();

      // Label
      scatterCtx.font = `bold ${11 * window.devicePixelRatio}px "JetBrains Mono", monospace`;
      scatterCtx.fillStyle = '#ffffff';
      scatterCtx.fillText(`${a.emoji} ${a.ticker}`, x + 10, y + 4);
    }

    if (scatterInsightText) {
      const sorted = Object.values(assets).sort((a, b) => b.marketShare - a.marketShare);
      scatterInsightText.textContent = `"${sorted[0].name} is currently priced at ₹${sorted[0].price.toFixed(2)} with a dominant ${sorted[0].marketShare}% market share. Consumer demand remains resilient!"`;
    }
  }

  // --------------------------------------------------------------------------
  // 8. KSI LINE CHART RENDERER
  // --------------------------------------------------------------------------
  function renderKSIChart() {
    if (!ksiCanvas || !ksiCtx) return;

    const rect = ksiCanvas.getBoundingClientRect();
    ksiCanvas.width = rect.width * window.devicePixelRatio || 600;
    ksiCanvas.height = rect.height * window.devicePixelRatio || 240;

    const width = ksiCanvas.width;
    const height = ksiCanvas.height;
    const { ksiHistory } = engine.getState();
    if (ksiHistory.length < 2) return;

    ksiCtx.clearRect(0, 0, width, height);
    const minVal = Math.min(...ksiHistory) * 0.98;
    const maxVal = Math.max(...ksiHistory) * 1.02;
    const range = maxVal - minVal || 1;

    const padding = 30;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    const points = ksiHistory.map((val, idx) => {
      const x = padding + (idx / (ksiHistory.length - 1)) * chartWidth;
      const y = height - padding - ((val - minVal) / range) * chartHeight;
      return { x, y };
    });

    const isUp = ksiHistory[ksiHistory.length - 1] >= ksiHistory[0];
    const strokeColor = isUp ? '#10b981' : '#ef4444';

    ksiCtx.beginPath();
    ksiCtx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ksiCtx.lineTo(points[i].x, points[i].y);
    ksiCtx.strokeStyle = strokeColor;
    ksiCtx.lineWidth = 3 * window.devicePixelRatio;
    ksiCtx.stroke();
  }

  // --------------------------------------------------------------------------
  // 9. ASSET CARDS GRID RENDERER
  // --------------------------------------------------------------------------
  function renderSnackCards() {
    if (!snackGrid) return;
    const { assets } = engine.getState();
    let html = '';

    for (const t in assets) {
      const a = assets[t];
      const pct = (((a.price - a.prevClose) / a.prevClose) * 100).toFixed(2);
      const isUp = pct >= 0;
      const cls = isUp ? 'up' : 'down';
      const sign = isUp ? '+' : '';

      html += `
        <div class="snack-card" id="card-${t}">
          <div class="snack-card-header">
            <div class="snack-emoji-box" data-easteregg="${t}">${a.emoji}</div>
            <div class="snack-meta">
              <div class="snack-name">${a.shortName}</div>
              <div class="snack-ticker">${a.ticker} • ${a.marketShare}% Share</div>
            </div>
          </div>
          <div class="snack-price-row">
            <span class="snack-price">₹${a.price.toFixed(2)}</span>
            <span class="snack-change-badge ${cls}">${sign}${pct}%</span>
          </div>
          <div class="snack-stats-mini">
            <span>High: ₹${a.high.toFixed(2)}</span>
            <span>Sales: ${a.salesVolume} units</span>
          </div>
          <div class="snack-action-btns">
            <button class="trade-btn buy" onclick="openTradeModal('${t}', 'BUY')">BUY</button>
            <button class="trade-btn sell" onclick="openTradeModal('${t}', 'SELL')">SELL</button>
          </div>
        </div>
      `;
    }
    snackGrid.innerHTML = html;

    document.querySelectorAll('.snack-emoji-box').forEach(box => {
      box.addEventListener('click', (e) => {
        const t = e.currentTarget.getAttribute('data-easteregg');
        const eggMsg = engine.triggerEasterEgg(t);
        if (eggMsg) alert(eggMsg);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. PORTFOLIO & NEWS RENDERER
  // --------------------------------------------------------------------------
  function renderPortfolio() {
    if (!portCash || !portVal || !portPL || !holdingsList) return;

    const { holdings } = engine.getState().portfolio;
    const { assets } = engine.getState();
    const portSummary = engine.getPortfolioValue();

    portCash.textContent = `₹${portSummary.cash.toFixed(2)}`;
    portVal.textContent = `₹${portSummary.totalValue.toFixed(2)}`;

    const plSign = portSummary.profitLoss >= 0 ? '+' : '';
    const plCls = portSummary.profitLoss >= 0 ? 'profit' : 'loss';
    portPL.textContent = `${plSign}₹${portSummary.profitLoss.toFixed(2)} (${plSign}${portSummary.profitLossPct.toFixed(2)}%)`;
    portPL.className = `pl-badge ${plCls}`;

    let html = '';
    let hasHoldings = false;

    for (const t in holdings) {
      const h = holdings[t];
      if (h.shares > 0 && assets[t]) {
        hasHoldings = true;
        const curValue = h.shares * assets[t].price;
        const costBasis = h.shares * h.avgPrice;
        const diff = curValue - costBasis;
        const diffCls = diff >= 0 ? 'up' : 'down';
        const diffSign = diff >= 0 ? '+' : '';

        html += `
          <div class="holding-item">
            <div class="holding-info">
              <span class="holding-ticker">${assets[t].emoji} ${t}</span>
              <span class="holding-shares">${h.shares} shares @ ₹${h.avgPrice.toFixed(2)}</span>
            </div>
            <div class="holding-val-col" style="text-align: right;">
              <div style="font-weight: 800; font-family: var(--font-mono);">₹${curValue.toFixed(2)}</div>
              <div class="ticker-change ${diffCls}" style="font-size: 0.72rem;">${diffSign}₹${diff.toFixed(2)}</div>
            </div>
          </div>
        `;
      }
    }

    if (!hasHoldings) html = '<div style="font-size: 0.8rem; color: var(--text-dim); text-align: center; padding: 12px;">No active snack holdings. Start buying! 🍌</div>';
    holdingsList.innerHTML = html;
  }

  function renderNewsFeed() {
    if (!newsFeedList) return;
    const { newsFeed } = engine.getState();
    let html = '';

    newsFeed.forEach(n => {
      html += `
        <div class="news-card ${n.severity}">
          <div class="news-header-row">
            <span class="news-cat-badge">${n.category}</span>
            <span class="news-time">${n.timestamp}</span>
          </div>
          <div class="news-headline">${n.title}</div>
          <div class="news-body">${n.newsText}</div>
        </div>
      `;
    });
    if (newsFeed.length === 0) html = '<div style="font-size: 0.8rem; color: var(--text-dim); text-align: center; padding: 20px;">Waiting for breaking snack news... 📰</div>';
    newsFeedList.innerHTML = html;
  }

  // --------------------------------------------------------------------------
  // 11. TOAST NOTIFICATIONS & GLOBAL STATE UPDATE HANDLER
  // --------------------------------------------------------------------------
  function showToast(title, desc) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `<div><strong>${title}</strong><div style="font-size: 0.78rem; color: var(--text-secondary);">${desc}</div></div>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4500);
  }

  function updateAllUI(eventType, payload) {
    if (eventType === 'ACHIEVEMENT_UNLOCKED' && payload) {
      showToast(payload.title, payload.desc);
      return;
    }

    const { ksi, ksiPrevClose } = engine.getState();
    const ksiDiff = ksi - ksiPrevClose;
    const ksiPct = ((ksiDiff / ksiPrevClose) * 100).toFixed(2);
    const ksiIsUp = ksiDiff >= 0;

    if (ksiValEl) ksiValEl.textContent = ksi.toFixed(2);
    if (ksiPctEl) {
      ksiPctEl.textContent = `${ksiIsUp ? '+' : ''}${ksiPct}% TODAY`;
      ksiPctEl.className = `ksi-pct ${ksiIsUp ? 'up' : 'down'}`;
    }

    renderTickerTape();
    renderMarketShareDashboard();
    renderLeaderboard();
    renderTradeMetrics();
    renderInsights();
    renderKSIChart();
    renderShareChart();
    renderScatterChart();
    renderSnackCards();
    renderPortfolio();
    renderNewsFeed();

    if (payload && payload.event && payload.event.severity === 'CRASH') {
      triggerCrashOverlay(payload.event);
    }
  }

  // --------------------------------------------------------------------------
  // 12. TRADE EXECUTION & MODALS
  // --------------------------------------------------------------------------
  window.openTradeModal = function (ticker, type) {
    activeTradeContext = { ticker, type };
    const { assets } = engine.getState();
    const asset = assets[ticker];
    if (!asset || !tradeModal) return;

    tradeModalTitle.textContent = `${type} ${asset.emoji} ${asset.name} (${asset.ticker})`;
    tradeQtyInput.value = '10';
    updateTradeTotal();
    tradeModal.classList.remove('hidden');
  };

  function updateTradeTotal() {
    if (!activeTradeContext || !tradeQtyInput || !tradeTotalCalc) return;
    const { assets } = engine.getState();
    const asset = assets[activeTradeContext.ticker];
    const qty = parseInt(tradeQtyInput.value, 10) || 0;
    const total = (asset ? asset.price : 0) * qty;
    tradeTotalCalc.textContent = `Total Cost: ₹${total.toFixed(2)}`;
  }

  if (tradeQtyInput) tradeQtyInput.addEventListener('input', updateTradeTotal);

  if (confirmTradeBtn) {
    confirmTradeBtn.addEventListener('click', () => {
      if (!activeTradeContext) return;
      const qty = parseInt(tradeQtyInput.value, 10);
      let res = activeTradeContext.type === 'BUY' ? engine.buyAsset(activeTradeContext.ticker, qty) : engine.sellAsset(activeTradeContext.ticker, qty);

      if (res.success) {
        alert(res.message);
        tradeModal.classList.add('hidden');
        renderPortfolio();
      } else {
        alert('Trade Failed: ' + res.error);
      }
    });
  }

  if (cancelTradeBtn) cancelTradeBtn.addEventListener('click', () => { if (tradeModal) tradeModal.classList.add('hidden'); });

  function triggerCrashOverlay(eventItem) {
    if (!crashOverlay) return;
    crashPct.textContent = `42.8% → 27.3% (▼ -15.5 pp)`;
    crashCauseText.textContent = `CAUSE: ${eventItem.title} — "${eventItem.headline}"`;
    crashOverlay.classList.remove('hidden');
  }

  if (ackCrashBtn) ackCrashBtn.addEventListener('click', () => { if (crashOverlay) crashOverlay.classList.add('hidden'); });

  if (endDayBtn) {
    endDayBtn.addEventListener('click', () => {
      const summary = engine.endTradingDay();
      if (!endDayModal) return;

      endDayTitle.textContent = summary.title;
      endDayKSI.textContent = `${summary.finalKSI} (${summary.ksiChangePct}%)`;
      endDayPortVal.textContent = `₹${summary.portfolioValue}`;
      endDayPL.textContent = `₹${summary.profitLoss} (${summary.profitLossPct}%)`;
      endDayBest.textContent = summary.bestPerformer;
      endDayWorst.textContent = summary.worstPerformer;
      endDayModal.classList.remove('hidden');
    });
  }

  if (restartTradingBtn) restartTradingBtn.addEventListener('click', () => location.reload());

  if (analystFloatBtn && analystModal) analystFloatBtn.addEventListener('click', () => analystModal.classList.remove('hidden'));
  if (closeAnalystBtn) closeAnalystBtn.addEventListener('click', () => analystModal.classList.add('hidden'));

  if (askAnalystBtn && analystInput && analystResponseBox) {
    askAnalystBtn.addEventListener('click', async () => {
      const query = analystInput.value.trim();
      if (!query) return;

      analystResponseBox.textContent = 'Analyzing market indicators (checking canteen tea bill...)... 🤖';
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `You are the chief financial analyst of Pazham Pori Economy stock market. User asks: "${query}". Answer with extreme sarcastic Kerala financial advice in Malayalam/Manglish!`,
            mode: 'chunk',
            conversationHistory: []
          })
        });

        if (res.ok) {
          const data = await res.json();
          analystResponseBox.textContent = data.reply || 'Pazham Pori market share is volatile today. Recommend buying 2 Parippu Vadas and waiting for rain.';
        } else {
          throw new Error('API failed');
        }
      } catch (e) {
        analystResponseBox.textContent = 'Pazham Pori market share is volatile today. Recommend buying 2 Parippu Vadas and waiting for rain.';
      }
    });
  }

  // Subscribe UI to Engine Events
  engine.subscribe(updateAllUI);

  // Initial Paint
  updateAllUI('INIT', null);

  // Automated Engine Tick Loop (Every 3 seconds)
  setInterval(() => {
    engine.tick();
  }, 3000);
});
