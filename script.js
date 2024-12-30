const canvas = document.getElementById("unitCircleCanvas");
const ctx = canvas.getContext("2d");

const angleSelector = document.getElementById("angleSelector");
const countSelector = document.getElementById("countSelector");
const runButton = document.getElementById("runButton");
const result = document.getElementById("result");

const quadrantColors = ["#FFFF99", "#0000FF", "#00FF00", "#FF0000"]; // Red, Green, Blue, Yellow (lighter shades)
const subOctants = 4; // Sub-octants per quadrant
const circleRadius = 150;

// Populate count selector (1 to 50)
for (let i = 1; i <= 50; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;
  countSelector.appendChild(option);
}

// Generate lighter shades for a color
function generateShades(color, numShades) {
  const shades = [];
  for (let i = 0; i < numShades; i++) {
    const factor = 0.5 + i / (numShades + 1); // Adjusted factor for lighter shades
    const r = Math.min(255, Math.round(parseInt(color.slice(1, 3), 16) * factor));
    const g = Math.min(255, Math.round(parseInt(color.slice(3, 5), 16) * factor));
    const b = Math.min(255, Math.round(parseInt(color.slice(5, 7), 16) * factor));
    shades.push(`rgb(${r}, ${g}, ${b})`);
  }
  return shades;
}

// Draw the unit circle with quadrants and sub-octants
function drawUnitCircle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the circle
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Draw quadrants and sub-octants
  for (let quadrant = 0; quadrant < 4; quadrant++) {
    const baseAngle = quadrant * (Math.PI / 2);
    const shades = generateShades(quadrantColors[quadrant], subOctants);

    for (let sub = 0; sub < subOctants; sub++) {
      const startAngle = baseAngle + sub * (Math.PI / (2 * subOctants));
      const endAngle = baseAngle + (sub + 1) * (Math.PI / (2 * subOctants));

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, circleRadius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = shades[sub];
      ctx.fill();
    }
  }
}

// Draw the sine and cosine values on the circle
function displayValues(theta, count, angleMultiple) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const x = centerX + circleRadius * Math.cos(theta); // x-coordinate
  const y = centerY - circleRadius * Math.sin(theta); // y-coordinate

  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI); // Small circle to mark the point
  ctx.fillStyle = "black";
  ctx.fill();

  // Display cos(θ) and sin(θ)
  ctx.fillStyle = "black";
  ctx.font = "14px Arial";
  ctx.fillText(`cos(${angleMultiple}): ${Math.cos(theta).toFixed(2)}`, x + 10, y - 10);
  ctx.fillText(`sin(${angleMultiple}): ${Math.sin(theta).toFixed(2)}`, x + 10, y + 10);
}

// Handle the "Run" button click
runButton.addEventListener("click", () => {
  const angleMultiple = angleSelector.value; // Multiple of π (e.g., π/8, π/4, etc.)
  const count = parseInt(countSelector.value, 10); // Selected count
  const denominator = parseInt(angleMultiple.split("/")[1]); // Extract denominator (e.g., 8 for π/8)
  const theta = count * (Math.PI / denominator); // Calculate θ based on the selected multiple and count

  drawUnitCircle();
  const angleText = `π/${denominator}`;
  displayValues(theta, count, angleText);

  // Display the result text
  result.textContent = `Selected angle: ${angleText}, cos(${angleText}): ${Math.cos(theta).toFixed(2)}, sin(${angleText}): ${Math.sin(theta).toFixed(2)}`;
});

// Initial render
drawUnitCircle();