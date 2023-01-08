const omdbSite = "https://www.omdbapi.com/";
let apiKey = 'd925ad74';
let movieToSearch = document.forms.searchForm.search;
let httpRequest = new XMLHttpRequest();
let searchResult = [];
let currentPage = 1;
let modalElem = document.getElementById("detailsModal");

let moviesDiv = document.getElementById("result");

window.addEventListener('scroll',onScrollHandler);

function formSubmitHandler(event){
    event.preventDefault();

    let url = `${omdbSite}?apikey=${apiKey}&s=${movieToSearch.value}`;
    httpRequest.onload = onApiResponse;

    httpRequest.open("GET",url);
    httpRequest.send();

    moviesDiv.innerHTML = "";
}

function fetchNext(page){
    let url = `${omdbSite}?apikey=${apiKey}&s=${movieToSearch.value}&page=${page}`;
    httpRequest.onload = onApiResponse;

    httpRequest.open("GET",url);
    httpRequest.send();
}

function onApiResponse(){
    let dataFromApi = JSON.parse (httpRequest.response); 
    searchResult = dataFromApi.Search;
    for (const movie of searchResult) {
        createMovie(movie)
    }
}

function createMovie(movie){
    let template = document.createElement("div");
    template.className= "col-md-4 mb-4";
    template.innerHTML=
    `
        <div class="card">
            <img onerror="imageOnErrorHandler(event)" class="card-img-top" src=${movie.Poster} alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <p class="card-text">${movie.Year}</p>
                <button id=${movie.imdbID} onclick="onDetailsClickHandler(this.id)" type="button" data-toggle="modal" data-target="#detailsModal" class="btn btn-primary">Details</button>
            </div>
        </div>       
    `
    moviesDiv.appendChild(template);
}

function imageOnErrorHandler(event){
    event.target.src = "Placeholder.jpg"
}

function onScrollHandler(){
  
    let windowHeight = document.documentElement.clientHeight;
    let difference = document.body.scrollHeight - (window.scrollY + windowHeight);
    
    if(difference < 50){
        currentPage ++;
        fetchNext(currentPage);
    }
}

function onDetailsClickHandler(id){
    let httpRequest = new XMLHttpRequest();
    
    console.log(id);
    let url = `${omdbSite}?apikey=${apiKey}&i=${id}`;
    httpRequest.onload = onDetailsResponse;

    httpRequest.open("GET",url);
    httpRequest.send();
}

function onDetailsResponse(event){
    let data =JSON.parse(event.target.response);
modalElem.querySelector(".modal-title").innerText = data.Title;
modalElem.querySelector(".modal-body").innerText = data.Plot;
}