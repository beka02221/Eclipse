// Function to handle showing the admin login prompt
function showAdminLogin() {
    const password = prompt("Введите пароль для доступа к админской панели:");
    if (password === "20072008") {
        window.location.href = "admin.html";
    } else {
        alert("Неверный пароль");
    }
}

window.onload = function() {
    getDataRealTime(); // Включаем получение данных в реальном времени
};

// Получение данных в реальном времени
function getDataRealTime() {
    firebase.database().ref('blogs/').on('value', function(snapshot) {
        var posts_div = document.getElementById('posts');
        posts_div.innerHTML = "";
        var data = snapshot.val();
        console.log(data);
        for (let [key, value] of Object.entries(data)) {
            posts_div.innerHTML = "<div class='col-sm-4 mt-2 mb-1'>" +
                "<div class='card'>" +
                "<img src='" + value.imageURL + "' style='height:250px;'>" +
                "<div class='card-body'><p class='card-text'>" + value.text + "</p>" +
                "</div></div></div>" + posts_div.innerHTML;
        }
    });
}

function upload() {
    var image = document.getElementById('image').files[0];
    var post = document.getElementById('post').value;
    var imageName = image.name;
    var storageRef = firebase.storage().ref('images/' + imageName);

    var uploadTask = storageRef.put(image);

    uploadTask.on('state_changed', function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
    }, function(error) {
        console.log(error.message);
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            firebase.database().ref('blogs/').push().set({
                text: post,
                imageURL: downloadURL
            }, function(error) {
                if (error) {
                    alert("Error while uploading");
                } else {
                    alert("Successfully uploaded");
                    document.getElementById('post-form').reset();
                }
            });
        });
    });
}
