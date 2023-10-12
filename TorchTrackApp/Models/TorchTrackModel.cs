using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace TorchTrackApp.Models
{
    public class TorchTrackModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [DefaultValue("")]
        public string? Id { get; set; }
        public string? model_name { get; set; }
        public string? model_architecure { get; set; }
        public string? model_optimizer { get; set; }
    }
}
