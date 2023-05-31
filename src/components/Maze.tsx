import { useEffect, useState } from 'react'
import { Stage, Container, Sprite } from '@pixi/react'
import bee from '../assets/chill.png'
import flowers from '../assets/flowers.png'
import './maze.css'
import Cell from './Cell'

interface Node {
	x: number
	y: number
}

const Maze = () => {

	const [x, setX] = useState(0)
	const [y, setY] = useState(0)
	const [maze, setMaze] = useState<CellGen[][]>([])

	const start = { x: 0, y: 0 }
	const end = { x: 14, y: 14 }


	useEffect(() => {
		setMaze(generateMaze(15, 15))

		setTimeout(() => bfs(start, end, updatePosition), 1000)
	}, [])

	function updatePosition(x: number, y: number) {
		setX(x * 48)
		setY(y * 48)
	  }

	function bfs(
		start: Node,
		end: Node,
		updatePosition: (x: number, y: number) => void
	  ): Node[] | null {
		const queue: Node[] = [start];
		const visited: Set<string> = new Set();
		const parents: Record<string, Node> = {};
	  
		function visitNeighbor() {
		  const current = queue.shift()!;
		  if (current.x === end.x && current.y === end.y) {
			// reconstruir el camino
			const path: Node[] = [end];
			let node = end;
			while (node.x !== start.x || node.y !== start.y) {
			  node = parents[`${node.x},${node.y}`];
			  path.unshift(node);
			}
			return path;
		  }
		  const neighbors: Node[] = [];
		  if (!maze[current.y][current.x].topWall) {
			neighbors.push({ x: current.x, y: current.y - 1 });
		  }
		  if (!maze[current.y][current.x].rightWall) {
				neighbors.push({ x: current.x, y: current.y - 1});
		  }
		  if (!maze[current.y][current.x].bottomWall) {
				neighbors.push({ x: current.x, y: current.y - 1});
		  }
		  if (!maze[current.y][current.x].leftWall) {
				neighbors.push({ x: current.x, y: current.y - 1});
		  }
		  for (const neighbor of neighbors) {
			const key = `${neighbor.x},${neighbor.y}`;
			if (!visited.has(key)) {
			  queue.push(neighbor);
			  visited.add(key);
			  parents[key] = current;
			}
		  }
		  if (queue.length > 0) {
			console.log(current.x, current.y);
			updatePosition(current.x, current.y);
			setTimeout(visitNeighbor, 500);
		  }
		}
	  
		visited.add(`${start.x},${start.y}`);
		setTimeout(visitNeighbor, 500);
	  
		return null;
	  }

	return (
		<section id='maze'>
			<Stage
				width={720}
				height={720}
				options={{
					backgroundAlpha: 0
				}}
			>
				<Container>
					<Sprite
						image={bee}
						scale={{ x: 0.08, y: 0.08 }}
						x={x}
						y={y}
					/>
					<Sprite
						image={flowers}
						scale={{ x: 0.08, y: 0.08 }}
						x={14 * 48}
						y={14 * 48}
					/>
					{
						maze.map((row, y) => {
							return row.map((cell, x) => {
								return <Cell
									key={`${x}-${y}`}
									x={x * 48}
									y={y * 48}
									topWall={cell.topWall}
									rightWall={cell.rightWall}
									bottomWall={cell.bottomWall}
									leftWall={cell.leftWall}
									fill={cell.fill}
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
	fill: boolean
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
				visited: false,
				fill: false
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

// --------------------------------------------------

  
//   function bfs(maze: CellGen[][], start: Node, end: Node): Node[] | null {
// 	const queue: Node[] = [start];
// 	const visited: Set<string> = new Set();
// 	const parents: Record<string, Node> = {};
  
// 	while (queue.length > 0) {
// 	  const current = queue.shift()!;
// 	  if (current.x === end.x && current.y === end.y) {
// 		// reconstruir el camino
// 		const path: Node[] = [end];
// 		let node = end;
// 		while (node.x !== start.x || node.y !== start.y) {
// 		  node = parents[`${node.x},${node.y}`];
// 		  path.unshift(node);
// 		}
// 		return path;
// 	  }
// 	  const neighbors: Node[] = [];
// 	  if (!maze[current.y][current.x].topWall) {
// 		neighbors.push({ x: current.x, y: current.y - 1 });
// 	  }
// 	  if (!maze[current.y][current.x].rightWall) {
// 		neighbors.push({ x: current.x + 1, y: current.y });
// 	  }
// 	  if (!maze[current.y][current.x].bottomWall) {
// 		neighbors.push({ x: current.x, y: current.y + 1 });
// 	  }
// 	  if (!maze[current.y][current.x].leftWall) {
// 		neighbors.push({ x: current.x - 1, y: current.y });
// 	  }
// 	  for (const neighbor of neighbors) {
// 		const key = `${neighbor.x},${neighbor.y}`;
// 		if (!visited.has(key)) {
// 		  queue.push(neighbor);
// 		  visited.add(key);
// 		  parents[key] = current;
// 		}
// 	  }
// 	}
  
// 	return null;
//   }
  
  // Ejemplo de uso:
//   const path = bfs(maze, start, end);
//   console.log(path);
// --------------------------------------------------

export default Maze