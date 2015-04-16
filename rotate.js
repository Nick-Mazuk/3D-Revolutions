window.addEventListener("DOMContentLoaded", function(){onload();});
var canvas;
var ctx;
var rotations;
var slicesArr = [];
var edge = 7;//the size of the edges
var amountRotated = 0;
var graphTypeInput;

function onload() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	size();
	document.getElementById("rotate").addEventListener("click", function(){start();});
	document.getElementById("graph").addEventListener("click", function(){graph();});
	graphTypeInput = document.getElementById("typeOfGraph");
}

function start() {
	slicesArr = [];
	var graphType = graphTypeInput.value;
	if(graphType == "exponential") {
		for(i = 0; i <= 100; i++)
			addSlice(200 + i * 5, i/-5 + 300, Math.pow(2,i/16)*(i+300)/300);
	} else if(graphType == "sine") {
		for(i = 0; i <= 100; i++)
			addSlice(200 + i * 5, i/-5 + 300, Math.sin(i/16)*(i+300)/8);
	} else if(graphType == "absValue") {
		for(i = 0; i <= 100; i++)
			addSlice(200 + i * 5, i/-5 + 300, Math.abs(100 - 2*i)*(i+300)/300);
	} else if(graphType == "rational") {
		for(i = 0; i <= 100; i++)
			addSlice(200 + i * 5, i/-5 + 300, 20*rational(i/10+2.505)*(i+300)/300);
	} else if(graphType == "triangle") {
		for(i = 0; i <= 100; i++)
			addSlice(200 + i * 5, i/-5 + 300, Math.abs(50 - 2*(i%50))*(i+300)/300);
	}
	graph()
	animate();
}

function graph() {
	ctx.clearRect(497,0,canvas.width,canvas.height);
	var graphType = graphTypeInput.value;
	if(graphType == "exponential") {
		for(i = 1; i <= 100; i++) {
			drawLine(500+(i-1) *3,300 - 3*Math.pow(2,(i-1)/16),500 + 3*i,300 - 3*Math.pow(2,i/16));
		}
	} else if(graphType == "sine") {
		for(i = 1; i <= 100; i++) {
			drawLine(500+(i-1) *3,300 - 80*Math.sin((i-1)/16),500 + 3*i,300 - 80*Math.sin(i/16));
		}
	} else if(graphType == "absValue") {
		for(i = 1; i <= 100; i++) {
			drawLine(500+(i-1) *3,300 - 1.5*Math.abs(100 - 2*(i-1)),500 + 3*i,300 - 1.5*Math.abs(100 - 2*i));
		}
	} else if(graphType == "rational") {
		for(i = 1; i <= 100; i++) {
			drawLine(500+(i-1) *3,300 - 40*rational((i-1)/10+2.505),500 + 3*i,300 - 40*rational(i/10+2.505));
		}
	} else if(graphType == "triangle") {
		for(i = 1; i <= 100; i++) {
			drawLine(500+(i-1) *3,300 - 1.5*Math.abs(50 - 2*((i-1)%50)),500 + 3*i,300 - 1.5*Math.abs(50 - 2*(i%50)));
		}
	} else {
		ctx.font="20px Helvetica";
		ctx.fillText("The function has not been developed yet.",275,200);
	}
	drawLine(500,300,800,300);
}

function drawLine(x,y,z,w) {
	ctx.beginPath();
	ctx.strokeStyle = "#000000";
	ctx.moveTo(x,y);
	ctx.lineTo(z,w);
	ctx.stroke();
}

function animate() {
	renderSlices(amountRotated);
	if(amountRotated > Math.PI*2) {
		requestId = undefined;
		amountRotated = 0;
	} else {
		if(amountRotated == 0) {
			ctx.clearRect(0,0,canvas.width,canvas.height);
			graph();
		}
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
	this.radius = Math.abs(radius);
	if(this.radius > 200)
		this.radius = false;
}

Slice.prototype.render = function (arclen) {
	//for the left half
	if(!isNaN(this.radius)) {
		var gradient=ctx.createLinearGradient(0,this.y - this.radius - edge,0,this.y + this.radius + edge);
		gradient.addColorStop("0.05", "#AAAAAA");
		gradient.addColorStop("0.2","#DDDDDD");
		gradient.addColorStop("0.4","#999999");
		gradient.addColorStop("0.6","#666666");
		gradient.addColorStop("0.7","#555555")
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
		gradient.addColorStop("0.1","#999999");
		gradient.addColorStop("0.5","#555555");
		gradient.addColorStop("0.85","#292929");
		gradient.addColorStop("0.92","#2D2D2D");
		gradient.addColorStop("0.98","#333333");
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

function rational(x) {
	return (x*x*x - 2*x)/(2*(x*x - 5));
}