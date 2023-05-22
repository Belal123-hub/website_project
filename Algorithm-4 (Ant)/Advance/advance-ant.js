const acoCanvas = document.getElementById('aco-canvas');
const ctx = acoCanvas.getContext('2d');

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
  constructor(cities, pheromones, homeCityIndex) {
    this.cities = cities;
    this.pheromones = pheromones;
    this.tour = [];
    this.distance = 0;

    this.tour.push(homeCityIndex);

    this.homeCityIndex = homeCityIndex;
    this.currentCityIndex = homeCityIndex;

    this.foodIndex = null;
    this.hasFood = false;
    this.foodPath = [];
    this.foodDistance = 0;

    this.calculateDistance();
  }

  pickNextCity() {
    const lastCity = this.currentCityIndex;
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

    this.distance = distance;
  }

  updateFoodPath() {
    if (this.hasFood) {
      const lastCity = this.foodPath[this.foodPath.length - 1];
      const targetCity = this.cities[this.foodIndex];

      this.foodPath.push(targetCity);
      this.foodDistance += lastCity.distanceTo(targetCity);
    } else {
      const targetCity = this.cities[this.foodIndex];

      this.foodPath = [targetCity];
      this.foodDistance = this.cities[this.currentCityIndex].distanceTo(targetCity);
    }
  }

  moveToNextCity() {
    const nextCityIndex = this.pickNextCity();
    const nextCity = this.cities[nextCityIndex];

    this.tour.push(nextCityIndex);
    this.distance += this.cities[this.currentCityIndex].distanceTo(nextCity);
    this.currentCityIndex = nextCityIndex;

    if (this.hasFood) {
      this.updateFoodPath();
    }

    if (this.currentCityIndex === this.foodIndex) {
      this.hasFood = true;
      this.foodIndex = null;
    }

    if (this.hasFood && this.currentCityIndex === this.homeCityIndex) {
      this.hasFood = false;
      this.foodPath = [];
      this.foodDistance = 0;
    }
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
    const city = this.cities[this.currentCityIndex];
    ctx.beginPath();
    ctx.arc(city.x, city.y, antRadius, 0, 2 * Math.PI);
    ctx.fillStyle = this.hasFood ? 'green' : 'red';
    ctx.fill();
    ctx.stroke();
  }

  drawFoodPath() {
    if (this.hasFood && this.foodPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.cities[this.currentCityIndex].x, this.cities[this.currentCityIndex].y);

      for (let i = 1; i < this.foodPath.length; i++) {
        const city = this.foodPath[i];
        ctx.lineTo(city.x, city.y);
      }

      ctx.strokeStyle = 'green';
      ctx.lineWidth = trailWidth;
      ctx.stroke();
    }
  }
}

let cities = [];
let foods = [];
let pheromones = [];
let ants = [];

let homeCityIndex = -1;

const canvas = document.getElementById('aco-canvas');

const startButton = document.getElementById('aco-start-button');
startButton.addEventListener('click', () => {
  const numCitiesInput = document.getElementById('numCities');
  const numCities = parseInt(numCitiesInput.value);

  const numAnts = 50;
  const numIterations = 100;
  const rho = 0.1;
  const Q = 1;
  const initialValue = 0.1;

  cities = createRandomCities(numCities);
  pheromones = createPheromones(numCities, initialValue);

  const homeCity = new City(canvas.width / 2, canvas.height / 2);
  cities.push(homeCity);
  homeCityIndex = cities.length - 1;

  ants = createAnts(numAnts, homeCityIndex);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCities();
  drawFoods();

  for (let i = 0; i < numIterations; i++) {
    updateAnts();
    updatePheromones(rho);
    updateBestTour();
  }
});

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const food = new Food(x, y);
  foods.push(food);

  drawFoods();
});

function createRandomCities(numCities) {
  const cities = [];

  for (let i = 0; i < numCities; i++) {
    const x = Math.floor(Math.random() * (canvas.width - 2 * cityRadius) + cityRadius);
    const y = Math.floor(Math.random() * (canvas.height - 2 * cityRadius) + cityRadius);
    const city = new City(x, y);
    cities.push(city);
  }

  return cities;
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

function createAnts(numAnts, homeCityIndex) {
  const ants = [];

  for (let i = 0; i < numAnts; i++) {
    const ant = new Ant(cities, pheromones, homeCityIndex);
    ants.push(ant);
  }

  return ants;
}

function updateAnts() {
  for (let i = 0; i < ants.length; i++) {
    ants[i].moveToNextCity();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCities();
  drawFoods();
  drawPheromones();
  drawAnts();
  drawBestTour();
}

function updatePheromones(rho) {
  for (let i = 0; i < pheromones.length; i++) {
    for (let j = 0; j < pheromones[i].length; j++) {
      pheromones[i][j] *= 1 - rho;
    }
  }

  for (let i = 0; i < ants.length; i++) {
    const ant = ants[i];

    for (let j = 0; j < ant.tour.length - 1; j++) {
      const cityA = ant.tour[j];
      const cityB = ant.tour[j + 1];

      pheromones[cityA][cityB] += Q / ant.distance;
      pheromones[cityB][cityA] += Q / ant.distance;
    }
  }
}

function updateBestTour() {
  let bestDistance = Number.MAX_VALUE;
  let bestAnt = null;

  for (let i = 0; i < ants.length; i++) {
    const ant = ants[i];

    if (ant.distance < bestDistance) {
      bestDistance = ant.distance;
      bestAnt = ant;
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCities();
  drawFoods();
  drawPheromones();
  drawBestTour();

  if (bestAnt) {
    bestAnt.drawPath();
    bestAnt.draw();
    bestAnt.drawFoodPath();
  }
}

function drawCities() {
  for (let i = 0; i < cities.length; i++) {
    cities[i].draw();
  }
}

function drawFoods() {
  for (let i = 0; i < foods.length; i++) {
    foods[i].draw();
  }
}

function drawPheromones() {
  const maxValue = Math.max(...pheromones.flat());

  for (let i = 0; i < pheromones.length; i++) {
    for (let j = 0; j < pheromones[i].length; j++) {
      const pheromone = pheromones[i][j];
      const alpha = pheromone / maxValue;

      if (pheromone > 0) {
        ctx.beginPath();
        ctx.moveTo(cities[i].x, cities[i].y);
        ctx.lineTo(cities[j].x, cities[j].y);
        ctx.strokeStyle = `rgba(0, 0, 255, ${alpha})`;
        ctx.lineWidth = trailWidth;
        ctx.stroke();
      }
    }
  }
}

function drawAnts() {
  for (let i = 0; i < ants.length; i++) {
    ants[i].draw();
  }
}

function drawBestTour() {
  let bestDistance = Number.MAX_VALUE;
  let bestAnt = null;

  for (let i = 0; i < ants.length; i++) {
    const ant = ants[i];

    if (ant.distance < bestDistance) {
      bestDistance = ant.distance;
      bestAnt = ant;
    }
  }

  if (bestAnt && bestAnt.tour.length > 1) {
    ctx.beginPath();
    ctx.moveTo(cities[bestAnt.tour[0]].x, cities[bestAnt.tour[0]].y);

    for (let i = 1; i < bestAnt.tour.length; i++) {
      const city = cities[bestAnt.tour[i]];
      ctx.lineTo(city.x, city.y);
    }

    ctx.strokeStyle = 'red';
    ctx.lineWidth = trailWidth;
    ctx.stroke();
  }
}
