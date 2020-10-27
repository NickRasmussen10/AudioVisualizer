class Vertex{
    constructor(x,y,parent){
        this.x = x;
        this.y = y;
        if(parent){
            this.parent = parent;
            parent.AddChild(this);
        }
        this.children = [];
        this.keyframes = [];
    }
    AddChild(vertex){
        this.children.push(vertex);
    }
    
    AddKeyframe(xPos,yPos){
        let frame = {
            x: xPos,
            y: yPos
        };
//        if(this.keyframes.length-1 <= frameNumber) this.keyframes[frameNumber] = frame;
//        else this.keyframes.push(frame);
        this.keyframes.push(frame);
    }
    
    Interpolate(value=0){
        this.x = this.LinearInterpolation(this.keyframes[0].x,this.keyframes[1].x,value);
        this.y = this.LinearInterpolation(this.keyframes[0].y,this.keyframes[1].y,value);
    }
    
    
    setKeyframe(value){
        if(this.children.length > 0){
            for(let i=0;i<this.children.length;i++){
                this.children[i].setKeyframe(value);
            }
        }
        
        if(value < 0.5){
            this.x = this.LinearInterpolation(this.keyframes[0].x,this.keyframes[1].x,this.normalize(value,0.0,0.5));
            this.y = this.LinearInterpolation(this.keyframes[0].y,this.keyframes[1].y,this.normalize(value,0.0,0.5));
        }
        else{
            console.log(this.keyframes[2]);
            this.x = this.LinearInterpolation(this.keyframes[1].x,this.keyframes[2].x,this.normalize(value,0.5,1.0));
            this.y = this.LinearInterpolation(this.keyframes[1].y,this.keyframes[2].y,this.normalize(value,0.5,1.0));
        }
    }
    
    //interpolates y2 between two given points (1 and 3)
    //x dimension is "time", y is position
    //assumes time is between x1=0 and x3=1
    //returns y2 between y1 and y3 at x2 time
    LinearInterpolation(y1,y3,x2){
        return (x2 * (y3-y1)) + y1;
    }
    
    normalize(value, min, max){
        return (value-min)/(max-min);
    }
    
    logVertex(){
        let rVal = this.x + "," + this.y + ",";
        for(let i = 0; i < this.children.length; i++){
            rVal += this.children[i].logVertex();
        }
        return rVal;
    }
    
    TestProximity(x,y){
        let dist = Math.abs(this.x-x) + Math.abs(this.y-y);
        let rVal = null;
        
        if(this.children.length > 0){
            for(let i = 0; i < this.children.length; i++){
                if(!rVal) rVal = this.children[i].TestProximity(x,y);
            }
        }
        
        if(dist < 30 && !rVal) rVal = this;
        return rVal;
    }
}

class AnimBody{
    constructor(xPos, yPos){
        this.root = new Vertex(xPos,yPos);
        this.shoulders = new Vertex(xPos,yPos-70,this.root);
        
        this.leftElbow = new Vertex(this.shoulders.x - 40,this.shoulders.y,this.shoulders);
        this.leftHand = new Vertex(this.leftElbow.x - 30,this.leftElbow.y,this.leftElbow);
        this.rightElbow = new Vertex(this.shoulders.x + 40,this.shoulders.y,this.shoulders);
        this.rightHand = new Vertex(this.rightElbow.x + 30,this.rightElbow.y,this.rightElbow);
        
        this.head = new Vertex(this.shoulders.x,this.shoulders.y - 40,this.shoulders);
        
        this.leftKnee = new Vertex(this.root.x-30,this.root.y+30,this.root);
        this.leftFoot = new Vertex(this.leftKnee.x-20,this.leftKnee.y+30,this.leftKnee);
        this.rightKnee = new Vertex(this.root.x+30,this.root.y+30,this.root);
        this.rightFoot = new Vertex(this.rightKnee.x+20,this.rightKnee.y+30,this.rightKnee);
        
        
        this.activeVertex = null;
        
        this.setGrossLow();
        this.setGrossMed();
        this.setGrossHigh();
    }
    
    //set gross functions are just a proof of concept. Not the final way of inputing keyframes but I'm low on time for this prototype and javascript is really being a javascript right now
    setGrossLow(){
        this.root.AddKeyframe(498,351);
        this.shoulders.AddKeyframe(501,294);
        
        this.leftElbow.AddKeyframe(470,287);
        this.leftHand.AddKeyframe(443,315)
        this.rightElbow.AddKeyframe(541,287);
        this.rightHand.AddKeyframe(576,315);
        
        this.head.AddKeyframe(501,255);
        
        this.leftKnee.AddKeyframe(480,316);
        this.leftFoot.AddKeyframe(462,364);
        this.rightKnee.AddKeyframe(524,319);
        this.rightFoot.AddKeyframe(540,368);
    }
    setGrossMed(){
        this.root.AddKeyframe(498,288);
        this.shoulders.AddKeyframe(502,244);
        
        this.leftElbow.AddKeyframe(462,258);
        this.leftHand.AddKeyframe(440,279)
        this.rightElbow.AddKeyframe(541,241);
        this.rightHand.AddKeyframe(575,216);
        
        this.head.AddKeyframe(502,208);
        
        this.leftKnee.AddKeyframe(470,326);
        this.leftFoot.AddKeyframe(468,362);
        this.rightKnee.AddKeyframe(518,318);
        this.rightFoot.AddKeyframe(530,360);
    }
    setGrossHigh(){
        this.root.AddKeyframe(488,287);
        this.shoulders.AddKeyframe(502,244);
        
        this.leftElbow.AddKeyframe(471,212);
        this.leftHand.AddKeyframe(496,159)
        this.rightElbow.AddKeyframe(533,220);
        this.rightHand.AddKeyframe(516,153);
        
        this.head.AddKeyframe(497,210);
        
        this.leftKnee.AddKeyframe(452,323);
        this.leftFoot.AddKeyframe(448,367);
        this.rightKnee.AddKeyframe(502,327);
        this.rightFoot.AddKeyframe(530,360);
    }
    
    setActiveVertex(x,y){
        this.activeVertex = this.root.TestProximity(x,y);
    }
    
    //temp function because Javascript is a nightmare generator
    logKeyframe(){
        console.log(this.root.logVertex());
    }
    
    setKeyframe(value){
        this.root.setKeyframe(value);
    }
    
    draw(ctx){
        this.drawVertex(this.root,ctx);
    }
    
    drawVertex(v,ctx){
        ctx.save();
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        for(let i = 0; i < v.children.length; i++){
            this.drawVertex(v.children[i],ctx);
            ctx.beginPath();
            ctx.moveTo(v.x,v.y);
            ctx.lineTo(v.children[i].x,v.children[i].y);
            ctx.stroke();
            ctx.closePath();
        }
        ctx.beginPath();
        ctx.arc(v.x,v.y,5,0,Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

export {AnimBody};