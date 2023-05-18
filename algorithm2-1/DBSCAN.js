// Canvas setup
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const width = canvas.width;   // null 
const height = canvas.height;  // null
canvas.addEventListener('mousedown', handleMouseDown);  // to handle the data on convas according to mouse coordinates

var points = [];        // initial value for an array
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
  console.log(points);
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

// Generate random data points
function generateDataPoint() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
  };
}

// Parameters for DBSCAN
const epsilon = 10;
const minPoints = 2;

// Perform DBSCAN clustering
function startButton() {
    const data = [];
    for (let i = 0; i < 200; i++) {
      data.push(generateDataPoint());
    }
    // Run DBSCAN clustering
    const clusters = dbscan(points, epsilon, minPoints);
  
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
  
  // Helper function to generate unique colors for each cluster
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
  
function clearButton() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
}
    