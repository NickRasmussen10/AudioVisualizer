class Vertex{
    constructor(x,y,parent){
        this.x = x;
        this.y = y;
        if(parent){
            this.parent = parent;
            parent.AddChild(this);
        }
        this.children = [];
    }
    AddChild(vertex){
        this.children.push(vertex);
    }
}

class AnimBody{
    constructor(){
        this.root = new Vertex(100,100);
        this.v1 = new Vertex(100,50,this.root);
        this.v2 = new Vertex(50,100,this.v1);
        this.v3 = new Vertex(200,100,this.v1);
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
        ctx.arc(v.x,v.y,10,0,Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

export {AnimBody};