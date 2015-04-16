window.addEventListener("DOMContentLoaded", function(){onload();});
var canvas;
var ctx;
var rotations;
var slicesArr = [];
var edge = 7;//the size of the edges
var amountRotated = 0;

function onload() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	size();
	document.getElementById("button").addEventListener("click", function(){start();});
}

function start() {
	slicesArr = [];
	var domain = 100;
	for(i = 0; i <= domain; i++)
		addSlice(200 + i * 5, i/-5 + 300, Math.abs(100 - i*2)*(i+300)/300);
	ctx.beginPath();
	ctx.strokeStyle = "black";
	ctx.moveTo(500, 200);
	for(i = 0; i <= domain; i++) {
		ctx.lineTo(500+i,300 - Math.abs(100 - 2*i));
		ctx.stroke();
		//console.log(500+i + " " + (300 - Math.abs(100 - 2*i)));
	}
	ctx.stroke();
	animate();
}

function animate() {
	renderSlices(amountRotated);
	if(amountRotated > Math.PI*2) {
		requestId = undefined;
		amountRotated = 0;
	} else {
		if(amountRotated == 0)
			ctx.clearRect(0,0,canvas.width,canvas.height);
		amountRotated += 0.05;
		requestAnimationFrame(animate);
	}
}

function size() {
	canvas.width = "900";
	canvas.height = "556";
}

function addSlice(x,y,radius) {
	var temp = new Slice(x,y,radius);
	slicesArr.push(temp);
}

function Slice(x,y,radius) {
	this.x = x;
	this.y = y;
	this.radius = radius;
}

Slice.prototype.render = function (arclen) {
	//for the left half
	var gradient=ctx.createLinearGradient(0,this.y - this.radius - edge,0,this.y + this.radius + edge);
	gradient.addColorStop("0.05", "#AAAAAA");
	gradient.addColorStop("0.15","#DDDDDD");
	gradient.addColorStop("0.3","#999999");
	gradient.addColorStop("0.9","#333333");
	ctx.lineWidth = edge;
	ctx.save();
	ctx.beginPath();
	ctx.rect(this.x - this.radius - edge, this.y - this.radius - edge, this.radius + edge, this.radius*2 + edge*2);
	ctx.clip();
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 3*Math.PI/2, 3*Math.PI/2 - arclen, true);
	ctx.strokeStyle = gradient;
	ctx.stroke();
	ctx.restore();

	//for the right half
	var gradient=ctx.createLinearGradient(0,this.y - this.radius - edge,0,this.y + this.radius + edge);
	gradient.addColorStop("0.05", "#AAAAAA");
	gradient.addColorStop("0.5","#555555");
	gradient.addColorStop("0.9","#333333");
	ctx.lineWidth = edge;
	ctx.save();
	ctx.beginPath();
	ctx.rect(this.x, this.y - this.radius - edge, this.radius + edge, this.radius*2 + edge*2);
	ctx.clip();
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 3*Math.PI/2, 3*Math.PI/2 - arclen, true);
	ctx.strokeStyle = gradient;
	ctx.stroke();
	ctx.restore();
}

function renderSlices(arclen) {
	ctx.save();
	ctx.scale(0.5, 1);
	for(i = 0; i < slicesArr.length;i++)
		slicesArr[i].render(arclen);
	ctx.restore();
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