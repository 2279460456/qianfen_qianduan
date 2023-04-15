import Indexrouter from './router';
import './App.css';
import { Provider } from 'react-redux';  //Provider向子组件传递store
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'; //持久化
import './util/http'   //对于axios做一些封装   baseURL,拦截器等等

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Indexrouter />
      </PersistGate>
    </Provider>
  );
}

export default App;
