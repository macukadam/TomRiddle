using System.Collections.Generic;
using System.Linq;
using core.Models;

namespace core.ViewModel
{
    public class MemoryInstanceViewModel : MemoryIndexViewModel
    {
        public MemoryInstanceViewModel(Memories memory, List<FrequencyQItem> freqList, string[] text) : base(memory, freqList, text)
        {
        }

        public override int calculateScore(string[] text)
        {
            return Qitem.Where(i=> i.TypeOfId == 4 && text.Any(z => i.Item == z)).Select(l=> l.Count).Sum() * 5;
        }
    }
}