// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test } from 'vitest'
import App from './App'

afterEach(cleanup)

test('renders the starter and initial checklist progress', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /Small app\.\s*Big possibilities\./ })).toBeDefined()
  expect(screen.getAllByRole('checkbox')).toHaveLength(4)
  expect(screen.getByRole('heading', { name: 'A clear path to GHCR' })).toBeDefined()
  expect(screen.getByRole('status').textContent).toBe('1 of 4 complete')
})

test('updates progress when checklist tasks are checked and unchecked', async () => {
  const user = userEvent.setup()
  render(<App />)
  const task = screen.getByRole('checkbox', { name: 'Review the GitHub Actions workflow' })
  await user.click(task)
  expect(screen.getByRole('status').textContent).toBe('2 of 4 complete')
  expect(screen.getByRole('progressbar').getAttribute('value')).toBe('2')
  await user.click(task)
  expect(screen.getByRole('status').textContent).toBe('1 of 4 complete')
})
