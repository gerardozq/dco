import { useState } from 'react'
import './App.css'

const initialTasks = [
  { id: 'app', label: 'Explore the React app', done: true },
  { id: 'github', label: 'Review the GitHub Actions workflow', done: false },
  { id: 'registry', label: 'Choose your GHCR package visibility', done: false },
  { id: 'publish', label: 'Publish your first container image', done: false },
]

function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const completed = tasks.filter((task) => task.done).length

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="DCO home">
          <span className="brand-mark">d.</span> DCO
        </a>
        <span className="badge">React starter</span>
      </header>

      <section className="hero" aria-labelledby="welcome-title">
        <p className="eyebrow">FROM IDEA TO CONTAINER</p>
        <h1 id="welcome-title">Small app.<br /><span>Big possibilities.</span></h1>
        <p className="intro">
          Your next project starts here. A lightweight React frontend,
          packaged with Docker and ready to publish to GitHub Container Registry.
        </p>
        <a className="primary-link" href="#launch-checklist">Start your launch checklist &rarr;</a>
      </section>

      <section className="features" aria-label="Starter features">
        <article className="card">
          <span className="card-number">01 / DEVELOP</span>
          <h2>Fast by default</h2>
          <p>React, TypeScript, and Vite. Instant feedback while you build.</p>
        </article>
        <article className="card">
          <span className="card-number">02 / PACKAGE</span>
          <h2>Container-ready</h2>
          <p>A multi-stage Docker build with Nginx serving your production app.</p>
        </article>
        <article className="card">
          <span className="card-number">03 / PUBLISH</span>
          <h2>A clear path to GHCR</h2>
          <p>GitHub Actions publishes commit-tagged images using its built-in token.</p>
        </article>
      </section>

      <section id="launch-checklist" className="checklist" aria-labelledby="checklist-title">
        <div>
          <p className="eyebrow">YOUR NEXT STEPS</p>
          <h2 id="checklist-title">Launch checklist</h2>
          <p>This demo checklist resets when you reload. It does not track image publishing status.</p>
          <p className="progress-label" role="status">{completed} of {tasks.length} complete</p>
          <progress value={completed} max={tasks.length} aria-label="Checklist progress" />
        </div>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <label className={task.done ? 'task complete' : 'task'}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => setTasks((current) => current.map((item) =>
                    item.id === task.id ? { ...item, done: !item.done } : item,
                  ))}
                />
                <span>{task.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>
      <footer>Built with React. Packaged for the cloud. Make it yours.</footer>
    </main>
  )
}

export default App
