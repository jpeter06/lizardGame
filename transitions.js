//PARTly BAsed IN http://tympanus.net/Development/PageTransitions/
var transitions={
 _prePage:null,
 _endCallF:null,

 _tts:{'t_left':['pt-page-moveToLeft','pt-page-moveFromRight'],
		  't_right':['pt-page-moveToRight','pt-page-moveFromLeft'],
		  't_top':['pt-page-moveToTop','pt-page-moveFromBottom'],
		  't_bottom':['pt-page-moveToBottom','pt-page-moveFromTop'],
		  't_rot90':['pt-page-rotTo90','pt-page-rotFromMinus90'],
		  't_cube_top':['pt-page-rotateCubeTopOut','pt-page-rotateCubeTopIn'],
		  't_cube_bottom':['pt-page-rotateCubeBottomOut','pt-page-rotateCubeBottomIn']},
 
gotoPage:function (idPage,typeTrans,endCallF){
	_prePage=document.getElementsByClassName('pt-page-current')[0];
	var pageDest=document.getElementById(idPage);
	this._transitionPages(_prePage,pageDest,typeTrans);
	this._endCallF=endCallF;
},

_transitionPages:function (pageOrig,pageDest,type){

	this.addClasses(pageOrig,this._tts[type][0],'pt-page-disapearing');
	this.addClasses(pageDest,this._tts[type][1],'pt-page-current','pt-page-ontop','pt-page-appearing');
},

addClasses:function (el){
  for (var i = 1; i < arguments.length; i++) {		
	el.classList.add(arguments[i]);  }
},
	
removeClasses:function (el){
  for (var i = 1; i < arguments.length; i++) {		
	el.classList.remove(arguments[i]);  }
},

containsClass:function (el,strClass){
	return el.classList.contains(strClass);
},
webkitEnd:function(e) {
	if(transitions._endCallF!=null)
		transitions._endCallF();
	
	var re=/pt-page-\D+/;
	var page=document.getElementsByClassName('pt-page-disapearing')[0];
	if(page){
		for(var i=page.classList.length-1;i>=0;i--){
			var clase=page.classList[i];
			if(re.test(clase))
				page.classList.remove(clase);
		}
	}
	var page=document.getElementsByClassName('pt-page-appearing')[0];
	if(page){
		for(var i=page.classList.length-1;i>=0;i--){
			var clase=page.classList[i];
			if(re.test(clase))
				page.classList.remove(clase);
		}
		transitions.addClasses(page,'pt-page-current','pt-page-ontop','pt-page-current');
	}
}

}

document.addEventListener('webkitAnimationEnd',transitions.webkitEnd , false);
document.addEventListener("animationend", transitions.webkitEnd,false);
document.addEventListener("oanimationend", transitions.webkitEnd,false);
document.addEventListener("MSAnimationEnd", transitions.webkitEnd,false);
