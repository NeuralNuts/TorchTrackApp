let temp_array = [];

function get_torch_track_data(model_name) {
    $.ajax({
        url: "https://torchtrackapp.azurewebsites.net/api/TorchTrack/GetTorchTraclLib?model_name=" + encodeURIComponent(model_name),
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

function html_builder(key, data) {
    let parent_data_div = document.getElementById("card-body-id");
    var h2 = `<h4>${key}</h4>`;
    var html_break = `<hr >`;
    var h4_obj = `<label>${data}</label>`;

    parent_data_div.innerHTML += html_break + h2 + h4_obj;
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

        object_parser(parsed_json)
    }
}

get_torch_track_data("Bing");
