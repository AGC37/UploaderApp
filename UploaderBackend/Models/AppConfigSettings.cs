namespace UploaderBackend.Models
{
    public class AppConfigSettings
    {
        public const string AppConfig = "AppConfig";
        public long SizeConfig { get; set; }
        public string? FileTypes { get; set; }
        public string? SaveFolder { get; set; }
    }
}
