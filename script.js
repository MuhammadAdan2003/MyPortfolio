
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

          const tabId =
            e.target.id === "all-tab" ? "all-content" : "casual-content";

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
      const horizontalContainer = document.querySelector(
        ".horizontal-container"
      );
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
            snap: {
              snapTo:
                1 /
                (document.querySelectorAlls =
                  document.querySelectorAll(".horizontal-section").length - 1),
              duration: 0.4,
              ease: "power2.out",
            },
          },
        });
      }

      gsap.to(".progress-counter" , {
        opacity : 1,
        duration: 0.5 , 
         scrollTrigger: {
            trigger: horizontalContainer,
            start: "top top",}
      })
      


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

        