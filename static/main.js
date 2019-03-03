var clearEmotions = function() {
    var container = document.getElementById('faces');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};

var idGenerator = function(id) {
    return 'face' + id;
};

var createEmoji = function(id, gender, emotion) {
    var filePath = 'faces/' + emotion + '_' + gender + '.png';
    var element = document.createElement('img');
    element.src = filePath;

    var imgContainer = document.createElement('div');
    imgContainer.setAttribute('class', 'face scale-up-center');
    imgContainer.appendChild(element);
    imgContainer.id = id;
    
    return imgContainer;
};

var registry = {};

var clearRegistry = function() {
    registry = {};
}

var showEmotion = function(data) {
    if(data.length != Object.keys(registry).length) {
        clearEmotions();
        clearRegistry();
    }
    var container = document.getElementById('faces');
    for(var face of data) {
        var faceID = idGenerator(face[0]);
        if(registry.hasOwnProperty(faceID)) {
            var emotion = registry[faceID].emotion;
            var gender = registry[faceID].gender;
            if(gender != face[1] || emotion != face[2]) {
                registry[faceID] = {
                    gender: face[1],
                    emotion: face[2]
                };
                var element = createEmoji(idGenerator(face[0]), face[1], face[2]);

                var currentFace = document.querySelector('#' + faceID);
                container.insertBefore(element, currentFace);
                currentFace.remove();
            }
        }
        else {
            registry[faceID] = {
                gender: face[1],
                emotion: face[2]
            };
            var element = createEmoji(idGenerator(face[0]), face[1], face[2]);
            container.appendChild(element);

        }
    }
};

var startScreen = {
    create: function() {
        var element = document.createElement('div');
        element.id = "start";

        var img = document.createElement('img');
        img.src = 'robot_512.png';
        element.appendChild(img);

        return element;
    },
    append: function(element) {
        var container = document.getElementById('container');
        var toRemove = document.getElementById('faces');
        if(toRemove) {
            container.removeChild(toRemove);
        }
        container.appendChild(element);
    },
    isCreated: function() {
        return document.getElementById('start');
    }
};

var facesScreen = {
    create: function() {
        var element = document.createElement('div');
        element.id = "faces";

        return element;
    },
    append: function(element) {
        var container = document.getElementById('container');
        var toRemove = document.getElementById('start');
        if(toRemove) {
            container.removeChild(toRemove);
        }
        container.appendChild(element);
    },
    isCreated: function() {
        return document.getElementById('faces');
    }
}

var showStartScreen = function() {
    var element = startScreen.create();
    startScreen.append(element);
}

var showFaceScreen = function() {
    var element = facesScreen.create();
    facesScreen.append(element);
}

// reakcja na wiadomości z NN
var socket = io('http://localhost:7777');
socket.on('ai', function (data) { 
    if(!facesScreen.isCreated()) {
        showFaceScreen();
    }
      
    showEmotion(data);
});

showStartScreen();
showFaceScreen();
