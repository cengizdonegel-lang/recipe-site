let servings = 2;

const servingsEl = document.getElementById("servings");
const plusBtn = document.getElementById("plus");
const minusBtn = document.getElementById("minus");

plusBtn.addEventListener("click", () => {
  servings++;
  servingsEl.textContent = servings;
});

minusBtn.addEventListener("click", () => {
  if (servings > 1) {
    servings--;
    servingsEl.textContent = servings;
  }
});
