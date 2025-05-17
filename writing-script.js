// script.js

document.addEventListener('DOMContentLoaded', () => {
  const textArea = document.getElementById('writing');
  const wordCountDisplay = document.getElementById('wordCount');
  const timeDisplay = document.getElementById('timeRemaining');
  const warningDisplay = document.getElementById('warning');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const timeSelect = document.getElementById('timeSelect');
  const disableWarning = document.getElementById('disableWarning');
  const summary = document.getElementById('summary');

  let timer, remaining, startTime;
  let running = false;

  function countWords(text) {
    return (text.trim().match(/\b\w+\b/g) || []).length;
  }

  function updateStatus() {
    const words = countWords(textArea.value);
    wordCountDisplay.textContent = words;
  }

  function updateTime() {
    remaining--;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    if (remaining <= 0) {
      clearInterval(timer);
      textArea.disabled = true;
      running = false;
      resetBtn.style.display = 'inline';
      const totalTime = (Date.now() - startTime) / 60000;
      const words = countWords(textArea.value);
      summary.textContent = `⏱ You wrote ${words} words in ${totalTime.toFixed(1)} minutes (${(words / totalTime).toFixed(1)} wpm).`;
    } else if (!disableWarning.checked && remaining <= 30) {
      warningDisplay.textContent = '⏳ Almost out of time!';
    } else {
      warningDisplay.textContent = '';
    }
  }

  startBtn.addEventListener('click', () => {
    if (running) return;
    remaining = parseInt(timeSelect.value, 10);
    startTime = Date.now();
    textArea.value = '';
    textArea.disabled = false;
    textArea.focus();
    timer = setInterval(() => {
      updateStatus();
      updateTime();
    }, 1000);
    running = true;
    summary.textContent = '';
    resetBtn.style.display = 'none';
    updateStatus();
    updateTime();
  });

  resetBtn.addEventListener('click', () => {
    textArea.value = '';
    wordCountDisplay.textContent = '0';
    timeDisplay.textContent = '';
    warningDisplay.textContent = '';
    summary.textContent = '';
    textArea.disabled = false;
    running = false;
  });

  textArea.addEventListener('input', updateStatus);
});
