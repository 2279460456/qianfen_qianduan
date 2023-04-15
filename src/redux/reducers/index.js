import { combineReducers } from 'redux';
import CollapseReducer from './CollapsedReducer';
import LoadingReducer from './LoadingReducer';

export default combineReducers({
    CollapseReducer,
    LoadingReducer,
})