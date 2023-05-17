const canvas = document.getElementById('aco-canvas');
const ctx = canvas.getContext('2d');

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

  // to draw the cities/nodes
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 6, 0, 2 * Math.PI);
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
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'yellow'; // color of the food
    ctx.fill();
    ctx.stroke();
  }
}

class Ant {
  constructor(cities, pheromones, foods) {
    this.cities = cities;
    this.pheromones = pheromones;
    this.foods = foods;
    this.tour = [];
    this.distance = 0;
    this.foodEaten = 0;

    const startCity = Math.floor(Math.random() * cities.length);
    this.tour.push(startCity);

    // Add these lines
    this.x = cities[startCity].x;
    this.y = cities[startCity].y;

    while (this.tour.length < cities.length) {
      const nextCity = this.pickNextCity();
      this.tour.push(nextCity);
    }

    this.distance = this.calculateDistance();
    this.findFood();
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

  findFood() {
    for (const food of this.foods) {
      if (this.distanceTo(food) < 5) {
        this.foodEaten++;
      }
    }
  }

  distanceTo(point) {
    const dx = this.x - point.x;
    const dy = this.y - point.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  drawPath() {
    ctx.beginPath();
    ctx.moveTo(this.cities[this.tour[0]].x, this.cities[this.tour[0]].y);

    for (let i = 1; i < this.tour.length; i++) {
      ctx.lineTo(this.cities[this.tour[i]].x, this.cities[this.tour[i]].y);
    }

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3; // route-width
    ctx.stroke();
  }

  draw() {
    const city = this.cities[this.tour[0]];
    ctx.beginPath();
    ctx.arc(city.x, city.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.stroke();
  }
}

function createRandomCities(numCities) {
  const cities = [];

  for (let i = 0; i < numCities; i++) {
    cities.push(new City(Math.random() * canvas.width, Math.random() * canvas.height));
  }

  return cities;
}

function createRandomFoods(numFoods) {
  const foods = [];

  for (let i = 0; i < numFoods; i++) {
    foods.push(new Food(Math.random() * canvas.width, Math.random() * canvas.height));
  }

  return foods;
}

function createAnts(numAnts, cities, pheromones, foods) {
  const ants = [];

  for (let i = 0; i < numAnts; i++) {
    ants.push(new Ant(cities, pheromones, foods));
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

function updatePheromones(pheromones, ants, rho, Q) {
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
    for (let j = 0; j < pheromones[i].length; j++) {
      pheromones[i][j] = (1 - rho) * pheromones[i][j] + pheromonesUpdate[i][j];
    }
  }
}

function updateBestTour(bestTour, ants) {
  let bestDistance = Number.MAX_VALUE;

  for (const ant of ants) {
    if (ant.distance < bestDistance) {
      bestDistance = ant.distance;
      bestTour.length = 0;
      for (const city of ant.tour) {
        bestTour.push(city);
      }
    }
  }
}

function drawCities(cities) {
  for (const city of cities) {
    city.draw();
  }
}

function drawFoods(foods) {
  for (const food of foods) {
    food.draw();
  }
}

function drawAnts(ants) {
  for (const ant of ants) {
    ant.draw();
    ant.drawPath();
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateCanvas(cities, foods, ants) {
  clearCanvas();
  drawCities(cities);
  drawFoods(foods);
  drawAnts(ants);
}

function aco(numCities, numAnts, numFoods, rho, Q, numIterations) {
  const cities = createRandomCities(numCities);
  const foods = createRandomFoods(numFoods);
  const pheromones = createPheromones(numCities, 1 / numCities);
  const ants = createAnts(numAnts, cities, pheromones, foods);
  const bestTour = [];
  let iteration = 0;

  updateCanvas(cities, foods, ants);

  const intervalId = setInterval(() => {
    updatePheromones(pheromones, ants, rho, Q);
    updateBestTour(bestTour, ants);
    iteration++;

    if (iteration >= numIterations) {
      clearInterval(intervalId);
    }
  }, 100);

  return bestTour;
}

document.getElementById('aco-start-button').addEventListener('click', () => {
  const numCities = parseInt(document.getElementById('numCities').value);
  const numAnts = 10;
  const numFoods = 5;
  const rho = 0.1;
  const Q = 1;
  const numIterations = 100;

  aco(numCities, numAnts, numFoods, rho, Q, numIterations);
});
