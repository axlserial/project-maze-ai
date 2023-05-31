import { Graphics } from '@pixi/react'
import { Graphics as PixiGraphics } from '@pixi/graphics'
import { useCallback } from 'react'

const Cell = ({
	topWall = true,
	rightWall = true,
	bottomWall = true,
	leftWall = true,
	x,
	y,
	fill = false
}: {
	topWall?: boolean,
	rightWall?: boolean,
	bottomWall?: boolean,
	leftWall?: boolean,
	x: number,
	y: number,
	fill: boolean
}) => {

	const cellSize = 48

	const fillCellDraw = useCallback((g: PixiGraphics) => {
		g.lineStyle(0)
		g.beginFill(0x99ccff)
		g.drawRect(x, y, cellSize, cellSize)
		g.endFill()
	}, [])

	const topWallDraw = useCallback((g: PixiGraphics) => {
		// Wall
		g.lineStyle(8, 0x99ccff)
		g.moveTo(x, y)
		g.lineTo(cellSize + x, y)
		g.closePath()

		// Border radius
		g.lineStyle(0)
		g.beginFill(0x99ccff)
		g.drawCircle(x, y, 4)
		g.drawCircle(cellSize + x, y, 4)
		g.endFill()
	}, [])

	const rightWallDraw = useCallback((g: PixiGraphics) => {
		g.lineStyle(8, 0x99ccff)
		g.moveTo(cellSize + x, y)
		g.lineTo(cellSize + x, cellSize + y)
		g.closePath()

		g.lineStyle(0)
		g.beginFill(0x99ccff)
		g.drawCircle(cellSize + x, y, 4)
		g.drawCircle(cellSize + x, cellSize + y, 4)
		g.endFill()
	}, [])

	const bottomWallDraw = useCallback((g: PixiGraphics) => {
		g.lineStyle(8, 0x99ccff)
		g.moveTo(cellSize + x, cellSize + y)
		g.lineTo(x, cellSize + y)
		g.closePath()

		g.lineStyle(0)
		g.beginFill(0x99ccff)
		g.drawCircle(cellSize + x, cellSize + y, 4)
		g.drawCircle(x, cellSize + y, 4)
		g.endFill()
	}, [])

	const leftWallDraw = useCallback((g: PixiGraphics) => {
		g.lineStyle(8, 0x99ccff)
		g.moveTo(x, cellSize + y)
		g.lineTo(x, y)
		g.closePath()

		g.lineStyle(0)
		g.beginFill(0x99ccff)
		g.drawCircle(x, cellSize + y, 4)
		g.drawCircle(x, y, 4)
		g.endFill()
	}, [])

	return (
		<>

			{
				fill && <Graphics draw={fillCellDraw} />
			}
			{
				topWall && <Graphics draw={topWallDraw} />
			}

			{
				rightWall && <Graphics draw={rightWallDraw} />
			}

			{
				bottomWall && <Graphics draw={bottomWallDraw} />
			}

			{
				leftWall && <Graphics draw={leftWallDraw} />
			}

		</>
	)

}

export default Cell