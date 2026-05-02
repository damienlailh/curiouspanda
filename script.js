//Coding the Interactive Panda Widget on index.html
// Data for the interaction
const pandaFacts = {
    Food: "Pandas must eat 12-38 kg of bamboo every day!",
    Habitat: "Wild pandas live in the mountains of central China.",
    Bamboo: "Bamboo makes up 99% of a giant panda's diet."
};

//Function to change panda states
// Reference the container
const pandaContainer = document.getElementById('panda');

// 1. Initial Load: Sleeping Panda
let pandaAnim = lottie.loadAnimation({
  container: pandaContainer,
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'sleeping.json',
  rendererSettings: {
    preserveAspectRatio: "xMidYMid meet"
  }
});

let pandaState = "sleeping";

// Immediately set the segment for the first file once it's loaded
pandaAnim.addEventListener('DOMLoaded', () => {
  pandaAnim.goToAndPlay(0, true);
});

// 2. The Switch Function
function playAwakeSequence() {
  pandaAnim = lottie.loadAnimation({
    container: pandaContainer,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "awake.json",
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet"
    }
  });

  pandaAnim.addEventListener("DOMLoaded", () => {
    // Play wake-up once: frame 6 → 69
    pandaAnim.playSegments([6, 69], true);
  });

  pandaAnim.addEventListener("complete", function onWakeComplete() {
    pandaAnim.removeEventListener("complete", onWakeComplete);

    // Loop awake idle: frame 69 → 90
    pandaAnim.loop = true;
    pandaAnim.playSegments([160, 180], true);
  });
}
function wakePanda(topic) {
  // Display the fact bubble
  document.getElementById("fact-text").innerText = pandaFacts[topic];
  document.getElementById("fact-bubble").style.display = "block";
  if (pandaState === "awake") return;

  // Clear the sleeping panda
  pandaAnim.destroy();

  // Load the awake panda
  playAwakeSequence();
  pandaState = "awake";
}

function dismissFact() {
  document.getElementById("fact-bubble").style.display = "none";

  if (pandaState === "sleeping") return;

  pandaAnim.destroy();

  pandaAnim = lottie.loadAnimation({
    container: pandaContainer,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "sleeping.json"
  });

  pandaAnim.addEventListener("DOMLoaded", () => {
    pandaAnim.playSegments([1, 60], true);
  });

  pandaState = "sleeping";
}