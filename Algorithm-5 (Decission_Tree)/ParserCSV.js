function parseCSVtoMatrix(strCSV) {
    let buff = parseCSVtoArray(strCSV);
    return transformArrayToMatrix(buff);
}

function parseCSVtoArray(strCSV) {
    try {
        let data = []; // Array to store parsed data
        let regex = /("([^"]|"")*"|([^",\r\n]*))?(,|\r\n)?/; // Regular expression to match CSV format
        let size = 0; // Number of columns in the CSV data
        let check = false; // Flag to track the first row
        while (regex.test) {
            let buff = regex.exec(strCSV); // Extract the next CSV value
            if (buff[0] === "") {
                break; // Break the loop if there are no more values
            }
            let current = buff[1]; // Current value extracted from CSV
            if (buff[1][0] === '"') {
                current = "";
                for (let i = 1; i < buff[1].length - 1; i++) {
                    current += buff[1][i]; // Remove quotes from the value
                }
            }
            data[data.length] = current; // Add the current value to the data array
            if ((!check) && (buff[4] === '\r\n')) {
                check = true;
                size++; // Increase the column count if it's the first row
            } else {
                if (!check) {
                    size++; // Increase the column count for other rows
                }
            }
            strCSV = strCSV.replace(regex, ""); // Remove the extracted value from the CSV string
        }

        data[data.length] = size; // Add the column count to the data array
        return data; // data = [yourData,yourData,yourData,yourData..., rowSize]
    } catch {
        alert("Your test is uncorrect"); // Display an alert if an error occurs
        return;
    }
}

function transformArrayToMatrix(array) {
    let matrix = [];
    let count = 0;
    for (let i = 0; i < (array.length - 1) / array[array.length - 1]; i++) {
        matrix[i] = [];
        for (let j = 0; j < array[array.length - 1]; j++) {
            matrix[i][j] = array[count]; // Populate the matrix with values from the array
            count++;
        }
    }
    return matrix; // Return the resulting matrix
}
