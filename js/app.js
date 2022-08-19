import * as UI from './selectors.js';
import { showMessage, searchImages } from './functions.js'


window.onload = () => {
    UI.form.addEventListener('submit', validateForm);
}

function validateForm( e ) {
    e.preventDefault();

    const keyword = UI.searchInput.value.trim();

    if( !keyword ) {
        showMessage('Search term can not be blank!');
        return;
    }

    searchImages(keyword);
}