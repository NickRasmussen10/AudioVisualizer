/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx,ctx2,canvasWidth,canvasHeight,gradient,analyserNode,audioData;


function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = 1000;
	canvasHeight = window.innerHeight;
    console.log(canvasWidth);
    console.log(canvasHeight);
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0.25,color:"#e68e00"},{percent:1.0,color:"#000000"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);
}

function draw(params={}, animBody){
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// 2 - draw background
	ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
		
	// 3 - draw gradient
	if(params.showGradient){
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
    
    let data = (audioData[0])/(500);
    //console.log(data);
    animBody.setKeyframe(data);
    animBody.draw(ctx);
    
    ctx.save();
    ctx.fillStyle="#000000";
    ctx.fillRect(0,canvasHeight-20,canvasWidth, 10);
    ctx.restore();
    
    
    
    //BELOW IS ALL THE VISUALZER STUFF FROM HW 3, KEEPING IT JUST IN CASE WE NEED IT LATER
    
    
    
	// 4 - draw bars
//    if(params.showBars){
//        let barSpacing = 4;
//        let margin = 5;
//        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
//        let barWidth = screenWidthForBars / audioData.length;
//        let barHeight = 200;
//        let topSpacing = 100;
//        
//        ctx.save();
//        ctx.fillStyle = 'rgba(255,255,255,0.50)';
//        ctx.strokeStyle = 'rgba(0,0,0,0.50)';
//        //loop through the data and draw
//        for(let i=0; i<audioData.length; i++){
//            ctx.fillRect(margin + i * (barWidth + barSpacing),topSpacing + 256-audioData[i],barWidth,barHeight);
//            ctx.strokeRect(margin + i * (barWidth + barSpacing),topSpacing + 256-audioData[i],barWidth,barHeight);
//        }
//    }
//	
//	// 5 - draw circles
//    if(params.showCircles){
//        let maxRadius = canvasHeight/4;
//        ctx.save();
//        ctx.globalAlpha = 0.5;
//        for(let i = 0; i < audioData.length; i++){
//            //red-ish circles
//            let percent = audioData[i] / 255;
//            
//            let circleRadius = percent * maxRadius;
//            ctx.beginPath();
//            ctx.fillStyle = utils.makeColor(255,111,111,.34 - percent/3.0);
//            ctx.arc(canvasWidth/2,canvasHeight/2,circleRadius,0,2*Math.PI,false);
//            ctx.fill();
//            ctx.closePath();
//            
//            //blue-ish circles, bigger, more transparent
//            ctx.beginPath();
//            ctx.fillStyle = utils.makeColor(0,0,255,0.10 - percent/10.0);
//            ctx.arc(canvasWidth/2,canvasHeight/2,circleRadius * 1.5,0,2*Math.PI,false);
//            ctx.fill();
//            ctx.closePath();
//            
//            //yellow-ish circles, smaller
//            ctx.save();
//            ctx.beginPath();
//            ctx.fillStyle = utils.makeColor(200,200,0,0.5 - percent / 5.0);
//            ctx.arc(canvasWidth/2,canvasHeight/2,circleRadius*0.50,0,2*Math.PI,false);
//            ctx.fill();
//            ctx.closePath();
//            ctx.restore();
//        }
//        ctx.restore();
//    }
    
    // 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
//    let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
//    let data = imageData.data;
//    let length = data.length;
//    let width = imageData.width;
//	
//	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
//    for (let i = 0; i < length; i += 4){
//		// C) randomly change every 20th pixel to red
//	    if(params.showNoise && Math.random() < 0.05){
//			// data[i] is the red channel
//			// data[i+1] is the green channel
//			// data[i+2] is the blue channel
//			// data[i+3] is the alpha channel
//			//data[i] = data[i+1] = data[i+2] = 0; // zero out the red and green and blue channels
//			//data[i] = 255; // make the red channel 100% red
//            data[i] += (Math.random() * 255) - 127;
//            data[i+1] += (Math.random() * 255) - 127;
//            data[i+2] += (Math.random() * 255) - 127;
//		} // end if
//        
//        //invert effect
//        if(params.showInvert){
//            data[i] = 255 - data[i];
//            data[i+1] = 255 - data[i+1];
//            data[i+2] = 255 - data[i+2];
//        }
//	} // end for
//    
//    if(params.showEmboss){
//        for(let i = 0; i < length; i++){
//            if (i%4 == 3) continue; //skip alpha channel
//            data[i] = 127 + 2*data[i] - data[i+4] - data[i + width * 4];
//        }
//    }
//	
//	// D) copy image data back to canvas
//    ctx.putImageData(imageData,0,0);
		
}

function ChangeGradient(color1, color2){
    gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0.25,color:color1},{percent:1.0,color:color2}]);
}


function updateProgressBar(audioElement,flashing){
    ctx.clearRect(0,canvasHeight-20,canvasWidth, 10);
    ctx.fillStyle="#000000";
    ctx.fillRect(0,canvasHeight-20,canvasWidth, 10);
    
    let currentTime=audioElement.currentTime;
    let duration=audioElement.duration;
    
    let percentage=currentTime/duration;
    let progress=(canvasWidth*percentage);
  
    if(flashing){
        ctx.fillStyle=utils.getRandomColor();
    }
    else{
        ctx.fillStyle="#FFFFFF";
    }
    ctx.fillRect(0,canvasHeight-20,progress, 10);

}

export {setupCanvas,draw,ChangeGradient,updateProgressBar};