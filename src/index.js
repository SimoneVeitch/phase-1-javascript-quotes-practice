document.addEventListener('DOMContentLoaded', () => {

    const quoteList = document.querySelector("#quote-list");
    const form = document.querySelector("#new-quote-form");
    
    // Function to fetch and render all quotes
    function fetchQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quotes => {
        quotes.forEach(quote => renderQuote(quote));
    })
    .catch(error => console.error('Error:', error));
}

function renderQuote(quote) {
    const li = document.createElement('li');
    li.classList.add('quote-card');

    const likesCount = quote.likes ? quote.likes.length : 0;

    li.innerHTML = `
        <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success' data-id="${quote.id}" data-likes="${likesCount}">Likes: <span>${likesCount}</span></button>
            <button class='btn-danger' data-id="${quote.id}">Delete</button>
        </blockquote>
    `;

    quoteList.appendChild(li);

    // Add event listener for like button
    li.querySelector('.btn-success').addEventListener('click', handleLike);
    // Add event listener for delete button
    li.querySelector('.btn-danger').addEventListener('click', handleDelete);
}

// Initial fetch and render of quotes
fetchQuotes();

// Function to handle like button click
function handleLike(event) {
    const quoteId = event.target.dataset.id;
    const likesSpan = event.target.querySelector('span');
    const currentLikes = parseInt(event.target.dataset.likes);

    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quoteId })
    })
    .then(response => response.json())
    .then(data => {
        likesSpan.textContent = currentLikes + 1;
        event.target.dataset.likes = currentLikes + 1;
    })
    .catch(error => console.error('Error:', error));
}

// Function to handle delete button click
function handleDelete(event) {
    const quoteId = event.target.dataset.id;

    fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            event.target.parentElement.parentElement.remove();
        } else {
            console.error('Failed to delete quote');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Event listener for quote form submission
form.addEventListener('submit', event => {
    event.preventDefault();
    const text = document.getElementById('new-quote').value;
    const author = document.getElementById('author').value;

    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quote: text, author })
    })
    .then(response => response.json())
    .then(data => {
        console.log("submitted");
        renderQuote(data);
        document.getElementById('new-quote').value = '';
        document.getElementById('author').value = '';
    })
    .catch(error => console.error('Error:', error));
});


});
