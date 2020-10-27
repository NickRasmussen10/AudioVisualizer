class Vertex{
    constructor(parent){
        if(parent){
            this.parent = parent;
            parent.AddChild(this);
        }
        this.children = [];
        this.keyframes = [];
    }
    
    drawVertex(ctx){
        ctx.save();
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        for(let i = 0; i < this.children.length; i++){
            this.children[i].drawVertex(ctx);
            ctx.beginPath();
            ctx.moveTo(this.x,this.y);
            ctx.lineTo(this.children[i].x,this.children[i].y);
            ctx.stroke();
            ctx.closePath();
        }
        ctx.beginPath();
        ctx.arc(this.x,this.y,5,0,Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    
    AddChild(vertex){
        this.children.push(vertex);
    }
    
    AddKeyframe(frameData,vertexIndex=0){
        let frame = {
            x: frameData[vertexIndex*2],
            y: frameData[vertexIndex*2+1]
        };
        vertexIndex++;
        this.keyframes.push(frame);
        for(let i = 0; i < this.children.length; i++){
            vertexIndex = this.children[i].AddKeyframe(frameData,vertexIndex);
        }
        
        return vertexIndex;
    }
    
    
    setActiveKeyframe(value){
        
        let x0,x1,x2; //0 is lower frame, 1 is real position, 2 is higher frame
        let y0,y1,y2;
        
        if(this.children.length > 0){
            for(let i=0;i<this.children.length;i++){
                this.children[i].setActiveKeyframe(value);
            }
        }
        
        if(value < 128){
            x0=this.keyframes[0].x;
            y0=this.keyframes[0].y;
            
            x2=this.keyframes[1].x;
            y2=this.keyframes[1].y;
            
            x1 = this.LinearInterpolation(x0,x2,this.normalize(value,0,128));
            y1 = this.LinearInterpolation(y0,y2,this.normalize(value,0,128));
        }
        else{
            x0=this.keyframes[1].x;
            y0=this.keyframes[1].y;
            
            x2=this.keyframes[2].x;
            y2=this.keyframes[2].y;
            
            x1 = this.LinearInterpolation(x0,x2,this.normalize(value,128,255));
            y1 = this.LinearInterpolation(y0,y2,this.normalize(value,128,255));
        }
        
        this.x = x1;
        this.y = y1;
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
    
    moveTo(newX,newY){
        let dX = newX - this.x;
        let dY = newY - this.y;
        this.x = newX;
        this.y = newY;
        for(let i=0;i<this.children.length;i++){
            this.children[i].translate(dX,dY);
        }
    }
    
    translate(dX,dY){
        this.x += dX;
        this.y += dY;
        for(let i=0; i < this.children.length;i++){
            this.children[i].translate(dX,dY);
        }
    }
    
    TestProximity(x,y){
        let dist = Math.abs(this.x-x) + Math.abs(this.y-y);
        let rVal = null;
        
        if(this.children.length > 0){
            for(let i = 0; i < this.children.length; i++){
                if(!rVal) rVal = this.children[i].TestProximity(x,y);
            }
        }
        if(dist < 10 && !rVal) rVal = this;
        return rVal;
    }
    
    getKeyframeFromPosition(){
        let rVal = [];
        rVal.push(this.x);
        rVal.push(this.y);
        for(let i = 0; i < this.children.length; i++){
            rVal = rVal.concat(this.children[i].getKeyframeFromPosition());
        }
        return rVal;
    }
}

class AnimBody{
    constructor(xPos, yPos){
        this.root = new Vertex();
        this.pelvis = new Vertex(this.root);
        this.shoulders = new Vertex(this.pelvis);
        
        this.leftElbow = new Vertex(this.shoulders);
        this.leftHand = new Vertex(this.leftElbow);
        this.rightElbow = new Vertex(this.shoulders);
        this.rightHand = new Vertex(this.rightElbow);
        
        this.head = new Vertex(this.shoulders);
        
        this.leftKnee = new Vertex(this.pelvis);
        this.leftFoot = new Vertex(this.leftKnee);
        this.rightKnee = new Vertex(this.pelvis);
        this.rightFoot = new Vertex(this.rightKnee);
        
        this.activeVertex = null;
        
        this.position = {
            x: xPos,
            y: yPos 
        };
        
        //get low keyframe from HTML (because JS is a constant, losing battle), parse into int array
        let kf = document.getElementById("keyframeLow").innerHTML.split(',');
        for(let i=0; i < kf.length;i++){
            kf[i] = parseInt(kf[i]);
        }
        this.root.AddKeyframe(kf);
        
        //get medium keyframe
        kf = document.getElementById("keyframeMed").innerHTML.split(',');
        for(let i=0; i < kf.length;i++){
            kf[i] = parseInt(kf[i]);
        }
        this.root.AddKeyframe(kf);
        
        //get high keyframe
        kf = document.getElementById("keyframeHigh").innerHTML.split(',');
        for(let i=0; i < kf.length;i++){
            kf[i] = parseInt(kf[i]);
        }
        this.root.AddKeyframe(kf);
        
        this.root.setActiveKeyframe(0);
    }
    
    setActiveVertex(x,y){
        this.activeVertex = this.pelvis.TestProximity(x,y);
    }
    
    setActiveKeyframe(value){
        this.root.setActiveKeyframe(value);
    }
    
    draw(ctx){
        ctx.save();
        ctx.translate(this.position.x,this.position.y);
        this.pelvis.drawVertex(ctx);
        ctx.restore();
    }
}

export {AnimBody};