import { FaArrowsAlt, FaPencilAlt } from 'react-icons/fa'
import { STATE_ENUM } from './drawingUtils'

export const Toolbar = ({ setToolState, toolState }) => {
  return (
    <div className="icon-button-bar">
      <button
        onClick={() => setToolState(STATE_ENUM.move)}
        title="Move Shapes"
        style={{
          backgroundColor:
            toolState === STATE_ENUM.move ? '#ccc' : 'transparent',
          border:
            toolState === STATE_ENUM.move ? '1px solid #000' : '1px solid #ccc',
        }}
      >
        <FaArrowsAlt />
      </button>
      <button
        onClick={() => setToolState(STATE_ENUM.draw)}
        title="Draw Shapes"
        style={{
          backgroundColor:
            toolState === STATE_ENUM.draw ? '#ccc' : 'transparent',
          border:
            toolState === STATE_ENUM.draw ? '1px solid #000' : '1px solid #ccc',
        }}
      >
        <FaPencilAlt />
      </button>
    </div>
  )
}
