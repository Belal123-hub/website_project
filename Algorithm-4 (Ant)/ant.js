//starting my javascript code in ant.js

function distance(a, b) {
    let dx = a[0] - b[0];
    let dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
}

function antColonyOptimization(cities, alpha = 1, beta = 5, evaporation = 0.5, iterations = 100) {
    console.log("Running antColonyOptimization with cities: ", cities);
    let pheromones = Array(cities.length).fill().map(() => Array(cities.length).fill(1));
    let bestLength = Infinity;
    let bestTour = null;

    for (let iter = 0; iter < iterations; iter++) {
        let tour = [Math.floor(Math.random() * cities.length)];
        while (tour.length < cities.length) {
            let currentCity = tour[tour.length - 1];
            let probabilities = pheromones[currentCity].map((pheromone, city) =>
                tour.includes(city) ? 0 : Math.pow(pheromone, alpha) * Math.pow(1 / distance(cities[currentCity], cities[city]), beta)
            );
            let total = probabilities.reduce((a, b) => a + b, 0);
            probabilities = probabilities.map(prob => prob / total);
            let rand = Math.random();
            let cumulative = 0;
            for (let i = 0; i < probabilities.length; i++) {
                cumulative += probabilities[i];
                if (rand < cumulative) {
                    tour.push(i);
                    break;
                }
            }
        }
        
        //updating the length calculation
        let length = 0;
        for (let i = 0; i < tour.length; i++) {
            let currentCity = cities[tour[i]];
            let nextCity = cities[tour[(i + 1) % tour.length]];
            length += distance(currentCity, nextCity);
        }
        
        if (length < bestLength) {
            bestLength = length;
            bestTour = tour;
        }
        pheromones.forEach((row, i) => row.forEach((_, j) => pheromones[i][j] *= (1 - evaporation)));
        tour.forEach((city, i) => pheromones[i][tour[i - 1]] += 1 / length);
    }

    console.log("Finished antColonyOptimization, bestTour: ", bestTour, ", bestLength: ", bestLength);
    return { bestTour, bestLength };
}


//function to handle the Start button click
document.getElementById('start').addEventListener('click', function() {
    //city coordinates from the textarea input

    let cities = document.getElementById('cities').value.split(';').map(pair => pair.split(',').map(Number));
    console.log("Parsed cities: ", cities);

    //running the Ant Colony Optimization algorithm
    let { bestTour, bestLength } = antColonyOptimization(cities, 1, 5, 0.5, 1000);
    //Displaying the results
    document.getElementById('results').innerText = 'Best Tour: ' + bestTour.join(' --> ') + '\nLength: ' + bestLength.toFixed(2);
});
