var worker = new Worker("webworker.js");
document.getElementById("amplitude").value=50;
document.getElementById("period").value=50;

//
//VORONOI
//

var points = [];
const vor_canvas = document.getElementById("voronoi_canvas");
const ctx = vor_canvas.getContext("2d");
var checkbox = document.getElementById("manhattan");
checkbox.checked=false;
var draw=0;

vor_canvas.addEventListener('click', (event) => {
  var rect = vor_canvas.getBoundingClientRect();
  var x_c = event.clientX - rect.left;
  var y_c = event.clientY - rect.top;
  points.push({x:x_c, y:y_c});

  //drawing
  for(var i = 0; i < points.length; i++) {
      ctx.beginPath();
      ctx.moveTo(points[i].x-2, points[i].y);
      ctx.lineTo(points[i].x+2, points[i].y);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y-2);
      ctx.lineTo(points[i].x, points[i].y+2);
      ctx.stroke();
      ctx.closePath();
  }
});

checkbox.addEventListener( 'change', function() { if(draw) drawVoronoi(); });

//clearing all the points and making the canvas white
function resetVoronoi(){
  while(points.length>0) points.pop();
  ctx.clearRect(0, 0, vor_canvas.width, vor_canvas.height);
  document.getElementById("manhattan").checked=false;
  draw=0;
  document.getElementById("draw_info").style.display = "none";
}

function drawVoronoi(){
  var imgData = ctx.getImageData(0,0, vor_canvas.width, vor_canvas.height);
  var i,j,k;
  var len=points.length;
  draw=1;
  var line=4*vor_canvas.width;

//manhattan distance
  if(checkbox.checked == true){
    for(i=0; i<imgData.data.length; i+=4){
      var x=(i%line)/4;
      var y=Math.floor(i/line);
      if(points.length>0) var dist=Math.abs(points[0].x-x)+Math.abs(points[0].y-y);
      var num=0;
      for(j=1; j<len; j++){
        if((Math.abs(points[j].x-x)+Math.abs(points[j].y-y))<dist){
          num=j;
          dist=Math.abs(points[j].x-x)+Math.abs(points[j].y-y);
        }
      }

      imgData.data[i] = (num%3)*124;
      imgData.data[i + 1] = 255/(num/2+1);
      imgData.data[i + 2] = 125+(num%2)*128;
      imgData.data[i + 3] = 255;
    }
    document.getElementById("draw_info").innerHTML="Diagram Woronoja dla "+points.length+" punktów, wg. wzoru na odległość manhattańską.";
    document.getElementById("draw_info").style.display = "block";
  }
//euclides distance
  else {
    for(i=0; i<imgData.data.length; i+=4){
      var x=(i%line)/4;
      var y=Math.floor(i/line);
      if(points.length>0) var dist=(points[0].x-x)*(points[0].x-x)+(points[0].y-y)*(points[0].y-y);
      var num=0;
      for(j=1; j<len; j++){
        if(((points[j].x-x)*(points[j].x-x)+(points[j].y-y)*(points[j].y-y))<dist){
          num=j;
          dist=(points[j].x-x)*(points[j].x-x)+(points[j].y-y)*(points[j].y-y);
        }
      }

      imgData.data[i] = (num%3)*124;
      imgData.data[i + 1] = 255/(num/2+1);
      imgData.data[i + 2] = 125+(num%2)*128;
      imgData.data[i + 3] = 255;
    }
    document.getElementById("draw_info").innerHTML="Diagram Woronoja dla "+points.length+" punktów, wg. wzoru na odległość euklidesową.";
    document.getElementById("draw_info").style.display = "block";
  }
  ctx.putImageData(imgData, 0, 0);

  //points
  for(k = 0; k < len; k++) {
      ctx.beginPath();
      ctx.moveTo(points[k].x-2, points[k].y);
      ctx.lineTo(points[k].x+2, points[k].y);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(points[k].x, points[k].y-2);
      ctx.lineTo(points[k].x, points[k].y+2);
      ctx.stroke();
      ctx.closePath();
  }
}

//
//WAVES
//

var period_slider = document.getElementById('period');
period_slider.addEventListener('input', function(){
  worker.postMessage({data:"p "+period_slider.value});
});
var amplitude_slider = document.getElementById('amplitude');
amplitude_slider.addEventListener('input', function(){
  worker.postMessage({data:"a "+amplitude_slider.value});
});


const wave_canvas = document.getElementById("wave_canvas");
const c = wave_canvas.getContext("2d");

//container for wave animation
var container = {
  x: 0,
  y: 0,
  width: 800,
  height: 500
};

//receive messages from worker, with balls coordinates
worker.onmessage = (evt) => {
    c.fillStyle = "#000000";
    c.fillRect(container.x, container.y, container.width, container.height);

    //draw the circles
    var coord = evt.data.split(" ");
    for (var i = 0; i < 59; i++) {
      c.fillStyle = "#FF0000";
      c.beginPath();
      c.arc((800/60)*(i+1), coord[i], 7, 0, Math.PI * 2, true);
      c.fill();
    }
}
