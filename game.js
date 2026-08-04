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



 // =====================================
// DRAGON PIXEL RPG
// TEIL 2/10
// WELT + NPC SYSTEM
// =====================================



// ---------------------
// WELT OBJEKTE
// ---------------------


const objects=[


{
type:"house",
x:8*TILE,
y:8*TILE,
width:96,
height:96
},


{
type:"house",
x:35*TILE,
y:15*TILE,
width:96,
height:96
},


{
type:"chest",
x:20*TILE,
y:12*TILE,
opened:false
}


];







// ---------------------
// NPC SYSTEM
// ---------------------


const npcs=[


{

name:"Dorfältester",

x:11*TILE,

y:11*TILE,


text:
"Willkommen Held! Der Drache erwacht bald..."


},


{

name:"Händler",

x:38*TILE,

y:18*TILE,


text:
"Ich verkaufe später mächtige Items."


}



];





let aktuellerNPC=null;








// ---------------------
// OBJEKTE ZEICHNEN
// ---------------------



function drawObjects(){



objects.forEach(obj=>{


let x=obj.x-camera.x;

let y=obj.y-camera.y;



if(obj.type=="house"){



// Dach

ctx.fillStyle="#9b2c2c";


ctx.fillRect(
x-10,
y-20,
116,
40
);



// Haus

ctx.fillStyle="#e5b36a";


ctx.fillRect(
x,
y,
96,
80
);



// Tür

ctx.fillStyle="#5b3000";


ctx.fillRect(
x+38,
y+45,
20,
35
);



}



if(obj.type=="chest"){



ctx.fillStyle=
obj.opened?
"#555":
"#8b4513";


ctx.fillRect(
x,
y,
25,
20
);


}



});



}









// ---------------------
// NPC ZEICHNEN
// ---------------------


function drawNPC(){



npcs.forEach(npc=>{


let x=npc.x-camera.x;

let y=npc.y-camera.y;



// Körper

ctx.fillStyle="#ffcc00";


ctx.fillRect(
x,
y,
22,
28
);



// Kopf

ctx.fillStyle="#ffd0a0";


ctx.fillRect(
x+3,
y-10,
16,
12
);



});



}








// ---------------------
// NPC INTERAKTION
// ---------------------


function checkNPC(){


aktuellerNPC=null;



npcs.forEach(npc=>{


let distance=Math.sqrt(

(player.x-npc.x)**2+
(player.y-npc.y)**2

);



if(distance<50){


aktuellerNPC=npc;


}


});



}





document.addEventListener(
"keydown",
e=>{


if(
e.key.toLowerCase()=="e" &&
aktuellerNPC
){


alert(
aktuellerNPC.name+
": "+
aktuellerNPC.text
);


}



});









// ---------------------
// BESSERE GRAS-EFFEKTE
// ---------------------


function grassDetails(){



for(let i=0;i<80;i++){



let x=
Math.random()*map.width*TILE-camera.x;


let y=
Math.random()*map.height*TILE-camera.y;



ctx.fillStyle="#3c992e";


ctx.fillRect(
x,
y,
2,
5
);



}



}








// ---------------------
// UPDATE ERWEITERN
// ---------------------


let oldUpdate2=update;



update=function(){



oldUpdate2();


checkNPC();



};







// ---------------------
// DRAW ERWEITERN
// ---------------------


let oldDraw2=draw;



draw=function(){



oldDraw2();



grassDetails();


drawObjects();


drawNPC();



}; 
}



loop();

// =====================================
// DRAGON PIXEL RPG
// TEIL 3/10
// MONSTER SYSTEM
// =====================================



const monsterArten=[


{
name:"Grünschleim",
hp:50,
attack:8,
color:"#35d04b"
},


{
name:"Schattenwolf",
hp:90,
attack:15,
color:"#555577"
},


{
name:"Feuerkobold",
hp:120,
attack:20,
color:"#ff5522"
}


];





let monster=[];






// ---------------------
// MONSTER ERZEUGEN
// ---------------------


function spawnMonster(){


if(monster.length>5)
return;



let art=
monsterArten[
Math.floor(
Math.random()*monsterArten.length
)
];



monster.push({


x:
Math.floor(
Math.random()*map.width
)*TILE,


y:
Math.floor(
Math.random()*map.height
)*TILE,


width:28,

height:28,


speed:0.5,


data:{
name:art.name,
hp:art.hp,
attack:art.attack,
color:art.color
},


moveTimer:0


});



}





setInterval(()=>{


spawnMonster();


},5000);









// ---------------------
// MONSTER ZEICHNEN
// ---------------------


function drawMonster(){



monster.forEach(m=>{



let x=m.x-camera.x;

let y=m.y-camera.y;



// Schatten

ctx.fillStyle="rgba(0,0,0,.3)";

ctx.fillRect(
x,
y+25,
28,
5
);



// Körper

ctx.fillStyle=m.data.color;


ctx.fillRect(
x,
y,
28,
28
);



// Augen

ctx.fillStyle="black";


ctx.fillRect(
x+5,
y+8,
5,
5
);


ctx.fillRect(
x+18,
y+8,
5,
5
);




});



}







// ---------------------
// MONSTER BEWEGUNG
// ---------------------


function updateMonster(){



monster.forEach(m=>{


m.moveTimer++;



if(m.moveTimer>80){



let richtung=
Math.floor(
Math.random()*4
);



if(richtung==0)
m.x+=16;


if(richtung==1)
m.x-=16;


if(richtung==2)
m.y+=16;


if(richtung==3)
m.y-=16;



m.moveTimer=0;



}



});



}







// ---------------------
// KOLLISION SPIELER
// ---------------------


function checkMonster(){



monster.forEach((m,index)=>{



let dist=Math.sqrt(


(player.x-m.x)**2+
(player.y-m.y)**2


);



if(dist<35){



console.log(
"Kampf gegen:",
m.data.name
);



aktuellerKampfMonster=m.data;


monster.splice(index,1);



startBattle();



}



});



}








// ---------------------
// KAMPF VARIABLE
// ---------------------


let aktuellerKampfMonster=null;

let battleActive=false;








// ---------------------
// UPDATE ERWEITERN
// ---------------------


let oldUpdate3=update;


update=function(){


oldUpdate3();



updateMonster();


checkMonster();


};









// ---------------------
// DRAW ERWEITERN
// ---------------------


let oldDraw3=draw;



draw=function(){



oldDraw3();



drawMonster();



};
