using Microsoft.EntityFrameworkCore;
using UploaderBackend.Models;

namespace UploaderBackend.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext() : base()
        {
        }
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<FileModel> Files { get; set; }
    }
}
