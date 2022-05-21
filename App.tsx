import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import LoginScreen from './screens/LoginScreen';
import {Provider} from 'react-redux';
import { createStore, combineReducers } from "redux";
import tokenReducer from "./store/reducers/token";

const rootReducer = combineReducers({
  token: tokenReducer,
});

const store = createStore(rootReducer);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
        <SafeAreaProvider>
          <Provider store={store}>
            <Navigation colorScheme={colorScheme}/>
            <StatusBar/>
          </Provider>
        </SafeAreaProvider>
    );
  }
}
