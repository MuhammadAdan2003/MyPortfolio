let lenis;

export function initLenis() {
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
}

export function destroyLenis() {
  if (lenis) lenis.destroy();
}
