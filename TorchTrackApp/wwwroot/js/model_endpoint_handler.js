//const BASE_URL = "https://localhost:7032/api/TorchTrack/";
const BASE_URL = "https://torchtrackapp.azurewebsites.net/api/TorchTrack/";
const FETCH_ERROR = "Failed to fetch data: ";
const HTTP_ERROR = "HTTP error! Status: ";


async function getModelData() {
    const URL = `${BASE_URL}GetTorchModels`;

    try {
        const RESPONSE = await fetch(URL);

        if (!RESPONSE.ok) {
            throw new Error(`${HTTP_ERROR} ${RESPONSE.status}`);
        }
        const MODEL_DATA = await RESPONSE.json();

        console.log(MODEL_DATA);

        MODEL_DATA.forEach((model_data) => {
            const PARSED_DATA = JSON.parse(model_data.model_optimizer);
            const NETWORK_STRING = model_data.model_architecure;

            displayNetwork(NETWORK_STRING);
            displayJSON(PARSED_DATA);

            console.log(PARSED_DATA);
        });

    } catch (error) {
        console.error(FETCH_ERROR, error.message);
    }
}

function displayNetwork(networkStr) {
    const OUTPUT_DIV = document.getElementById('network-output');
    const TITLES = networkStr.split('(')[0].trim();
    const LAYERS = networkStr.match(/\(([^()]+)\)/g).map(layer => layer.slice(1, -1));  // Extract content within brackets

    let html = `<div class="title">${TITLES}</div>`;

    LAYERS.forEach(layer => {
        const PARTS = layer.split(':');

        if (PARTS.length > 1) {
            html += `<div class="layer">
                        <div class="layer-name">${PARTS[0].trim()}</div>
                        <div class="layer-details">${PARTS[1].trim()}</div>
                    </div>`;
        } else {
            html += `<div class="layer">
                        <div class="layer-name">${PARTS[0].trim()}</div>
                    </div>`;
        }
    });

    OUTPUT_DIV.innerHTML = html;
}

function displayJSON(jsonObj) {
    const OUTPUT_DIV = document.getElementById('json-output');

    let html = '';

    if (jsonObj.param_groups && jsonObj.param_groups.length > 0) {
        html += '<div class="title">Param Groups:</div>';

        for (let group of jsonObj.param_groups) {
            html += '<ul class="list">';

            for (let key in group) {
                if (Array.isArray(group[key])) {
                    html += `<li class="list-item"><span class="label">${key}:</span> ${group[key].join(', ')}</li>`;
                } else if (group[key] !== undefined) {
                    html += `<li class="list-item"><span class="label">${key}:</span><span class="value">${group[key]}</span></li>`;
                }
            }
            html += '</ul>';
        }
    }

    if (jsonObj.state) {
        html += '<div class="title">State:</div>';
        html += '<ul class="list">';

        for (let key in jsonObj.state) {
            const MOMEMTOM_BUFFER = jsonObj.state[key] && jsonObj.state[key].momentum_buffer;

            if (MOMEMTOM_BUFFER !== undefined) {
                html += `<li class="list-item"><span class="label">ID ${key}:</span><span class="value">momentum_buffer: ${MOMEMTOM_BUFFER}</span></li>`;
            }
        }
        html += '</ul>';
    }

    OUTPUT_DIV.innerHTML = html;
}

getModelData();
