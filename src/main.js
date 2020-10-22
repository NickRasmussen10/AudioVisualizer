/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';
import * as animation from './animation.js';

let playing=true;
const controllerObject={
    volume : 30,
    track : "media/SSS.mp3",
    gradient: true,
    set Volume(value){
        this.volume=value;
        audio.setVolume(value/10);
        //volumeLabel.innerHTML = Math.round((e.target.value/2) * 100);
    },
    get Volume(){
        return this.volume;
    },
    set TrackSelect(value){
        this.track=value;
        audio.loadSoundFile(value);
        //pause the current track if it is playing
        if(playButton.dataset.playing == "yes"){
            playButton.dispatchEvent(new MouseEvent("click"));
        }
        
    },
    get TrackSelect(){
      return this.track;  
    },
    set Gradient(value){
        this.gradient=value;
        drawParams.showGradient = value;
    },
    get Gradient(){
        return this.gradient;
    },
    Play(){
        playing=!playing
        PlayAudio(playing);
    }
}

const drawParams = {
    showGradient: true,
    showBars: true,
    showCircles: true,
    showNoise: true,
    showInvert: false,
    showEmboss: false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/SSS.mp3"
});

let a;

function init(){
	console.log("init called");
    audio.setupWebaudio(DEFAULTS.sound1);
    
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    
    const gui=new dat.GUI({autoPlace:false,width:400});
    let customContain=document.querySelector("#gui-container");
    customContain.appendChild(gui.domElement);
    gui.close();
    
    gui.add(controllerObject,'Play').name("Play/Pause");
    gui.add(controllerObject,'Volume',0,100).name('Volume');
    gui.add(controllerObject,'TrackSelect',{SpookyScarySkeletons:"media/SSS.mp3",GhostBusters:"media/GB.mp3",MonsterMash:"media/MM.mp3"}).name('Track');
    gui.add(controllerObject,'Gradient').name('Gradient');
    
    canvas.setupCanvas(canvasElement,audio.analyserNode);
    a = new animation.AnimBody(canvasElement.width/2,canvasElement.height/2);
    loop();
}

function loop(){
	requestAnimationFrame(loop);
    canvas.draw(drawParams,a);
}


function PlayAudio(playing){
    if(audio.audioCtx.state == "suspended"){
        audio.audioCtx.resume();
    }
    if(playing==false)audio.playCurrentSound();
    if(playing)audio.pauseCurrentSound();
}



export {init};