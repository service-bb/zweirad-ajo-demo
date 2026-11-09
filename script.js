(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let toastTimer;

  const demoMessages = {
    call: "Demo — in der fertigen Website würde hier angerufen. Es wird niemand kontaktiert.",
    email: "Demo — in der fertigen Website würde hier eine E-Mail geöffnet. Es wird niemand angeschrieben.",
  };

  function getToast() {
    return document.querySelector("#demo-toast");
  }

  function showDemoToast(message) {
    const toast = getToast();
    if (!toast) return;
    toast.hidden = false;
    toast.textContent = message;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
      toast.textContent = "";
    }, 4200);
  }

  window.showDemoNotice = function showDemoNotice(action) {
    showDemoToast(demoMessages[action] || demoMessages.call);
  };

  function setNavOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setNavOpen(open);
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNavOpen(false);
  });

  // Event delegation so demo CTAs never dial or email the real shop
  document.addEventListener("click", (event) => {
    const raw = event.target;
    const node = raw && raw.nodeType === 1 ? raw : raw && raw.parentElement;
    const el = node && typeof node.closest === "function" ? node.closest(".demo-contact") : null;
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    const action = el.getAttribute("data-demo-action") || "call";
    showDemoToast(demoMessages[action] || demoMessages.call);
  });

  window.addEventListener(
    "scroll",
    () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 12);
    },
    { passive: true }
  );

  function revealAll() {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    window.setTimeout(revealAll, 1200);
  } else {
    revealAll();
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!status) return;

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    status.hidden = false;

    if (!name || !email || !message) {
      status.textContent = "Bitte alle Pflichtfelder ausfüllen.";
      status.classList.add("is-error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = "Bitte eine gültige E-Mail-Adresse eingeben.";
      status.classList.add("is-error");
      return;
    }

    status.classList.remove("is-error");
    status.textContent =
      "Demo bestätigt: Ihre Nachricht wurde weder gespeichert noch versendet. Der Betrieb wurde nicht kontaktiert.";

    form.reset();
  });
})();
