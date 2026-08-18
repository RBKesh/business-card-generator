document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const inputs = {
        name: document.getElementById('fullName'),
        title: document.getElementById('jobTitle'),
        company: document.getElementById('company'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        website: document.getElementById('website'),
        linkedin: document.getElementById('linkedin'),
        twitter: document.getElementById('twitter')
    };

    // Output elements on the card
    const outputs = {
        name: document.getElementById('card-name'),
        title: document.getElementById('card-title'),
        company: document.getElementById('card-company'),
        email: document.getElementById('card-email'),
        phone: document.getElementById('card-phone'),
        website: document.getElementById('card-website'),
        linkedin: document.getElementById('card-linkedin'),
        twitter: document.getElementById('card-twitter')
    };

    // Live Update Logic
    const updateCard = () => {
        outputs.name.textContent = inputs.name.value || 'John Doe';
        outputs.title.textContent = inputs.title.value || 'Job Title';
        outputs.company.textContent = inputs.company.value || 'Company Name';
        outputs.email.textContent = inputs.email.value || 'email@example.com';
        outputs.phone.textContent = inputs.phone.value || 'Phone Number';
        outputs.website.textContent = inputs.website.value || 'Website';
        outputs.linkedin.textContent = inputs.linkedin.value || 'LinkedIn';
        outputs.twitter.textContent = inputs.twitter.value || 'Twitter';
    };

    // Add event listeners to all inputs
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', updateCard);
    });

    // Theme Switching
    const themeBtns = document.querySelectorAll('.theme-btn');
    const cardElement = document.getElementById('business-card');

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            themeBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get theme name
            const theme = btn.getAttribute('data-theme');
            
            // Remove all theme classes from card
            cardElement.className = 'business-card';
            // Add new theme class
            cardElement.classList.add(`theme-${theme}`);
        });
    });

    // Download functionality using html2canvas
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', () => {
        downloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        
        // Slight delay to ensure UI updates if needed
        setTimeout(() => {
            html2canvas(cardElement, {
                scale: 2, // High resolution
                useCORS: true,
                backgroundColor: null // Transparent background if theme allows
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `${inputs.name.value.trim().replace(/\s+/g, '_')}_Business_Card.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download PNG';
            }).catch(err => {
                console.error("Error generating image:", err);
                alert("Failed to generate image.");
                downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download PNG';
            });
        }, 100);
    });

    // Print functionality
    const printBtn = document.getElementById('printBtn');
    printBtn.addEventListener('click', () => {
        const printWindow = window.open('', '_blank');
        const cardHTML = cardElement.outerHTML;
        const styles = Array.from(document.styleSheets)
            .map(sheet => {
                try {
                    return Array.from(sheet.cssRules).map(rule => rule.cssText).join('');
                } catch(e) {
                    return ''; // handle CORS issues with external stylesheets
                }
            }).join('\n');

        // External styles (fonts and font-awesome)
        const externalLinks = `
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        `;

        const printHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Business Card</title>
                ${externalLinks}
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background: #fff;
                    }
                    ${styles}
                    .business-card {
                        box-shadow: none; /* Remove shadow for printing */
                        border: 1px solid #ddd;
                        transform: scale(1);
                    }
                </style>
            </head>
            <body>
                ${cardHTML}
                <script>
                    window.onload = function() {
                        setTimeout(() => {
                            window.print();
                            window.close();
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(printHTML);
        printWindow.document.close();
    });

    // Initialize initial state
    updateCard();
});
