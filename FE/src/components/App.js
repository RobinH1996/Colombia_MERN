import Header from './Header';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import LogIn from './main/logIn';
import Home from './main/home';
import Detail from './main/detail';
import SignUp from './main/signUp';
import Favorite from './main/favorite';
import Dash from './main/dash';
import { store } from '../store';
import { push } from 'react-router-redux';
import { SET_AUTH } from '../constants/actionTypes';

const mapStateToProps = state => {
  return {
    email: state.auth.email,
    psw: state.auth.psw
  }};

const mapDispatchToProps = dispatch => ({
  setAuth: (data) => dispatch({ type: SET_AUTH, data })
});

class App extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      // this.context.router.replace(nextProps.redirectTo);
      store.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }
  }

  componentWillMount() {
    const token = sessionStorage.getItem('status');
    if(token === 'logIn') {
      const email = sessionStorage.getItem('email');
      const psw = sessionStorage.getItem('psw');
      const data = {
        email: email,
        psw: psw
      }
      this.props.setAuth(data);
    }
  }

  render() {
    return (
      <div>
        <Header userName={this.props.email} history={this.props.history}/>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/signUp" component={SignUp} />
            <Route path="/detail" component={Detail} />
            <Route path="/logIn" component={LogIn} />
            <Route path="/favorite" component={Favorite} />
            <Route path="/" component={Dash} />
          </Switch>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
