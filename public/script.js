const button = document.getElementById('cmt');
    button.addEventListener('click',()=> {
        const button = document.getElementById('cmt');
        const form = document.createElement('form');
        const textarea = document.createElement('textarea');
        const newButton = document.createElement('button')
        form.setAttribute('action','/reply/<%= thread._id %>')
        form.setAttribute('method','POST')
        textarea.setAttribute('name','content');
        textarea.setAttribute('required');
        button.setAttribute('type','submit');
        form.appendChild(textarea);
        form.appendChild(button);
    }); 