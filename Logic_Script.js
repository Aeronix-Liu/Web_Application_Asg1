//####Task 0: Hide or Show for the button####
document.addEventListener('DOMContentLoaded', function() {     
    const toggleBtn = document.getElementById('toggleExtraBar');
    const extraBar = document.getElementById('extraBar');
    
    toggleBtn.addEventListener('click', function() {
        if (extraBar.style.display === 'none' || extraBar.style.display === '') {
            extraBar.style.display = 'flex';
            toggleBtn.textContent = 'Hide';
        } else {
            extraBar.style.display = 'none';
            toggleBtn.textContent = 'Show';
        }
    });
});

//####Task 0: Hide or Show for the extra bar####
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleExtraBar');
    const extraBar = document.getElementById('extraBar');
    
    toggleBtn.addEventListener('click', function() {
        extraBar.classList.toggle('hidden');
        toggleBtn.textContent = extraBar.classList.contains('hidden') ? 'Show' : 'Hide';
    });
});

//####Task 1: Font Size####
document.addEventListener('DOMContentLoaded', function() {
    const fontSizePlus = document.querySelector('.task-btn-green');
    const fontSizeMinus = document.querySelector('.task-btn-red');
    const contentElements = document.querySelectorAll('body *:not(nav *, .task-btn)');

    // Get current computed font size of an element (in px)
    function getCurrentFontSize(el) {
        const style = window.getComputedStyle(el);
        const fontSize = style.fontSize;
        return parseFloat(fontSize); // Convert "16px" to 16
    }

    // Increase font size by 1px (with max limit)
    fontSizePlus.addEventListener('click', function() {
        contentElements.forEach(el => {
            const currentSize = getCurrentFontSize(el);
            if (currentSize < 32) {
                el.style.fontSize = `${currentSize + 1}px`;
            }
        });
    });

    // Decrease font size by 1px (with min limit)
    fontSizeMinus.addEventListener('click', function() {
        contentElements.forEach(el => {
            const currentSize = getCurrentFontSize(el);
            if (currentSize > 8) {
                el.style.fontSize = `${currentSize - 1}px`;
            }
        });
    });
});

//####Task 2: spotlight####
document.addEventListener('DOMContentLoaded', function() {
    const spotlightBtn = document.querySelector('.task-btn-gray');
    const spotlightArea = document.getElementById('spotlightArea');
    const hideBtn = document.getElementById('hideSpotlight');
    const spotlightContent = document.getElementById('spotlightContent');

    // Task button: show area + trigger prompt
    spotlightBtn.addEventListener('click', () => {
        spotlightArea.style.display = 'block'; // Ensure area is visible
        addSpotlight(); // Open prompt to add content
    });

    // Hide button: hide area
    hideBtn.addEventListener('click', () => {
        spotlightArea.style.display = 'none';
    });

    // Double click area to add more content
    spotlightArea.addEventListener('dblclick', function(e) {
        if (e.target === this || e.target === spotlightContent) {
            addSpotlight();
        }
    });

    function addSpotlight() {
        const input = prompt('Enter spotlight content:');
        if (input?.trim()) {
            const initialHint = spotlightContent.querySelector('.initial-hint');
            if (initialHint) spotlightContent.removeChild(initialHint);

            const item = document.createElement('div');
            item.className = 'spotlight-item';
            item.textContent = input.trim();

            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.textContent = '×';
            delBtn.addEventListener('click', () => {
                spotlightContent.removeChild(item);
                if (!spotlightContent.children.length) {
                    const hint = document.createElement('p');
                    hint.className = 'initial-hint';
                    hint.textContent = 'The spotlights you add will be shown below.';
                    spotlightContent.appendChild(hint);
                }
            });

            item.appendChild(delBtn);
            spotlightContent.appendChild(item);
        }
    }
});

// ####Task 3 : bootstrap and current time####
document.addEventListener('DOMContentLoaded', function() {

    const task3Btn = document.querySelector('.task-btn-blue');
    const timeModal = new bootstrap.Modal(document.getElementById('timeModal'));
    const currentTimeEl = document.getElementById('currentTime');

    task3Btn.addEventListener('click', function() {

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); 
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        currentTimeEl.textContent = `Current Time: ${formattedTime}`;

        timeModal.show();
    });
});

//#### Problem 4-6: Add comment && verification && loading ####
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements related to comment form and display area
    const commentForm = document.getElementById('commentForm');
    const commentsContainer = document.getElementById('comments-container');
    const emailInput = document.getElementById('email');
    const commentInput = document.getElementById('comment');
    const emailError = document.getElementById('emailError');
    const commentError = document.getElementById('commentError');
    
    // Define the comment file path on the Simple Web Server
    const COMMENT_FILE = 'dist\\comments.json'; 
    let isLoading = false; // Prevent duplicate loading
    
    // --------------------------
    // 1. Load comments function (loads all comments at once)
    // --------------------------
    function loadComments() {
        if (isLoading) return;
        isLoading = true;
        
        fetch(COMMENT_FILE)
            .then(response => {
                if (!response.ok) throw new Error('Comment file not found');
                return response.json();
            })
            .then(comments => {
                // Clear existing comments before loading new ones
                commentsContainer.innerHTML = '';
                
                // If no comments exist, show default
                if (!comments || comments.length === 0) {
                    renderComment('default@example.com', 'Red', 'This is a default comment.');
                    return;
                }
                
                // Render all saved comments
                comments.forEach(comment => {
                    renderComment(comment.email, comment.color, comment.text);
                });
            })
            .catch(error => {
                console.log('Error loading comments:', error);
                // Show default comment if no comments are loaded
                if (commentsContainer.children.length === 0) {
                    renderComment('default@example.com', 'Red', 'This is a default comment.');
                }
            })
            .finally(() => {
                isLoading = false;
            });
    }

    // --------------------------
    // 2. Save comments function
    // --------------------------
    function saveComments() {
        const allComments = [];
        document.querySelectorAll('.comment-item').forEach(item => {
            const email = item.querySelector('strong').textContent;
            const color = item.querySelector('.comment-color').textContent;
            const text = item.querySelector('p:nth-child(2)').textContent;
            allComments.push({ email, color, text });
        });

        fetch(COMMENT_FILE, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(allComments, null, 2),
        })
            .then(response => {
                if (response.ok) {
                    console.log('Comments saved successfully');
                } else {
                    throw new Error('Failed to save comments: ' + response.statusText);
                }
            })
            .catch(error => {
                console.error('Error saving comments:', error);
                alert('Failed to save comment. Please check server configuration.');
            });
    }

    // --------------------------
    // 3. Render a single comment
    // --------------------------
    function renderComment(email, color, text) {
        const newComment = document.createElement('div');
        newComment.className = 'comment-item';
        newComment.style.borderLeft = `4px solid ${color}`;
        newComment.innerHTML = `
            <p><strong>${email}</strong> <span class="comment-color" style="background: ${color}">${color}</span></p>
            <p>${text}</p>
        `;
        commentsContainer.appendChild(newComment);
    }

    // --------------------------
    // 4. Form submission handling
    // --------------------------
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Email validation
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            emailError.textContent = "Email cannot be empty";
            isValid = false;
        } else if (!emailRegex.test(email)) {
            emailError.textContent = "Please enter a valid email (e.g., example@domain.com)";
            isValid = false;
        } else {
            emailError.textContent = "";
        }

        // Comment validation
        const commentText = commentInput.value.trim();
        if (!commentText) {
            commentError.textContent = "Comment cannot be empty";
            isValid = false;
        } else {
            commentError.textContent = "";
        }

        if (isValid) {
            const color = document.querySelector('input[name="color"]:checked').value;
            renderComment(email, color, commentText);
            saveComments(); // Save after adding new comment
            commentForm.reset();
        }
    });

    // --------------------------
    // 5. Real-time error clearing
    // --------------------------
    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim()) emailError.textContent = "";
    });
    commentInput.addEventListener('input', () => {
        if (commentInput.value.trim()) commentError.textContent = "";
    });

    // Initialize: Load all comments when page loads
    loadComments();
});


// Back to Top functionality in the footer
document.addEventListener('DOMContentLoaded', function() {
  const backToTopBtn = document.getElementById('back-to-top');
  
  backToTopBtn.addEventListener('click', function() {
    // Smooth scroll to top of page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});