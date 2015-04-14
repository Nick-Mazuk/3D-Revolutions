window.addEventListener("DOMContentLoaded", function(){onload();});
window.addEventListener("resize", function(){resize();});
var canvas;
var ctx;
var rotations;

function onload() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	rotations = document.getElementById("rotations");
	resize();
}

function resize() {
	rotations.style.width = document.body.clientWidth;
	width = rotations.style.width;
	console.log(document.body.clientWidth)
	console.log(width)
	rotations.style.height = 100 * width;
	console.log(100 * width);
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