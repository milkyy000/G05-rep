//DISPLAY NEW PFP AFTER CHOSEN
const file = document.querySelector('#file');
const imgDiv = document.querySelector('.userImg');
const img = document.querySelector('#photo');
const pfpForm = document.querySelector('#pfp-form')
//Create a new submit button for image form


file.addEventListener('change', function(){
    const chosenFile = this.files[0];
    console.log(chosenFile);
    if(chosenFile){
        const reader = new FileReader();

        reader.addEventListener('load', function(){
            img.setAttribute('src', reader.result);
            const newSubmitButton = document.createElement("button");
            newSubmitButton.setAttribute('type', 'submit');
            newSubmitButton.setAttribute('id', 'pfpSubmit');
            pfpForm.appendChild(newSubmitButton);
            const pfpSubmit = document.querySelector("#pfpSubmit")
            pfpSubmit.textContent = 'Save';
            // pfpSubmit.setAttribute('value', 'Submit');
            
            console.log('trying to create a submit button');
        });

        reader.readAsDataURL(chosenFile);
    } else {
        reader.addEventListener('load', function(){
            img.setAttribute('src', '/images/neco-arc.png');
        });
    }
});

$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  }) //What is this for ???
