let sliderInstance = null;

class FinalSlider {
  constructor(el) {
    this.el = el;
    this.content = el.querySelector("#slider-content");
    this.images = el.querySelectorAll(".slider__images-item");
    this.texts = el.querySelectorAll(".slider__text-item");
    this.links = el.querySelectorAll(".side-link");

    this.nextBtn = el.querySelector("#nextBtn");
    this.prevBtn = el.querySelector("#prevBtn");
    this.rightArea = el.querySelector("#right-area");
    this.leftArea = el.querySelector("#left-area");

    this.current = 1;
    this.isMoving = false;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);

    this.init();
  }

  init() {
    // INITIAL LOAD: Pehli image ko background mein set karna
    const firstImg = this.images[0].querySelector("img");
    if (firstImg) {
      // Direct .src use karein (Absolute path)
      const initialPath = firstImg.src;
      this.el.style.setProperty("--img-prev", `url(${initialPath})`);
    }


    // Event Listeners
    if (this.nextBtn) this.nextBtn.addEventListener("click", this.next);
    if (this.prevBtn) this.prevBtn.addEventListener("click", this.prev);
    if (this.rightArea) this.rightArea.addEventListener("click", this.next);
    if (this.leftArea) this.leftArea.addEventListener("click", this.prev);

    this.links.forEach((l) => {
      l.addEventListener("click", () => this.goTo(parseInt(l.dataset.id)));
    });

    window.addEventListener("mousemove", this.handleMouseMove);
  }

  handleMouseMove(e) {
    if (!this.content || !this.el) return;
    const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

    gsap.to(this.content, {
      rotateY: x * 15,
      rotateX: y * -15,
      translateZ: "8vw",
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto",
    });
  }

  next() {
    this.goTo(this.current + 1);
  }
  prev() {
    this.goTo(this.current - 1);
  }

  goTo(id) {
    if (this.isMoving || !this.el) return;

    if (id > this.images.length) id = 1;
    if (id < 1) id = this.images.length;

    this.isMoving = true;

    const nextImg = this.images[id - 1].querySelector("img");
    if (!nextImg) return;

    const nextUrl = nextImg.src; // Full path

    // 1. Nayi image ko background variable mein dalein
    this.el.style.setProperty("--img-next", `url(${nextUrl})`);

    // 2. CSS class add karein (Taake opacity switch ho)
    this.el.classList.add("slider--bg-next");

    // UI Updates
    this.images.forEach((i) =>
      i.classList.remove("slider__images-item--active"),
    );
    this.texts.forEach((t) => t.classList.remove("slider__text-item--active"));
    this.links.forEach((l) => l.classList.remove("active"));

    this.timeout = setTimeout(() => {
      if (!this.el) return;

      this.images[id - 1].classList.add("slider__images-item--active");
      this.texts[id - 1].classList.add("slider__text-item--active");
      this.links[id - 1].classList.add("active");

      // 3. Purani image ko update karein aur class hatayein
      this.el.style.setProperty("--img-prev", `url(${nextUrl})`);
      this.el.classList.remove("slider--bg-next");

      this.current = id;
      this.isMoving = false;
    }, 600);
    
  }

  destroy() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    if (this.content) gsap.killTweensOf(this.content);
    clearTimeout(this.timeout);
    this.el = null;
  }
}

export function projectsInit() {
  const sliderEl = document.querySelector(
    '[data-barba-namespace="projects"] #slider',
  );
  if (!sliderEl) return;
  if (sliderInstance) sliderInstance.destroy();
  sliderInstance = new FinalSlider(sliderEl);
}

export function projectsDestroy() {
  if (sliderInstance) {
    sliderInstance.destroy();
    sliderInstance = null;
  }
}
