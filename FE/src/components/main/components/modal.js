import React from 'react';
import { connect } from 'react-redux';
import keyhole from '../../../assets/images/keyhole.svg';
import ErrorState from "./errorState";
import { SET_RESTS, SET_SEL_NUM, SET_AUTH } from '../../../constants/actionTypes';
import { SERVER_URL } from '../../../constants/otherConstans';
import axios from 'axios';
import './modal.css';

const mapStateToProps = state => {
    return {
        selNum: state.main.selNum,
        rests: state.main.rests
    }
};

const mapDispatchToProps = dispatch => ({
    setRests: (data) => dispatch({type: SET_RESTS, data}),
    setSelNum: (data) => dispatch({type: SET_SEL_NUM, data}),
    setAuth: (data) => dispatch({ type: SET_AUTH, data })  
});

class Modal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            newName: '',
            newLoc: '',
            error: {
                newName: 'none',
                newLoc: 'none'
            }
        }
    }

    componentWillMount = () => {
        if(this.props.selNum)
            this.setState({
                newName: this.props.rests[this.props.selNum-1].name,
                newLoc: this.props.rests[this.props.selNum-1].loc,
                title: 'Update Restaurant',
                error: {
                    newName: 'none',
                    newLoc: 'none'
                }
            });
        else 
            this.setState({
                title: 'Add a New Restaurant'
            })
    }

    componentWillReceiveProps = (newProps) => {
        if(newProps.selNum)
            this.setState({
                newName: newProps.rests[newProps.selNum-1].name,
                newLoc: newProps.rests[newProps.selNum-1].loc,
                title: 'Update Restaurant',
                error: {
                    newName: 'none',
                    newLoc: 'none'
                }
            });
        else 
            this.setState({
                newName: '',
                newLoc: '',
                title: 'Add a New Restaurant',
                error: {
                    newName: 'none',
                    newLoc: 'none'
                }
            });
    }
    
    setnewName = (e) => {
        this.setState({newName: e.target.value});
        if(e.target.value !== ''){
            var error = this.state.error;
            error.newName = 'none';
            this.setState({error: error});
        }
    }

    setnewLoc = (e) => {
        this.setState({newLoc: e.target.value});
        if(e.target.value !== ''){
            var error = this.state.error;
            error.newLoc = 'none';
            this.setState({error: error});
        }
    }

    appendItem = (data) => {
        var reqData = {
            curPage: this.props.curPage,
            nameFilter: this.props.nameFilter?this.props.nameFilter:'',
            locFilter: this.props.locFilter?this.props.locFilter:'',
            favFilter: this.props.favFilter,
            name: this.state.newName,
            loc: this.state.newLoc
        }; console.log(this.props.auth);
        axios.post(SERVER_URL + '/data/appendItem', {auth: this.props.auth, data: reqData})
        .then((res) => {
            if(res.data.result === 'OK'){
                this.props.setRests({rests: res.data.data.rests, totalNum: res.data.data.totalNum });
                this.closeModal();
            } else if (res.data.result === "SESSION_ENDED") {
                sessionStorage.setItem('status',false);
                sessionStorage.setItem('email', false);
                sessionStorage.setItem('psw', false);
                const temp = {
                    email: false,
                    psw: false
                }
                this.props.setAuth(temp);
                this.props.history.push('/');
              } else {
                alert(res.data.result)
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    updateItem = (id, data) => {
        var reqData = {
            curPage: this.props.curPage,
            nameFilter: this.props.nameFilter?this.props.nameFilter:'',
            locFilter: this.props.locFilter?this.props.locFilter:'',
            favFilter: this.props.favFilter,
            name: this.state.newName,
            loc: this.state.newLoc,
            id: this.props.rests[this.props.selNum-1]._id,
        }; console.log(this.props.auth);
        axios.post(SERVER_URL + '/data/updateItem', {auth: this.props.auth, data: reqData})
        .then((res) => {
            if(res.data.result === 'OK'){
                this.props.setRests({rests: res.data.data.rests, totalNum: res.data.data.totalNum });
                this.closeModal();
            } else if (res.data.result === "SESSION_ENDED") {
                sessionStorage.setItem('status',false);
                sessionStorage.setItem('email', false);
                sessionStorage.setItem('psw', false);
                const temp = {
                    email: false,
                    psw: false
                }
                this.props.setAuth(temp);
                this.props.history.push('/');
              } else {
                alert(res.data.result)
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    appendOrUpadate = () => {
        var newName = this.state.newName === '' ? 'block' : 'none';
        var newLoc = this.state.newLoc === '' ? 'block' : 'none';
        this.setState({error: {newName: newName, newLoc: newLoc}});

        if(newName === 'none' && newLoc === 'none'){
            var data = {
                name: this.state.newName,
                loc: this.state.newLoc
            }

            if(this.props.selNum){
                var id =this.props.rests[this.props.selNum -1 ]._id;
                this.updateItem(id, data);
            } else 
                this.appendItem(data);
        }
    }

    closeModal = () => {
        this.props.setSelNum(false);
        this.setState({
            newName: '',
            newLoc: '',
            error: {
                newName: 'none',
                newLoc: 'none'
            }
        })
        window.$('#modal').hide();
    }

  render() {
    return (        
        <div id="modal" className="w3-modal" style={{display: 'none'}}>
            <div className="w3-modal-content ssu2_modal1">
                <div className="w3-container">
                    <div className="ssu2_modal1_text1">
                        {this.state.title}
                    </div>
                    <hr style={{margin: '50px 0px 0px'}}/>
                    <div className="ssu2_modal1_input" style={{marginTop: '50px'}}>
                        <div className="ssu2_modal1_input">
                            <div class="ssu2_modal1_input ssu2_modal3_selectBox">
                                <div className="input_left_icon">
                                    <img alt="img"src={keyhole} style={{marginTop: '-5px'}} />
                                </div>
                                <input class="ssu2_modal3_select" placeholder="Name" type="text" value={this.state.newName} onChange={this.setnewName}/>
                            </div>
                            <ErrorState show={this.state.error.newName} name="Name is required." />
                        </div>
                    </div>
                    <div className="ssu2_modal1_input">
                        <div className="ssu2_modal1_input">
                            <div class="ssu2_modal1_input ssu2_modal3_selectBox">
                                <div className="input_left_icon">
                                    <img alt="img"src={keyhole} style={{marginTop: '-5px'}} />
                                </div>
                                <input class="ssu2_modal3_select" placeholder="Location" type="text" value={this.state.newLoc} onChange={this.setnewLoc}/>
                            </div>
                            <ErrorState show={this.state.error.newLoc} name="Location is required." />
                        </div>
                    </div>
                    <hr style={{margin: '50px 0px 0px'}}/>
                    <div className="row ssu_bottom">
                        <button className="ssu2_modal1_button1" onClick={this.appendOrUpadate}> SAVE </button>
                        <button className="ssu2_modal1_button2" onClick={this.closeModal}> CANCEL </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
