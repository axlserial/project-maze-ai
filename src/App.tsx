import './App.css'
import Maze from './components/Maze'

const App = () => {
  return (
    <>
      <header>
        <h1>Laberinto Vive Sin Drogas</h1>
        <ul>
          <li>
            <button>Generar Laberinto</button>
          </li>
          <li>
            <button>Resolver</button>
          </li>
        </ul>
      </header>

      <Maze />
    </>
  )
}

export default App
