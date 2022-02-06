using Microsoft.Extensions.Options;
using UploaderBackend.Interfaces;
using UploaderBackend.Models;

namespace UploaderBackend.Services
{
    public class ValidationService : IValidationService
    {
        private readonly AppConfigSettings _settings;
        public ValidationService(IOptions<AppConfigSettings> settingsOptions)
        {
            _settings = settingsOptions.Value;
        }
        public void Validate(IFormFileCollection files)
        {
            var size = _settings.SizeConfig;
            var typeFiles = _settings.FileTypes;

            if (files.Any(f => f.Length == 0))
            {
                throw new Exception("File is empty");
            }
            if (files.Any(f => f.Length > size))
            {
                var sizeView = size / 1024000;
                throw new Exception($"Maximum size {sizeView}(MB) exceeded");
            }
            if (!files.Any(f => IsATextFile(f.FileName)))
            {
                throw new Exception($"File Extension Is InValid - Only Upload {typeFiles} File");
            }
        }
        private bool IsATextFile(string fileName)
        {
            string[] typeFile = _settings.FileTypes.Split('/');

            foreach (var type in typeFile)
            {
                if (fileName.EndsWith($".{type}", StringComparison.OrdinalIgnoreCase))
                    return true;
            }
            return false;
        }
    }
}
