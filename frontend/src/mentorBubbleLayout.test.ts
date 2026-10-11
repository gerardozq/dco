import { expect, test } from 'vitest'
import { layoutMentorBubbles } from './mentorBubbleLayout'

const mentors = Array.from({ length: 50 }, (_, index) => ({
  id: `mentor-${index}`,
  fit: 42 + index % 58,
}))

test.each([220, 260, 390, 700, 900])('packs all bubbles without overlap at width %i', (width) => {
  const { positions, height } = layoutMentorBubbles(mentors, width)
  expect(positions).toHaveLength(mentors.length)
  for (const bubble of positions) {
    expect(bubble.diameter).toBeGreaterThanOrEqual(48)
    expect(bubble.x).toBeGreaterThanOrEqual(-.001)
    expect(bubble.x + bubble.diameter).toBeLessThanOrEqual(width + .001)
    expect(bubble.y).toBeGreaterThanOrEqual(-.001)
    expect(bubble.y + bubble.diameter).toBeLessThanOrEqual(height + .001)
    for (const other of positions) {
      if (bubble.id === other.id) continue
      const distance = Math.hypot(
        bubble.x + bubble.diameter / 2 - other.x - other.diameter / 2,
        bubble.y + bubble.diameter / 2 - other.y - other.diameter / 2,
      )
      expect(distance).toBeGreaterThanOrEqual((bubble.diameter + other.diameter) / 2 + 12 - .001)
      if (bubble.fit > other.fit) expect(bubble.diameter).toBeGreaterThan(other.diameter)
    }
  }
  expect(new Set(positions.map((bubble) => Math.round(bubble.y))).size).toBeGreaterThan(15)
})

test('keeps placement stable regardless of score-sorted input order', () => {
  expect(layoutMentorBubbles(mentors, 700)).toEqual(layoutMentorBubbles([...mentors].reverse(), 700))
})

test('handles empty and single-mentor filters', () => {
  expect(layoutMentorBubbles([], 260)).toEqual({ positions: [], height: 0 })
  const { positions, height } = layoutMentorBubbles([mentors[0]], 260)
  expect(positions).toHaveLength(1)
  expect(positions[0].y).toBe(0)
  expect(height).toBe(positions[0].diameter)
})

test('grows a rounded 25-mentor cloud instead of a flat top row', () => {
  const { positions } = layoutMentorBubbles(mentors.slice(0, 25), 700)
  expect(positions.filter((bubble) => bubble.y < 2).length).toBeLessThanOrEqual(2)
  expect(new Set(positions.map((bubble) => Math.round(bubble.y))).size).toBeGreaterThan(20)
  const first = positions[0]
  expect(positions.some((bubble) => bubble.y + bubble.diameter < first.y + first.diameter / 2)).toBe(true)
  expect(positions.some((bubble) => bubble.y > first.y + first.diameter / 2)).toBe(true)
})

test('makes small fit-score differences visually distinct without changing equal-score sizes', () => {
  const { positions } = layoutMentorBubbles([
    { id: 'lower', fit: 58 },
    { id: 'middle', fit: 60 },
    { id: 'equal-middle', fit: 60 },
    { id: 'higher', fit: 62 },
  ], 700)
  const size = (id: string) => positions.find((bubble) => bubble.id === id)!.diameter
  expect(size('higher') / size('lower')).toBeGreaterThanOrEqual(1.5)
  expect(size('higher') / size('lower')).toBeLessThan(1.6)
  expect(size('middle')).toBeGreaterThan(size('lower'))
  expect(size('middle')).toBeLessThan(size('higher'))
  expect(size('middle')).toBe(size('equal-middle'))
  const equal = layoutMentorBubbles([{ id: 'a', fit: 60 }, { id: 'b', fit: 60 }], 700)
  expect(equal.positions[0].diameter).toBe(equal.positions[1].diameter)
})
