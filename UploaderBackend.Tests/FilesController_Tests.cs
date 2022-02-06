using Xunit;
using System;
using System.Threading.Tasks;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Globalization;
using Microsoft.EntityFrameworkCore;
using UploaderBackend.Context;
using UploaderBackend.Models;
using UploaderBackend.Controllers;
using UploaderBackend.Services;
using Microsoft.Extensions.Options;

namespace UploaderBackend.Tests
{
    public class FilesController_Tests : IClassFixture<TestingWebAppFactory<Program>>
    {
        private readonly HttpClient _client;

        public FilesController_Tests(TestingWebAppFactory<Program> factory)
            => _client = factory.CreateClient();

        [Fact]
        public async Task ShouldUploadFile()
        {
            var response = await _client.GetAsync("api/files");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _client.Dispose();
        }

        [Fact]
        public async Task ShouldDownloadFile_WhenExist()
        {
            using (var content =
             new MultipartFormDataContent("Upload----" + DateTime.Now.ToString(CultureInfo.InvariantCulture)))
            {
                content.Add(new StreamContent(new MemoryStream(new byte[] { 1, 2, 3, 4, 5, 6, 7, 8, 9 })), "bilddatei", "test.pdf");

                await _client.PostAsync("api/files", content);
            }

            var response = await _client.GetAsync("api/files");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _client.Dispose();
        }
        [Fact]
        public async void GetDataFile()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "Files")
                .Options;

            using (var context = new AppDbContext(options))
            {
                context.Add(new FileModel()
                {
                    Id = 1,
                    Name = "test.pdf",
                    Size = 13133390,
                    FilePath = "832822cb-7a0e-4d60-bf4a-d91d99414b74.pdf",
                    CreationTime = DateTime.Now,
                });
                context.Add(new FileModel()
                {
                    Id = 2,
                    Name = "test.doc",
                    Size = 13133840,
                    FilePath = "832822cb-7a0e-4d60-bf4a-d91d99414b74.doc",
                    CreationTime = DateTime.Now,
                });
                context.SaveChanges();
            }
            ApiResult<FileDTO>? file_existing = null;
            ApiResult<FileDTO>? file_notExisting = null;

            using (var context = new AppDbContext(options))
            {
                IOptions<AppConfigSettings> settings = Options.Create<AppConfigSettings>(new AppConfigSettings()
                {
                    SaveFolder = "FileDatabase",
                    FileTypes = "doc/pdf/txt",
                    SizeConfig = 5242880
                });
                var validator = new ValidationService(settings);
                var service = new FilesService(context, validator, settings);
                var controller = new FilesController(service);
                file_existing = (await controller.Get(0, 10, null, null, "pdf")).Value;
                file_notExisting = (await controller.Get(0, 10, null, null, "doc")).Value;
            }
            Assert.Equal(file_existing.Data[0].Name, "test.pdf");
            Assert.NotEqual(file_notExisting.Data[0].Name, "test.pdf");
        }
    }
}
