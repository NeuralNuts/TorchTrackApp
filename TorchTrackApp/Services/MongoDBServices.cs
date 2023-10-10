using TorchTrackApp.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Runtime.CompilerServices;
using MongoDB.Bson.IO;
using System.Text.Json;
using Newtonsoft.Json.Linq;

namespace TorchTrackApp.Services
{
    public class MongoDBServices
    {
        private readonly IMongoCollection<TorchTrackModel>
        _torch_track_collection;

        public MongoDBServices(IOptions<MongoDBSettings> mongodb_settings)
        {
            MongoClient client = new MongoClient(mongodb_settings
            .Value
            .ConnectionURI);

            IMongoDatabase database_base = client.GetDatabase(mongodb_settings
            .Value
            .Database);

            _torch_track_collection = database_base.GetCollection<TorchTrackModel>(mongodb_settings
            .Value
            .Collection1);
        }

        //public async Task<List<TorchTrackModel>> GetModelData(string model_name)
        //{
        //    var model_name_filter = Builders<TorchTrackModel>
        //        .Filter
        //        .Eq(u => u.model_name, model_name);



        //    return await _torch_track_collection
        //    .Find(model_name_filter)
        //    .ToListAsync();
        //}

        public async Task<List<TorchTrackModel>> GetModelsByModelName(string modelName)
        {

            var filter = Builders<TorchTrackModel>.Filter.Eq(x => x.model_name, modelName);
            var models = await _torch_track_collection.Find(filter).ToListAsync();

            return models;
        }

        public async Task CreateModelDataSchema(TorchTrackModel torch_track_model)
        {
            await _torch_track_collection
            .InsertOneAsync(torch_track_model);
            return;
        }
    }
}
