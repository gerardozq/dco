export type BubbleFit = { id: string; fit: number }
export type BubblePosition = BubbleFit & { x: number; y: number; diameter: number }

function stableOrder(id: string) {
  return Array.from(id).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 2166136261)
}

export function layoutMentorBubbles(mentors: BubbleFit[], width: number) {
  const gap = 12
  const scale = Math.min(1, width / 420)
  const positions: BubblePosition[] = []
  const scattered = [...mentors].sort((a, b) => stableOrder(a.id) - stableOrder(b.id) || a.id.localeCompare(b.id))
  const lowestFit = Math.min(...mentors.map((mentor) => mentor.fit))
  const highestFit = Math.max(...mentors.map((mentor) => mentor.fit))

  for (const mentor of scattered) {
    const relativeFit = highestFit === lowestFit ? .5 : (mentor.fit - lowestFit) / (highestFit - lowestFit)
    const diameter = Math.min(width, 48 + (42 + relativeFit * 50) * scale)
    const radius = diameter / 2
    const centers = positions.map((placed) => ({
      x: placed.x + placed.diameter / 2,
      y: placed.y + placed.diameter / 2,
      reach: radius + placed.diameter / 2 + gap,
    }))
    const bottom = Math.max(0, ...positions.map((placed) => placed.y + placed.diameter))
    let best = { x: width / 2, y: bottom + gap + radius, cost: Infinity }
    const candidates = centers.length === 0 ? [{ x: width / 2, y: 0 }] : []

    // Grow around the center in every direction, rather than filling rows from the top.
    for (const center of centers) {
      const phase = stableOrder(mentor.id) % 32 / 32
      for (let step = 0; step < 32; step++) {
        const angle = (step + phase) * Math.PI * 2 / 32
        candidates.push({
          x: center.x + Math.cos(angle) * center.reach,
          y: center.y + Math.sin(angle) * center.reach,
        })
      }
    }
    for (let i = 0; i < centers.length; i++) {
      for (let j = 0; j < i; j++) {
        const a = centers[i]
        const b = centers[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const distance = Math.hypot(dx, dy)
        if (distance === 0 || distance > a.reach + b.reach || distance < Math.abs(a.reach - b.reach)) continue
        const along = (a.reach ** 2 - b.reach ** 2 + distance ** 2) / (2 * distance)
        const across = Math.sqrt(Math.max(0, a.reach ** 2 - along ** 2))
        for (const side of [-1, 1]) {
          candidates.push({
            x: a.x + along * dx / distance - side * across * dy / distance,
            y: a.y + along * dy / distance + side * across * dx / distance,
          })
        }
      }
    }
    for (const { x, y } of candidates) {
      if (x < radius || x > width - radius) continue
      if (centers.some((center) => Math.hypot(x - center.x, y - center.y) < center.reach - .000001)) continue
      const cost = Math.hypot(x - width / 2, y * .85)
      if (cost < best.cost) best = { x, y, cost }
    }

    positions.push({ ...mentor, diameter, x: best.x - radius, y: best.y - radius })
  }

  const top = Math.min(0, ...positions.map((bubble) => bubble.y))
  const normalized = positions.map((bubble) => ({ ...bubble, y: bubble.y - top }))
  return {
    positions: normalized,
    height: Math.max(0, ...normalized.map((bubble) => bubble.y + bubble.diameter)),
  }
}
