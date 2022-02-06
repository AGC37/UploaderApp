using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using UploaderBackend.Models;
using UploaderBackend.Context;
using UploaderBackend.Interfaces;
using Microsoft.Extensions.Options;

namespace UploaderBackend.Services
{
    public class FilesService : IFilesService
    {
        private readonly AppDbContext _context;
        private readonly IValidationService _validationService;
        private readonly AppConfigSettings _settings;
        public FilesService(AppDbContext context, IValidationService validationService, IOptions<AppConfigSettings> settingsOptions)
        {
            _context = context;
            _validationService = validationService;
            _settings = settingsOptions.Value;
        }
        public async Task<ActionResult> Fetch(IFormFileCollection files)
        {
            var folderName = _settings.SaveFolder;
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

            Directory.CreateDirectory(pathToSave);

            _validationService.Validate(files);
           
            foreach (var file in files)
            {
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                var fileNameInDb = Guid.NewGuid().ToString();
                var fullPath = Path.Combine(pathToSave, fileNameInDb);
                var dbPath = Path.Combine(folderName, fileNameInDb);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                var filemodel = new FileModel
                {
                    Name = fileName,
                    Size = file.Length,
                    CreationTime = DateTime.Now,
                    FilePath = dbPath,
                };

                _context.Files.Add(filemodel);
                await _context.SaveChangesAsync();
            }
            return new JsonResult("File upload");
        }
        public async Task<ActionResult<ApiResult<FileDTO>>> GetFilesAsync(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? typeFile = null)
        {
            return await ApiResult<FileDTO>.CreateAsync(_context.Files.Where(f => f.Name.EndsWith(typeFile) == true)
                .Select(f => new FileDTO()
                {
                    Id = f.Id,
                    Name = f.Name,
                    Size = f.Size,
                    FilePath = f.FilePath,
                    CreationTime = f.CreationTime,
                }),
                pageIndex,
                pageSize,
                sortColumn,
                typeFile
                );
        }
        public async Task<ActionResult<FileModel>> Delete(int id)
        {
            var existingFile = await _context.Files.FindAsync(id);
            if (existingFile is null) throw new Exception("File not found");

            var fileUrl = existingFile.FilePath;

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), fileUrl);

            if (!System.IO.File.Exists(filePath))
                throw new Exception("File not found");

            _context.Files.Remove(existingFile);
            await _context.SaveChangesAsync();
            System.IO.File.Delete(filePath);
            return new JsonResult("File delete");
        }
    }
}
