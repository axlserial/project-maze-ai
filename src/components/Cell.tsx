import { Graphics } from '@pixi/react'

const Cell = ({
	topWall = true,
	rightWall = true,
	bottomWall = true,
	leftWall = true,
	x,
	y
}: {
	topWall?: boolean,
	rightWall?: boolean,
	bottomWall?: boolean,
	leftWall?: boolean,
	x: number,
	y: number
}) => {

	const cellSize = 50

	return (
		<>
			{
				topWall &&
				<Graphics
					draw={g => {
						g.lineStyle(8, 0x99ccff)
						g.moveTo(x, y)
						g.lineTo(cellSize + x, y)
						g.closePath()

						g.lineStyle(0)
						g.beginFill(0x99ccff)
						g.drawCircle(x, y, 4)
						g.drawCircle(cellSize + x, y, 4)
						g.endFill()
					}}
				/>
			}

			{
				rightWall &&
				<Graphics
					draw={g => {
						g.lineStyle(8, 0x99ccff)
						g.moveTo(cellSize + x, y)
						g.lineTo(cellSize + x, cellSize + y)
						g.closePath()

						g.lineStyle(0)
						g.beginFill(0x99ccff)
						g.drawCircle(cellSize + x, y, 4)
						g.drawCircle(cellSize + x, cellSize + y, 4)
						g.endFill()
					}}
				/>
			}

			{
				bottomWall &&
				<Graphics
					draw={g => {
						g.lineStyle(8, 0x99ccff)
						g.moveTo(cellSize + x, cellSize + y)
						g.lineTo(x, cellSize + y)
						g.closePath()

						g.lineStyle(0)
						g.beginFill(0x99ccff)
						g.drawCircle(cellSize + x, cellSize + y, 4)
						g.drawCircle(x, cellSize + y, 4)
						g.endFill()
					}}
				/>
			}

			{
				leftWall &&
				<Graphics
					draw={g => {
						g.lineStyle(8, 0x99ccff)
						g.moveTo(x, cellSize + y)
						g.lineTo(x, y)
						g.closePath()

						g.lineStyle(0)
						g.beginFill(0x99ccff)
						g.drawCircle(x, cellSize + y, 4)
						g.drawCircle(x, y, 4)
						g.endFill()
					}}
				/>
			}

		</>
	)

}

export default Cell