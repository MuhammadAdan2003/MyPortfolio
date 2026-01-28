// main.js - Complete optimized main entry file
import { homeInit, homeDestroy } from "./home.js";
import { skillsInit, skillsDestroy } from "./skills.js";
import { projectsInit, projectsDestroy } from "./projects.js";
import { testimonialInit, testimonialDestroy } from "./testimonial.js";

// Global variables
let lenis = null;
let currentPage = null;
let rafId = null;
let isTransitioning = false;

function initLenis() {
  // Check if Lenis is loaded
  if (typeof Lenis === "undefined") {
    console.warn("⚠️ Lenis library not found");
    return null;
  }

  // Destroy existing Lenis if any
  if (lenis) {
    try {
      lenis.destroy();
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    } catch (e) {
      console.log("Cleaning old Lenis instance");
    }
  }

  try {
    // Create Lenis instance with optimized settings
    lenis = new Lenis({
      duration: 1.5, // pehle 1.2 → thoda slower for smoothness
      easing: (t) => 1 - Math.pow(1 - t, 4), // smoother easing curve
      smooth: true,
      smoothTouch: true,
      wheelMultiplier: 1, // same
      touchMultiplier: 1.2, // pehle 1.5 → slightly smoother touch
      infinite: false,
    });

    // Connect with GSAP ScrollTrigger if available
    if (typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
      console.log("✅ Lenis connected with ScrollTrigger");
    }

    // Optimized RAF loop
    function raf(time) {
      if (lenis && typeof lenis.raf === "function") {
        lenis.raf(time);
      }
      rafId = requestAnimationFrame(raf);
    }

    // Start RAF loop
    rafId = requestAnimationFrame(raf);

    console.log("✅ Lenis smooth scroll initialized");
    return lenis;
  } catch (error) {
    console.error("❌ Failed to initialize Lenis:", error);
    return null;
  }
}

function destroyLenis() {
  // Cancel RAF loop
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  // Destroy Lenis instance
  if (lenis) {
    try {
      lenis.destroy();
      lenis = null;
      console.log("🗑️ Lenis destroyed");
    } catch (error) {
      console.warn("Could not destroy Lenis:", error);
    }
  }
}

// ============================================
// PAGE DETECTION
// ============================================
function detectPage() {
  // Method 1: Check body data attribute
  if (document.body.dataset.page) {
    return document.body.dataset.page;
  }

  // Method 2: Check URL
  const path = window.location.pathname;
  const pageName = path.split("/").pop().split(".")[0];

  if (pageName === "skills") return "skills";
  if (pageName === "projects") return "projects";
  if (pageName === "testimonial") return "testimonial";
  if (pageName === "" || pageName === "index" || pageName === "index.html")
    return "home";
  return "home";
}

// ============================================
// PAGE INITIALIZATION - OPTIMIZED
// ============================================
function initPage(page) {
  console.log(`🚀 Initializing ${page} page...`);
  currentPage = page;

  // Register GSAP plugins if available
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    try {
      gsap.registerPlugin(ScrollTrigger);
      console.log("✅ GSAP plugins registered");
    } catch (e) {
      console.warn("Could not register GSAP plugins:", e);
    }
  }

  // Initialize page-specific code
  switch (page) {
    case "home":
      homeInit();
      break;
    case "skills":
      skillsInit();
      break;
    case "projects":
      projectsInit();
      break;
    case "testimonial":
      testimonialInit();
      break;
    default:
      console.warn(`Unknown page: ${page}`);
  }

  // Initialize Lenis after page content is ready
  setTimeout(() => {
    initLenis();
  }, 300);

  // Handle window resize
  setupResizeHandler();
}

function destroyPage(page) {
  if (isTransitioning) return;

  console.log(`🧹 Destroying ${page} page...`);

  // Destroy page-specific code
  switch (page) {
    case "home":
      homeDestroy();
      break;
    case "skills":
      skillsDestroy();
      break;
    case "projects":
      projectsDestroy();
      break;
    case "testimonial":
      testimonialDestroy();
      break;
  }

  // Destroy Lenis
  destroyLenis();
}

// ============================================
// RESIZE HANDLER
// ============================================
function setupResizeHandler() {
  let resizeTimeout;

  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Refresh ScrollTrigger if available
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }

      // Dispatch custom resize event for page-specific handling
      window.dispatchEvent(
        new CustomEvent("pageResize", {
          detail: { page: currentPage },
        }),
      );
    }, 250);
  }

  window.addEventListener("resize", handleResize);

  // Store handler for cleanup
  window.appResizeHandler = handleResize;
}

function removeResizeHandler() {
  if (window.appResizeHandler) {
    window.removeEventListener("resize", window.appResizeHandler);
  }
}

// ============================================
// OLD BARBA.JS DUAL OVERLAY TRANSITION
// ============================================
if (typeof barba !== "undefined" && typeof gsap !== "undefined") {
  console.log("🌀 Setting up Barba.js with dual overlay transition");

  // Prefetch images for smoother transitions
  barba.hooks.before(() => {
    if (isTransitioning) return;
    isTransitioning = true;
  });

  barba.hooks.after(() => {
    isTransitioning = false;

    // Update active navigation
    updateActiveNav();
  });

  // Update active navigation
  function updateActiveNav() {
    const navLinks = document.querySelectorAll("nav a, .fixed a");
    const currentPage = detectPage();

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href) {
        const linkPage = href.split("/").pop().split(".")[0];
        if (
          linkPage === currentPage ||
          (currentPage === "home" && (linkPage === "" || linkPage === "index"))
        ) {
          link.classList.add("text-primary");
          link.classList.remove("text-white");
        } else {
          link.classList.remove("text-primary");
          link.classList.add("text-white");
        }
      }
    });
  }

  // Initialize Barba.js with dual overlay transition
  barba.init({
    sync: true,
    debug: false,
    prefetch: true,
    timeout: 7000,

    transitions: [
      {
        name: "dual-overlay-transition",

        async leave(data) {
          console.log(`👋 Leaving ${currentPage} page`);

          // Mark as transitioning
          isTransitioning = true;

          // Destroy current page
          if (currentPage) {
            destroyPage(currentPage);
          }

          // Black overlay - pehle aaye
          const blackOverlay = document.createElement("div");
          blackOverlay.className = "black-transition-overlay";
          blackOverlay.style.cssText = `
            position: fixed;
            top: -100%;
            left: 0;
            width: 100%;
            height: 100vh;
            background: #000;
            z-index: 9998;
            pointer-events: none;
          `;
          document.body.appendChild(blackOverlay);

          // Black ko neeche layein
          await gsap.to(blackOverlay, {
            top: "0%",
            duration: 0.8,
            ease: "power2.out",
          });

          // Green overlay - phir aaye
          const greenOverlay = document.createElement("div");
          greenOverlay.className = "green-transition-overlay";
          greenOverlay.style.cssText = `
            position: fixed;
            top: -100%;
            left: 0;
            width: 100%;
            height: 100vh;
            background: #10b981;
            z-index: 9999;
            pointer-events: none;
          `;
          document.body.appendChild(greenOverlay);

          // Green ko neeche layein
          await gsap.to(greenOverlay, {
            top: "0%",
            duration: 0.5,
            ease: "power2.out",
          });

          // Old page remove
          if (data.current && data.current.container) {
            try {
              data.current.container.remove();
            } catch (e) {
              console.warn("Could not remove old container:", e);
            }
          }

          // Ab dono NICHE SE shrink ho jaayein
          // Black pehle shrink ho
          await gsap.to(blackOverlay, {
            height: "0",
            top: "100%",
            duration: 0.5,
            ease: "power2.in",
          });

          // Green phir shrink ho
          await gsap.to(greenOverlay, {
            height: "0",
            top: "100%",
            duration: 0.5,
            ease: "power2.in",
            delay: 0.1,
          });
        },

        async enter(data) {
          console.log("👉 Entering new page");

          // Remove overlays
          const overlays = document.querySelectorAll(
            ".black-transition-overlay, .green-transition-overlay",
          );
          overlays.forEach((el) => {
            if (el && el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });

          // Show new page with fade in
          if (data.next && data.next.container) {
            data.next.container.style.opacity = "0";
            await gsap.to(data.next.container, {
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            });
          }

          // Initialize new page
          const page = detectPage();
          initPage(page);

          // Update transition state
          isTransitioning = false;
        },

        async once(data) {
          console.log("🌟 First page load");
          const page = detectPage();
          initPage(page);
          updateActiveNav();
        },

        sync: false,
      },
    ],
  });

  // Handle clicks during transition
  document.addEventListener(
    "click",
    (e) => {
      if (isTransitioning) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );
} else {
  console.log("🚫 Barba.js not available, using direct initialization");

  // Direct initialization without Barba
  function directInit() {
    console.log("📋 Direct initialization started");

    const page = detectPage();
    console.log("📄 Detected page:", page);

    initPage(page);

    // Update navigation for direct load
    setTimeout(() => {
      const navLinks = document.querySelectorAll("nav a, .fixed a");
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href) {
          const linkPage = href.split("/").pop().split(".")[0];
          if (
            linkPage === page ||
            (page === "home" && (linkPage === "" || linkPage === "index"))
          ) {
            link.classList.add("text-primary");
            link.classList.remove("text-white");
          }
        }
      });
    }, 100);

    console.log(`✅ ${page} page initialized directly`);
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", directInit);
  } else {
    directInit();
  }
}

// ============================================
// GLOBAL CLEANUP
// ============================================
window.addEventListener("beforeunload", () => {
  if (currentPage) {
    destroyPage(currentPage);
  }
  removeResizeHandler();
});

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener("error", (event) => {
  console.error("🚨 Global error caught:", event.error);

  // Don't break the page on non-critical errors
  if (event.error.message && event.error.message.includes("Lenis")) {
    console.warn("Lenis error, continuing without smooth scroll");
    event.preventDefault();
  }
});

// ============================================
// DEBUGGING & EXPORTS
// ============================================
// Show debug info after load
setTimeout(() => {
  console.log("=== APP DEBUG INFO ===");
  console.log("Current Page:", currentPage);
  console.log("Body data-page:", document.body.dataset.page);
  console.log("GSAP:", typeof gsap);
  console.log("ScrollTrigger:", typeof ScrollTrigger);
  console.log("Lenis:", typeof Lenis);
  console.log("Matter.js:", typeof Matter);
  console.log("Barba.js:", typeof barba);
  console.log("Is Transitioning:", isTransitioning);
}, 1000);

// Export for debugging and manual control
window.app = {
  // Core functions
  initLenis,
  destroyLenis,
  initPage: (page) => {
    if (page) initPage(page);
    else initPage(detectPage());
  },
  destroyPage: (page) => {
    if (page) destroyPage(page);
    else if (currentPage) destroyPage(currentPage);
  },
  detectPage,

  // State
  currentPage: () => currentPage,
  isTransitioning: () => isTransitioning,

  // Manual page switching (for debugging)
  goToPage: (pageName) => {
    if (isTransitioning) {
      console.warn("Cannot switch page during transition");
      return;
    }

    const pages = ["home", "skills", "projects", "testimonial"];
    if (pages.includes(pageName)) {
      window.location.href = `${pageName}.html`;
    } else {
      console.error(`Invalid page: ${pageName}`);
    }
  },
};

// Quick test function
window.testApp = () => {
  console.log("🧪 Testing app...");
  console.log("Current page:", window.app.currentPage());
  console.log("Lenis active:", !!lenis);
  console.log("GSAP available:", typeof gsap !== "undefined");
};

console.log("🎉 Main.js loaded successfully");
console.log("🔧 Use window.app for debugging and control");
