using Microsoft.AspNetCore.Mvc;
using UploaderBackend.Context;
using UploaderBackend.Models;

namespace UploaderBackend.Interfaces
{
    public interface IFilesService
    {
        Task<ActionResult> Fetch(IFormFileCollection files);
        Task<ActionResult<ApiResult<FileDTO>>> GetFilesAsync(int pageIndex, int pageSize, string? sortColumn, string? sortOrder, string? typeFile);
        Task<ActionResult<FileModel>> Delete(int id);
    }
}
