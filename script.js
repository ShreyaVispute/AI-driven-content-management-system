document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const platform = card.getAttribute('data-platform');
            window.location.href = `generate.html?platform=${encodeURIComponent(platform)}`;
        });
    });



    // Check if we're on the generate page
    if (window.location.pathname.endsWith('generate.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const platform = urlParams.get('platform');

        // Display the selected platform
        const platformHeading = document.getElementById('platform-heading');
        platformHeading.textContent = `Generating content for ${platform}`;

        // Handle prompt submission
        const form = document.getElementById('content-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const promptInput = document.getElementById('prompt-input').value;
            const lengthInput = document.querySelector('input[name="length"]:checked').value;

            // Call your API to generate content based on platform, prompt, and length
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: `${platform}: ${promptInput}, Length: ${lengthInput}` })
            });

            // Check for response status
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
                alert('Error generating content. Please try again.');
                return;
            }

            const data = await response.json();
            const generatedContent = document.getElementById('generated-content');
            generatedContent.innerHTML = formatGeneratedContent(data.result); // Display formatted generated content
        });
    }
});

// Function to format the generated content
function formatGeneratedContent(content) {
    // Replace <b> tags with bold formatting
    return content.replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>');
}
