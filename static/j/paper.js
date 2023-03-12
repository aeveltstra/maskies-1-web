/**
 * Main Canvas Library for Maskie's Ice Cream Parlor, the horror adventure game.
 * Purpose: support drawing pictures on an HTMLCanvasElement, and react to user actions.
 * Author: A.E.Veltstra, for Treasure Trove Studio.
 * Version: 2.21.925.1815
**/

const DOM_LACKS_GEBI = "DOM lacks the method 'getElementById'.";
const PAPER_NOT_FOUND = "No such HTMLCanvasElement: 'paper'.";
const CANVAS_LACKS_2D_CONTEXT = "Odd. Your browser does not seem to support the HTMLCanvasElement or its 2D context. I fear you won't be able to play the graphical version of the game. Lucky for you, a text version exists!";
const TILE_HEIGHT = 128;
const DOC_LACKS_DIALOG = "Your HTMLDocument doesn't have a form identified as 'dialog'.";
const DOC_LACKS_DIALOG_TITLE = "Your HTMLDocument doesn't have an element identified as 'dialogTitle'.";
const DOC_LACKS_DOCELM = "Your HTMLDocument doesn't have a DocumentElement.";
const TILE_WIDTH = 128;
const TOP_LEFT = 'top_left';
const BOTTOM_RIGHT = 'bottom_right';

function logError(msg) {
  console.log("Error: " + msg);
}

function getWindow() {
  return window;
}

function getDocument(w) {
  if (!!w) {
    return w.document;
  } 
  return undefined;
}

function getCanvasElement() {
  let c = undefined;
  let d = getDocument(getWindow());
  if (!!d) {
    if (d.getElementById) {
      c = d.getElementById('paper');
    } else {
      logError(DOM_LACKS_GEBI);
    }
  }
  return c;
} 

function getPaper() {
  let p = undefined;
  let c = getCanvasElement();
  if (!c) {
    logError(PAPER_NOT_FOUND);
  } else {
    p = c.getContext("2d");
    if (!p) {
      logError(CANVAS_LACKS_2D_CONTEXT);
    }
  }
  return p;
} 

function getViewportSize() {
  return { x: 0, y: 0, width: 10*TILE_WIDTH, height: 6*TILE_HEIGHT };
}

function smaller(area, amount) {
  let {x, y, width, height}  = area;
  return {
    x: x + amount,
    y: y + amount,
    width: width - (2*amount),
    height: height - (2*amount)
  }
}

function getDrawingArea(viewport) {
  return smaller(viewport, 0);
}

function getPaddedArea() {
  let area = getDrawingArea(getViewportSize());
  let padding = 10;
  return smaller(area, padding);
}

function getCenter(area) {
  return {
    x: Math.floor((area.width + area.x) / 2),
    y: Math.floor((area.height + area.y) / 2)
  }
}

function drawPaperBorder() {
  let paper = getPaper();

  if (!!paper) { 
    paper.beginPath();
    paper.fillStyle = "gold";
    let viewport = getViewportSize();
    paper.fillRect(viewport.x, viewport.y, viewport.width, viewport.height);
    paper.fillStyle = "black";
    let area = smaller(viewport, 1);
    paper.fillRect(area.x, area.y, area.width, area.height);    
  }
}

/**
 * Loads the image source and then executes the passed-in function,
 * applying the image as the function argument.
 * Use this if you must wait for the image to load prior to 
 * continuing with some other action.
**/
function loadImageThen(imgSrc, f) {
  let img = new Image();
  img.src = imgSrc;
  //Need to wait until the image is loaded before continuing.
  //Need to wrap sub function in function wrapper
  //to make it possible to pass in the img element.
  img.onload = () => { f(img); };
}


/**
 * Take a triplet of color values (0 - 127) and 
 * return a CSS rgb() function string with those
 * colors passed as parameters.
**/
function toRgbFunction(rgb) {
  let {r, g, b} = rgb;
  return `rgb(${r}, ${g}, ${b})`;
}

function lighter(rgb, amount){
  let {r, g, b} = rgb;
  let r2 = Math.min(255, r + amount);
  let g2 = Math.min(255, g + amount);
  let b2 = Math.min(255, b + amount);
  return {r: r2, g: g2, b: b2};
}

function darker(rgb, amount){
  let {r, g, b} = rgb;
  let r2 = Math.max(0, r - amount);
  let g2 = Math.max(0, g - amount);
  let b2 = Math.max(0, b - amount);
  return {r: r2, g: g2, b: b2};
}

/**
 * Take a triplet of color values (0 - 127) and caclate
 * 4 other colors: top, right, bottom, left. Each of 
 * those colors differs from the input based on the light
 * direction.
 * Returns a quad of color values, each of which can be 
 * assigned to canvas style attributes.
**/
function calculateBezelColors(rgb, lightDirection) {
  let {r,g,b} = rgb;
  let top = "";
  let right = "";
  let bottom = "";
  let left = "";
  switch (lightDirection) {
    case TOP_LEFT: {
        top = toRgbFunction(lighter(rgb, 60));
        right = toRgbFunction(darker(rgb, 20));
        bottom = toRgbFunction(darker(rgb, 60));
        left = toRgbFunction(lighter(rgb, 20));
        break;
      }
    case BOTTOM_RIGHT: {
        top = toRgbFunction(darker(rgb, 60));
        right = toRgbFunction(lighter(rgb, 20));
        bottom = toRgbFunction(lighter(rgb, 60));
        left = toRgbFunction(darker(rgb, 20));
        break;
      }
    default: {
        r = toRgbFunction(rgb);
        top = r;
        right = r;
        bottom = r;
        left = r;
      }
  }
  return {
    top: top,
    right: right,
    bottom: bottom,
    left: left
  }
}

function sandstoneBrickTile() {
  return '/static/i/sandstone-wall-pattern-tile-paths.svg';
}

function redBrickTile() {
  return '/static/i/red-brick-wall-pattern-tile-paths.svg';
}

/**
 * Loads the red brick tile image,
 * and then executes the passed-in function,
 * applying the image as the function argument.
 * See loadImageThen(imgSrc, function).
**/
function loadRedbrickThen(f) {
  let tile = redBrickTile();
  loadImageThen(tile, f);
}

/**
 * Loads the sandstone brick tile image,
 * and then executes the passed-in function,
 * applying the image as the function argument.
 * See loadImageThen(imgSrc, function).
**/
function loadSandstoneBrickThen(f) {
  let tile = sandstoneBrickTile();
  loadImageThen(tile, f);
}

function getDialog() {
  let d = getDocument(getWindow());
  if (d || d.getElementById) {
    dialog = d.getElementById("dialog");
    if (dialog) {
      return dialog;
    }
    console.log(DOC_LACKS_DIALOG);
  }
  console.log(DOM_LACKS_GEBI);
  return null;
}

function getDialogTitle() {
  let d = getDocument(getWindow());
  if (d || d.getElementById) {
    title = d.getElementById("dialogTitle");
    if (title) {
      return title;
    }
    console.log(DOC_LACKS_DIALOG_TITLE);
  }
  console.log(DOM_LACKS_GEBI);
  return null;
}

function ask(title, description, doIfYes, doIfNo) {
  let p = getPaper();
  if (!!p) { 
    let area = getDrawingArea(getViewportSize());
    let dialog = getDialog();
    let width = area.width - 2*TILE_WIDTH;
    dialog.style.display = "block";
    let height = parseInt(dialog.clientHeight);
    dialog.style.display = "none";
    let dialogBorderArea = {
      x: (area.width - width) / 2,
      y: (area.height - height * 1.168),
      width: width,
      height: height
    };
    dialog.onsubmit = () => { return false };
    dialog.style.top = dialogBorderArea.y + "px";
    dialog.style.left = dialogBorderArea.x + "px";
    dialog.style.width = dialogBorderArea.width + "px";
    let dialogTitle = getDialogTitle();
    if (!!dialogTitle) {
      dialogTitle.innerText = title;
    }
    dialog.elements["dialogText"].value = description;
    let b1 = dialog.elements["dialogButton1"];
    b1.value = "No";
    b1.style.visibility = "visible";
    b1.className = "redlight";
    b1.accessKey = "n";
    b1.addEventListener("click", doIfNo);
    let b4 = dialog.elements["dialogButton4"];
    b4.value = "Yes";
    b4.style.visibility = "visible";
    b4.className = "greenlight";
    b4.accessKey = "y"
    b4.addEventListener("click", doIfYes);
    dialog.style.display = "block";
    getDocument(getWindow()).addEventListener("keydown", (evt) => {
      if (evt.key == 'Escape') {
         doIfNo();
      }
    });
  }
}

function closeDialog() {
  let dialog = getDialog();
  if (!!dialog) {
    dialog.style.display = "none";
  }
}

function getSoundSprites() {
  let d = getDocument(getWindow());
  if (d) {
    if (d.getElementById) {
      let s = d.getElementById("soundSprites");
      if (s) {
        return s;
      } else {
        console.log("No HTML audio element found named 'soundSprites'");
      }
    } else {
      console.log(DOM_LACKS_GEBI);
    }
  } else {
    console.log(DOC_LACKS_DOCELM);
  }
  return null;
}

function loadSounds() {
  let s = getSoundSprites();
  if (s) { s.load(); }
  return s;
}

function showSoundControls(which) {
  which.style.display = "block";
}

/**
 * To protect the user, browsers started refusing to autoplay
 * audio. In that case, user interaction is required. This 
 * function creates an interface for that.
 */
function askPlaySound(which) {
  ask("Autoplay is off.", 
      "Enable autoplay in your browser to skip this dialog next time. \r\n"
      + "This screen has background sound. Play it?",
      () => { which.play(); closeDialog(); },
      () => { closeDialog(); showSoundControls(which); }
  )
}

function playSounds(which) {
  if (which) { 
    let p = which.play();
    if (!!p) {
      p.then(() => {})
       .catch(err => {
         if (err.name == "NotAllowedError") {
           askPlaySound(which);
         } else {
           console.log(err);
         }
       });
    }
  }
}


getWindow().addEventListener('load', drawPaperBorder());
