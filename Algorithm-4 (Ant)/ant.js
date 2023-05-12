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

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
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

    for (let i = 0; i < probabilities.length; i++)
     {
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

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.cities[this.tour[0]].x, this.cities[this.tour[0]].y);

    for (let i = 1; i < this.tour.length; i++) {
      ctx.lineTo(this.cities[this.tour[i]].x, this.cities[this.tour[i]].y);
    }

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
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
      for (let j = 0; j < pheromones.length; j++) {
        pheromones[i][j] = pheromones[i][j] * (1 - rho) + pheromonesUpdate[i][j];
      }
    }
  }
  
  function run() {
    const numCities = 20;
    const numAnts = 50;
    const numIterations = 100;
    const rho = 0.1;  //evaporation rate
    const Q = 1;  //pheromone left on trail by each Ant
    const initialValue = 1;  //initial pheromone value
  
    const cities = createRandomCities(numCities);
    let pheromones = createPheromones(numCities, initialValue);
    let bestAnt = null;
  
    for (let iteration = 0; iteration < numIterations; iteration++) {
      const ants = createAnts(numAnts, cities, pheromones);
  
      for (const ant of ants) {
        if (!bestAnt || ant.distance < bestAnt.distance) {
          bestAnt = ant;
        }
      }
  
      updatePheromones(pheromones, ants, rho, Q);
    }
  
    return bestAnt;
  }
  
document.getElementById('aco-start-button').addEventListener('click', () => {
    const bestAnt = run();
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const city of bestAnt.cities) {
      city.draw();
    }
  
    bestAnt.draw();
  });
  