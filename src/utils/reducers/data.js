function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomColor() {
    const value = randomInt(0, 100);
    return value < 60
        ? 'deepskyblue'
        : value < 75
            ? 'yellow'
            : value < 95
                ? 'red'
                : 'magenta';
}

function createRandomGlyph(angleValue, angleRange) {
    return {
        color: randomColor(),
        angle: randomInt(
            angleValue / angleRange * 360,
            (angleValue + 1) / angleRange * 360 - 1),
        position: 0,
        speed: randomInt(2, 12),
        x: 0,
        y: 0
    };
}

function moveGlyph(inputGlyph) {
    const glyph = {...inputGlyph};

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
    const sideB = sideC * Math.sin(angleB * Math.PI / 180) / Math.sin(angleC * Math.PI / 180);
    const sideA = sideC * Math.sin(angleA * Math.PI / 180) / Math.sin(angleC * Math.PI / 180);

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

export default function reducer(
    state = {
        elapsed: 0,
        frequencyData: null,
        glyphs: []
    },
    action) {
    switch (action.type) {
    case 'LOAD_FILE':
        return {
            elapsed: 0,
            frequencyData: null,
            glyphs: []
        };
    case 'SET_MUSIC':
        return {
            elapsed: 0,
            frequencyData: null,
            glyphs: []
        };
    case 'TICK':
        return {
            glyphs: [
                ...moveAndRemoveReturnedGlyphs(state.glyphs),
                ...createNewGlyphs(state.frequencyData, action.frequencyData)
            ],
            elapsed: action.elapsed,
            frequencyData: action.frequencyData
        };
    case 'ADD_RANDOM_GLYPHS':
        return {
            ...state,
            glyphs: [
                ...state.glyphs,
                ...Array(action.count).fill().map(() => createRandomGlyph(0, 1))
            ]
        };
    default:
        return state;
    }
}
