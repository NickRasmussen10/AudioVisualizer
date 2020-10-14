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
	sound1  :  "media/New Adventure Theme.mp3"
});

let a;

function init(){
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    audio.setupWebaudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
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
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };
	
    // add .onclick event to button
    playButton.onclick = e => {
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);
        
        // check if context is in suspended state (autoplay policy)
        if(audio.audioCtx.state == "suspended"){
            audio.audioCtx.resume();
        }
        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
        if(e.target.dataset.playing == "no"){
            // if track is currently paused, play it
            audio.playCurrentSound();
            e.target.dataset.playing = "yes"; // CSS will set the text to "Pause"
        } else {
            // if track is playing, pause it
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no"; // CSS will set the text to "Play"
        }
    }
    
    // C - hookup volume slider & label
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");
    
    // add .oninput event to slider
    volumeSlider.oninput = e => {
        //set the gain
        audio.setVolume(e.target.value);
        //update value  of label to match value of slider
        volumeLabel.innerHTML = Math.round((e.target.value/2) * 100);
    };
    
    //set value of label to match initial value of slider
    volumeLabel.dispatchEvent(new Event("input"));
    
    // D - hookup track <select>
    let trackSelect = document.querySelector("#trackSelect");
    //add .onchange event to <select>
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        //pause the current track if it is playing
        if(playButton.dataset.playing == "yes"){
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    }
    
    document.querySelector("#gradientCB").onchange = function(e){drawParams.showGradient = e.target.checked;}
    document.querySelector("#barsCB").onchange = function(e){drawParams.showBars = e.target.checked;}
    document.querySelector("#circlesCB").onchange = function(e){drawParams.showCircles = e.target.checked;}
    document.querySelector("#noiseCB").onchange = function(e){drawParams.showNoise = e.target.checked;}
    document.querySelector("#invertCB").onchange = function(e){drawParams.showInvert = e.target.checked;}
    document.querySelector("#embossCB").onchange = function(e){drawParams.showEmboss = e.target.checked;}
    
} // end setupUI

export {init};