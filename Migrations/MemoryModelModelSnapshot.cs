﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using core.Models;

namespace core.Migrations
{
    [DbContext(typeof(MemoryModel))]
    partial class MemoryModelModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.0-rtm-30799");

            modelBuilder.Entity("core.Models.Item", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Context");

                    b.Property<int?>("MemoId");

                    b.Property<int?>("TypeOfId");

                    b.HasKey("Id");

                    b.HasIndex("MemoId");

                    b.HasIndex("TypeOfId");

                    b.ToTable("Items");
                });

            modelBuilder.Entity("core.Models.Memories", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Content");

                    b.Property<string>("MemoryTitle");

                    b.HasKey("Id");

                    b.ToTable("Memories");
                });

            modelBuilder.Entity("core.Models.Type", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Types");
                });

            modelBuilder.Entity("core.Models.Item", b =>
                {
                    b.HasOne("core.Models.Memories", "Memo")
                        .WithMany()
                        .HasForeignKey("MemoId");

                    b.HasOne("core.Models.Type", "TypeOf")
                        .WithMany()
                        .HasForeignKey("TypeOfId");
                });
#pragma warning restore 612, 618
        }
    }
}
