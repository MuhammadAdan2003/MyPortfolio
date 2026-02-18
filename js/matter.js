export default function initMatterJS() {
  if (typeof Matter === "undefined") return null;

  const {
    Engine,
    Render,
    Runner,
    Bodies,
    Composite,
    Mouse,
    MouseConstraint,
    Events,
    Body,
  } = Matter;

  const engine = Engine.create();
  const canvas = document.getElementById("physics-canvas");
  const wrapper = document.getElementById("simulation-wrapper");

  if (!canvas || !wrapper) return null;

  // 1. SETTINGS & RESPONSIVE
  let width = window.innerWidth;
  let height = window.innerHeight;
  let isMobile = width < 768;

  const render = Render.create({
    element: wrapper,
    engine: engine,
    canvas: canvas,
    options: {
      width: width,
      height: height,
      wireframes: false,
      background: "transparent",
      pixelRatio: window.devicePixelRatio || 1,
    },
  });

  const runner = Runner.create();
  let physicsElements = [];

  // 2. DATA (Sari Images Wahi Hain)
  const skillNames = [
    "HTML5",
    "CSS3",
    "JavaScript",
    "React JS",
    "GSAP",
    "Tailwind",
    "PHP",
    "Laravel",
    "MySQL",
    "Git",
    "Node.js",
  ];

  const skillLogos = [
    { id: "html", img: "images/logos/html.png" },
    { id: "css", img: "images/logos/css.png" },
    { id: "bootstrap", img: "images/logos/bootstrap.png" },
    { id: "js", img: "images/logos/js.png" },
    { id: "react", img: "images/logos/react.png" },
    { id: "php", img: "images/logos/php.png" },
    { id: "git", img: "images/logos/git.png" },
    { id: "laravel", img: "images/logos/laravel.svg" },
    { id: "mysql", img: "images/logos/mysql.png" },
    { id: "tailwind", img: "images/logos/tailwind.svg" },
    { id: "uiux", img: "images/logos/design.png" },
    { id: "gsap", img: "images/logos/gsap.png" },
    { id: "jquery", img: "images/logos/jquery.svg" },
  ];

  const loadedLogos = {};
  skillLogos.forEach((logo) => {
    const img = new Image();
    img.src = logo.img;
    loadedLogos[logo.id] = img;
  });

  // 3. BOUNDARIES (Walls)
  let ground, leftWall, rightWall;
  function createBoundaries() {
    if (ground) Composite.remove(engine.world, [ground, leftWall, rightWall]);
    const wallThickness = 100;
    ground = Bodies.rectangle(width / 2, height + 45, width, wallThickness, {
      isStatic: true,
    });
    leftWall = Bodies.rectangle(-50, height / 2, wallThickness, height * 2, {
      isStatic: true,
    });
    rightWall = Bodies.rectangle(
      width + 50,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true },
    );
    Composite.add(engine.world, [ground, leftWall, rightWall]);
  }

  // 4. CREATE ELEMENTS (Responsive Sizes)
  function spawnElements() {
    const pW = isMobile ? 110 : 180;
    const pH = isMobile ? 45 : 80;
    const lR = isMobile ? 25 : 45;

    skillNames.forEach((text) => {
      const pill = Bodies.rectangle(Math.random() * width, -500, pW, pH, {
        chamfer: { radius: pH / 2 },
        restitution: 0.4,
        render: { fillStyle: "#000000" },
      });
      pill.dataType = "text";
      pill.val = text;
      physicsElements.push(pill);
    });

    skillLogos.forEach((logo) => {
      const circle = Bodies.circle(Math.random() * width, -800, lR, {
        restitution: 0.5,
        render: { fillStyle: "#FFFFFF", strokeStyle: "#000000", lineWidth: 2 },
      });
      circle.dataType = "logo";
      circle.logoId = logo.id;
      circle.r = lR;
      physicsElements.push(circle);
    });
    Composite.add(engine.world, physicsElements);
  }

  // 5. SPLIT TEXT ANIMATION
  function animateHeading() {
    const titles = document.querySelectorAll(".hero-title");
    titles.forEach((title) => {
      const text = title.innerText;
      title.innerHTML = text
        .split("")
        .map(
          (char) =>
            `<span class="char" style="display:inline-block">${char === " " ? "&nbsp;" : char}</span>`,
        )
        .join("");
    });

    gsap
      .timeline()
      .from(".char", {
        y: 150,
        rotate: 15,
        stagger: 0.04,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.3,
      })
      .from(".hero-para", { opacity: 0, y: 20, duration: 0.8 }, "-=0.8");
  }

  // 6. RENDER CUSTOM CONTENT
  Events.on(render, "afterRender", () => {
    const ctx = render.context;
    const pW = isMobile ? 110 : 180;
    const pH = isMobile ? 45 : 80;

    physicsElements.forEach((el) => {
      const { x, y } = el.position;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(el.angle);

      if (el.dataType === "text") {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = `600 ${isMobile ? "14px" : "22px"} Poppins, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(el.val, 0, 0);
      } else {
        const img = loadedLogos[el.logoId];
        if (img && img.complete) {
          ctx.drawImage(img, -el.r * 0.7, -el.r * 0.7, el.r * 1.4, el.r * 1.4);
        }
      }
      ctx.restore();
      if (y > height + 200) Body.setPosition(el, { x: width / 2, y: -100 });
    });
  });

  // Init
  createBoundaries();
  spawnElements();
  animateHeading();
  Runner.run(runner, engine);
  Render.run(render);

  const mouse = Mouse.create(render.canvas);
  Composite.add(
    engine.world,
    MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    }),
  );

  // Resize Fix
  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    render.canvas.width = width;
    render.canvas.height = height;
    createBoundaries();
  });

  return {
    stop: () => {
      Runner.stop(runner);
      Render.stop(render);
    },
  };
}
