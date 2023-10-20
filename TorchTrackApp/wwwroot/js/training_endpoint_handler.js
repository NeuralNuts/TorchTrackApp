"use strict";

const API_URL = "https://torchtrackapp.azurewebsites.net/api/TorchTrack/";
const BASE_URL = "https://torchtrackapp.azurewebsites.net/";
const FETCH_ERROR = "Failed to fetch data: ";
const HTTP_ERROR = "HTTP error! Status: ";

let total = 0;
let count = 0

const CONNECTION = new signalR.HubConnectionBuilder()
    .withUrl("/myhub")
    .build();

CONNECTION.on("ReceiveMessage", (data) => {
    console.log(data);
    load_training_bag();
});

CONNECTION.start()
    .then(() => {
        console.log("Connected to SignalR hub!");
        console.log("Connection ID:", CONNECTION.connectionId);
    })
    .catch(err => {
        console.error("Error starting the connection:", err);
    });

async function load_training_bag() {
    const URL = `${API_URL}GetTraining`;
    const TRAINING_BAG_URL = `${BASE_URL}TrainingBag`;

    try {
        const VIEW_BAG_RESULT = await fetch(URL);

        if (!VIEW_BAG_RESULT.ok) {
            throw new Error('Failed to load TrainingBag partial view');
        }
        const HTML_RESULT = await VIEW_BAG_RESULT.text();
        const PARENT_DATA_ELEMENT = document.getElementById("parent-data-id");

        PARENT_DATA_ELEMENT.style.opacity = "0"; 
        PARENT_DATA_ELEMENT.innerHTML = HTML_RESULT;

        const TRAINING_DATA_RESPONSE = await fetch(TRAINING_BAG_URL);

        if (!TRAINING_DATA_RESPONSE.ok) {
            throw new Error('Failed to fetch training data');
        }
        const TRAINING_DATA = await TRAINING_DATA_RESPONSE.json();

        TRAINING_DATA.forEach((trainingRun, index) => {
            const PARSED_DATA = JSON.parse(trainingRun.model_training_data);
            const LOSS = calculateTotal(PARSED_DATA);

            total += LOSS;
            count++;

            displayTrainingRunData(index + 1, PARSED_DATA);
        });
        displayTotalAndAverage();
        setTimeout(() => {
            PARENT_DATA_ELEMENT.style.opacity = "1";
        }, 400);  // Increased delay for fade-in

    } catch (error) {
        console.error(error.message);
    }
}

async function get_training_data() {
    const URL = `${API_URL}GetTraining`;

    try {
        const RESPONSE = await fetch(URL);

        if (!RESPONSE.ok) {
            throw new Error(`${HTTP_ERROR} ${RESPONSE.status}`);
        }
        const DATA = await RESPONSE.json();

        DATA.forEach((trainingRun, index) => {
            const PARSED_DATA = JSON.parse(trainingRun.model_training_data);
            const LOSS = calculateTotal(PARSED_DATA); // Calculate the total

            total += LOSS;
            count++;

            displayTrainingRunData(index + 1, PARSED_DATA);
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
                    sum += parseFloat(keyData[subKey]);
                }
            }
        }
    }
    return sum;
}

function displayTrainingRunData(trainingRunNumber, data) {
    const CONTAINER = document.getElementById('card-id');
    const TRAINING_RUN_HEADING = document.createElement('div');

    TRAINING_RUN_HEADING.classList.add('collapsible');
    TRAINING_RUN_HEADING.innerHTML = `<button class="btn btn-secondary">Training Loop: ${trainingRunNumber}</button>`;

    const TRAINING_DATA_DIV = document.createElement('div');

    TRAINING_DATA_DIV.classList.add('content');

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            const KEY_DATA = data[key];
            const KEY_DATA_HTML = document.createElement('h5');

            KEY_DATA_HTML.classList.add('numeric-key');
            KEY_DATA_HTML.textContent = `${key}:`;

            for (let subKey in KEY_DATA) {
                if (KEY_DATA.hasOwnProperty(subKey)) {
                    const SUB_KEY_VALUE_HTML = document.createElement('h4');

                    SUB_KEY_VALUE_HTML.classList.add('value');
                    SUB_KEY_VALUE_HTML.textContent = `${subKey}: ${KEY_DATA[subKey]}`;
                    KEY_DATA_HTML.appendChild(SUB_KEY_VALUE_HTML);
                }
            }
            TRAINING_DATA_DIV.appendChild(KEY_DATA_HTML);
        }
    }
    TRAINING_RUN_HEADING.appendChild(TRAINING_DATA_DIV);
    CONTAINER.appendChild(TRAINING_RUN_HEADING);

    TRAINING_RUN_HEADING.addEventListener('click', function () {
        TRAINING_DATA_DIV.style.display = TRAINING_DATA_DIV.style.display === 'block' ? 'none' : 'block';
    });
}

function displayTotalAndAverage() {
    const TOTAL_CONTAINER = document.getElementById('analytics-card-body-id');
    const TOTAL_HTML = document.createElement('h5');

    TOTAL_HTML.classList.add('total');
    TOTAL_HTML.textContent = `Total Loss: ${total.toFixed(2)}`;

    const AVERAGE_LOSS = total / count;

    const AVERAGE_HTML = document.createElement('h5');

    AVERAGE_HTML.classList.add('total');
    AVERAGE_HTML.textContent = ` Average Loss: ${AVERAGE_LOSS.toFixed(2)}`;

    TOTAL_CONTAINER.appendChild(TOTAL_HTML);
    TOTAL_CONTAINER.appendChild(AVERAGE_HTML);
}

get_training_data();
