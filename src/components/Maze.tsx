import { useEffect, useState } from 'react'
import { Stage, Container, Sprite } from '@pixi/react'
import bee from '../assets/chill.png'
import flowers from '../assets/flowers.png'
import './maze.css'
import Cell from './Cell'

const Maze = () => {

	const [x, setX] = useState(0)
	const [maze, setMaze] = useState<CellGen[][]>([])

	useEffect(() => {
		setInterval(() => {
			setX(x => x + 1)
		}, 10)
		setMaze(generateMaze(10, 10))
	}, [])

	return (
		<section id='maze'>
			<Stage
				width={1280 - 8}
				height={620 - 8}
				options={{
					backgroundAlpha: 0
				}}
			>
				<Container>
					<Sprite
						image={bee}
						scale={{ x: 0.15, y: 0.15 }}
						x={x}
						y={150}
					/>
					<Sprite
						image={flowers}
						scale={{ x: 0.15, y: 0.15 }}
						x={0}
						y={350}
					/>
					{
						maze.map((row, y) => {
							return row.map((cell, x) => {
								return <Cell
									key={`${x}-${y}`}
									x={x * 50}
									y={y * 50}
									topWall={cell.topWall}
									rightWall={cell.rightWall}
									bottomWall={cell.bottomWall}
									leftWall={cell.leftWall}
								/>
							})
						}
						)
					}
				</Container>
			</Stage>
		</section>
	)

}

interface CellGen {
	topWall: boolean;
	rightWall: boolean;
	bottomWall: boolean;
	leftWall: boolean;
	visited: boolean;
}

function generateMaze(width: number, height: number): CellGen[][] {
	const maze: CellGen[][] = []
	for (let i = 0; i < height; i++) {
		maze[i] = []
		for (let j = 0; j < width; j++) {
			maze[i][j] = {
				topWall: true,
				rightWall: true,
				bottomWall: true,
				leftWall: true,
				visited: false
			}
		}
	}

	const stack: { x: number, y: number }[] = [];
	let current = { x: 0, y: 0 }
	maze[current.y][current.x].visited = true

	while (true) {
		const neighbors = []
		const { x, y } = current

		if (y > 0 && !maze[y - 1][x].visited) {
			neighbors.push({ x, y: y - 1, direction: 'top' })
		}
		if (x < width - 1 && !maze[y][x + 1].visited) {
			neighbors.push({ x: x + 1, y, direction: 'right' })
		}
		if (y < height - 1 && !maze[y + 1][x].visited) {
			neighbors.push({ x, y: y + 1, direction: 'bottom' })
		}
		if (x > 0 && !maze[y][x - 1].visited) {
			neighbors.push({ x: x - 1, y, direction: 'left' })
		}

		if (neighbors.length === 0) {
			if (stack.length === 0) {
				break
			}
			current = stack.pop()!;
			continue
		}

		const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)]
		if (neighbor.direction === 'top') {
			maze[y][x].topWall = false
			maze[neighbor.y][neighbor.x].bottomWall = false;
		} else if (neighbor.direction === 'right') {
			maze[y][x].rightWall = false
			maze[neighbor.y][neighbor.x].leftWall = false;
		} else if (neighbor.direction === 'bottom') {
			maze[y][x].bottomWall = false
			maze[neighbor.y][neighbor.x].topWall = false;
		} else if (neighbor.direction === 'left') {
			maze[y][x].leftWall = false
			maze[neighbor.y][neighbor.x].rightWall = false;
		}

		stack.push(current)
		current = { x: neighbor.x, y: neighbor.y }
		maze[current.y][current.x].visited = true
	}

	return maze
}

export default Maze