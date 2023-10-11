let temp_array = [];

function get_torch_track_data(model_name) {
    $.ajax({
        url: "https://torchtrackapp.azurewebsites.net/api/TorchTrack/GetTorchTraclLib?model_name=" + encodeURIComponent(model_name),
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            try {
                temp_array = data
                req_data_parser(temp_array)
                //loopThrough(temp_array)
                //console.log(temp_array)

            } catch (error) {
                console.error('Error processing data:', error.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch data:', textStatus, errorThrown);
        }
    });
}

function html_builder(key, data) {
    let parent_data_div = document.getElementById("parent-data-id");
    var h2 = `<h2>${key}</h2>`;

    parent_data_div.innerHTML += h2;
}

function loopThrough(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            console.log(key, obj[key]);
            html_builder(key, obj[key])

            if (typeof obj[key] === 'object') {
                loopThrough(obj[key]);
            }
        }
    }
}

function req_data_parser(data) {
    for (var i = 0; i < data.length; i++) {
        const parsed_json = JSON.parse(data[i].model_optimizer, null, 4);
        let html_p = document.getElementById("p-id")

        loopThrough(parsed_json)
    }
}

get_torch_track_data("Bing");
