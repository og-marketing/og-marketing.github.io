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
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    let isSoundMuted = true;

    function sendPlayerCommand(func, args = []) {
        try {
            if (youtubeIframe && youtubeIframe.contentWindow) {
                youtubeIframe.contentWindow.postMessage(JSON.stringify({
                    event: 'command',
                    func: func,
                    args: args
                }), '*');
            }
        } catch (e) {}
    }

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isSoundMuted) {
                sendPlayerCommand('unMute');
                sendPlayerCommand('setVolume', [100]);
                isSoundMuted = false;
                soundToggleBtn.querySelector('.sound-icon').textContent = '🔊';
                soundToggleBtn.querySelector('.sound-text').textContent = 'Sound ON';
                soundToggleBtn.style.background = '#ffffff';
                soundToggleBtn.style.color = '#000000';
            } else {
                sendPlayerCommand('mute');
                isSoundMuted = true;
                soundToggleBtn.querySelector('.sound-icon').textContent = '🔇';
                soundToggleBtn.querySelector('.sound-text').textContent = 'Sound Muted';
                soundToggleBtn.style.background = 'rgba(255, 255, 255, 0.85)';
                soundToggleBtn.style.color = '#000000';
            }
        });
    }

    // Handle Card Click -> Play Video directly on tap
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', () => {
            const ytUrl = card.getAttribute('data-youtube') || 'hMzav_ATKq0';
            playVideo(ytUrl);
        });
    });

    function playVideo(url) {
        const videoId = getYouTubeId(url);
        
        // 1. Show modal FIRST so iframe is in active layout and not hidden
        videoModal.classList.add('is-active');
        document.body.style.overflow = 'hidden';

        // Reset sound pill
        isSoundMuted = true;
        if (soundToggleBtn) {
            soundToggleBtn.querySelector('.sound-icon').textContent = '🔊';
            soundToggleBtn.querySelector('.sound-text').textContent = 'Sound: Tap to Unmute';
            soundToggleBtn.style.background = 'rgba(255, 255, 255, 0.95)';
            soundToggleBtn.style.color = '#000000';
        }

        // 2. Set embed URL with guaranteed instant autoplay (mute=1 ensures zero red play button)
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0&controls=1`;
        youtubeIframe.src = embedUrl;

        // 3. Automated playback & unMute signals
        youtubeIframe.onload = () => {
            sendPlayerCommand('playVideo');

            // Attempt unMute at staggered intervals
            [300, 600, 1000].forEach(delay => {
                setTimeout(() => {
                    sendPlayerCommand('playVideo');
                    sendPlayerCommand('unMute');
                    sendPlayerCommand('setVolume', [100]);
                }, delay);
            });
        };
    }

    function closeVideoModal() {
        videoModal.classList.remove('is-active');
        youtubeIframe.src = 'about:blank'; // Stop video and audio cleanly
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

    /* --- Hide Header on Scroll --- */
    const studioHeader = document.querySelector('.studio-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            if (studioHeader) studioHeader.classList.add('header-hidden');
        } else {
            if (studioHeader) studioHeader.classList.remove('header-hidden');
        }
    }, { passive: true });

    /* --- Video Type Filter Pills --- */
    const filterPills = document.querySelectorAll('.filter-pill');
    const videoCards = document.querySelectorAll('.video-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = (pill.getAttribute('data-filter') || 'all').trim();

            videoCards.forEach(card => {
                const cardType = (card.getAttribute('data-type') || '').trim();
                if (filter === 'all' || cardType === filter) {
                    card.classList.remove('is-hidden');
                    card.style.display = '';
                } else {
                    card.classList.add('is-hidden');
                    card.style.display = 'none';
                }
            });
        });
    });

    /* --- Dynamic WhatsApp Inquiry Handling (+91 9016786537) --- */
    const quickMsgInput = document.getElementById('quick-inquiry-msg');
    const whatsappBtn = document.getElementById('whatsapp-inquiry-btn');
    const basePhone = '919016786537';

    if (quickMsgInput && whatsappBtn) {
        const updateWhatsAppUrl = () => {
            const userMsg = quickMsgInput.value.trim();
            const text = userMsg 
                ? `Hello OG Marketing, I want to inquire for video editing. Project details: ${userMsg}`
                : `Hello OG Marketing, I want to send an inquiry for video editing services.`;
            whatsappBtn.href = `https://wa.me/${basePhone}?text=${encodeURIComponent(text)}`;
        };

        quickMsgInput.addEventListener('input', updateWhatsAppUrl);
        quickMsgInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                updateWhatsAppUrl();
                whatsappBtn.click();
            }
        });
    }

});
