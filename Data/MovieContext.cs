using Microsoft.EntityFrameworkCore;
using MovieCatalogApi.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace MovieCatalogApi.Data
{
    public class MovieContext : DbContext
    {
        public MovieContext(DbContextOptions<MovieContext> options) : base(options) { }

        public DbSet<Movie> Movies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Movie>().HasData(
                new Movie { Id = 1, Title = "Inception", Genre = "Sci-Fi", Description = "A thief with the ability to enter dreams.", Year = 2010 },
                new Movie { Id = 2, Title = "The Godfather", Genre = "Crime", Description = "The aging patriarch of a crime dynasty.", Year = 1972 },
                new Movie { Id = 3, Title = "La La Land", Genre = "Romance", Description = "A love story between an actress and a musician.", Year = 2016 }
            );
        }
    }
}
