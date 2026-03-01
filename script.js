document.addEventListener("DOMContentLoaded", function () {

  /* ================= NAVIGATION ================= */
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".page-section");
  const ctaServices = document.getElementById("cta-services");
  const process = document.getElementById("process");

  links.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("data-section"); // ex: "contact" ou "apropos"
      const scrollTarget = this.getAttribute("data-scroll"); // ex: "faq"

      if (!targetId) return;

      // 1. Masquer toutes les sections principales (mais pas les sous-sections fixes)
      sections.forEach(sec => sec.classList.remove("active"));
      if (ctaServices) ctaServices.classList.remove("active");
      if (process) process.classList.remove("active");

      // 2. Afficher la section cible
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add("active");

        // CAS SERVICES : afficher aussi process + CTA
        if (targetId === "services") {
          if (process) process.classList.add("active");
          if (ctaServices) ctaServices.classList.add("active");
        }
      }

      // 3. Scroll vers une ancre spécifique (ex: FAQ)
      setTimeout(() => {
        if (scrollTarget) {
          const el = document.getElementById(scrollTarget);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 50);
    });
  });

  /* ================= ACCORDÉONS ================= */
  function accordionAutoClose(selector) {
    const items = document.querySelectorAll(selector);
    items.forEach(item => {
      item.addEventListener("toggle", () => {
        if (item.open) {
          items.forEach(other => {
            if (other !== item) other.removeAttribute("open");
          });
        }
      });
    });
  }

  accordionAutoClose(".service-details");
  accordionAutoClose(".faq-item");

  /* ================= FORMULAIRE CONTACT (AJAX) ================= */
  const contactForm = document.querySelector(".contact-form");
  const successMessage = document.querySelector(".form-success");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: contactForm.method,
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          contactForm.reset();
          if (successMessage) successMessage.style.display = "block";
        } else {
          alert("Une erreur est survenue. Réessaie plus tard.");
        }
      })
      .catch(() => {
        alert("Erreur de connexion. Vérifie ta connexion internet.");
      });
    });
  }

  /* ================= MODALE PROJETS ================= */
  const projectModal = document.getElementById("projectModal");
  const modalOverlay = projectModal?.querySelector(".project-modal-overlay");
  const modalClose = projectModal?.querySelector(".project-modal-close");
  const modalTitle = projectModal?.querySelector(".project-modal-title");
  const modalMeta = projectModal?.querySelector(".project-meta");
  const modalDesc = projectModal?.querySelector(".project-modal-description");
  const modalSlider = projectModal?.querySelector(".project-slider");

  document.querySelectorAll(".project-item").forEach(project => {
    project.addEventListener("click", () => {
      // Injecter contenu
      if (modalTitle) modalTitle.textContent = project.dataset.title || "";
      if (modalMeta) modalMeta.textContent = project.dataset.meta || "";
      if (modalDesc) modalDesc.innerHTML = project.dataset.description || "";

      // Injecter images
      if (modalSlider) {
        modalSlider.innerHTML = "";
        project.dataset.images?.split(",").forEach(src => {
          const img = document.createElement("img");
          img.src = src;
          modalSlider.appendChild(img);
        });
      }

      // Afficher modale
      if (projectModal) {
        projectModal.style.display = "block";
        projectModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  function closeProjectModal() {
    if (projectModal) {
      projectModal.style.display = "none";
      projectModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  modalClose?.addEventListener("click", closeProjectModal);
  modalOverlay?.addEventListener("click", closeProjectModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && projectModal?.classList.contains("active")) {
      closeProjectModal();
    }
  });

  // BURGER MENU MOBILE
const burger = document.querySelector(".burger-menu");
const navLinks = document.querySelector(".nav-links");

burger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

});
