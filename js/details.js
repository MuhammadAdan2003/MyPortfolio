export function detailPageInit(){
    console.log('chala h ');
    
    gsap.registerPlugin(ScrollTrigger);

      // Page Load Animation
      window.addEventListener("load", () => {
        gsap.to(".animated-line", {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      // Scroll Progress
      gsap.to("#progress", {
        width: "100%",
        ease: "none",
        scrollTrigger: { scrub: 0.3 },
      });

      // Image Reveal
      const images = gsap.utils.toArray(".animate-img");
      images.forEach((imgBox) => {
        const img = imgBox.querySelector("img");

        gsap.fromTo(
          img,
          { scale: 1.15 },
          {
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: imgBox,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
        gsap.fromTo(
          imgBox,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: imgBox,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
}