using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace TorchTrackApp.Controllers
{
    [Controller]
    [Route("~/api/[controller]")]
    public class FileController : Controller
    {
        private readonly IWebHostEnvironment environment;
       
        public FileController(IWebHostEnvironment hostEnvironment)
        {
            environment = hostEnvironment;
        }

        [HttpGet()]
        [Route("DownloadModel")]
        public IActionResult Download(string model_file)
        {
            var filepath = Path.Combine(environment.WebRootPath, "models", model_file);
            return File(System.IO.File.ReadAllBytes(filepath), "models/model", System.IO.Path.GetFileName(filepath));
        }

        [HttpPost]
        [Route("UploadModel")]
        public async Task<IActionResult> UploadAsync(List<IFormFile> files, string file_name)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("No files were uploaded.");
            }

            long totalSize = 0;

            foreach (var formFile in files)
            {
                if (formFile.Length == 0)
                {
                    continue; // Skip empty files
                }

                if (formFile.Length > 10 * 1024 * 1024) // 10 MB as an example size limit
                {
                    return BadRequest("File size exceeds the limit.");
                }

                //var uniqueFileName = Guid.NewGuid().ToString() + "_" + formFile.FileName;

                var filePath = Path.Combine(environment.WebRootPath, "models", file_name);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await formFile.CopyToAsync(stream);
                }

                totalSize += formFile.Length;
            }

            return Ok(new { count = files.Count, totalSize });
        }
    }
}
