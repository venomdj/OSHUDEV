let timer;
let seconds = 0;
let running = false;

function updateDisplay() {
  let hrs = Math.floor(seconds / 3600);
  let mins = Math.floor((seconds % 3600) / 60);
  let secs = seconds % 60;

  document.getElementById("timer").innerText =
    String(hrs).padStart(2, '0') + ":" +
    String(mins).padStart(2, '0') + ":" +
    String(secs).padStart(2, '0');
}

function startTimer() {
  if (!running) {
    running = true;
    timer = setInterval(() => {
      seconds++;
      updateDisplay();
    }, 1000);
  }
}

function pauseTimer() {
  running = false;
  clearInterval(timer);
}

function stopTimer() {
  running = false;
  clearInterval(timer);

  let hoursStudied = (seconds / 3600).toFixed(2);

  let previous = localStorage.getItem("myHours") || 0;
  let total = parseFloat(previous) + parseFloat(hoursStudied);

  localStorage.setItem("myHours", total);
  document.getElementById("todayTotal").innerText = total.toFixed(2) + " hrs";
  document.getElementById("youHours").innerText = total.toFixed(2);

  seconds = 0;
  updateDisplay();
}

window.onload = function() {
  let stored = localStorage.getItem("myHours") || 0;
  document.getElementById("todayTotal").innerText = parseFloat(stored).toFixed(2) + " hrs";
  document.getElementById("youHours").innerText = parseFloat(stored).toFixed(2);
};
