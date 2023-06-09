
export default function CollapsedReducer(preState = { isCollapsed: false }, action) {
    let { type } = action;
    switch (type) {
        case "change_collapsed":
            let newState = { ...preState };
            newState.isCollapsed = !newState.isCollapsed;
            return newState;
        default:
            return preState;
    }
}