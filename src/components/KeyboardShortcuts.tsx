import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCommand } from 'react-icons/fi'
import './KeyboardShortcuts.css'

const KeyboardShortcuts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Open global search' },
    { keys: ['Ctrl', 'N'], description: 'Create new order' },
    { keys: ['Ctrl', 'D'], description: 'Go to dashboard' },
    { keys: ['Ctrl', '?'], description: 'Show keyboard shortcuts' },
    { keys: ['Esc'], description: 'Close modal/dialog' },
  ]

  return (
    <>
      <button
        className="shortcuts-trigger tooltip"
        data-tooltip="Keyboard Shortcuts (Ctrl + ?)"
        onClick={() => setIsOpen(true)}
      >
        <FiCommand />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="shortcuts-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="shortcuts-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>⌨️ Keyboard Shortcuts</h3>
              <div className="shortcuts-list">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="shortcut-item">
                    <div className="shortcut-keys">
                      {shortcut.keys.map((key, i) => (
                        <React.Fragment key={i}>
                          <kbd>{key}</kbd>
                          {i < shortcut.keys.length - 1 && <span>+</span>}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="shortcut-description">{shortcut.description}</div>
                  </div>
                ))}
              </div>
              <button className="shortcuts-close" onClick={() => setIsOpen(false)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default KeyboardShortcuts

