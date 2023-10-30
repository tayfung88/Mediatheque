// Attendez que la page soit totalement chargée
document.addEventListener("DOMContentLoaded", function () {
  // Obtenez les menus déroulants pour les auteurs et les genres
  let authorSelect = document.getElementById("authorSelect");
  let genreSelect = document.getElementById("genreSelect");

  // Obtenez l'élément où vous allez afficher la liste de livres
  let bookList = document.getElementById("bookList");

  // Chargez les données à partir du fichier JSON
  fetch("books.json")
    .then(function (response) {
      return response.json(); // Transformez la réponse en données compréhensibles
    })
    .then(function (data) {
      // Créez des listes vides pour stocker les auteurs et les genres uniques
      let allAuthors = [];
      let allGenres = [];

      // Parcourez les données pour remplir les listes d'auteurs et de genres
      data.forEach(function (book) {
        allAuthors.push(...book.authors);
        allGenres.push(...book.categories);
      });

      // Supprimez les doublons et triez les listes d'auteurs et de genres
      let uniqueAuthors = [...new Set(allAuthors)].sort();
      let uniqueGenres = [...new Set(allGenres)].sort();

      // Ajoutez chaque auteur trié comme option dans le menu des auteurs
      uniqueAuthors.forEach(function (author) {
        let option = new Option(author, author);
        authorSelect.appendChild(option);
      });

      // Ajoutez chaque genre trié comme option dans le menu des genres
      uniqueGenres.forEach(function (genre) {
        let option = new Option(genre, genre);
        genreSelect.appendChild(option);
      });

      // Écoutez les changements dans le menu des auteurs
      authorSelect.addEventListener("change", function () {
        let selectedAuthor = authorSelect.value;
        let selectedGenre = genreSelect.value;

        if (selectedAuthor !== "") {
          // Si un auteur est choisi, effacez la sélection de la catégorie
          genreSelect.value = "";
        }

        let filteredBooks = data.filter(function (book) {
          return (
            (selectedAuthor === "" || book.authors.includes(selectedAuthor)) &&
            (selectedGenre === "" || book.categories.includes(selectedGenre))
          );
        });
        // Mettez à jour la liste de livres
        displayBookList(filteredBooks);
      });

      // Écoutez les changements dans le menu des genres
      genreSelect.addEventListener("change", function () {
        let selectedGenre = genreSelect.value;
        let selectedAuthor = authorSelect.value;

        if (selectedGenre !== "") {
          // Si une catégorie est choisie, effacez la sélection de l'auteur
          authorSelect.value = "";
        }

        let filteredBooks = data.filter(function (book) {
          return (
            (selectedGenre === "" || book.categories.includes(selectedGenre)) &&
            (selectedAuthor === "" || book.authors.includes(selectedAuthor))
          );
        });
        // Mettez à jour la liste de livres
        displayBookList(filteredBooks);
      });

      // Fonction pour afficher la liste de livres
      function displayBookList(books) {
        // Effacez la liste de livres actuelle
        bookList.innerHTML = "";

        // Affichez les informations de chaque livre sous forme de cartes
        books.forEach(function (book) {
          let bookCard = document.createElement("div");
          bookCard.classList.add("book-card");
          bookCard.innerHTML = `
              <h2>${book.title}</h2>
              <img src="${book.thumbnailUrl}" alt="Jaquette">
              <p>ISBN: ${book.isbn}</p>
              <p>Date de publication: ${book.publishedDate.dt_txt}</p>
              <p>Nombre de pages: ${book.pageCount}</p>
              <p>${book.shortDescription}</p>
            `;
          bookList.appendChild(bookCard);
        });
      }
    })
    .catch(function (error) {
      console.error("Erreur lors du chargement des données : " + error);
    });
});
