import { homeInit, homeDestroy } from "./home.js";
import { skillsInit, skillsDestroy } from "./skills.js";
import { projectsInit, projectsDestroy } from "./projects.js";
import { testimonialInit, testimonialDestroy } from "./testimonial.js";

let lenis = null;
let currentPage = null;
let rafId = null;
let isTransitioning = false;
let menuTimeline = null;

// ============================================
// 1. LAYOUT
// ============================================
let navbarHTML = `
<div id="navOpen" class="fs-menu-btn cursor-pointer border-2 p-3 border-black bg-gray-50 rounded-2xl fixed top-5 right-5 z-[100]">
  <span id="fir"></span>
  <span></span>
  <span></span>
</div>
<div id="fullnav" style="position: fixed; top: 0px; left: 0px; width: 100%; height: 100vh; transform: translate(0px, -105%); z-index: 150;" class="bg-[#111] overflow-hidden">
  <div id="navClose" class="flex w-100 justify-end text-white p-5 cursor-pointer uppercase tracking-tighter">close</div>
  <div class="flex h-full">
    <div id="navLinksContainer" class="flex flex-col gap-8 text-6xl p-20 items-start">
      <div class="h-[80px] overflow-hidden w-[100%]">
        <span class="mazius navBarSpans relative inline-block text-white cursor-pointer transition-all duration-300 hover:text-[#10b981] hover:scale-110 hover:-translate-y-1">
          <a href="index.html" data-img="images/homesccreen.png">Home</a>
        </span>
      </div>
      <div class="h-[80px] overflow-hidden w-[100%]">
        <span class="mazius navBarSpans relative inline-block text-white cursor-pointer transition-all duration-300 hover:text-[#10b981] hover:scale-110 hover:-translate-y-1">
          <a href="testimonial.html" data-img="images/testimonials.png">Testimonials</a>
        </span>
      </div>
      <div class="h-[80px] overflow-hidden w-[100%]">
        <span class="mazius navBarSpans relative inline-block text-white cursor-pointer transition-all duration-300 hover:text-[#10b981] hover:scale-110 hover:-translate-y-1">
          <a href="projects.html" data-img="images/projects.png">Projects</a>
        </span>
      </div>
      <div class="h-[80px] overflow-hidden w-[100%]">
        <span class="mazius navBarSpans relative inline-block text-white cursor-pointer transition-all duration-300 hover:text-[#10b981] hover:scale-110 hover:-translate-y-1">
          <a href="skills.html" data-img="images/skills.png">Skills</a>
        </span>
      </div>
    </div>
    <div class="hidden lg:flex items-center p-20 h-full">
       <div class="overflow-hidden bg-transparent">          
          <img id="navImage" src="images/homesccreen.png" class="max-w-full h-auto" alt="Preview" style="opacity: 0;">
       </div>
    </div>
  </div>
</div>
`;

// ============================================
// 2. LOGIC
// ============================================

function getActiveImageUrl() {
  const page = detectPage();
  const links = document.querySelectorAll("#fullnav a");
  let activeImg = "images/homesccreen.png";
  links.forEach((link) => {
    const href = link.getAttribute("href");
    const linkPath = href?.split("/").pop().split(".")[0];
    const isHome = page === "home" && (linkPath === "index" || !linkPath);
    if (linkPath === page || isHome) {
      activeImg = link.getAttribute("data-img") || activeImg;
    }
  });
  return activeImg;
}

function updateNavVisuals() {
  const page = detectPage();
  const navLinks = document.querySelectorAll("#fullnav a");
  const navImgElement = document.getElementById("navImage");
  if (navImgElement) navImgElement.src = getActiveImageUrl();

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const linkPath = href?.split("/").pop().split(".")[0];
    const isHome = page === "home" && (linkPath === "index" || !linkPath);
    if (linkPath === page || isHome) {
      link.parentElement.classList.add("text-[#10b981]");
    } else {
      link.parentElement.classList.remove("text-[#10b981]");
    }
  });
}

function initNavbar() {
  const fullnav = document.getElementById("fullnav");
  const spans = document.querySelectorAll(".navBarSpans");
  const navImage = document.getElementById("navImage");
  const navLinks = document.querySelectorAll("#fullnav a[data-img]");

  if (!fullnav) return;

  gsap.set(fullnav, { y: "-105%" });
  gsap.set(spans, { y: 150 });
  gsap.set(navImage, { opacity: 0, scale: 0.9 });

  if (menuTimeline) menuTimeline.kill();
  menuTimeline = gsap.timeline({ paused: true });
  menuTimeline
    .to(fullnav, { y: "0%", duration: 0.8, ease: "expo.out" })
    .to(
      spans,
      { y: 0, stagger: 0.08, duration: 0.8, ease: "power4.out" },
      "-=0.8",
    )
    .to(navImage, { opacity: 1, scale: 1, duration: 0.8 }, "-=0.7");

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const newSrc = link.getAttribute("data-img");
      if (newSrc && !navImage.src.includes(newSrc)) {
        gsap.to(navImage, {
          opacity: 0,
          x: 20,
          duration: 0.15,
          onComplete: () => {
            navImage.src = newSrc;
            gsap.to(navImage, { opacity: 1, x: 0, duration: 0.2 });
          },
        });
      }
    });
    link.addEventListener("mouseleave", () => {
      const activeImgSrc = getActiveImageUrl();
      if (!navImage.src.includes(activeImgSrc)) {
        gsap.to(navImage, {
          opacity: 0,
          duration: 0.15,
          onComplete: () => {
            navImage.src = activeImgSrc;
            gsap.to(navImage, { opacity: 1, duration: 0.2 });
          },
        });
      }
    });
  });
  updateNavVisuals();
}

// ============================================
// 3. BARBA & TRANSITIONS
// ============================================

if (typeof barba !== "undefined") {
  barba.init({
    sync: true,
    transitions: [
      {
        name: "dual-overlay",
        async leave(data) {
          isTransitioning = true;

          // --- NAVBAR FIX ---
          // Click hote hi navbar ko foran reset kar do taaki transition ke piche ye na dikhe
          gsap.set("#fullnav", { y: "-105%" });
          if (menuTimeline) menuTimeline.progress(0).pause();

          const bO = document.createElement("div");
          bO.style.cssText = `position:fixed; top:-100%; left:0; width:100%; height:100vh; background:#000; z-index:9998;`;
          document.body.appendChild(bO);
          const gO = document.createElement("div");
          gO.style.cssText = `position:fixed; top:-100%; left:0; width:100%; height:100vh; background:#10b981; z-index:9999;`;
          document.body.appendChild(gO);

          const tl = gsap.timeline();
          await tl
            .to(bO, { top: "0%", duration: 0.6, ease: "power2.inOut" })
            .to(
              gO,
              { top: "0%", duration: 0.4, ease: "power2.inOut" },
              "-=0.2",
            );

          destroyPage(currentPage);
          data.current.container.remove();

          await tl.to([bO, gO], {
            top: "100%",
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.in",
          });

          bO.remove();
          gO.remove();
        },
        async afterEnter() {
          isTransitioning = false;
          renderNavbar();
          initPage(detectPage()); // Animations yahan trigger hongi taaki element mil jayein
        },
        async once() {
          renderNavbar();
          initPage(detectPage());
        },
      },
    ],
  });
}

// ============================================
// 4. LIFECYCLE HELPERS
// ============================================

function initPage(page) {
  currentPage = page;
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }
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
  }
  setTimeout(initLenis, 100);
}

function destroyPage(page) {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
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
}

function initLenis() {
  if (typeof Lenis === "undefined") return;
  lenis = new Lenis({ duration: 1.2, smooth: true });
  const raf = (time) => {
    if (lenis) lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);
}

function detectPage() {
  const p = window.location.pathname.split("/").pop().split(".")[0];
  if (["skills", "projects", "testimonial"].includes(p)) return p;
  return !p || p === "index" ? "home" : "home";
}

function renderNavbar() {
  if (!document.getElementById("fullnav")) {
    const container = document.createElement("div");
    container.innerHTML = navbarHTML;
    document.body.prepend(container);
  }
  initNavbar();
}

document.addEventListener("click", (e) => {
  if (e.target.closest("#navOpen")) menuTimeline?.play();
  if (e.target.closest("#navClose")) menuTimeline?.reverse();
});

renderNavbar();
if (typeof barba === "undefined") initPage(detectPage());
