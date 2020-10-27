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
let flash=false;
const controllerObject={
    volume : 30,
    track : "media/SSS.mp3",
    gradient: true,
    flash:false,
    dist:false,
    crowd: 10,
    set Volume(value){
        this.volume=value;
        audio.setVolume(value/10);
    },
    get Volume(){
        return this.volume;
    },
    set Crowd(value){
        this.crowd=value;
        //Put all the crowd slider code here
    },
    get Crowd(){
      return this.crowd;  
    },
    set TrackSelect(value){
        this.track=value;
        audio.loadSoundFile(value);
        playing=!playing;
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
    },
    G1(){
        canvas.ChangeGradient("#e68e00","#000000");
    },
    G2(){
        canvas.ChangeGradient("#9305e6","#0af722");
    },
    G3(){
        canvas.ChangeGradient("#b00f00","#000000");
    },
    set Flashing(value){
        this.flash=value;
        flash=value;
    },
    get Flashing(){
        return this.flash;
    },
    set Dist(value){
        this.dist=value;
        if(value)audio.enableDistortion();
        else if(value==false)audio.disableDistortion();
    },
    get Dist(){
        return this.dist;
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
const param={
    o1:false,
    o2:false,
    o3:false,
    o4:true
};
// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/SSS.mp3"
});

const crowdSize = 5;
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
    gui.add(controllerObject,'Gradient').name('Show Gradient');
    gui.add(controllerObject,'Flashing').name('Flashing Progress Bar');
    gui.add(controllerObject,'Dist').name('Distortion');
    gui.add(controllerObject,'Crowd',0,100).name('Crowd Control');
    let g = gui.addFolder('Gradients');
    g.add(controllerObject,'G1').name("Halloween");
    g.add(controllerObject,'G2').name("Classic Witch");
    g.add(controllerObject,'G3').name("Just Been Stabbed");
    /*let o=gui.addFolder('Delay Options');
    o.add(param, 'o1').name(".5").listen().onChange(function(){SetCheck('o1'); audio.changeDelay(.5);});
    o.add(param, 'o2').name("1").listen().onChange(function(){SetCheck('o2'); audio.changeDelay(1);});
    o.add(param, 'o3').name("3").listen().onChange(function(){SetCheck('o3'); audio.changeDelay(3);});
    o.add(param, 'o4').name("5").listen().onChange(function(){SetCheck('o4'); audio.changeDelay(5);});*/
    
    
    canvas.setupCanvas(canvasElement,audio.analyserNode);
    
    a = [];
    for(let i = 0; i < crowdSize; i++){
        a.push(new animation.AnimBody(canvasElement.width/crowdSize * i + 100,canvasElement.height/2));
    }
    
    document.onmousedown = function(e){
        a.setActiveVertex(e.clientX - a.position.x, e.clientY - a.position.y);
    }
    document.onmouseup = function(){
        a.activeVertex = null;
    }
    document.addEventListener('mousemove', function(e){
            if(a.activeVertex != null){
                a.activeVertex.moveTo(e.clientX - canvasElement.getBoundingClientRect().left - a.position.x,e.clientY - canvasElement.getBoundingClientRect().top - a.position.y);
            }
    });
    loop();
}

function loop(){
	requestAnimationFrame(loop);
    canvas.draw(drawParams,a);
    canvas.updateProgressBar(audio.element,flash);
}


function PlayAudio(playing){
    if(audio.audioCtx.state == "suspended"){
        audio.audioCtx.resume();
    }
    if(playing==false)audio.playCurrentSound();
    if(playing)audio.pauseCurrentSound();
}
function SetCheck(prop){
    for(let p in param){
        param[p]=false;
    }
    param[prop]=true;
}

export {init};