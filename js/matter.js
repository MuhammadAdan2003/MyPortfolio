// matter.js - Complete optimized physics simulation
console.log("🔧 Matter.js simulation module loaded");

// Export Matter.js setup
export default function initMatterJS() {
  if (typeof Matter === "undefined") {
    console.error("❌ Matter.js library not found");
    return null;
  }

  console.log("🎯 Starting Matter.js physics simulation...");

  // Module aliases
  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    World = Matter.World,
    Events = Matter.Events;

  // Create engine
  const engine = Engine.create();
  engine.gravity.x = 0;
  engine.gravity.y = 0.2;

  // Get the canvas element and wrapper
  const canvas = document.getElementById("physics-canvas");
  const wrapper = document.getElementById("simulation-wrapper");

  if (!canvas || !wrapper) {
    console.error("❌ Canvas or wrapper not found");
    return null;
  }

  // Hide loading overlay
  const loadingOverlay = document.getElementById("matter-loading");
  if (loadingOverlay) {
    loadingOverlay.classList.add("fade-out");
  }

  console.log("✅ Canvas found, setting up renderer...");

  // Create renderer
  const render = Render.create({
    element: wrapper,
    engine: engine,
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
  const runner = Runner.create();

  // Arrays to track circles
  let circles = [];
  let bigCircle = null;
  let BIG_CIRCLE_RADIUS;

  // Text options for circles
  const circleTexts = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "GSAP",
    "PHP",
    "LARAVEL",
    "MySQL",
    "GIT",
    "TAILWIND",
    "BOOTSTRAP",
    "UI/UX",
    "APIs",
    "FIGMA",
    "NODE",
  ];

  // Calculate responsive BIG circle radius
  function calculateCircleRadius() {
    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;
    const screenWidth = window.innerWidth;

    // Responsive sizing based on device
    if (screenWidth < 640) {
      return Math.min(width, height) * 0.35;
    } else if (screenWidth < 1024) {
      return Math.min(width, height) * 0.38;
    } else {
      return Math.min(width, height) * 0.4;
    }
  }

  // Calculate responsive text size for circles
  function calculateCircleSize() {
    const screenWidth = window.innerWidth;

    if (screenWidth < 640) {
      return Math.min(28, BIG_CIRCLE_RADIUS / 5);
    } else if (screenWidth < 1024) {
      return Math.min(32, BIG_CIRCLE_RADIUS / 5);
    } else {
      return Math.min(45, BIG_CIRCLE_RADIUS / 6);
    }
  }

  // Function to create a small circle with text
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
    Composite.add(engine.world, circle);
    circles.push(circle);

    return circle;
  }

  // Function to create the big container circle
  function createBigCircle() {
    const canvasWidth = render.options.width;
    const canvasHeight = render.options.height;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // Recalculate radius
    BIG_CIRCLE_RADIUS = calculateCircleRadius();

    // Create invisible circle for boundary
    bigCircle = Bodies.circle(centerX, centerY, BIG_CIRCLE_RADIUS, {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: "transparent",
        strokeStyle: "transparent",
        lineWidth: 0,
      },
    });

    Composite.add(engine.world, bigCircle);
    createCircularBoundary(centerX, centerY, BIG_CIRCLE_RADIUS);

    return bigCircle;
  }

  // Create circular boundary using small wall segments
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

      Composite.add(engine.world, wall);
    }
  }

  // Create small circles inside the big circle
  function createSmallCircles() {
    // Remove existing circles
    circles.forEach((circle) => {
      Composite.remove(engine.world, circle);
    });
    circles = [];

    const centerX = render.options.width / 2;
    const centerY = render.options.height / 2;
    const screenWidth = window.innerWidth;

    // Adjust number of circles based on screen size
    let maxCircles = circleTexts.length;
    if (screenWidth < 640) {
      maxCircles = 8;
    } else if (screenWidth < 1024) {
      maxCircles = 12;
    } else {
      maxCircles = 15;
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
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.1,
      render: { visible: false },
    },
  });

  Composite.add(engine.world, mouseConstraint);
  render.mouse = mouse;

  // Track screen width for responsive calculations
  let screenWidth = window.innerWidth;

  // Handle hover effect
  function handleHoverEffect() {
    const mousePosition = mouse.position;

    circles.forEach((circle) => {
      const dx = mousePosition.x - circle.position.x;
      const dy = mousePosition.y - circle.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const hoverRadius = circle.circleRadius + (screenWidth < 640 ? 20 : 30);

      if (distance < hoverRadius) {
        const forceMagnitude = screenWidth < 640 ? 0.006 : 0.008;
        const force = {
          x: (circle.position.x - mousePosition.x) * forceMagnitude,
          y: (circle.position.y - mousePosition.y) * forceMagnitude,
        };
        Matter.Body.applyForce(circle, circle.position, force);
      }
    });
  }

  // Custom rendering for circles with text
  Events.on(render, "afterRender", function () {
    const context = render.context;
    const centerX = render.options.width / 2;
    const centerY = render.options.height / 2;

    // Draw big circle outline
    context.save();
    context.beginPath();
    context.arc(centerX, centerY, BIG_CIRCLE_RADIUS, 0, Math.PI * 2);
    context.strokeStyle = "rgba(0, 0, 0, 0.8)";
    context.lineWidth = screenWidth < 640 ? 3 : 4;
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
        screenWidth < 640 ? 10 : 12,
        radius / (screenWidth < 640 ? 2.0 : 1.8),
      );

      context.font = `600 ${fontSize}px 'Poppins', Arial, sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      const maxWidth = radius * (screenWidth < 640 ? 1.4 : 1.6);
      while (
        context.measureText(circle.text).width > maxWidth &&
        fontSize > (screenWidth < 640 ? 8 : 10)
      ) {
        fontSize -= 1;
        context.font = `600 ${fontSize}px 'Poppins', Arial, sans-serif`;
      }

      context.fillText(circle.text, 0, 0);
      context.restore();
    });

    handleHoverEffect();
  });

  // Handle window resize
  let resizeTimeout;
  function handleResize() {
    screenWidth = window.innerWidth;

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const wrapperWidth = wrapper.clientWidth;
      const wrapperHeight = wrapper.clientHeight;

      render.options.width = wrapperWidth;
      render.options.height = wrapperHeight;
      render.canvas.width = wrapperWidth;
      render.canvas.height = wrapperHeight;

      Composite.clear(engine.world);
      circles = [];
      bigCircle = null;

      createBigCircle();
      createSmallCircles();
      Composite.add(engine.world, mouseConstraint);

      console.log("🔄 Matter.js resized");
    }, 150);
  }

  // Initialize simulation
  function initSimulation() {
    screenWidth = window.innerWidth;
    createBigCircle();
    createSmallCircles();
    Runner.run(runner, engine);
    Render.run(render);

    console.log("✅ Matter.js simulation started");
  }

  // Start simulation
  function start() {
    handleResize();
    initSimulation();
  }

  // Stop simulation
  function stop() {
    if (runner) Runner.stop(runner);
    if (render) Render.stop(render);

    // Clear world
    Composite.clear(engine.world);
    circles = [];
    bigCircle = null;

    console.log("🛑 Matter.js simulation stopped");
  }

  // Prevent canvas from interfering with scrolling
  canvas.addEventListener("wheel", (e) => {
    e.stopPropagation();
  });

  // Handle orientation change
  window.addEventListener("orientationchange", () => {
    setTimeout(handleResize, 100);
  });

  // Add resize listener
  window.addEventListener("resize", handleResize);

  // Start the simulation
  start();

  console.log("🎉 Matter.js physics fully initialized");

  // Return control functions
  return {
    engine: engine,
    render: render,
    runner: runner,
    start: start,
    stop: stop,
    handleResize: handleResize,
  };
}
