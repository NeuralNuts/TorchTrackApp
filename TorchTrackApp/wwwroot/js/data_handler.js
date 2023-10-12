let temp_array = [];

function get_torch_track_data() {
    $.ajax({
        url: "https://localhost:7032/api/TorchTrack/GetTraining",
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            try {
                temp_array = data
                json_data_parser(temp_array)
            }
            catch (error) {
                console.error('Error processing data:', error.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch data:', textStatus, errorThrown);
        }
    });
}

function html_run_builder(loop) {
    let header_div = document.getElementById("card-header-id");

    var h2 = `<h5 class="mb-2">
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

function object_parser(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                object_parser(obj[key]);
            }
            else {
                console.log(key, obj[key]);
                html_builder(key, obj[key]);
            }
        }
    }
}

function json_data_parser(data) {
    for (var i = 0; i < data.length; i++) {
        const parsed_json = JSON.parse(data[i].model_training_data);
        const parsed_json_run = data[i].training_run;

        html_run_builder(parsed_json_run);
        object_parser(parsed_json);
    }
}

get_torch_track_data();
