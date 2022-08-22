import * as UI from './selectors.js';

const imagesPerPage = 50;
let totalPages; 
let iterator;
let currentPage = 1;

function showMessage( message ) {
    const existErrorMessage = document.querySelector('.error');

    if ( !existErrorMessage ) {
        const errorMessage = document.createElement('p');
        errorMessage.innerHTML = `<strong class="font-bold">Error: </strong> ${message}`;
        errorMessage.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'mt-6', 'mx-auto', 'text-center', 'rounded', 'error');

        UI.form.appendChild(errorMessage);

        setTimeout(() => {
            clearHtmlElement(errorMessage);
        }, 3000);
    }
}

function clearHtmlElement( htmlElement ) {
    htmlElement.remove();
}

async function searchImages() {

    const searchTerm = UI.searchInput.value.trim();
    const API_KEY = '29361627-845d1cb16efc30e5edecd20a3';
    const URL = `https://pixabay.com/api/?q=${searchTerm}&key=${API_KEY}&lang=en&per_page=${imagesPerPage}&page=${currentPage}`;

    try {
        const response = await fetch(URL);
        const data = await response.json();
        totalPages = getTotalPages(data.totalHits); 
        showImages( data.hits);
    } catch (error) {
        console.log('Error: ', error);
    }

    // fetch(URL)
    //     .then(response => response.json())
    //     .then(data => {
    //         totalPages = getTotalPages(data.totalHits);
    //         console.log({totalPages});
    //         showImages(data.hits)
    //     })
    //     .catch(error => console.log('Error: ', error));
}

function showImages( imagesArr ) {
    // Clear the previous content
    UI.resultDiv.textContent = '';

    imagesArr.forEach( img => {
        const { previewURL, likes, views, largeImageURL } = img;

        UI.resultDiv.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src=${previewURL}>
                    <div class="p-4">
                        <p class="font-bold">${likes}<span class="font-light"> Likes</span></p>
                        <p class="font-bold">${views}<span class="font-light"> Views</span></p>
                        <a href=${largeImageURL} 
                        class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" target="_blank" rel="noopener noreferrer">
                            See image
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    UI.paginationDiv.textContent = '';
    
    printPaginator();
}

function getTotalPages( totalImages ) {
    return  Math.ceil(Number(totalImages) / imagesPerPage);
}

function *createPaginator( total ) {
    console.log('Generator Init: ', total);
    for(let i = 1; i <= total; i++) {
        yield i;
    }
}

function printPaginator() {
   
    iterator = createPaginator(totalPages);
    let looping = true;

    do {
        const { value, done } = iterator.next();
        if( done ) return;

        const pageRef = document.createElement('a')
        pageRef.href = '#';
        pageRef.dataset.page = value;
        pageRef.textContent = value;
        pageRef.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'mb-4', 'uppercase', 'rounded', 'font-bold');

        pageRef.onclick = () => {
            currentPage = value;
            searchImages();
        }

        UI.paginationDiv.appendChild(pageRef);

    } while( looping )
}


export { 
    showMessage,
    clearHtmlElement,
    searchImages,
    showImages
}