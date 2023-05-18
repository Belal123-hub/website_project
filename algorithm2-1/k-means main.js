
var canvas = document.getElementById('myCanvas');     // Get the canvas element and its 2D rendering context
var context = canvas.getContext('2d');                   // variable to perform various drawing operations on the canvas

var context = canvas.getContext('2d');         // Get another 2D rendering context (unnecessary duplication)

canvas.addEventListener('mousedown', handleMouseDown);   // Add a mousedown event listener to the canvas and call  handleMouseDown function

var points = [];   // Array to store the points

/**
 * Event handler for the mousedown event on the canvas
 * @param {MouseEvent} event /*@ param: This annotation is used in JSDoc to document a function parameter
 *                            {MouseEvent}: This specifies the type of the parameter
 */
function handleMouseDown(event) {
    // Calculate the mouse coordinates relative to the canvas
    var coordin1 = event.clientX - canvas.offsetLeft;
    var coordin2 = event.clientY - canvas.offsetTop;
    // Set the fill style to black
    context.fillStyle = 'black';  // lets consider black 
    // Start a new path
    context.beginPath();
    // Draw a filled circle (point) on the canvas
    context.arc(coordin1 - 8, coordin2 - 8, 5, 0, Math.PI * 2);
    // Fill the circle with the defined fill style
    context.fill();
    // Store the coordinates of the point in the points array
    points.push({ x: coordin1, y: coordin2 });
}
    // Run k-means clustering
   function k_Means(data, n) 
   {
    // Initialize centroids randomly as array
    let centroids = [];
    for (let i = 0; i < n; i++) {
        // Randomly select a data point as a centroid(centriods are main points from  where  we calculate distance)
        centroids.push(data[Math.floor(Math.random() * data.length)]);
    }
    // Create empty clusters like a container:  
    let clusters = [];     // array for clusters 
    for (let i = 0; i < n; i++) {
        clusters.push([]);    // make empty place  for every cluster
    }
    // Repeat until convergence
    let converged = false; // initial boolean value as a condition to control the iterative process
    while (!converged) 
    {
        // Assign each data point to the closest centroid
        for (let i = 0; i < data.length; i++) {
            // Calculate the distances from the data point to all centroids using map()
            let distances = centroids.map(c => the_distance(data[i], c));
            // Find the index of the closest centroid
            let closestCentroid = distances.indexOf(Math.min(...distances)); //index of the closest centroid by using the indexOf() and Math.min find mi
            // Assign the data point to the closest cluster
            clusters[closestCentroid].push(data[i]);
        }
        // Update centroids
        let newCentroids = [];
        for (let i = 0; i < n; i++) {
            let cluster = clusters[i];
            // Calculate the sum of coordinates for all points in the cluster
            let centroidSum = cluster.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), { x: 0, y: 0 });
            // Calculate the new centroid coordinates by averaging the sum
            let centroid = {
                var1: centroidSum.x / cluster.length,
                var2: centroidSum.y / cluster.length
            };
            // Store the new centroid
            newCentroids.push(centroid);
        }
        // Check for convergence by comparing the distances between old and new centroids
        converged = true;
        for (let i = 0; i < n; i++) 
        {
            if (the_distance(centroids[i], newCentroids[i]) > 0.0001) 
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

function the_distance(point1, point2) {
    // Euclidean distance between two points
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}
    // random RGB colors
function get_color_rondomly() {
    // Generate a random RGB color string
    const red = Math.floor(Math.random() * 256);    // give the number and multiply it by 256   and round it
    const green = Math.floor(Math.random() * 256);   // give the number and multiply it by 256 and round it 
    const blue = Math.floor(Math.random() * 256);   // give the number and multiply it by 256 and round it
    return `rgb(${red}, ${green}, ${blue})`;
}
//    click start and go head!
function startButton() {
    // Run k-means clustering
    var number_of_clusters = document.getElementById("clusterNum").value;
    const clusters = k_Means(points, number_of_clusters);
    // Draw clusters in different colors
    for (let i = 0; i < clusters.length; i++) {
        const color = get_color_rondomly();
        for (let j = 0; j < clusters[i].length; j++) {
            const { x, y } = clusters[i][j];
            context.fillStyle = color;
            context.beginPath();
            context.arc(x - 8, y - 8, 5, 0, Math.PI * 2);
            context.fill();
        }
    }
}
    // delete data
function clearButton() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
}