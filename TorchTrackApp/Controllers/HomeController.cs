using TorchTrackApp.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Amazon.Runtime.Internal;
using TorchTrackApp.Services;
using Microsoft.AspNetCore.Cors;

namespace TorchTrackApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly MongoDBServices _mongodb_services;

        public HomeController(MongoDBServices mongodb_services) =>
        _mongodb_services = mongodb_services;

        
        private readonly ILogger<HomeController> _logger;

        //public HomeController(ILogger<HomeController> logger)
        //{
        //    _logger = logger;
        //}

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Models()
        {
            return View();
        }

        public IActionResult Training() 
        {
            return View();
        }

        public IActionResult Documentation() 
        {
            return View();
        }

        [Route("TrainingBag")]
        [HttpGet]
        public async Task<IActionResult> TrainingBag()
        {
            return PartialView("_Training");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}