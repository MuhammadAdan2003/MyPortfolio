barba.init({
  sync: true,
  transitions: [
    {
      name: "fade",
      async leave(data) {
        if (currentPage === "home") homeDestroy();
        destroyLenis();

        await gsap.to(data.current.container, { opacity: 0, duration: 0.5 });
      },
      async enter(data) {
        currentPage = detectPage();

        if (currentPage === "home") homeInit();
        initLenis();

        await gsap.fromTo(data.next.container, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      },
      async once(data) {
        currentPage = detectPage();
        if (currentPage === "home") homeInit();
        initLenis();
      },
    },
  ],
});