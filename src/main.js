import "./style.css";

const draggableElement = document.querySelector(".draggable");
const dropZones = document.querySelectorAll(".dropzone");
draggableElement.addEventListener("mousedown", handleMouseDown);
const handleMouseDown = (e) => {
  const mouseStartPosition = { x: e.clientX, y: e.clientY };
  // get initial position of draggable
  const { left: elementStartX, top: elementStartY } =
    draggableElement.getBoundingClientRect();
  const originalStyles = {
    position: draggableElement.style.position,
    zIndex: draggableElement.style.zIndex,
    width: draggableElement.style.width,
    height: draggableElement.style.height,
  };
  // change to absolute to make it draggable and z-index to move it to the top
  draggableElement.style.position = "absolute";
  draggableElement.style.zIndex = 1000;
  let activeDropZone = null;

  const handleMouseMove = (e) => {
    // calculate how much the mouse has moved and add it
    // to the draggable's initial position
    const deltaX = e.clientX - mouseStartPosition.x;
    const deltaY = e.clientY - mouseStartPosition.y;
    draggableElement.style.left = `${elementStartX + deltaX}px`;
    draggableElement.style.top = `${elementStartY + deltaY}px`;

    // we need to get the new positions of the draggable element
    const draggableRect = draggableElement.getBoundingClientRect();
    dropZones.forEach((dropZone) => {
      // calculate the overlap area between the draggable and the dropzone
      // if the overlap area is greater than half of the draggable or dropzone
      // then we change the draggable size
      const dropZoneRect = dropZone.getBoundingClientRect();
      const overlapArea = getOverlapArea(draggableRect, dropZoneRect);
      if (
        overlapArea > draggableRect.width * draggableRect.height * 0.5 ||
        overlapArea > dropZoneRect.width * dropZoneRect.height * 0.5
      ) {
        draggableElement.style.height = `${dropZoneRect.height}px`;
        draggableElement.style.width = `${dropZoneRect.width}px`;
        activeDropZone = dropZone;
      }
    });
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    // reset the position and z-index
    draggableElement.style.position = originalStyles.position;
    draggableElement.style.zIndex = originalStyles.zIndex;
    // if dropZone is found, append the draggable to the dropZone,
    // otherwise, reset the position
    if (activeDropZone) {
      const { left, top } = activeDropZone.getBoundingClientRect();
      draggableElement.style.left = `${left}px`;
      draggableElement.style.top = `${top}px`;
      activeDropZone.appendChild(draggableElement);
    } else {
      draggableElement.style.left = `${elementStartX}px`;
      draggableElement.style.top = `${elementStartY}px`;
      draggableElement.style.width = originalStyles.width;
      draggableElement.style.height = originalStyles.height;
    }
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

function getOverlapArea(rect1, rect2) {
  const xOverlap = Math.max(
    0,
    Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left),
  );
  const yOverlap = Math.max(
    0,
    Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top),
  );
  return xOverlap * yOverlap;
}
