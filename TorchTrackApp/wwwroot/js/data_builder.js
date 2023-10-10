temp_array = [];

function get_torch_track_data(model_name) {
    $.ajax({
        url: "https://torchtrackapp.azurewebsites.net/api/TorchTrack/GetTorchTraclLib?model_name=" + encodeURIComponent(model_name),
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            try {
                temp_array = data
                req_data_parser(temp_array)
                console.log(temp_array)

            } catch (error) {
                console.error('Error processing data:', error.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch data:', textStatus, errorThrown);
        }
    });
}

function req_data_parser(data) {
    //var table = document.getElementById('lists-select')
    for (var i = 0; i < data.length; i++) {
        //var row = `<option>${data[i].listName}</option>`
        //table.innerHTML += row
        const d = JSON.parse(data[i].model_optimizer);
        console.log(d.state);
    }
}

get_torch_track_data("Test");
