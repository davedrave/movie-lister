let allMedia = [];
const DATA_URL = 'https://raw.githubusercontent.com/davedrave/physical-movie-repo/refs/heads/main/movies.yml?v=' + Date.now();

async function loadData() {
    try {
        const response = await fetch(DATA_URL);
        const text = await response.text();
        
        // Use js-yaml to parse the text
        const data = jsyaml.load(text);
        
        // Merge the two lists into one array
        // The [type: 'Movie'] part ensures we know which is which
        allMedia = [
            ...(data.Movies || []),
            ...(data.Shows || [])
        ];
        
        displayMedia(allMedia);
    } catch (error) {
        console.error('CLI_ERROR: Access Denied to Database', error);
        document.getElementById('movie-rows').innerHTML = '<tr><td colspan="4">ERROR_LOADING_DATA</td></tr>';
    }
}

function displayMedia(items) {
    const tbody = document.getElementById('movie-rows');
    
    tbody.innerHTML = items.map(m => {
        // 1. Check if season exists, format as [S1], [S2], etc.
        const seasonSuffix = m.season ? ` [Season ${m.season}]` : '';
        
        // 2. Combine title and the suffix
        const fullTitle = `${m.title}${seasonSuffix}`;

        return `
            <tr>
                <td class="type-cell">[${m.type.toUpperCase()}]</td>
                <td style="color: #888;">${m.year}</td>
                <td style="font-weight: 500;">${fullTitle}</td>
                <td>
                    <span class="format-pill ${m.format.toLowerCase().includes('4k') ? 'tag-4k' : 'tag-blu'}">
                        ${m.format}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

// Search logic
document.getElementById('search').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allMedia.filter(m => 
        m.title.toLowerCase().includes(term) || 
        m.type.toLowerCase().includes(term) ||
        m.year.toString().includes(term)
    );
    displayMedia(filtered);
});

loadData();