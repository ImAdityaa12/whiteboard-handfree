"use client";
import { useDraw } from "@/utils/useDraw";
import { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { io } from "socket.io-client";
import { drawLine } from "../utils/drawLine";
type DrawLineProps = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
};
const socket = io("http://localhost:3001");
export default function Home() {
  const [color, setColor] = useState<string>("#000");
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit("draw-line", { prevPoint, currentPoint, color });
    drawLine({ prevPoint, currentPoint, ctx, color });
  }
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      console.log("sending canvas state");
      socket.emit("canvas-state", canvasRef.current.toDataURL());
    });

    socket.on("canvas-state-from-server", (state: string) => {
      console.log("I received the state");
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on(
      "draw-line",
      ({ prevPoint, currentPoint, color }: DrawLineProps) => {
        if (!ctx) return console.log("no ctx here");
        drawLine({ prevPoint, currentPoint, ctx, color });
      }
    );

    socket.on("clear", clear);

    return () => {
      socket.off("draw-line");
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("clear");
    };
  }, [canvasRef]);
  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center">
      <div className="flex flex-col gap-2">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button
          onClick={() => socket.emit("clear")}
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
