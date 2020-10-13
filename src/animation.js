class Vertex{
    constructor(x,y,parent){
        this.x = x;
        this.y = y;
        if(parent){
            this.parent = parent;
            //parent.AddChild(this);
        }
    }
    AddChild(vertex){
        this.children.add(vertex);
    }
}

class AnimBody{
    constructor(){
        this.root = new Vertex(100,100);
        this.v1 = new Vertex(100,50,this.root);
    }
    
    draw(ctx){
        ctx.save();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.root.x,this.root.y,10,0,Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(this.v1.x,this.v1.y,5,0,Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export {AnimBody};