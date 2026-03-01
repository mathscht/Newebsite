document.addEventListener("DOMContentLoaded", function () {

    /* ================= 1. VARIABLES GLOBALES ================= */
    const sections = document.querySelectorAll(".page-section");
    const links = document.querySelectorAll(".nav-link");
    const ctaServices = document.getElementById("cta-services");
    const process = document.getElementById("process");
    const projectModal = document.getElementById("projectModal");

    /* ================= 2. FONCTION DE NAVIGATION ================= */
    function switchSection(targetId, scrollTargetId = null) {
        if (!targetId) return;

        // A. Masquer toutes les sections et éléments liés
        sections.forEach(sec => sec.classList.remove("active"));
        if (ctaServices) ctaServices.classList.remove("active");
        if (process) process.classList.remove("active");

        // B. Afficher la section cible
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add("active");

            // Affichage spécial pour la page Services
            if (targetId === "services") {
                if (process) process.classList.add("active");
                if (ctaServices) ctaServices.classList.add("active");
            }

            // C. Mettre à jour l'URL sans recharger
            window.history.pushState(null, null, `#${targetId}`);

            // D. Gestion du Scroll
            setTimeout(() => {
                if (scrollTargetId) {
                    const el = document.getElementById(scrollTargetId);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            }, 100);
        }
    }

    /* ================= 3. ÉCOUTEURS D'ÉVÉNEMENTS ================= */

    // Clic sur les liens du menu
    links.forEach(link => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("data-section");
            const scrollTargetId = this.getAttribute("data-scroll");

            if (targetId) {
                e.preventDefault();
                switchSection(targetId, scrollTargetId);
            }
        });
    });

    // Gestion du chargement initial / Refresh
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash) {
        switchSection(currentHash);
    } else {
        switchSection('realisations'); // Page par défaut
    }

    /* ================= 4. ACCORDÉONS (Services & FAQ) ================= */
    function initAccordions(selector) {
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
    initAccordions(".service-details");
    initAccordions(".faq-item");

    /* ================= 5. MODALE PROJETS ================= */
    if (projectModal) {
        const modalTitle = projectModal.querySelector(".project-modal-title");
        const modalMeta = projectModal.querySelector(".project-meta");
        const modalDesc = projectModal.querySelector(".project-modal-description");
        const modalSlider = projectModal.querySelector(".project-slider");
        const modalClose = projectModal.querySelector(".project-modal-close");
        const modalOverlay = projectModal.querySelector(".project-modal-overlay");

        // Fonction de fermeture
        const closeProjectModal = () => {
            projectModal.classList.remove("active");
            projectModal.style.display = "none";
            document.body.style.overflow = ""; 
        };

        // Sélectionne tous les project-item
        const projectItems = document.querySelectorAll(".project-item");
        
        projectItems.forEach(projectItem => {
            projectItem.addEventListener("click", function(e) {
                // On récupère les infos
                const title = this.getAttribute("data-title") || "";
                const meta = this.getAttribute("data-meta") || "";
                const desc = this.getAttribute("data-description") || "";
                const imagesStr = this.getAttribute("data-images") || "";

                // On remplit la modale
                if (modalTitle) modalTitle.textContent = title;
                if (modalMeta) modalMeta.textContent = meta;
                if (modalDesc) modalDesc.innerHTML = desc;

                if (modalSlider) {
                    modalSlider.innerHTML = ""; 
                    if (imagesStr) {
                        const imagesArray = imagesStr.split(",");
                        imagesArray.forEach(src => {
                            const img = document.createElement("img");
                            img.src = src.trim();
                            img.alt = title;
                            modalSlider.appendChild(img);
                        });
                    }
                }

                // Affichage
                projectModal.style.display = "block";
                // Petit timeout pour laisser le temps au navigateur de voir le display block avant l'animation
                setTimeout(() => {
                    projectModal.classList.add("active");
                }, 10);
                
                document.body.style.overflow = "hidden";
            });
        });

        modalClose?.addEventListener("click", closeProjectModal);
        modalOverlay?.addEventListener("click", closeProjectModal);
    }
    /* ================= 6. FORMULAIRE DE CONTACT (AJAX) ================= */
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
            .catch(() => alert("Erreur de connexion."));
        });
    }
});