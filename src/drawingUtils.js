export const STATE_ENUM = {
  draw: 'draw',
  move: 'move',
}

export const getBoundingBox = (line, padding) => {
  let minX = Math.min(...line.map((p) => p.x)) - padding
  let minY = Math.min(...line.map((p) => p.y)) - padding
  let maxX = Math.max(...line.map((p) => p.x)) + padding
  let maxY = Math.max(...line.map((p) => p.y)) + padding

  return { minX, minY, maxX, maxY }
}

export const copyShapeToClipboard = (line) => {
  // Convert the line object to a JSON string
  const lineString = JSON.stringify(line)

  // Copy the JSON string to the clipboard
  navigator.clipboard
    .writeText(lineString)
    .then(() => {
      console.log('Shape copied to clipboard')
    })
    .catch((err) => {
      console.error('Failed to copy shape to clipboard', err)
    })
}

export const pasteShapeFromClipboard = async () => {
  try {
    // Read the text from the clipboard
    const lineString = await navigator.clipboard.readText()

    // Parse the JSON string back into an object
    const line = JSON.parse(lineString)

    // Return the line object
    console.log('Shape pasted from clipboard:', line)
    return line
  } catch (err) {
    console.error('Failed to paste shape from clipboard', err)
    return null
  }
}
