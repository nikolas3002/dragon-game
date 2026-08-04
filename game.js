// =====================================
// DRAGON PIXEL RPG
// ENGINE TEIL 1/10
// =====================================


const canvas=document.getElementById("game");

const ctx=canvas.getContext("2d");


ctx.imageSmoothingEnabled=false;



// ---------------------
// GAME SETTINGS
// ---------------------

const WIDTH=800;
const HEIGHT=600;

const TILE=32;

let gameRunning=true;

let delta=0;





// ---------------------
// INPUT SYSTEM
// ---------------------


const keys={};


window.addEventListener(
"keydown",
e=>{

keys[e.key.toLowerCase()]=true;

});


window.addEventListener(
"keyup",
e=>{

keys[e.key.toLowerCase()]=false;

});






// ---------------------
// CAMERA
// ---------------------


const camera={

x:0,

y:0,

speed:0.1,


follow(target){


this.x += 
(target.x-WIDTH/2-this.x)
*this.speed;


this.y +=
(target.y-HEIGHT/2-this.y)
*this.speed;


}


};







// ---------------------
// MAP SYSTEM
// ---------------------


const map={


width:60,

height:40,


tiles:[]


};



// Karte erzeugen

function createMap(){


for(let y=0;y<map.height;y++){


map.tiles[y]=[];


for(let x=0;x<map.width;x++){



let tile=0;



// Rand

if(
x==0||
y==0||
x==map.width-1||
y==map.height-1
){

tile=1;

}


// Wasser

if(
Math.random()<0.08
){

tile=2;

}


// Bäume

if(
Math.random()<0.05
){

tile=3;

}



map.tiles[y][x]=tile;



}


}


}


createMap();






// ---------------------
// DRAW MAP
// ---------------------


function drawMap(){


for(
let y=0;
y<map.height;
y++
){


for(
let x=0;
x<map.width;
x++
){


let t=map.tiles[y][x];

let px=
x*TILE-camera.x;


let py=
y*TILE-camera.y;



if(t==0){

ctx.fillStyle="#55b83b";

}


if(t==1){

ctx.fillStyle="#245024";

}


if(t==2){

ctx.fillStyle="#238ad6";

}


if(t==3){

ctx.fillStyle="#146b20";

}



ctx.fillRect(
px,
py,
TILE,
TILE
);



}


}


}







// ---------------------
// PLAYER
// ---------------------


const player={


x:400,

y:300,


width:24,

height:28,


speed:3,


direction:"down",


frame:0,


animation:0,



hp:100,


level:1,


xp:0



};






// PLAYER ZEICHNEN


function drawPlayer(){



let x=
player.x-camera.x;


let y=
player.y-camera.y;



// Schatten

ctx.fillStyle="rgba(0,0,0,0.3)";


ctx.fillRect(

x,

y+25,

25,

5

);




// Körper


ctx.fillStyle="#246cff";


ctx.fillRect(

x,

y+10,

24,

18

);




// Kopf


ctx.fillStyle="#ffd0a0";


ctx.fillRect(

x+4,

y,

16,

14

);




// Haare


ctx.fillStyle="#4b2200";


ctx.fillRect(

x+4,

y,

16,

5

);



// Animation

if(
player.animation>10
){

ctx.fillRect(
x+10,
y+30,
5,
5
);

}



}








// ---------------------
// COLLISION
// ---------------------


function canMove(nx,ny){


let tx=
Math.floor(nx/TILE);


let ty=
Math.floor(ny/TILE);



if(
!map.tiles[ty]||
map.tiles[ty][tx]===undefined
)

return false;



if(
map.tiles[ty][tx]==1||
map.tiles[ty][tx]==2
)

return false;



return true;



}







// ---------------------
// PLAYER UPDATE
// ---------------------


function updatePlayer(){



let dx=0;

let dy=0;



if(keys["w"]||keys["arrowup"])

dy=-player.speed;


if(keys["s"]||keys["arrowdown"])

dy=player.speed;



if(keys["a"]||keys["arrowleft"])

dx=-player.speed;



if(keys["d"]||keys["arrowright"])

dx=player.speed;





if(
canMove(
player.x+dx,
player.y
)
)

player.x+=dx;



if(
canMove(
player.x,
player.y+dy
)
)

player.y+=dy;





if(dx||dy){

player.animation++;

}


else{

player.animation=0;

}



camera.follow(player);



}







// ---------------------
// GAME LOOP
// ---------------------


function update(){


updatePlayer();


}



function draw(){



ctx.clearRect(
0,
0,
WIDTH,
HEIGHT
);



drawMap();


drawPlayer();



}




function loop(){



if(!gameRunning)
return;



update();


draw();



requestAnimationFrame(loop);



}



loop();
