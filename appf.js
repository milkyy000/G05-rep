document.getElementById('postForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const postText = document.getElementById('postText').value;
    const postImage = document.getElementById('postImage').files[0];
    const postPrivacy = document.getElementById('postPrivacy').value;

    
    let imageUrl = '';
    if (postImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageUrl = e.target.result;
            savePost(postText, imageUrl, postPrivacy);
        };
        reader.readAsDataURL(postImage);
    } else {
        savePost(postText, imageUrl, postPrivacy);
    }
});

function savePost(text, image, privacy) {
    
    const post = {
        text: text,
        image: image,
        privacy: privacy
    };
    localStorage.setItem('post', JSON.stringify(post));

   
    window.location.href = 'post.html';
}
