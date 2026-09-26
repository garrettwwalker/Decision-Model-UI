// Daybreak — shared interactions (design-preview only, no backend)

document.addEventListener("DOMContentLoaded", () => {
  markActiveNav();
  initMobileNav();
  initNavScrollState();
  initMapReveal();
  initWorkbenchSliders();
  initChatDemo();
  initYear();
});

function markActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach((el) => {
    if (el.getAttribute("data-nav") === path) el.classList.add("active");
  });
}

// Nav stays transparent over the hero glow at the top of the page;
// the translucent/blurred banner only kicks in once the user scrolls.
function initNavScrollState() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;
  const THRESHOLD = 8;
  const update = () => nav.classList.toggle("scrolled", window.scrollY > THRESHOLD);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

// Homepage hero: the beam sweeps on a fixed CSS loop, but which chokepoint
// blips actually light up — and that they only appear once the beam has
// already passed — is decided here each cycle, so it isn't the same every time.
function initMapReveal() {
  const blips = document.querySelectorAll(".map-blip");
  if (!blips.length) return;

  const SWEEP_MS = 11000; // must match the .map-sweep CSS animation duration
  const REVEAL_LAG_MS = 30; // blip appears just after the beam's edge clears it
  const APPEAR_CHANCE = 0.55; // not every blip shows on every pass

  const reveal = (blip) => {
    blip.classList.remove("is-revealed");
    void blip.offsetWidth; // force reflow so the animation can replay
    blip.classList.add("is-revealed");
  };

  const runCycle = () => {
    blips.forEach((blip) => {
      if (Math.random() > APPEAR_CHANCE) return;
      const t = parseFloat(blip.style.getPropertyValue("--t")) || 0;
      setTimeout(() => reveal(blip), t * SWEEP_MS + REVEAL_LAG_MS);
    });
  };

  runCycle();
  setInterval(runCycle, SWEEP_MS);
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => links.classList.toggle("open"));
}

// ---- Quant Workbench: live coefficient sliders -> composite score ----
function initWorkbenchSliders() {
  const sliders = document.querySelectorAll("[data-coeff]");
  const scoreEl = document.querySelector("[data-composite-score]");
  if (!sliders.length) return;

  const update = () => {
    let weightedTotal = 0;
    let weightSum = 0;
    sliders.forEach((slider) => {
      const val = Number(slider.value);
      const weight = Number(slider.dataset.weight || 1);
      const out = slider.parentElement.querySelector(".coeff-val");
      if (out) out.textContent = slider.dataset.suffix ? `${val}${slider.dataset.suffix}` : val;
      weightedTotal += val * weight;
      weightSum += weight;
    });
    if (scoreEl && weightSum > 0) {
      const score = Math.min(99, Math.round(weightedTotal / weightSum));
      scoreEl.textContent = score;
    }
  };

  sliders.forEach((slider) => slider.addEventListener("input", update));
  update();
}

// ---- Analyst Console: suggested-question chips + disabled-send affordance ----
function initChatDemo() {
  const input = document.querySelector("[data-chat-input]");
  const chips = document.querySelectorAll("[data-chip]");
  const sendBtn = document.querySelector("[data-chat-send]");
  const scrollEl = document.querySelector("[data-chat-scroll]");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      if (input) {
        input.value = chip.dataset.chip;
        input.focus();
      }
    });
  });

  if (sendBtn) {
    sendBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (input) {
        input.placeholder = "This preview is read-only — the live model connects here";
        input.value = "";
      }
    });
  }

  if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
}

function initYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = new Date().getFullYear();
}
