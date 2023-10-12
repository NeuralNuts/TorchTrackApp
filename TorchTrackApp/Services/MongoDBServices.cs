using TorchTrackApp.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Runtime.CompilerServices;
using MongoDB.Bson.IO;
using System.Text.Json;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Mvc;

namespace TorchTrackApp.Services
{
    public class MongoDBServices
    {
        private readonly IMongoCollection<TorchTrackModel>
        _torch_track_collection;

        private readonly IMongoCollection<TrainingDataModel>
        _training_data_collection;


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

            _training_data_collection = database_base.GetCollection<TrainingDataModel>(mongodb_settings
            .Value
            .Collection2);
        }

        public async Task<List<TorchTrackModel>> GetModelsByModelName(string model_name)
        {
            var filter = Builders<TorchTrackModel>.Filter.Eq(x => x.model_name, model_name);
            var models = await _torch_track_collection.Find(filter).ToListAsync();

            return models;
        }

        public async Task DeleteAll()
        {
            await _training_data_collection.DeleteManyAsync(new BsonDocument()); 
            await _torch_track_collection.DeleteManyAsync(new BsonDocument());
        }

        public async Task CreateModelDataSchema(TorchTrackModel torch_track_model)
        {
            await _torch_track_collection.InsertOneAsync(torch_track_model);
            return;
        }

        public async Task CreateTrainingData(TrainingDataModel torch_track_model)
        {
            var last_document = await _training_data_collection.Find(new BsonDocument())
                .SortByDescending(u => u.training_run)
                .FirstOrDefaultAsync();

            int next_training_run_value = (last_document?.training_run ?? 0) + 1;

            torch_track_model.training_run = next_training_run_value;

            await _training_data_collection.InsertOneAsync(torch_track_model);
        }
    }
}
