const progressBar = document.getElementById('progressBar');
const startLessonButton = document.getElementById('startLesson');
const backToTopButton = document.getElementById('backToTop');
let audioContext;

function getAudioContext() {
  if (!audioContext) {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (AudioClass) {
      audioContext = new AudioClass();
    }
  }
  return audioContext;
}

function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(660, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.12);

  gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.13);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.14);
}

function playCelebrationSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99];
  notes.forEach((note, index) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(note, ctx.currentTime + index * 0.08);

    gainNode.gain.setValueAtTime(0.0001, ctx.currentTime + index * 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + index * 0.08 + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.08 + 0.18);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(ctx.currentTime + index * 0.08);
    oscillator.stop(ctx.currentTime + index * 0.08 + 0.2);
  });

  for (let i = 0; i < 7; i += 1) {
    const burstDuration = 0.06;
    const bufferSize = Math.floor(ctx.sampleRate * burstDuration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let j = 0; j < bufferSize; j += 1) {
      data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize / 7));
    }

    const noise = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();
    const startTime = ctx.currentTime + i * 0.045;

    noise.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.value = 1200;

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(0.14, startTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + burstDuration);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start(startTime);
    noise.stop(startTime + burstDuration);
  }
}

function launchConfetti(totalPieces = 34) {
  const colors = ['#ff9f1c', '#ffd166', '#3d7bfd', '#ff6f91', '#3ecf8e'];

  for (let i = 0; i < totalPieces; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2.1 + Math.random() * 1.7}s`;
    piece.style.setProperty('--x-shift', `${-120 + Math.random() * 240}px`);
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 4200);
  }
}

function updateProgressBar() {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;

  if (window.scrollY > 360) {
    backToTopButton.classList.add('show');
  } else {
    backToTopButton.classList.remove('show');
  }
}

window.addEventListener('scroll', updateProgressBar);
window.addEventListener('load', updateProgressBar);

if (startLessonButton) {
  startLessonButton.addEventListener('click', () => {
    playClickSound();
    document.getElementById('carthage')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    playClickSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.lesson-section').forEach((section) => {
  sectionObserver.observe(section);
});

function toggleReveal(buttonSelector) {
  document.querySelectorAll(buttonSelector).forEach((button) => {
    button.addEventListener('click', () => {
      playClickSound();
      const targetId = button.dataset.target;
      const target = document.getElementById(targetId);
      if (!target) return;

      const isOpen = target.classList.contains('open');
      target.classList.toggle('open', !isOpen);
      button.textContent = isOpen ? button.textContent.replace('إخفاء', 'أظهر').replace('أغلق', 'افتح') : button.textContent.replace('أظهر', 'إخفاء').replace('افتح', 'أغلق');
    });
  });
}

toggleReveal('.fact-toggle');
toggleReveal('.summary-toggle');

document.querySelectorAll('.profile-button').forEach((button) => {
  button.addEventListener('click', () => {
    playClickSound();
    const target = document.getElementById(button.dataset.target);
    if (!target) return;

    document.querySelectorAll('.profile-button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    target.innerHTML = `<strong>${button.dataset.title}</strong><p>${button.dataset.message}</p>`;
    target.classList.add('open');
  });
});

document.querySelectorAll('.trait-card').forEach((button) => {
  button.addEventListener('click', () => {
    playClickSound();
    const target = document.getElementById(button.dataset.target);
    if (!target) return;

    document.querySelectorAll('.trait-card').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    target.innerHTML = `<p>${button.dataset.message}</p>`;
    target.classList.add('open');
  });
});

document.querySelectorAll('.choice-buttons').forEach((group) => {
  const feedback = document.querySelector(group.dataset.feedback);
  const buttons = Array.from(group.querySelectorAll('button'));

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      playClickSound();
      const isCorrect = button.dataset.correct === 'true';

      buttons.forEach((item) => item.classList.remove('correct', 'wrong'));

      if (isCorrect) {
        button.classList.add('correct');
        if (feedback) {
          feedback.textContent = '🎉 رائع! الحروب البونية كانت بين قرطاج وروما.';
          feedback.className = 'inline-feedback success';
        }
        launchConfetti(24);
        playCelebrationSound();
      } else {
        button.classList.add('wrong');
        if (feedback) {
          feedback.textContent = '🙂 إجابة قريبة، حاول مرة أخرى.';
          feedback.className = 'inline-feedback error';
        }
      }
    });
  });
});

document.querySelectorAll('.media-box').forEach((box) => {
  const videoButton = box.querySelector('.show-video');
  const modelButton = box.querySelector('.show-3d');
  const videoContainer = box.querySelector('.youtube-container');
  const modelContainer = box.querySelector('.sketchfab-container');

  const switchMedia = (mode) => {
    const showVideo = mode === 'video';
    videoContainer?.classList.toggle('active', showVideo);
    modelContainer?.classList.toggle('active', !showVideo);
    videoButton?.classList.toggle('active', showVideo);
    modelButton?.classList.toggle('active', !showVideo);
    videoButton?.setAttribute('aria-pressed', String(showVideo));
    modelButton?.setAttribute('aria-pressed', String(!showVideo));
  };

  videoButton?.addEventListener('click', () => {
    playClickSound();
    switchMedia('video');
  });

  modelButton?.addEventListener('click', () => {
    playClickSound();
    switchMedia('3d');
  });

  switchMedia('video');
});

let draggedChip = null;

document.querySelectorAll('.route-game').forEach((game) => {
  const chips = Array.from(game.querySelectorAll('.route-chip'));
  const pool = game.querySelector('.draggable-pool');
  const slots = Array.from(game.querySelectorAll('.drop-slot'));
  const feedback = game.querySelector('.route-feedback');
  const resetButton = game.querySelector('.reset-route');
  let selectedChip = null;

  function clearSelection() {
    chips.forEach((chip) => chip.classList.remove('selected'));
    selectedChip = null;
  }

  function shuffleChips() {
    const shuffled = [...chips].sort(() => Math.random() - 0.5);
    shuffled.forEach((chip) => pool?.appendChild(chip));
  }

  function checkRouteResult() {
    const allFilled = slots.every((slot) => slot.dataset.value);
    if (!allFilled) return;

    const correct = slots.every((slot) => slot.dataset.value === slot.dataset.accept);
    slots.forEach((slot) => {
      slot.classList.add(correct ? 'correct' : 'wrong');
    });

    if (correct) {
      feedback.textContent = '🎉 ممتاز! رتبت رحلة حنبعل بشكل صحيح.';
      feedback.className = 'route-feedback inline-feedback success';
      launchConfetti(28);
      playCelebrationSound();
    } else {
      feedback.textContent = '🙂 الترتيب ليس صحيحًا بالكامل. اضغط على إعادة اللعبة وحاول مرة أخرى.';
      feedback.className = 'route-feedback inline-feedback error';
    }
  }

  function placeChip(slot, chip) {
    if (!slot || !chip || slot.dataset.value || chip.classList.contains('used')) return;

    slot.dataset.value = chip.dataset.step;
    slot.textContent = chip.textContent;
    slot.classList.add('filled');

    chip.classList.add('used');
    chip.disabled = true;
    clearSelection();
    checkRouteResult();
  }

  function resetRouteGame() {
    chips.forEach((chip) => {
      chip.disabled = false;
      chip.classList.remove('used', 'selected', 'dragging');
    });

    slots.forEach((slot) => {
      slot.dataset.value = '';
      slot.textContent = slot.dataset.placeholder;
      slot.classList.remove('filled', 'correct', 'wrong', 'hover');
    });

    if (feedback) {
      feedback.textContent = '';
      feedback.className = 'route-feedback inline-feedback';
    }

    clearSelection();
    shuffleChips();
  }

  chips.forEach((chip) => {
    chip.addEventListener('dragstart', (event) => {
      if (chip.classList.contains('used')) {
        event.preventDefault();
        return;
      }
      draggedChip = chip;
      chip.classList.add('dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', chip.dataset.step || '');
    });

    chip.addEventListener('dragend', () => {
      chip.classList.remove('dragging');
      draggedChip = null;
    });

    chip.addEventListener('click', () => {
      if (chip.classList.contains('used')) return;
      playClickSound();
      if (selectedChip === chip) {
        clearSelection();
        return;
      }
      clearSelection();
      selectedChip = chip;
      chip.classList.add('selected');
    });
  });

  slots.forEach((slot) => {
    slot.addEventListener('dragover', (event) => {
      event.preventDefault();
      slot.classList.add('hover');
    });

    slot.addEventListener('dragleave', () => {
      slot.classList.remove('hover');
    });

    slot.addEventListener('drop', (event) => {
      event.preventDefault();
      slot.classList.remove('hover');
      if (draggedChip) {
        placeChip(slot, draggedChip);
      }
    });

    slot.addEventListener('click', () => {
      if (!selectedChip) return;
      placeChip(slot, selectedChip);
    });
  });

  resetButton?.addEventListener('click', () => {
    playClickSound();
    resetRouteGame();
  });

  resetRouteGame();
});

const quizData = [
  {
    question: 'أين كانت مدينة قرطاج؟',
    answers: ['في تونس الحالية', 'في الصين', 'في البرازيل'],
    correctIndex: 0,
    explanation: '✅ صحيح! كانت قرطاج في تونس الحالية.'
  },
  {
    question: 'بماذا اشتهر حنبعل كثيرًا؟',
    answers: ['بالأفيال والخطط الذكية', 'ببناء الأهرامات', 'بالطيران'],
    correctIndex: 0,
    explanation: '✅ رائع! اشتهر بالأفيال وبالتخطيط الذكي.'
  },
  {
    question: 'من هم طرفا الحروب البونية؟',
    answers: ['قرطاج وروما', 'روما واليونان', 'قرطاج ومصر'],
    correctIndex: 0,
    explanation: '✅ ممتاز! الحروب البونية كانت بين قرطاج وروما.'
  },
  {
    question: 'ما الجبال التي عبرها حنبعل؟',
    answers: ['جبال الألب', 'جبال الهيمالايا', 'جبال الأطلس'],
    correctIndex: 0,
    explanation: '✅ أحسنت! عبر جبال الألب في رحلة صعبة جدًا.'
  }
];

const quizQuestion = document.getElementById('quizQuestion');
const quizAnswers = document.getElementById('quizAnswers');
const quizFeedback = document.getElementById('quizFeedback');
const quizCounter = document.getElementById('quizCounter');
const quizScore = document.getElementById('quizScore');
const nextQuestionButton = document.getElementById('nextQuestion');
const restartQuizButton = document.getElementById('restartQuiz');
const quizResult = document.getElementById('quizResult');

let currentQuestionIndex = 0;
let currentScore = 0;
let answeredCurrentQuestion = false;

function updateQuizHead() {
  if (quizCounter) {
    quizCounter.textContent = `السؤال ${currentQuestionIndex + 1} من ${quizData.length}`;
  }
  if (quizScore) {
    quizScore.textContent = `النقاط: ${currentScore}`;
  }
}

function renderQuestion() {
  if (!quizQuestion || !quizAnswers || !quizFeedback) return;

  const currentQuestion = quizData[currentQuestionIndex];
  answeredCurrentQuestion = false;
  updateQuizHead();
  quizQuestion.textContent = currentQuestion.question;
  quizAnswers.innerHTML = '';
  quizFeedback.textContent = '';
  quizFeedback.className = 'inline-feedback quiz-feedback';
  nextQuestionButton?.classList.remove('show');

  currentQuestion.answers.forEach((answer, index) => {
    const answerButton = document.createElement('button');
    answerButton.type = 'button';
    answerButton.textContent = answer;

    answerButton.addEventListener('click', () => {
      if (answeredCurrentQuestion) return;
      answeredCurrentQuestion = true;
      playClickSound();

      const isCorrect = index === currentQuestion.correctIndex;
      const allButtons = Array.from(quizAnswers.querySelectorAll('button'));

      allButtons.forEach((button, buttonIndex) => {
        button.disabled = true;
        if (buttonIndex === currentQuestion.correctIndex) {
          button.classList.add('correct');
        }
      });

      if (isCorrect) {
        currentScore += 1;
        answerButton.classList.add('correct');
        quizFeedback.textContent = `${currentQuestion.explanation} 🎉`;
        quizFeedback.classList.add('success');
        launchConfetti(22);
        playCelebrationSound();
      } else {
        answerButton.classList.add('wrong');
        quizFeedback.textContent = `❌ ليست هذه الإجابة. ${currentQuestion.explanation}`;
        quizFeedback.classList.add('error');
      }

      updateQuizHead();

      if (currentQuestionIndex < quizData.length - 1) {
        nextQuestionButton?.classList.add('show');
      } else {
        showQuizResult();
      }
    });

    quizAnswers.appendChild(answerButton);
  });
}

function showQuizResult() {
  if (!quizResult || !restartQuizButton || !nextQuestionButton) return;

  let message = '';
  if (currentScore === quizData.length) {
    message = '🏆 رائع جدًا! لقد أجبت عن كل الأسئلة بشكل صحيح.';
  } else if (currentScore >= Math.ceil(quizData.length * 0.75)) {
    message = '🌟 ممتاز! لديك معرفة جميلة جدًا بالدرس.';
  } else if (currentScore >= 2) {
    message = '🙂 أحسنت! أنت تتقدم جيدًا، أعد اللعب لرفع النتيجة.';
  } else {
    message = '💪 بداية جيدة! أعد قراءة الدرس ثم جرّب مرة أخرى.';
  }

  quizResult.innerHTML = `<strong>النتيجة النهائية: ${currentScore} / ${quizData.length}</strong><p>${message}</p>`;
  quizResult.classList.add('open');
  restartQuizButton.classList.add('show');
  nextQuestionButton.classList.remove('show');

  if (currentScore >= Math.ceil(quizData.length * 0.75)) {
    launchConfetti(34);
    playCelebrationSound();
  }
}

nextQuestionButton?.addEventListener('click', () => {
  playClickSound();
  if (currentQuestionIndex < quizData.length - 1) {
    currentQuestionIndex += 1;
    renderQuestion();
  }
});

restartQuizButton?.addEventListener('click', () => {
  playClickSound();
  currentQuestionIndex = 0;
  currentScore = 0;
  quizResult.classList.remove('open');
  quizResult.innerHTML = '';
  restartQuizButton.classList.remove('show');
  renderQuestion();
});

renderQuestion();
