
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
function get_color_rondomly() {
  // Generate a random RGB color string
  const red = Math.floor(Math.random() * 256);    // give the number and multiply it by 256   and round it
  const green = Math.floor(Math.random() * 256);   // give the number and multiply it by 256 and round it 
  const blue = Math.floor(Math.random() * 256);   // give the number and multiply it by 256 and round it
  return `rgb(${red}, ${green}, ${blue})`;
}

function renderPoints(points, color) {
  context.fillStyle = color;

  for (var i = 0; i < points.length; i++) {
    context.beginPath();
    context.arc(points[i].x - 8, points[i].y - 8, 5, 0, Math.PI * 2);
    context.fill();
  }
}

function startButton() {
  var number_of_clusters = document.getElementById('clusterNum').value;
  var bandwidth = parseFloat(document.getElementById('bandwidth')).value;
  var shiftedPoints = meanShiftClustering(points, bandwidth);
  var clusters = meanShiftClustering(shiftedPoints, bandwidth);

  for (var i = 0; i < clusters.length; i++) {
    var color = get_color_rondomly();
    console.log(color);
    renderPoints(clusters[i], color);
  }
}

function clearButton() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  points = [];
}
