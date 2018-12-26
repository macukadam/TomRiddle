using System;
using System.Collections.Generic;
using core.Models;

namespace core.ViewModel
{
    public class MemoryCreateViewModel
    {
        public string Title { get; set; }
        public string HiddenProperties { get; set; }
        public string HiddenTitles { get; set; }
        public string HiddenSubclasses { get; set; }
        public string HiddenInstances { get; set; }
        public string Content { get; set; }
    }
}