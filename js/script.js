const canvas = document.getElementById("backgroundCanvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext("2d");

const bgwidth = canvas.width;
const midy = canvas.height / 2;
const amplitude = 50;
const wavelength = 0.01;
const frequency = 0.01;

// return a random number within a range
function getRandomNum(min, max) {
  return Math.random() * (max - min) + min;
}

// map a number from 1 range to another
function map(n, start1, end1, start2, end2) {
  return (n - start1) / (end1 - start1) * (end2 - start2) + start2;
}

function radians($degrees) {
  return $degrees * Math.PI / 180;
}
// Given the origin point of the circle, its radius and the angle in Radians (degrees * Math.PI / 180)
// it returns the a point object showing the x,y coordinates of the point on a circle.

function findPointOnCircle(originX, originY, radius, degrees) {
  let angleRadians = radians(degrees);
  var newX = radius * Math.cos(angleRadians) + originX;
  var newY = radius * Math.sin(angleRadians) + originY;
  return { x: newX, y: newY };
}

function drawCircles($amt, $ctx) {
  for (let i = 0; i < $amt; i++) {
    new Circle(
    getRandomNum(0, window.innerWidth),
    getRandomNum(0, window.innerWidth),
    100,
    $ctx);

  }
}

class Circle {
  constructor($x, $y, $radius, $ctx) {
    $ctx.beginPath();
    $ctx.arc($x, $y, $radius, radians(0), radians(360));
    $ctx.stroke();
  }}


//drawCircles(10, ctx);

class SineWave {
  constructor(
  $width,
  $ctx,
  $xorigin,
  $yorigin,
  $amplitude,
  $wavelength,
  $color,
  $increment)
  {
    $ctx.beginPath();
    $ctx.moveTo($xorigin, $yorigin);
    for (let s = 0; s < $width; s++) {
      ctx.lineTo(
      s,
      $yorigin +
      Math.sin(s * $wavelength + $increment) *
      $amplitude *
      Math.sin($increment));

    }
    ctx.strokeStyle = $color;
    ctx.stroke();
  }}

const sines = [
{
  color: "#be1d90",
  y: midy + getRandomNum(-30, 30),
  amplitude: amplitude + getRandomNum(-30, 30),
  wavelength: wavelength + getRandomNum(-0.01, 0.01) },

{
  color: "#4b0487",
  y: midy + getRandomNum(-30, 30),
  amplitude: amplitude + getRandomNum(-30, 30),
  wavelength: wavelength + getRandomNum(-0.01, 0.01) },

{
  color: "#42707d",
  y: midy + getRandomNum(-30, 30),
  amplitude: amplitude + getRandomNum(-30, 30),
  wavelength: wavelength + getRandomNum(-0.01, 0.01) }];



const drawSine = $i => {
  ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < sines.length; i++) {
    new SineWave(
    bgwidth,
    ctx,
    0,
    sines[i].y,
    sines[i].amplitude,
    sines[i].wavelength,
    sines[i].color,
    $i);

  }
};

let increment = frequency;
const updateCanvas = () => {
  drawSine(increment);
  //try to randomize change a bit
  increment += getRandomNum(0, frequency * 3);
  setTimeout(() => {
    window.requestAnimationFrame(updateCanvas);
  }, 20);
};
window.requestAnimationFrame(updateCanvas);