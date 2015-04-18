# 3D-Revolutions
[View the site](http://nick-mazuk.github.io/3D-Revolutions)

In an effort to help students visual a 2D graph rotating around an axis, I have created a site that visualizes this rotation.

##Features
Currently, you can graph several basic functions and view how they rotate around the x-axis:
- Exponential
- Flat Line (y = a)
- Sine
- Absolute Value
- Logarithmic
- Rational (just one example)
- Triangle Wave
- Hyperbola

Custom polynomials are going to come soon. This will allow for any shape imaginable to be rotated.

##Cool Programming Techniques
###Adaptive Animations
By adaptive animations, I mean that the animation will change depending on the frame rate of the device. The result will be that the speed of the animation will look exactly the same as the animation itself changes upon a slower frame rate. Here is how it works:

```javascript
var frameRate = 16; //1000 ms / 60fps
var continueAnimation = true;
var amountRotated = 0;

function animate() {
  var start = new Date(); // get the current time
  var nextIteration = frameRate + start.getTime(); //finds the time in the future which this should run again
  renderSlices(amountRotated); //renders the specific frame, input is the arc length
  if(/*animation should finish*/) {
    continueAnimation = false; //tells the animation to stop
  } else {
    amountRotated += frameRate / 340; //changes the rotation speed per frame based on the frameRate
  }
  var end = new Date();
  var wait = nextIteration - end.getTime(); //finds how many milliseconds until the next run
  if(wait <= 0) { //if the processing took too long
    frameRate++; //slows the frameRate for future animations
    animate(); //run right now because it should have already ran
  } else if(continueAnimation) {
    setTimeout(function() {animate();},wait);
  }
```

###Rendering the 3D Image
Like using the disc method for integration, this decides to use slices (the edges of the disks) and animates those. This simplifies the animation as each frame then only changes in the circles' arc length. Because of this, I created a simple circle object. *Note: Code presented in all these code segments may not match [the code implimented](https://github.com/Nick-Mazuk/3D-Revolutions/blob/gh-pages/rotate.js) exactly*
```javascript
function Slice(x,y,radius,fill) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.fill = fill; //sometimes, the slices need to be filled in for aesthetic purposes
}
```
Each slice has its own render function as to render each slice individually:
```javascript
Slice.prototype.render = function(arclen) { //arclen is the amount the arc is rotated
  var gradient = ctx.createLinearGradient(0,this.y - this.radius - edge,0,this.y + this.radius + edge); //creates the gradient
  //here various color stops are added
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 3*Math.PI/2, 3*Math.PI/2 - arclen, true); //draws the arc
  ctx.strokeStyle = gradient;
  ctx.stroke();
}
```
And a fuction loops through all the slices to render them:
```javascript
var slicesArr = [];
function renderSlices(arclen) {
  for(i = 0; i < slicesArr.length; i++)
    slicesArr[i].render(arclen);
}
```
This, however, will create a bunch of overlapping circles, not arcs, which will ruin the 3D effect. This is easily fixed by adding the following code:
```javascript
var slicesArr = [];
function renderSlices(arclen) {
  ctx.save();
  ctx.scale(0.5,1);
  for(i = 0; i < slicesArr.length; i++)
    slicesArr[i].render(arclen);
  ctx.restore();
}
```
Animations are covered here.
###Creating A "Circular" Gradient
