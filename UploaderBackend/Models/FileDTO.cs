namespace UploaderBackend.Models
{
    public class FileDTO
    {
        public FileDTO() { }
        public int Id { get; set; }
        public string? Name { get; set; }
        public long? Size { get; set; }
        public DateTime CreationTime { get; set; }
        public string? FilePath { get; set; }
    }
}
