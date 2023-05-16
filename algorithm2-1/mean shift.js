function meanShift(points, radius) {
    // Initialize the cluster centers to be the same as the input points
    let centers = points.slice();
  
    // Define a kernel function that determines the weight of nearby points
    function kernel(distance) {
      return Math.max(0, 1 - distance / radius);
    }
  
    // Define a distance function that calculates the Euclidean distance between two points
    function distance(a, b) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.sqrt(dx*dx + dy*dy);
    }
  
    // Define a function that finds the new center for a single point
    function findCenter(point) {
      let sumX = 0;
      let sumY = 0;
      let sumWeight = 0;
  
      // Loop over all points and calculate their weight and contribution to the new center
      for (let i = 0; i < points.length; i++) {
        const d = distance(point, points[i]);
        const w = kernel(d);
        sumX += points[i].x * w;
        sumY += points[i].y * w;
        sumWeight += w;
      }
  
      // Calculate the new center based on the weighted contributions of nearby points
      return { x: sumX / sumWeight, y: sumY / sumWeight };
    }
  
    // Loop over all centers and find their new locations
    for (let i = 0; i < centers.length; i++) {
      centers[i] = findCenter(centers[i]);
    }
  
    return centers;
  }
  
  function drawPoints(points) {
    const ctx = canvas.getContext('2d');
  
    // Draw each point as a small circle
    for (let i = 0; i < points.length; i++) {
      const { x, y } = points[i];
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  function drawClusters(clusters) {
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
    const ctx = canvas.getContext('2d');
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw each cluster using a different color
    for (let i = 0; i < clusters.length; i++) {
      const color = colors[i % colors.length];
      const cluster = clusters[i];
  
      for (let j = 0; j < cluster.length; j++) {
        const { x, y } = cluster[j];
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  function clearButton() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
  }
  
  // Example usage:
  let points = [];
  
  canvas.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    points.push({ x, y });
  
    // Draw the points on the canvas
    drawPoints(points);
  
    // Run Mean Shift clustering on the points
    const clusters = meanShift(points, 50);
  
    // Draw
