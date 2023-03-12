/**
 * Title Screen and Log in Library for Maskie's Ice Cream Parlor, the horror adventure game.
 * Purpose: scaring the player and letting them name themselves.
 * Author: A.E.Veltstra, for Treasure Trove Studio.
 * Version: 2.21.831.1945
**/

const MASKIES = "Maskie\u2019s"
const ICE_CREAM = "Ice Cream";

function drawTitle(paper, signMetrics) {
  paper.fillStyle = "#4d0000";
  paper.font = "bold 50px 'SF Pro', Helvetica, Verdana, sans-serif";
  //textAlign = center moves the start position 
  //by half the text width.
  paper.textAlign = "center";
  //textMetrics = paper.measureText(MASKIES);
  //fillText starts at y and goes down, 
  //starts at x and goes into writing direction. 
  paper.fillText(
    MASKIES, 
    signMetrics.x + (signMetrics.width / 2), 
    signMetrics.y + 50, 
    signMetrics.width
  );
  paper.font = "bold 40px 'SF Pro', Helvetica, Verdana, sans-serif";
  paper.fillText(
    ICE_CREAM,
    signMetrics.x + (signMetrics.width / 2),
    signMetrics.y + 90,
    signMetrics.width
  );
}

/* Center on width, align with bottom */
function calculateDoorMetrics(area) {
  let center = getCenter(area);
  let doorHeight = 5 * TILE_HEIGHT;
  let doorWidth = 3 * TILE_WIDTH;
  let doorMetrics = {
    x: center.x - (Math.min(doorWidth, area.width) / 2), 
    y: TILE_HEIGHT,
    width: Math.min(doorWidth, area.width),
    height: doorHeight 
  };
  return doorMetrics;
}

/**
 * Gets the door to show up on the paper in the door 
 * metrics, in the specified color.
 * The doorColor needs to be a triple with color values
 * named r, g, and b, ranging from 0 to 255.
**/
function drawClosedDoor(paper, doorMetrics, doorColor) {
  //Note that the 3rd and 4th arguments are not
  //width and height, but the coordinate for those.
  //So we have to add the original x and y.
  let doorGradient = paper.createLinearGradient(
    doorMetrics.x,
    doorMetrics.y,
    doorMetrics.x + 12,
    doorMetrics.y + doorMetrics.height
  );
  doorGradient.addColorStop(0, toRgbFunction(doorColor));
  doorGradient.addColorStop(0.98, toRgbFunction(doorColor));
  doorGradient.addColorStop(0.99, toRgbFunction(darker(doorColor, 40)));
  doorGradient.addColorStop(1, toRgbFunction(darker(doorColor, 60)));
  paper.fillStyle = doorGradient;
  paper.fillRect(
    doorMetrics.x, 
    doorMetrics.y,
    doorMetrics.width,
    doorMetrics.height
  );
}

/**
 * Makes a lot of assumptions about where 
 * on the door the sign should appear.
**/
function calculateSignMetrics(doorMetrics) {
  let padded = smaller(doorMetrics, 27);
  return {
    x: padded.x,
    y: padded.y + (TILE_HEIGHT * 0.618),
    width: padded.width,
    height: TILE_HEIGHT
  };
}

function fillSign(paper, signMetrics){
  let signColor = {r:255,g:251,b:204};
  paper.fillStyle = toRgbFunction(signColor);
  paper.fillRect(
    signMetrics.x,
    signMetrics.y,
    signMetrics.width,
    signMetrics.height
  );
  paper.lineWidth = 1;
  paper.strokeStyle = toRgbFunction(darker(signColor,64));
  paper.strokeRect(
    signMetrics.x,
    signMetrics.y,
    signMetrics.width,
    signMetrics.height
  );
}

/**
 * Makes the sign appear on paper within the door metrics.
 * Calculates where the sign needs to go using 
 * calculateSignMetrics(doorMetrics).
**/
function drawParlorSign(paper, doorMetrics) {
  let signMetrics = calculateSignMetrics(doorMetrics);
  fillSign(paper, signMetrics);
  let titleMetrics = smaller(signMetrics, 8);
  drawTitle(paper, titleMetrics);
}

/**
 * Draws 4 lines on the paper at the edge of the given area.
 * The 4 lines are bottom, right, left, and top. 
 * The line colors differ from the input rgb, by an amount
 * indicated by light direction. 
 * See calculateBezelColors(rgb, lightDirection).
 * Line width is set to 8.
**/
function drawBezel(paper, area, rgb, lightDirection){
  let bezelColors = calculateBezelColors(rgb, lightDirection);
  paper.lineWidth = 8;
  paper.lineJoin = "round";
  paper.lineCap = "round";
  paper.beginPath();
  paper.strokeStyle = bezelColors.bottom;
  paper.moveTo(area.x + area.width, area.y + area.height);
  paper.lineTo(area.x, area.y + area.height);
  paper.stroke();
  paper.closePath();
  paper.beginPath();
  paper.strokeStyle = bezelColors.right;
  paper.moveTo(area.x + area.width, area.y);
  paper.lineTo(area.x + area.width, area.y + area.height);
  paper.stroke(); 
  paper.closePath();
  paper.beginPath();
  paper.strokeStyle = bezelColors.left;
  paper.moveTo(area.x, area.y + area.height);
  paper.lineTo(area.x, area.y);
  paper.stroke();
  paper.closePath();
  paper.beginPath();
  paper.strokeStyle = bezelColors.top;
  paper.moveTo(area.x, area.y);
  paper.lineTo(area.x + area.width, area.y);
  paper.stroke();
  paper.closePath();
}

/**
 * Draws the door frame on the paper within the door metrics,
 * in variations of the frame color.
 * See drawBezel(paper, area, color, lightDirection).
**/
function drawClosedDoorFrame(paper, doorMetrics, frameColor) {
  drawBezel(paper, doorMetrics, frameColor, TOP_LEFT);
  drawBezel(paper, smaller(doorMetrics,8), frameColor, BOTTOM_RIGHT);
}

function drawDoorHandle(paper, doorMetrics, handleColor) {
  let borderColor = toRgbFunction(darker(handleColor,72));
  paper.strokeStyle = borderColor;
  mainColor = toRgbFunction(handleColor);
  let start = { 
    x: doorMetrics.x + 21,
    y: doorMetrics.y + (2.5 * TILE_HEIGHT)
  };
  paper.lineWidth = 1;
  paper.fillStyle = mainColor;
  paper.fillRect(
    start.x,
    start.y,
    24,
    64
  );
  paper.strokeRect(
    start.x,
    start.y,
    24,
    64
  );
  paper.moveTo(
    start.x + 12,
    start.y + 12
  );
  paper.beginPath();
  paper.arc(
    start.x + 12,
    start.y + 12,
    8,
    0,
    2 * Math.PI
    //, true       //optional: counter clockwise
  );
  let circleColor = toRgbFunction(darker(handleColor, 54));
  paper.fillStyle = circleColor;
  paper.fill();
  paper.stroke();
  paper.closePath();
  paper.fillStyle = mainColor;
  paper.fillRect(
    start.x + 8,
    start.y + 8,
    42,
    8
  );
  paper.strokeRect(
    start.x + 8,
    start.y + 8,
    42,
    8
  );
  paper.moveTo(
    start.x + 12,
    start.y + 48
  );
  paper.beginPath();
  paper.arc(
    start.x + 12,
    start.y + 48,
    8,
    0,
    2 * Math.PI
    //, true       //optional: counter clockwise
  );
  paper.fillStyle = circleColor;
  paper.fill();
  paper.strokeStyle = borderColor;
  paper.stroke();
  paper.closePath();
  paper.fillStyle = "black";
  paper.fillRect(
    start.x + 11,
    start.y + 44,
    2,
    8
  );
  
}

/**
 * Draws a door and a sign on that door,
 * on the paper,
 * in the center bottom of the area.
 * See calculateDoorMetrics(area).
 * See drawClosedDoor().
 * See drawClosedDoorFrame().
 * See drawParlorSign().
**/
function drawDoor(paper, area) {
  doorMetrics = calculateDoorMetrics(area);
  let doorColor = {r:3,g:115,b:137};
  drawClosedDoor(paper, doorMetrics, doorColor);
  let frameColor = {r:9,g:118,b:125};
  drawClosedDoorFrame(paper, doorMetrics, frameColor);
  drawParlorSign(paper, doorMetrics);
  let handleColor = {r:193,g:193,b:193};
  drawDoorHandle(paper, doorMetrics, handleColor);
}

/**
 * Repeats the passed-in image on the paper
 * within the area.
**/
function fillWall(paper, area, imgElement) {
    let pattern = paper.createPattern(imgElement, "repeat");
    paper.fillStyle = pattern;
    paper.fillRect(
      area.x,
      area.y,
      area.width,
      area.height
    );
}

/**
 * Repeats the passed-in image on the paper
 * across the bottom border of the area.
**/
function fillBottomBorder(paper, area, imgElement) {
  //bug in how Firefox fills: only repeat works. Nothing else!
  let pattern = paper.createPattern(imgElement, "repeat");
  paper.fillStyle = pattern;
  paper.fillRect(
    area.x,
    5 * TILE_HEIGHT,
    area.width,
    TILE_HEIGHT
  );
}


function setGoNext() {
  let c = getCanvasElement();
  if (!!c) {
    c.addEventListener("click", (evt) => {
      getWindow().location.href = "/enter";
    });
    c.style.cursor = "pointer";
  }
}

getWindow().addEventListener('load',function(){
  let paper = getPaper();
  if (!!paper) {
    let area = getDrawingArea(getViewportSize());
    loadSandstoneBrickThen(
      (sandstoneBrick) => {
        fillWall(paper, area, sandstoneBrick);
        loadRedbrickThen(
          (redbrick) => {
            fillBottomBorder(paper, area, redbrick);
            playSounds(loadSounds());
            setTimeout(
                () => {
                   drawDoor(paper, area);
                   setGoNext();
                },
                5000
            );
          }
        );
      }
    );
  }
});



