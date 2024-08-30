import React, { useRef, useState, useEffect } from 'react'
import { copyShapeToClipboard, getBoundingBox, pasteShapeFromClipboard, STATE_ENUM } from './drawingUtils' // Importing the utility function

const CanvasDraw = ({ toolState }) => {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lines, setLines] = useState([]) // Stores all drawn lines
  const [currentLine, setCurrentLine] = useState([]) // Points of the line currently being drawn
  const [selectedLineIndex, setSelectedLineIndex] = useState(null) // Index of the selected line
  const [draggingLineIndex, setDraggingLineIndex] = useState(null) // Index of the line being dragged
  const [dragStartPoint, setDragStartPoint] = useState({ x: 0, y: 0 }) // Start point of the drag operation

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Set canvas properties that won’t change
    canvas.width = 800
    canvas.height = 800
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2

    // Save the context reference
    contextRef.current = ctx
  }, [])

  useEffect(() => {
    redrawCanvas() // Redraw canvas to show the highlighted line
  }, [selectedLineIndex, lines])

  useEffect(() => {
    if (toolState === STATE_ENUM.move) {
      // Clear the selection when drag mode is turned off
      setSelectedLineIndex(null)
    }
  }, [toolState])

  const drawLine = (line) => {
    if (line.length < 2) return

    const ctx = contextRef.current
    ctx.beginPath()
    ctx.moveTo(line[0].x, line[0].y)
    line.forEach((point) => {
      ctx.lineTo(point.x, point.y)
    })
    ctx.stroke()
    ctx.closePath()
  }

  const drawBoundingBox = (line) => {
    if (line.length < 2) return

    const ctx = contextRef.current
    const padding = 5 // Define padding here or pass it to getBoundingBox
    const { minX, minY, maxX, maxY } = getBoundingBox(line, padding)

    // Configure the context for drawing the bounding box
    ctx.save()
    ctx.setLineDash([5, 3]) // Set dashed line style
    ctx.strokeStyle = 'red' // Red for highlight
    ctx.lineWidth = 1 // Thinner line for highlight
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY)
    ctx.restore()
  }

  const redrawCanvas = () => {
    const ctx = contextRef.current
    const canvas = canvasRef.current

    // Clear the canvas before redrawing everything
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Redraw all lines first
    lines.forEach((line) => {
      drawLine(line)
    })

    // Highlight the selected line if one is selected and drag mode is active
    if (selectedLineIndex !== null) {
      drawBoundingBox(lines[selectedLineIndex])
    }
  }

  const startDrawingOrDragging = (e) => {
    const point = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }

    if (toolState === STATE_ENUM.move) {
      // Check if the click is inside any line's bounding box
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const padding = 0 // No padding required for detecting clicks
        const { minX, minY, maxX, maxY } = getBoundingBox(line, padding)

        if (
          point.x >= minX &&
          point.x <= maxX &&
          point.y >= minY &&
          point.y <= maxY
        ) {
          // Start dragging this line
          setDraggingLineIndex(i)
          setDragStartPoint(point) // Record the start point of the drag
          setSelectedLineIndex(i) // Set this line as selected
          return
        }
      }
    } else {
      // Start drawing a new line
      setIsDrawing(true)
      setCurrentLine([point])
    }
  }

  const dragOrDraw = (e) => {
    const point = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }

    if (toolState === STATE_ENUM.move && draggingLineIndex !== null) {
      // Calculate the difference between the current and starting positions
      const deltaX = point.x - dragStartPoint.x
      const deltaY = point.y - dragStartPoint.y

      // Update the actual line position directly in the lines array
      setLines((prevLines) =>
        prevLines.map((line, index) => {
          if (index === draggingLineIndex) {
            return line.map((p) => ({ x: p.x + deltaX, y: p.y + deltaY }))
          }
          return line
        })
      )

      // Update the start point to the current point for smooth dragging
      setDragStartPoint(point)

      redrawCanvas() // Redraw the canvas with the updated line position

      // Draw the bounding box around the line being dragged
      drawBoundingBox(lines[draggingLineIndex])
    } else if (isDrawing) {
      setCurrentLine((prevLine) => [...prevLine, point])
      redrawCanvas()
      drawLine([...currentLine, point])
    }
  }

  const stopDrawingOrDragging = () => {
    if (toolState === STATE_ENUM.move && draggingLineIndex !== null) {
      // Finalize the drag and reset dragging state
      setDraggingLineIndex(null)
    } else if (isDrawing) {
      // Stop drawing and save the line
      setIsDrawing(false)
      setLines((prevLines) => [...prevLines, currentLine])
      setCurrentLine([])
    }
  }

  const handleLineSelection = (e) => {
    const index = parseInt(e.target.value, 10)
    setSelectedLineIndex(index) // Update the selected line index
  }

  return (
    <div className="canvas-draw-container">
      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid black',
          cursor: toolState === STATE_ENUM.move ? 'move' : 'crosshair',
        }}
        onMouseDown={startDrawingOrDragging}
        onMouseMove={dragOrDraw}
        onMouseUp={stopDrawingOrDragging}
        onMouseLeave={stopDrawingOrDragging}
      />
      <div className="controls">
        <button onClick={() => copyShapeToClipboard(lines[selectedLineIndex])}>
          Copy Shape
        </button>
        <button
          onClick={async () => {
            const pastedLine = await pasteShapeFromClipboard()
            if (pastedLine) {
              setLines((prevLines) => [...prevLines, pastedLine])
            }
          }}
        >
          Paste Shape
        </button>
        <select
          onChange={handleLineSelection}
          value={selectedLineIndex !== null ? selectedLineIndex : ''}
        >
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
  )
}

export default CanvasDraw
