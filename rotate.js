window.addEventListener("DOMContentLoaded", function(){onload();});
window.addEventListener("resize", function(){resize();});
var canvas;
var ctx;
var rotations;

function onload() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	resize();
	ctx.save();
ctx.scale(0.75, 1);
ctx.beginPath();
ctx.arc(20, 21, 10, 0, Math.PI*2, false);
ctx.stroke();
ctx.closePath();
ctx.restore();
}

function resize() {
	var width = document.width;
	if (width === undefined) {
    // if document width fails, e.g., this page http://jblevins.org/projects/markdown-mode/
    // then find the biggest element available to grab width
    var widthElt = (document.getElementsByTagName('html')[0] ||
        document.getElementsByTagName('body')[0] ||
        document.querySelector('*'));

    // use widthElt’s width or worst-case fallback to the window
    width = widthElt ? widthElt.offsetWidth : window.innerWidth;
}
	canvas.style.width = width;
}

function Equation(op, num){
	this.ops = [op];
	this.nums = [num];
	this.valueOf = function(x){
		for(var i=0;i<this.ops.length;i++){
			x = execute(x,this.ops[i],this.nums[i]);
		}
		return x;
	}
	this.addOperator = function(operator,number){
		this.ops.push(operator);
		this.nums.push(number);
	}
}

function execute(x,operator,number){
	 if(operator == "+"){
		return x+number;
	}if(operator == "-"){
		return x-number;
	}if(operator == "*"){
		return x*number;
	}if(operator == "/"){
		return x/number;
	}if(operator == "^"){
		return Math.pow(x,number);
	}
}