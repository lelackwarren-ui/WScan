// Navigation mobile, animations discrètes et galerie.
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const backToTop = document.querySelector(".back-to-top");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxClose = document.querySelector(".lightbox-close");

// Ouvrir / fermer le menu mobile.
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Télécharger un document PDF depuis un lien.
function downloadPdf(url, filename = "ocuments/document.pdf") {
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = filename.toLowerCase().endsWith(".pdf") ? filename : `${filename}.pdf`;
  downloadLink.hidden = true;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
}

// Bouton Déployer / Réduire
function toggleCode(button) {
    const codeContent = button.closest(".code-card").querySelector(".code-content");

    codeContent.classList.toggle("active");

    if (codeContent.classList.contains("active")) {
        button.textContent = "Réduire ▲";
    } else {
        button.textContent = "Déployer ▼";
    }
}

// Bouton Copier
async function copyCode(button) {
    const code = button.closest(".code-content").querySelector("pre code").innerText;

    try {
        await navigator.clipboard.writeText(code);
        button.textContent = "Copié !";
    } catch (error) {
        button.textContent = "Erreur";
    }

    setTimeout(() => {
        button.textContent = "Copier";
    }, 2000);
}
// Apparition des éléments au défilement. Le contenu reste visible si l'API n'existe pas.
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

// Bouton retour en haut.
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 450);
});
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Galerie : ouvrir une image seulement si le fichier est disponible.
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    if (!image || image.style.display === "none" || !image.complete || image.naturalWidth === 0) return;
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  lightboxImage.src = "";
}
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
});

// Mettre en évidence le lien correspondant à la section visible.
const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.querySelectorAll("a").forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));
}
