document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackStatus = document.getElementById('feedbackStatus');
    const downloadBtn = document.getElementById('downloadFeedbackBtn');

    // Store the last submitted data so it can be downloaded even after the form reset
    let lastSubmittedData = null;

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('feedbackName').value.trim();
            const email = document.getElementById('feedbackEmail').value.trim();
            const message = document.getElementById('feedbackMessage').value.trim();

            if (!name || !email || !message) {
                showFeedbackStatus('Please fill in all fields.', 'error');
                return;
            }

            // Create feedback object
            const feedbackData = {
                name,
                email,
                message,
                date: new Date().toLocaleString()
            };

            // 1. Save locally
            saveToLocalStorage(feedbackData);

            // 2. Cache the data for potential download
            lastSubmittedData = feedbackData;

            // 3. Show Success UI
            showSuccessModal();
            feedbackForm.reset();
        });
    }

    // Handle Download Button Click
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            const name = document.getElementById('feedbackName').value.trim();
            const email = document.getElementById('feedbackEmail').value.trim();
            const message = document.getElementById('feedbackMessage').value.trim();

            // Case A: Form has data -> Download that
            if (name && email && message) {
                const feedbackData = {
                    name,
                    email,
                    message,
                    date: new Date().toLocaleString()
                };
                downloadFeedback(feedbackData);
                return;
            }

            // Case B: Form is empty, but we have recently submitted data -> Download that
            if (lastSubmittedData) {
                downloadFeedback(lastSubmittedData);
                showFeedbackStatus('Downloading last submitted feedback...', 'success');
                return;
            }

            // Case C: Form empty and no history
            showFeedbackStatus('Please fill in fields or submit feedback first.', 'error');
        });
    }

    function showFeedbackStatus(message, type) {
        if (feedbackStatus) {
            feedbackStatus.textContent = message;
            feedbackStatus.className = 'feedback-status ' + type;
            feedbackStatus.style.display = 'block';
            setTimeout(() => {
                feedbackStatus.style.display = 'none';
            }, 5000);
        }
    }

    function saveToLocalStorage(data) {
        let feedbacks = JSON.parse(localStorage.getItem('urban_waves_feedback') || '[]');
        feedbacks.push(data);
        localStorage.setItem('urban_waves_feedback', JSON.stringify(feedbacks));
        console.log('Feedback saved to LocalStorage:', data);
    }

    // Function to download feedback as a text file
    function downloadFeedback(data) {
        const textContent = `Date: ${data.date}\nName: ${data.name}\nEmail: ${data.email}\nMessage:\n${data.message}\n========================================\n`;
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `feedback_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function showSuccessModal() {
        const modal = document.getElementById('thankYouModal');
        if (modal) {
            modal.classList.add('active');
            modal.classList.remove('hidden');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
});

// Ensure closeModal is globally available
window.closeModal = function () {
    const modal = document.getElementById('thankYouModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
};
