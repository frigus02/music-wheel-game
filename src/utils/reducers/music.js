export default function reducer(
    state = {
        file: null,
        buffer: null,
        duration: Number.NaN
    },
    action) {
    switch (action.type) {
    case 'LOAD_FILE':
        return {
            file: action.file,
            buffer: null,
            duration: Number.NaN
        };
    case 'SET_MUSIC':
        return {
            file: action.file,
            buffer: action.buffer,
            duration: action.duration
        };
    default:
        return state;
    }
}
