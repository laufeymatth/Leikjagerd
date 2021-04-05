//gerum teiknicontextið
var cvs = document.getElementById('leikjagerð');
var ctx = cvs.getContext('2d');


var number_of_platforms = 2;
var platforms = [];


//ætla að "harð kóða" þetta seinna þegar við erum komin með designið svo ég viti hvar þeir eiga að vera - Laufey
/*function createPlatform(){
	for (i = 0; i < number_of_platforms; i++){
		x: 100 * i,
        y: 200 + (30 * i),
        width: 110,
        height: 15
	}
}*/


//kóðinn sem teiknar inn platformana -Laufey
function renderplat(){
    ctx.fillStyle = "#45597E";
    ctx.fillRect(platforms[0].x, platforms[0].y, platforms[0].width, platforms[0].height);
    ctx.fillRect(platforms[1].x, platforms[1].y, platforms[1].width,platforms[1]. height);
    ctx.fillRect(platforms[2].x, platforms[2].y, platforms[2].width,platforms[2]. height);
    ctx.fillRect(platforms[3].x, platforms[3].y, platforms[3].width,platforms[3]. height);
}



//tutorialið sem er linkur nr 2 á doc-inu gerir svona loop thing
function loop() {



	//kóðinn sem tékkar hvort það sé collision -Laufey
    let i = -1;
    if(platforms[0].x < player.x && player.x < platforms[0].x + platforms[0].width && platforms[0].y < player.y && player.y < platforms[0].y + platforms[0].height){
            i = 0;
        }
    if(platforms[1].x < player.x && player.x < platforms[1].x + platforms[1].width && platforms[1].y < player.y && player.y < platforms[1].y + platforms[1].height){
            i = 1;
        }
    /*if (i > -1){
        player.jump = false;
        player.y = platforms[i].y;    
    }*/
    renderplat();
}


document.addEventListener("keydown",keydown);
document.addEventListener("keyup",keyup);
setInterval(loop,22);