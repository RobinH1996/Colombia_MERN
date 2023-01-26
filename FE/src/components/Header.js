import React from 'react';
import { connect } from 'react-redux'
import './global.css';
import logo from '../assets/images/Logo.png';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import { SET_AUTH } from '../constants/actionTypes';

const LoggedOutView = props => {

  const openRightMenu = () => {
    document.getElementById("rightMenu").style.display = "block";
  }

  const closeRightMenu = () => {
    document.getElementById("rightMenu").style.display = "none";
  }

  const navTo = (to) => {
    props.history.push("/" + to);
  }

  if (!props.userName) {
    return (
    <div className="outer_container w3-card-4" style={{position: 'fixed', bottom: '0px', zIndex: '1000'}}>
      <div className="main_container">
        <div className="header_container">
          <div onClick={()=>navTo("")} className="header_logo"><img alt="img"src={logo} width="100%"/></div>
          <div onClick={(e)=>navTo("logIn")} className="header_nav" id="logIn">LOG IN</div>
          <div onClick={()=>navTo("signUp")} className="header_nav" id="signUp">SIGN UP</div>
  
          <button className="w3-button w3-xxlarge w3-right tablet_btn" onClick={openRightMenu}>&#9776;</button>
          <div className="w3-sidebar w3-bar-block w3-card w3-animate-right" style={{display:'none', right:0, position: 'absolute', top: '0px'}} id="rightMenu">
            <button onClick={closeRightMenu} className="w3-bar-item w3-button w3-large">{'>>'}</button>
            <a href="/logIn" className="w3-bar-item w3-button w3-large">LOG IN</a>
            <a href="/signUp" className="w3-bar-item w3-button w3-large">SIGN UP</a>
          </div>
        </div>
      </div>
    </div>
    );
  }
  return null;
};

const LoggedInView = props => {

  const openRightMenu = () => {
    document.getElementById("rightMenu").style.display = "block";
  }

  const closeRightMenu = () => {
    document.getElementById("rightMenu").style.display = "none";
  }

  const navTo = (to) => {
    if(to === 'signOut'){
      sessionStorage.setItem('status',false);
      sessionStorage.setItem('email', false);
      sessionStorage.setItem('psw', false);
      const temp = {
        email: false,
        psw: false
      }
      props.setAuth(temp);
      props.history.push('/');
    }
    props.history.push("/" + to);
  }

  if (props.userName) {
    return (
    <div className="outer_container w3-card-4" style={{position: 'fixed', bottom: '0px', zIndex: '1000'}}>
      <div className="main_container">
        <div className="header_container">
          <div onClick={()=>navTo("home")} className="header_logo" style={{fontSize: '30px'}}><PersonOutlineIcon style={{fontSize: '40px', marginRight: '15px', marginLeft: '10px'}}/> { props.userName }</div>
          <div onClick={(e)=>navTo("signOut")} className="header_nav" id="signOut">SIGN OUT</div>
          <div onClick={()=>navTo("favorite")} className="header_nav" id="favorite">FAVORITE</div>
          <div onClick={()=>navTo("home")} className="header_nav" id="home">HOME</div>
  
          <button className="w3-button w3-xxlarge w3-right tablet_btn" onClick={openRightMenu}>&#9776;</button>
          <div className="w3-sidebar w3-bar-block w3-card w3-animate-right" style={{display:'none', right:0, position: 'absolute', top: '0px'}} id="rightMenu">
            <button onClick={closeRightMenu} className="w3-bar-item w3-button w3-large">{'>>'}</button>
            <a onClick={(e)=>navTo("signOut")} className="w3-bar-item w3-button w3-large">SIGN OUT</a>
            <a href="/favorite" className="w3-bar-item w3-button w3-large">FAVORITE</a>
            <a href="/home" className="w3-bar-item w3-button w3-large">HOME</a>
          </div>
        </div>
      </div>
    </div>
    );
  }
  return null;
};

const mapStateToProps = state => {
  return {
    email: state.auth.email
  }};

const mapDispatchToProps = dispatch => ({
  setAuth: (data) => dispatch({ type: SET_AUTH, data })  
});

class Header extends React.Component {
  render() {
    return (
      <div>
        <LoggedOutView userName={this.props.userName} history={this.props.history}/>
        <LoggedInView userName={this.props.userName} history={this.props.history} setAuth={this.props.setAuth}/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
