export function homeInit() {
  console.log("🏠 Home page initialization");

  // Pills functionality
  const track3 = document.querySelector("#track3");
  const pills = document.querySelectorAll("#track3 .pill");

  function handlePillClick(e) {
    const oldActive = document.querySelector("#track3 .pill.active");

    if (e) {
      oldActive.classList.remove("active");
      e.target.classList.add("active");

      const tabId =
        e.target.id === "all-tab" ? "all-content" : "casual-content";

      document.querySelectorAll(".tab-pane").forEach((tab) => {
        tab.classList.remove("active");
      });
      document.getElementById(tabId).classList.add("active");
    }

    const activePill = document.querySelector("#track3 .pill.active");
    if (!activePill || !track3) return;

    const trackRect = track3.getBoundingClientRect();
    const activeRect = activePill.getBoundingClientRect();

    document.documentElement.style.setProperty(
      "--pill-left",
      activeRect.left - trackRect.left + "px",
    );
    document.documentElement.style.setProperty(
      "--pill-right",
      trackRect.right - activeRect.right + "px",
    );
  }

  pills.forEach((pill) => pill.addEventListener("click", handlePillClick));
  setTimeout(() => handlePillClick(), 100);

  // Horizontal Scroll
  const horizontalContainer = document.querySelector(".horizontal-container");
  const scroller = document.querySelector(".horizontal-scroller");
  const counter = document.getElementById("counter");

  if (horizontalContainer && scroller) {
    const totalWidth = scroller.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = totalWidth - viewportWidth;

    // Pehle container ko show karein
    gsap.set(horizontalContainer, { autoAlpha: 1 });

    gsap.to(scroller, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: horizontalContainer,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (counter) {
            let value = Math.floor(self.progress * 100);
            if (value < 1) value = 1;
            if (self.progress >= 0.999) value = 100;
            counter.textContent = value;
          }
        },
      },
    });
  }

  // Hero Animations
  function splitHeroHeadings() {
    const headings = document.querySelectorAll(".hero-heading");

    headings.forEach((heading) => {
      if (heading.dataset.split === "true") return;

      const text = heading.textContent.trim();
      heading.textContent = "";

      text.split("").forEach((letter) => {
        const span = document.createElement("span");
        span.textContent = letter === " " ? "\u00A0" : letter;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        heading.appendChild(span);
      });

      heading.dataset.split = "true";
    });
  }

  function animateHeroHeadings() {
    const headings = document.querySelectorAll(".hero-heading");
    if (headings.length === 0) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    // Sabhi headings ko ek saath show karein
    tl.set(headings, { autoAlpha: 1 }, 0);

    headings.forEach((heading) => {
      const letters = heading.querySelectorAll("span");

      // Letters animation
      tl.fromTo(
        letters,
        {
          y: 1000,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.5,
          stagger: 0.03,
        },
        0, // Sabhi ek saath start ho
      );
    });

    // Signature animation
    const svgPath = document.querySelector("#svgGroup path");
    if (svgPath) {
      tl.set(svgPath, { autoAlpha: 1 }, 0);

      tl.fromTo(
        svgPath,
        {
          strokeDasharray: 2000,
          strokeDashoffset: 2000,
          fill: "transparent",
          stroke: "#10b981",
          strokeWidth: 0.5,
          fillOpacity: 0,
        },
        {
          strokeDashoffset: 0,
          fill: "#10b981",
          fillOpacity: 1,
          duration: 4.5,
          ease: "power2.inOut",
        },
        0.5, // Thoda sa delay
      );
    }
  }

  // Foran animation start karein
  splitHeroHeadings();
  animateHeroHeadings();

  // Store functions for cleanup
  window.homeHandlers = {
    handlePillClick: handlePillClick,
  };

  console.log("✅ Home page initialized");
}

export function homeDestroy() {
  console.log("🧹 Home page cleanup");

  // Clean up event listeners
  const pills = document.querySelectorAll("#track3 .pill");
  pills.forEach((pill) => {
    pill.removeEventListener("click", window.homeHandlers?.handlePillClick);
  });

  // Kill GSAP animations
  gsap.killTweensOf(".hero-heading span");
  gsap.killTweensOf("#svgGroup path");
  gsap.killTweensOf(".horizontal-scroller");

  // Kill ScrollTriggers
  ScrollTrigger.getAll().forEach((st) => {
    if (st.trigger === document.querySelector(".horizontal-container")) {
      st.kill();
    }
  });

  // Reset counter
  const counter = document.getElementById("counter");
  if (counter) counter.textContent = "0";

  // Reset visibility
  const headings = document.querySelectorAll(".hero-heading");
  gsap.set(headings, { autoAlpha: 0 });

  const svgPath = document.querySelector("#svgGroup path");
  if (svgPath) {
    gsap.set(svgPath, { autoAlpha: 0 });
  }

  const horizontalContainer = document.querySelector(".horizontal-container");
  if (horizontalContainer) {
    gsap.set(horizontalContainer, { autoAlpha: 0 });
  }

  console.log("✅ Home page cleaned up");
}
