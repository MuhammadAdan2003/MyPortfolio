// projects.js
export function projectsInit() {
  console.log("📁 Projects page initialization");

  // Filter functionality
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  function handleFilterClick() {
    // Update active button
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");

    const filterValue = this.getAttribute("data-filter");

    // Show/hide projects based on filter
    projectCards.forEach((card) => {
      if (
        filterValue === "all" ||
        card.getAttribute("data-category") === filterValue
      ) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Add hover effects
  function handleCardMouseEnter() {
    this.style.boxShadow =
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
  }

  function handleCardMouseLeave() {
    this.style.boxShadow = "";
  }

  // Add event listeners
  filterButtons.forEach((button) => {
    button.addEventListener("click", handleFilterClick);
  });

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", handleCardMouseEnter);
    card.addEventListener("mouseleave", handleCardMouseLeave);
  });

  // Store for cleanup
  window.projectsHandlers = {
    handleFilterClick: handleFilterClick,
    handleCardMouseEnter: handleCardMouseEnter,
    handleCardMouseLeave: handleCardMouseLeave,
  };

  console.log("✅ Projects page initialized");
}

export function projectsDestroy() {
  console.log("🧹 Projects page cleanup");

  // Clean up event listeners
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.removeEventListener(
      "click",
      window.projectsHandlers?.handleFilterClick,
    );
  });

  projectCards.forEach((card) => {
    card.removeEventListener(
      "mouseenter",
      window.projectsHandlers?.handleCardMouseEnter,
    );
    card.removeEventListener(
      "mouseleave",
      window.projectsHandlers?.handleCardMouseLeave,
    );
  });

  console.log("✅ Projects page cleaned up");
}
