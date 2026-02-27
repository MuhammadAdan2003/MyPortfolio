// testimonial.js

/**
 * Testimonial page initialization with GSAP & Split Text
 */
export function testimonialInit() {
  console.log("💬 Testimonial page initialization with Split Text");

  const heading = document.querySelector(".hero-title-testimonial"); // Apni heading ko ye class de dein
  const cards = document.querySelectorAll(".ultra-shiny-glass");
  const subHeading = document.querySelector(".hero-para-testimonial");

  if (!cards.length) return;

  // 1. SPLIT TEXT LOGIC (Custom implementation)
  if (heading) {
    const text = heading.textContent;
    heading.innerHTML = text
      .split("")
      .map(
        (char) =>
          `<span class="inline-block char-item">${char === " " ? "&nbsp;" : char}</span>`,
      )
      .join("");

    // Heading container ko overflow-hidden rakhen taaki letters niche se nikalte hue dikhen
    heading.style.overflow = "hidden";
  }

  // 2. GSAP TIMELINE
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

  // Entrance Animation Sequence
  tl.set(".char-item", { y: "110%", rotate: 10 }) // Initial state
    .set([heading, subHeading], { opacity: 1 }) // Flash prevent karne ke liye
    .to(".char-item", {
      y: "0%",
      rotate: 0,
      duration: 1.2,
      stagger: 0.03,
      ease: "expo.out",
    })
    .fromTo(
      subHeading,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.8",
    )
    .fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.1,
        clearProps: "all",
      },
      "-=0.6",
    );

  // 3. CLICK EFFECT HANDLER
  function handleCardClick(e) {
    const card = e.currentTarget;
    const clickShine = document.createElement("div");
    clickShine.className =
      "absolute inset-0 z-20 pointer-events-none rounded-2xl opacity-100";
    clickShine.style.background =
      "radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, transparent 70%)";
    card.appendChild(clickShine);

    gsap.to(card, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
    gsap.to(clickShine, {
      opacity: 0,
      scale: 1.8,
      duration: 0.7,
      onComplete: () => clickShine.remove(),
    });
  }

  // Event Listeners
  cards.forEach((card) => card.addEventListener("click", handleCardClick));

  window.testimonialHandlers = { handleCardClick };
}

export function testimonialDestroy() {
  const cards = document.querySelectorAll(".ultra-shiny-glass");
  if (window.testimonialHandlers?.handleCardClick) {
    cards.forEach((card) =>
      card.removeEventListener(
        "click",
        window.testimonialHandlers.handleCardClick,
      ),
    );
  }
  gsap.killTweensOf(".char-item, .ultra-shiny-glass");
  delete window.testimonialHandlers;
}
