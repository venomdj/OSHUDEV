// ===== STATE =====
let timers = {
  you: { seconds: 0, total: 0, interval: null, running: false },
  her: { seconds: 0, total: 0, interval: null, running: false }
};

// ===== FORMAT TIME =====
function formatTime(sec) {
  let h = String(Math.floor(sec / 3600)).padStart(2, '0');
  let m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  let s = String(sec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// ===== START TIMER =====
function startTimer(person) {
  if (timers[person].running) return;

  timers[person].running = true;

  timers[person].interval = setInterval(() => {
    timers[person].seconds++;
    document.getElementById(person + "Timer").innerText =
      formatTime(timers[person].seconds);
  }, 1000);
}

// ===== PAUSE TIMER =====
function pauseTimer(person) {
  timers[person].running = false;
  clearInterval(timers[person].interval);
}

// ===== STOP TIMER =====
function stopTimer(person) {
  clearInterval(timers[person].interval);
  timers[person].running = false;

  timers[person].total += timers[person].seconds;
  timers[person].seconds = 0;

  document.getElementById(person + "Timer").innerText = "00:00:00";

  // Save to Firestore
  db.collection("study").doc(person).set({
    total: timers[person].total
  });

  updateLeader();
}

// ===== REALTIME LISTENER =====
db.collection("study").onSnapshot(snapshot => {
  snapshot.forEach(doc => {
    let person = doc.id;
    timers[person].total = doc.data().total || 0;

    document.getElementById(person + "Total").innerText =
      formatTime(timers[person].total);
  });

  updateLeader();
});

// ===== LEADER LOGIC =====
function updateLeader() {
  let banner = document.getElementById("leaderBanner");
  let you = timers.you.total;
  let her = timers.her.total;

  document.getElementById("youCard").classList.remove("leading");
  document.getElementById("herCard").classList.remove("leading");

  if (you > her) {
    banner.innerText = "Dev is leading 😏";
    document.getElementById("youCard").classList.add("leading");
  } else if (her > you) {
    banner.innerText = "Oshu is leading 😾";
    document.getElementById("herCard").classList.add("leading");
  } else {
    banner.innerText = "It's a tie 🤝";
  }
}
