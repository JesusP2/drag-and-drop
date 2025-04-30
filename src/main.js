import "./style.css";

const draggableElement = document.querySelector(".draggable");
const dropZones = document.querySelectorAll(".dropzone");
draggableElement.addEventListener("mousedown", handleMouseDown);

function handleMouseDown(e) {
  e.preventDefault();
  const mouse = {
    previousX: e.clientX,
    previousY: e.clientY,
    currentX: e.clientX,
    currentY: e.clientY,
  };
  const originalStyles = {
    position: draggableElement.style.position,
    zIndex: draggableElement.style.zIndex,
  };

  draggableElement.style.position = "absolute";
  draggableElement.style.zIndex = 1000;

  let activeDropZone = draggableElement.closest(".dropzone");

  function handleMouseMove(e) {
    e.preventDefault();
    mouse.previousX = mouse.currentX;
    mouse.previousY = mouse.currentY;
    mouse.currentX = e.clientX;
    mouse.currentY = e.clientY;
    // calculate relative mouse position within the draggable element
    const draggableRect = draggableElement.getBoundingClientRect();
    const relativeX =
      (mouse.currentX - draggableRect.left) / draggableRect.width;
    const relativeY =
      (mouse.currentY - draggableRect.top) / draggableRect.height;

    // calculate how much the mouse has moved and add it
    // to the draggable's initial position
    const deltaX = mouse.currentX - mouse.previousX;
    const deltaY = mouse.currentY - mouse.previousY;
    draggableElement.style.left = `${draggableRect.left + deltaX}px`;
    draggableElement.style.top = `${draggableRect.top + deltaY}px`;

    dropZones.forEach((dropZone) => {
      const dropZoneRect = dropZone.getBoundingClientRect();
      const isMouseHoveringDropZone = checkIfMouseIsHoveringElement(
        { x: e.clientX, y: e.clientY },
        dropZoneRect,
      );
      if (isMouseHoveringDropZone && activeDropZone !== dropZone) {
        draggableElement.style.height = `${dropZoneRect.height}px`;
        draggableElement.style.width = `${dropZoneRect.width}px`;

        // Adjust position to maintain relative mouse position
        const newLeft = mouse.currentX - relativeX * dropZoneRect.width;
        const newTop = mouse.currentY - relativeY * dropZoneRect.height;
        draggableElement.style.left = `${newLeft}px`;
        draggableElement.style.top = `${newTop}px`;
        activeDropZone = dropZone;
      }
    });
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    if (!activeDropZone) return;
    const { left, top } = activeDropZone.getBoundingClientRect();
    draggableElement.style.left = `${left}px`;
    draggableElement.style.top = `${top}px`;
    draggableElement.style.position = originalStyles.position;
    draggableElement.style.zIndex = originalStyles.zIndex;
    activeDropZone.appendChild(draggableElement);
  }
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
}

function checkIfMouseIsHoveringElement({ x, y }, elementRect) {
  return (
    x >= elementRect.left &&
    x <= elementRect.right &&
    y >= elementRect.top &&
    y <= elementRect.bottom
  );
}
