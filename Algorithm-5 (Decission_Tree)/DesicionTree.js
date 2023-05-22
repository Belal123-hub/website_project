class Node {
    constructor(nodeName, atribute, atributeNumber) {
        this.nodeName = nodeName; // The name of the node
        this.data = []; // The data associated with the node
        this.branches = []; // The branches of the node
        this.atribute = atribute; // The attribute of the node
        this.atributeNumber = atributeNumber; // The number of the attribute
        this.a; // An HTML element associated with the node (not defined in the code)
        this.wasPainted = false; // Indicates whether the node was painted or not
    }

    isLeaf() {
        if (this.branches == undefined) { // If the branches are not defined
            return true;
        }
        else if (this.branches.length == 0) { // If the number of branches is zero
            return true;
        }

        return false;
    }
}

let root; // The root node of the decision tree
let uniqueResults = []; // An array to store unique results

async function bypassTree() {
    // Retrieves input data from an HTML element with the ID 'input_data'
    let str = document.getElementById('input_data').value;
    array = parseCSVtoArray(str); // Parses the input data into an array
    let currentNode = root; // Sets the current node to the root
    let counter = root.data[0].length; // Counter variable to avoid infinite loops

    while(true) {
        if(!currentNode.wasAdded){
            currentNode.wasAdded = true;
            await gradient('rgb(100, 100, 100)', 'rgb(49, 160, 111)', currentNode);
            await sleep(100);
        }

        for(let j = 0; j<currentNode.branches.length; j++) {
            // Checks if the current branch matches the attribute value in the input array
            if((currentNode.branches[j].nodeName === array[currentNode.branches[j].atributeNumber])||
               (currentNode.branches[j].atributeNumber === root.data[0].length-1)) {
                currentNode = currentNode.branches[j]; // Moves to the next node
                break;
            }
        }

        // Checks if the current node is a leaf node and its attribute matches the result in the input array
        if((currentNode.atribute === root.data[0][root.data[0].length-1])&&(!currentNode.wasPainted)) {
            currentNode.wasPainted = true;
            await gradient('rgb(100, 100, 100)', 'rgb(49, 160, 111)', currentNode); // Applies a gradient effect to the node
            break;
        }

        counter--;
        if(counter<0) {
            alert("No result !");
            break;
        }
    }
}

async function gradient(start_RGB, finish_RGB, node) {
    let rgb = getRGB(start_RGB); // Retrieves RGB values from a string
    start_RGB = getRGB(start_RGB);
    finish_RGB = getRGB(finish_RGB);

    for(let i = 0; i<150; i++) {
        for(let j = 0; j<3; j++) {
            rgb[j] -= (start_RGB[j] - finish_RGB[j])/150; // Calculates intermediate RGB values
        }

        node.a.style.backgroundColor = 'rgb('+ rgb[0] +','+ rgb[1] +','+ rgb[2] +')'; // Sets the background color of the associated HTML element
        await sleep(1); // Pauses the execution for 1 millisecond
    }
} 

function getRGB(str){
    let regex = /\d{1,3}/;
    let rgb = [];

    for(let i = 0; i<3; i++) {
        rgb[i] = parseFloat(regex.exec(str)); // Retrieves the numeric values from the string using regular expressions
        str = str.replace(regex, "");
    }

    return rgb;
}

function sleep(ms) { 
   return new Promise(resolve => setTimeout(resolve, ms)); // Returns a promise that resolves after a specified time
} 

function buildTree(data) {
    root = new Node("root"); // Creates the root node
    root.data = data; // Sets the data of the root node

    for(let i = 1; i<root.data.length; i++) {
        uniqueResults[i - 1] = root.data[i][root.data[i].length-1]; // Stores unique result values
    }

    uniqueResults = getUniqueAtributes(uniqueResults); // Retrieves unique attribute values
    growBranch(root); // Builds the decision tree by growing branches
}

function growBranch(currentNode) { 
    currentNode.branches = getArrayOfBranches(currentNode.data); // Retrieves an array of branches for the current node

    for(let i = 0; i<currentNode.branches.length; i++) {
        let nextNode = currentNode.branches[i];

        for(let j = 0; j < currentNode.data.length; j++) {
            if((j === 0) || (currentNode.data[j][currentNode.branches[i].atributeNumber] === currentNode.branches[i].nodeName)) {
                nextNode.data[nextNode.data.length] = []; // Adds a new row to the data of the next node

                for(let k = 0; k<currentNode.data[j].length; k++) {
                    nextNode.data[nextNode.data.length-1][k] = currentNode.data[j][k]; // Copies data from the current node to the next node
                }
            }
        }

        // Checks if the next node is a leaf node or the last attribute in the data
        if ((nextNode.data.length === 1)||(nextNode.atributeNumber === nextNode.data[0].length - 1)){
            return;
        }

        growBranch(nextNode); // Recursively grows branches for the next node
    }
}

function getArrayOfBranches(data) {
    let gain = calculateGain(data); // Calculates the gain for each attribute
    let atr = getUniqueAtributes(getColumnInMatrix(data, getIndexOfMaxElement(gain))); // Retrieves unique attribute values
    let branches = [];

    for (let i = 1; i < atr.length; i++) {
        branches[i-1] = new Node(atr[i], data[0][getIndexOfMaxElement(gain)], getIndexOfMaxElement(gain)); // Creates new branches with attribute values
        if (gain.length === 1) {
            branches[i-1].nodeName = data[1][data[0].length - 1]; // Sets the name of the branch to the result if there is only one attribute
        }
    }

    return branches;
}

function getIndexOfMaxElement(array) {
    let max = -1;
    let ind;

    for (let i = 0; i < array.length; i++) {
        if (max <= array[i]) {
            max = array[i];
            ind = i;
        }
    }

    return ind;
}

function calculateGain(data) {
    let resultEntropy = countningUniqeAtributesByResult(getColumnInMatrix(data, data[0].length - 1), 
                                                        getColumnInMatrix(data, data[0].length - 1)); // Calculates the entropy based on the result column
    let entropy = calculateEntropy(data); // Calculates the entropy for each attribute
    let gain = [];

    if (resultEntropy.length === 2) {
        for(let i = 0; i<data[0].length; i++) {
            gain[i] = 0;
        }

        return gain;
    }

    for (let i = 0; i < entropy.length; i++) {
        positive = 1;
        negative  = 2;

        if (resultEntropy[1][0] !== uniqueResults[0]) {
            positive, negative = negative, positive; // Swaps the values of positive and negative if the result values are different
        }

        positive = resultEntropy[positive][1] / (data.length - 1); // Calculates the positive value
        negative = resultEntropy[negative][2] / (data.length - 1); // Calculates the negative value

        gain[i] = -(positive) * Math.log2(positive + 0.0000001) - (negative) * Math.log2(negative + 0.0000001); // Calculates the gain for each attribute

        for (let j = 0; j < entropy[i].length; j++) {
            gain[i] = gain[i] - entropy[i][j] / (data.length - 1); // Updates the gain value
        }
    }

    return gain;
}

function calculateEntropy(data) {
    let entropy = [];

    for(let i = 0; i<data[0].length - 1; i++) {
        let unique = countningUniqeAtributesByResult(getColumnInMatrix(data, i), getColumnInMatrix(data, data[0].length - 1)); // Calculates unique attribute values
        entropy[i] = [];

        for(let j = 1; j<unique.length; j++) {
            let positive = unique[j][1] / (unique[j][1] + unique[j][2]); // Calculates the positive value
            positive = - positive * Math.log2(positive + 0.0000001); // Calculates the positive entropy
            let negtive = unique[j][2] / (unique[j][1] + unique[j][2]); // Calculates the negative value
            negtive = - negtive * Math.log2(negtive + 0.00000001); // Calculates the negative entropy
            entropy[i][j - 1] = (positive + negtive) * (unique[j][1] + unique[j][2]); // Calculates the entropy for each attribute value
        }
    }

    return entropy;
}

function getColumnInMatrix(matrix, columnNumber) {
    let array = [];

    for(let i = 0; i<matrix.length; i++) {
        array[i] = matrix[i][columnNumber]; // Retrieves the values from the specified column in the matrix
    }

    return array;
}

// function that returns matrix which contains all unique values and count of them relative to results
function countningUniqeAtributesByResult(array, result) {
    let matrix = [];
    uniqueAtributes = getUniqueAtributes(array); // Retrieves unique attribute values

    for (let i = 0; i < uniqueAtributes.length; i++) {
        matrix[i] = [];
        matrix[i][0] = uniqueAtributes[i];

        for (let j = 0; j < uniqueResults.length; j++) {
            matrix[i][j + 1] = 0; // Initializes the count of attribute values relative to results
        }
    }

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < uniqueAtributes.length; j++) {
            if (array[i] === uniqueAtributes[j]) {
                for (let k = 0; k < uniqueResults.length; k++) {
                    if (result[i] === uniqueResults[k]) {
                        matrix[j][k + 1]++; // Updates the count of attribute values relative to results
                    }
                }
            }
        }
    }

    return matrix;
}

function getUniqueAtributes(array) {
    let unique = [];
    let counter = 0;

    for (let i = 0; i < array.length; i++) {
        if (unique.indexOf(array[i]) === -1) {
            unique[counter++] = array[i]; // Retrieves unique attribute values
        }
    }

    return unique;
}

