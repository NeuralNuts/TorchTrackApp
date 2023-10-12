using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel;

namespace TorchTrackApp.Models
{
    public class TrainingDataModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [DefaultValue("")]
        public string? Id { get; set; }
        public int training_run { get; set; }
        public string? model_training_data { get; set; }

    }
}
