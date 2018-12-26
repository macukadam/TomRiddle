using System;
using System.Collections.Generic;
using core.Models;

namespace core.ViewModel
{
    public class MemoryHolderViewModel
    {

        public Memories _memo;

        public List<Item> _items;

        public MemoryHolderViewModel(Memories memo, List<Item> items)
        {
            _memo = memo;
            _items = items;
        }
        

    }
}