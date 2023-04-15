import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import allreducers from './reducers';
import { persistStore, persistReducer } from 'redux-persist'   //（redux联名localstorage 将需要持久化的数据存储到localstorage中，并且实时同步数据）
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { composeWithDevTools } from 'redux-devtools-extension';   //插件监控状态

const persistConfig = {
    key: 'fold_state',
    storage,   //存储到localstorage中
    blacklist: ['LoadingReducer'] // LoadingReducer 将不会被持久化
}

const persistedReducer = persistReducer(persistConfig, allreducers)

let store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));
let persistor = persistStore(store);

export { store, persistor }    //因为一些持久化的操作，所以做了很多修改

