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

// =====================================
// DRAGON PIXEL RPG
// TEIL 4/10
// KAMPFSYSTEM
// =====================================


let battleEnemy=null;

let playerAttackAnimation=0;

let enemyAttackAnimation=0;

let battleMessage="";





// ---------------------
// KAMPF STARTEN
// ---------------------


function startBattle(){


if(!aktuellerKampfMonster)
return;


battleActive=true;


battleEnemy={

name:aktuellerKampfMonster.name,

hp:aktuellerKampfMonster.hp,

maxHp:aktuellerKampfMonster.hp,

attack:aktuellerKampfMonster.attack,

color:aktuellerKampfMonster.color

};


battleMessage=
"Ein "+battleEnemy.name+" greift an!";



}







// ---------------------
// SPIELER ANGRIFF
// ---------------------


function playerAttack(){


if(!battleActive)
return;



playerAttackAnimation=15;



let damage=
25+Math.floor(Math.random()*10);



battleEnemy.hp-=damage;



battleMessage=
"Du verursachst "+damage+" Schaden!";



if(battleEnemy.hp<=0){


battleMessage=
battleEnemy.name+" besiegt!";


battleActive=false;


spieler.xp+=20;


spieler.level++;


return;

}



setTimeout(()=>{

enemyAttack();

},600);



}








// ---------------------
// GEGNER ANGRIFF
// ---------------------


function enemyAttack(){



if(!battleActive)
return;



enemyAttackAnimation=15;



let damage=battleEnemy.attack;



spieler.hp-=damage;



battleMessage=
battleEnemy.name+
" greift an!";



if(spieler.hp<=0){


alert(
"Du wurdest besiegt!"
);


location.reload();


}



}








// ---------------------
// FLUCHT
// ---------------------


function escapeBattle(){



if(!battleActive)
return;



battleMessage=
"Du bist geflohen!";


battleActive=false;



}









// ---------------------
// KAMPF GRAFIK
// ---------------------


function drawBattle(){



if(!battleActive)
return;



// Hintergrund

ctx.fillStyle="#79c9ff";

ctx.fillRect(
0,
0,
800,
600
);



// Boden

ctx.fillStyle="#5da33a";

ctx.fillRect(
0,
350,
800,
250
);





// Monster Schatten

ctx.fillStyle="rgba(0,0,0,.3)";


ctx.fillRect(
470,
260,
120,
20
);




// Monster

let mx=500;


if(enemyAttackAnimation>0){

mx-=20;

enemyAttackAnimation--;

}



ctx.fillStyle=
battleEnemy.color;


ctx.fillRect(
mx,
160,
90,
90
);



// Augen

ctx.fillStyle="black";


ctx.fillRect(
mx+20,
190,
10,
10
);


ctx.fillRect(
mx+60,
190,
10,
10
);







// Spieler

let px=150;



if(playerAttackAnimation>0){

px+=20;

playerAttackAnimation--;

}



ctx.fillStyle="#246cff";


ctx.fillRect(
px,
270,
70,
80
);



ctx.fillStyle="#ffd0a0";


ctx.fillRect(
px+15,
230,
40,
40
);







// HP BALKEN



ctx.fillStyle="black";


ctx.fillRect(
450,
80,
250,
25
);


ctx.fillStyle="red";


ctx.fillRect(
450,
80,
250*
(
battleEnemy.hp/
battleEnemy.maxHp
),
25
);





ctx.fillStyle="black";


ctx.fillRect(
50,
450,
250,
25
);


ctx.fillStyle="lime";


ctx.fillRect(
50,
450,
250*
(
spieler.hp/
100
),
25
);






ctx.fillStyle="black";


ctx.font="22px Arial";


ctx.fillText(
battleEnemy.name,
450,
60
);



ctx.fillText(
"HP: "+Math.max(0,spieler.hp),
50,
430
);



ctx.fillText(
battleMessage,
200,
520
);



ctx.fillText(
"A Angriff   F Flucht",
250,
570
);



}









// ---------------------
// TASTEN
// ---------------------


document.addEventListener(
"keydown",
e=>{


if(e.key.toLowerCase()=="a"){

playerAttack();

}



if(e.key.toLowerCase()=="f"){

escapeBattle();

}



});








// ---------------------
// UPDATE ERSETZEN
// ---------------------


let oldUpdate4=update;



update=function(){



if(battleActive){

return;

}



oldUpdate4();



};








// ---------------------
// DRAW ERSETZEN
// ---------------------


let oldDraw4=draw;



draw=function(){



if(battleActive){


drawBattle();


return;


}



oldDraw4();



};
// =====================================
// DRAGON PIXEL RPG
// TEIL 5/10
// SKILLS + ITEMS + INVENTAR
// =====================================



// ---------------------
// SPIELER ERWEITERN
// ---------------------


spieler.mana=100;


spieler.items={

heiltrank:3,

feuerstein:2

};



spieler.skills=[

{
name:"Schwertschlag",
damage:30,
mana:0
},


{
name:"Feuerball",
damage:60,
mana:30
},


{
name:"Drachenhieb",
damage:90,
mana:50
}

];







let aktuellerSkill=0;







// ---------------------
// SKILL BENUTZEN
// ---------------------


function useSkill(){



if(!battleActive)
return;



let skill=
spieler.skills[aktuellerSkill];



if(
spieler.mana < skill.mana
){

battleMessage=
"Nicht genug Mana!";


return;

}




spieler.mana-=skill.mana;



let damage=
skill.damage+
Math.floor(Math.random()*15);



battleEnemy.hp-=damage;



battleMessage=
skill.name+
" macht "+
damage+
" Schaden!";





if(
battleEnemy.hp<=0
){


battleMessage=
battleEnemy.name+
" wurde besiegt!";


battleActive=false;


spieler.xp+=50;


return;

}




setTimeout(()=>{


enemyAttack();


},600);



}









// ---------------------
// SKILL WECHSEL
// ---------------------


function nextSkill(){


aktuellerSkill++;



if(
aktuellerSkill>=spieler.skills.length
){

aktuellerSkill=0;

}



battleMessage=
"Gewählt: "+
spieler.skills[aktuellerSkill].name;



}










// ---------------------
// ITEMS
// ---------------------


function useItem(){



if(
spieler.items.heiltrank<=0
){


battleMessage=
"Keine Tränke!";


return;

}



spieler.items.heiltrank--;



spieler.hp+=50;



if(
spieler.hp>100
)

spieler.hp=100;



battleMessage=
"Heiltrank benutzt!";



enemyAttack();



}









// ---------------------
// TASTEN ERWEITERN
// ---------------------


document.addEventListener(
"keydown",
e=>{


if(!battleActive)
return;



if(
e.key=="1"
){

aktuellerSkill=0;

useSkill();

}



if(
e.key=="2"
){

aktuellerSkill=1;

useSkill();

}



if(
e.key=="3"
){

aktuellerSkill=2;

useSkill();

}



if(
e.key.toLowerCase()=="q"
){

nextSkill();

}



if(
e.key.toLowerCase()=="i"
){

useItem();

}



});









// ---------------------
// KAMPF HUD ERWEITERN
// ---------------------


let oldBattleDraw5=drawBattle;



drawBattle=function(){



oldBattleDraw5();



if(!battleActive)
return;



ctx.fillStyle="black";

ctx.font="18px Arial";



ctx.fillText(

"Mana: "+
spieler.mana,

50,

410

);



ctx.fillText(

"Skill: "+
spieler.skills[aktuellerSkill].name,

450,

540

);



ctx.fillText(

"1-3 Skill  I Trank",

450,

570

);



};
// =====================================
// DRAGON PIXEL RPG
// TEIL 6/10
// LEVEL + XP + SCHWIERIGKEIT
// =====================================




// ---------------------
// LEVEL SYSTEM
// ---------------------


spieler.xp=0;

spieler.xpNext=100;


spieler.level=1;


spieler.bonusDamage=0;







function addXP(menge){


spieler.xp+=menge;



if(
spieler.xp>=spieler.xpNext
){


levelUp();


}


}







function levelUp(){



spieler.level++;



spieler.xp=0;



spieler.xpNext+=100;



spieler.hp=100;



spieler.mana=100;



spieler.attack+=10;



spieler.bonusDamage+=5;



alert(

"Level Up!\n"+
"Du bist jetzt Level "+
spieler.level

);



}










// ---------------------
// GEBIETE
// ---------------------



let gebiete=[


{

name:"Grüner Wald",

gegnerStufe:1,

farbe:"#55bb55"

},



{

name:"Dunkle Höhle",

gegnerStufe:3,

farbe:"#555555"

},



{

name:"Vulkanberg",

gegnerStufe:6,

farbe:"#bb4422"

},



{

name:"Drachenfestung",

gegnerStufe:10,

farbe:"#222222"

}

];




let aktuellesGebiet=0;









// ---------------------
// SCHWIERIGERE MONSTER
// ---------------------


function verbessernMonster(monster){



let stufe=
gebiete[aktuellesGebiet]
.gegnerStufe;



monster.hp*=stufe;


monster.attack*=stufe;



return monster;


}









// ---------------------
// NEUE MONSTER ERZEUGUNG
// ---------------------


let alteMonsterSpawn=spawnMonster;



spawnMonster=function(){


if(monster.length>5)
return;



let art=
monsterArten[
Math.floor(
Math.random()*
monsterArten.length
)
];



let neues={


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



speed:
0.5+
aktuellesGebiet*0.2,



data:{

name:art.name,


hp:
art.hp+
(aktuellesGebiet*50),



attack:
art.attack+
(aktuellesGebiet*10),



color:art.color



},



moveTimer:0



};



monster.push(neues);



};









// ---------------------
// XP NACH KAMPF
// ---------------------



let alterPlayerAttack5=playerAttack;



playerAttack=function(){



let vorher=
battleEnemy.hp;



alterPlayerAttack5();



if(
battleEnemy &&
battleEnemy.hp<=0
){



addXP(
50+
aktuellesGebiet*25
);



}



};









// ---------------------
// HUD ERWEITERN
// ---------------------



let alteDrawPlayer6=drawPlayer;



drawPlayer=function(){


alteDrawPlayer6();



ctx.fillStyle="white";


ctx.font="18px Arial";


ctx.fillText(

"Level: "+
spieler.level,

10,

70

);



ctx.fillText(

"XP: "+
spieler.xp+
"/"+
spieler.xpNext,

10,

95

);



};










// ---------------------
// GEBIET WECHSEL
// ---------------------


function wechselGebiet(id){


if(
gebiete[id]
){


aktuellesGebiet=id;



alert(

"Du betrittst: "+
gebiete[id].name

);



}



}
// =====================================
// DRAGON PIXEL RPG
// TEIL 7/10
// QUEST SYSTEM
// =====================================



// ---------------------
// QUEST DATEN
// ---------------------


let quests=[


{

id:1,

name:"Schleim-Jagd",

beschreibung:
"Besiege 5 Schleime im Wald.",


ziel:5,


fortschritt:0,


typ:"Grünschleim",


belohnungXP:150,


belohnungItem:"heiltrank",


aktiv:false,


fertig:false

},



{

id:2,


name:"Die Höhle",

beschreibung:
"Besiege 3 Schattenwölfe.",


ziel:3,


fortschritt:0,


typ:"Schattenwolf",


belohnungXP:300,


belohnungItem:"feuerstein",


aktiv:false,


fertig:false

},



{

id:3,


name:"Der Drachenwächter",

beschreibung:
"Besiege den Wächter der Festung.",


ziel:1,


fortschritt:0,


typ:"Feuerkobold",


belohnungXP:500,


belohnungItem:"heiltrank",


aktiv:false,


fertig:false

}


];






let aktiveQuest=null;







// ---------------------
// QUEST STARTEN
// ---------------------


function starteQuest(id){


let q=quests[id];



if(!q)
return;



q.aktiv=true;


aktiveQuest=q;



alert(

"Neue Quest:\n"+
q.name+
"\n\n"+
q.beschreibung

);



}









// ---------------------
// QUEST FORTSCHRITT
// ---------------------


function questFortschritt(monsterName){



if(!aktiveQuest)
return;



if(
aktiveQuest.typ==
monsterName
){


aktiveQuest.fortschritt++;



if(
aktiveQuest.fortschritt>=
aktiveQuest.ziel
){


questFertig();


}



}



}








// ---------------------
// QUEST ABSCHLIESSEN
// ---------------------


function questFertig(){



aktiveQuest.fertig=true;



addXP(
aktiveQuest.belohnungXP
);



spieler.items[
aktiveQuest.belohnungItem
]++;



alert(

"Quest geschafft!\n"+
"Belohnung erhalten!"

);



}








// ---------------------
// NPC QUEST GEBER
// ---------------------



let questNPC={


x:15*TILE,

y:10*TILE,


name:"Questmeister"


};





function drawQuestNPC(){



let x=
questNPC.x-camera.x;


let y=
questNPC.y-camera.y;



ctx.fillStyle="#ffcc00";


ctx.fillRect(

x,

y,

24,

32

);



ctx.fillStyle="white";


ctx.font="14px Arial";


ctx.fillText(

"!",

x+8,

y-10

);



}








function checkQuestNPC(){



let dist=Math.sqrt(

(player.x-questNPC.x)**2+
(player.y-questNPC.y)**2

);



if(
dist<50
){



alert(

"Questmeister:\n"+
"Drücke E für eine Aufgabe!"

);



}

}





document.addEventListener(
"keydown",
e=>{


if(
e.key.toLowerCase()=="e"
){



let dist=Math.sqrt(

(player.x-questNPC.x)**2+
(player.y-questNPC.y)**2

);



if(dist<50){


starteQuest(0);


}



}



});










// ---------------------
// KAMPF MIT QUEST VERBINDEN
// ---------------------



let altePlayerAttackQuest=playerAttack;



playerAttack=function(){



let name=
battleEnemy?
battleEnemy.name:
"";



altePlayerAttackQuest();



if(
battleEnemy &&
battleEnemy.hp<=0
){


questFortschritt(name);



}



};









// ---------------------
// QUEST HUD
// ---------------------



function drawQuestHUD(){



if(!aktiveQuest)
return;



ctx.fillStyle="black";


ctx.fillRect(
550,
20,
230,
90
);



ctx.fillStyle="white";


ctx.font="16px Arial";


ctx.fillText(

aktiveQuest.name,

560,

45

);



ctx.fillText(

aktiveQuest.fortschritt+
"/"+
aktiveQuest.ziel,

560,

70

);



}








// ---------------------
// DRAW ERWEITERN
// ---------------------



let oldDraw7=draw;



draw=function(){



oldDraw7();



drawQuestNPC();


drawQuestHUD();



};






// ---------------------
// UPDATE ERWEITERN
// ---------------------



let oldUpdate7=update;



update=function(){



oldUpdate7();



checkQuestNPC();



};
// =====================================
// DRAGON PIXEL RPG
// TEIL 8/10
// ANIMATIONEN + EFFEKTE
// =====================================



// ---------------------
// ANIMATION SYSTEM
// ---------------------


let animationFrame=0;


let particles=[];


let cameraShake=0;







function updateAnimation(){



animationFrame++;



if(cameraShake>0){

cameraShake--;

camera.x+=
Math.random()*10-5;

camera.y+=
Math.random()*10-5;

}



updateParticles();



}








// ---------------------
// PARTIKEL SYSTEM
// ---------------------



function createParticles(x,y,color,amount){



for(let i=0;i<amount;i++){


particles.push({

x:x,

y:y,


dx:
Math.random()*4-2,


dy:
Math.random()*4-2,


life:30,


color:color


});


}


}






function updateParticles(){



particles.forEach(p=>{


p.x+=p.dx;

p.y+=p.dy;


p.life--;


});



particles=
particles.filter(
p=>p.life>0
);



}







function drawParticles(){



particles.forEach(p=>{


ctx.fillStyle=p.color;



ctx.fillRect(

p.x-camera.x,

p.y-camera.y,

5,

5

);



});



}









// ---------------------
// BESSERE SPIELER ANIMATION
// ---------------------


let oldDrawPlayer8=drawPlayer;



drawPlayer=function(){



let oldY=player.y;



if(player.animation%20<10){


player.y-=2;


}



oldDrawPlayer8();



player.y=oldY;



};









// ---------------------
// MONSTER ANIMATION
// ---------------------



let oldDrawMonster8=drawMonster;



drawMonster=function(){



monster.forEach(m=>{



let oldY=m.y;



if(
animationFrame%30<15
){

m.y-=2;

}



});



oldDrawMonster8();



monster.forEach(m=>{


if(
animationFrame%30<15
){

m.y+=2;


}


});



};









// ---------------------
// ANGRIFF EFFEKTE
// ---------------------



let oldPlayerAttack8=playerAttack;



playerAttack=function(){



if(battleEnemy){



createParticles(

battleEnemy.hp,

200,

"yellow",

20

);



cameraShake=10;



}



oldPlayerAttack8();



};








let oldEnemyAttack8=enemyAttack;



enemyAttack=function(){



createParticles(

player.x,

player.y,

"red",

15

);



cameraShake=8;



oldEnemyAttack8();



};









// ---------------------
// FEUER EFFEKT
// ---------------------


function fireEffect(x,y){



createParticles(

x,

y,

"orange",

10

);



createParticles(

x,

y,

"yellow",

10

);



}








// ---------------------
// DRAW ERWEITERN
// ---------------------



let oldDraw8=draw;



draw=function(){



oldDraw8();



drawParticles();



};








// ---------------------
// UPDATE ERWEITERN
// ---------------------



let oldUpdate8=update;



update=function(){



oldUpdate8();



updateAnimation();



};
// =====================================
// DRAGON PIXEL RPG
// TEIL 9/10
// DRACHENFESTUNG + BOSSKAMPF
// =====================================



// ---------------------
// DRACHENBOSS
// ---------------------


let dragonBoss={


name:"Akaros der Uralte Drache",


maxHP:1000,


hp:1000,


phase:1,


attack:50,


alive:true,


fireTimer:0



};





let bossBattle=false;








// ---------------------
// BOSS START
// ---------------------


function startDragonBoss(){



bossBattle=true;



battleActive=true;



battleEnemy={


name:dragonBoss.name,


hp:dragonBoss.hp,


maxHp:dragonBoss.maxHP,


attack:dragonBoss.attack,


color:"#8b0000"


};



battleMessage=

"Der Uralte Drache erwacht!";



}










// ---------------------
// BOSS PHASEN
// ---------------------


function updateDragonPhase(){



if(
battleEnemy.hp<
700 &&
dragonBoss.phase==1
){


dragonBoss.phase=2;


dragonBoss.attack=70;



battleMessage=

"Der Drache wird wütend!";


}




if(
battleEnemy.hp<
300 &&
dragonBoss.phase==2
){


dragonBoss.phase=3;


dragonBoss.attack=100;



battleMessage=

"Der Drache entfesselt seine Macht!";


}



}









// ---------------------
// DRACHEN ANIMATION
// ---------------------


function drawDragonBoss(){



if(!bossBattle)
return;



let x=480;

let y=120;



// Flügel


ctx.fillStyle="#5a0000";


ctx.fillRect(

x-50,

y+20,

50,

90

);


ctx.fillRect(

x+100,

y+20,

50,

90

);



// Körper


ctx.fillStyle="#a00000";


ctx.fillRect(

x,

y,

100,

100

);




// Kopf


ctx.fillRect(

x+60,

y-50,

70,

60

);




// Auge


ctx.fillStyle="yellow";


ctx.fillRect(

x+100,

y-25,

12,

12

);



// Feuer


if(
dragonBoss.fireTimer>0
){


ctx.fillStyle="orange";


ctx.fillRect(

x-100,

y+40,

100,

35

);


dragonBoss.fireTimer--;


}



}









// ---------------------
// BOSS ANGRIFF
// ---------------------


function dragonAttack(){



if(!bossBattle)
return;



let damage=
dragonBoss.attack;



spieler.hp-=damage;



dragonBoss.fireTimer=20;



createParticles(

spieler.x,

spieler.y,

"orange",

30

);



battleMessage=

"Der Drache benutzt Feueratem!";



}








// ---------------------
// SPIELER ANGRIFF BOSS
// ---------------------



let oldPlayerAttackBoss=playerAttack;



playerAttack=function(){



oldPlayerAttackBoss();



if(
bossBattle &&
battleEnemy.hp<=0
){



dragonBoss.alive=false;


bossBattle=false;


battleActive=false;



alert(

"Der Uralte Drache wurde besiegt!"

);



}

else if(bossBattle){


updateDragonPhase();



}



};









// ---------------------
// BOSS HUD
// ---------------------


function drawBossHUD(){



if(!bossBattle)
return;



ctx.fillStyle="black";


ctx.fillRect(

250,

20,

300,

25

);



ctx.fillStyle="purple";


ctx.fillRect(

250,

20,

300*
(
battleEnemy.hp/
battleEnemy.maxHp
),

25

);



ctx.fillStyle="white";


ctx.font="18px Arial";


ctx.fillText(

"DRACHE PHASE "+
dragonBoss.phase,

300,

70

);



}









// ---------------------
// FESTUNG
// ---------------------


let fortress={


x:50*TILE,

y:30*TILE



};




function drawFortress(){



let x=
fortress.x-camera.x;


let y=
fortress.y-camera.y;



ctx.fillStyle="#333";


ctx.fillRect(

x,

y,

160,

160

);



ctx.fillStyle="#111";


ctx.fillRect(

x+55,

y+80,

50,

80

);



}








// ---------------------
// UPDATE
// ---------------------



let oldUpdate9=update;



update=function(){



oldUpdate9();



if(bossBattle){

dragonAttack();


}



};









// ---------------------
// DRAW
// ---------------------


let oldDraw9=draw;



draw=function(){



oldDraw9();



drawFortress();


drawDragonBoss();


drawBossHUD();



};
// =====================================
// DRAGON PIXEL RPG
// TEIL 10/10
// MENÜ + SPEICHERN + FEINSCHLIFF
// =====================================



// ---------------------
// SPIEL STATUS
// ---------------------


let gameStarted=false;

let paused=false;






// ---------------------
// HAUPTMENÜ
// ---------------------


function drawMenu(){


ctx.fillStyle="#111";

ctx.fillRect(
0,
0,
800,
600
);



ctx.fillStyle="gold";

ctx.font="55px Arial";


ctx.fillText(

"DRAGON PIXEL RPG",

120,

180

);



ctx.fillStyle="white";

ctx.font="25px Arial";


ctx.fillText(

"ENTER = Start",

300,

300

);


ctx.fillText(

"L = Laden",

330,

350

);



}







// ---------------------
// START
// ---------------------


document.addEventListener(
"keydown",
e=>{


if(
!gameStarted &&
e.key=="Enter"
){


gameStarted=true;


}



});









// ---------------------
// SPEICHERN
// ---------------------


function saveGame(){



let saveData={


x:spieler.x,

y:spieler.y,


hp:spieler.hp,


level:spieler.level,


xp:spieler.xp,


mana:spieler.mana,


items:spieler.items



};



localStorage.setItem(

"dragonSave",

JSON.stringify(saveData)

);



alert(

"Spiel gespeichert!"

);



}







// ---------------------
// LADEN
// ---------------------


function loadGame(){



let data=
localStorage.getItem(
"dragonSave"
);



if(!data){


alert(
"Kein Spielstand gefunden!"
);


return;

}



data=JSON.parse(data);



spieler.x=data.x;

spieler.y=data.y;

spieler.hp=data.hp;

spieler.level=data.level;

spieler.xp=data.xp;

spieler.mana=data.mana;

spieler.items=data.items;



alert(

"Spiel geladen!"

);



}








// Tasten

document.addEventListener(
"keydown",
e=>{


if(
e.key.toLowerCase()=="p"
){

paused=!paused;


}



if(
e.key.toLowerCase()=="l"
){

loadGame();

}



if(
e.key.toLowerCase()=="k"
){

saveGame();

}



});








// ---------------------
// PAUSE SCREEN
// ---------------------


function drawPause(){



ctx.fillStyle=
"rgba(0,0,0,0.7)";


ctx.fillRect(
0,
0,
800,
600
);



ctx.fillStyle="white";

ctx.font="40px Arial";


ctx.fillText(

"PAUSE",

330,

250

);



ctx.font="20px Arial";


ctx.fillText(

"P drücken zum Weiter",

270,

320

);



}








// ---------------------
// FINAL UPDATE
// ---------------------


let finalUpdate=update;



update=function(){



if(!gameStarted)
return;



if(paused)
return;



finalUpdate();



};








// ---------------------
// FINAL DRAW
// ---------------------


let finalDraw=draw;



draw=function(){



if(!gameStarted){


drawMenu();


return;


}



finalDraw();



if(paused){


drawPause();


}



};





// =====================================
// ENDE DES SPIELSYSTEMS
// Dragon Pixel RPG v1.0
// =====================================

function touchMove(key){

keys[key]=true;


setTimeout(()=>{

keys[key]=false;

},100);

}



document.getElementById("up")
.ontouchstart=()=>touchMove("w");


document.getElementById("down")
.ontouchstart=()=>touchMove("s");


document.getElementById("left")
.ontouchstart=()=>touchMove("a");


document.getElementById("right")
.ontouchstart=()=>touchMove("d");



document.getElementById("attack")
.ontouchstart=()=>playerAttack();
