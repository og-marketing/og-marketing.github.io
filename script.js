/**
 * OG STUDIO - Video Portfolio Interactive Script
 */

// Helper to extract YouTube Video ID
function getYouTubeId(url) {
    if (!url) return 'hMzav_ATKq0';
    const cleanUrl = url.trim();

    // Standard /watch?v=ID
    let match = cleanUrl.match(/[?&]v=([^&#]+)/);
    if (match) return match[1];

    // youtu.be/ID
    match = cleanUrl.match(/youtu\.be\/([^?&#]+)/);
    if (match) return match[1];

    // /shorts/ID
    match = cleanUrl.match(/\/shorts\/([^?&#]+)/);
    if (match) return match[1];

    // /embed/ID
    match = cleanUrl.match(/\/embed\/([^?&#]+)/);
    if (match) return match[1];

    // Raw 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
        return cleanUrl;
    }

    return 'hMzav_ATKq0';
}

// Copy Email to Clipboard
function copyEmail(button, email) {
    navigator.clipboard.writeText(email).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#ffffff';
        button.style.color = '#000000';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 2000);
    }).catch(() => {
        alert('Email: ' + email);
    });
}

document.addEventListener('DOMContentLoaded', () => {

    const videoModal = document.getElementById('video-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBackBtn = document.getElementById('modal-back-btn');
    const youtubeIframe = document.getElementById('youtube-iframe');

    // Handle Card Click -> Play Video directly with sound
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', () => {
            const ytUrl = card.getAttribute('data-youtube') || 'https://www.youtube.com/embed/hMzav_ATKq0';
            playVideo(ytUrl);
        });
    });

    function playVideo(url) {
        const videoId = getYouTubeId(url);
        
        // Autoplay with voice (mute=0), playsinline
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&playsinline=1`;
        youtubeIframe.src = embedUrl;

        videoModal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
        videoModal.classList.remove('is-active');
        youtubeIframe.src = ''; // Stop video and audio
        document.body.style.overflow = '';
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeVideoModal);
    if (modalBackBtn) modalBackBtn.addEventListener('click', closeVideoModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeVideoModal);

    // Keyboard ESC to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('is-active')) {
            closeVideoModal();
        }
    });

    /* --- Video Type Filter Pills --- */
    const filterPills = document.querySelectorAll('.filter-pill');
    const videoCards = document.querySelectorAll('.video-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.getAttribute('data-filter');

            videoCards.forEach(card => {
                const cardType = card.getAttribute('data-type') || 'commercial';
                if (filter === 'all' || cardType === filter) {
                    card.classList.remove('is-hidden');
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });

    /* --- Contact Form Handling --- */
    const contactForm = document.getElementById('contact-form');
    const formAlert = document.getElementById('form-alert');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formAlert.style.display = 'block';
            contactForm.reset();
            setTimeout(() => {
                formAlert.style.display = 'none';
            }, 5000);
        });
    }

});
