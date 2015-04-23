window.addEventListener("DOMContentLoaded", function(){onload();});
var canvas;
var ctx;
var rotations;
var slicesArr = [];
var edge = 7;//the size of the edges
var amountRotated = 0;
var graphTypeInput;
var fill = false;
var frameRate = 16; //1000 ms / 60 frames = 16.777
var continueAnimation = false; //whether the animation should continue
var polyInputBox;

function onload() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	size();
	document.getElementById("rotate").addEventListener("click", function(){if(!continueAnimation){start(true);}});
	document.getElementById("typeOfGraph").addEventListener("change", function(){graph(true);input();});
	document.getElementById("reset").addEventListener("click", function(){graph(true);input();});
	graphTypeInput = document.getElementById("typeOfGraph");
	polyInputBox = document.getElementById("polyInput");
	graph(true);
}

function start(complete) {
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
			addSlice(200 + i * 5, i/-5 + 300, 20*rational(i/10+2.505)*(i+300)/300, i < 2);
	} else if(graphType == "triangle") {
		for(i = 0; i <= 100; i++)
			addSlice(200 + i * 5, i/-5 + 300, Math.abs(50 - 2*(i%50))*(i+300)/300);
	} else if(graphType == "hyperbola") {
		for(i = 0; i <= 100; i++)
			addSlice(200 + i * 5, i/-5 + 300, 100*hyperbola(i/200 + 1)*(i+300)/300);
	} else if(graphType == "log") {
		for(i = 0; i <= 100; i++)
			addSlice(200 + i * 5, i/-5 + 300, 50*Math.log((i + 0.01)/20)*(i+300)/300, i < 20);
	} else if(graphType == "cylinder") {
		for(i = 0; i <= 100; i++)
			addSlice(200 + i * 5, i/-5 + 300, 100*(i+300)/300);
	} else if(graphType == "polynomial") {
		var equation = polyInputBox.value;
		for(w = 0; w <= 100; w++)
			addSlice(200 + w * 5, w/-5 + 300, parsePolynomial(equation,(w)/15)*(w+300)/300, true);
	}
	if(complete) {
		continueAnimation = true;
		animate();
		graph(false);
	}
}

function graph(complete) {
	ctx.clearRect(0,0,canvas.width,canvas.height);
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
	} else if(graphType == "hyperbola") {
		for(i = 1; i <= 100; i++) {
			drawLine(500+(i-1) *3,300 - 100*hyperbola((i - 1)/100 + 1),500 + 3*i,300 - 100*hyperbola(i/100 + 1));
			drawLine(500+(i-1) *3,300 + 100*hyperbola((i - 1)/100 + 1),500 + 3*i,300 + 100*hyperbola(i/100 + 1));
		}
	} else if(graphType == "log") {
		for(i = 1; i <= 100; i++) {
			drawLine(500+(i-1) *3,300 - 50*Math.log((i + 0.01)/20),500 + 3*i,300 - 50*Math.log((i + 1.01)/20));
		}
	} else if(graphType == "cylinder") {
		drawLine(500,200,800,200);
	} else if(graphType == "polynomial") {
		var equation = polyInputBox.value;
		for(w = 1; w <= 100; w++) {
			drawLine(500 + (w-1)*3, 300 - parsePolynomial(equation,(w-1)/12), 500 + w*3, 300 - parsePolynomial(equation,(w)/12));
		}
	} else {
		ctx.font="20px Helvetica";
		ctx.fillText("The function has not been developed yet.",275,200);
	}
	drawLine(500,300,800,300);
	if(complete)
		start(false);
	fill = false;
	renderSlices(0.1);
}

function drawLine(x,y,z,w) {
	ctx.beginPath();
	ctx.strokeStyle = "#000000";
	ctx.moveTo(x,y);
	ctx.lineTo(z,w);
	ctx.stroke();
}

function input() {
	if(graphTypeInput.value == "polynomial") {
		document.getElementById("polynomial").style.display = "block";
	} else {
		document.getElementById("polynomial").style.display = "none";
	}
}

function animate() {
	var start = new Date();
	var nextIteration = frameRate + start.getTime();
	fill = true;
	renderSlices(amountRotated);
	if(amountRotated > Math.PI*2) {
		continueAnimation = false;
		amountRotated = 0;
	} else {
		if(amountRotated == 0) {
			ctx.clearRect(0,0,canvas.width,canvas.height);
		}
		amountRotated += frameRate/340;
	}
	var end = new Date();
	var wait = nextIteration - end.getTime();
	if(wait <= 0) {
		frameRate++;
		animate();
	} else if(continueAnimation) {
		setTimeout(function() {animate();},wait);
	}
}

function size() {
	canvas.width = "900";
	canvas.height = "556";
}

function addSlice(x,y,radius,fill) {
	var temp = new Slice(x,y,radius,fill);
	slicesArr.push(temp);
}

function Slice(x,y,radius,fill) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	if(this.radius < 0 && this.radius > -7)
		this.radius = false;
	if(this.radius > 200 || this.radius < -200)
		this.radius = false;
	this.fill = fill;
}

Slice.prototype.render = function (arclen) {
	//for the left half
	if(!isNaN(this.radius)) {
		var gradient=ctx.createLinearGradient(0,this.y - this.radius - edge,0,this.y + this.radius + edge);
		ctx.lineWidth = edge;
		if(this.radius > 0){
			ctx.save();
			ctx.beginPath();
			ctx.rect(this.x - this.radius - edge, this.y - this.radius - edge, this.radius + edge, this.radius*2 + edge*2);
			ctx.clip();
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 3*Math.PI/2, 3*Math.PI/2 - arclen, true);
			gradient.addColorStop("0.05", "#AAAAAA");
			gradient.addColorStop("0.2","#DDDDDD");
			gradient.addColorStop("0.4","#999999");
			gradient.addColorStop("0.6","#666666");
			gradient.addColorStop("0.7","#555555")
			gradient.addColorStop("0.9","#333333");
		} else {
			ctx.save();
			ctx.beginPath();
			ctx.rect(this.x + this.radius - edge, this.y + this.radius - edge, edge - this.radius, edge*2 - this.radius*2);
			ctx.clip();
			ctx.beginPath();
			ctx.arc(this.x, this.y, -this.radius, 5*Math.PI/2, 5*Math.PI/2 - arclen, true);
			gradient.addColorStop("0.95", "#AAAAAA");
			gradient.addColorStop("0.8","#DDDDDD");
			gradient.addColorStop("0.6","#999999");
			gradient.addColorStop("0.4","#666666");
			gradient.addColorStop("0.3","#555555")
			gradient.addColorStop("0.1","#333333");
		}
		ctx.strokeStyle = gradient;
		ctx.stroke();
		ctx.restore();

		ctx.lineWidth = 1;
		drawLine(this.x,this.y,this.x+1,this.y);
		ctx.lineWidth = edge;

		//for the right half
		var gradient=ctx.createLinearGradient(0,this.y - this.radius - edge,0,this.y + this.radius + edge);
		if(this.radius > 0){
			ctx.save();
			ctx.beginPath();
			ctx.rect(this.x, this.y - this.radius - edge, this.radius + edge, this.radius*2 + edge*2);
			ctx.clip();
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 3*Math.PI/2, 3*Math.PI/2 - arclen, true);
			gradient.addColorStop("0.05", "#AAAAAA");
			gradient.addColorStop("0.1","#999999");
			gradient.addColorStop("0.5","#555555");
			gradient.addColorStop("0.85","#292929");
			gradient.addColorStop("0.92","#2D2D2D");
			gradient.addColorStop("0.98","#333333");
		} else {
			ctx.save();
			ctx.beginPath();
			ctx.rect(this.x, this.y + this.radius - edge, edge - this.radius, edge*2 - this.radius*2);
			ctx.clip();
			ctx.beginPath();
			ctx.arc(this.x, this.y, -this.radius, 5*Math.PI/2, 5*Math.PI/2 - arclen, true);
			gradient.addColorStop("0.95", "#AAAAAA");
			gradient.addColorStop("0.9","#999999");
			gradient.addColorStop("0.5","#555555");
			gradient.addColorStop("0.15","#292929");
			gradient.addColorStop("0.08","#2D2D2D");
			gradient.addColorStop("0.02","#333333");
		}
		ctx.strokeStyle = gradient;
		ctx.stroke();
		ctx.restore();

		if(this.fill && fill) {
			if(this.radius > 0) {
				var gradient = ctx.createLinearGradient(0,this.y - this.radius - edge,0,this.y + this.radius + edge);
				gradient.addColorStop("0","#BBBBBB");
				gradient.addColorStop("1","#333333");
			} else {
				var gradient = ctx.createLinearGradient(0,this.y - this.radius - edge,0,this.y + this.radius + edge);
				gradient.addColorStop("1","#BBBBBB");
				gradient.addColorStop("0","#333333");
			}
			ctx.lineTo(this.x,this.y);
			ctx.closePath();
			ctx.fillStyle = gradient;
			ctx.fill();
		}
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

function hyperbola(x) {
	return Math.sqrt(x*x - 1);
}

function renderCircle () {
	ctx.save();
	ctx.scale(0.5, 1);
	ctx.beginPath();
	ctx.arc(200,300,100,0,2*Math.PI,true);
	ctx.stroke();
	ctx.restore();
}

function deleteChar(string, goal) {
	for(i = 0; i < string.length; i++) {
		if(string.substring(i, i+1) == goal) {
			string = string.substring(0,i) + string.substring(i + 1, string.length);
			i--;
		}
	}
	return string;
}

//Everything below is work by Bradley Gallon to both parse and calculate polynomials
//Function inputs | s: the string value of the function; x: the x value to input into the function
function parsePolynomial(s,x){
	// 2x^3-1x^2+4
	var equation = [];

	s=deleteChar(s," ");
	s=s.toLowerCase();
	s=s.replace(/[+]/g,"P+");
	s=s.replace(/[-]/g,"M-");
	//console.log(s);

	var a = s.split(/[PM]/g);  // a is the equation
	//console.log(a);
	var answer=0;
	for(var i=0;i<a.length;i++){
		var b = a[i];
		if(b=="")continue;// Glitch if y=-x or other coefficient of negative value
		if(b.indexOf("x")==-1){
			answer+=parseFloat(b);
		}else{
			if(b.indexOf("^")==-1){
				if(b.indexOf("+x")==0||b.indexOf("x")==0){
					answer+=x;
				}else if(b.indexOf("-x")==0){
					answer-=x;
				}else{
					answer+=parseFloat(b)*x;
				}
			}else{
				// console.log(b.substring(b.indexOf("^")));
				if(b.indexOf("+x")==0||b.indexOf("x")==0){
					answer+=Math.pow(x,parseFloat(b.substring(b.indexOf("^")+1)))
				}else if(b.indexOf("-x")==0){
					answer-=Math.pow(x,parseFloat(b.substring(b.indexOf("^")+1)));
				}else{
					answer+=parseFloat(b)*Math.pow(x,parseFloat(b.substring(b.indexOf("^")+1)));
				}
				// answer+=parseFloat(b)*m.pow(x,parseFloat(b.substring(b.indexOf("^")+1)));
			}
		}
	}

	return answer;
}
