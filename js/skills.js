// skills.js - Optimized skills page logic
let matterInstance = null;

export function skillsInit() {
  console.log("🎯 Skills page initialization started");
  
  // 1. Setup eye tracking immediately
  setupEyeTracking();
  
  // 2. Setup Matter.js with loading indicator
  setupMatterJSWithLoading();
  
  console.log("✅ Skills page initialized");
}

function setupEyeTracking() {
  const eyesSVG = document.querySelector("#eyes");
  if (!eyesSVG) {
    console.warn('👀 Eyes SVG not found');
    return;
  }
  
  console.log('👀 Setting up eye tracking');
  
  const eyes = [
    {
      eye: eyesSVG.querySelector("#eye-left"),
      pupil: eyesSVG.querySelector("#pupil-left"),
      offsetX: 0,
    },
    {
      eye: eyesSVG.querySelector("#eye-right"),
      pupil: eyesSVG.querySelector("#pupil-right"),
      offsetX: 0,
    },
  ];
  
  // Check if all eye elements exist
  if (!eyes[0].eye || !eyes[0].pupil || !eyes[1].eye || !eyes[1].pupil) {
    console.warn('⚠️ Some eye elements not found');
    return;
  }
  
  function updateEye(ev, { eye, pupil, offsetX }) {
    if (!eye || !pupil) return;
    
    const eyeRect = eye.getBoundingClientRect();
    const centerX = eyeRect.left + eyeRect.width / 2;
    const centerY = eyeRect.top + eyeRect.height / 2;
    
    const distX = ev.clientX - centerX;
    const distY = ev.clientY - centerY;
    
    const pupilRect = pupil.getBoundingClientRect();
    const maxDistX = pupilRect.width / 2;
    const maxDistY = pupilRect.height / 2;
    
    const angle = Math.atan2(distY, distX);
    
    const newPupilX = offsetX + Math.min(maxDistX, Math.max(-maxDistX, Math.cos(angle) * maxDistX));
    const newPupilY = Math.min(maxDistY, Math.max(-maxDistY, Math.sin(angle) * maxDistY));
    
    const svgCTM = eyesSVG.getScreenCTM();
    if (!svgCTM) return;
    
    const scaledPupilX = newPupilX / svgCTM.a;
    const scaledPupilY = newPupilY / svgCTM.d;
    
    pupil.setAttribute("transform", `translate(${scaledPupilX}, ${scaledPupilY})`);
  }
  
  function calcOffset() {
    for (const props of eyes) {
      if (!props.pupil || !props.eye) continue;
      
      props.pupil.removeAttribute("transform");
      const eyeRect = props.eye.getBoundingClientRect();
      const pupilRect = props.pupil.getBoundingClientRect();
      props.offsetX = (eyeRect.right - pupilRect.right - (pupilRect.left - eyeRect.left)) / 2;
    }
  }
  
  calcOffset();
  
  let frame = 0;
  const mouseMoveHandler = (ev) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      for (const eye of eyes) {
        updateEye(ev, eye);
      }
    });
  };
  
  // Add event listeners
  window.addEventListener("resize", calcOffset);
  window.addEventListener("mousemove", mouseMoveHandler);
  
  // Store for cleanup
  window.skillsHandlers = {
    calcOffset,
    mouseMoveHandler
  };
  
  console.log('✅ Eye tracking initialized');
}

function setupMatterJSWithLoading() {
  const canvas = document.getElementById("physics-canvas");
  if (!canvas) {
    console.warn('🎯 Physics canvas not found');
    hideLoadingOverlay();
    return;
  }
  
  // Show loading initially
  showLoadingOverlay();
  
  // Check if Matter.js is loaded
  if (typeof Matter === 'undefined') {
    console.warn('⚠️ Matter.js not loaded, loading dynamically...');
    
    // Show loading message update
    updateLoadingMessage('Loading Matter.js library...');
    
    // Try to load Matter.js dynamically
    loadMatterJSDynamically().then(success => {
      if (success) {
        updateLoadingMessage('Initializing physics simulation...');
        initializeMatterJS();
      } else {
        hideLoadingOverlay();
        console.error('❌ Failed to load Matter.js');
      }
    });
  } else {
    updateLoadingMessage('Initializing physics simulation...');
    setTimeout(() => {
      initializeMatterJS();
    }, 500);
  }
}

function loadMatterJSDynamically() {
  return new Promise((resolve) => {
    if (typeof Matter !== 'undefined') {
      resolve(true);
      return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
    script.async = true;
    
    script.onload = () => {
      console.log('📦 Matter.js loaded dynamically');
      resolve(true);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Matter.js dynamically');
      resolve(false);
    };
    
    document.head.appendChild(script);
  });
}

function initializeMatterJS() {
  try {
    import('./matter.js').then(module => {
      if (module && module.default) {
        matterInstance = module.default();
        if (matterInstance) {
          console.log('✅ Matter.js physics initialized');
          hideLoadingOverlay();
        }
      }
    }).catch(error => {
      console.error('❌ Failed to load matter.js module:', error);
      hideLoadingOverlay();
    });
  } catch (error) {
    console.error('❌ Error initializing Matter.js:', error);
    hideLoadingOverlay();
  }
}

function showLoadingOverlay() {
  const loadingOverlay = document.getElementById("matter-loading");
  if (loadingOverlay) {
    loadingOverlay.style.display = 'flex';
    loadingOverlay.classList.remove('fade-out');
  }
}

function hideLoadingOverlay() {
  const loadingOverlay = document.getElementById("matter-loading");
  if (loadingOverlay) {
    loadingOverlay.classList.add('fade-out');
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 500);
  }
}

function updateLoadingMessage(message) {
  const loadingText = document.querySelector('#matter-loading p:nth-child(2)');
  if (loadingText) {
    loadingText.textContent = message;
  }
}

export function skillsDestroy() {
  console.log("🧹 Skills page cleanup");
  
  // Stop Matter.js simulation
  if (matterInstance && typeof matterInstance.stop === 'function') {
    matterInstance.stop();
    console.log('🛑 Matter.js simulation stopped');
  }
  
  // Clean up eye tracking event listeners
  if (window.skillsHandlers) {
    window.removeEventListener("resize", window.skillsHandlers.calcOffset);
    window.removeEventListener("mousemove", window.skillsHandlers.mouseMoveHandler);
  }
  
  // Clear canvas
  const canvas = document.getElementById("physics-canvas");
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  // Hide loading overlay
  hideLoadingOverlay();
  
  console.log("✅ Skills page cleaned up");
}