
const BASE_URL = "https://localhost:7032/api/TorchTrack/";
const FETCH_ERROR = "Failed to fetch data: ";
const HTTP_ERROR = "HTTP error! Status: ";

let total = 0;
let count = 0

// Async function to fetch training data
async function get_training_data() {
    const url = `${BASE_URL}GetTraining`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${HTTP_ERROR} ${response.status}`);
        }

        const data = await response.json();
        // Assuming data is an array of training runs
        data.forEach((trainingRun, index) => {
            const parsedData = JSON.parse(trainingRun.model_training_data);
            const loss = calculateTotal(parsedData); // Calculate the total

            total += loss;
            count++;

            displayTrainingRunData(index + 1, parsedData);
        });

        displayTotalAndAverage();
    } catch (error) {
        console.error(FETCH_ERROR, error.message);
    }
}

// Function to calculate the total of numeric values
function calculateTotal(data) {
    let sum = 0;
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            const keyData = data[key];
            for (let subKey in keyData) {
                if (keyData.hasOwnProperty(subKey) && subKey === 'loss') {
                    // Assuming 'loss' is the numeric field to sum
                    sum += parseFloat(keyData[subKey]);
                }
            }
        }
    }
    return sum;
}

// Function to display training run data
function displayTrainingRunData(trainingRunNumber, data) {
    const container = document.getElementById('card-id');
    const trainingRunHeading = document.createElement('div');
    trainingRunHeading.classList.add('collapsible');
    trainingRunHeading.innerHTML = `<button class="btn btn-secondary">Training Loop: ${trainingRunNumber}</button>`;

    // Create a collapsible content div for training data
    const trainingDataDiv = document.createElement('div');
    trainingDataDiv.classList.add('content');

    // Iterate through the numeric keys (e.g., 10, 20, 30)
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            const keyData = data[key];
            // Display the numeric key with a custom class for styling
            const keyDataHTML = document.createElement('h5');
            keyDataHTML.classList.add('numeric-key');
            keyDataHTML.textContent = `${key}:`;

            for (let subKey in keyData) {
                if (keyData.hasOwnProperty(subKey)) {
                    // Display the values within the objects with a custom class for styling
                    const subKeyValueHTML = document.createElement('h4');
                    subKeyValueHTML.classList.add('value');
                    subKeyValueHTML.textContent = `${subKey}: ${keyData[subKey]}`;
                    keyDataHTML.appendChild(subKeyValueHTML);
                }
            }

            trainingDataDiv.appendChild(keyDataHTML);
        }
    }

    trainingRunHeading.appendChild(trainingDataDiv);
    container.appendChild(trainingRunHeading);

    // Add click event to toggle visibility of training data
    trainingRunHeading.addEventListener('click', function () {
        trainingDataDiv.style.display = trainingDataDiv.style.display === 'block' ? 'none' : 'block';
    });
}

// Function to display the total
function displayTotalAndAverage() {
    const totalContainer = document.getElementById('analytics-card-body-id');
    const totalHTML = document.createElement('h5');

    totalHTML.classList.add('total');
    totalHTML.textContent = `Total Loss: ${total.toFixed(2)}`; // Display total with two decimal places

    const averageLoss = total / count;

    const averageHTML = document.createElement('h5');
    averageHTML.classList.add('total');
    averageHTML.textContent = ` Average Loss: ${averageLoss.toFixed(2)}`; // Display average with two decimal places

    totalContainer.appendChild(totalHTML);
    totalContainer.appendChild(averageHTML);
}

// Call the async function to fetch and display training data
get_training_data();
