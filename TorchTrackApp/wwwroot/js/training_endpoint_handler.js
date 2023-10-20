"use strict";

const BASE_URL = "https://localhost:7032/api/TorchTrack/";
const FETCH_ERROR = "Failed to fetch data: ";
const HTTP_ERROR = "HTTP error! Status: ";

let total = 0;
let count = 0

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/myhub")
    .build();


connection.on("ReceiveMessage", (data) => {
    console.log(data);
    load_training_bag();
    // Update the UI in real-time with the received data
});

connection.start()
    .then(() => {
        console.log("Connected to SignalR hub!");
        console.log("Connection ID:", connection.connectionId);
    })
    .catch(err => {
        console.error("Error starting the connection:", err);
    });

async function load_training_bag() {
    const url = `${BASE_URL}GetTraining`;

    try {
        // Fetch the partial view content
        const view_bag_result = await fetch("https://torchtrackapp.azurewebsites.net/TrainingBag");
        if (!view_bag_result.ok) {
            throw new Error('Failed to load TrainingBag partial view');
        }
        const htmlResult = await view_bag_result.text();

        // Before updating the content, hide it by setting opacity to 0
        const parentDataElement = document.getElementById("parent-data-id");
        parentDataElement.style.opacity = "0";  // Hide the content initially
        parentDataElement.innerHTML = htmlResult;

        // Fetch the training data
        const trainingDataResponse = await fetch("https://torchtrackapp.azurewebsites.net/api/TorchTrack/GetTraining");
        if (!trainingDataResponse.ok) {
            throw new Error('Failed to fetch training data');
        }
        const trainingData = await trainingDataResponse.json();

        // Process the training data
        trainingData.forEach((trainingRun, index) => {
            const parsedData = JSON.parse(trainingRun.model_training_data);
            const loss = calculateTotal(parsedData);

            total += loss;
            count++;

            displayTrainingRunData(index + 1, parsedData);
        });

        displayTotalAndAverage();

        // Trigger the fade-in effect with increased delay
        setTimeout(() => {
            parentDataElement.style.opacity = "1";
        }, 400);  // Increased delay for fade-in

    } catch (error) {
        console.error(error.message);
    }
}

async function get_training_data() {
    const url = `${BASE_URL}GetTraining`;
    try {
        const response = await fetch("https://torchtrackapp.azurewebsites.net/api/TorchTrack/GetTraining");
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
