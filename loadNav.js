const basePath = "/curiouspanda";

fetch(`${basePath}/components/nav.html`)
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;

    document.querySelectorAll("[data-link]").forEach(link => {
      link.href = basePath + link.getAttribute("data-link");
    });

    document.querySelectorAll("[data-src]").forEach(img => {
      img.src = basePath + img.getAttribute("data-src");
    });
  })
  .catch(error => {
    console.error("Error loading navbar:", error);
  });
