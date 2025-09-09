// ====== CONFIG ======
const TARGET = new Date('Oct 11, 2025 14:00:00').getTime(); // <-- fecha objetivo
// ====================

// Carrusel automático
const slides = document.querySelectorAll('.carousel-slide');
let currentIndex = 0;

function changeSlide() {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
}

setInterval(changeSlide, 5000); // cambia cada 5s

document.addEventListener("DOMContentLoaded", () => {
    AOS.init({
        once: true,
        duration: 1000
    });
});

/* Countdown */
const $d = document.getElementById('days');
const $h = document.getElementById('hours');
const $m = document.getElementById('minutes');
const $s = document.getElementById('seconds');

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
    const now = Date.now();
    const diff = TARGET - now;

    if (diff <= 0) {
        $d.textContent = '00';
        $h.textContent = '00';
        $m.textContent = '00';
        $s.textContent = '00';
        clearInterval(interval);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Actualiza y añade pequeña animación si cambia
    setWithAnim($d, days);
    setWithAnim($h, hours);
    setWithAnim($m, minutes);
    setWithAnim($s, seconds);
}

function setWithAnim(el, value) {
    const newText = pad(value);
    if (el.textContent !== newText) {
        el.textContent = newText;
        el.classList.remove('pop');
        // reflow para reiniciar la anim
        void el.offsetWidth;
        el.classList.add('pop');
        // quita la clase luego para permitir repetir anim
        setTimeout(() => el.classList.remove('pop'), 600);
    }
}

// clase pop (agregar dinámicamente)
const style = document.createElement('style');
style.textContent = `.pop{ transform: translateY(-6px) scale(1.02); transition: transform .48s cubic-bezier(.2,.9,.3,1); }`;
document.head.appendChild(style);

updateCountdown();
const interval = setInterval(updateCountdown, 1000);

/* Música: toggle play/pause */
const audio = document.getElementById('bg-audio');
const btn = document.getElementById('music-toggle');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');

btn.addEventListener('click', async () => {
    // try to play (some browsers require user interaction)
    if (audio.paused) {
        try {
            await audio.play();
            btn.setAttribute('aria-pressed', 'true');
            // swap svg paths
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'block';
        } catch (e) {
            // fallback: visually toggle
            btn.setAttribute('aria-pressed', 'true');
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'block';
        }
    } else {
        audio.pause();
        btn.setAttribute('aria-pressed', 'false');
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
    }
});

window.addEventListener('DOMContentLoaded', function () {
    var audio = document.getElementById('bg-audio');
    audio.play().catch(function () { });
});
// accesibilidad: tecla espacio/enter cuando el botón tiene focus
btn.addEventListener('keydown', (ev) => {
    if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); btn.click(); }
});

// Inicializa la librería de animaciones AOS
document.addEventListener("DOMContentLoaded", () => {
    AOS.init({
        once: true,       // la animación solo ocurre una vez
        offset: 100,      // distancia antes de que se active
        easing: "ease-in-out"
    });
});


document.addEventListener("DOMContentLoaded", () => {
  const line = document.querySelector(".timeline-line");
  const items = document.querySelectorAll(".timeline-item");
  const lineFill = line.querySelector("::after"); // no funciona directo

  // Creamos CSS dinámico para la altura de la línea
  let style = document.createElement("style");
  document.head.appendChild(style);

  const updateTimeline = () => {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    const timelineRect = line.getBoundingClientRect();
    const timelineTop = timelineRect.top + scrollY;
    const maxHeight = line.offsetHeight;

    // Calculamos cuánto llenar
    let fillHeight = Math.min(maxHeight, Math.max(0, scrollY + windowH / 2 - timelineTop));

    style.innerHTML = `
      .timeline-line::after {
        height: ${fillHeight}px;
      }
    `;

    // Mostrar items
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top < windowH - 100) {
        item.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", updateTimeline);
  updateTimeline();
});
