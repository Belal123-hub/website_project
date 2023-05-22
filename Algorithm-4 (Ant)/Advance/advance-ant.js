// ant.js

const canvas = document.getElementById('aco-canvas');
const ctx = canvas.getContext('2d');

const cityRadius = 6;
const foodRadius = 5;
const antRadius = 3;
const trailWidth = 3;

class City {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo(city) {
    const dx = this.x - city.x;
    const dy = this.y - city.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, cityRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.stroke();
  }
}

class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, foodRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.stroke();
  }
}

class Ant {
  constructor(cities, pheromones) {
    this.cities = cities;
    this.pheromones = pheromones;
    this.tour = [];
    this.distance = 0;

    const startCity = Math.floor(Math.random() * cities.length);
    this.tour.push(startCity);

    while (this.tour.length < cities.length) {
      const nextCity = this.pickNextCity();
      this.tour.push(nextCity);
    }

    this.distance = this.calculateDistance();
  }

  pickNextCity() {
    const lastCity = this.tour[this.tour.length - 1];
    const probabilities = [];

    for (let i = 0; i < this.cities.length; i++) {
      if (this.tour.includes(i)) {
        probabilities.push(0);
      } else {
        const pheromone = this.pheromones[lastCity][i];
        const distance = this.cities[lastCity].distanceTo(this.cities[i]);
        const probability = pheromone / distance;
        probabilities.push(probability);
      }
    }

    const sum = probabilities.reduce((a, b) => a + b);
    const r = Math.random();
    let s = 0;

    for (let i = 0; i < probabilities.length; i++) {
      s += probabilities[i] / sum;
      if (s >= r) {
        return i;
      }
    }
  }

  calculateDistance() {
    let distance = 0;

    for (let i = 0; i < this.tour.length - 1; i++) {
      distance += this.cities[this.tour[i]].distanceTo(this.cities[this.tour[i + 1]]);
    }

    return distance;
  }

  drawPath() {
    if (this.tour.length < 2) {
      return;
    }
  
    ctx.beginPath();
    ctx.moveTo(this.cities[this.tour[0]].x, this.cities[this.tour[0]].y);
  
    for (let i = 1; i < this.tour.length; i++) {
      const city = this.cities[this.tour[i]];
      ctx.lineTo(city.x, city.y);
    }
  
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = trailWidth;
    ctx.stroke();
  }
  

  draw() {
    const city = this.cities[this.tour[0]];
    ctx.beginPath();
    ctx.arc(city.x, city.y, antRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.stroke();
  }
}

let cities = [];
let foods = [];
let pheromones = [];
let ants = [];

let numCities = 10;
let numFoods = 20;
let numAnts = 50;
let numIterations = 100;
let rho = 0.1;
let Q = 1;
let initialValue = 0.1;
let iteration = 0;
let isRunning = false;

const startButton = document.getElementById('aco-start-button');
startButton.addEventListener('click', startAlgorithm);

canvas.addEventListener('click', addFood);

function startAlgorithm() {
  if (!isRunning) {
    numCities = parseInt(document.getElementById('numCities').value);
    numFoods = 20;
    numAnts = 50;
    numIterations = 100;
    rho = 0.1;
    Q = 1;
    initialValue = 0.1;
    iteration = 0;

    cities = createRandomCities(numCities);
    pheromones = createPheromones(numCities, initialValue);
    ants = createAnts(numAnts, cities, pheromones);

    foods = [];
    isRunning = true;
    startButton.textContent = 'Stop';

    runAlgorithm();
  } else {
    isRunning = false;
    startButton.textContent = 'Start';
  }
}

function runAlgorithm() {
  if (!isRunning) {
    return;
  }

  for (let i = 0; i < numIterations; i++) {
    if (!isRunning) {
      return;
    }

    moveAnts();
    updatePheromones();
    updateCanvas();
    iteration++;

    if (i === numIterations - 1) {
      isRunning = false;
      startButton.textContent = 'Start';
    }
  }

  if (isRunning) {
    setTimeout(runAlgorithm, 100);
  }
}


function addFood(event) {
  if (isRunning) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    foods.push(new Food(x, y));
    updateCanvas();
  }
}

function createRandomCities(numCities) {
  const cities = [];

  for (let i = 0; i < numCities; i++) {
    cities.push(new City(Math.random() * canvas.width, Math.random() * canvas.height));
  }

  return cities;
}

function createAnts(numAnts, cities, pheromones) {
  const ants = [];

  for (let i = 0; i < numAnts; i++) {
    ants.push(new Ant(cities, pheromones));
  }

  return ants;
}

function createPheromones(numCities, initialValue) {
  const pheromones = [];

  for (let i = 0; i < numCities; i++) {
    const row = [];
    for (let j = 0; j < numCities; j++) {
      row.push(initialValue);
    }
    pheromones.push(row);
  }

  return pheromones;
}

function moveAnts() {
  for (const ant of ants) {
    const nextCity = ant.pickNextCity();
    ant.tour.push(nextCity);
    ant.distance += ant.cities[ant.tour[ant.tour.length - 2]].distanceTo(ant.cities[nextCity]);
  }
}

function updatePheromones() {
  const pheromonesUpdate = createPheromones(pheromones.length, 0);

  for (const ant of ants) {
    const T = Q / ant.distance;
    for (let i = 0; i < ant.tour.length - 1; i++) {
      const city1 = ant.tour[i];
      const city2 = ant.tour[i + 1];
      pheromonesUpdate[city1][city2] += T;
      pheromonesUpdate[city2][city1] += T;
    }
  }

  for (let i = 0; i < pheromones.length; i++) {
    for (let j = 0; j < pheromones.length; j++) {
      pheromones[i][j] = pheromones[i][j] * (1 - rho) + pheromonesUpdate[i][j];
    }
  }
}

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const city of cities) {
    city.draw();
  }

  for (const food of foods) {
    food.draw();
  }

  for (const ant of ants) {
    ant.drawPath();
  }

  for (const ant of ants) {
    ant.draw();
  }

  ctx.font = '14px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`Iteration: ${iteration}`, 10, canvas.height - 10);
}

updateCanvas();
