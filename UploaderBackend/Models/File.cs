using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UploaderBackend.Models
{
    [Table("Files")]
    public class FileModel
    {
        public FileModel() { }
        [Key]
        [Required]
        public int Id { get; set; }
        public string? Name { get; set; }
        public long? Size { get; set; }
        public DateTime CreationTime { get; set; }
        public string? FilePath { get; set; }
    }
}
