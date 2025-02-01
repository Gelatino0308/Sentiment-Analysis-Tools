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
            const div = document.createElement('div');
            div.className = `comment ${label}`;
            div.id = `comment_${index}`;
            
            div.innerHTML = `
                <p>${comment.text}</p>
                <button type="button" class="pro">Pro</button>
                <button type="button" class="anti">Anti</button>
                <button type="button" class="neutral">Neutral</button>
            `;
            
            div.querySelector('.pro').addEventListener('click', (e) => {
                e.preventDefault();
                labelComment(index, 'pro');
            });
            
            div.querySelector('.anti').addEventListener('click', (e) => {
                e.preventDefault();
                labelComment(index, 'anti');
            });
            
            div.querySelector('.neutral').addEventListener('click', (e) => {
                e.preventDefault();
                labelComment(index, 'neutral');
            });
            
            commentsDiv.appendChild(div);
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

loadComments();