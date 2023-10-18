
const BASE_URL = "https://localhost:7032/api/TorchTrack/";
const FETCH_ERROR = "Failed to fetch data: ";
const HTTP_ERROR = "HTTP error! Status: ";


async function get_training_data() {
    const url = `${BASE_URL}GetTorchModels`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${HTTP_ERROR} ${response.status}`);
        }

        const data = await response.json();
        // Assuming data is an array of training runs
        data.forEach((model_data) => {
            const parsedData = JSON.parse(model_data.model_optimizer);

            displayJSON(parsedData);
            
            console.log(parsedData);

        });

    } catch (error) {
        console.error(FETCH_ERROR, error.message);
    }
}

function displayJSON(jsonObj) {
    let outputDiv = document.getElementById('json-output');
    outputDiv.innerHTML = `<pre>${JSON.stringify(jsonObj, null, 4)}</pre>`;
}

get_training_data();
