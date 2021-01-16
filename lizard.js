
function Lizard(speed,size,bodyColor,tailColor){
	//Body dimensions
	this.bodyColor=bodyColor;
	this.totalSize=size;
	this.tailColor=tailColor;
	this.relBodyHead=0.7;
	this.relTailTotal=0.45+Math.random()*0.1;
	this.speed=speed;
	this.maxRot=15;//180/12; // 1=360 .. 2=180 0=0;
	this.inc=0;
	
	this.tail=new Verlet(4,this.totalSize*this.relTailTotal*0.3333,
						this.totalSize*(1-this.relTailTotal)*this.relBodyHead*0.5-8,
						this.maxRot);

	this.longBody=this.totalSize*(1-this.relTailTotal)*this.relBodyHead;
	this.longBody2=this.longBody*0.5;
	this.widthBody=this.longBody*0.4;

	this.longHead=this.totalSize*(1-this.relTailTotal)*(1-this.relBodyHead);
	this.longHead2=this.longHead*0.5;
	this.widthHead=this.longHead*0.65;
	this.longTail=this.totalSize*this.relTailTotal;
	

	this.setColor=function(color,tailC){
	//console.log(color);
		this.bodyColor=color;
		this.tailColor=tailC;
	}
	/**
		Will return true if touched.
	**/
	this.animLizard=function(){
		this.inc=this.getInc();
	}
	
	this.touchAndDrawMain=function(ctx,stop,pt){
		var tt=false;
		ctx.fillStyle = this.bodyColor;
		tt=tt | this.drawBody(ctx,this.inc,pt);
		tt=tt |this.drawHead(ctx,this.inc,pt);
		ctx.fill(); 
		tt=tt |this.drawFeet(this.longBody2,ctx,this.inc,pt);
		return tt;
	}
	
	this.touchAndDrawTail=function(ctx,stop,pt){
		this.tail.updateVerlet(this.inc);
		return this.drawTail(ctx,this.inc,pt);
	}
	
	this.setSpeed=function(speed){
		this.speed=speed;
	}
	
	this.getInc=function(){
		var date=new Date();
		var pi=Math.PI;
		var inc=Math.cos(pi*(date.getTime()*this.speed*0.5%360)/180);
		return inc;
	}
	
	this.drawTail=function(ctx,inc,pt){//drawVerlet(inc){
		var points=this.tail.points;
		//ctx.fillStyle = "#000088";
		var linear=ctx.createLinearGradient(0,points[0].y-inc*2,
											0,points[0].y-inc*2+10);
		linear.addColorStop(0,this.bodyColor);
		linear.addColorStop(1,this.tailColor);
		ctx.fillStyle=linear;
		

		ctx.beginPath();
		ctx.moveTo(points[0].x+6,points[0].y-inc*2);
		ctx.bezierCurveTo(points[1].x+4,points[1].y,
							 points[2].x+2,points[2].y,
						 points[3].x,points[3].y);
		ctx.bezierCurveTo( points[2].x-2,points[2].y,
						   points[1].x-4,points[1].y,
						 points[0].x-6,points[0].y+inc*2);
		ctx.fill();
		var result=pt!=null?ctx.isPointInPath(pt.x, pt.y):false;
		/*if(result && !tailTouched){
			tailTouched=true;
			posTailTouched=move;
		}*/
		return result;
	}

	
	this.drawFeet=function(longBody2,ctx,inc,pt){
		var dv=longBody2*0.6;
		var dl=longBody2*0.52;
		var desp=inc*longBody2*0.30;
		var radio=longBody2*0.2;
		var fullCircle=2*Math.PI;
		ctx.beginPath();
		ctx.arc(-dl, -dv+desp ,radio,0,fullCircle,true);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(dl, -dv-desp ,radio,0,fullCircle,true);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(-dl, dv-desp ,radio,0,fullCircle,true);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(dl, dv+desp ,radio,0,fullCircle,true);
		ctx.fill(); 
		return pt!=null?ctx.isPointInPath(pt.x, pt.y):false;
	}
	
	this.drawHead=function(ctx,inc,pt){
		ctx.save();
		ctx.rotate(-inc*Math.PI/this.maxRot);
		ctx.translate(0,-this.longBody2);
		ctx.rotate(inc*Math.PI/this.maxRot);
		this.drawEllipse(ctx,0,-this.longHead2,this.widthHead,this.longHead);
		ctx.restore();
		return pt!=null?ctx.isPointInPath(pt.x, pt.y):false;
	}
	
	
	this.drawBody=function(ctx,inc,pt){
		ctx.save();
		ctx.rotate(-inc*Math.PI/this.maxRot);
		this.drawEllipse(ctx,0,0,this.widthBody,this.longBody);
		ctx.restore(); 
		return pt!=null?ctx.isPointInPath(pt.x, pt.y):false;
	}

	this.drawEllipse=function(ctx,centerX, centerY, width, height) {
		  ctx.beginPath();
		  ctx.moveTo(centerX, centerY - height/2); // A1
		  ctx.bezierCurveTo(
			centerX + width/2, centerY - height/2, // C1
			centerX + width/2, centerY + height/2, // C2
			centerX, centerY + height/2); // A2
		  ctx.bezierCurveTo(
			centerX - width/2, centerY + height/2, // C3
			centerX - width/2, centerY - height/2, // C4
			centerX, centerY - height/2); // A1
	  ctx.fill();
	  ctx.closePath();
	}
}







function Verlet(numPoints,distPoints,distc,maxRot){
	this.numPoints=numPoints;
	this.gravity=false;
	this.points=new Array();
	this.sticks=new Array();
	this.contSticks=new Array();
	this.distPoints=distPoints;//this.totalSize*this.relTailTotal*0.3333;
	this.maxRot=maxRot;//180/12; // 1=360 .. 2=180 0=0;
	this.distc=distc;//this.totalSize*(1-this.relTailTotal)*this.relBodyHead*0.5-8;
	this.tailF=1;
	this.maintainFactor=1;
	
	for(var i=0;i<this.numPoints;i++){
		this.points[i]=new VP(0,i*this.distPoints*Math.pow(this.tailF,i)+this.distc);
		if(i>0)
			this.sticks[i-1]=new VS(this.points[i-1],this.points[i]);
		if(i>1)
			this.contSticks[i-2]=new VS(this.points[i-2],this.points[i]);
	} 

	this.setGravity=function(activate){
		this.gravity=activate;
	}
	
	this.updateVerlet=function(inc){
		var angx=Math.sin(inc*Math.PI/this.maxRot);
		var angy=Math.cos(inc*Math.PI/this.maxRot)
		this.points[0].x=angx*this.distc;
		this.points[0].y=angy*this.distc;
		this.points[1].x=angx*(this.distc+this.distPoints)*2;
		this.points[1].y=angy*(this.distc+this.distPoints);
		for(var j=1;j<this.points.length;j++)
			this.points[j].refresh();
		for(var i=0;i<this.sticks.length;i++){
			this.sticks[i].contract();
			if(i>0)
				this.contSticks[i-1].maintain();
		}
		this.points[0].x=angx*this.distc;
		this.points[0].y=angy*this.distc;
	}
}





function setLineStyle(ctx){
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0000ff";
    ctx.lineCap = "butt";
    ctx.stroke();
}


function VS(a,b){
    this.a=a;
    this.b=b;
    var dx=a.x-b.x;
    var dy=a.y-b.y;
    this.hyp=Math.sqrt(dx * dx + dy * dy);
    this.minHyp=this.hyp;//*maintainFactor;
    
    this.contract=function(){
            var dx = this.b.x - this.a.x;
            var dy = this.b.y - this.a.y;
            var h = Math.sqrt(dx * dx + dy * dy);
            var diff = this.hyp - h;
            var offx = (diff * dx / h) * .5;
            var offy = (diff * dy / h) * .5;
            this.a.x -= offx;
            this.a.y -= offy;
            this.b.x += offx;
            this.b.y += offy;
    }
        
    this.maintain=function(){
            var dx = this.b.x - this.a.x;
            var dy = this.b.y - this.a.y;
            var h = Math.sqrt(dx * dx + dy * dy);
            var diff = this.minHyp - h;
            if(diff>0){            
                var offx = (diff * dx / h) * .5;
                var offy = (diff * dy / h) * .5;
                this.a.x -= offx;
                this.a.y -= offy;
                this.b.x += offx;
                this.b.y += offy;
            }
    }
}


function VP(x,y) {
    this.x=x;
    this.y=y;
    this.ox=x;
    this.oy=y;

    this.setPos= function(x,y) {
        this.x = this.ox = x;
        this.y = this.oy= y;
    };
    
    this.refresh=function(){
        var tempx = this.x;
        var tempy = this.y;
        this.x += (this.x - this.ox)*0.9;
        this.y += (this.y - this.oy)*0.9;
        this.ox = tempx;
        this.oy = tempy;
    }
}
