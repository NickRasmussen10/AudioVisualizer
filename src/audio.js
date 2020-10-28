// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element, sourceNode, analyserNode, gainNode, distortion, bassFilter, trebleFilter;

// 3 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    gain: .5,
    numSamples: 256
});

// 4 - create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data
let audioData = new Uint8Array(DEFAULTS.numSamples/2);

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
function setupWebaudio(filePath){
    // 1 - The || is because WebAudio has not been standardized across browsers yet
    const AudioContext = window.AudioContext || window.webKitAudioContext;
    audioCtx = new AudioContext();

    // 2 - this creates an <audio> element
    element = new Audio();

    // 3 - have it point at a sound file
    loadSoundFile(filePath);

    // 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

    // 5 - create an analyser node
    analyserNode = audioCtx.createAnalyser(); // note the UK spelling of "Analyser"

    /*
    // 6
    We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
    across the sound spectrum.

    If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
    the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
    the amplitude of that frequency.
    */ 

    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = DEFAULTS.numSamples;

    // 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    // 8 - connect the nodes - we now have an audio graph
    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    bassFilter=audioCtx.createBiquadFilter();
    bassFilter.type='lowshelf';
    sourceNode.connect(bassFilter);
    bassFilter.connect(analyserNode);
    
    trebleFilter=audioCtx.createBiquadFilter();
    trebleFilter.type='highshelf';
    sourceNode.connect(trebleFilter);
    trebleFilter.connect(analyserNode);
    
    distortion=audioCtx.createWaveShaper();
    distortion.type='distortion';
    sourceNode.connect(distortion);
    distortion.connect(analyserNode);

}

function loadSoundFile(filePath){
    element.src = filePath;
}

function playCurrentSound(){
    element.play();
}

function pauseCurrentSound(){
    element.pause();
}
function changeDistortionValue(value,distorted){
    if(distorted)distortion.curve=makeDistortion(value);
    else distortion.curve=null;
    //toggleDistortion();
}
function changeBassValue(value, bassOn){
    if(bassOn){
    bassFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    bassFilter.gain.setValueAtTime(value,audioCtx.currentTime);
    }
    else{bassFilter.gain.setValueAtTime(0,audioCtx.currentTime);}
    //toggleBass();
}
function changeTrebleValue(value, trebleOn){
    if(trebleOn){
    trebleFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    trebleFilter.gain.setValueAtTime(value,audioCtx.currentTime);
    }
    else{
        trebleFilter.gain.setValueAtTime(0,audioCtx.currentTime);
    }
    //toggleTreble();
}
function toggleBass(lowshelf,value=15){
    if(lowshelf){
        bassFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
        bassFilter.gain.setValueAtTime(value,audioCtx.currentTime);
    }
    else{
        bassFilter.gain.setValueAtTime(0,audioCtx.currentTime);
    }
}
function toggleTreble(highshelf, value=25){
    if(highshelf){
        trebleFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
        trebleFilter.gain.setValueAtTime(value,audioCtx.currentTime);
    }
    else{
        trebleFilter.gain.setValueAtTime(0,audioCtx.currentTime);
    }
}
function toggleDistortion(dis,value=20){
    if(dis){
        distortion.curve=null;
        distortion.curve=makeDistortion(value);
    }
    else{
        distortion.curve=null;
    }
}
function setVolume(value){
    value = Number(value); // make sure that it's a Number rather than a String
    gainNode.gain.value = value;
}
function convertElapsedTime(inputSeconds){
    let seconds=Math.floor(inputSeconds%60);
    if(seconds<10){
        seconds="0"+seconds;
    }
    let minutes=Math.floor(inputSeconds/60);
    return minutes + ":" + seconds;
}
function makeDistortion(value=20){
    let n_samples=256,
        curve=new Float32Array(n_samples),
        deg=Math.PI/180;
    
    for(let i=0;i<n_samples;i++){
        let x=i*2/n_samples-1;
        curve[i]=(Math.PI+value)*x/(Math.PI+value*Math.abs(x));
    }
    return curve;
}
export {audioCtx,setupWebaudio,playCurrentSound,pauseCurrentSound,loadSoundFile,setVolume,analyserNode,element,changeDistortionValue,toggleBass,toggleDistortion,toggleTreble,changeBassValue,changeTrebleValue};