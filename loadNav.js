// Change this to your GitHub repository name
const basePath = "/curiouspanda";

fetch(`${basePath}/components/nav.html`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Navbar failed to load: ${response.status}`);
    }
    return response.text();
  })
  .then(html => {
    const navbar = document.getElementById("navbar");

    if (!navbar) {
      console.error("No element with id='navbar' found.");
      return;
    }

    navbar.innerHTML = html;

    // Convert data-link="/some-page.html"
    // into href="/curiouspanda/some-page.html"
    document.querySelectorAll("[data-link]").forEach(link => {
      const path = link.getAttribute("data-link");
      link.setAttribute("href", basePath + path);
    });

    // Convert data-src="/logo.png"
    // into src="/curiouspanda/logo.png"
    document.querySelectorAll("[data-src]").forEach(element => {
      const path = element.getAttribute("data-src");
      element.setAttribute("src", basePath + path);
    });
  })
  .catch(error => {
    console.error("Error loading navbar:", error);
  });
