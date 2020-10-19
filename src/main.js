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

const controllerObject={
    volume : 30,
    track : "media/SSS.mp3",
    play: false,
    Play(){
         //PlayPause(this.play);
    },
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
    Gradient(){
        
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
    
    const gui=new dat.GUI({width:400});
    gui.close();
    
    //gui.add(controllerObject,'Play').name('Play');
    gui.add(controllerObject,'Volume',0,100).name('Volume');
    gui.add(controllerObject,'TrackSelect',{SpookyScarySkeletons:"media/SSS.mp3",GhostBusters:"media/GB.mp3",MonsterMash:"media/MM.mp3"}).name('Track');
    //gui.add(controllerObject,'Gradient').name('Gradient');
	setupUI(canvasElement);
    
    canvas.setupCanvas(canvasElement,audio.analyserNode);
    a = new animation.AnimBody(canvasElement.width/2,canvasElement.height/2);
    loop();
}

function loop(){
	requestAnimationFrame(loop);
    canvas.draw(drawParams,a);
}

function setupUI(canvasElement){
    
        let playButton = document.querySelector("#playButton");
    
    playButton.onclick = e =>{
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);
        
        if(audio.audioCtx.state == "suspended"){
            audio.audioCtx.resume();
        }
        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
        
        if(e.target.dataset.playing == "no"){
            audio.playCurrentSound();
            e.target.dataset.playing="yes";
        }
        else{
            audio.pauseCurrentSound();
            e.target.dataset.playing="no";
        }
    }
    
    document.querySelector("#gradientCB").onchange = function(e){drawParams.showGradient = e.target.checked;}
    //document.querySelector("#noiseCB").onchange = function(e){drawParams.showNoise = e.target.checked;}
    //document.querySelector("#invertCB").onchange = function(e){drawParams.showInvert = e.target.checked;}
    //document.querySelector("#embossCB").onchange = function(e){drawParams.showEmboss = e.target.checked;}
    
} // end setupUI

function PlayPause(value=false){
        // check if context is in suspended state (autoplay policy)
        if(audio.audioCtx.state == "suspended"){
            audio.audioCtx.resume();
        }
        if(value == "false"){
            // if track is currently paused, play it
            audio.playCurrentSound();
            value = "true"; // CSS will set the text to "Pause"
        } else {
            // if track is playing, pause it
            audio.pauseCurrentSound();
            value = "false"; // CSS will set the text to "Play"
        }
    }

export {init};