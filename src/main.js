import "./style.css";
const draggableElement = document.querySelector(".draggable");
const dropZones = document.querySelectorAll(".dropzone");
draggableElement.addEventListener("mousedown", handleMouseDown);

function handleMouseDown(e) {
  e.preventDefault();
  let initialRect = draggableElement.getBoundingClientRect();
  // offset between mouse and top left corner of draggable element
  let offsetX = e.pageX - (initialRect.left + window.scrollX);
  let offsetY = e.pageY - (initialRect.top + window.scrollY);
  const originalPosition = draggableElement.style.position;
  const originalZIndex = draggableElement.style.zIndex;
  draggableElement.style.position = "absolute";
  draggableElement.style.zIndex = 1000;
  let activeDropZone = draggableElement.closest(".dropzone");

  function handleMouseMove(e) {
    e.preventDefault();
    // calculate how much the mouse has moved and add it
    // to the draggable's initial position
    const newLeft = e.pageX - offsetX;
    const newTop = e.pageY - offsetY;
    draggableElement.style.left = `${newLeft}px`;
    draggableElement.style.top = `${newTop}px`;
    dropZones.forEach((dropZone) => {
      const dropZoneRect = dropZone.getBoundingClientRect();
      const isMouseHoveringDropZone = checkIfMouseIsHoveringElement(
        { x: e.clientX, y: e.clientY },
        dropZoneRect,
      );
      if (isMouseHoveringDropZone && activeDropZone !== dropZone) {
        // Adjust position to maintain relative mouse position
        const draggableRect = draggableElement.getBoundingClientRect();
        const relativeX =
          (e.clientX - draggableRect.left) / draggableRect.width;
        const relativeY =
          (e.clientY - draggableRect.top) / draggableRect.height;
        const targetLeft = e.pageX - relativeX * dropZoneRect.width;
        const targetTop = e.pageY - relativeY * dropZoneRect.height;
        draggableElement.style.height = `${dropZoneRect.height}px`;
        draggableElement.style.width = `${dropZoneRect.width}px`;
        draggableElement.style.left = `${targetLeft}px`;
        draggableElement.style.top = `${targetTop}px`;
        // recalculate offset based on new size and position
        offsetX = e.pageX - newLeft;
        offsetY = e.pageY - newTop;
        activeDropZone = dropZone;
      }
    });
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    const { left, top } = activeDropZone.getBoundingClientRect();
    draggableElement.style.left = `${left + window.scrollX}px`;
    draggableElement.style.top = `${top + window.scrollY}px`;
    draggableElement.style.position = originalPosition;
    draggableElement.style.zIndex = originalZIndex;
    activeDropZone.appendChild(draggableElement);
  }
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
}

function checkIfMouseIsHoveringElement({ x, y }, elementRect) {
  return x >= elementRect.left && x <= elementRect.right && y >= elementRect.top && y <= elementRect.bottom
}
