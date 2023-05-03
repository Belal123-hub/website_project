const canvas = document.getElementById('tsp-canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');

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

    //node
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.stroke();
    }
}

class Route {
    constructor(cities) {
        this.cities = cities.slice();
        this.distance = this.calculateTotalDistance();
    }

    calculateTotalDistance() {
        let distance = 0;
        for (let i = 0; i < this.cities.length - 1; i++) {
            distance += this.cities[i].distanceTo(this.cities[i + 1]);
        }
        distance += this.cities[this.cities.length - 1].distanceTo(this.cities[0]);
        return distance;
    }

    mutate() {
        const indexA = Math.floor(Math.random() * this.cities.length);
        const indexB = Math.floor(Math.random() * this.cities.length);
        const temp = this.cities[indexA];
        this.cities[indexA] = this.cities[indexB];
        this.cities[indexB] = temp;
        this.distance = this.calculateTotalDistance();
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.cities[0].x, this.cities[0].y);
        for (let i = 1; i < this.cities.length; i++) {
            ctx.lineTo(this.cities[i].x, this.cities[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'red'; //Set the color of the route
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

function createInitialPopulation(cities, populationSize) {
    const population = [];
    for (let i = 0; i < populationSize; i++) {
        const shuffledCities = cities.slice();
        for (let j = shuffledCities.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [shuffledCities[j], shuffledCities[k]] = [shuffledCities[k], shuffledCities[j]];
        }
        population.push(new Route(shuffledCities));
    }
    return population;
}

function selectParents(population) {
    const parentA = population[Math.floor(Math.random() * population.length)];
    const parentB = population[Math.floor(Math.random() * population.length)];
    return parentA.distance < parentB.distance ? parentA : parentB;
}

function crossover(parentA, parentB) {
    const start = Math.floor(Math.random() * parentA.cities.length);
    const end = Math.floor(Math.random() * (parentA.cities.length - start)) + start;
    const offspringCities = parentA.cities.slice(start, end);

    parentB.cities.forEach(city => {
        if (!offspringCities.includes(city)) {
            offspringCities.push(city);
        }
    });

    return new Route(offspringCities);
}

function runGeneticAlgorithm(cities, populationSize, generations, mutationRate) {
    let population = createInitialPopulation(cities, populationSize);
    let bestRoute = population[0];

    for (let generation = 0; generation < generations; generation++) {
        const newPopulation = [];
        for (let i = 0; i < populationSize; i++) {
            const parentA = selectParents(population);
            const parentB = selectParents(population);
            let offspring = crossover(parentA, parentB);

            if (Math.random() < mutationRate) {
                offspring.mutate();
            }

            newPopulation.push(offspring);

            if (offspring.distance < bestRoute.distance) {
                bestRoute = offspring;
            }
        }

        population = newPopulation;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cities.forEach(city => city.draw());
        bestRoute.draw();
    }
}

startButton.addEventListener('click', () => {
    //taking city input from user in web interface
    const numCitiesInput = document.getElementById('num-cities');
    const numCities = parseInt(numCitiesInput.value);

    const populationSize = 100;
    const generations = 1000;
    const mutationRate = 0.1;
    const cities = createRandomCities(numCities);

    runGeneticAlgorithm(cities, populationSize, generations, mutationRate);
});

