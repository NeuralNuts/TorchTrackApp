using TorchTrackApp.Models;
using TorchTrackApp.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using TorchTrackApp.Sockets;
using Microsoft.AspNetCore.SignalR;

namespace TorchTrackApp.Controllers
{
    [Controller]
    [Route("~/api/[controller]")]
    public class TorchTrackController : Controller
    {
        private readonly MongoDBServices _mongodb_services;
        private readonly IHubContext<MyHub> _hubContext;

        public TorchTrackController(MongoDBServices mongodb_services, IHubContext<MyHub> hubContext)
        {
            _mongodb_services = mongodb_services;
            _hubContext = hubContext;
        } 

        [EnableCors]
        [HttpGet]
        [Route("GetTorchModels")]
        public async Task<List<TorchTrackModel>> GetTorchModels() =>
            await _mongodb_services.GetTorchModels();

        [EnableCors]
        [HttpGet]
        [Route("GetTraining")]
        public async Task<List<TrainingDataModel>> GetTrainingData() =>
            await _mongodb_services.GetTrainingData();

        [EnableCors]
        [HttpPost]
        [Route("PostModelData")]
        public async Task<IActionResult> PostSingleModelData([FromBody] TorchTrackModel torch_track_model)
        {
            await _mongodb_services.CreateModelDataSchema(torch_track_model);

            return CreatedAtAction(nameof(GetTorchModels), new { id = torch_track_model.Id }, torch_track_model);
        }

        [EnableCors]
        [HttpPost]
        [Route("PostTrainginData")]
        public async Task<IActionResult> PostSingleTrainingData([FromBody] TrainingDataModel training_model)
        {
            MyHub myHub = new MyHub();

            await _mongodb_services.CreateTrainingData(training_model);
            //await myHub.SendTrainingData(training_model);
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", training_model);


            return CreatedAtAction(nameof(GetTrainingData), new { id = training_model.Id }, training_model);
        }

        [EnableCors]
        [HttpDelete]
        [Route("DestroyerOfWordls")]
        public async Task DestroyerOfWorlds() =>
            await _mongodb_services.DeleteAll();

    }
}
