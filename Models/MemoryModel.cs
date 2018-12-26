using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace core.Models
{
    public class MemoryModel : DbContext
    {
        public MemoryModel(DbContextOptions<MemoryModel> options)
            :base(options)
        { }

        public DbSet<Memories> Memories {get; set;}
        public DbSet<Type> Types {get; set;}
        public DbSet<Item> Items {get; set;}


    }

    public class Memories
    {
        public int Id {get; set;}
        public string MemoryTitle {get; set;}
        public string Content {get; set;}
    }

    public class Type
    {
        public int Id {get; set;}
        public string Name {get; set;}
    }

    public class Item
    {
        public int Id { get; set; }
        public string Context { get; set; }
        public Type TypeOf {get; set;}
        public Memories Memo {get; set;}

    }
}