export const STATE_ENUM = {
  draw: 'draw',
  move: 'move'
}

export const getBoundingBox = (line, padding) => {
  let minX = Math.min(...line.map((p) => p.x)) - padding
  let minY = Math.min(...line.map((p) => p.y)) - padding
  let maxX = Math.max(...line.map((p) => p.x)) + padding
  let maxY = Math.max(...line.map((p) => p.y)) + padding

  return { minX, minY, maxX, maxY }
}
