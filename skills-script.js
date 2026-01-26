// Skills Page JavaScript (Matter.js Simulation)
let matterEngine, matterRender, matterRunner;
let circles = [];
let bigCircle = null;
let BIG_CIRCLE_RADIUS;

// Text options for circles
const circleTexts = [
  "HTML",
  "CSS",
  "JavaScript",
  "JQuery",
  "React",
  "GSAP",
  "MYSQL",
  "PHP",
  "LARAVEL",
  "GIT",
  "TAILWIND",
  "BOOTSTRAP",
  "UI/UX",
  "APIs",
  "Third Party API",
  "Animations",
];

// Initialize Skills Page
function initSkillsPage() {
  console.log("Initializing Skills Page");

  // Initialize Lenis
  window.initLenis();

  // Initialize Matter.js simulation
  initMatterSimulation();

  // Refresh GSAP ScrollTrigger
  if (ScrollTrigger) {
    ScrollTrigger.refresh();
  }
}

// Initialize Matter.js Simulation
function initMatterSimulation() {
  // Clean up existing simulation
  cleanupMatterSimulation();

  // Module aliases
  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

  // Create engine
  matterEngine = Engine.create();
  matterEngine.gravity.x = 0;
  matterEngine.gravity.y = 0.2;

  // Get the canvas element and wrapper
  const canvas = document.getElementById("physics-canvas");
  const wrapper = document.getElementById("simulation-wrapper");

  // Only proceed if elements exist
  if (!canvas || !wrapper) {
    console.error("Canvas or wrapper not found");
    return;
  }

  // Clear existing context
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Create renderer
  matterRender = Render.create({
    element: wrapper,
    engine: matterEngine,
    canvas: canvas,
    options: {
      width: wrapper.clientWidth,
      height: wrapper.clientHeight,
      wireframes: false,
      background: "#ffffff",
      showVelocity: false,
    },
  });

  // Create runner
  matterRunner = Runner.create();

  // Calculate responsive BIG circle radius
  function calculateCircleRadius() {
    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;
    const screenWidth = window.innerWidth;

    if (screenWidth < 640) {
      return Math.min(width, height) * 0.4;
    } else if (screenWidth < 1024) {
      return Math.min(width, height) * 0.4;
    } else {
      return Math.min(width, height) * 0.4;
    }
  }

  // Calculate responsive text size
  function calculateCircleSize() {
    const screenWidth = window.innerWidth;

    if (screenWidth < 640) {
      return Math.min(30, BIG_CIRCLE_RADIUS / 5);
    } else if (screenWidth < 1024) {
      return Math.min(35, BIG_CIRCLE_RADIUS / 5);
    } else {
      return Math.min(55, BIG_CIRCLE_RADIUS / 6);
    }
  }

  // Function to create a small circle
  function createSmallCircle(x, y, text) {
    const radius = calculateCircleSize();
    const circle = Bodies.circle(x, y, radius, {
      restitution: 0.7,
      friction: 0.05,
      frictionAir: 0.02,
      density: 0.002,
      render: {
        fillStyle: "#000000",
        lineWidth: 0,
        strokeStyle: "transparent",
      },
    });

    circle.text = text;
    Composite.add(matterEngine.world, circle);
    circles.push(circle);

    return circle;
  }

  // Create big container circle
  function createBigCircle() {
    const canvasWidth = matterRender.options.width;
    const canvasHeight = matterRender.options.height;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    BIG_CIRCLE_RADIUS = calculateCircleRadius();

    bigCircle = Bodies.circle(centerX, centerY, BIG_CIRCLE_RADIUS, {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: "transparent",
        strokeStyle: "transparent",
        lineWidth: 0,
      },
    });

    Composite.add(matterEngine.world, bigCircle);
    createCircularBoundary(centerX, centerY, BIG_CIRCLE_RADIUS);

    return bigCircle;
  }

  // Create circular boundary
  function createCircularBoundary(centerX, centerY, radius) {
    const screenWidth = window.innerWidth;
    const segments = screenWidth < 640 ? 36 : 48;
    const angleStep = (Math.PI * 2) / segments;

    for (let i = 0; i < segments; i++) {
      const angle = i * angleStep;
      const nextAngle = (i + 1) * angleStep;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(nextAngle) * radius;
      const y2 = centerY + Math.sin(nextAngle) * radius;

      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const wallX = (x1 + x2) / 2;
      const wallY = (y1 + y2) / 2;
      const wallAngle = Math.atan2(dy, dx);

      const wallThickness = screenWidth < 640 ? 8 : 12;

      const wall = Bodies.rectangle(wallX, wallY, length, wallThickness, {
        isStatic: true,
        angle: wallAngle,
        render: {
          fillStyle: "transparent",
          strokeStyle: "transparent",
          lineWidth: 0,
        },
      });

      Composite.add(matterEngine.world, wall);
    }
  }

  // Create small circles
  function createSmallCircles() {
    circles.forEach((circle) => {
      Composite.remove(matterEngine.world, circle);
    });
    circles = [];

    const centerX = matterRender.options.width / 2;
    const centerY = matterRender.options.height / 2;
    const screenWidth = window.innerWidth;

    let maxCircles = circleTexts.length;
    if (screenWidth < 640) {
      maxCircles = 10;
    } else if (screenWidth < 1024) {
      maxCircles = 14;
    }

    for (let i = 0; i < Math.min(maxCircles, circleTexts.length); i++) {
      let x, y, distance;
      let attempts = 0;
      const minDistance = calculateCircleSize() + (screenWidth < 640 ? 15 : 20);

      do {
        x =
          centerX +
          (Math.random() - 0.5) * (BIG_CIRCLE_RADIUS - minDistance) * 1.8;
        y =
          centerY +
          (Math.random() - 0.5) * (BIG_CIRCLE_RADIUS - minDistance) * 1.8;
        distance = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2),
        );
        attempts++;
      } while (distance > BIG_CIRCLE_RADIUS - minDistance && attempts < 100);

      createSmallCircle(x, y, circleTexts[i]);
    }
  }

  // Add mouse control
  const mouse = Mouse.create(matterRender.canvas);
  const mouseConstraint = MouseConstraint.create(matterEngine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.1,
      render: { visible: false },
    },
  });

  Composite.add(matterEngine.world, mouseConstraint);
  matterRender.mouse = mouse;

  // Custom rendering
  Matter.Events.on(matterRender, "afterRender", function () {
    const context = matterRender.context;
    const centerX = matterRender.options.width / 2;
    const centerY = matterRender.options.height / 2;

    // Draw big circle outline
    context.save();
    context.beginPath();
    context.arc(centerX, centerY, BIG_CIRCLE_RADIUS, 0, Math.PI * 2);
    context.strokeStyle = "rgba(0, 0, 0, 0.8)";
    context.lineWidth = window.innerWidth < 640 ? 4 : 6;
    context.stroke();
    context.restore();

    // Draw each small circle with text
    circles.forEach((circle) => {
      const position = circle.position;
      const radius = circle.circleRadius;

      context.save();
      context.translate(position.x, position.y);

      // Draw circle
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.fillStyle = "#000000";
      context.fill();

      // Draw text
      context.fillStyle = "#FFFFFF";
      let fontSize = Math.max(
        window.innerWidth < 640 ? 10 : 12,
        radius / (window.innerWidth < 640 ? 2.0 : 1.8),
      );

      context.font = `600 ${fontSize}px 'gilroy', Arial, sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      const maxWidth = radius * (window.innerWidth < 640 ? 1.4 : 1.6);
      while (
        context.measureText(circle.text).width > maxWidth &&
        fontSize > (window.innerWidth < 640 ? 8 : 10)
      ) {
        fontSize -= 1;
        context.font = `600 ${fontSize}px 'gilroy', Arial, sans-serif`;
      }

      context.fillText(circle.text, 0, 0);
      context.restore();
    });

    // Handle hover effect
    handleHoverEffect();
  });

  // Handle hover effect
  function handleHoverEffect() {
    const mousePosition = mouse.position;

    circles.forEach((circle) => {
      const dx = mousePosition.x - circle.position.x;
      const dy = mousePosition.y - circle.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const hoverRadius =
        circle.circleRadius + (window.innerWidth < 640 ? 20 : 30);

      if (distance < hoverRadius) {
        const forceMagnitude = window.innerWidth < 640 ? 0.006 : 0.008;
        const force = {
          x: (circle.position.x - mousePosition.x) * forceMagnitude,
          y: (circle.position.y - mousePosition.y) * forceMagnitude,
        };
        Matter.Body.applyForce(circle, circle.position, force);
      }
    });
  }

  // Handle window resize
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const wrapperWidth = wrapper.clientWidth;
      const wrapperHeight = wrapper.clientHeight;

      matterRender.options.width = wrapperWidth;
      matterRender.options.height = wrapperHeight;
      matterRender.canvas.width = wrapperWidth;
      matterRender.canvas.height = wrapperHeight;

      Composite.clear(matterEngine.world);
      circles = [];
      bigCircle = null;

      createBigCircle();
      createSmallCircles();
      Composite.add(matterEngine.world, mouseConstraint);
    }, 100);
  }

  // Initialize simulation
  function init() {
    createBigCircle();
    createSmallCircles();
    Runner.run(matterRunner, matterEngine);
    Render.run(matterRender);
  }

  // Start simulation
  window.addEventListener("load", () => {
    handleResize();
    init();
  });

  window.addEventListener("resize", handleResize);

  // Prevent canvas from interfering with scrolling
  canvas.addEventListener("wheel", (e) => {
    e.stopPropagation();
  });

  window.addEventListener("orientationchange", () => {
    setTimeout(handleResize, 100);
  });

  // Initialize now
  handleResize();
  init();
}

// Clean up Matter.js simulation
function cleanupMatterSimulation() {
  if (matterRunner) {
    Runner.stop(matterRunner);
  }
  if (matterRender) {
    Render.stop(matterRender);
    if (matterRender.canvas && matterRender.canvas.parentNode) {
      matterRender.canvas.parentNode.removeChild(matterRender.canvas);
    }
  }
  if (matterEngine) {
    Engine.clear(matterEngine);
  }
  circles = [];
  bigCircle = null;
}

// Handle page cleanup
function cleanupSkillsPage() {
  cleanupMatterSimulation();
  if (window.lenis) {
    window.lenis.destroy();
  }
}

// Export for global use
window.initSkillsPage = initSkillsPage;
window.cleanupSkillsPage = cleanupSkillsPage;
window.initMatterSimulation = initMatterSimulation;


console.log("skills page pr aya h ");
