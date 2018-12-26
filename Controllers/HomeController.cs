using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using core.Models;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using System.IO;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using HtmlAgilityPack;

namespace core.Controllers
{
    public class HomeController : Controller
    {
        private async Task<string> RenderPartialViewToString(string viewName, object model)
        {
            if (string.IsNullOrEmpty(viewName))
                viewName = ControllerContext.ActionDescriptor.ActionName;

            ViewData.Model = model;

            using (var writer = new StringWriter())
            {
                ViewEngineResult viewResult =
                    _viewEngine.FindView(ControllerContext, viewName, false);

                ViewContext viewContext = new ViewContext(
                    ControllerContext,
                    viewResult.View,
                    ViewData,
                    TempData,
                    writer,
                    new HtmlHelperOptions()
                );

                await viewResult.View.RenderAsync(viewContext);

                return writer.GetStringBuilder().ToString();
            }
        }
        private ICompositeViewEngine _viewEngine;

        public HomeController(ICompositeViewEngine viewEngine)
        {
            _viewEngine = viewEngine;
        }

        public async Task<IActionResult> Index()
        {
            HtmlDocument model = new HtmlDocument();
    
            var renderedView = await RenderPartialViewToString("NewApproach", model);

            model.LoadHtml(renderedView);
            var title = model.GetElementbyId("hiddenTitles");
            return View();
        }


        public IActionResult NewApproach()
        {
            return View();
        }
    }
}
