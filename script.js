function scrapeComments() {
    const link = document.getElementById('fb_link').value;
    fetch('http://127.0.0.1:5000/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: link })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadComments();
    });
}

function loadComments() {
    fetch('http://127.0.0.1:5000/get_comments')
    .then(response => response.json())
    .then(data => {
        const commentsDiv = document.getElementById('comments');
        commentsDiv.innerHTML = '';
        data.forEach((comment, index) => {
            const label = comment.label || 'neutral';
            commentsDiv.innerHTML += `
                <div class="comment ${label}" id="comment_${index}">
                    <p>${comment.text}</p>
                    <button type="button" onclick="labelComment(${index}, 'pro')" class="pro">Pro</button>
                    <button type="button" onclick="labelComment(${index}, 'anti')" class="anti">Anti</button>
                    <button type="button" onclick="labelComment(${index}, 'neutral')" class="neutral">Neutral</button>
                </div>
            `;
        });
    });
}

function labelComment(index, label) {
    fetch('http://127.0.0.1:5000/label_comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index, label })
    })
    .then(response => response.json())
    .then(() => {
        const commentDiv = document.getElementById(`comment_${index}`);
        commentDiv.className = `comment ${label}`;
    })
    .catch(error => console.error('Error:', error));
}

function analyzeSentiment() {
    fetch('http://127.0.0.1:5000/analyze_sentiment')
    .then(response => response.json())
    .then(data => {
        alert('Sentiment Analysis Complete!');
        console.log(data);
    });
}

loadComments();