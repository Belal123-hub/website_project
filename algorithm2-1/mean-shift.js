canvas = document.getElementById("myCanvas");
context = canvas.getContext("2d");

canvas.addEventListener('mousedown', handleMouseDown);

var points = [];

function handleMouseDown(event) {
  var coordin1 = event.clientX - canvas.offsetLeft;
  var coordin2 = event.clientY - canvas.offsetTop;
  context.fillStyle = 'black';
  context.beginPath();
  context.arc(coordin1 - 8, coordin2 - 8, 5, 0, Math.PI * 2);
  context.fill();
  points.push({ x: coordin1, y: coordin2 });
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
    var dx = point1.x - point2.x;
    var dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
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

  // Assign cluster indices to points
  var clusterIndex = 0;
  for (var i = 0; i < shiftedPoints.length; i++) {
    if (!shiftedPoints[i].clusterIndex) {
      assignCluster(shiftedPoints[i], clusterIndex);
      clusterIndex++;
    }
  }

  function assignCluster(shiftedPoints, data, bandwidth) {
    for (var i = 0; i < shiftedPoints.length; i++) {
      var shift = { x: 0, y: 0 };
      var shiftTotal = 0;
  
      for (var j = 0; j < data.length; j++) {
        var distance = euclideanDistance(shiftedPoints[i], data[j]);
        var weight = gaussianKernel(distance, bandwidth);
        shift.x += weight * data[j].x;
        shift.y += weight * data[j].y;
        shiftTotal += weight;
      }
  
      shiftedPoints[i].x = shift.x / shiftTotal;
      shiftedPoints[i].y = shift.y / shiftTotal;
    }
  }
  

  return shiftedPoints;
}


function get_color_randomly() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
}

function renderPoints(points, color) {
  for (var i = 0; i < points.length; i++) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(points[i].x - 8, points[i].y - 8, 5, 0, Math.PI * 2);
    context.fill();
  }
}
function testColorFunction() {
  var color = get_color_randomly();
  console.log(color);
}

// Call the test function to check the color output
testColorFunction();
testColorFunction();

function startButton() {
  var number_of_clusters = document.getElementById('clusterNum').value;
  var clusters = meanShiftClustering(points, number_of_clusters);

  var clusteredPoints = [];
  for (var i = 0; i < number_of_clusters; i++) {
    clusteredPoints.push([i]);
  }

  for (var i = 0; i < clusters.length; i++) {
    var clusterIndex = clusters[i].clusterIndex;
    clusteredPoints[clusterIndex].push(clusters[i]);
  }

  for (var i = 0; i < clusteredPoints.length; i++) {
    var color = get_color_randomly();
    renderPoints(clusteredPoints[i], color);
  }
}

function clearButton() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  points = [];
}

