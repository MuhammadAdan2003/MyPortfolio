// testimonial.js
export function testimonialInit() {
  console.log("💬 Testimonial page initialization");

  const cards = document.querySelectorAll(".ultra-shiny-glass");

  if (cards.length > 0) {
    // Add click effect
    function handleCardClick() {
      const clickShine = document.createElement("div");
      clickShine.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
        z-index: 2;
        animation: fadeOut 0.8s ease forwards;
      `;

      this.appendChild(clickShine);

      setTimeout(() => {
        if (clickShine.parentNode === this) {
          clickShine.remove();
        }
      }, 800);
    }

    // Randomize shine speeds
    cards.forEach((card, index) => {
      const randomSpeed = 2 + Math.random() * 2;
      card.style.setProperty("--shine-speed", `${randomSpeed}s`);

      // Add click event
      card.addEventListener("click", handleCardClick);
    });

    // Add CSS for animation
    // if (!document.querySelector("#testimonial-styles")) {
    //   const style = document.createElement("style");
    //   style.id = "testimonial-styles";
    //   style.textContent = `
    //     @keyframes fadeOut {
    //       0% { opacity: 1; }
    //       100% { opacity: 0; }
    //     }
    //   `;
    //   document.head.appendChild(style);
    // }

    // Store for cleanup
    window.testimonialHandlers = {
      handleCardClick: handleCardClick,
    };
  }

  console.log("✅ Testimonial page initialized");
}

export function testimonialDestroy() {
  console.log("🧹 Testimonial page cleanup");

  // Clean up event listeners
  const cards = document.querySelectorAll(".ultra-shiny-glass");
  cards.forEach((card) => {
    card.removeEventListener(
      "click",
      window.testimonialHandlers?.handleCardClick,
    );
  });

  // Remove added styles
  const style = document.querySelector("#testimonial-styles");
  if (style) style.remove();

  console.log("✅ Testimonial page cleaned up");
}
