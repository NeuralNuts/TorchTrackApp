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
        [Route("GetTrainingRun")]
        public async Task<List<TorchTrackModel>> GetTrainingRun(int training_run) =>
            await _mongodb_services.GetModelsByTrainingRun(training_run);


        [EnableCors]
        [HttpGet]
        [Route("GetTorchTraclLib")]
        public async Task<List<TorchTrackModel>> GetTorchTrackLib(string model_name) =>
            await _mongodb_services.GetModelsByModelName(model_name);

        [EnableCors]
        [HttpPost]
        [Route("PostModelData")]
        public async Task<IActionResult> PostSingleModelData([FromBody] TorchTrackModel torch_track_model)
        {
            int x = torch_track_model.training_run;

            if (_mongodb_services.GetModelsByTrainingRun(x).Result.Equals(3))
            {
                var new_trtraining_run = torch_track_model.training_run = torch_track_model.training_run ++;
                await _mongodb_services.CreateModelDataSchema(torch_track_model);
            }
            else
            {    
                return BadRequest();
            }

            return CreatedAtAction(nameof(GetTorchTrackLib), new { id = torch_track_model.Id }, torch_track_model);
        }
    }
}
