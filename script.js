document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const revealElements = document.querySelectorAll(".reveal");
  const yearEl = document.getElementById("year");
  const contactForm = document.getElementById("contactForm");
  const quickWhatsApp = document.getElementById("quickWhatsApp");
  const sections = document.querySelectorAll("main section[id], header section[id]");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  const activateNavLink = () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", activateNavLink);
  activateNavLink();

  const buildWhatsAppMessage = () => {
    const parentName = document.getElementById("parentName")?.value.trim() || "";
    const phone = document.getElementById("phone")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const child = document.getElementById("child")?.value.trim() || "";
    const service = document.getElementById("service")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim() || "";

    const text = `Hello Skatemate Kenya!
My name is ${parentName || "Not provided"}.
Phone: ${phone || "Not provided"}
Email: ${email || "Not provided"}
Child Name & Age: ${child || "Not provided"}
Service Needed: ${service || "Not provided"}
Message: ${message || "Not provided"}`;

    return `https://wa.me/254701182012?text=${encodeURIComponent(text)}`;
  };

  if (quickWhatsApp) {
    quickWhatsApp.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(buildWhatsAppMessage(), "_blank", "noopener");
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      window.open(buildWhatsAppMessage(), "_blank", "noopener");
      launchConfetti();
      contactForm.reset();
    });
  }

  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let confettiPieces = [];
  let animationId;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createConfetti() {
    confettiPieces = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 3 + 2,
      drift: Math.random() * 2 - 1,
      color: ["#ff6b6b", "#4ecdc4", "#ffd166", "#4dabf7", "#ff85c0"][
        Math.floor(Math.random() * 5)
      ],
      tilt: Math.random() * 10
    }));
  }

  function drawConfetti() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach((piece) => {
      ctx.beginPath();
      ctx.fillStyle = piece.color;
      ctx.fillRect(piece.x, piece.y, piece.size, piece.size * 0.6);
    });

    updateConfetti();
  }

  function updateConfetti() {
    confettiPieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += piece.drift;
      piece.tilt += 0.1;

      if (piece.y > canvas.height) {
        piece.y = -20;
        piece.x = Math.random() * canvas.width;
      }
    });
  }

  function animateConfetti() {
    drawConfetti();
    animationId = requestAnimationFrame(animateConfetti);
  }

  function launchConfetti() {
    if (!canvas || !ctx) return;
    resizeCanvas();
    createConfetti();
    cancelAnimationFrame(animationId);
    animateConfetti();

    setTimeout(() => {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 2500);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
});