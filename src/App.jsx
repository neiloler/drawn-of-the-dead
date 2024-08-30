import { useState } from 'react'
import CanvasDraw from './CanvasDraw'
import { Toolbar } from './Toolbar'

function App() {
  const [toolState, setToolState] = useState(STATE_ENUM.draw)

  return (
    <>
      {/* TODO: Add router here */}
      {/* TODO: Login / User Check Layer */}
      <h1>Drawn of the Dead 🧟</h1>
      <CanvasDraw toolState={toolState} />
      <Toolbar toolState={toolState} setToolState={setToolState} />
    </>
  )
}

export default App
