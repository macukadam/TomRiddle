using System.Collections.Generic;
using core.Models;
using System.Linq;

namespace core.ViewModel
{
    public class MemoryTomsViewModel : MemoryIndexViewModel
    {
        public MemoryTomsViewModel(Memories memory, List<FrequencyQItem> freqList, string[] text) : base(memory, freqList, text)
        {
        }

        public override int calculateScore(string[] text)
        {
            var property = Qitem.Where(i=> i.TypeOfId == 1 && text.Any(z => i.Item == z)).Select(l=> l.Count).Sum() * 1;
            var title = Qitem.Where(i=> i.TypeOfId == 2 && text.Any(z => i.Item == z)).Select(l=> l.Count).Sum() * 10;
            var subclass = Qitem.Where(i=> i.TypeOfId == 3 && text.Any(z => i.Item == z)).Select(l=> l.Count).Sum() * 3;
            var instance = Qitem.Where(i=> i.TypeOfId == 4 && text.Any(z => i.Item == z)).Select(l=> l.Count).Sum() * 5;
            return property + title + subclass + instance;
        }
    }
}