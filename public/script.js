// DOM Elements
const urlForm = document.getElementById('urlForm');
const longUrlInput = document.getElementById('longUrl');
const resultDiv = document.getElementById('result');
const shortUrlInput = document.getElementById('shortUrl');
const shortUrlDisplay = document.getElementById('shortUrlDisplay');
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
            // Extract just the short code
            const shortCode = data.shortUrl.split('/').pop();
            
            // Store full URL in hidden field
            shortUrlInput.value = data.shortUrl;
            
            // Display only the short code
            shortUrlDisplay.value = `🔗 ${shortCode}`;
            shortUrlDisplay.dataset.fullUrl = data.shortUrl;
            
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
    const fullUrl = shortUrlInput.value;
    
    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullUrl).then(() => {
            showCopySuccess();
        }).catch(() => {
            // Fallback
            fallbackCopy(fullUrl);
        });
    } else {
        fallbackCopy(fullUrl);
    }
});

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showCopySuccess();
}

function showCopySuccess() {
    copyMessage.classList.remove('hidden');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    
    setTimeout(() => {
        copyMessage.classList.add('hidden');
        copyBtn.textContent = originalText;
    }, 2000);
}

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
                    <div class="url-short" title="${url.shortUrl}" onclick="copyToClipboard('${url.shortUrl}', this)" style="cursor: pointer;">
                        ${formatUrlDisplay(url.shortUrl)}
                        <span style="font-size: 0.8em; opacity: 0.6; margin-left: 8px;">📋 Click to copy</span>
                    </div>
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

// Copy to clipboard helper
function copyToClipboard(text, element) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            const original = element.innerHTML;
            element.innerHTML = '✅ Copied!';
            setTimeout(() => {
                element.innerHTML = original;
            }, 1500);
        });
    } else {
        alert('Full URL: ' + text);
    }
}

// Format URL for better display
function formatUrlDisplay(url) {
    try {
        // Extract just the short code for cleaner display
        const shortCode = url.split('/').pop();
        return `🔗 ${shortCode}`;
    } catch {
        return url;
    }
}
