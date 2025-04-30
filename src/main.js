import "./style.css";

const draggableElement = document.querySelector(".draggable");
const dropZones = document.querySelectorAll(".dropzone");
const animationState = {
  frameId: null,
  isAnimating: false,
};
draggableElement.addEventListener("mousedown", handleMouseDown);

function handleMouseDown(e) {
  e.preventDefault();
  if (animationState.frameId) {
    cancelAnimationFrame(animationState.frameId);
    animationState.isAnimating = false;
    animationState.frameId = null;
  }
  let initialRect = draggableElement.getBoundingClientRect();
  // offset between mouse and current position (top left corner) of draggable element
  let offsetX = e.pageX - (initialRect.left + window.scrollX);
  let offsetY = e.pageY - (initialRect.top + window.scrollY);
  const originalPosition = draggableElement.style.position;
  const originalZIndex = draggableElement.style.zIndex;
  draggableElement.style.position = "absolute";
  draggableElement.style.zIndex = 1000;
  let activeDropZone = draggableElement.closest(".dropzone");
  let isResizeAnimating = false;

  function handleMouseMove(e) {
    e.preventDefault();
    if (!isResizeAnimating) {
      // calculate how much the mouse has moved and add it
      // to the draggable's initial position
      const newLeft = e.pageX - offsetX;
      const newTop = e.pageY - offsetY;
      draggableElement.style.left = `${newLeft}px`;
      draggableElement.style.top = `${newTop}px`;
    }
    dropZones.forEach((dropZone) => {
      const dropZoneRect = dropZone.getBoundingClientRect();
      const isMouseHoveringDropZone = checkIfMouseIsHoveringElement(
        { x: e.clientX, y: e.clientY },
        dropZoneRect,
      );

      if (
        isMouseHoveringDropZone &&
        activeDropZone !== dropZone &&
        !isResizeAnimating
      ) {
        isResizeAnimating = true;
        const targetWidth = dropZoneRect.width;
        const targetHeight = dropZoneRect.height;
        const draggableRect = draggableElement.getBoundingClientRect();
        const relativeX =
          (e.clientX - draggableRect.left) / draggableRect.width;
        const relativeY =
          (e.clientY - draggableRect.top) / draggableRect.height;
        const targetLeft = e.pageX - relativeX * targetWidth;
        const targetTop = e.pageY - relativeY * targetHeight;
        animateTo(
          draggableElement,
          {
            width: targetWidth,
            height: targetHeight,
            left: targetLeft,
            top: targetTop,
          },
          100,
          () => {
            offsetX = e.pageX - targetLeft;
            offsetY = e.pageY - targetTop;
            activeDropZone = dropZone;
            isResizeAnimating = false;
          },
        );
      }
    });
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    if (isResizeAnimating && animationState.frameId) {
      cancelAnimationFrame(animationState.frameId);
      animationState.isAnimating = false;
      animationState.frameId = null;
      isResizeAnimating = false;
    }
    const finalRect = activeDropZone.getBoundingClientRect();
    animateTo(
      draggableElement,
      {
        left: finalRect.left + window.scrollX,
        top: finalRect.top + window.scrollY,
        width: finalRect.width,
        height: finalRect.height,
      },
      200,
      () => {
        draggableElement.style.position = originalPosition;
        draggableElement.style.zIndex = originalZIndex;
        draggableElement.style.left = "";
        draggableElement.style.top = "";
        activeDropZone.appendChild(draggableElement);
      },
    );
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

function animateTo(element, targetStyles, duration, onComplete = () => {}) {
  if (animationState.frameId) {
    cancelAnimationFrame(animationState.frameId);
  }
  animationState.isAnimating = true;

  const startStyles = {};
  const styleKeys = Object.keys(targetStyles);

  styleKeys.forEach((key) => {
    const computedValue = window.getComputedStyle(element)[key];
    startStyles[key] = parseFloat(computedValue) || 0;
  });

  const startTime = performance.now();

  function step(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1); // Ensure progress doesn't exceed 1

    // Apply interpolated styles
    styleKeys.forEach((key) => {
      const start = startStyles[key];
      const end = targetStyles[key];
      const currentValue = start + (end - start) * progress; // Linear interpolation
      element.style[key] = `${currentValue}px`; // Assuming pixel values
    });

    if (progress < 1) {
      animationState.frameId = requestAnimationFrame(step);
    } else {
      // Animation finished
      // Ensure final values are set exactly
      styleKeys.forEach((key) => {
        element.style[key] = `${targetStyles[key]}px`;
      });
      animationState.frameId = null;
      animationState.isAnimating = false;
      onComplete(); // Execute callback
    }
  }
  animationState.frameId = requestAnimationFrame(step);
}
