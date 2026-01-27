// ============ BARBA JS ================ //
// Barba.js Initialization
// barba.init({
//   transitions: [
//     {
//       name: "smooth-slide-top-transition",

//       async leave(data) {
//         // Create sliding overlay
//         const overlay = document.createElement("div");
//         overlay.className = "transition-overlay";
//         overlay.style.cssText = `
//           position: fixed;
//           top: -100%;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: #000;
//           z-index: 9999;
//           transform-origin: top center;
//         `;
//         document.body.appendChild(overlay);

//         // Slide down to cover page
//         await gsap.to(overlay, {
//           top: "0%",
//           duration: 0.7,
//           ease: "power3.in",
//         });

//         // Immediately start collapsing
//         await gsap.to(overlay, {
//           height: "0%",
//           duration: 0.7,
//           ease: "power3.out",
//         });

//         // Remove old page
//         data.current.container.remove();

//         return overlay;
//       },

//       async enter(data) {
//         // Remove overlay
//         const overlay = document.querySelector(".transition-overlay");
//         if (overlay) {
//           overlay.remove();
//         }

//         // Animate new page in
//         data.next.container.style.opacity = "0";
//         data.next.container.style.transform = "translateY(20px)";
        
//         await gsap.to(data.next.container, {
//           opacity: 1,
//           y: 0,
//           duration: 1.0,
//           ease: "power3.out",
//         });
//       },

//       sync: false,
//     },
//   ],
// });

barba.init({
  transitions: [
    {
      name: "dual-overlay-transition",

      async leave(data) {
        // Create BLACK full-screen overlay
        const blackOverlay = document.createElement("div");
        blackOverlay.className = "black-transition-overlay";
        blackOverlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 0; /* Start with 0 height */
          background: #000; /* Black color */
          z-index: 9998; /* One layer below green */
          overflow: hidden;
        `;
        document.body.appendChild(blackOverlay);

        // Create GREEN 30vh overlay
        const greenOverlay = document.createElement("div");
        greenOverlay.className = "green-transition-overlay";
        greenOverlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 0; /* Start with 0 height */
          background: #10b981; /* Emerald green color */
          z-index: 9999; /* On top of black overlay */
          overflow: hidden;
        `;
        document.body.appendChild(greenOverlay);

        // ANIMATE BOTH OVERLAYS SIMULTANEOUSLY
        // Black expands to full screen
        const blackAnimation = gsap.to(blackOverlay, {
          height: "100vh",
          duration: 0.5,
          ease: "power2.out",
        });

        // Green expands to 30vh
        const greenAnimation = gsap.to(greenOverlay, {
          height: "30vh",
          duration: 0.5,
          ease: "power2.out",
        });

        // Wait for both to complete
        await Promise.all([blackAnimation, greenAnimation]);

        // Remove old page (now covered by overlays)
        data.current.container.remove();

        // SLIDE BOTH OVERLAYS DOWN TOGETHER
        const slideBlack = gsap.to(blackOverlay, {
          top: "100%",
          duration: 1,
          ease: "power2.in",
        });

        const slideGreen = gsap.to(greenOverlay, {
          top: "100%",
          duration: 1,
          ease: "power2.in",
        });

        await Promise.all([slideBlack, slideGreen]);

        return { blackOverlay, greenOverlay };
      },

      async enter(data) {
        // Remove both overlays
        const blackOverlay = document.querySelector(".black-transition-overlay");
        const greenOverlay = document.querySelector(".green-transition-overlay");
        
        if (blackOverlay) blackOverlay.remove();
        if (greenOverlay) greenOverlay.remove();

        // Show new page
        data.next.container.style.opacity = "0";
        await gsap.to(data.next.container, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      },

      sync: false,
    },
  ],
});
// After every page change
// barba.hooks.after(() => {
//   updateActiveNav();
// });

/*********************************
 * REGISTER GSAP
 *********************************/
gsap.registerPlugin(ScrollTrigger);

/*********************************
 * LENIS SETUP
 *********************************/
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    smooth: true,
    smoothTouch: false, // mobile ke liye best
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

/*********************************
 * PILLS (ABOUT SECTION)
 *********************************/
const track3 = document.querySelector("#track3");
const pills = document.querySelectorAll("#track3 .pill");

function handlePillClick(e) {
  const oldActive = document.querySelector("#track3 .pill.active");

  if (e) {
    oldActive.classList.remove("active");
    e.target.classList.add("active");

    const tabId = e.target.id === "all-tab" ? "all-content" : "casual-content";

    document.querySelectorAll(".tab-pane").forEach((tab) => {
      tab.classList.remove("active");
    });
    document.getElementById(tabId).classList.add("active");
  }

  const activePill = document.querySelector("#track3 .pill.active");
  const trackRect = track3.getBoundingClientRect();
  const activeRect = activePill.getBoundingClientRect();

  document.documentElement.style.setProperty(
    "--pill-left",
    activeRect.left - trackRect.left + "px"
  );
  document.documentElement.style.setProperty(
    "--pill-right",
    trackRect.right - activeRect.right + "px"
  );
}

pills.forEach((pill) => pill.addEventListener("click", handlePillClick));

/*********************************
 * HORIZONTAL SCROLL + 1–100 COUNTER
 *********************************/
const horizontalContainer = document.querySelector(".horizontal-container");
const scroller = document.querySelector(".horizontal-scroller");
const counter = document.getElementById("counter");

function initHorizontalScroll() {
  const totalWidth = scroller.scrollWidth;
  const viewportWidth = window.innerWidth;
  const scrollDistance = totalWidth - viewportWidth;

  // let timeLine = gsap.timeLine()

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

      // 🔥 CONTINUOUS 1 → 100
      onUpdate: (self) => {
        let value = Math.floor(self.progress * 100);

        // clamp values
        if (value < 1) value = 1;
        if (self.progress >= 0.999) value = 100;

        counter.textContent = value;
      },

      // 🔥 mobile premium snapping
      // snap: {
      //   snapTo:
      //     1 /
      //     (document.querySelectorAlls =
      //       document.querySelectorAll(".horizontal-section").length - 1),
      //   duration: 0.4,
      //   ease: "power2.out",
      // },
    },
  });
}

// Complete signature animation with stroke and fill drawing 
gsap.fromTo("#svgGroup path", 
    {
        // Initial state - invisible
        strokeDasharray: 2000,
        strokeDashoffset: 2000,
        fill: "transparent",
        stroke: "#10b981",
        strokeWidth: 0.5
    },
    {
        // Animate both stroke and fill together
        strokeDashoffset: 0,
        fill: "#10b981",
        duration: 6,
        ease: "power2.inOut",
        
        // On each update, make sure fill follows stroke
        onUpdate: function() {
            // Get current progress (0 to 1)
            const progress = this.progress();
            
            // Calculate fill opacity based on stroke progress
            const fillOpacity = Math.min(progress * 1.5, 1);
            
            // Update fill with partial opacity as stroke draws
            gsap.set("#svgGroup path", {
                fillOpacity: fillOpacity
            });
        },
        
        onComplete: function() {
            // Ensure final state is solid fill
            gsap.set("#svgGroup path", {
                fillOpacity: 1,
                fill: "#10b981"
            });
        }
    }
);

//   gsap.to(".progress-counter" , {
//     opacity : 1,
//     duration: 0.5 ,
//      scrollTrigger: {
//         trigger: horizontalContainer,
//         start: "top top",}
//   })

/*********************************
 * INIT
 *********************************/
window.addEventListener("DOMContentLoaded", () => {
  handlePillClick();
  initLenis();
  initHorizontalScroll();
});

// =============================
//  * RESIZE FIX
//  *********************************
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});

/*********************************
 * CLEANUP
 *********************************/
window.addEventListener("beforeunload", () => {
  if (lenis) lenis.destroy();
});

//   ================== cards design js =================== //

console.log('Home page prr aya h');
