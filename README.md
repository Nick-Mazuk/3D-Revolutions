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

###How it works
