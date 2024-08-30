import { FaArrowsAlt, FaPencilAlt } from 'react-icons/fa'
import { STATE_ENUM } from './drawingUtils'

export const Toolbar = ({ setToolState, toolState }) => {
  return (
    <div className="icon-button-bar">
      <button
        onClick={() => setToolState(STATE_ENUM.move)}
        title="Move Shapes"
        style={{
          width: '60px',
          height: '60px',
          backgroundColor:
            toolState === STATE_ENUM.move ? '#ccc' : 'transparent',
          border:
            toolState === STATE_ENUM.move ? '1px solid #000' : '1px solid #ccc',
          fontSize: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FaArrowsAlt />
      </button>
      <button
        onClick={() => setToolState(STATE_ENUM.draw)}
        title="Draw Shapes"
        style={{
          width: '60px',
          height: '60px',
          backgroundColor:
            toolState === STATE_ENUM.draw ? '#ccc' : 'transparent',
          border:
            toolState === STATE_ENUM.draw ? '1px solid #000' : '1px solid #ccc',
          fontSize: '24px', // Adjust icon size
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FaPencilAlt />
      </button>
    </div>
  )
}
