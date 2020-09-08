import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store';
import Home from './views/Home';
import Game from './views/Game'
import 'fontsource-roboto';

export default function App() {

  return (
    <Provider store={store}>
      <Router basename="/geoparty">
        <Switch>
          
          <Route exact path="/game">
            <Game />
          </Route>
    
          <Route exact path="/" >
            <Home/>
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}
