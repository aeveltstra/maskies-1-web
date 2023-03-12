/**
 * Night One for Maskie's Ice Cream Parlor, the horror adventure game.
 * The night in which the player observes a security guard getting killed.
 * Purpose: scaring the player.
 * Author: A.E.Veltstra, for Treasure Trove Studio.
 * Version: 2.21.925.2300
**/

function drawHallwayLines(paper, area, sandstoneImg, redbrickImg) {
  paper.strokeStyle = "gold";
  let left_wall = {
    x:      TILE_WIDTH,
    y:      area.y - TILE_HEIGHT,
    width:  3*TILE_WIDTH,
    height: 8*TILE_HEIGHT
  };
  paper.fillStyle = paper.createPattern(sandstoneImg, "repeat");
  paper.beginPath();
  paper.moveTo(
    left_wall.x,
    left_wall.y
  );
  paper.lineTo(
    left_wall.width,
    left_wall.y + 2*TILE_HEIGHT
  );
  paper.lineTo(
    left_wall.width,
    left_wall.y + 6*TILE_HEIGHT
  );
  paper.lineTo(
    left_wall.x,
    left_wall.y + left_wall.height
  );
  paper.closePath();
  paper.fill();
  paper.fillStyle = paper.createPattern(redbrickImg, "repeat");
  paper.beginPath();
  paper.moveTo(
    left_wall.x,
    left_wall.y + 6*TILE_HEIGHT
  );
  paper.lineTo(
    left_wall.width,
    left_wall.y + 5*TILE_HEIGHT
  );
  paper.lineTo(
    left_wall.width,
    left_wall.y + 6*TILE_HEIGHT
  );
  paper.lineTo(
    left_wall.x,
    left_wall.y + left_wall.height
  )
  paper.closePath();
  paper.fill();
}


getWindow().addEventListener('load',function(){
  let paper = getPaper();
  if (!!paper) {
    let area = getDrawingArea(getViewportSize());
    loadSandstoneBrickThen(
      (sandstoneBrick) => {
        loadRedbrickThen(
          (redbrick) => {
            playSounds(loadSounds());
            drawHallwayLines(paper, area, sandstoneBrick, redbrick);
            /*
            setTimeout(
                () => {
                   drawDoor(paper, area);
                   setGoNext();
                },
                5000
            );
            */
          }
        );
      }
    );
  }
});



