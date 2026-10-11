import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { layoutMentorBubbles, type BubbleFit } from './mentorBubbleLayout'

type BubbleMentor = BubbleFit & { name: string; tone: number }
type BubbleStyle = CSSProperties & { '--bubble-initial-size': string; '--bubble-name-size': string }

export function MentorBubbles({ mentors, onSelect }: {
  mentors: BubbleMentor[]
  onSelect: (id: string) => void
}) {
  const container = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(260)
  useEffect(() => {
    const element = container.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWidth(entry.contentRect.width)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  const layout = layoutMentorBubbles(mentors, width)
  const positions = new Map(layout.positions.map((position) => [position.id, position]))

  return (
    <div className="mentor-bubbles" aria-label="Suggested mentors">
      <div className="mentor-bubble-cloud" ref={container} style={{ height: layout.height }}>
        {mentors.map((mentor) => {
          const position = positions.get(mentor.id)!
          const style: BubbleStyle = {
            left: position.x,
            top: position.y,
            width: position.diameter,
            height: position.diameter,
            '--bubble-initial-size': `${Math.max(16, position.diameter * .28)}px`,
            '--bubble-name-size': `${Math.max(10, position.diameter * .105)}px`,
          }
          return (
            <button
              aria-label={`${mentor.name}, ${mentor.fit}% demo fit`}
              className={`mentor-bubble tone-${mentor.tone}`}
              key={mentor.id}
              onClick={() => onSelect(mentor.id)}
              style={style}
              type="button"
            >
              <span className="bubble-content">
                <span className="bubble-initials">
                  {mentor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                </span>
                <span className="bubble-name">{mentor.name.split(' ')[0]}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
