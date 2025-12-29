 let allMovies = [];
    // URL to your public physical-movie-repo JSON
    // The Date.now() part forces GitHub to bypass the 5-minute cache
    const DATA_URL = 'https://raw.githubusercontent.com/davedrave/physical-movie-repo/refs/heads/main/movies.yml?v=' + Date.now();

async function loadData() {
    try {
        const response = await fetch(DATA_URL);
        const text = await response.text(); // Get as text first
        allMovies = jsyaml.load(text);      // Translate YAML to JS
        displayMovies(allMovies);
    } catch (error) {
        console.error('Error:', error);
    }
}

    function displayMovies(movies) {
        const tbody = document.getElementById('movie-rows');
        
        if (movies.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No movies found.</td></tr>';
            return;
        }

        tbody.innerHTML = movies.map(m => `
            <tr>
                <td style="color: #888;">${m.year}</td>
                <td style="font-weight: 500;">${m.title}</td>
                <td>
                    <span class="format-pill ${m.format.toLowerCase().includes('4k') ? 'tag-4k' : 'tag-blu'}">
                        ${m.format}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    // Search logic
    document.getElementById('search').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allMovies.filter(m => 
            m.title.toLowerCase().includes(term) || 
            m.year.toString().includes(term)
        );
        displayMovies(filtered);
    });

    loadData();