/* ==========================================================================
   Classic Elegant Wedding Invitation — Behavior
   ========================================================================== */

// Envelope opener — reveals the invitation and unlocks scrolling on click
(function initEnvelope() {
  var envelope = document.getElementById('envelope');
  var openButton = document.getElementById('envelope-open');
  var flap = envelope ? envelope.querySelector('.envelope__flap') : null;
  var invitation = document.getElementById('invitation');

  if (!envelope || !openButton || !flap || !invitation) {
    return;
  }

  openButton.addEventListener('click', function () {
    flap.classList.add('is-open');
    document.body.classList.remove('no-scroll');
    invitation.classList.add('is-visible');

    setTimeout(function () {
      envelope.classList.add('is-open');
    }, 350);
  });
})();

// Wedding sumuhurtham (auspicious time): October 14, 2026, 11:24 PM IST
// (explicit +05:30 offset so the countdown is correct for viewers in any timezone)
var WEDDING_DATE = new Date('2026-10-14T23:24:00+05:30');

(function initCountdown() {
  var elDays = document.getElementById('cd-days');
  var elHours = document.getElementById('cd-hours');
  var elMinutes = document.getElementById('cd-minutes');
  var elSeconds = document.getElementById('cd-seconds');
  var elNote = document.getElementById('cd-note');
  var elGrid = document.querySelector('.countdown__grid');

  if (!elDays || !elHours || !elMinutes || !elSeconds) {
    return;
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function tick() {
    var diff = WEDDING_DATE.getTime() - Date.now();

    if (diff <= 0) {
      elGrid.hidden = true;
      elNote.hidden = false;
      clearInterval(timerId);
      return;
    }

    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }

  tick();
  var timerId = setInterval(tick, 1000);
})();

// Fade-and-rise reveal animation as sections enter the viewport
(function initScrollReveal() {
  var revealEls = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || revealEls.length === 0) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach(function (el) { observer.observe(el); });
})();

// Gentle falling petals — decorative substitute for a photo gallery
(function initPetals() {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var container = document.querySelector('.petals');

  if (reduceMotion || !container) {
    return;
  }

  var PETAL_COUNT = 16;

  for (var i = 0; i < PETAL_COUNT; i++) {
    var petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.animationDuration = 10 + Math.random() * 10 + 's';
    petal.style.animationDelay = Math.random() * 15 + 's';
    petal.style.opacity = String(0.35 + Math.random() * 0.35);
    petal.style.transform = 'scale(' + (0.6 + Math.random() * 0.8) + ')';
    container.appendChild(petal);
  }
})();

// Background music: try to autoplay on load; browsers that block unmuted
// autoplay will get it started on the first user interaction instead.
(function initMusicToggle() {
  var audio = document.getElementById('bg-music');
  var toggle = document.getElementById('music-toggle');

  if (!audio || !toggle) {
    return;
  }

  var iconPlay = toggle.querySelector('.music-toggle__icon--play');
  var iconPause = toggle.querySelector('.music-toggle__icon--pause');

  function setPlayingState(isPlaying) {
    toggle.setAttribute('aria-pressed', String(isPlaying));
    toggle.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
    iconPlay.hidden = isPlaying;
    iconPause.hidden = !isPlaying;
  }

  audio.addEventListener('play', function () { setPlayingState(true); });
  audio.addEventListener('pause', function () { setPlayingState(false); });
  audio.addEventListener('ended', function () { setPlayingState(false); });

  function tryAutoplay() {
    var playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        // Autoplay was blocked — start on the next user interaction instead.
        var startOnInteraction = function () {
          audio.play().catch(function () {});
          document.removeEventListener('click', startOnInteraction);
          document.removeEventListener('touchstart', startOnInteraction);
          document.removeEventListener('keydown', startOnInteraction);
        };
        document.addEventListener('click', startOnInteraction, { once: true });
        document.addEventListener('touchstart', startOnInteraction, { once: true });
        document.addEventListener('keydown', startOnInteraction, { once: true });
      });
    }
  }

  tryAutoplay();

  toggle.addEventListener('click', function () {
    if (audio.paused) {
      audio.play().catch(function () { setPlayingState(false); });
    } else {
      audio.pause();
    }
  });

  // Pause music when the tab is hidden/backgrounded; resume only if it was
  // actually playing (not if the visitor had paused it themselves) when
  // the tab becomes visible again.
  var wasPlayingBeforeHide = false;
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      wasPlayingBeforeHide = !audio.paused;
      if (wasPlayingBeforeHide) {
        audio.pause();
      }
    } else if (wasPlayingBeforeHide) {
      audio.play().catch(function () {});
    }
  });
})();
