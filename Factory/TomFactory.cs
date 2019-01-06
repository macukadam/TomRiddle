using System.Collections.Generic;
using core.Enums;
using core.Models;
using core.ViewModel;

namespace core.Factory
{
    public class TomFactory
    {
        public MemoryIndexViewModel create(SearchType st,Memories memory, List<FrequencyQItem> freqList, string[] text){
            switch (st)
            {
                case SearchType.TomSearch:
                    return new MemoryTomsViewModel(memory,freqList,text);
                case SearchType.ProperySearch:
                    return new MemoryPropertyViewModel(memory,freqList,text);
                case SearchType.InstanceSearch:
                    return new MemoryInstanceViewModel(memory,freqList,text);
                case SearchType.SubClassSearch:
                    return new MemorySubclassViewModel(memory,freqList,text);
                default: 
                    return new MemoryTomsViewModel(memory,freqList,text);
            }
        }
    }
}