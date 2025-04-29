import "./style.css";

const draggable = document.querySelector(".draggable");
const handleMouseDown = (e) => {
  const startX = e.clientX;
  const startY = e.clientY;
  const { left, top } = draggable.getBoundingClientRect();
  const position = draggable.style.position;
  draggable.style.position = "absolute";
  draggable.style.zIndex = 1000;

  const handleMouseMove = (e) => {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    draggable.style.left = `${deltaX + left}px`;
    draggable.style.top = `${deltaY + top}px`;
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    draggable.style.position = position;
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};
draggable.addEventListener("mousedown", handleMouseDown);
