import React, { useRef, useState, useEffect } from 'react';

const CanvasDraw = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]); // Stores all drawn lines
  const [currentLine, setCurrentLine] = useState([]); // Points of the line currently being drawn
  const [selectedLineIndex, setSelectedLineIndex] = useState(null); // Index of the selected line

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas properties that won’t change
    canvas.width = 800;
    canvas.height = 800;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // Save the context reference
    contextRef.current = ctx;
  }, []);

  // This useEffect triggers when the selectedLineIndex changes
  useEffect(() => {
    if (selectedLineIndex !== null) {
      redrawCanvas(); // Redraw canvas to show the highlighted line
    }
  }, [selectedLineIndex]);

  const drawLine = (line) => {
    if (line.length < 2) return;

    const ctx = contextRef.current;
    ctx.beginPath();
    ctx.moveTo(line[0].x, line[0].y);
    line.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
    ctx.closePath();
  };

  const redrawCanvas = () => {
    const ctx = contextRef.current;
    const canvas = canvasRef.current;

    // Clear the canvas before redrawing everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw all lines first
    lines.forEach((line) => {
      drawLine(line);
    });

    // Highlight the selected line if one is selected
    if (selectedLineIndex !== null) {
      highlightLine(lines[selectedLineIndex]);
    }
  };

  const highlightLine = (line) => {
    if (line.length < 2) return;

    const ctx = contextRef.current;
    const padding = 5;

    // Determine the bounding box of the line
    let minX = Math.min(...line.map(p => p.x)) - padding;
    let minY = Math.min(...line.map(p => p.y)) - padding;
    let maxX = Math.max(...line.map(p => p.x)) + padding;
    let maxY = Math.max(...line.map(p => p.y)) + padding;

    // Configure the context for highlighting
    ctx.save();
    ctx.setLineDash([5, 3]); // Set dashed line style
    ctx.strokeStyle = 'red'; // Red for highlight
    ctx.lineWidth = 1; // Thinner line for highlight
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
    ctx.restore();
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const point = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    setCurrentLine([point]); // Start a new line with the first point
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const point = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    setCurrentLine((prevLine) => [...prevLine, point]);

    // Redraw everything to show the current line in progress
    redrawCanvas();
    drawLine([...currentLine, point]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    setLines((prevLines) => [...prevLines, currentLine]); // Save the completed line
    setCurrentLine([]); // Reset the current line
  };

  const handleLineSelection = (e) => {
    const index = parseInt(e.target.value, 10);
    setSelectedLineIndex(index); // Update the selected line index
  };

  return (
    <div className="canvas-draw-container">
      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid black',
          cursor: 'crosshair',
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="controls">
        <select onChange={handleLineSelection} value={selectedLineIndex !== null ? selectedLineIndex : ''}>
          <option value="" disabled>
            Select a line to highlight
          </option>
          {lines.map((_, index) => (
            <option key={index} value={index}>
              Line {index + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CanvasDraw;
