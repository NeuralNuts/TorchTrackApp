
const BASE_URL = "https://localhost:7032/api/TorchTrack/";
const FETCH_ERROR = "Failed to fetch data: ";
const HTTP_ERROR = "HTTP error! Status: ";

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
            displayTrainingRunData(index + 1, parsedData);
        });
    } catch (error) {
        console.error(FETCH_ERROR, error.message);
    }
}

// Function to display training run data
function displayTrainingRunData(trainingRunNumber, data) {
    const container = document.getElementById('card-id');
    const trainingRunHeading = document.createElement('div');
    trainingRunHeading.classList.add('collapsible');
    trainingRunHeading.innerHTML = `<button class="btn btn-secondary">${trainingRunNumber}</button>`;

    // Create a collapsible content div for training data
    const trainingDataDiv = document.createElement('div');
    trainingDataDiv.classList.add('content');

    // Iterate through the numeric keys (e.g., 10, 20, 30)
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            const keyData = data[key];
            // Display the numeric key with a custom class for styling
            const keyDataHTML = document.createElement('p');
            keyDataHTML.classList.add('numeric-key');
            keyDataHTML.textContent = `${key}:`;

            for (let subKey in keyData) {
                if (keyData.hasOwnProperty(subKey)) {
                    // Display the values within the objects with a custom class for styling
                    const subKeyValueHTML = document.createElement('p');
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

// Call the async function to fetch and display training data
get_training_data();