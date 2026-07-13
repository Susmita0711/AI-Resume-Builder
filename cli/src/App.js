import React from "react";
import "./App.css";
import Typed from "react-typed";

function App() {
  return (
    <div className="container">

      {/* HERO */}
      <section className="hero">
        <h1>Hi, I'm <span>Susmita Hazra</span></h1>

        <Typed
          strings={[
            "CSE (AI & ML) Student",
            "Aspiring Software Developer",
            "Tech Enthusiast"
          ]}
          typeSpeed={50}
          backSpeed={30}
          loop
        />

        <div className="buttons">
          <a href="https://github.com/Susmita0711" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="mailto:susmitahazra071105@gmail.com">
            Contact Me
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section">
        <h2>About Me</h2>
        <p>
          I am a second-year Computer Science Engineering student specializing in 
          Artificial Intelligence & Machine Learning. I am passionate about 
          building modern web applications and exploring AI-driven solutions.
        </p>
      </section>

      {/* SKILLS */}
      <section className="section">
        <h2>Skills</h2>
        <div className="skills">
          <span>HTML</span>
          <span>CSS</span>
          <span>JavaScript</span>
          <span>React</span>
          <span>Java</span>
          <span>Python</span>
          <span>GitHub</span>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section">
        <h2>Projects</h2>

        <div className="card">
          <h3>Portfolio Website</h3>
          <p>Personal portfolio built using React.</p>
        </div>

        <div className="card">
          <h3>AI Mini Project</h3>
          <p>Basic machine learning model project (to be updated).</p>
        </div>

        <div className="card">
          <h3>Web Development Project</h3>
          <p>Frontend-based responsive website.</p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section">
        <h2>Contact</h2>
        <p>Email: susmitahazra071105@gmail.com</p>
        <p>
          GitHub: 
          <a href="https://github.com/Susmita0711" target="_blank" rel="noreferrer">
            Susmita0711
          </a>
        </p>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 Susmita Hazra | Built with ❤️</p>
      </footer>

    </div>
  );
}

export default App;