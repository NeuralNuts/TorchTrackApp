namespace TorchTrackApp.Sockets
{
    using Microsoft.AspNetCore.SignalR;
    using TorchTrackApp.Models;

    public class MyHub : Hub
    {
        public async Task SendTrainingData(TrainingDataModel torch_track_model)
        {
            await Clients.All.SendAsync("ReceiveMessage", torch_track_model);
        }
    }
}
