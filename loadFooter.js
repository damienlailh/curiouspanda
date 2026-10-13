fetch("/components/footer.html")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Footer failed to load: ${response.status}`);
    }
    return response.text();
  })
  .then(data => {
    const footer = document.getElementById("footer");

    if (!footer) {
      console.error("No element with id='footer' found.");
      return;
    }

    footer.innerHTML = data;
  })
  .catch(error => {
    console.error("Error loading footer:", error);
  });