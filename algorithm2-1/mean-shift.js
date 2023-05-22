
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

canvas.addEventListener('mousedown', handleMouseDown);

var points = [];
function handleMouseDown(event) {
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(x - 8, y - 8, 5, 0, Math.PI * 2);
    context.fill();
    points.push({ X: x, Y: y });
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

            numeratorSum[0] += data[i].X * weight;
            numeratorSum[1] += data[i].Y * weight;
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


// function getRandomColor() {
//     // Generate a random RGB color string
//     const r = Math.floor(Math.random() * 256);
//     const g = Math.floor(Math.random() * 256);
//     const b = Math.floor(Math.random() * 256);
//     return `rgb(${r}, ${g}, ${b})`;
// }

function startButton() {
  // Get the number of clusters from the input field
  var numClusters = parseInt(document.getElementById('clusterNum').value);

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Perform mean shift clustering on the points
  var clusters = meanShiftClustering(points, 60, 0.0001);

  // Generate an array of distinct colors based on the number of clusters
  var colors = generateDistinctColors(numClusters);

  // Visualize the clusters with different colors
  for (let i = 0; i < clusters.length; i++) {
      const color = colors[i % colors.length]; // Get the color based on the index

      for (let j = 0; j < clusters[i].length; j++) {
          const x = clusters[i][j].X;
          const y = clusters[i][j].Y;

          // Set the fill style to the cluster color
          context.fillStyle = color;
          context.beginPath();
          context.arc(x - 8, y - 8, 8, 0, Math.PI * 2);
          context.fill();
      }
  }
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


function clearButton() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
}
