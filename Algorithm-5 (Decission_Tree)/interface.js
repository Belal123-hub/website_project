// Event listeners for buttons
start_button.addEventListener('click', start);
reset_button.addEventListener('click', reset);
getFile_button.addEventListener('click', createTree);

// Input file element
const FILE = document.getElementById('file_input');

// Flag to track if the tree has been created
let flag = true;

// Set initial input data value
document.getElementById('input_data').value = "overcast,hot,high,FALSE,yes";

// Build the initial tree with provided data
buildTree(getData(0));

// Get the root element for the tree visualization
let treeRoot = document.getElementById("root");

// Event handler for creating the tree
function createTree() {
    treeRoot = removeTree(); // Remove existing tree
    if (FILE.value === '') {
        buildTree(getData(0)); // Build tree with default data
        drawTree(root, treeRoot); // Draw the tree visualization
    } else {
        let data = FILE.files[0];
        let reader = new FileReader();
        reader.readAsText(data);
        console.log(data);
        reader.onload = function () {
            data = parseCSVtoMatrix(reader.result); // Parse CSV data into a matrix
            buildTree(data); // Build tree with the parsed data
            drawTree(root, treeRoot); // Draw the tree visualization
        }
    }
    flag = true;
}

// Event handler for starting the tree traversal
function start() {
    if (flag) {
        bypassTree(); // Traverse the tree
        flag = false;
    }
}

// Event handler for resetting the tree
function reset() {
    treeRoot = removeTree(treeRoot); // Remove existing tree and reset the tree root
}

// Function to draw the tree visualization
function drawTree(currentNode, treeElement) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    currentNode.a = a;
    a.href = "#";
    let nodeName = currentNode.nodeName;
    let atr = currentNode.atribute;
    if (nodeName === "root") {
        a.textContent = nodeName;
    } else {
        a.textContent = atr + " = " + nodeName;
    }

    li.appendChild(a);
    treeElement.appendChild(li);

    if (currentNode.isLeaf()) {
        return;
    }

    let ul = document.createElement("ul");
    li.appendChild(ul);

    for (let i = 0; i < currentNode.branches.length; i++) {
        drawTree(currentNode.branches[i], ul); // Recursively draw branches of the tree
    }
}

// Function to remove the existing tree
function removeTree() {
    let divTree = document.getElementById("tree");
    treeRoot.remove();
    let ul = document.createElement("ul");
    divTree.appendChild(ul);
    return ul;
}

// Draw the initial tree visualization
drawTree(root, treeRoot);
