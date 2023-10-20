//
//const BASE_URL = "https://localhost:7032/api/TorchTrack/";
const BASE_URL = "https://torchtrackapp.azurewebsites.net/api/TorchTrack/";
const FETCH_ERROR = "Failed to fetch data: ";
const HTTP_ERROR = "HTTP error! Status: ";


async function get_model_data() {
    const url = `${BASE_URL}GetTorchModels`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${HTTP_ERROR} ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        // Assuming data is an array of training runs
        data.forEach((model_data) => {
            const parsedData = JSON.parse(model_data.model_optimizer);
            const networkStr = model_data.model_architecure;

            displayNetwork(networkStr);
            displayJSON(parsedData);

            console.log(parsedData);
        });

    } catch (error) {
        console.error(FETCH_ERROR, error.message);
    }
}
function displayNetwork(networkStr) {
    const outputDiv = document.getElementById('network-output');

    const title = networkStr.split('(')[0].trim();
    const layers = networkStr.match(/\(([^()]+)\)/g).map(layer => layer.slice(1, -1));  // Extract content within brackets

    let html = `<div class="title">${title}</div>`;
    layers.forEach(layer => {
        const parts = layer.split(':');
        if (parts.length > 1) {
            html += `<div class="layer">
                        <div class="layer-name">${parts[0].trim()}</div>
                        <div class="layer-details">${parts[1].trim()}</div>
                    </div>`;
        } else {
            html += `<div class="layer">
                        <div class="layer-name">${parts[0].trim()}</div>
                    </div>`;
        }
    });

    outputDiv.innerHTML = html;
}

function displayJSON(jsonObj) {
    const outputDiv = document.getElementById('json-output');
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
            const momentumBuffer = jsonObj.state[key] && jsonObj.state[key].momentum_buffer;
            if (momentumBuffer !== undefined) {
                html += `<li class="list-item"><span class="label">ID ${key}:</span><span class="value">momentum_buffer: ${momentumBuffer}</span></li>`;
            }
        }
        html += '</ul>';
    }

    outputDiv.innerHTML = html;
}


get_model_data();
