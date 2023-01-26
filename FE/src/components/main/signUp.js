import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import user from '../../assets/images/user.svg';
import email from '../../assets/images/email.svg';
import phone from '../../assets/images/phone.svg';
import key from '../../assets/images/key.svg';
import ErrorState from "./components/errorState";
import { SERVER_URL } from '../../constants/otherConstans';
import './signUp.css';

const mapStateToProps = state => {
  return {
    email: state.auth.email
  }};

const mapDispatchToProps = dispatch => ({
  
});

class SignUp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        fullName: '',
        email: '',
        phone: '',
        psw: '',
        repsw: '',           
        error: {
            fullName: 'none',
            email: 'none',
            phone: 'none',
            psw: 'none',
            repsw: 'none'
        },
        pswErr: 'Password is required',
        emailErr: 'This email is already used.'
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

    setName = (e) => {
        this.setState({fullName: e.target.value});
        if(e.target.value !== ''){
            var error = this.state.error;
            error.fullName = 'none';
            this.setState({error: error});
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

    setPhone = (e) => {
        this.setState({phone: e.target.value});
        var validate;
        if(e.target.value.match(/\d/g))
            if(e.target.value.match(/\d/g).length===10)
                validate = true;
            else
                validate = false;
        else
            validate = false;
            
        var error = this.state.error;
        if(e.target.value !== '' && validate){
            error.phone = 'none';
            this.setState({error: error});
        } else {
            error.phone = 'block';
            this.setState({error: error});
        }
    }
    
    setPsw = (e) => {
        var password = e.target.value;   
        this.setState({psw: password});
        var error = this.state.error;
        // Do not show anything when the length of password is zero.
        if (password.length === 0) {
            this.setState({pswErr: 'Password is required.'});
            error.psw = 'block';
            this.setState({error: error});
            return;
        } else if (password.length < 10) {
            this.setState({pswErr: 'Password must includes 10+ letters.'});
            error.psw = 'block';
            this.setState({error: error});
        } else {
            // Create an array and push all possible values that you want in password
            var matchedCase = [];
            matchedCase.push("[$@$!%*#?&]"); // Special Charector
            matchedCase.push("[A-Z]");      // Uppercase Alpabates
            matchedCase.push("[0-9]");      // Numbers
            matchedCase.push("[a-z]");     // Lowercase Alphabates

            // Check the conditions
            var ctr = 0;
            for (var i = 0; i < matchedCase.length; i++) {
                if (new RegExp(matchedCase[i]).test(password)) {
                    ctr++;
                }
            }
            // Display it
            switch (ctr) {
                case 0:
                case 1:
                case 2:
                case 3:
                    this.setState({pswErr: 'Strong password is required. ( ex: @Administrator123 )'});
                    error.psw = 'block';
                    this.setState({error: error});
                    break;
                case 4:
                    error.psw = 'none';
                    this.setState({error: error});
                    break;
                default:
                    return;
            }
        }
    }

    setRepsw = (e) => {
        var validate = this.state.psw === e.target.value;
        this.setState({repsw: e.target.value});
        var error = this.state.error;
        if(e.target.value !== '' && validate){
            error.repsw = 'none';
            this.setState({error: error});
        } else {
            error.repsw = 'block';
            this.setState({error: error});
        }
    }

    goToNext = () => {
        this.props.history.push('/logIn');
    }

    signUp = () => {
        var data = {
            email: this.state.email,
            name: this.state.fullName,
            phone: this.state.phone,
            psw: this.state.psw
        }
        axios
            .post(SERVER_URL + "/users/signUp", data)
            .then((res) => {
                if(res.data.result === 'OK'){
                    alert("Successfully Signed Up.");
                    this.goToNext();
                } else if (res.data.result === 'REPEAT'){
                    this.setState({emailErr: 'This Email address is already in use.'});
                    var err = this.state.error;
                    err.email = "block";
                    this.setState({error: err});
                }
            })
            .catch((err) => {
                console.log(err);
            }); 
    }

    continueToNext = () => {
        var state = this.state;
        var fullName = state.fullName === '' ? 'block' : 'none';
        var email = state.email === '' ? 'block' : 'none';
        var phone = state.phone === '' ? 'block' : 'none';
        var psw = state.psw === '' ? 'block' : 'none';
        var repsw = state.repsw === '' ? 'block' : 'none';
        
        if(psw === '') {
            this.setState({pswErr: 'Password is required'});
        }

        var error = {
            fullName: fullName,
            email: email,
            phone: phone,
            psw: psw,
            repsw: repsw
        };
        this.setState({error: {...error}}); 

        if(fullName==='none' && email==='none' && phone==='none' && psw==='none' && repsw==='none'){
            this.signUp();
        }
    }

  render() {
    return (
        <div className="outer_container">
            <div className="main_container" style={{padding: '50px 0px 150px'}}>
                <div className="ssu_container w3-card-4">
                    <div className="ssu3_body">
                        <div className="ssu_txt1">
                        <span><PersonAddOutlinedIcon style={{fontSize: '70px', marginTop: '-10px', marginRight: '40px'}}/></span>SIGN UP
                        </div>
                        <div className="ssu2_modal1_input">
                            <div class="ssu2_modal1_input ssu2_modal3_selectBox">
                                <div className="input_left_icon">
                                    <img alt="img"src={user} />
                                </div>
                                <input class="ssu2_modal3_select" placeholder="Full Name" type="text" value={this.state.fullName} onChange={this.setName}/>
                            </div>
                            <ErrorState show={this.state.error.fullName} name="Full Name is required." />
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
                            <div class="ssu2_modal1_input ssu2_modal3_selectBox" style={{marginTop: '50px'}}>
                                <div className="input_left_icon">
                                    <img alt="img"src={phone} />
                                </div>
                                <input class="ssu2_modal3_select" placeholder="Phone Number" type="text" value={this.state.phone} onChange={this.setPhone}/>
                            </div>
                            <ErrorState show={this.state.error.phone} name="10 digits phone number is required." />
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
                        <div className="ssu2_modal1_input">
                            <div class="ssu2_modal1_input ssu2_modal3_selectBox">
                                <div className="input_left_icon">
                                    <img alt="img"src={key} />
                                </div>
                                <input id="rpsw" class="ssu3_password" placeholder="Confirm password" type="password" value={this.state.repsw} onChange={this.setRepsw}/>
                                <div className="ssu3_eye" onMouseDown={()=>this.togglePassword('rpsw')} onMouseUp={()=>this.togglePassword('rpsw')}
                                  onTouchStart={()=>this.togglePassword('rpsw')} onTouchEnd={()=>this.togglePassword('rpsw')}>
                                    <VisibilityOffIcon id="c_rpsw" style={{display: 'block'}}/>
                                    <VisibilityIcon  id="o_rpsw" style={{display: 'none'}}/>
                                </div>
                                </div>
                                <ErrorState show={this.state.error.repsw} name="Doesn't match with the password." />
                            </div>                 
                    </div>
                    <hr style={{margin: '60px 0px 0px'}}/>
                    <div className="row ssu_bottom" style={{paddingBottom: '50px'}}>
                        <button className="ssu2_modal1_button1" onClick={this.continueToNext}> SIGN UP </button>
                        <button className="ssu2_modal1_button2" onClick={()=>this.props.history.push('/')}> CANCEL </button>
                    </div>
                </div>
            </div>
        </div>
      );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
