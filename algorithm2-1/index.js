// script.js
function loadAlgorithm() {
    var select = document.getElementById("algorithmSelector");
    var algorithmPath = select.value;
  
    canvas = document.getElementById("myCanvas");
   context = canvas.getContext("2d");
  
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Load the selected algorithm
    var scriptElement = document.createElement('script');
    scriptElement.src = algorithmPath;
    document.body.appendChild(scriptElement);
  }
  