// DOM Elements
const urlForm = document.getElementById('urlForm');
const longUrlInput = document.getElementById('longUrl');
const resultDiv = document.getElementById('result');
const shortUrlInput = document.getElementById('shortUrl');
const copyBtn = document.getElementById('copyBtn');
const copyMessage = document.getElementById('copyMessage');
const urlsList = document.getElementById('urlsList');

// Load URLs on page load
window.addEventListener('DOMContentLoaded', loadUrls);

// Form submission
urlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const longUrl = longUrlInput.value.trim();
    
    if (!longUrl) {
        alert('Please enter a URL');
        return;
    }

    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ longUrl })
        });

        const data = await response.json();

        if (response.ok) {
            // Show result
            shortUrlInput.value = data.shortUrl;
            resultDiv.classList.remove('hidden');
            
            // Clear form
            longUrlInput.value = '';
            
            // Reload URLs list
            loadUrls();
        } else {
            alert(data.error || 'Error creating short URL');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to create short URL');
    }
});

// Copy to clipboard
copyBtn.addEventListener('click', () => {
    shortUrlInput.select();
    document.execCommand('copy');
    
    // Show success message
    copyMessage.classList.remove('hidden');
    copyBtn.textContent = 'Copied!';
    
    setTimeout(() => {
        copyMessage.classList.add('hidden');
        copyBtn.textContent = 'Copy';
    }, 2000);
});

// Load URLs list
async function loadUrls() {
    try {
        const response = await fetch('/api/urls');
        const urls = await response.json();

        if (urls.length === 0) {
            urlsList.innerHTML = '<p class="no-urls">No URLs yet. Create your first short link above!</p>';
            return;
        }

        // Sort by creation date (newest first)
        urls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        urlsList.innerHTML = urls.map(url => `
            <div class="url-item">
                <div class="url-info">
                    <div class="url-short">${url.shortUrl}</div>
                    <div class="url-long">${url.longUrl}</div>
                    <div class="url-meta">
                        Created: ${formatDate(url.createdAt)} | Clicks: ${url.clicks}
                    </div>
                </div>
                <div class="url-actions">
                    <button class="btn-delete" onclick="deleteUrl('${url.shortCode}')">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading URLs:', error);
        urlsList.innerHTML = '<p class="no-urls">Error loading URLs</p>';
    }
}

// Delete URL
async function deleteUrl(shortCode) {
    if (!confirm('Are you sure you want to delete this URL?')) {
        return;
    }

    try {
        const response = await fetch(`/api/urls/${shortCode}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadUrls();
        } else {
            alert('Failed to delete URL');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete URL');
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
