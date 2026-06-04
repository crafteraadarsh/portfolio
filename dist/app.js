import { portfolio } from "./portfolio-data.js";

const $ = (selector) => document.querySelector(selector);

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value || "";
}

function renderProfile() {
  document.title = `${portfolio.name} | Portfolio`;
  setText("#availability", portfolio.availability);
  setText("#summary", portfolio.summary);
  setText("#location", portfolio.location);
  setText("#emailLink", portfolio.email);
  setText("#phoneLink", portfolio.phone);
  setText("#year", new Date().getFullYear());

  $("#emailLink").href = `mailto:${portfolio.email}`;
  $("#phoneLink").href = `tel:${portfolio.phone}`;
  $("#contactEmail").href = `mailto:${portfolio.email}`;

  $("#socials").innerHTML = portfolio.socials
    .map((item) => `<a href="${item.url}" target="_blank" rel="noreferrer">${item.label}</a>`)
    .join("");
}

function renderProjects() {
  $("#projectGrid").innerHTML = portfolio.projects
    .map(
      (project) => `
        <article class="project-card">
          <div class="project-meta">
            <span>${project.category}</span>
            <span>${project.year}</span>
          </div>
          <h3>${project.title}</h3>
          ${project.points ? "" : `<p>${project.description}</p>`}
          ${
            project.points
              ? `<ul class="project-points">${project.points.map((point) => `<li>${point}</li>`).join("")}</ul>`
              : ""
          }
          <div class="tags">
            ${project.stack.map((skill) => `<span>${skill}</span>`).join("")}
          </div>
          <div class="card-links">
            ${project.links
              .map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">${link.label}</a>`)
              .join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function renderSkills() {
  $("#skillCloud").innerHTML = portfolio.skills.map((skill) => `<span>${skill}</span>`).join("");
}

function renderTimeline() {
  $("#experienceList").innerHTML = portfolio.experience
    .map(
      (item) => `
        <article class="timeline-item">
          <p>${item.period}</p>
          <h4>${item.role}</h4>
          <strong>${item.company}${item.location ? `, ${item.location}` : ""}</strong>
          <ul>
            ${item.points.map((point) => `<li>${point}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");

  $("#educationList").innerHTML = portfolio.education
    .map(
      (item) => `
        <article class="timeline-item">
          <p>${item.period}</p>
          <h4>${item.degree}</h4>
          <strong>${item.institution}${item.location ? `, ${item.location}` : ""}</strong>
          <span>${item.details}</span>
        </article>
      `
    )
    .join("");
}

function renderCertifications() {
  $("#certificationList").innerHTML = portfolio.certifications
    .map(
      (item) => `
        <article class="cert-card">
          <p>${item.year}</p>
          <h3>${item.title}</h3>
          <strong>${item.issuer}</strong>
          <span>${item.detail}</span>
          ${item.url ? `<a href="${item.url}" target="_blank" rel="noreferrer">View credential</a>` : ""}
        </article>
      `
    )
    .join("");
}

function bindTheme() {
  const theme = localStorage.getItem("theme") || "dark";
  document.documentElement.dataset.theme = theme;

  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
}

function bindCopyEmail() {
  $("#copyEmail").addEventListener("click", async () => {
    await navigator.clipboard.writeText(portfolio.email);
    $("#copyEmail").textContent = "Copied";
    setTimeout(() => {
      $("#copyEmail").textContent = "Copy email";
    }, 1400);
  });
}

renderProfile();
renderProjects();
renderSkills();
renderTimeline();
renderCertifications();
bindTheme();
bindCopyEmail();
