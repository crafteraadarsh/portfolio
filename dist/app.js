import { portfolio } from "./portfolio-data.js";

const $ = (selector) => document.querySelector(selector);
const root = document.documentElement;

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const isSmallScreen = () => window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
const isTouch = () => window.matchMedia("(hover: none), (pointer: coarse)").matches;

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value || "";
}

function externalAttrs(url) {
  return /^https?:/.test(url) ? ' target="_blank" rel="noreferrer"' : "";
}

function socialLinks() {
  return portfolio.socials
    .map(
      (item) =>
        `<a href="${escapeHtml(item.url)}"${externalAttrs(item.url)}>${escapeHtml(item.label)} <span class="arr" aria-hidden="true">→</span></a>`
    )
    .join("");
}

/* ---------- Content ---------- */

function renderProfile() {
  setText("#brandName", portfolio.name);
  setText("#heroName", `${portfolio.name} — Portfolio`);
  setText("#heroLocation", portfolio.location);
  setText("#availability", portfolio.availability);
  setText("#summary", portfolio.summary);
  setText("#location", portfolio.location);
  setText("#emailLink", portfolio.email);
  setText("#phoneLink", portfolio.phone);
  setText("#year", new Date().getFullYear());

  const title = $("#heroTitle");
  title.setAttribute("aria-label", portfolio.role);
  title.innerHTML = portfolio.role
    .split(/\s+/)
    .map((word) => `<span class="line" aria-hidden="true" data-final="${escapeHtml(word)}">${escapeHtml(word)}</span>`)
    .join("");

  $("#emailLink").href = `mailto:${portfolio.email}`;
  $("#phoneLink").href = `tel:${portfolio.phone}`;
  $("#contactEmail").href = `mailto:${portfolio.email}`;

  $("#socials").innerHTML = socialLinks();
  $("#contactSocials").innerHTML = socialLinks();
}

function renderProjects() {
  $("#projectGrid").innerHTML = portfolio.projects
    .map((project, index) => {
      const number = String(index + 1).padStart(2, "0");
      return `
        <article class="project-card glass" data-index="${index}">
          <div class="project-meta">
            <span>${number} / ${escapeHtml(project.category)}</span>
            ${project.year ? `<span>${escapeHtml(project.year)}</span>` : ""}
          </div>
          <h3 class="project-title glitch" data-text="${escapeHtml(project.title)}">${escapeHtml(project.title)}</h3>
          ${
            project.points
              ? `<ul class="project-points">${project.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>`
              : `<p class="project-desc">${escapeHtml(project.description)}</p>`
          }
          <ul class="tags" aria-label="Tech stack">
            ${project.stack.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("")}
          </ul>
          ${project.links && project.links.length ? `<div class="card-links">
            ${project.links
              .map(
                (link) =>
                  `<a class="chip-link" href="${escapeHtml(link.url)}"${externalAttrs(link.url)}>${escapeHtml(link.label)} <span class="arr" aria-hidden="true">→</span></a>`
              )
              .join("")}
          </div>` : ""}
        </article>
      `;
    })
    .join("");
}

function renderSkills() {
  const groups = portfolio.skillGroups || [{ label: "Skills", items: portfolio.skills || [] }];
  $("#skillCloud").innerHTML = groups
    .map(
      (group) => `
        <li class="skill-group">
          <h3 class="skill-label">${escapeHtml(group.label)}</h3>
          <ul class="skill-chips">${group.items.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("")}</ul>
        </li>
      `
    )
    .join("");
  const all = groups.filter((group) => group.label !== "Soft Skills").flatMap((group) => group.items);
  const run = all.map((skill) => `<span class="sk">${escapeHtml(skill)}</span><span class="sep">/</span>`).join("");
  // Two copies so the loop is seamless.
  $("#skillMarquee").innerHTML = run + run;
}

function renderTimeline() {
  $("#experienceList").innerHTML = portfolio.experience
    .map(
      (item) => `
        <article class="timeline-item glass reveal">
          <p class="period">${escapeHtml(item.period)}</p>
          <h4>${escapeHtml(item.role)}</h4>
          <strong>${escapeHtml(item.company)}${item.location ? `, ${escapeHtml(item.location)}` : ""}</strong>
          <ul>
            ${item.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");

  $("#educationList").innerHTML = portfolio.education
    .map(
      (item) => `
        <article class="timeline-item glass reveal">
          <p class="period">${escapeHtml(item.period)}</p>
          <h4>${escapeHtml(item.degree)}</h4>
          <strong>${escapeHtml(item.institution)}${item.location ? `, ${escapeHtml(item.location)}` : ""}</strong>
          <span>${escapeHtml(item.details)}</span>
        </article>
      `
    )
    .join("");
}

function renderCertifications() {
  $("#certificationList").innerHTML = portfolio.certifications
    .map(
      (item) => `
        <article class="cert-card glass reveal">
          <p class="period">${escapeHtml(item.year)}</p>
          <h3 class="glitch" data-text="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h3>
          <strong>${escapeHtml(item.issuer)}</strong>
          <span>${escapeHtml(item.detail)}</span>
          ${
            item.url
              ? `<a class="chip-link" href="${escapeHtml(item.url)}"${externalAttrs(item.url)}>${escapeHtml(item.linkLabel || "View credential")} <span class="arr" aria-hidden="true">→</span></a>`
              : ""
          }
        </article>
      `
    )
    .join("");
}

/* ---------- Interactions ---------- */

function bindHeader() {
  const header = $(".site-header");
  const update = () => header.classList.toggle("scrolled", window.scrollY > 24);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function bindCopyEmail() {
  const button = $("#copyEmail");
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(portfolio.email);
      button.textContent = "Copied";
    } catch {
      button.textContent = portfolio.email;
    }
    setTimeout(() => {
      button.textContent = "Copy email";
    }, 1600);
  });
}

function bindAsk() {
  const form = $("#askForm");
  const input = $("#askInput");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) {
      input.focus();
      return;
    }
    const subject = encodeURIComponent("Question from your portfolio");
    const body = encodeURIComponent(question);
    window.location.href = `mailto:${portfolio.email}?subject=${subject}&body=${body}`;
  });
}

function bindReveal() {
  const items = document.querySelectorAll(".reveal");
  // Siblings in the same grid arrive one after another rather than all at once.
  document.querySelectorAll(".timeline, .cert-grid, .contact").forEach((group) => {
    [...group.children]
      .filter((child) => child.classList.contains("reveal"))
      .forEach((child, index) => child.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 90}ms`));
  });
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("in"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );
  items.forEach((item) => observer.observe(item));
}

function scrambleHeadline() {
  if (reducedMotionQuery.matches) return;
  // Plain characters the display font has, so the line size stays steady while it scrambles.
  const glyphs = "#/<>_=+*01XZ";
  const lines = [...document.querySelectorAll("#heroTitle .line")];
  const start = performance.now();
  const duration = 1100;

  function frame(now) {
    let done = true;
    lines.forEach((line, lineIndex) => {
      const target = line.dataset.final;
      const local = Math.min(1, Math.max(0, (now - start - lineIndex * 160) / duration));
      if (local < 1) done = false;
      const revealed = Math.floor(local * target.length);
      line.textContent = [...target]
        .map((char, i) => (i < revealed ? char : glyphs[(Math.random() * glyphs.length) | 0]))
        .join("");
    });
    if (!done) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---------- Scroll-driven motion ---------- */

function bindScrollMotion() {
  const cards = [...document.querySelectorAll(".project-card")];
  const state = { scroll: window.scrollY, smooth: window.scrollY, time: 0 };
  let visibleCards = new Set();
  const touch = isTouch();
  let viewportH = window.innerHeight;
  let docH = document.documentElement.scrollHeight;

  const measure = () => {
    viewportH = window.innerHeight;
    docH = document.documentElement.scrollHeight;
    lastKey = "";
  };
  window.addEventListener("resize", measure, { passive: true });
  window.addEventListener("load", measure);
  window.addEventListener("scroll", () => (state.scroll = window.scrollY), { passive: true });

  if ("IntersectionObserver" in window) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleCards.add(entry.target);
        else visibleCards.delete(entry.target);
      });
    });
    cards.forEach((card) => cardObserver.observe(card));
  } else {
    visibleCards = new Set(cards);
  }

  // Pointer-driven sheen on glass cards (mouse only; on touch the sheen follows scroll).
  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });
  });

  const motion = { burst: 0, scrollVh: 0, progress: 0 };

  function computeMotion(scroll) {
    const maxScroll = Math.max(1, docH - viewportH);
    const vh = scroll / viewportH;
    const out = smoothstep(0.08, 0.95, vh);
    // Re-form as the contact section comes into view.
    const back = smoothstep(maxScroll - viewportH * 1.1, maxScroll - viewportH * 0.35, scroll);
    motion.burst = out * (1 - back);
    motion.scrollVh = vh;
    motion.progress = Math.min(1, scroll / maxScroll);
    motion.reform = back;
  }

  let lastKey = "";
  let running = true;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  });

  function tick(now) {
    if (!running) return;
    state.time = now / 1000;
    state.smooth += (state.scroll - state.smooth) * 0.12;
    if (Math.abs(state.scroll - state.smooth) < 0.1) state.smooth = state.scroll;
    computeMotion(state.smooth);

    // Only touch the page styles when the scroll position has actually moved.
    const key = state.smooth.toFixed(1);
    if (key !== lastKey) {
      lastKey = key;
      root.style.setProperty("--burst", motion.burst.toFixed(4));
      root.style.setProperty("--progress", motion.progress.toFixed(4));
      root.style.setProperty("--scroll-vh", Math.min(motion.scrollVh, 2).toFixed(4));
    }

    if (!reducedMotionQuery.matches) {
      visibleCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const centre = rect.top + rect.height / 2;
        const n = Math.max(-1.2, Math.min(1.2, (centre - viewportH / 2) / viewportH));
        // Phones get a gentler, scroll-only tilt so cards stay readable.
        const tilt = window.innerWidth < 760 ? 0.3 : 1;
        const side = Number(card.dataset.index) % 2 === 0 ? 1 : -1;
        const float = touch ? 0 : Math.sin(state.time * 0.9 + Number(card.dataset.index) * 1.7) * 6;
        card.style.setProperty("--rx", `${(n * 16 * tilt).toFixed(2)}deg`);
        card.style.setProperty("--ry", `${(n * 10 * side * tilt).toFixed(2)}deg`);
        card.style.setProperty("--tz", `${(-Math.abs(n) * 140 * tilt).toFixed(1)}px`);
        card.style.setProperty("--ty", `${float.toFixed(1)}px`);
        card.style.setProperty("--sheen", n.toFixed(3));
        card.style.setProperty("--hue", `${(n * 60).toFixed(1)}deg`);
      });
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return motion;
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/* ---------- WebGL stage ---------- */

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
    // Without a real graphics chip the 3D scene would run on the CPU and make the page sluggish;
    // the lighter CSS emblem is used instead.
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software/i.test(renderer);
  } catch {
    return false;
  }
}

function whenIdle() {
  return new Promise((resolve) => {
    const go = () => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(resolve, { timeout: 1500 });
      else setTimeout(resolve, 300);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  });
}

async function startStage(motion) {
  if (reducedMotionQuery.matches || !hasWebGL()) return;
  const lite = isSmallScreen();
  // The CSS emblem paints first; the 3D scene loads once the page has finished loading and is idle.
  await whenIdle();
  try {
    const { createStage } = await import("./scene.js");
    const started = createStage($("#stageCanvas"), motion, { lite });
    if (started) root.classList.add("webgl");
  } catch (error) {
    // The CSS emblem stays visible as the fallback.
    root.classList.remove("webgl");
  }
}

renderProfile();
renderProjects();
renderSkills();
renderTimeline();
renderCertifications();
bindHeader();
bindCopyEmail();
bindAsk();
bindReveal();
scrambleHeadline();
const motion = bindScrollMotion();
startStage(motion);
