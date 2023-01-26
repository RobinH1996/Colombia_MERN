import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import email from '../../assets/images/email.svg';
import key from '../../assets/images/key.svg';
import ErrorState from "./components/errorState";
import { SET_AUTH } from '../../constants/actionTypes';
import './signUp.css';
import { SERVER_URL } from '../../constants/otherConstans';

const mapStateToProps = state => {
  return {
    email: state.auth.email,
    psw: state.auth.psw
  }};

const mapDispatchToProps = dispatch => ({
  setAuth: (data) => dispatch({ type: SET_AUTH, data })  
});

class SignIn extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        email: '',
        psw: '',        
        error: {
            email: 'none',
            psw: 'none',
        },
        pswErr: 'Password is required'
        }
    }

    componentWillMount = () => {
        if(this.props.email)
          this.props.history.push('/home');
        else
          window.scrollTo({top: 0, behavior: 'smooth'});
    }

    componentWillReceiveProps(newProps) {
    }

    togglePassword = (id) => {        
        let input = window.$("#"+id);
        if (input.attr("type") === "password") {
            input.attr("type", "text");
            window.$("#c_" + id).hide();
            window.$("#o_" + id).show();
        } else {
            input.attr("type", "password");
            window.$("#o_" + id).hide();
            window.$("#c_" + id).show();
        }
    }

    setEmail = (e) => {
        this.setState({email: e.target.value, emailErr: 'Valid email address is required.'});
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var valid = re.test(String(e.target.value).toLowerCase());
        var error = this.state.error;
        if(e.target.value !== '' && valid){
            error.email = 'none';
            this.setState({error: error});
        } else {
            error.email = 'block';
            this.setState({error: error});
        }
    }
    
    setPsw = (e) => {
        this.setState({psw: e.target.value});
        var password = e.target.value;   
        var error = this.state.error;
        // Do not show anything when the length of password is zero.
        if (password.length === 0) {
            this.setState({pswErr: 'Password is required.'});
            error.psw = 'block';
            this.setState({error: error});
            return;
        }
    }

    signIn = () => {
        var state = this.state;
        var email = state.email === '' ? 'block' : 'none';
        var psw = state.psw === '' ? 'block' : 'none';
        
        if(psw === '') {
            this.setState({pswErr: 'Password is required'});
        }

        var error = {
            email: email,
            psw: psw,
        };
        this.setState({error: {...error}}); 

        if(email==='none' && psw==='none'){ 
            const data = {
                email: this.state.email,
                psw: this.state.psw
            };

           axios
            .post(SERVER_URL + "/users/logIn", data)
            .then((response) => {
                if(response.data.result === 'OK'){
                    this.saveSession({email: state.email, psw: state.psw});
                } else if (response.data.result === 'NO_EMAIL'){ alert(response.data.result);
                    this.setState({emailErr: 'No such a registered email'});
                    var err = this.state.error;
                    err.email = "block";
                    this.setState({error: err});
                } else if (response.data.result === 'PSW_ERR'){
                    this.setState({pswErr: 'Password Error'});
                    var err = this.state.error;
                    err.psw = "block";
                    this.setState({error: err});
                }
            })
            .catch((err) => {
                console.log(err);
            }); 
        }
    }

    saveSession = (data) => {
      sessionStorage.setItem('status','logIn');
      sessionStorage.setItem('email', data.email);
      sessionStorage.setItem('psw', data.psw);
      const temp = {
        email: data.email,
        psw: data.psw
      }
      this.props.setAuth(temp);
      this.props.history.push('/home');
    }

  render() {
    return (
        <div className="outer_container">
            <div className="main_container" style={{padding: '50px 0px 150px'}}>
                <div className="ssu_container w3-card-4">
                    <div className="ssu3_body">
                        <div className="ssu_txt1">
                            <span><PersonOutlineIcon style={{fontSize: '70px', marginTop: '-10px', marginRight: '40px'}}/></span>LOG IN
                        </div>
                        <div className="ssu2_modal1_input">
                            <div class="ssu2_modal1_input ssu2_modal3_selectBox">
                                <div className="input_left_icon">
                                    <img alt="img"src={email} />
                                </div>
                                <input class="ssu2_modal3_select" placeholder="Email Address" type="text" value={this.state.email} onChange={this.setEmail}/>
                            </div>
                            <ErrorState show={this.state.error.email} name={this.state.emailErr} />
                        </div>
                        <div className="ssu2_modal1_input">
                            <div class="ssu2_modal1_input ssu2_modal3_selectBox">
                                <div className="input_left_icon">
                                    <img alt="img"src={key} />
                                </div>
                                <input id="psw" class="ssu3_password" placeholder="Password" type="password" value={this.state.psw} onChange={this.setPsw}/>
                                <div className="ssu3_eye" onMouseDown={()=>this.togglePassword('psw')} onMouseUp={()=>this.togglePassword('psw')}  
                                  onTouchStart={()=>this.togglePassword('psw')}  onTouchEnd={()=>this.togglePassword('psw')} >
                                    <VisibilityOffIcon id="c_psw" style={{display: 'block'}}/>
                                    <VisibilityIcon  id="o_psw" style={{display: 'none'}}/>
                                </div>
                            </div>
                            <ErrorState show={this.state.error.psw} name={this.state.pswErr}/>
                        </div>
                      </div>  
                    <hr style={{margin: '60px 0px 0px'}}/>
                    <div className="row ssu_bottom" style={{paddingBottom: '50px'}}>
                        <button className="ssu2_modal1_button1" onClick={this.signIn}> LOG IN </button>
                        <button className="ssu2_modal1_button2" onClick={()=>this.props.history.push('/')}> CANCEL </button>
                    </div>
                </div>
            </div>
        </div>
      );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
