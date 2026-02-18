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

  // 1. SETTINGS
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;
  const isMobile = window.innerWidth < 768;

  // Real gravity (niche ki taraf)
  engine.gravity.y = 1;

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
  let boxes = [];

  const skillTexts = [
    "HTML",
    "CSS",
    "Bootstrap",
    "JavaScript",
    "JQuery",
    "React",
    "GSAP",
    "PHP",
    "Laravel",
    "MySQL",
    "Tailwind",
    "UI/UX",
    "Git",
    "MatterJs",
    "BarbaJs"

  ];

  // 2. CREATE BOUNDARIES (Bottom, Left, Right)
  const wallThickness = 100;
  const ground = Bodies.rectangle(
    width / 2,
    height + wallThickness / 2 - 5,
    width,
    wallThickness,
    {
      isStatic: true,
      render: { visible: false },
    },
  );
  const leftWall = Bodies.rectangle(
    -wallThickness / 2,
    height / 2,
    wallThickness,
    height * 2,
    {
      isStatic: true,
      render: { visible: false },
    },
  );
  const rightWall = Bodies.rectangle(
    width + wallThickness / 2,
    height / 2,
    wallThickness,
    height * 2,
    {
      isStatic: true,
      render: { visible: false },
    },
  );

  Composite.add(engine.world, [ground, leftWall, rightWall]);

  // 3. CREATE PILL SHAPES
  function createSkillBox(text) {
    const fontSize = isMobile ? 14 : 18;
    const padding = isMobile ? 25 : 200;

    // Calculate width based on text length
    const textWidth = text.length * (isMobile ? 8 : 5) + padding;
    const boxHeight = isMobile ? 35 : 100;
    const radius = 15; // For chamfer (rounded corners)

    const x = Math.random() * (width - 100) + 50;
    const y = Math.random() * -500; // Start above the screen

    const box = Bodies.rectangle(x, y, textWidth, boxHeight, {
      chamfer: { radius: boxHeight / 2 }, // Perfect pill shape
      restitution: 0.4,
      friction: 0.5,
      render: { fillStyle: "#000000" },
    });

    box.text = text;
    box.w = textWidth;
    box.h = boxHeight;

    boxes.push(box);
    Composite.add(engine.world, box);
  }

  // 4. RENDERING TEXT & RECOVERY
  Events.on(render, "afterRender", () => {
    const ctx = render.context;

    boxes.forEach((box) => {
      const { x, y } = box.position;
      const angle = box.angle;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Draw Text
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `600 ${isMobile ? "12px" : "20px"} Poppins`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(box.text, 0, 0);

      ctx.restore();

      // Anti-escape: Agar koi box ghalti se gir jaye nichy
      if (y > height + 200) {
        Body.setPosition(box, { x: width / 2, y: -100 });
      }
    });
  });

  // 5. MOUSE INTERACTION
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: { stiffness: 0.1, render: { visible: false } },
  });

  Composite.add(engine.world, mouseConstraint);

  // Start logic
  skillTexts.forEach((txt) => createSkillBox(txt));
  Runner.run(runner, engine);
  Render.run(render);

  // Resize fix
  window.addEventListener("resize", () => {
    // Optional: reload for perfect responsive or update boundaries
  });

  return {
    stop: () => {
      Runner.stop(runner);
      Render.stop(render);
      Composite.clear(engine.world);
    },
  };
}
