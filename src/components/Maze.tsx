import { useEffect, useState } from "react"
import { Stage, Container, Sprite } from "@pixi/react"
import bee from "../assets/chill.png"
import flowers from "../assets/flowers.png"
import "./maze.css"
import Cell from "./Cell"

interface CellGen {
	topWall: boolean
	rightWall: boolean
	bottomWall: boolean
	leftWall: boolean
	visited: boolean
	fill: boolean
	parent?: { x: number; y: number }
}

interface Edge {
	cell1: { x: number; y: number }
	cell2: { x: number; y: number }
	direction: string
}

function generateMaze(width: number, height: number): CellGen[][] {
	const maze: CellGen[][] = []

	// Inicializar todas las celdas del laberinto
	for (let i = 0; i < height; i++) {
		maze[i] = []
		for (let j = 0; j < width; j++) {
			maze[i][j] = {
				topWall: true,
				rightWall: true,
				bottomWall: true,
				leftWall: true,
				visited: false,
				fill: false,
			}
		}
	}

	const edges: Edge[] = []

	// Agregar todos los bordes al conjunto de bordes
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			if (i > 0) {
				edges.push({
					cell1: { x: j, y: i },
					cell2: { x: j, y: i - 1 },
					direction: "top",
				})
			}
			if (j < width - 1) {
				edges.push({
					cell1: { x: j, y: i },
					cell2: { x: j + 1, y: i },
					direction: "right",
				})
			}
		}
	}

	// Barajar los bordes aleatoriamente
	for (let i = edges.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[edges[i], edges[j]] = [edges[j], edges[i]]
	}

	const disjointSet: number[][] = []

	// Inicializar el conjunto de conjuntos disjuntos
	for (let i = 0; i < height; i++) {
		disjointSet[i] = []
		for (let j = 0; j < width; j++) {
			disjointSet[i][j] = i * width + j
		}
	}

	// Unir las celdas utilizando el algoritmo de Kruskal
	while (edges.length > 0) {
		const edge = edges.pop()!
		const { cell1, cell2, direction } = edge

		const root1 = find(disjointSet, cell1.y, cell1.x)
		const root2 = find(disjointSet, cell2.y, cell2.x)

		if (root1 !== root2) {
			union(disjointSet, root1, root2)
			if (direction === "top") {
				maze[cell1.y][cell1.x].topWall = false
				maze[cell2.y][cell2.x].bottomWall = false
			} else if (direction === "right") {
				maze[cell1.y][cell1.x].rightWall = false
				maze[cell2.y][cell2.x].leftWall = false
			}
		}
	}

	// Marcar todas las celdas como no visitadas
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			maze[i][j].visited = false
		}
	}

	return maze
}

function find(disjointSet: number[][], row: number, col: number): number {
	if (disjointSet[row][col] !== row * disjointSet[0].length + col) {
		disjointSet[row][col] = find(
			disjointSet,
			Math.floor(disjointSet[row][col] / disjointSet[0].length),
			disjointSet[row][col] % disjointSet[0].length
		)
	}
	return disjointSet[row][col]
}

function union(disjointSet: number[][], root1: number, root2: number): void {
	// const row1 = Math.floor(root1 / disjointSet[0].length)
	// const col1 = root1 % disjointSet[0].length
	const row2 = Math.floor(root2 / disjointSet[0].length)
	const col2 = root2 % disjointSet[0].length

	disjointSet[row2][col2] = root1
}

interface Props {
	generateSelected: boolean
	setGeneraterSelected: (selected: boolean) => void
	solveSelected: boolean
	setSolveSelected: (selected: boolean) => void
}

const Maze = (props: Props) => {
	const {
		generateSelected,
		setGeneraterSelected,
		solveSelected,
		setSolveSelected,
	} = props

	const [beeCoords, setBeeCoords] = useState({ x: 0, y: 0 })
	const [maze, setMaze] = useState<CellGen[][]>([])

	useEffect(() => {
		const generated = generateMaze(15, 15)
		setMaze(generated)
	}, [])

	useEffect(() => {
		if (!generateSelected) return

		setGeneraterSelected(false)
		setBeeCoords({ x: 0, y: 0 })
		const generated = generateMaze(15, 15)
		setMaze(generated)
	}, [generateSelected])

	useEffect(() => {
		if (!solveSelected) return

		if (maze.length > 0) {
			// Resuelve el laberinto utilizando BFS
			solveMaze()
		}
	}, [solveSelected])

	const solveMaze = () => {
		const queue: { x: number; y: number }[] = []
		const visited: boolean[][] = []

		for (let i = 0; i < maze.length; i++) {
			visited[i] = []
			for (let j = 0; j < maze[i].length; j++) {
				visited[i][j] = false
			}
		}

		const startCell = maze[0][0]
		startCell.parent = undefined
		visited[0][0] = true
		queue.push({ x: 0, y: 0 })

		while (queue.length > 0) {
			const current = queue.shift()!
			const { x, y } = current

			if (x === maze.length - 1 && y === maze[x].length - 1) {
				// Se llegó al destino, termina la resolución
				const path: { x: number; y: number }[] = []
				let cell = maze[y][x]

				while (cell.parent) {
					path.unshift({ x: cell.parent.x, y: cell.parent.y })
					cell = maze[cell.parent.y][cell.parent.x]
				}

				// Mueve la abeja a lo largo del camino encontrado
				let index = 0
				const intervalId = setInterval(() => {
					if (index === path.length) {
						// Se pone a la abeja en la celda de destino
						setBeeCoords({ x: 14 * 48, y: 14 * 48 })
						clearInterval(intervalId)
						setSolveSelected(false)
						return
					}

					const { x, y } = path[index]
					setBeeCoords({ x: x * 48, y: y * 48 })
					index++
				}, 200)

				return
			}

			// Explora los vecinos no visitados
			if (!maze[y][x].topWall && y > 0 && !visited[y - 1][x]) {
				maze[y - 1][x].parent = { x, y }
				visited[y - 1][x] = true
				queue.push({ x, y: y - 1 })
			}
			// Explora los vecinos no visitados
			if (
				!maze[y][x].rightWall &&
				x < maze[y].length - 1 &&
				!visited[y][x + 1]
			) {
				maze[y][x + 1].parent = { x, y }
				visited[y][x + 1] = true
				queue.push({ x: x + 1, y })
			}
			// Explora los vecinos no visitados
			if (
				!maze[y][x].bottomWall &&
				y < maze.length - 1 &&
				!visited[y + 1][x]
			) {
				maze[y + 1][x].parent = { x, y }
				visited[y + 1][x] = true
				queue.push({ x, y: y + 1 })
			}
			// Explora los vecinos no visitados
			if (!maze[y][x].leftWall && x > 0 && !visited[y][x - 1]) {
				maze[y][x - 1].parent = { x, y }
				visited[y][x - 1] = true
				queue.push({ x: x - 1, y })
			}
		}
	}

	return (
		<section id="maze">
			<Stage
				width={720}
				height={720}
				options={{
					backgroundAlpha: 0,
				}}
			>
				<Container>
					<Sprite
						image={flowers}
						scale={{ x: 0.25, y: 0.25 }}
						x={14 * 48}
						y={14 * 48}
					/>
					
					<Sprite
						image={bee}
						scale={{ x: 0.25, y: 0.25 }}
						x={beeCoords.x}
						y={beeCoords.y}
					/>
					{maze.map((row, y) => {
						return row.map((cell, x) => {
							return (
								<Cell
									key={`${x}-${y}`}
									x={x * 48}
									y={y * 48}
									topWall={cell.topWall}
									rightWall={cell.rightWall}
									bottomWall={cell.bottomWall}
									leftWall={cell.leftWall}
									fill={cell.fill}
								/>
							)
						})
					})}
				</Container>
			</Stage>
		</section>
	)
}

export default Maze
