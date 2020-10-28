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
let crowdSize = 5;
let a;
let canvasEle;
const controllerObject={
    volume : 1,
    track : "media/SSS.mp3",
    gradient: true,
    flash:false,
    dist:false,
    crowd: 5,
    bars:true,
    bass: false,
    treble: false,
    bassLvl:10,
    trebleLvl:10,
    distLvl:15,
    set Volume(value){
        this.volume=value;
        audio.setVolume(value);
    },
    get Volume(){
        return this.volume;
    },
    FullScreen(){
        ToggleFullscreen(canvasEle);
    },
    set Crowd(value){
        this.crowd=value;
        crowdSize = value;
        setCrowd();
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
    set Bars(value){
        this.bars=value;
        drawParams.showBars=value;
    },
    get Bars(){
        return this.bars
    },
    Play(){
        playing=!playing
        PlayAudio(playing);
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
        audio.toggleDistortion(value);
    },
    get Dist(){
        return this.dist;
    },
    set DistLvl(value){
        this.distLvl=value;
        audio.toggleDistortion(this.dist,value);
    },
    get DistLvl(){
        return this.distLvl;
    },
    set Bass(value){
        this.bass=value;
        audio.toggleBass(value);
    },
    get Bass(){
        return this.bass;
    },
    set Treble(value){
        this.treble=value;
        audio.toggleTreble(value);
    },
    get Treble(){
        return this.treble;
    },
    set BassLvl(value){
        this.bassLvl=value;
        audio.toggleBass(this.bass,value);
    },
    get BassLvl(){
        return this.bassLvl;
    },
    set TrebleLvl(value){
        this.trebleLvl=value;
        audio.toggleTreble(this.treble,value);
    },
    get TrebleLvl(){
        return this.trebleLvl;
    },
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
    o1:true,
    o2:false,
    o3:false
};
// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/SSS.mp3"
});

function init(){
	console.log("init called");
    audio.setupWebaudio(DEFAULTS.sound1);
    
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    canvasEle=canvasElement; //I know this is repetative and gross but dat gui hates logic so this is what we deal with
    
    const gui=new dat.GUI({autoPlace:false,width:400});
    let customContain=document.querySelector("#gui-container");
    customContain.appendChild(gui.domElement);
    gui.close();
    
    gui.add(controllerObject,'Play').name("Play/Pause");
    gui.add(controllerObject,'Volume',0,10).name('Volume');
    gui.add(controllerObject,'TrackSelect',
    {SpookyScarySkeletons:"media/SSS.mp3",GhostBusters:"media/GB.mp3",MonsterMash:"media/MM.mp3"}).name('Track');
    gui.add(controllerObject,'FullScreen').name('Fullscreen (hit play first)');
    
    let aef=gui.addFolder('Audio Effects');
    aef.add(controllerObject,'Dist').name('Distortion');
    aef.add(controllerObject,'DistLvl',0,30).name('Distortion Level');
    aef.add(controllerObject,'Bass').name('Bass');
    aef.add(controllerObject,'BassLvl',0,20).name('Bass Level');
    aef.add(controllerObject,'Treble').name('Treble');
    aef.add(controllerObject,'TrebleLvl',0,20).name('Treble Level');
    aef.add(controllerObject,'Crowd',1,10).name('Crowd Control');
    
    let g = gui.addFolder('Visual Effects');
    g.add(controllerObject,'Bars').name('Show Bars');
    g.add(controllerObject,'Flashing').name('Flashing Progress Bar');
    g.add(controllerObject,'Gradient').name('Show Gradient');
    let g1=g.addFolder('Gradients')
    g1.add(param,'o1').name("Halloween").listen().onChange(function(){SetCheck('o1'); canvas.ChangeGradient("#e68e00","#000000");});
    g1.add(param,'o2').name("Classic Witch").listen().onChange(function(){SetCheck('o2');  canvas.ChangeGradient("#9305e6","#0af722");});
    g1.add(param,'o3').name("Just Been Stabbed").listen().onChange(function(){SetCheck('o3'); canvas.ChangeGradient("#b00f00","#000000");});
    
    
    canvas.setupCanvas(canvasElement,audio.analyserNode);
    
    setCrowd();
    
//    document.onmousedown = function(e){
//        a.setActiveVertex(e.clientX - a.position.x, e.clientY - a.position.y);
//    }
//    document.onmouseup = function(){
//        a.activeVertex = null;
//    }
//    document.addEventListener('mousemove', function(e){
//            if(a.activeVertex != null){
//                a.activeVertex.moveTo(e.clientX - canvasElement.getBoundingClientRect().left - a.position.x,e.clientY - canvasElement.getBoundingClientRect().top - a.position.y);
//            }
//    });
    loop();
}

function setCrowd(){
    let canvasElement = document.querySelector("canvas");
    a = [];
    for(let i = 0; i < crowdSize; i++){
        a.push(new animation.AnimBody(canvasElement.width/crowdSize * i + canvasElement.width / (crowdSize*2),canvasElement.height/2,parseInt(128/crowdSize * i)));
    }
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
function ToggleFullscreen(canvasElement){
    utils.goFullscreen(canvasElement);
}
export {init};