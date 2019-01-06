var amplitude=100;
var period=50;
var time=0;

//make 60 circles
var circles = [];
for(var i=0; i<59; i++){
  circles.push({y:250+(10+amplitude)*Math.sin(i*Math.PI*2/40)});
}

//receive message if period or amplitude slider changed value
onmessage = (evt) => {
    var new_data=JSON.stringify(evt.data);
    console.log("Worker received data: " + new_data);
    new_data=new_data.slice(9,-2);
    new_data=new_data.split(" ");

    //period change
    if(new_data[0]=="p") period=new_data[1];
    //amplitude change
    if(new_data[0]=="a") amplitude=2*new_data[1];
};

setInterval(function(){
  time+=0.1;
  var message="";
  for(var i=0; i<59; i++){
    circles[i].y=250+(10+amplitude)*Math.sin(time+i*Math.PI*2/40*(50/period));
     message+=circles[i].y;
     message+=" ";
  }
  //send coordinates
  postMessage(message);
//how many miliseconds beetwen the frames
}, 42);
