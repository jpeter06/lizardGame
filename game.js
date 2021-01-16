var game={

 dimTxt:'',//'0x0<br>',
 dimX:40,
 dimY:40,
 landscape:false,
 cx:null,
 cy:null,
 min:null,
 fg:null,
 bgcolor:get_random_color(),
 maxLizards:30,
 redrawSize:210,
 lizardSize:170,
 points:0,
 contL:0,
 ended:true,
 action:0, // 0: init   1: moving
 touched:false,
 tailTouched:false,
 reset:true,
 posTailTouched:0,
 touchList:[],
 lastTouch:null,
 dir:1,
 pos:null,
 posTail:null,
 speed:0,
 baseSpeed:1.4,
 fullCircle:2*Math.PI,
 canvas:null,
 divC:null,
 counter:null,
 lizard:null,
 mobil:false,
 results:[],
 lastResult:null,
 lastResultPos:null,
 endF:null,
 resizeTimeoutId:0,
 
 setEndF:function(func){
	this.endF=func;
 },
 getResults:function(){
	return this.results;
 },
 getLastResultPos:function(){
	return this.lastResultPos;
 },
 getLastResultInfo:function(){
	return this.lastResult;
 },
 getPosition:function(){
	for(var i=0;i<this.results.length;i++){
		if(this.results[i].points<=this.points)
			return i+1;
	}
	return this.results.length+1;
 },
 saveResult:function(user){
	var hash=user.trim()+this.points;
	this.lastResult={name:user.trim(),points:this.points,hash:hash};
	this.lastResultPos=this.results.map(function(e) { return e.hash; }).indexOf(hash);
	if(this.lastResultPos!=-1)
		return;
	this.results.unshift(this.lastResult);
	this.results.sort(function(a, b) {
	  return b.points - a.points;
	});
	this.lastResultPos=this.results.indexOf(this.lastResult);
 },
 
 goEnd:function(){
	if(this.endF)
		this.endF();
 },
 
 createFG:function(){
 	if(this.mobil)
		this.createRectangleFG_canvas();
	else
		this.createCircleFG_canvas();
 },
 

 drawClip:function(ctx){
	ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
	if(!this.mobil){
		drawCircle(ctx,this.cx,this.cy,this.min*0.5-1,	'rgba(255, 255, 255, 0)','rgba(255, 255, 255, 0)');
		ctx.clip();
	}
 },
 
 genInitPosDir:function(){
	if(this.mobil){
		if(this.landscape){
			this.dir=Math.random()>0.5?0:180;
			this.pos={
			'x':20+(this.dimX-40)*Math.random(),
			'y':(this.dir==180?-this.lizardSize*0.5:this.lizardSize*0.5+this.dimY)};
		}else{
			this.dir=Math.random()>0.5?90:-90;
			this.pos={
			'x':(this.dir==90?-this.lizardSize*0.5:this.lizardSize*0.5+this.dimX),
			'y':20+(this.dimY-40)*Math.random()};
		}
	}else{
		this.pos={'x':this.cx,'y':this.cy};
		this.dir=360*Math.random();
	}
	this.posTail={'x':this.pos.x,'y':this.pos.y};
 },
 
 isOut:function(){
	if(this.mobil){
		if(this.landscape){
			return this.pos.y>this.dimY+this.lizardSize ||
			this.pos.y < -this.lizardSize;
		}else{
			return this.pos.x>this.dimX+this.lizardSize ||
			this.pos.x < -this.lizardSize;
		}	
	}else
		return Math.abs(this.pos.x-this.cx)>(this.min*0.5+this.lizardSize)*Math.abs(Math.sin(this.dir*Math.PI/180)) ||
			Math.abs(this.pos.y-this.cy)>(this.min*0.5+this.lizardSize)*Math.abs(Math.cos(this.dir*Math.PI/180));
 },
 
 genSpeed:function(){
	if(this.mobil)
		this.speed=this.baseSpeed+1.0*Math.random()+2.0*this.contL/this.maxLizards;
	else
		this.speed=this.baseSpeed+1.0*Math.random()+ 2.0*this.contL/this.maxLizards;
 },
 
 restart:function(){
	this.contL=0;
	this.reset=true;
	this.genInitPosDir();
	this.genSpeed();
	this.action=1; //comenzamos ya jugando.
	this.points=0;
	this.lizard=new Lizard(this.speed,this.lizardSize,get_random_color(),get_random_color());
	document.getElementById('divC').innerHTML=+//this.dimTxt+
	this.contL+'/'+this.maxLizards+'<br>'+this.points+' pts';
	this.ended=false;
 },
 
 init:function(){
	this.mobil=detectmob();
	this.canvas=document.getElementById("cv");
	this.divC=document.getElementById("divC");
	this.resize_canvas();
	//if(this.landscape)
	//	this.mobil=true;
	this.createFG();
	this.genInitPosDir();
	this.initCanvasEvents(this.canvas);
	this.counter=new Counter('fps');
	this.lizard=new Lizard(this.speed,this.lizardSize,'#ff0000','#ff0000');
	//this.render();
	this.initDB();
	window.addEventListener('resize', function(event){
	 window.clearTimeout(game.resizeTimeoutId);
     game.resizeTimeoutId = window.setTimeout('game.doResizeCode();', 200);
	});
	(function animloop(){
	  requestAnimFrame(animloop);
	  game.render();
	})();
 },
 
 doResizeCode:function(){
	console.log("resizing");
	this.resize_canvas();
	this.createFG();
	this.genInitPosDir();
	this.reset=true;
	var ctx=this.canvas.getContext("2d");
	this.drawBG(ctx,null,null);
	this.drawFG(ctx,null,null);
 },
 
 initDB:function(){
	if(store && store.get('scoresLizard')){
		this.results=store.get('scoresLizard');
	}
	 window.onbeforeunload = this.saveScores;
 },
 saveScores:function(){
	if(store && store.enabled){
		store.set('scoresLizard',game.results);
	}
	game.results=[];
 },
 
 createCircleFG_canvas:function (){
    this.fg= document.createElement('canvas');
    this.fg.width = this.dimX;
    this.fg.height = this.dimY;
    var ctx= this.fg.getContext('2d');
    var r=this.min*0.5;
    
	ctx.shadowColor='#000';
	ctx.shadowBlur=10;
    for(var i=0;i<1360;i++){
    	var d=4*i+Math.random()*360;
	    ctx.beginPath();
	    var rr=r+Math.random()*this.min*0.2;
	    var rc=8+Math.random()*25;
	    rr=(rr-rc+4)<r?r+rc-2+i%3:rr;
        ctx.fillStyle =i<1000?get_random_selcolor([4,5]):get_random_selcolor([4,5]);  
        ctx.arc(this.cx+rr*Math.cos(d*Math.PI/180),
        		this.cy+rr*Math.sin(d*Math.PI/180),
        		rc,0,2*Math.PI,true);
        ctx.fill();
    }
    
    r=this.min*0.25;
    for(var i=0;i<360;i++){
    	var d=4*i+Math.random()*360;
	    ctx.beginPath();
	    var rr=Math.random()*this.min*0.15;
        ctx.fillStyle =get_random_green();
        var rc=8+Math.random()*25;
	    rr=(rr+rc-4)>r?r-rc+4:rr;
        ctx.arc(this.cx+rr*Math.cos(d*Math.PI/180),
        		this.cy+rr*Math.sin(d*Math.PI/180),
        		rc,0,2*Math.PI,true);
        ctx.fill();
    } 
 },
 
 
 createRectangleFG_canvas:function (){
    this.fg= document.createElement('canvas');
    this.fg.width = this.dimX;
    this.fg.height = this.dimY;
    var ctx= this.fg.getContext('2d');
	ctx.shadowColor='#000';
	ctx.shadowBlur=10;
    for(var i=0;i<100;i++){
    	var x=Math.random()*this.dimX;
	    ctx.beginPath();
        ctx.fillStyle =get_random_green();
        ctx.arc(x,0,8+Math.random()*25,0,2*Math.PI,true);
    	var x=Math.random()*this.dimX;
        ctx.arc(x,this.dimY,8+Math.random()*25,0,2*Math.PI,true);
        ctx.fill();
    }
 },
 
 drawBG:function (ctx,redrawPointB,redrawPointT){
	ctx.save();
	ctx.fillStyle = this.ended?this.initialBGGradient(ctx):this.bgcolor;
    if(this.reset){
       ctx.fillRect( 0, 0,this.dimX,this.dimY);
    }else{
		this.drawBGrect(ctx,redrawPointB,this.redrawSize);
	    if(this.tailTouched){
	    	this.drawBGrect(ctx,redrawPointT,this.redrawSize);
	     }
    }
    //ctx.fill(); 
    ctx.restore();
 },

 drawBGrect:function (ctx,pos,max){
	    ctx.fillRect(pos.x, pos.y, max, max);
 },
 
 drawFG:function (ctx,redrawPointB,redrawPointT){
	ctx.save();
    if(this.reset){
        ctx.drawImage(this.fg, 0, 0,this.dimX,this.dimY,0,0,this.dimX,this.dimY);
    }else{
		this.drawFGrect(ctx,redrawPointB,this.redrawSize);
	    if(this.tailTouched){	    	
	    	this.drawFGrect(ctx,redrawPointT,this.redrawSize);
	     }
    }
    ctx.restore();
 },

 drawFGrect:function (ctx,pos,max){
	    ctx.drawImage(this.fg, pos.x, pos.y, max, max,
	                      pos.x, pos.y, max, max);
 },
 
 
 resize_canvas:function (){
    this.canvas = document.getElementById("cv");
    this.min=Math.min(window.innerHeight, window.innerWidth);
    this.canvas.width=window.innerWidth;
    this.canvas.height=window.innerHeight;
    this.dimX=window.innerWidth;
    this.dimY=window.innerHeight;
	this.landscape=this.dimX>=this.dimY;
    this.cx=this.dimX*0.5;
    this.cy=this.dimY*0.5;
    this.dimTxt='';//this.dimX+'x'+this.dimY+'<br>';
 },
 
 
 increasePos:function(){
	var desp=this.speed*this.lizard.longBody2*0.08;
	if(this.mobil){
		if(this.landscape){
			this.pos.y+=this.dir==0?-desp:desp;
		}else{
			this.pos.x+=desp*(this.dir/Math.abs(this.dir));
		}
	}else{
		this.pos.x+=desp*Math.sin(this.dir*Math.PI/180);
		this.pos.y+=-desp*Math.cos(this.dir*Math.PI/180);
	}
	if(!this.tailTouched){
		this.posTail.x=this.pos.x;
		this.posTail.y=this.pos.y;
	}
 },
 
 calRedrawPoint:function(pto){
		var x=Math.max(pto.x-this.redrawSize*0.5,0);
	    var y=Math.max(pto.y-this.redrawSize*0.5,0);
	    x=Math.min(x,this.dimX-this.redrawSize);
	    y=Math.min(y,this.dimY-this.redrawSize);
		return {'x':Math.floor(x),'y':Math.floor(y)};
 },
 
 initialBGGradient:function(ctx){
	var cx=this.dimX/2;
	var cy=this.dimY/2;
	var grd=ctx.createRadialGradient(cx,cy,0,cx,cy,cx);
	grd.addColorStop(0,"#aad429");
	grd.addColorStop(1,"#2d9119");
	return grd;
 },
 render:function (){
 if(!document.getElementById('p_game').classList.contains('pt-page-current'))
	return;
	//requestAnimFrame(function() { this.render(); }.bind(this));
	var redrawPointB=this.calRedrawPoint(this.pos);
	var redrawPointT=this.calRedrawPoint(this.posTail);
	//drawLizard
	var ctx=this.canvas.getContext("2d");
	ctx.strokeStyle = "rgba(1, 1, 1, 0)";
	this.drawBG(ctx,redrawPointB,redrawPointT);

	this.clearTouchs(ctx);
	if(!this.ended){
		this.lizard.animLizard();
		
		ctx.save(); 
		this.drawClip(ctx);
		if(this.action==1){
			this.increasePos(); 
		};
		ctx.translate(this.pos.x,this.pos.y);
		ctx.rotate(this.dir*Math.PI/180);
		this.touched=this.lizard.touchAndDrawMain(ctx,false,this.lastTouch);
		ctx.restore();
		
		ctx.save();
		this.drawClip(ctx);
		ctx.translate(this.posTail.x,this.posTail.y);
		ctx.rotate(this.dir*Math.PI/180);
		var aux=this.lizard.touchAndDrawTail(ctx,false,this.lastTouch);
		ctx.restore();

		if(aux && !this.tailTouched){
			this.tailTouched=true;
		}
		
		if(this.touched || this.isOut()){
			this.points+=(this.touched?1:(this.tailTouched?0.5:0));
			this.contL++;
			this.touched=false;//reset on touch.
			this.tailTouched=false; //reset of all.
			if(this.contL==this.maxLizards){
				this.ended=true;
				this.goEnd();
			}
			this.bgcolor=get_random_color();
			this.reset=true;
			this.genInitPosDir();
			this.genSpeed();
			this.action=1;
			this.lizard=new Lizard(this.speed,this.lizardSize,get_random_color(),get_random_color());
			document.getElementById('divC').innerHTML=this.dimTxt+this.contL+'/'+this.maxLizards+'<br>'+this.points+' pts';
		}
		this.lastTouch=null;//reset.
	}else{
		
	}
	if(this.reset) //Borramos todo y volvemos a emplezar
		this.drawBG(ctx,redrawPointB,redrawPointT);
	this.drawFG(ctx,redrawPointB,redrawPointT);
	this.showTouchs(ctx);
	//update counter
	this.counter.update();
	this.reset=false;
 },
 
 stopGame:function(){
	 this.ended=true;
	 this.reset=true;
 },
 showTouchs:function (ctx){
	var len = this.touchList.length;
	while (len--) {
		var p=this.touchList[len];
		if(p.t==0)
			this.touchList.splice(len, 1);
		else{
			drawCircle(ctx,p.x,p.y,12-p.t/5,'rgba(0,0,0,'+(p.t/30)+')','#1a1a0a');
			p.t--;
		}
	}
 },
 
 clearTouchs:function (ctx){
	var len = this.touchList.length;
	var n=13;
	var nn=26;
	ctx.fillStyle = this.ended?this.initialBGGradient(ctx):this.bgcolor;
	while (len--) {
		var p=this.touchList[len];
		var x=p.x-n;
		var y=p.y-n;
		x=Math.max(x,0);
	    y=Math.max(y,0);
	    x=Math.min(x,this.dimX-nn);
	    y=Math.min(y,this.dimY-nn);

		ctx.fillRect(x, y, nn, nn);
		ctx.drawImage(this.fg, x, y, nn, nn,
	                     x, y, nn, nn );		
	}
 },
 
 initCanvasEvents:function (){
	if(this.canvas.addEventListener){
		var isTouchSupported = 'ontouchstart' in window;
		//var startEvent = isTouchSupported ? 'touchstart' : 'mousedown';
		var moveEvent = isTouchSupported ? 'touchmove' : 'mousemove';
		var endEvent = isTouchSupported ? 'touchend' : 'mouseup';
		if(isTouchSupported)
			document.addEventListener('touchstart',function(event) { this.doChange(event); }.bind(this),false);
		document.addEventListener('mousedown',function(event) { this.doChange(event); }.bind(this),false);
		//this.canvas.addEventListener("mousedown",doStop,false);
		document.addEventListener(moveEvent,function(event) { this.doTouch(event); }.bind(this),false);
		document.addEventListener('mousemove',function(event) { this.doTouch(event); }.bind(this),false);
		//this.canvas.addEventListener(endEvent,function(event) { this.doTouch(event); }.bind(this),false);
	}
 },
	
 doChange:function (event){
		//console.log(event.type);
		this.lastTouch=this.getMousePos(event); //para validar despues si tocado.
		if(!this.ended)
			this.touchList[this.touchList.length]=this.lastTouch;
		event.stopPropagation();
 },

 getMousePos:function  (evt) {
		var rect = this.canvas.getBoundingClientRect();
		return {
		  x:  (evt.targetTouches? evt.targetTouches[0].pageX :evt.clientX) - rect.left,
		  y: (evt.targetTouches? evt.targetTouches[0].pageY :evt.clientY) - rect.top,
		  t:30
		};
 },
 
 doTouch:function (event){
 	//this.lastTouch=this.getMousePos(event); //para validar despues si tocado.
	//	this.touchList[this.touchList.length]=this.lastTouch;
		event.preventDefault();
 }

}