/**
 * 🏫 KERALA COLLEGE SIMULATOR™
 * "One day. Zero productivity. Somehow you survived."
 * Absurd interactive survival game engine.
 */

window.CollegeSimulator = (function () {
  // Game State
  const defaultStats = {
    attendance: 43,
    brainPower: 50,
    sleep: 35,
    money: 87,
    assignments: 7,
    energy: 60,
    happiness: 50,
    confidence: 65
  };

  let currentState = {
    playerType: null,
    playerName: 'Student',
    stats: { ...defaultStats },
    currentStepIndex: 0,
    log: []
  };

  // Player Archetypes
  const ARCHETYPES = [
    {
      id: 'coding',
      icon: '👨‍💻',
      name: 'Coding Student',
      tagline: 'Always fixing bugs that don\'t exist while failing core maths.',
      statModifiers: { brainPower: 15, sleep: -10, confidence: 10 }
    },
    {
      id: 'creative',
      icon: '🎨',
      name: 'Creative Student',
      tagline: 'Spends 6 hours designing class banner, 0 hours studying.',
      statModifiers: { happiness: 20, brainPower: -5, money: -20 }
    },
    {
      id: 'lastbench',
      icon: '📚',
      name: 'Last-Bench Legend',
      tagline: 'Master of invisible sleeping and back-door stealth escapes.',
      statModifiers: { attendance: -15, sleep: 25, happiness: 15 }
    },
    {
      id: 'overconfident',
      icon: '🧠',
      name: 'Overconfident Student',
      tagline: '"Enikku ellam ariyam da" — Fails exam first.',
      statModifiers: { confidence: 30, brainPower: -10, assignments: 2 }
    },
    {
      id: 'sleeper',
      icon: '😴',
      name: 'Professional Sleeper',
      tagline: 'Can sleep through fire alarms and viva calls.',
      statModifiers: { sleep: 40, attendance: -20, energy: -15 }
    }
  ];

  // Timeline Events & Choice Nodes
  const EVENTS = [
    {
      time: '🚨 08:30 AM',
      title: 'The Morning Alarm Dilemma',
      subtitle: 'First class is in 10 minutes. Sir is strictly taking attendance.',
      dialogue: '"Mone... innu attendance kittiyillel condonation fee kodukkandi varum!"',
      choices: [
        {
          text: '🏃 RUN TO CLASS (Sprint like PT Usha)',
          consequence: 'You reached class out of breath. Teacher called your roll number 2 seconds ago.',
          stats: { attendance: 5, energy: -20, sleep: -10, confidence: -5 }
        },
        {
          text: '☕ GO TO CANTEEN (Chaya + Pazham Pori first)',
          consequence: 'Pazham Pori was hot, tea was piping. Attendance lost, but soul satisfied.',
          stats: { money: -30, happiness: 25, energy: 15, attendance: -8 }
        },
        {
          text: '📱 ASK FRIEND: "Sir vannittundo?"',
          consequence: 'Friend replied: "Sir labilaa da, 9:30g vana mathi". Friend lied. You were marked absent.',
          stats: { attendance: -5, confidence: -10, happiness: -5 }
        },
        {
          text: '🛌 GO BACK TO SLEEP (Turn off phone)',
          consequence: 'Phenomenal sleep. Dreams were great. Mom called 14 times.',
          stats: { sleep: 40, attendance: -12, energy: 20, assignments: 1 }
        }
      ]
    },
    {
      time: '⚡ 10:15 AM',
      title: 'Surprise Viva Announcement',
      subtitle: 'Professor enters with a scary notebook and starts pointing at random seats.',
      dialogue: '"Roll No 42! Come to the front board and explain Fourier Transform!"',
      choices: [
        {
          text: '🛡️ HIDE BEHIND TALL CLASSMATE',
          consequence: 'Tall classmate shifted left. Sir spotted you immediately. "Roll No 42, yes you!"',
          stats: { confidence: -20, brainPower: -10, happiness: -15 }
        },
        {
          text: '🧠 CONFIDENTLY BLUFF WRONG ANSWER',
          consequence: 'You spoke fast in English with big words. Sir got confused and gave you 3/5 marks.',
          stats: { confidence: 25, brainPower: 10, happiness: 15 }
        },
        {
          text: '🚪 ESCAPE VIA BACK DOOR STEALTH',
          consequence: 'You crawled out smoothly. Classmates watched in awe. You are now a campus hero.',
          stats: { attendance: -5, happiness: 20, confidence: 15 }
        },
        {
          text: '📶 BLAME NETWORK / HEADACHE',
          consequence: 'Sir looked suspicious but said "Pooda avadunnu". You survived with 0 marks.',
          stats: { brainPower: -5, confidence: -5 }
        }
      ]
    },
    {
      time: '🍛 12:30 PM',
      title: 'Canteen Wars & Lunch Economics',
      subtitle: 'You have ₹87 left in your account. The canteen smell is magnetic.',
      dialogue: '"Bhai... 2 Porotta and 1 Beef fry undo? Ayyoo money illa, Parippu vada mathi."',
      choices: [
        {
          text: '🍘 BUY PARIPPU VADA + CHAYA (₹25)',
          consequence: 'Classic combo. Crunchy vada, warm tea. Maximum satisfaction on budget.',
          stats: { money: -25, happiness: 20, energy: 15, sleep: -10 }
        },
        {
          text: '🍱 BORROW FRIEND\'S TIFFIN ("Eda choodu choru!")',
          consequence: 'Friend\'s mom made Chicken Curry! You ate 80% of his tiffin. Friend is staring at you.',
          stats: { money: 0, energy: 30, happiness: 30, confidence: 5 }
        },
        {
          text: '🗣️ DEBATE POLITICS AT TEA SHED',
          consequence: 'Deep discussion about world economy and campus election. 2 hours passed instantly.',
          stats: { money: -15, brainPower: 15, attendance: -10, happiness: 15 }
        },
        {
          text: '😴 SLEEP ON BENCH UNDER BANYAN TREE',
          consequence: 'Wind was breezy. Best 45 minute nap of your life. Crows were watching.',
          stats: { sleep: 25, energy: 20, happiness: 10 }
        }
      ]
    },
    {
      time: '💻 02:00 PM',
      title: 'Computer Lab / Seminar Nightmare',
      subtitle: 'Code must run without errors or lab record won\'t be signed.',
      dialogue: '"Compilation Error line 1: SyntaxError at birth."',
      choices: [
        {
          text: '📋 COPY CODE FROM GITHUB / CLASS TOPPER',
          consequence: 'Copied line for line including topper\'s name "Anjali_Final_v2.cpp". Lab instructor noticed.',
          stats: { brainPower: -15, assignments: -1, confidence: -10 }
        },
        {
          text: '⌨️ PRESS RANDOM BUTTONS & LOOK BUSY',
          consequence: 'You typed aggressively on terminal. Lab assistant thought you were hacking. 10/10 internal marks!',
          stats: { confidence: 20, happiness: 15, brainPower: 5 }
        },
        {
          text: '🙋 ASK PROFESSOR: "Sir, error in line 42"',
          consequence: 'Sir clicked missing semicolon `;`. Looked at you with extreme disappointment.',
          stats: { brainPower: 5, confidence: -15 }
        },
        {
          text: '🍿 BUNK & WATCH MOVIE AT LOCAL THEATER',
          consequence: 'First day first show! Popcorn was great. Attendance crashed below 30%.',
          stats: { happiness: 35, attendance: -15, money: -50, sleep: 10 }
        }
      ]
    },
    {
      time: '🌇 04:30 PM',
      title: 'The Final Settlement & Evening Shed',
      subtitle: 'The sun is setting over campus. Assignment deadline is 5:00 PM.',
      dialogue: '"Nale mathi da assignment... sir-ne paranju samaadhaanippikkaam."',
      choices: [
        {
          text: '📝 SUBMIT ASSIGNMENT WRITTEN ON RIPPED PAPER',
          consequence: 'Handwriting was unreadable. Professor took it without opening. Passed!',
          stats: { assignments: -3, brainPower: 10, confidence: 15 }
        },
        {
          text: '☕ EVENING CHAYA AT CAMPUS SHED',
          consequence: 'Plotted big plans for startup companies with friends. Zero progress made.',
          stats: { happiness: 25, energy: 10, money: -20 }
        },
        {
          text: '📊 CALCULATE MINIMUM ATTENDANCE NEEDED',
          consequence: 'Spent 1 hour calculating how many classes you can bunk next week. Math was flawess.',
          stats: { brainPower: 20, confidence: 10 }
        },
        {
          text: '🚌 PACK BAG & SPRINT FOR BUS',
          consequence: 'Caught the last window seat in private bus. Headphones on, breeze hitting face.',
          stats: { energy: 15, happiness: 20 }
        }
      ]
    }
  ];

  function clamp(val, min = 0, max = 100) {
    return Math.min(Math.max(val, min), max);
  }

  return {
    getArchetypes: () => ARCHETYPES,
    getEvents: () => EVENTS,
    getCurrentState: () => currentState,

    initGame: function (archetypeId) {
      const selected = ARCHETYPES.find(a => a.id === archetypeId) || ARCHETYPES[0];
      currentState = {
        playerType: selected,
        playerName: selected.name,
        stats: { ...defaultStats },
        currentStepIndex: 0,
        log: []
      };

      for (const [key, val] of Object.entries(selected.statModifiers)) {
        if (currentState.stats[key] !== undefined) {
          currentState.stats[key] = clamp(currentState.stats[key] + val, 0, 100);
        }
      }

      return currentState;
    },

    makeChoice: function (choiceIndex) {
      const currentEvent = EVENTS[currentState.currentStepIndex];
      if (!currentEvent) return null;

      const choice = currentEvent.choices[choiceIndex];
      if (!choice) return null;

      if (choice.stats) {
        for (const [statKey, statDelta] of Object.entries(choice.stats)) {
          if (currentState.stats[statKey] !== undefined) {
            if (statKey === 'money') {
              currentState.stats.money = Math.max(0, currentState.stats.money + statDelta);
            } else {
              currentState.stats[statKey] = clamp(currentState.stats[statKey] + statDelta, 0, 100);
            }
          }
        }
      }

      currentState.log.push({
        time: currentEvent.time,
        title: currentEvent.title,
        choiceText: choice.text,
        consequence: choice.consequence,
        statsShift: choice.stats
      });

      currentState.currentStepIndex += 1;
      const isFinished = currentState.currentStepIndex >= EVENTS.length;
      return {
        nextEvent: isFinished ? null : EVENTS[currentState.currentStepIndex],
        consequence: choice.consequence,
        isFinished: isFinished,
        updatedStats: currentState.stats
      };
    },

    generateSurvivalReport: function () {
      const { stats, playerType, log } = currentState;

      let title = 'Average Kerala Student';
      let grade = 'B+ (Passed by Grace)';
      let badge = '🏆 Campus Resident';
      let remark = 'Nattukarkku valare nalla abhipraayam aanu.';

      if (stats.attendance < 35) {
        title = 'Phantom Student / Attendance Defaulter';
        grade = 'F (Condonation Fee Pending)';
        badge = '💀 HOD\'s Wanted List';
        remark = 'Principal room-il 3 mani samayam aajaaraakanam.';
      } else if (stats.happiness > 75 && stats.money < 30) {
        title = 'Canteen Legend & Parippu Vada King';
        grade = 'S+ (Happiness Master)';
        badge = '🍘 Canteen Shed Trustee';
        remark = 'Paditham illengilum life full enjoyment aanu mone!';
      } else if (stats.brainPower > 70) {
        title = 'Accidental Topper';
        grade = 'A+ (University Ranker)';
        badge = '🧠 Overconfident Genius';
        remark = 'Bro... pass aayathu enganeyaannu bro-kkum ariyilla!';
      } else if (stats.sleep > 70) {
        title = 'Professional Kumbhakarnan';
        grade = 'Z (Sleeping Excellence)';
        badge = '😴 Bench Sleeping Champion';
        remark = 'College class room traditional bedroom aakkya mahaan.';
      }

      return {
        playerName: playerType ? playerType.name : 'Kerala Student',
        playerIcon: playerType ? playerType.icon : '🏫',
        title: title,
        grade: grade,
        badge: badge,
        remark: remark,
        finalStats: { ...stats },
        actionsCount: log.length
      };
    }
  };
})();
