var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
canvas.addEventListener('mousedown', handleMouseDown);   // Add a mousedown event listener to the canvas and call  handleMouseDown function

var points = [];   // Array to store the points

/**
 * Event handler for the mousedown event on the canvas
 *  /*@ param: This annotation is used in JSDoc to document a function parameter
 *                            {MouseEvent}: This specifies the type of the parameter
 */
function handleMouseDown(event) {
    // Calculate the mouse coordinates relative to the canvas
    var coordin1 = event.clientX - canvas.offsetLeft;
    var coordin2 = event.clientY - canvas.offsetTop;
    // Set the fill style to black
    context.fillStyle = 'pink';
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
function meanShiftClustering(data, kernelBandwidth, convergenceThreshold) {
  // Create a copy of the data points to avoid modifying the original array

  // Initialize an array to store the mean shift vectors
  let meanShiftVectors = new Array(data.length).fill([0, 0]);
  // Function to calculate the Euclidean distance between two points
  function euclideanDistance(a, b) {
      return Math.sqrt((a.X - b.X) ** 2 + (a.Y - b.Y) ** 2);
  }

  // Function to compute the Gaussian kernel
  function gaussianKernel(distance, bandwidth) {
      let exponent = -(distance * distance) / (2 * bandwidth * bandwidth);
      return Math.exp(exponent);
  }

  // Function to compute the mean shift vector for a single point
  function computeMeanShiftVector(point, data, kernelBandwidth) {
      let numeratorSum = [0, 0];
      let denominatorSum = 0;

      for (let i = 0; i < data.length; i++) {
          let distance = euclideanDistance(point, data[i]);
          let weight = gaussianKernel(distance, kernelBandwidth);

          numeratorSum[0] += data[i].x * weight;
          numeratorSum[1] += data[i].y * weight;
          denominatorSum += weight;
      }

      let meanShiftX = numeratorSum[0] / denominatorSum - point.X;
      let meanShiftY = numeratorSum[1] / denominatorSum - point.Y;

      return [meanShiftX, meanShiftY];
  }

  // Perform mean shift iterations until convergence
  let hasConverged = false;
  while (!hasConverged) {
      let maxShiftMagnitude = 0;

      // Compute mean shift vectors for all points
      for (let i = 0; i < data.length; i++) {
          let meanShiftVector = computeMeanShiftVector(
              data[i],
              data,
              kernelBandwidth
          );
          meanShiftVectors[i] = meanShiftVector;

          let shiftMagnitude = euclideanDistance([0, 0], meanShiftVector);
          if (shiftMagnitude > maxShiftMagnitude) {
              maxShiftMagnitude = shiftMagnitude;
          }
      }

      // Shift points towards higher density regions
      for (let i = 0; i < data.length; i++) {
          data[i].X += meanShiftVectors[i][0];
          data[i].Y += meanShiftVectors[i][1];
      }

      // Check convergence
      if (maxShiftMagnitude < convergenceThreshold) {
          hasConverged = true;
      }
  }

  // Assign points to clusters based on proximity
  // Assign points to clusters based on proximity
  let clusters = [];
  for (let i = 0; i < points.length; i++) {
      let clusterAssigned = false;

      for (let j = 0; j < clusters.length; j++) {
          let centroid = clusters[j].centroid;
          let distance = euclideanDistance(points[i], centroid);

          if (distance < kernelBandwidth) {
              clusters[j].points.push(points[i]);
              clusterAssigned = true;
              break;
          }
      }

      if (!clusterAssigned) {
          clusters.push({
              centroid: points[i],
              points: [points[i]],
          });
      }
  }

  // Extract the points from each cluster into a separate array
  let clusterPoints = clusters.map(cluster => cluster.points.map(point => point));

  return clusterPoints;
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
        number_of_clusters= document.getElementById("clusterNum").value;
        const colors = generateColors(number_of_clusters); // Generate unique colors for each cluster
      
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
    if (algo=="mean-shift.js") {
      // Get the number of clusters from the input field
      number_of_clusters = parseInt(document.getElementById('clusterNum').value);

      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Perform mean shift clustering on the points
      clusters = meanShiftClustering(points, 60, 0.0001);

      // Generate an array of distinct colors based on the number of clusters
      var colors = generateDistinctColors(number_of_clusters);

      // Visualize the clusters with different colors
      for (let i = 0; i < clusters.length; i++) {
          const color = colors[i % colors.length]; // Get the color based on the index

          for (let j = 0; j < clusters[i].length; j++) {
              const x = clusters[i][j].x;
              const y = clusters[i][j].y;

              // Set the fill style to the cluster color
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
function generateDistinctColors(numColors) {
  var colors = [];

  // Generate distinct RGB colors
  for (let i = 0; i < numColors; i++) {
      const hue = (i * 360) / numColors;
      const saturation = 100;
      const lightness = 50;
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      colors.push(color);
  }

  return colors;
}
    // delete data
function clearButton() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
}