var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
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
    context.fillStyle = 'pink';  // lets consider black 
    // Start a new path
    context.beginPath();
    // Draw a filled circle (point) on the canvas
    context.arc(coordin1 - 8, coordin2 - 8, 5, 0, Math.PI * 2);
    // Fill the circle with the defined fill style
    context.fill();
    // Store the coordinates of the point in the points array
    points.push({ x: coordin1, y: coordin2 });
    console.log(points);
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
function meanShiftClustering(data, bandwidth) {
  var shiftedPoints = data.slice();
  var convergenceThreshold = 0.0001;

  function gaussianKernel(distance, bandwidth) {
    var radius = distance / bandwidth;
    var coefficient = 1 / (bandwidth * Math.sqrt(2 * Math.PI));
    return coefficient * Math.exp(-0.5 * radius * radius);
  }

  function euclideanDistance(point1, point2) {
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
  }

  function shiftPoint(point) {
    var shift = { x: 0, y: 0 };
    var shiftTotal = 0;

    for (var i = 0; i < data.length; i++) {
      var distance = euclideanDistance(point, data[i]);
      var weight = gaussianKernel(distance, bandwidth);
      shift.x += weight * data[i].x;
      shift.y += weight * data[i].y;
      shiftTotal += weight;
    }

    point.x = shift.x / shiftTotal;
    point.y = shift.y / shiftTotal;
  }

  var converged = false;

  while (!converged) {
    converged = true;

    for (var i = 0; i < shiftedPoints.length; i++) {
      var oldPoint = Object.assign({}, shiftedPoints[i]);
      shiftPoint(shiftedPoints[i]);
      var distance = euclideanDistance(oldPoint, shiftedPoints[i]);

      if (distance > convergenceThreshold) {
        converged = false;
      }
    }
  }

  return shiftedPoints;
}

function the_distance(point1, point2) {
    // Euclidean distance between two points
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

// DBSCAN algorithm
function dbscan(data, epsilon, minPoints) 
{
  const clusters = [];
  const visited = new Set();   // to keep track of points that have been visited 
  // Helper function to calculate distance between two points
  function distance(pointA, pointB) {
    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Helper function to get neighbors of a point // find neighbours
  function getNeighbors(point) {
    const neighbors = [];
    for (const other of data) {
      if (distance(point, other) <= epsilon) {
        neighbors.push(other);
      }
    }
    return neighbors;
  }

  // Helper function to expand a cluster
  function expandCluster(point, neighbors, clusterId) 
  {
    clusters[clusterId].push(point);
    visited.add(point);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        const neighborNeighbors = getNeighbors(neighbor);
        if (neighborNeighbors.length >= minPoints) {
          neighbors.push(...neighborNeighbors);
        }
      }

      // Add the point to the cluster if it doesn't belong to any cluster
      let isInCluster = false;
      for (const cluster of clusters) {
        if (cluster.includes(neighbor)) {
          isInCluster = true;
          break;
        }
      }
      if (!isInCluster) {
        clusters[clusterId].push(neighbor);
      }
    }
  }

  let clusterId = 0;

  // Main clustering loop
  for (const point of data) {
    if (visited.has(point)) continue;
    visited.add(point);

    const neighbors = getNeighbors(point);

    if (neighbors.length < minPoints) {
      clusters.push([point]); // Noise point
    } else {
      clusters.push([]);
      expandCluster(point, neighbors, clusterId);
      clusterId++;
    }
  }
  return clusters;
}


// Parameters for DBSCAN
const epsilon = 10;
const minPoints = 2;
//    click start and go head!
function startButton() {
    var algo = document.getElementById("algorithmSelector").value;
    let clusters;
    var number_of_clusters;

    if (algo=="k-means-main.js") {
      //console.log("k means");
        number_of_clusters = document.getElementById("clusterNum").value;
        clusters = k_Means(points, number_of_clusters);
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
    if (algo=="DBSCAN.js") {

        clusters = dbscan(points, epsilon, minPoints);
        const numClusters = document.getElementById("clusterNum").value;
        const colors = generateColors(numClusters); // Generate unique colors for each cluster
      
        for (let i = 0; i < clusters.length; i++) {
          const cluster = clusters[i];
          const color = colors[i];
          context.fillStyle = color;
      
          for (const point of cluster) {
            context.beginPath();
            context.arc(point.x - 8, point.y - 8, 5, 0, Math.PI * 2);
            context.fill();
          }
        }

    } 
    else {
//
number_of_clusters = document.getElementById("clusterNum").value;

clusters = meanShiftClustering(points, number_of_clusters);
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
}
function get_color_rondomly() {
  // Generate a random RGB color string
  const red = Math.floor(Math.random() * 256);    // give the number and multiply it by 256   and round it
  const green = Math.floor(Math.random() * 256);   // give the number and multiply it by 256 and round it 
  const blue = Math.floor(Math.random() * 256);   // give the number and multiply it by 256 and round it
  return `rgb(${red}, ${green}, ${blue})`;
}
function generateColors(numClusters) {
const colors = [];
const hueStep = 360 / numClusters;
for (let i = 0; i < numClusters; i++) {
  const hue = i * hueStep;
  const color = `hsl(${hue}, 100%, 50%)`;
  colors.push(color);
}
return colors;
}
    // delete data
function clearButton() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
}