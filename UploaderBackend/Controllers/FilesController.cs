using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using UploaderBackend.Context;
using UploaderBackend.Interfaces;
using UploaderBackend.Models;

namespace UploaderBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly IFilesService _filesService;
        public FilesController(IFilesService filesService)
        {
            _filesService = filesService;
        }

        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> Upload()
        {
            try
            {
                var files = Request.Form.Files;
                var result = await _filesService.Fetch(files);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
        [HttpGet]
        public async Task<ActionResult<ApiResult<FileDTO>>> Get(
            int pageIndex,
            int pageSize,
            string? sortColumn,
            string? sortOrder,
            string? typeFile)
        {
            return await _filesService.GetFilesAsync(pageIndex, pageSize, sortColumn, sortOrder, typeFile);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<FileModel>> Delete(int id)
        {
            try
            {
                await _filesService.Delete(id);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
}
