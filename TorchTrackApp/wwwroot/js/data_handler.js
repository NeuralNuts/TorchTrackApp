let temp_array = [];
let temp_array_2 = [];

async function get_training_data_by_run(run) {
    const url = `https://localhost:7032/api/TorchTrack/GetTrainingDataByRun?training_run=${encodeURI(run)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data_2 = await response.json();
        temp_array = data_2;
        //html_builder(data);
        console.log(data_2);
        json_data_parser(data_2);
        //run_data_parser(data_2);
        //json_data_parser(data);
    } catch (error) {
        console.error('Failed to fetch data:', error.message);
    }
}

async function get_training_data() {
    const url = "https://localhost:7032/api/TorchTrack/GetTraining";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        //html_run_builder(data);
        json_data_parser(data);
        run_data_parser(data);
    } catch (error) {
        console.error('Failed to fetch data:', error.message);
    }
}

async function get_training_run_data() {
    const url = "https://localhost:7032/api/TorchTrack/GetTrainingByTrainingRun";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        //html_run_builder(data);
        run_data_parser(data);
    } catch (error) {
        console.error('Failed to fetch data:', error.message);
    }
}

function html_run_builder(loop) {
    let header_div = document.getElementById("card-header-id");

    var h2 = `<hr/>
              <h5 class="mb-2">
                    Training Run: 
                    <button class="btn btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                        ${loop}
                    </button>
              </h5>`;

    header_div.innerHTML += h2;
}

function html_builder(key, data) {
    let colap_div = document.getElementById("collapseOne");

    var h2 = `<h4>${key}</h4>`;
    var html_break = `<hr >`;
    var h4_obj = `<label>${data}</label>`;

    colap_div.innerHTML += html_break + h2 + h4_obj;
}

function run_data_parser(data) {
    for (var i = 0; i < data.length; i++) {
        html_run_builder(data[i].training_run);
        console.log(data[i].training_run);
        get_training_data_by_run(data[i].training_run);
    }
}

function object_parser(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            // Check if the current property is an object and not an array
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                console.log(key, obj[key]); // Log the current nested object
                object_parser(obj[key]);    // Recurse into the nested object
            } else {
                console.log(key, obj[key]);
                html_builder(key, obj[key]);
            }
        }
    }
}

function json_data_parser(data) {
    console.log('Data:', data);

    if (Array.isArray(data)) {
        for (let item of data) {
            try {
                const parsed_json = JSON.parse(item.model_training_data);
                console.log('Parsed JSON:', parsed_json);
                object_parser(parsed_json);
            } catch (err) {
                console.error(`Error parsing or processing array data. Error: ${err.message}`);
            }
        }
    } else if (typeof data === 'object' && data !== null && data.hasOwnProperty('model_training_data')) {
        try {
            const parsed_json = JSON.parse(data.model_training_data);
            console.log('Parsed JSON:', parsed_json);
            object_parser(parsed_json);
        } catch (err) {
            console.error(`Error parsing or processing object data. Error: ${err.message}`);
        }
    } else {
        console.error('Data is neither a valid array nor a valid object.');
    }
}


function json_data_parser8(data) {
    console.log('Data:', data);

    if (!Array.isArray(data)) {
        console.error('Data is not an array.');
        return;
    }

    for (var i = 0; i < data.length; i++) {
        console.log(i);
        try {
            const parsed_json = JSON.parse(data[i].model_training_data);
            console.log(parsed_json);
            object_parser(parsed_json);
        } catch (err) {
            console.error(`Error parsing or processing data at index ${i}. Error: ${err.message}`);
        }
    }
}

get_training_data()
//get_training_data_by_run(2);
//get_training_run_data();
