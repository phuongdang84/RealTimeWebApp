var Graph = function (canvas) {
    //init parameters
    if (typeof canvas == 'string') {
        canvas = document.getElementById(canvas);
    }

    //set up the height and width
    canvas.setAttribute('width', canvas.offsetWidth);
    canvas.setAttribute('height', canvas.offsetHeight);
    //set up canvas colors
    canvas.style.backgroundColor = 'rgb(25,25,25)';

    //variables
    var width = canvas.offsetWidth;
    var height = canvas.offsetHeight;
    var ctx = canvas.getContext('2d');
    var gridTileWidth = 5;
    var currentXvalue = 0;
    var lastYvalue = 0;

    //global functions

    this.drawValue = function (value) {
        drawValue(value);
    }

    this.getTimeInterval = function () {
        return 1000 / (gridTileWidth * 5);
    }

    //functions

    function drawGrid() {
        ctx.lineWidth = 1;
        var i;
        var verticalGridTiles = width / gridTileWidth;
        for (i = 0; i < verticalGridTiles; i++) {
            ctx.beginPath();
            if (i / 5 == Math.round(i / 5)) {
                ctx.strokeStyle = 'rgba(100, 100, 100, 0.425)';
                ctx.lineWidth = 0.2;
            } else {
                ctx.strokeStyle = 'rgba(80,80,80,0.5)';
                ctx.lineWidth = 0.1;
            }
            ctx.moveTo(i * gridTileWidth, 0);
            ctx.lineTo(i * gridTileWidth, height);
            ctx.stroke();
        }
        i = 0;
        for (i = 0; i < verticalGridTiles; i++) {
            ctx.beginPath();
            if (i / 5 == Math.round(i / 5)) {
                ctx.strokeStyle = 'rgba(100, 100, 100, 0.425)';
                ctx.lineWidth = 0.2;
            } else {
                ctx.strokeStyle = 'rgba(80,80,80,0.5)';
                ctx.lineWidth = 0.1;
            }
            ctx.moveTo(0, i * gridTileWidth);
            ctx.lineTo(width, i * gridTileWidth);
            ctx.stroke();
        }
    }

    function drawValue(value) {
        ctx.clearRect(currentXvalue, 0, 20, height);
        if (currentXvalue > width) {
            currentXvalue = 0;
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        var center = height / 1.5;
        ctx.moveTo(currentXvalue, center - lastYvalue);
        currentXvalue++;
        ctx.lineTo(currentXvalue, center - value);
        ctx.stroke();
        lastYvalue = value;
        drawGrid();

    }
}

var graphInstance = new Graph('rhythm');

var index = 0;
var asystole = [];
var vTach = [0, 10, 15, 20, 40, 44, 48, 52, 56, 52, 48, 44, 40, 30, 20, 15, 10];
var vFib = [];
setInterval(function () {
    if (rhythm === vFib) {
        vFib = [0];
        for (var i = 0; i < 10; i++) {
            vFib[i + 1] = vFib[i] + (Math.random() * 10) - (Math.random() * 10)
        }
        rhythm = vFib;
    }
}, 1000);
var nsr = [0, 0, 0, 0, 0, 0, 0, 5, 10, 14, 16, 17, 16, 14, 10, 7, 5, 4, 3, 2, 1, 0, -2, -4, -6, 10, 56, 20, 10, 0, 0, 0, -5, 0, 0, 0, 5, 6, 7, 8, 9, 9, 9, 8, 7, 6, 5, 4];
var beatsThisMinute = 0;
var rhythm = nsr;

setInterval(function () {
    // Mute sound 
    var mute = 1;

    if (index >= rhythm.length) {
        graphInstance.drawValue((Math.random() * 4));
    } else {
        if (rhythm[index] > 55) {
            var context = new (window.AudioContext || window.webkitAudioContext)();
            var osc = context.createOscillator(); // instantiate an oscillator
            osc.type = 'square'; // this is the default - also square, sawtooth, triangle
            osc.frequency.value = (mute === 1) ? 0 : 740; // Hz
            osc.connect(context.destination); // connect it to the destination
            osc.start(); // start the oscillator
            osc.stop(context.currentTime + .15); // stop 2 seconds after the current time
            beatsThisMinute++;
        } 
        graphInstance.drawValue(rhythm[index] * 2 + (Math.random() * 4));
    }
    index++;

    if (index > rhythm.length) {
        setTimeout(function () {
            index = 0;
        }, Math.random() * 800 + 100);
    }
}, graphInstance.getTimeInterval());

function MuteSound(event) {
    var osc = context.createOscillator(); // instantiate an oscillator
    osc.frequency.value = 0; // Hz
}

function changeRhythm(event) {
    switch (event.target.value) {
        case 'NSR':
            rhythm = nsr;
            break;
        case 'vTach':
            rhythm = vTach;
            break;
        case 'vFib':
            rhythm = vFib;
            break;
        case 'asystole':
            rhythm = asystole;
            break;
    }
}

var rhythmChangeButtons = document.getElementsByClassName('rhythmChange');
for (var i = 0; i < rhythmChangeButtons.length; i++) {
    rhythmChangeButtons[i].addEventListener('click', changeRhythm);
}