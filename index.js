const autoCompleteConfig = {
//how it should look inside
renderOption(movie){
  const imgSrc = movie.Poster === 'N/A' ? '': movie.Poster;
  return  `
  <img src="${imgSrc}" />
  ${movie.Title} (${movie.Year})
  `;
},
//what to backfill inside
inputValue(movie){
  return movie.Title;
},
//initial request
async fetchData(searchTerm) {
  const response = await axios.get('http://www.omdbapi.com/', {
      params: {
          apikey: 'b8f5924b',
          s: searchTerm
      }
  });
  if (response.data.Error) {
    return [];
  }

  return response.data.Search;
  }
};

createAutoComplete({
  //where to place the autocomplete
  ...autoCompleteConfig, 
root: document.querySelector('#left-autocomplete'),
//what to do when clicked
onOptionSelect(movie){
  document.querySelector('.tutorial').classList.add('is-hidden');
  onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
}
});

createAutoComplete({
  //where to place the autocomplete
  ...autoCompleteConfig, 
root: document.querySelector('#right-autocomplete'),
//what to do when clicked
onOptionSelect(movie){
  document.querySelector('.tutorial').classList.add('is-hidden');
  onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
}
});

let leftMovie;
let rightMovie;
//follow up request for the selected movie
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
        apikey: 'b8f5924b',
        i: movie.imdbID
    }
  });
    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === 'left'){
      leftMovie = response.data;
    }else {
      rightMovie = response.data;
    }

    if (leftMovie && rightMovie){
      runComparison();
    }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue= leftStat.dataset.value;
    const rightSideValue= rightStat.dataset.value;

if (rightSideValue > leftSideValue){
  leftStat.classList.remove('is-primary');
  leftStat.classList.add('is-warning');
}else{
  rightStat.classList.remove('is-primary');
  rightStat.classList.add('is-warning');
}


  });
//run the first article element for each movie
//run a comparison of the number of awards
//then run some styling to that 'article' award

};

//movie info shown on screen

const movieTemplate = (movieDetail) =>{
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);
    if (isNaN(value)){
      return prev;
    }else {
      return prev + value;   
     }
  }, 0);


return  `
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
  </article>
  <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article data-value=${dollars} class="notification is-primary">
  <p class="title">${movieDetail.BoxOffice}</p>
  <p class="subtitle">Box Office</p>
</article>
<article data-value=${metascore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article  data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>
  <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
  
`;
};