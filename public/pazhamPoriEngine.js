/**
 * 🍌 PAZHAM PORI ECONOMY™ Engine
 * "Kerala's Most Unnecessary Financial Market"
 * Deterministic & Stochastic Stock Market + Trade Marketing Market-Share Engine.
 * Purely fictional - no real money involved.
 */

window.PazhamPoriEngine = (function () {
  // Initial Snack Assets Catalog with Trade Marketing & Market Share Attributes
  const INITIAL_ASSETS = {
    PZP: {
      ticker: 'PZP',
      name: 'Pazham Pori Industries',
      shortName: 'Pazham Pori',
      emoji: '🍌',
      price: 24.50,
      prevClose: 24.50,
      high: 27.20,
      low: 20.10,
      weight: 0.35,
      demand: 85,
      supply: 90,
      stockAvailability: 88,
      promotionEffect: 0,
      salesVolume: 1284,
      marketShare: 42.8,
      prevMarketShare: 39.4,
      marketSharePPChange: 3.4, // in percentage points (pp)
      rank: 1,
      prevRank: 1,
      sentiment: '🔥 Very Positive',
      history: [20.10, 21.30, 22.80, 23.50, 24.50],
      shareHistory: [38.0, 39.5, 41.0, 40.2, 42.8]
    },
    PRT: {
      ticker: 'PRT',
      name: 'Porotta Corporation',
      shortName: 'Porotta',
      emoji: '🫓',
      price: 18.20,
      prevClose: 18.20,
      high: 19.80,
      low: 16.50,
      weight: 0.25,
      demand: 75,
      supply: 80,
      stockAvailability: 92,
      promotionEffect: 0,
      salesVolume: 882,
      marketShare: 29.4,
      prevMarketShare: 30.6,
      marketSharePPChange: -1.2,
      rank: 2,
      prevRank: 2,
      sentiment: '🙂 Positive',
      history: [17.50, 18.00, 17.80, 18.90, 18.20],
      shareHistory: [31.0, 30.5, 29.8, 30.6, 29.4]
    },
    CHY: {
      ticker: 'CHY',
      name: 'Chaya Global Holdings',
      shortName: 'Chaya',
      emoji: '☕',
      price: 12.00,
      prevClose: 12.00,
      high: 13.10,
      low: 11.20,
      weight: 0.20,
      demand: 65,
      supply: 85,
      stockAvailability: 95,
      promotionEffect: 0,
      salesVolume: 561,
      marketShare: 18.7,
      prevMarketShare: 16.6,
      marketSharePPChange: 2.1,
      rank: 3,
      prevRank: 3,
      sentiment: '☕ High Demand',
      history: [11.00, 11.40, 11.80, 11.90, 12.00],
      shareHistory: [15.5, 16.0, 17.2, 16.6, 18.7]
    },
    PPV: {
      ticker: 'PPV',
      name: 'Parippu Vada Capital',
      shortName: 'Parippu Vada',
      emoji: '🍘',
      price: 9.50,
      prevClose: 9.50,
      high: 10.40,
      low: 8.80,
      weight: 0.12,
      demand: 40,
      supply: 70,
      stockAvailability: 80,
      promotionEffect: 0,
      salesVolume: 186,
      marketShare: 6.2,
      prevMarketShare: 7.0,
      marketSharePPChange: -0.8,
      rank: 4,
      prevRank: 4,
      sentiment: '😐 Stable',
      history: [8.90, 9.10, 9.30, 9.20, 9.50],
      shareHistory: [8.0, 7.5, 7.2, 7.0, 6.2]
    },
    BHJ: {
      ticker: 'BHJ',
      name: 'Bhaji Dynamics',
      shortName: 'Bhaji',
      emoji: '🥔',
      price: 14.00,
      prevClose: 14.00,
      high: 15.60,
      low: 13.10,
      weight: 0.08,
      demand: 30,
      supply: 60,
      stockAvailability: 75,
      promotionEffect: 0,
      salesVolume: 87,
      marketShare: 2.9,
      prevMarketShare: 3.5,
      marketSharePPChange: -0.6,
      rank: 5,
      prevRank: 5,
      sentiment: '😰 Weak Demand',
      history: [13.20, 13.80, 14.20, 13.90, 14.00],
      shareHistory: [4.0, 3.8, 3.5, 3.5, 2.9]
    },
    SMB: {
      ticker: 'SMB',
      name: 'Sambar Mutual Fund',
      shortName: 'Sambar',
      emoji: '🍛',
      price: 22.00,
      prevClose: 22.00,
      high: 23.50,
      low: 20.80,
      weight: 0.07,
      demand: 50,
      supply: 75,
      stockAvailability: 85,
      promotionEffect: 0,
      salesVolume: 320,
      marketShare: 10.0,
      prevMarketShare: 9.8,
      marketSharePPChange: 0.2,
      rank: 4,
      prevRank: 4,
      sentiment: '🙂 Positive',
      history: [21.00, 21.50, 21.80, 22.20, 22.00],
      shareHistory: [9.5, 9.8, 10.0, 9.8, 10.0]
    }
  };

  // 40+ Unique Market Events with Share Effects
  const MARKET_EVENTS = [
    {
      id: 'heavy-rain',
      category: 'WEATHER',
      title: '🌧️ HEAVY RAIN IN KERALA',
      headline: 'Heavy rain disrupts banana supply across Kerala.',
      news: 'Pazham Pori Index crashes as banana supply concerns hit tea shops.',
      effects: { PZP: -31.4, PRT: 4.2, CHY: 18.5 },
      demandEffects: { PZP: -40, CHY: 50, PPV: 15 },
      severity: 'CRASH'
    },
    {
      id: 'exam-season',
      category: 'COLLEGE',
      title: '☕ EXAM SEASON BEGINS',
      headline: 'Students suddenly discover caffeine.',
      news: 'CHAYA DEMAND REACHES HISTORIC LEVELS AT CAMPUS SHED.',
      effects: { CHY: 47.2, PZP: 8.5, PPV: 12.0 },
      demandEffects: { CHY: 60, PZP: 10 },
      severity: 'BOOM'
    },
    {
      id: 'porotta-shortage',
      category: 'SUPPLY',
      title: '🫓 POROTTA SHORTAGE REPORTED',
      headline: 'Local porotta production falls unexpectedly.',
      news: 'Porotta futures spike after flour delivery truck stuck in traffic.',
      effects: { PRT: 38.6, BHJ: 15.2 },
      demandEffects: { PRT: 40, PZP: 20 },
      severity: 'BOOM'
    },
    {
      id: 'college-reopens',
      category: 'DEMAND',
      title: '🎓 COLLEGE REOPENS TODAY',
      headline: 'Student snack demand explodes across all sectors.',
      news: 'Canteen registers 400% jump in order volume during morning break.',
      effects: { PZP: 18.4, PRT: 24.1, CHY: 35.8, PPV: 20.2 },
      demandEffects: { PZP: 30, PRT: 35, CHY: 40 },
      severity: 'BOOM'
    },
    {
      id: 'canteen-opens',
      category: 'COMPETITION',
      title: '🧑‍🍳 NEW CANTEEN OPENS NEAR LAB',
      headline: 'Snack supply increases, driving prices down.',
      news: 'New competitor offers ₹10 tea, shocking established vendors.',
      effects: { PZP: -9.5, PRT: -14.2, CHY: -6.8 },
      demandEffects: { CHY: -15, PRT: -20 },
      severity: 'NORMAL'
    },
    {
      id: 'whatsapp-rumour',
      category: 'RUMOUR',
      title: '📱 WHATSAPP FORWARD VIRAL',
      headline: 'Unverified message claims Pazham Pori prices will double tomorrow.',
      news: 'Markets react violently to completely unverified family group forward.',
      effects: { PZP: 62.5, CHY: 10.4 },
      demandEffects: { PZP: 70 },
      severity: 'BOOM'
    },
    {
      id: 'banana-oversupply',
      category: 'SUPPLY',
      title: '🍌 WAYANAD BANANA OVERSUPPLY',
      headline: 'Bumper banana harvest floods Kerala markets.',
      news: 'Pazham Pori traders struggle with excess stock.',
      effects: { PZP: -28.3, BHJ: 8.4 },
      demandEffects: { PZP: -25 },
      severity: 'NORMAL'
    },
    {
      id: 'month-end',
      category: 'ECONOMY',
      title: '💰 MONTH-END FINANCIAL CRISIS',
      headline: 'Students run out of pocket money.',
      news: 'Canteen debt (baaki) reaches record high as liquidity vanishes.',
      effects: { PZP: -18.2, PRT: -22.5, CHY: -15.0, PPV: -25.4, BHJ: -20.1 },
      demandEffects: { PZP: -30, PRT: -35, CHY: -20, PPV: -40, BHJ: -30 },
      severity: 'CRASH'
    },
    {
      id: 'fryer-breakdown',
      category: 'INFRASTRUCTURE',
      title: '🔥 CANTEEN FRYER BREAKDOWN',
      headline: 'Heating coil burns out during peak 11:00 AM rush.',
      news: 'Fried snack index collapses as kitchen switches to boiled snacks.',
      effects: { PZP: -17.8, PPV: -21.4, BHJ: -30.5, CHY: 15.2 },
      demandEffects: { PZP: -35, PPV: -40, BHJ: -50, CHY: 25 },
      severity: 'NORMAL'
    },
    {
      id: 'rain-and-chaya',
      category: 'WEATHER',
      title: '☔ EVENING DRIZZLE + CHAYA',
      headline: 'Rain starts suddenly at 4:30 PM.',
      news: 'Kerala discovers tea once again as evening breeze sets in.',
      effects: { CHY: 41.3, PZP: 15.6, PPV: 22.0 },
      demandEffects: { CHY: 55, PZP: 20 },
      severity: 'BOOM'
    },
    {
      id: 'unexplained-buyer',
      category: 'ABSURD',
      title: '🤨 MYSTERY WHALE BUYER',
      headline: 'One student bought 17 pazham poris at once.',
      news: 'PZP price surges after massive single-order market sweep.',
      effects: { PZP: 73.4 },
      demandEffects: { PZP: 80 },
      severity: 'BOOM'
    },
    {
      id: 'porotta-price-war',
      category: 'COMPETITION',
      title: '🫓 POROTTA PRICE WAR DISASTER',
      headline: 'Porotta stall slashes prices to ₹10 per plate.',
      news: 'Porotta steals massive market share from Pazham Pori!',
      effects: { PRT: -15.0, PZP: -25.0 },
      demandEffects: { PRT: 75, PZP: -45 },
      severity: 'BOOM'
    }
  ];

  // Promotions List
  const PROMOTIONS = [
    {
      id: 'promo-pzp-b2g1',
      title: '📢 PROMOTION: BUY 2 PAZHAM PORIS GET 1 FREE!',
      asset: 'PZP',
      boost: 35,
      headline: 'Canteen launches Buy 2 Get 1 Free Pazham Pori festival.',
      news: 'Pazham Pori demand surges after promotional discount scheme!'
    },
    {
      id: 'promo-chy-combo',
      title: '☕ PROMOTION: CHAYA + PAZHAM PORI COMBO',
      asset: 'CHY',
      boost: 30,
      secondaryAsset: 'PZP',
      secondaryBoost: 25,
      headline: 'Tea shop announces Combo Offer: Hot Chaya + Pazham Pori for ₹30.',
      news: 'Combo deal boosts both Chaya and Pazham Pori market demand!'
    },
    {
      id: 'promo-prt-night',
      title: '🫓 PROMOTION: POROTTA NIGHT DISCOUNTS',
      asset: 'PRT',
      boost: 40,
      headline: 'Late night porotta discount introduced for hostel students.',
      news: 'Porotta sales volume breaks evening trading records!'
    }
  ];

  // Engine Internal State
  let state = {
    assets: JSON.parse(JSON.stringify(INITIAL_ASSETS)),
    ksi: 4281.72,
    ksiPrevClose: 4281.72,
    ksiHistory: [4150, 4200, 4220, 4250, 4281.72],
    marketStatus: 'OPEN',
    tickCount: 0,
    activeEvents: [],
    newsFeed: [],
    achievements: [],
    pzpDominationStreak: 5,
    portfolio: {
      cash: 10000.00,
      holdings: {
        PZP: { shares: 0, avgPrice: 0 },
        PRT: { shares: 0, avgPrice: 0 },
        CHY: { shares: 0, avgPrice: 0 },
        PPV: { shares: 0, avgPrice: 0 },
        BHJ: { shares: 0, avgPrice: 0 }
      },
      transactionHistory: []
    }
  };

  const listeners = [];

  function notifyListeners(eventType, payload) {
    listeners.forEach(fn => fn(eventType, payload));
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  // --------------------------------------------------------------------------
  // CORE MARKET SHARE MATH & ECONOMIC LOOP (Price -> Demand -> Sales -> Share)
  // --------------------------------------------------------------------------
  function updateMarketShareMath() {
    let totalSalesVolume = 0;

    // 1. Calculate Demand & Sales Volume per Asset
    for (const t in state.assets) {
      const a = state.assets[t];
      a.prevMarketShare = a.marketShare;
      a.prevRank = a.rank;

      // Base demand inversely proportional to price + promotion boost
      let baseDemand = 100 - (a.price * 2.2) + a.promotionEffect;
      a.demand = Math.round(clamp(baseDemand, 10, 100));

      // Supply & Stock Availability %
      a.stockAvailability = Math.round(clamp((a.supply / Math.max(1, a.demand)) * 100, 20, 100));

      // Sales Volume calculation (Demand * Availability Factor * Price Scaler)
      const rawSales = a.demand * (a.stockAvailability / 100) * (20 + a.weight * 50);
      a.salesVolume = Math.round(Math.max(10, rawSales));
      totalSalesVolume += a.salesVolume;

      // Update Consumer Sentiment
      if (a.demand >= 75) a.sentiment = '🔥 Very Positive';
      else if (a.demand >= 55) a.sentiment = '🙂 Positive';
      else if (a.demand >= 35) a.sentiment = '😐 Neutral';
      else a.sentiment = '😰 Weak Demand';
    }

    // 2. Calculate Normalized Market Share % (Sum = 100%)
    let sumShare = 0;
    for (const t in state.assets) {
      const a = state.assets[t];
      a.marketShare = Math.round((a.salesVolume / Math.max(1, totalSalesVolume)) * 1000) / 10;
      sumShare += a.marketShare;
    }

    // Adjust residual rounding difference to strictly equal 100%
    const diff = Math.round((100.0 - sumShare) * 10) / 10;
    if (diff !== 0 && state.assets.PZP) {
      state.assets.PZP.marketShare = Math.round((state.assets.PZP.marketShare + diff) * 10) / 10;
    }

    // 3. Calculate Market Share Change in Percentage Points (pp)
    for (const t in state.assets) {
      const a = state.assets[t];
      a.marketSharePPChange = Math.round((a.marketShare - a.prevMarketShare) * 10) / 10;

      a.shareHistory.push(a.marketShare);
      if (a.shareHistory.length > 30) a.shareHistory.shift();
    }

    // 4. Update Rankings & Detect Leader Shifts
    const sortedTickers = Object.keys(state.assets).sort((x, y) => state.assets[y].marketShare - state.assets[x].marketShare);
    sortedTickers.forEach((ticker, idx) => {
      state.assets[ticker].rank = idx + 1;
    });

    // Check if #1 Market Leader shifted
    const newLeader = sortedTickers[0];
    const prevLeader = Object.keys(state.assets).find(t => state.assets[t].prevRank === 1);

    if (newLeader && prevLeader && newLeader !== prevLeader) {
      const headline = `🚨 HISTORIC MARKET EVENT: ${state.assets[newLeader].name.toUpperCase()} HAS OVERTAKEN ${state.assets[prevLeader].name.toUpperCase()}!`;
      const newsItem = {
        id: 'news-takeover-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        title: '👑 MARKET TAKEOVER',
        headline: headline,
        newsText: `${state.assets[newLeader].shortName} now controls ${state.assets[newLeader].marketShare}% of the Kerala snack economy!`,
        severity: 'BOOM',
        category: 'BATTLE',
        affected: `${newLeader}, ${prevLeader}`
      };
      state.newsFeed.unshift(newsItem);
      checkAchievements('TAKEOVER', { newLeader, prevLeader });
    }

    // Domination Streak Tracking for PZP
    if (newLeader === 'PZP') {
      state.pzpDominationStreak += 1;
      if (state.pzpDominationStreak >= 10) {
        checkAchievements('PZP_DOMINATION', null);
      }
    } else {
      state.pzpDominationStreak = 0;
    }

    // Check share crash (>15 pp drop)
    for (const t in state.assets) {
      const a = state.assets[t];
      if (a.marketSharePPChange <= -15.0) {
        checkAchievements('SHARE_COLLAPSE', { asset: a });
      }
    }
  }

  function calculateKSI() {
    let sum = 0;
    for (const key in state.assets) {
      const a = state.assets[key];
      sum += a.price * a.weight;
    }
    return Math.round((sum / 15.5) * 4281.72 * 100) / 100;
  }

  // --------------------------------------------------------------------------
  // ACHIEVEMENTS ENGINE
  // --------------------------------------------------------------------------
  function checkAchievements(triggerType, payload) {
    const list = [
      { id: 'leader', title: '🏆 MARKET LEADER', desc: 'Reach 40% market share', condition: () => Object.values(state.assets).some(a => a.marketShare >= 40) },
      { id: 'monopoly', title: '👑 SNACK MONOPOLY', desc: 'Reach 60% market share', condition: () => Object.values(state.assets).some(a => a.marketShare >= 60) },
      { id: 'takeover', title: '🔥 MARKET TAKEOVER', desc: 'Overtake current market leader', condition: () => triggerType === 'TAKEOVER' },
      { id: 'collapse', title: '📉 SHARE COLLAPSE', desc: 'Lose >15 percentage points in a tick', condition: () => triggerType === 'SHARE_COLLAPSE' },
      { id: 'tea_empire', title: '☕ TEA EMPIRE', desc: 'Chaya reaches 30% market share', condition: () => state.assets.CHY && state.assets.CHY.marketShare >= 30 },
      { id: 'porotta_rev', title: '🫓 POROTTA REVOLUTION', desc: 'Porotta becomes #1 snack', condition: () => state.assets.PRT && state.assets.PRT.rank === 1 },
      { id: 'pzp_dom', title: '🍌 PAZHAM PORI DOMINATION', desc: 'PZP stays #1 for 10 updates', condition: () => state.pzpDominationStreak >= 10 }
    ];

    list.forEach(ach => {
      if (!state.achievements.includes(ach.id) && ach.condition()) {
        state.achievements.push(ach.id);
        notifyListeners('ACHIEVEMENT_UNLOCKED', ach);
      }
    });
  }

  return {
    getState: () => state,
    subscribe: fn => { if (typeof fn === 'function') listeners.push(fn); },

    // Automated Engine Simulation Tick
    tick: function () {
      if (state.marketStatus !== 'OPEN') return;
      state.tickCount += 1;

      let triggeredEvent = null;

      // 20% Chance of Random Event
      if (Math.random() < 0.20 && MARKET_EVENTS.length > 0) {
        const randomIndex = Math.floor(Math.random() * MARKET_EVENTS.length);
        triggeredEvent = MARKET_EVENTS[randomIndex];

        // Apply Price & Demand Effects
        for (const ticker in triggeredEvent.effects) {
          if (state.assets[ticker]) {
            const pct = triggeredEvent.effects[ticker];
            let newPrice = state.assets[ticker].price * (1 + pct / 100);
            state.assets[ticker].price = Math.round(clamp(newPrice, 1.00, 500.00) * 100) / 100;

            if (state.assets[ticker].price > state.assets[ticker].high) state.assets[ticker].high = state.assets[ticker].price;
            if (state.assets[ticker].price < state.assets[ticker].low) state.assets[ticker].low = state.assets[ticker].price;
          }
        }

        if (triggeredEvent.demandEffects) {
          for (const ticker in triggeredEvent.demandEffects) {
            if (state.assets[ticker]) {
              state.assets[ticker].demand = clamp(state.assets[ticker].demand + triggeredEvent.demandEffects[ticker], 10, 100);
            }
          }
        }

        state.newsFeed.unshift({
          id: 'news-' + Date.now(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          title: triggeredEvent.title,
          headline: triggeredEvent.headline,
          newsText: triggeredEvent.news,
          severity: triggeredEvent.severity,
          category: triggeredEvent.category,
          affected: Object.keys(triggeredEvent.effects).join(', ')
        });
      } else if (Math.random() < 0.12 && PROMOTIONS.length > 0) {
        // 12% Chance of Promotion Event
        const promo = PROMOTIONS[Math.floor(Math.random() * PROMOTIONS.length)];
        if (state.assets[promo.asset]) {
          state.assets[promo.asset].promotionEffect = promo.boost;
          setTimeout(() => {
            if (state.assets[promo.asset]) state.assets[promo.asset].promotionEffect = 0;
          }, 9000);
        }
        state.newsFeed.unshift({
          id: 'news-promo-' + Date.now(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          title: promo.title,
          headline: promo.headline,
          newsText: promo.news,
          severity: 'BOOM',
          category: 'PROMOTION',
          affected: promo.asset
        });
      } else {
        // Micro Price Fluctuations
        for (const ticker in state.assets) {
          const deltaPct = (Math.random() * 3.2 - 1.6);
          let newPrice = state.assets[ticker].price * (1 + deltaPct / 100);
          state.assets[ticker].price = Math.round(clamp(newPrice, 1.00, 500.00) * 100) / 100;

          if (state.assets[ticker].price > state.assets[ticker].high) state.assets[ticker].high = state.assets[ticker].price;
          if (state.assets[ticker].price < state.assets[ticker].low) state.assets[ticker].low = state.assets[ticker].price;

          state.assets[ticker].history.push(state.assets[ticker].price);
          if (state.assets[ticker].history.length > 30) state.assets[ticker].history.shift();
        }
      }

      // Update Economic Math (Price -> Demand -> Sales -> Market Share)
      updateMarketShareMath();

      // Recalculate KSI Composite Index
      const newKSI = calculateKSI();
      state.ksi = newKSI;
      state.ksiHistory.push(newKSI);
      if (state.ksiHistory.length > 30) state.ksiHistory.shift();

      notifyListeners('TICK', {
        event: triggeredEvent,
        ksi: state.ksi,
        assets: state.assets
      });

      return { event: triggeredEvent, ksi: state.ksi };
    },

    // Dynamic Trade Marketing Insights Generator
    generateMarketInsights: function () {
      const assets = Object.values(state.assets);
      const sorted = [...assets].sort((a, b) => b.marketShare - a.marketShare);
      const leader = sorted[0];
      const runnerUp = sorted[1];
      const gainer = [...assets].sort((a, b) => b.marketSharePPChange - a.marketSharePPChange)[0];
      const loser = [...assets].sort((a, b) => a.marketSharePPChange - b.marketSharePPChange)[0];

      const insights = [];
      if (gainer && gainer.marketSharePPChange > 0) {
        insights.push(`${gainer.emoji} ${gainer.shortName} gained ${gainer.marketSharePPChange.toFixed(1)} percentage points this session.`);
      }
      if (loser && loser.marketSharePPChange < 0) {
        insights.push(`${loser.emoji} ${loser.shortName} lost ${Math.abs(loser.marketSharePPChange).toFixed(1)} percentage points due to shifts in consumer demand.`);
      }
      insights.push(`${leader.emoji} ${leader.shortName} leads the market with a ${leader.marketShare}% share, holding a ${(leader.marketShare - runnerUp.marketShare).toFixed(1)} pp gap over ${runnerUp.shortName}.`);
      insights.push(`☕ Chaya demand remains closely tied to rain indicators and college exam schedules.`);
      insights.push(`🫓 Porotta sales volume is supported by late-night hostel demand.`);

      return insights;
    },

    buyAsset: function (ticker, quantity) {
      quantity = parseInt(quantity, 10);
      if (isNaN(quantity) || quantity <= 0) return { success: false, error: 'Invalid quantity' };
      const asset = state.assets[ticker];
      if (!asset) return { success: false, error: 'Asset not found' };

      const totalCost = asset.price * quantity;
      if (state.portfolio.cash < totalCost) {
        return { success: false, error: `Insufficient virtual cash! Cost: ₹${totalCost.toFixed(2)}, Balance: ₹${state.portfolio.cash.toFixed(2)}` };
      }

      state.portfolio.cash -= totalCost;
      const holding = state.portfolio.holdings[ticker] || { shares: 0, avgPrice: 0 };
      const newTotalShares = holding.shares + quantity;
      const newAvgPrice = ((holding.shares * holding.avgPrice) + totalCost) / newTotalShares;

      state.portfolio.holdings[ticker] = {
        shares: newTotalShares,
        avgPrice: Math.round(newAvgPrice * 100) / 100
      };

      state.portfolio.transactionHistory.unshift({
        type: 'BUY',
        ticker: ticker,
        name: asset.name,
        shares: quantity,
        price: asset.price,
        total: totalCost,
        timestamp: new Date().toLocaleTimeString()
      });

      notifyListeners('PORTFOLIO_UPDATE', state.portfolio);
      return { success: true, message: `Successfully bought ${quantity} shares of ${ticker} for ₹${totalCost.toFixed(2)}` };
    },

    sellAsset: function (ticker, quantity) {
      quantity = parseInt(quantity, 10);
      if (isNaN(quantity) || quantity <= 0) return { success: false, error: 'Invalid quantity' };
      const asset = state.assets[ticker];
      if (!asset) return { success: false, error: 'Asset not found' };

      const holding = state.portfolio.holdings[ticker];
      if (!holding || holding.shares < quantity) {
        return { success: false, error: `Not enough shares to sell! You own ${holding ? holding.shares : 0} shares.` };
      }

      const totalRevenue = asset.price * quantity;
      state.portfolio.cash += totalRevenue;
      holding.shares -= quantity;
      if (holding.shares === 0) holding.avgPrice = 0;

      state.portfolio.transactionHistory.unshift({
        type: 'SELL',
        ticker: ticker,
        name: asset.name,
        shares: quantity,
        price: asset.price,
        total: totalRevenue,
        timestamp: new Date().toLocaleTimeString()
      });

      notifyListeners('PORTFOLIO_UPDATE', state.portfolio);
      return { success: true, message: `Successfully sold ${quantity} shares of ${ticker} for ₹${totalRevenue.toFixed(2)}` };
    },

    getPortfolioValue: function () {
      let holdingsValue = 0;
      for (const ticker in state.portfolio.holdings) {
        const h = state.portfolio.holdings[ticker];
        if (h.shares > 0 && state.assets[ticker]) {
          holdingsValue += h.shares * state.assets[ticker].price;
        }
      }
      const total = state.portfolio.cash + holdingsValue;
      const profitLoss = total - 10000.00;
      const profitLossPct = (profitLoss / 10000.00) * 100;

      return {
        cash: state.portfolio.cash,
        holdingsValue: holdingsValue,
        totalValue: total,
        profitLoss: profitLoss,
        profitLossPct: profitLossPct
      };
    },

    getMarketMood: function () {
      const ksiChange = ((state.ksi - state.ksiPrevClose) / state.ksiPrevClose) * 100;
      if (ksiChange >= 15) return { mood: '🔥 ABSOLUTELY INSANE', text: 'Investors are frantically buying every snack in sight!' };
      if (ksiChange >= 5) return { mood: '😎 VERY BULLISH', text: 'Tea shop stalls reporting massive snack optimism.' };
      if (ksiChange >= 0) return { mood: '🙂 OPTIMISTIC', text: 'Market sentiment remains warm and fried.' };
      if (ksiChange >= -5) return { mood: '😐 NEUTRAL', text: 'Traders waiting for fresh Pazham Pori batches.' };
      if (ksiChange >= -15) return { mood: '😰 SLIGHTLY WORRIED', text: 'Canteen debt levels raising cautious flags.' };
      return { mood: '💀 MARKET IN RUINS', text: 'Catastrophic crash. Condonation fee panic across campus!' };
    },

    triggerEasterEgg: function (type) {
      if (type === 'PZP') return '🍌 INSIDER KNOWLEDGE DISCOVERED: Canteen cook has 3 extra bananas hidden under bench!';
      if (type === 'CHY') return '☕ MARKET MANIPULATION DETECTED: You drank 10 cups of tea and cornered the local caffeine market!';
      if (type === 'KSI') return '⚠️ System Alert: "Please stop touching the economy!"';
      return null;
    },

    endTradingDay: function () {
      state.marketStatus = 'CLOSED';
      const port = this.getPortfolioValue();
      const sorted = Object.values(state.assets).sort((a, b) => b.marketShare - a.marketShare);

      return {
        title: port.profitLossPct >= 20 ? '🍌 PAZHAM PORI TYCOON' : '☕ CHAYA CAPITALIST',
        finalKSI: state.ksi,
        ksiChangePct: (((state.ksi - state.ksiPrevClose) / state.ksiPrevClose) * 100).toFixed(2),
        portfolioValue: port.totalValue.toFixed(2),
        profitLoss: port.profitLoss.toFixed(2),
        profitLossPct: port.profitLossPct.toFixed(2),
        bestPerformer: `${sorted[0].emoji} ${sorted[0].shortName} (${sorted[0].marketShare}% share)`,
        worstPerformer: `${sorted[sorted.length - 1].emoji} ${sorted[sorted.length - 1].shortName} (${sorted[sorted.length - 1].marketShare}% share)`
      };
    }
  };
})();
