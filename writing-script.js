// writing-script.js
document.addEventListener('DOMContentLoaded', () => {
  const textArea       = document.getElementById('writing');
  const wordCountDisp  = document.getElementById('wordCount');
  const timeDisp       = document.getElementById('timeRemaining');
  const warningDisp    = document.getElementById('warning');
  const startBtn       = document.getElementById('startBtn');
  const resetBtn       = document.getElementById('resetBtn');
  const timeSelect     = document.getElementById('timeSelect');
  const disableWarning = document.getElementById('disableWarning');
  const summary        = document.getElementById('summary');

  let timer, remaining, startTime, running = false;

  function countWords(text) {
    return (text.trim().match(/\b\w+\b/g) || []).length;
  }

  function updateStatus() {
    wordCountDisp.textContent = countWords(textArea.value);
  }

  function updateTime() {
    remaining--;
    const m = Math.floor(remaining/60);
    const s = remaining % 60;
    timeDisp.textContent = `${m}:${s.toString().padStart(2,'0')}`;
    
    if (remaining <= 0) {
      clearInterval(timer);
      textArea.disabled = true;
      running = false;
      resetBtn.style.display = 'inline';
      const duration = (Date.now() - startTime) / 60000;
      const words = countWords(textArea.value);
      summary.textContent = 
        `⏱ You wrote ${words} words in ${duration.toFixed(1)} minutes ` +
        `(${(words/duration).toFixed(1)} wpm).`;
    }
    else if (!disableWarning.checked && remaining <= 30) {
      warningDisp.textContent = '⏳ Almost out of time!';
    }
    else {
      warningDisp.textContent = '';
    }
  }

  startBtn.addEventListener('click', () => {
    if (running) return;
    remaining = parseInt(timeSelect.value,10);
    startTime = Date.now();
    textArea.value = '';
    textArea.disabled = false;
    textArea.focus();
    summary.textContent = '';
    resetBtn.style.display = 'none';

    updateStatus();
    updateTime();
    timer = setInterval(() => {
      updateStatus();
      updateTime();
    }, 1000);

    running = true;
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    textArea.value = '';
    textArea.disabled = false;
    wordCountDisp.textContent = '0';
    timeDisp.textContent = '–';
    warningDisp.textContent = '';
    summary.textContent = '';
    running = false;
  });

  textArea.addEventListener('input', updateStatus);
});
