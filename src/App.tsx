import { useState } from "react"
import "./App.css"
import Maze from "./components/Maze"

const App = () => {
	const [generateSelected, setGenerateSelected] = useState(false)
	const [solveSelected, setSolveSelected] = useState(false)

	return (
		<>
			<header>
				<h1>Resolución de Laberinto</h1>
				<ul>
					<li>
						<button
							onClick={() => setGenerateSelected(true)}
							disabled={solveSelected}
						>
							Generar Laberinto
						</button>
					</li>
					<li>
						<button
							onClick={() => setSolveSelected(true)}
							disabled={solveSelected}
						>
							Resolver
						</button>
					</li>
				</ul>
			</header>

			<Maze
				generateSelected={generateSelected}
				setGeneraterSelected={setGenerateSelected}
				solveSelected={solveSelected}
				setSolveSelected={setSolveSelected}
			/>
		</>
	)
}

export default App
