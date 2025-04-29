import "./style.css";

const draggableElement = document.querySelector(".draggable");
const dropZones = document.querySelectorAll(".dropzone");
draggableElement.addEventListener("mousedown", handleMouseDown);
function handleMouseDown(e) {
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
  let activeDropZone = draggableElement.closest(".dropzone");

  const handleMouseMove = (e) => {
    // calculate how much the mouse has moved and add it
    // to the draggable's initial position
    const deltaX = e.clientX - mouseStartPosition.x;
    const deltaY = e.clientY - mouseStartPosition.y;
    draggableElement.style.left = `${elementStartX + deltaX}px`;
    draggableElement.style.top = `${elementStartY + deltaY}px`;

    dropZones.forEach((dropZone) => {
      const dropZoneRect = dropZone.getBoundingClientRect();
      if (isMouseHoveringElement({ x: e.clientX, y: e.clientY }, dropZone)) {
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
}

function isMouseHoveringElement({ x, y }, element) {
  const rect = element.getBoundingClientRect();
  return (
    x >= rect.left &&
    x <= rect.right &&
    y >= rect.top &&
    y <= rect.bottom
  );
}
