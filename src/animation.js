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
        this.AddKeyframe(x,y);
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
    
    
    //interpolates 1 dimension at a time
    //x is "time", y is position
    //assumes time is between x0=0 and x3=1
    //returns y2 between y1 and y3 at x3 time
    LinearInterpolation(y1,y3,x2){
        return (x2 * (y3-y1)) + y1;
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
        
        this.leftElbow.AddKeyframe(this.leftElbow.x,this.leftElbow.y+20);
        this.leftHand.AddKeyframe(this.leftHand.x,this.leftHand.y+40);
    }
    
    draw(ctx){
        this.drawVertex(this.root,ctx);
    }
    
    drawVertex(v,ctx){
        
        //disgusting temp animation test stuff
        if(v.keyframes.length > 1){
            let d = new Date();
            v.Interpolate(Math.sin(d.getTime()*0.001));
        }
        
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