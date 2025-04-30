// import "./style.css";
//
// const draggableElement = document.querySelector(".draggable");
// const dropZones = document.querySelectorAll(".dropzone");
// draggableElement.addEventListener("mousedown", handleMouseDown);
//
// function handleMouseDown(e) {
//   e.preventDefault();
//   const originalStyles = {
//     position: draggableElement.style.position,
//     zIndex: draggableElement.style.zIndex,
//   };
//   // Calculate mouse offset within the element
//   const initialRect = draggableElement.getBoundingClientRect();
//   let offsetX = e.pageX - (initialRect.left + window.scrollX);
//   let offsetY = e.pageY - (initialRect.top + window.scrollY);
//   let startX = e.pageX;
//   let startY = e.pageY;
//
//   draggableElement.style.position = "absolute";
//   draggableElement.style.zIndex = 1000;
//   let activeDropZone = draggableElement.closest(".dropzone");
//
//   function handleMouseMove(e) {
//     e.preventDefault();
//
//     // Calculate new desired top-left position using page coordinates
//     // pageX/Y are relative to the document, accounting for scroll
//     const newLeft = e.pageX - startX + initialRect.left + window.scrollX;
//     const newTop = e.pageY - startY + initialRect.top + window.scrollY;
//
//     draggableElement.style.left = `${newLeft}px`;
//     draggableElement.style.top = `${newTop}px`;
//
//     dropZones.forEach((dropZone) => {
//       const dropZoneRect = dropZone.getBoundingClientRect();
//       const isMouseHoveringDropZone = checkIfMouseIsHoveringElement(
//         { x: e.clientX, y: e.clientY },
//         dropZoneRect,
//       );
//
//       if (isMouseHoveringDropZone && activeDropZone !== dropZone) {
//         // Calculate relative mouse position within the element bounds
//         // and adjust the position of draggable to maintain relative mouse position
//         const currentDraggableRect = draggableElement.getBoundingClientRect();
//         const relativeX =
//           (e.clientX - currentDraggableRect.left) / currentDraggableRect.width;
//         const relativeY =
//           (e.clientY - currentDraggableRect.top) / currentDraggableRect.height;
//         const newLeft = e.pageX - relativeX * dropZoneRect.width;
//         const newTop = e.pageY - relativeY * dropZoneRect.height;
//
//         draggableElement.style.width = `${dropZoneRect.width}px`;
//         draggableElement.style.height = `${dropZoneRect.height}px`;
//         draggableElement.style.left = `${newLeft}px`;
//         draggableElement.style.top = `${newTop}px`;
//
//         // Update the offset based on the new size and position
//         offsetX = e.pageX - newLeft;
//         offsetY = e.pageY - newTop;
//         activeDropZone = dropZone;
//       }
//     });
//   }
//
//   function handleMouseUp() {
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);
//     const dropZoneRect = activeDropZone.getBoundingClientRect();
//     // Calculate final position relative to the document
//     const finalLeft = dropZoneRect.left + window.scrollX;
//     const finalTop = dropZoneRect.top + window.scrollY;
//
//     draggableElement.style.left = `${finalLeft}px`;
//     draggableElement.style.top = `${finalTop}px`;
//     draggableElement.style.position = originalStyles.position;
//     draggableElement.style.zIndex = originalStyles.zIndex;
//     activeDropZone.appendChild(draggableElement);
//   }
//   document.addEventListener("mousemove", handleMouseMove);
//   document.addEventListener("mouseup", handleMouseUp);
// }
//
// function checkIfMouseIsHoveringElement({ x, y }, elementRect) {
//   return (
//     x >= elementRect.left &&
//     x <= elementRect.right &&
//     y >= elementRect.top &&
//     y <= elementRect.bottom
//   );
// }
//
//
//
import "./style.css";

const draggableElement = document.querySelector(".draggable");
const dropZones = document.querySelectorAll(".dropzone");
draggableElement.addEventListener("mousedown", handleMouseDown);

function handleMouseDown(e) {
  e.preventDefault();
  const mouse = {
    previousX: e.pageX,
    previousY: e.pageY,
    currentX: e.pageX,
    currentY: e.pageY,
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
    mouse.currentX = e.pageX;
    mouse.currentY = e.pageY;
    // calculate relative mouse position within the draggable element
    const draggableRect = draggableElement.getBoundingClientRect();

    // calculate how much the mouse has moved and add it
    // to the draggable's initial position
    const deltaX = mouse.currentX - mouse.previousX;
    const deltaY = mouse.currentY - mouse.previousY;
    const newLeft = draggableRect.left + window.scrollX + deltaX;
    const newTop = draggableRect.top + window.scrollY + deltaY;
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
        const relativeX =
          (e.clientX - draggableRect.left) / draggableRect.width;
        const relativeY =
          (e.clientY - draggableRect.top) / draggableRect.height;
        const newLeft = e.pageX - relativeX * dropZoneRect.width;
        const newTop = e.pageY - relativeY * dropZoneRect.height;
        draggableElement.style.height = `${dropZoneRect.height}px`;
        draggableElement.style.width = `${dropZoneRect.width}px`;
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
    draggableElement.style.left = `${left + window.scrollX}px`;
    draggableElement.style.top = `${top + window.scrollY}px`;
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
