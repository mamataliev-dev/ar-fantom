// Open / Close Model Viewers
const openModalBtn = document.querySelectorAll(".model-btn");
const models = document.querySelectorAll(".model-view");
const elements = document.querySelector(".elements");
const closeModel = document.querySelector(".close-model");

openModalBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const target = e.target;
    const attr = target.getAttribute("data-model");

    models.forEach((model) => {
      const modelAttr = model.getAttribute("data-model");

      if (attr === modelAttr) {
        model.classList.add("open");
        elements.classList.add("hide");
        closeModel.classList.add("active");
        if (attr === "ar-test") {
          document.body.classList.add("dark");
        }
      } else {
        model.classList.remove("open");
      }
    });
  });
});

closeModel.addEventListener("click", () => {
  models.forEach((model) => {
    model.classList.remove("open");
  });

  elements.classList.remove("hide");
  closeModel.classList.remove("active");
  document.body.classList.remove("dark");
});

// Handles loading the events for <model-viewer>'s slotted progress bar
const onProgress = (event) => {
  const progressBar = event.target.querySelector(".progress-bar");
  const updatingBar = event.target.querySelector(".update-bar");
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add("hide");
    event.target.removeEventListener("progress", onProgress);
  } else {
    progressBar.classList.remove("hide");
  }
};

document.querySelector("model-viewer").addEventListener("progress", onProgress);
