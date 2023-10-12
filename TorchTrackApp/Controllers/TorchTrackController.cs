using TorchTrackApp.Models;
using TorchTrackApp.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Text.Json;
using Newtonsoft.Json;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using Newtonsoft.Json.Linq;

namespace TorchTrackApp.Controllers
{
    [Controller]
    [Route("~/api/[controller]")]
    public class TorchTrackController : Controller
    {
        private readonly MongoDBServices _mongodb_services;

        public TorchTrackController(MongoDBServices mongodb_services) =>
        _mongodb_services = mongodb_services;

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
        [HttpGet]
        [Route("GetTrainingByTrainingRun")]
        public async Task<List<TrainingRunModel>> GetTrainingDataByTrainingRun() =>
            await _mongodb_services.GetTrainingRun();


        [EnableCors]
        [HttpGet]
        [Route("GetTrainingDataByRun")]
        public async Task<TrainingDataModel> GetTrainingDataByRun(int training_run) =>
            await _mongodb_services.GetTrainingDataFromRuns(training_run);


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
            await _mongodb_services.CreateTrainingData(training_model);

            return CreatedAtAction(nameof(GetTrainingData), new { id = training_model.Id }, training_model);
        }

        [EnableCors]
        [HttpDelete]
        [Route("DestroyerOfWordls")]
        public async Task DestroyerOfWorlds() =>
            await _mongodb_services.DeleteAll();
    }
}
