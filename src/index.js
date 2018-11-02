import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import firebase from "./firebase";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

import "semantic-ui-css/semantic.min.css";

import App from "./components/App";
import { Login, Register } from "./components/Auth";
import Spinner from "./Spinner";

import rootReducer from './reducers';
import { setUser, clearUser } from './actions';

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if ( user ) {
        this.props.setUser( user );
        this.props.history.push("/");
      } else {
        this.props.clearUser();
        this.props.history.push( "/login" );
      }
    });
  }

  render() {
    return this.props.isLoading ? <Spinner /> : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ( {
  isLoading: state.user.isLoading,

})

const RootWithAuth = withRouter( connect(
  mapStateToProps,
  { setUser, clearUser } )( Root ) );

ReactDOM.render(
  <Provider store={ store }>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
