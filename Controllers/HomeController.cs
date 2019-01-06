using System.Collections.Generic;
using System.Linq;
using core.Models;
using core.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using core.Factory;
using core.Enums;

namespace core.Controllers
{
    public class HomeController : Controller
    {

        public MemoryModel _context;
        public HomeController(MemoryModel context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View(new List<MemoryIndexViewModel>());
        }

        [HttpGet]
        public IActionResult MemoryView(int id)
        {
            var entryPoint = (from ep in _context.Memories
                              join e in _context.Items on ep.Id equals e.Memo.Id
                              join t in _context.Types on e.TypeOf.Id equals t.Id
                              where e.Memo.Id == id
                              select new
                              {
                                  context = e.Context,
                                  typeId = t.Id,
                              }).Take(4);

            List<Item> items = new List<Item>();
            foreach (var item in entryPoint)
            {
                items.Add(new Item() { Id = item.typeId, Context = item.context });
            }

            Memories memo = _context.Memories.FirstOrDefault(m => m.Id == id);

            MemoryHolderViewModel viewModel = new MemoryHolderViewModel(memo, items);

            return View(viewModel);
        }

        [HttpGet]
        public IActionResult MemoryCreate()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Save(MemoryCreateViewModel viewModel)
        {
            var memo = _context.Memories.Add(new Memories()
            {
                Content = viewModel.Content,
                MemoryTitle = viewModel.Title
            });

            _context.Items.AddRange(new List<Item>(){
                new Item()
                {
                    Memo = memo.Entity,
                    Context = viewModel.HiddenProperties,
                    TypeOf = _context.Types.SingleOrDefault(t=>t.Id == 1),
                },
                new Item()
                {
                    Memo = memo.Entity,
                    Context = viewModel.HiddenTitles,
                    TypeOf = _context.Types.SingleOrDefault(t=>t.Id == 2),
                },
                new Item()
                {
                    Memo = memo.Entity,
                    Context = viewModel.HiddenSubclasses,
                    TypeOf = _context.Types.SingleOrDefault(t=>t.Id == 3),
                },
                new Item()
                {
                    Memo = memo.Entity,
                    Context = viewModel.HiddenInstances,
                    TypeOf = _context.Types.SingleOrDefault(t=>t.Id == 4),
                },
            });

            _context.SaveChanges();
            return null;
        }
    
        [HttpGet]
        public List<MemoryIndexViewModel> GetDataFromMemo(SearchJsonObject searchObject){
            
            List<MemoryIndexViewModel> miv = new List<MemoryIndexViewModel>();
            List<FrequencyQItem> resultQItems = new List<FrequencyQItem>();
            
            _context.Memories.ToList().ForEach(memo => {
                _context.Items.Include(i => i.Memo).Include(i => i.TypeOf).Where(f=> f.Memo == memo).ToList().ForEach(freq =>{
                    var contextObject = JsonConvert.DeserializeObject<List<FrequencyQItem>>(freq.Context).ToList();
                    contextObject.ForEach(i=> i.TypeOfId = freq.TypeOf.Id);
                    resultQItems.AddRange(contextObject);
                    });

                    TomFactory factory = new TomFactory();
                    
                    var searchArray = JsonConvert.DeserializeObject<List<string>>(searchObject.Text).ToArray();
                    miv.Add(factory.create((SearchType)searchObject.SearchType, memo, resultQItems ,searchArray));
                    resultQItems = new List<FrequencyQItem>();
                });
            return miv.OrderByDescending(m=>m.Score).ToList();
        }
    }
}
