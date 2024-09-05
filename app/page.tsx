"use client";
import { useDraw } from "@/utils/useDraw";
import { useState } from "react";
import { ChromePicker } from "react-color";
export default function Home() {
  const [color, setColor] = useState<string>("#000");
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine);
  const [lineActive, setLineActive] = useState(false);
  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = 5;

    const startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    if (!lineActive) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(currX, currY);
      ctx.stroke();

      ctx.fillStyle = lineColor;
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  const straightLine = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(Math.random() * 750, Math.random() * 750); // add logic for straight line (currently randomized the value)
    ctx.lineTo(Math.random() * 750, Math.random() * 750);
    ctx.stroke();
  };
  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center">
      <div className="flex flex-col gap-2">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />

        <button
          className={`bg-black text-white  px-3 py-2 rounded-lg ${
            lineActive ? "bg-green-400" : "bg-black"
          }`}
          onClick={() => {
            setLineActive(true);

            straightLine();
          }}
        >
          Draw Line
        </button>
        <button
          className={`bg-black text-white  px-3 py-2 rounded-lg ${
            !lineActive ? "bg-green-400" : "bg-black"
          }`}
          onClick={() => setLineActive(false)}
        >
          Handfree
        </button>
        <button
          onClick={clear}
          className="bg-black text-white hover:bg-gray-900 px-3 py-2 rounded-lg"
        >
          Clear
        </button>
      </div>

      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={750}
        height={750}
        className="border border-black"
      />
    </div>
  );
}
