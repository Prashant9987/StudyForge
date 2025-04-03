document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = event.target[0].value;
    const password = event.target[1].value;

    // Send a request to the server for authentication
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Invalid username or password.');
        }
    })
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        alert(error.message);
    });

});
