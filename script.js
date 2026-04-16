// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // --- NAVIGATION ---
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const sections = document.querySelectorAll("main section[id], header section[id]");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.forEach(link =>
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  const activateNavLink = () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  // Smooth scroll performance
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        activateNavLink();
        ticking = false;
      });
      ticking = true;
    }
  });

  activateNavLink();

  // --- REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // --- FOOTER YEAR ---
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- CONTACT FORM & WHATSAPP ---
  const contactForm = document.getElementById("contactForm");
  const quickWhatsApp = document.getElementById("quickWhatsApp");

  function buildWhatsAppMessage() {
    const parentName = document.getElementById("parentName")?.value.trim() || "Not provided";
    const phone = document.getElementById("phone")?.value.trim() || "Not provided";
    const email = document.getElementById("email")?.value.trim() || "Not provided";
    const child = document.getElementById("child")?.value.trim() || "Not provided";
    const service = document.getElementById("service")?.value.trim() || "Not provided";
    const message = document.getElementById("message")?.value.trim() || "Not provided";

    const text = `Hello Skatemate Kenya!
My name is ${parentName}.
Phone: ${phone}
Email: ${email}
Child Name & Age: ${child}
Service Needed: ${service}
Message: ${message}`;

    return `https://wa.me/254701182012?text=${encodeURIComponent(text)}`;
  }

  if (quickWhatsApp) {
    quickWhatsApp.addEventListener("click", e => {
      e.preventDefault();
      window.open(buildWhatsAppMessage(), "_blank", "noopener");
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      window.open(buildWhatsAppMessage(), "_blank", "noopener");
      launchConfetti();
      contactForm.reset();
    });
  }

  // --- CONFETTI ---
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let confettiPieces = [];
  let animationId;
  let isRunning = false;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createConfetti() {
    if (!canvas) return;

    confettiPieces = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 3 + 2,
      drift: Math.random() * 2 - 1,
      color: ["#ff6b6b", "#4ecdc4", "#ffd166", "#4dabf7", "#ff85c0"][Math.floor(Math.random() * 5)],
      tilt: Math.random() * 10
    }));
  }

  function drawConfetti() {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach(piece => {
      ctx.fillStyle = piece.color;
      ctx.fillRect(piece.x, piece.y, piece.size, piece.size * 0.6);
    });

    updateConfetti();
  }

  function updateConfetti() {
    confettiPieces.forEach(piece => {
      piece.y += piece.speed;
      piece.x += piece.drift;

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
    if (!canvas || !ctx || isRunning) return;

    isRunning = true;

    resizeCanvas();
    createConfetti();

    cancelAnimationFrame(animationId);
    animateConfetti();

    setTimeout(() => {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      isRunning = false;
    }, 2500);
  }
  function toggleChat() {
  const chat = document.getElementById("chatBox");
  chat.style.display = chat.style.display === "flex" ? "none" : "flex";
}

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // --- CHAT ENTER KEY ---
  const userInput = document.getElementById("userInput");
  if (userInput) {
    userInput.addEventListener("keypress", e => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }
});

// --- AI CHAT FUNCTIONS (GLOBAL) ---

function toggleChat() {
  const box = document.getElementById("chatBox");
  if (!box) return;

  box.style.display = box.style.display === "block" ? "none" : "block";
}

// SAFE message creator
function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = `msg ${className}`;
  div.textContent = text;
  return div;
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chatMessages");

  if (!input || !chat) return;

  const msg = input.value.trim();
  if (!msg) return;

  chat.appendChild(addMessage(msg, "user"));
  chat.scrollTop = chat.scrollHeight;

  const faq = [
    { q: ["hi", "hello"], a: "Hi 😊 I'm Wambo. How can I help you today?" },
    { q: ["price", "cost"], a: "Our prices depend on the lesson. Just WhatsApp me at 0701 182 012 and I’ll guide you 👍" },
    { q: ["location", "where"], a: "We come to your home, school, or event anywhere in Nairobi 😊" },
    { q: ["age"], a: "We train kids from around 4 to 14 years old." },
    { q: ["skating"], a: "Skating is our most popular 😄 Your child will learn balance, confidence and have fun!" },
    { q: ["swimming"], a: "We offer safe and fun swimming lessons for kids of all levels." },
    { q: ["dance"], a: "Our dance sessions are energetic and fun 💃 Great for confidence!" },
    { q: ["birthday", "party"], a: "Yes! We do amazing birthday packages 🎉 with skating, games and music." },
    { q: ["book"], a: "You can click 'Book Now' or WhatsApp me directly 😊" },
    { q: ["gear"], a: "We provide all beginner gear 👍" },
    { q: ["safe"], a: "Yes, safety is our priority. Kids are always supervised." }
  ];

  let reply = "Hmm 🤔 Let me help you better. Please WhatsApp me at 0701 182 012.";
  const lowerMsg = msg.toLowerCase();

  for (let item of faq) {
    if (item.q.some(word => lowerMsg.includes(word))) {
      reply = item.a;
      break;
    }
  }

  setTimeout(() => {
    chat.appendChild(addMessage(reply, "bot"));
    chat.scrollTop = chat.scrollHeight;
  }, 500);

  input.value = "";
}