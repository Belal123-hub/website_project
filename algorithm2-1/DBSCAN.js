// Canvas setup
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
canvas.addEventListener('mousedown', handleMouseDown);

var points = [];
function handleMouseDown(event) {
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - 8, y - 8, 5, 0, Math.PI * 2);
    ctx.fill();
    points.push({ x, y });
    console.log(points);
}

// DBSCAN algorithm
function dbscan(data, epsilon, minPoints) {
  const clusters = [];
  const visited = new Set();

  // Helper function to calculate distance between two points
  function distance(pointA, pointB) {
    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Helper function to get neighbors of a point
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
  function expandCluster(point, neighbors, clusterId) {
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
      ctx.fillStyle = color;
  
      for (const point of cluster) {
        ctx.beginPath();
        ctx.arc(point.x - 8, point.y - 8, 5, 0, Math.PI * 2);
        ctx.fill();
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
}
    