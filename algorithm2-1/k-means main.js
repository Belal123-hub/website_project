// Get the canvas element and its 2D rendering context
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// Get another 2D rendering context (unnecessary duplication)
var context = canvas.getContext('2d');
// Add a mousedown event listener to the canvas
canvas.addEventListener('mousedown', handleMouseDown);
// Array to store the points
var points = [];
/**
 * Event handler for the mousedown event on the canvas
 * @param {MouseEvent} event - The mousedown event object
 */
function handleMouseDown(event) {
    // Calculate the mouse coordinates relative to the canvas
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
    // Set the fill style to black
    context.fillStyle = 'black';
    // Start a new path
    context.beginPath();
    // Draw a filled circle (point) on the canvas
    context.arc(x - 8, y - 8, 5, 0, Math.PI * 2);
    // Fill the circle with the defined fill style
    context.fill();
    // Store the coordinates of the point in the points array
    points.push({ x, y });
}
// Run k-means clustering

function kMeans(data, k) {
    // Initialize centroids randomly
    let centroids = [];
    for (let i = 0; i < k; i++) {
        // Randomly select a data point as a centroid
        centroids.push(data[Math.floor(Math.random() * data.length)]);
    }
    // Create empty clusters
    let clusters = [];
    for (let i = 0; i < k; i++) {
        clusters.push([]);
    }
    // Repeat until convergence
    let converged = false;
    while (!converged) {
        // Assign each data point to the closest centroid
        for (let i = 0; i < data.length; i++) {
            // Calculate the distances from the data point to all centroids
            let distances = centroids.map(c => distance(data[i], c));
            // Find the index of the closest centroid
            let closestCentroid = distances.indexOf(Math.min(...distances));
            // Assign the data point to the closest cluster
            clusters[closestCentroid].push(data[i]);
        }
        // Update centroids
        let newCentroids = [];
        for (let i = 0; i < k; i++) {
            let cluster = clusters[i];
            // Calculate the sum of coordinates for all points in the cluster
            let centroidSum = cluster.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), { x: 0, y: 0 });
            // Calculate the new centroid coordinates by averaging the sum
            let centroid = {
                x: centroidSum.x / cluster.length,
                y: centroidSum.y / cluster.length
            };
            // Store the new centroid
            newCentroids.push(centroid);
        }
        // Check for convergence by comparing the distances between old and new centroids
        converged = true;
        for (let i = 0; i < k; i++) 
        {
            if (distance(centroids[i], newCentroids[i]) > 0.0001) 
            {
                converged = false;
                break;
            }
        }
        // Update centroids for the next iteration
        centroids = newCentroids;
    }
    // Return the resulting clusters
    return clusters;
}
function distance(a, b) {
    // Euclidean distance between two points
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function getRandomColor() {
    // Generate a random RGB color string
    const r = Math.floor(Math.random() * 256);    // give the number and multiply it by 256   and round it
    const g = Math.floor(Math.random() * 256);   // give the number and multiply it by 256 and round it 
    const b = Math.floor(Math.random() * 256);   // give the number and multiply it by 256 and round it
    return `rgb(${r}, ${g}, ${b})`;
}

function startButton() {
    // Run k-means clustering
    var numClusters = document.getElementById("clusterNum").value;
    const clusters = kMeans(points, numClusters);
    // Draw clusters in different colors
    for (let i = 0; i < clusters.length; i++) {
        const color = getRandomColor();
        for (let j = 0; j < clusters[i].length; j++) {
            const { x, y } = clusters[i][j];
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x - 8, y - 8, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function clearButton() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
}