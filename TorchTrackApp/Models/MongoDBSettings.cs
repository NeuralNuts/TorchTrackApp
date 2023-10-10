using System.ComponentModel.DataAnnotations.Schema;

namespace TorchTrackApp.Models
{
    public class MongoDBSettings
    {
        public string ConnectionURI
        { get; set; } = null!;

        public string Database
        { get; set; } = null!;

        public string Collection1
        { get; set; } = null!;
    }
}
