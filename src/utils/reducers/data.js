const COLORS = {
	BLUE: "deepskyblue",
	YELLOW: "yellow",
	RED: "red",
	PURPLE: "magenta"
};

let LAST_GLYPH_ID = 0;

function randomInt(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function randomColor() {
	const value = randomInt(0, 100);
	return value < 60
		? COLORS.BLUE
		: value < 75
		? COLORS.YELLOW
		: value < 95
		? COLORS.RED
		: COLORS.PURPLE;
}

function createRandomGlyph(angleValue, angleRange) {
	return {
		id: String(++LAST_GLYPH_ID),
		color: randomColor(),
		angle: randomInt(
			(angleValue / angleRange) * 360,
			((angleValue + 1) / angleRange) * 360 - 1
		),
		position: 0,
		speed: randomInt(2, 12),
		x: 0,
		y: 0
	};
}

function moveGlyph(inputGlyph) {
	const glyph = { ...inputGlyph };

	glyph.position += glyph.speed;

	if (glyph.speed >= 1) {
		glyph.speed /= 1.03;
	} else if (glyph.speed > 0 && glyph.speed < 1) {
		glyph.speed *= -1;
	} else {
		glyph.speed *= 1.03;
	}

	//      angle B
	//        |\
	//        | \
	//        |  \
	//        |   \  side C
	// side A |    \
	//        |     \
	//        |      \
	//        |_______\ angle A
	// angle C    |     X <-- Center of canvas
	//          side B

	const angleC = 90;
	const angleA = glyph.angle % 90;
	const angleB = 180 - angleA - angleC;
	const sideC = glyph.position;
	const sideB =
		(sideC * Math.sin((angleB * Math.PI) / 180)) /
		Math.sin((angleC * Math.PI) / 180);
	const sideA =
		(sideC * Math.sin((angleA * Math.PI) / 180)) /
		Math.sin((angleC * Math.PI) / 180);

	const area = Math.floor(glyph.angle / 90);
	switch (area) {
		case 0:
			glyph.x = -sideB;
			glyph.y = -sideA;
			break;
		case 1:
			glyph.x = +sideA;
			glyph.y = -sideB;
			break;
		case 2:
			glyph.x = +sideB;
			glyph.y = +sideA;
			break;
		case 3:
			glyph.x = -sideA;
			glyph.y = +sideB;
			break;
	}

	return glyph;
}

function moveAndRemoveReturnedGlyphs(glyphs) {
	return glyphs
		.filter(glyph => glyph.position + glyph.speed > 0)
		.map(moveGlyph);
}

function createNewGlyphs(oldFrequencyData, newFrequencyData) {
	const newGlyphs = [];
	if (oldFrequencyData && newFrequencyData) {
		const length = oldFrequencyData.length;
		for (let i = 0; i < length; i++) {
			if (newFrequencyData[i] - oldFrequencyData[i] > 3) {
				newGlyphs.push(createRandomGlyph(i, length));
			}
		}
	}

	return newGlyphs;
}

const getDistanceBetweenPointsSquared = (x1, y1, x2, y2) =>
	(x1 - x2) ** 2 + (y1 - y2) ** 2;

const getDistanceBetweenPoints = (x1, y1) => (x2, y2) =>
	Math.sqrt(getDistanceBetweenPointsSquared(x1, y1, x2, y2));

const getDistanceBetweenLineSegmentAndPointSquared = (
	x1Line,
	y1Line,
	x2Line,
	y2Line,
	xPoint,
	yPoint
) => {
	const l2 = getDistanceBetweenPointsSquared(x1Line, y1Line, x2Line, y2Line);
	if (l2 === 0) {
		return getDistanceBetweenPointsSquared(x1Line, y1Line, xPoint, yPoint);
	}

	const t = Math.max(
		0,
		Math.min(
			1,
			((xPoint - x1Line) * (x2Line - x1Line) +
				(yPoint - y1Line) * (y2Line - y1Line)) /
				l2
		)
	);

	return getDistanceBetweenPointsSquared(
		xPoint,
		yPoint,
		x1Line + t * (x2Line - x1Line),
		y1Line + t * (y2Line - y1Line)
	);
};

const getDistanceBetweenLineSegmentAndPoint = (
	x1Line,
	y1Line,
	x2Line,
	y2Line
) => (xPoint, yPoint) =>
	Math.sqrt(
		getDistanceBetweenLineSegmentAndPointSquared(
			x1Line,
			y1Line,
			x2Line,
			y2Line,
			xPoint,
			yPoint
		)
	);

function getHitGlyphs(glyphs, radius, mouseX, mouseY, lastMouseX, lastMouseY) {
	const hasLastMouse = lastMouseX !== null && lastMouseY !== null;
	const distanceFunc = hasLastMouse
		? getDistanceBetweenLineSegmentAndPoint(
				mouseX,
				mouseY,
				lastMouseX,
				lastMouseY
		  )
		: getDistanceBetweenPoints(mouseX, mouseY);

	return glyphs.filter(glyph => distanceFunc(glyph.x, glyph.y) <= radius);
}

function getModifiedPointsAfterHitGlyph(points, multiplicator, glyphs) {
	const blues = glyphs.filter(glyph => glyph.color === COLORS.BLUE);

	return points + blues.length * multiplicator;
}

function getModifiedMultiplicatorAfterHitGlyph(multiplicator, glyphs) {
	glyphs.forEach(glyph => {
		if (glyph.color === COLORS.YELLOW) {
			multiplicator += 1;
		} else if (glyph.color === COLORS.RED) {
			multiplicator = Math.max(1, Math.floor(multiplicator / 1.5));
		}
	});

	return multiplicator;
}

function getBigRadiusAfterHitGlyph(bigRadiusTicks, glyphs) {
	const includesPurple = glyphs.some(glyph => glyph.color === COLORS.PURPLE);

	return includesPurple
		? {
				glyphRadius: 14,
				remainingBigRadiusTicks: 300
		  }
		: {
				glyphRadius: bigRadiusTicks > 0 ? 14 : 7,
				remainingBigRadiusTicks: bigRadiusTicks
		  };
}

function getBigRadiusAfterTick(bigRadiusTicks) {
	const newTicks = Math.max(0, bigRadiusTicks - 1);
	return {
		glyphRadius: newTicks > 0 ? 14 : 7,
		remainingBigRadiusTicks: newTicks
	};
}

const defaultState = {
	elapsed: 0,
	frequencyData: null,
	glyphs: [],
	points: 0,
	multiplicator: 1,
	glyphRadius: 7,
	remainingBigRadiusTicks: 0,
	lastMouse: { x: null, y: null }
};

// Makes hit radius of glyphs slightly larger, so it's less frustrating.
const hitRadiusAddition = 3;

export default function reducer(state = defaultState, action) {
	switch (action.type) {
		case "LOAD_FILE":
			return defaultState;
		case "SET_MUSIC":
			return defaultState;
		case "TICK":
			return {
				...state,
				elapsed: action.elapsed,
				frequencyData: action.frequencyData,
				glyphs: [
					...moveAndRemoveReturnedGlyphs(state.glyphs),
					...createNewGlyphs(state.frequencyData, action.frequencyData)
				],
				...getBigRadiusAfterTick(state.remainingBigRadiusTicks)
			};
		case "HIT_GLYPH": {
			const hitGlyphs = getHitGlyphs(
				state.glyphs,
				state.glyphRadius + hitRadiusAddition,
				action.x,
				action.y,
				state.lastMouse.x,
				state.lastMouse.y
			);

			return {
				...state,
				glyphs: state.glyphs.filter(glyph => !hitGlyphs.includes(glyph)),
				points: getModifiedPointsAfterHitGlyph(
					state.points,
					state.multiplicator,
					hitGlyphs
				),
				multiplicator: getModifiedMultiplicatorAfterHitGlyph(
					state.multiplicator,
					hitGlyphs
				),
				...getBigRadiusAfterHitGlyph(state.remainingBigRadiusTicks, hitGlyphs),
				lastMouse: { x: action.x, y: action.y }
			};
		}
		default:
			return state;
	}
}
