async function handleSearch(event, folder) {
    const response = await fetch('http://127.0.0.1:5000/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            folder
        })
    });

    return await response.json();
}

module.exports = { handleSearch };