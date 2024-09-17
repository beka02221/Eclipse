// Функция для показа окна входа для администратора
function showAdminLogin() {
    const password = prompt("Введите пароль для доступа к админской панели:");
    if (password === "20072008") {
        window.location.href = "admin.html";
    } else {
        alert("Неверный пароль");
    }
}

window.onload = function() {
    getDataRealTime(); // Получаем данные в реальном времени
};

// Функция для получения данных в реальном времени
function getDataRealTime() {
    firebase.database().ref('blogs/').on('value', function(snapshot) {
        var posts_div = document.getElementById('posts');
        posts_div.innerHTML = "";
        var data = snapshot.val();
        console.log(data);
        for (let [key, value] of Object.entries(data)) {
            // Проверяем наличие текста
            var textBlock = value.text ? "<div class='card-body'><p class='card-text'>" + value.text + "</p></div>" : "";

            // Создаем карточки с фото
            posts_div.innerHTML += 
                "<div class='card'>" +
                "<img src='" + value.imageURL + "' alt='Image'>" +
                textBlock +
                "</div>";
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
                    alert("Ошибка при загрузке");
                } else {
                    alert("Успешно загружено");
                    document.getElementById('post-form').reset();
                }
            });
        });
    });
}
