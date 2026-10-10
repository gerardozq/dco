// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test } from 'vitest'
import App from './App'

afterEach(cleanup)

async function startProfileSetup(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('textbox', { name: 'Email' }), 'catechist@example.com')
  await user.click(screen.getByRole('button', { name: 'Send me a sign-in link' }))
}

async function finishProfile(user: ReturnType<typeof userEvent.setup>) {
  await startProfileSetup(user)
  await user.type(screen.getByRole('textbox', { name: 'Full name' }), 'Gerald Lim')
  await user.click(screen.getByRole('button', { name: 'Next' }))
  await user.click(screen.getByRole('button', { name: 'Primary' }))
  await user.click(screen.getByRole('button', { name: 'Storytelling' }))
  await user.click(screen.getByRole('button', { name: 'Next' }))
  await user.click(screen.getByRole('button', { name: 'Weekend morning, not selected' }))
  await user.click(screen.getByRole('button', { name: 'Find my mentor' }))
}

async function matchWithBen(user: ReturnType<typeof userEvent.setup>) {
  await finishProfile(user)
  await user.click(screen.getByRole('button', { name: /Ben Tan, .* demo fit/ }))
  await user.click(screen.getByRole('button', { name: 'Send request' }))
  await user.click(screen.getByRole('button', { name: 'Preview sending request' }))
  await user.click(screen.getByRole('button', { name: 'Mentor accepts' }))
  await user.click(screen.getByRole('button', { name: 'Say hello' }))
}

test('renders the CateLink welcome screen', () => {
  render(<App />)

  expect(screen.getByRole('heading', { name: 'CateLink' })).toBeDefined()
  expect(screen.getByRole('textbox', { name: 'Email' })).toBeDefined()
  expect(screen.getByRole('button', { name: 'Send me a sign-in link' })).toBeDefined()
  expect(screen.getByText(/No password to remember/)).toBeDefined()
})

test('validates profile steps and keeps choices while moving back', async () => {
  const user = userEvent.setup()
  render(<App />)

  await startProfileSetup(user)
  await user.click(screen.getByRole('button', { name: 'Next' }))
  expect(screen.getByRole('alert').textContent).toMatch(/Add your full name/)

  await user.type(screen.getByRole('textbox', { name: 'Full name' }), 'Gerald Lim')
  await user.click(screen.getByRole('button', { name: 'Next' }))
  expect(screen.getByRole('heading', { name: 'How do you teach?' })).toBeDefined()

  await user.click(screen.getByRole('button', { name: 'Next' }))
  expect(screen.getByRole('alert').textContent).toMatch(/Choose at least one group/)
  await user.click(screen.getByRole('button', { name: 'Primary' }))
  await user.click(screen.getByRole('button', { name: 'Next' }))
  expect(screen.getByRole('heading', { name: 'When can you meet?' })).toBeDefined()

  await user.click(screen.getByRole('button', { name: 'Back' }))
  expect(screen.getByRole('button', { name: 'Primary' }).getAttribute('aria-pressed')).toBe('true')
})

test('limits teaching styles and requires at least one availability slot', async () => {
  const user = userEvent.setup()
  render(<App />)

  await startProfileSetup(user)
  await user.type(screen.getByRole('textbox', { name: 'Full name' }), 'Gerald Lim')
  await user.click(screen.getByRole('button', { name: 'Next' }))
  await user.click(screen.getByRole('button', { name: 'Primary' }))

  for (const style of ['Storytelling', 'Discussion-led', 'Activity-based']) {
    await user.click(screen.getByRole('button', { name: style }))
  }
  await user.click(screen.getByRole('button', { name: 'Prayer-centred' }))
  expect(screen.getByRole('alert').textContent).toMatch(/up to three/)

  await user.click(screen.getByRole('button', { name: 'Next' }))
  await user.click(screen.getByRole('button', { name: 'Find my mentor' }))
  expect(screen.getByRole('alert').textContent).toMatch(/Choose at least one time/)

  await user.click(screen.getByRole('button', { name: 'Weekend morning, not selected' }))
  await user.click(screen.getByRole('button', { name: 'Find my mentor' }))
  expect(screen.getByRole('heading', { name: 'Mentors for you' })).toBeDefined()
  expect(screen.getByText(/No real mentor accounts are connected/)).toBeDefined()
})

test('filters demo mentors, explains fit, and handles an empty result', async () => {
  const user = userEvent.setup()
  render(<App />)
  await finishProfile(user)

  expect(screen.getByRole('status').textContent).toBe('50 mentors fit you')
  await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by parish' }), 'Church of the Nativity of the Blessed Virgin Mary')
  await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by time' }), 'Weekday morning')
  expect(screen.getByRole('status').textContent).toBe('No mentor fits all filters')
  expect(screen.getByText('Try clearing a filter to see other mentors.')).toBeDefined()

  await user.click(screen.getByRole('button', { name: 'Clear filters' }))
  await user.click(screen.getByRole('button', { name: /Ben Tan, .* demo fit/ }))
  expect(screen.getByRole('dialog', { name: 'Ben Tan' })).toBeDefined()
  expect(screen.getByText('Teaches Primary like you')).toBeDefined()
  expect(within(screen.getByRole('dialog', { name: 'Ben Tan' })).getByText('Free weekend morning')).toBeDefined()
})


test('learning goals are included in mentor match explanations', async () => {
  const user = userEvent.setup()
  render(<App />)

  await startProfileSetup(user)
  await user.type(screen.getByRole('textbox', { name: 'Full name' }), 'Gerald Lim')
  await user.click(screen.getByRole('button', { name: 'Next' }))
  await user.click(screen.getByRole('button', { name: 'Primary' }))
  await user.click(screen.getByRole('button', { name: 'Storytelling' }))
  await user.click(screen.getByRole('button', { name: 'Classroom management' }))
  await user.click(screen.getByRole('button', { name: 'Next' }))
  await user.click(screen.getByRole('button', { name: 'Weekend morning, not selected' }))
  await user.click(screen.getByRole('button', { name: 'Find my mentor' }))

  await user.click(screen.getByRole('button', { name: /Ben Tan, .* demo fit/ }))
  expect(screen.getByText(/Can help with Classroom management/)).toBeDefined()
  expect(screen.getByText('Expertise')).toBeDefined()
})

test('previews a request, a kind decline, and alternative mentor selection', async () => {
  const user = userEvent.setup()
  render(<App />)
  await finishProfile(user)

  await user.click(screen.getByRole('button', { name: /Ben Tan, .* demo fit/ }))
  await user.click(screen.getByRole('button', { name: 'Send request' }))
  expect(screen.getByRole('dialog', { name: 'Send a request to Ben?' })).toBeDefined()
  const note = screen.getByRole('textbox', { name: 'A short note (optional)' })
  await user.clear(note)
  expect((note as HTMLTextAreaElement).value).toBe('')
  await user.click(screen.getByRole('button', { name: 'Preview sending request' }))
  expect(screen.getByRole('heading', { name: 'Your request is on its way to Ben' })).toBeDefined()
  expect(screen.getByText(/No request was sent from this preview/)).toBeDefined()

  await user.click(screen.getByRole('button', { name: 'Mentor declines' }))
  expect(screen.getByRole('heading', { name: 'Ben cannot take a new mentee right now' })).toBeDefined()
  await user.click(screen.getByRole('button', { name: /Michelle Goh/ }))
  expect(screen.getByRole('dialog', { name: 'Michelle Goh' })).toBeDefined()
})

test('previews an accepted mentor request as a match', async () => {
  const user = userEvent.setup()
  render(<App />)
  await finishProfile(user)

  await user.click(screen.getByRole('button', { name: /Ben Tan, .* demo fit/ }))
  await user.click(screen.getByRole('button', { name: 'Send request' }))
  await user.click(screen.getByRole('button', { name: 'Preview sending request' }))
  await user.click(screen.getByRole('button', { name: 'Mentor accepts' }))

  expect(screen.getByRole('heading', { name: 'You and Ben are matched' })).toBeDefined()
  expect(screen.getByRole('button', { name: 'Say hello' })).toBeDefined()
})

test('opens a local chat, previews messages, and schedules only shared sample times', async () => {
  const user = userEvent.setup()
  render(<App />)
  await matchWithBen(user)

  expect(screen.getByRole('heading', { name: 'Ben Tan' })).toBeDefined()
  expect(screen.getByText(/Messages and session times stay in this browser/)).toBeDefined()
  expect(screen.getByText('Hi Gerald, so glad you reached out. How has your term started?')).toBeDefined()

  await user.type(screen.getByRole('textbox', { name: 'Write a message' }), 'Thank you for reaching out.')
  await user.click(screen.getByRole('button', { name: 'Send preview message' }))
  expect(screen.getByText('Thank you for reaching out.')).toBeDefined()

  await user.click(screen.getByRole('button', { name: 'Choose a session time' }))
  expect(screen.getByRole('dialog', { name: 'When works for both of you?' })).toBeDefined()
  expect(screen.getAllByRole('button', { name: /shared availability/ })).toHaveLength(2)
  await user.click(screen.getByRole('button', { name: /Sat 17 Oct, 10:00/ }))
  expect(screen.getByText('Sat 17 Oct, 10:00')).toBeDefined()
  expect(screen.getByRole('button', { name: 'Prepare questions' })).toBeDefined()
})

test('prepares questions for a session and supports optional skip', async () => {
  const user = userEvent.setup()
  render(<App />)
  await matchWithBen(user)
  await user.click(screen.getByRole('button', { name: 'Choose a session time' }))
  await user.click(screen.getByRole('button', { name: /Sat 17 Oct, 10:00/ }))
  await user.click(screen.getByRole('button', { name: 'Prepare questions' }))

  await user.click(screen.getByRole('button', { name: 'Preview sending questions' }))
  expect(screen.getByRole('alert').textContent).toMatch(/Choose a topic or add a few words/)
  await user.click(screen.getByRole('button', { name: 'Settling a restless class' }))
  await user.type(screen.getByRole('textbox', { name: 'In your own words' }), 'My Primary 3 class gets noisy during group work.')
  await user.click(screen.getByRole('button', { name: 'Preview sending questions' }))

  expect(screen.getByRole('heading', { name: 'Ben Tan' })).toBeDefined()
  expect(screen.getByText(/pre-session questions are ready for Ben · preview only/)).toBeDefined()
  expect(screen.getByRole('button', { name: 'Review questions' })).toBeDefined()

  await user.click(screen.getByRole('button', { name: 'Review questions' }))
  await user.click(screen.getByRole('button', { name: 'Skip for now' }))
  expect(screen.getByRole('heading', { name: 'Ben Tan' })).toBeDefined()
  expect(screen.queryByText(/pre-session questions are ready for Ben/)).toBeNull()
})

test('shows when no sample meeting times overlap', async () => {
  const user = userEvent.setup()
  render(<App />)
  await finishProfile(user)
  await user.click(screen.getByRole('button', { name: /Joseph Tay, .* demo fit/ }))
  await user.click(screen.getByRole('button', { name: 'Send request' }))
  await user.click(screen.getByRole('button', { name: 'Preview sending request' }))
  await user.click(screen.getByRole('button', { name: 'Mentor accepts' }))
  await user.click(screen.getByRole('button', { name: 'Say hello' }))
  await user.click(screen.getByRole('button', { name: 'Choose a session time' }))

  expect(screen.getByText(/don’t have a shared sample time yet/)).toBeDefined()
  expect(screen.queryByRole('button', { name: /shared availability/ })).toBeNull()
})

test('previews the mentor inbox and the accept and kind-decline paths', async () => {
  const user = userEvent.setup()
  render(<App />)
  await matchWithBen(user)

  await user.click(screen.getByRole('button', { name: 'Match' }))
  await user.click(screen.getByRole('button', { name: 'Preview mentor inbox' }))
  expect(screen.getByRole('heading', { name: 'Hello, Ben' })).toBeDefined()
  expect(screen.getByText(/Sample request only/)).toBeDefined()
  expect(screen.getByText(/Hi Ben, I am new to Primary/)).toBeDefined()

  await user.click(screen.getByRole('button', { name: 'Not right now' }))
  expect(screen.getByRole('heading', { name: 'Reply kindly to Gerald?' })).toBeDefined()
  await user.click(screen.getByRole('button', { name: 'Away for a while' }))
  expect(screen.getByRole('button', { name: 'Away for a while' }).getAttribute('aria-pressed')).toBe('true')
  await user.click(screen.getByRole('button', { name: 'Send kind reply · preview' }))
  expect(screen.getByRole('heading', { name: 'A kind reply is ready' })).toBeDefined()
  expect(screen.getByText(/private reason/)).toBeDefined()
})

test('matches topic resources and previews using, sending, and hiding suggestions', async () => {
  const user = userEvent.setup()
  render(<App />)
  await matchWithBen(user)

  await user.click(screen.getByRole('button', { name: 'Choose a session time' }))
  await user.click(screen.getByRole('button', { name: /Sat 17 Oct, 10:00/ }))
  await user.click(screen.getByRole('button', { name: 'Prepare questions' }))
  await user.click(screen.getByRole('button', { name: 'Settling a restless class' }))
  await user.type(screen.getByRole('textbox', { name: 'In your own words' }), 'Help with group work.')
  await user.click(screen.getByRole('button', { name: 'Preview sending questions' }))
  await user.click(screen.getByRole('button', { name: 'Preview mentor’s suggested resources' }))

  expect(screen.getByRole('heading', { name: 'Before you meet Gerald' })).toBeDefined()
  expect(screen.getAllByRole('article')).toHaveLength(2)
  await user.click(screen.getAllByRole('button', { name: 'Use in session' })[0])
  await user.click(screen.getAllByRole('button', { name: 'Send to mentee' })[0])
  expect(screen.getByRole('button', { name: 'Sent to mentee' })).toBeDefined()
  await user.click(screen.getAllByRole('button', { name: 'Not relevant' })[0])
  expect(screen.getByText('Quiet signals that work with young children')).toBeDefined()
  await user.click(screen.getByRole('button', { name: 'Not relevant' }))
  expect(screen.getByText(/No sample resources match these topics yet/)).toBeDefined()
})

test('previews call starters and posts an editable session summary', async () => {
  const user = userEvent.setup()
  render(<App />)
  await matchWithBen(user)
  await user.click(screen.getByRole('button', { name: 'Choose a session time' }))
  await user.click(screen.getByRole('button', { name: /Sat 17 Oct, 10:00/ }))
  await user.click(screen.getByRole('button', { name: 'Preview video call' }))

  expect(screen.getByText(/No audio, video, or recording is connected/)).toBeDefined()
  await user.click(screen.getByRole('tab', { name: 'Pause and pray' }))
  expect(screen.getByRole('button', { name: 'Start one minute' })).toBeDefined()
  await user.click(screen.getByRole('button', { name: 'Start one minute' }))
  expect(screen.getByRole('button', { name: 'Pause' })).toBeDefined()
  await user.click(screen.getByRole('button', { name: 'Pause' }))
  await user.click(screen.getByRole('tab', { name: 'Joy and struggle' }))
  await user.type(screen.getByRole('textbox', { name: 'One joy from this week' }), 'The children enjoyed the story.')
  await user.click(screen.getByRole('button', { name: 'End call' }))

  expect(screen.getByRole('heading', { name: 'A note to take into next week' })).toBeDefined()
  const coveredNotes = screen.getByRole('textbox', { name: 'What you covered' })
  expect((coveredNotes as HTMLTextAreaElement).value).toContain('The children enjoyed the story.')
  await user.clear(coveredNotes)
  await user.type(coveredNotes, 'Keeping the class settled.')
  await user.type(screen.getByRole('textbox', { name: 'To try this week' }), 'Try a quiet signal.')
  await user.click(screen.getByRole('button', { name: 'Post summary to chat' }))
  expect(screen.getByText('Keeping the class settled.')).toBeDefined()
  expect(screen.getByText('Try a quiet signal.')).toBeDefined()

  await user.click(screen.getByRole('button', { name: 'Edit' }))
  expect(screen.getByRole('textbox', { name: 'What you covered' })).toBeDefined()
  await user.clear(screen.getByRole('textbox', { name: 'What you covered' }))
  await user.type(screen.getByRole('textbox', { name: 'What you covered' }), 'A revised summary.')
  await user.click(screen.getByRole('button', { name: 'Post summary to chat' }))
  expect(screen.getByText('A revised summary.')).toBeDefined()

  await user.click(screen.getByRole('button', { name: 'Remove' }))
  expect(screen.queryByText('A revised summary.')).toBeNull()
})




test('admin email changes the sign-in action and opens the admin dashboard', async () => {
  const user = userEvent.setup()
  render(<App />)

  const email = screen.getByRole('textbox', { name: 'Email' })
  await user.type(email, 'benlim.sg@hotmail.com')
  expect(screen.getByRole('button', { name: 'Login as Admin' })).toBeDefined()
  await user.click(screen.getByRole('button', { name: 'Login as Admin' }))

  expect(screen.getByRole('heading', { name: 'Overview' })).toBeDefined()
  expect(screen.getByRole('navigation', { name: 'Admin navigation' })).toBeDefined()
  await user.click(screen.getByRole('button', { name: 'Users' }))
  expect(screen.getByRole('heading', { name: 'Users' })).toBeDefined()
  expect(screen.getByRole('table')).toBeDefined()
  await user.click(screen.getByRole('button', { name: 'Meetups' }))
  expect(screen.getByRole('heading', { name: 'Meetups' })).toBeDefined()
  expect(screen.getByText('MEETUP CHECK-IN')).toBeDefined()
})
