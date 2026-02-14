let navbarInitialized = false;

export function renderNavbar() {
  // Remove old nav if exists
  const oldNav = document.getElementById("fullnav");
  if (oldNav) oldNav.remove();

  // Inject HTML
  const navHTML = `
         <div id="navOpen" class="fs-menu-btn cursor-pointer border-2 p-3 border-black bg-gray-50 rounded-2xl">
        <span id="fir"></span>
        <span></span>
        <span></span>
    </div>

    <div id="fullnav" class="fixed h-screen bg-[#111] z-50">
        <div id="navClose" class="flex w-100 justify-end text-white p-5">
            close
        </div>
        <div class="flex">
            <div class="flex flex-col gap-8 text-6xl p-20 items-start">

                <div class="h-[80px] overflow-hidden w-[100%]">
                    <span
                        class="mazius relative inline-block text-white cursor-pointer
               transition-all duration-300
               hover:text-[#10b981]
               hover:scale-110
               hover:-translate-y-1
               after:content-['']
               after:absolute
               after:left-0
               after:-bottom-2
               after:h-[2px]
               after:w-0
               after:bg-[#10b981]
               after:transition-all
               after:duration-300
               after:origin-left
               hover:after:w-full">
                        <a href="index.html">Home</a>
                    </span>
                </div>

                <div class="h-[80px] overflow-hidden w-[100%]">
                    <span
                        class="mazius relative inline-block text-white cursor-pointer transition-all duration-300 hover:text-[#10b981] hover:scale-110 hover:-translate-y-1 after:content-[''] after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-[#10b981] after:transition-all after:duration-300 after:origin-left hover:after:w-full">
                        <a href="testimonial.html">Testimonials</a>
                    </span>
                </div>


                <div class="h-[80px] overflow-hidden w-[100%]">
                    <span
                        class="mazius relative inline-block text-white cursor-pointer transition-all duration-300 hover:text-[#10b981] hover:scale-110 hover:-translate-y-1 after:content-[''] after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-[#10b981] after:transition-all after:duration-300 after:origin-left hover:after:w-full">
                        <a href="projects.html">Projects</a>
                    </span>
                </div>

                <div class="h-[80px] overflow-hidden w-[100%]">
                    <span
                        class="mazius relative inline-block text-white cursor-pointer transition-all duration-300 hover:text-[#10b981] hover:scale-110 hover:-translate-y-1 after:content-[''] after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-[#10b981] after:transition-all after:duration-300 after:origin-left hover:after:w-full">
                        <a href="skills.html" class="text-inherit">Skills</a>
                    </span>
                </div>
                <div class="h-[80px] overflow-hidden w-[100%]">
                    <span
                        class="mazius relative inline-block text-white cursor-pointer transition-all duration-300 hover:text-[#10b981] hover:scale-110 hover:-translate-y-1 after:content-[''] after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-[#10b981] after:transition-all after:duration-300 after:origin-left hover:after:w-full">
                        <a href="#">Blogs</a>
                    </span>
                </div>
            </div>
            <div class="flex items-center p-20 h-full">
                <img id="navImage" src="images/homesccreen.png" alt="">
            </div>
        </div>
    </div>
  `;

  const container = document.createElement("div");
  container.innerHTML = navHTML;
  document.body.prepend(container);

  // Only initialize once
  if (!navbarInitialized) {
    initNavbar();
    navbarInitialized = true;
  }

  // Handle Barba link clicks
  const links = document.querySelectorAll("#fullnav a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (typeof barba !== "undefined") {
        e.preventDefault();
        const href = link.getAttribute("href");
        barba.go(href);
      }
    });
  });
}
