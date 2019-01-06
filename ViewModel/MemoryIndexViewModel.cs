using core.Models;
using System.Collections.Generic;

namespace core.ViewModel
{
    public abstract class MemoryIndexViewModel
    {
        public Memories Memory { get; set; }

        public List<FrequencyQItem> Qitem { get; set; }

        public int Score { get; set; }

        public MemoryIndexViewModel(Memories memory, List<FrequencyQItem> freqList, string[] text)
        {
            Qitem = new List<FrequencyQItem>();
            Qitem.AddRange(freqList);
            Memory = memory;
            Score = calculateScore(text);
        }
        public abstract int calculateScore(string[] text);

    }
}