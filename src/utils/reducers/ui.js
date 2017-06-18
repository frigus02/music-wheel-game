export default function reducer(
    state = 'game',
    action) {
    switch (action.type) {
    case 'SET_UI':
        return action.ui;
    default:
        return state;
    }
}
