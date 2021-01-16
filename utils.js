// JQuery Like
function addClass(id,strClass){
	var el=document.getElementById(id);
	el.classList.add(strClass);
}

function removeClass(id,strClass){
	var el=document.getElementById(id);
	el.classList.remove(strClass);
}

//Detect 
function detectmob() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 || navigator.userAgent.match(/iemobile/i)
 || navigator.userAgent.match(/WPDesktop/i)
 ){
    return true;
  }
 else {
    return false;
  }
}

// requestAnim
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function( callback, element){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

/////////////////////// CANVAS ///////////////
function drawCircle(ctx,centerX, centerY,radius,color,bg){
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 0;
      ctx.strokeStyle = bg;
     // ctx.stroke();
}


//////////// COLORS /////////////////////
function get_random_green() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
    	if(i==2 || i==3)
        	color += letters[Math.round(Math.random() * 11)+4];
        else {
        	color += letters[Math.round(Math.random() * 4)];
        }
    }
    return color;
}


function get_random_selcolor(list) {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
    	if(list.indexOf(i)>-1)
        	color += letters[Math.round(Math.random() * 11)+4];
        else {
        	color += letters[Math.round(Math.random() * 4)];
        }
    }
    return color;
}



function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}


//////// Frames per second Counter
function Counter(id){
	var c = this;
	this.valor = 0;
	this.now;
	this.lastUpdate = (new Date)*1 - 1;
	this.fpsFilter = 50;
	this.fpsOut = document.getElementById(id);
	
	
	this.redraw=function(){
		var aux=this.valor.toFixed(1);
		this.fpsOut.innerHTML = aux+'&nbsp;fps';
	}
	
	this.update=function(){
	    var thisFrameFPS = 1000 / ((this.now=new Date) - this.lastUpdate);
		this.valor += (thisFrameFPS - this.valor) / this.fpsFilter;
		this.lastUpdate = this.now * 1 - 1;
	}
	
	var t = this;
	setInterval(function(){t.redraw();}, 1000);
}

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
 
    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };
 
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
 
    return fBound;
  };
}