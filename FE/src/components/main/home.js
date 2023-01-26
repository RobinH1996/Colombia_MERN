import React from 'react';
import { connect } from 'react-redux';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import Modal from './components/modal';
import { SET_RESTS, SET_SEL_NUM, SET_AUTH } from '../../constants/actionTypes';
import { SERVER_URL } from '../../constants/otherConstans';
import axios from 'axios';

const mapStateToProps = state => {
  return {
      selId: state.main.selId,
      rests: state.main.rests,
      auth: state.auth,
      totalNum: state.main.totalNum
  }
};

const mapDispatchToProps = dispatch => ({
  setRests: (data) => dispatch({type: SET_RESTS, data}),
  setSelNum: (data) => dispatch({type: SET_SEL_NUM, data}),
  setAuth: (data) => dispatch({ type: SET_AUTH, data })  
});

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      rests: [],
      curPage: 1,
      totalPage: 1,
      nameFilter: false,
      locFilter: false,
      favFilter: false
    }
  }

  /************ INITIALIZING **************/

  componentWillMount() {
    if(!this.props.auth.email)
      this.props.history.push('/');
    else {
      window.scrollTo({top: 0, behavior: 'smooth'});
      var rests = [];

      for( var i = 0; i < this.props.rests.length; i++ ){
        this.props.rests[i].num =  20 * (this.state.curPage - 1) + i + 1;
        rests.push(this.props.rests[i]);
      }

      var total = this.props.totalNum;

      var totalPage = (total - total % 20) / 20 + 1;

      this.setState({
        rests: [...rests],
        curPage: 1,
        totalPage: totalPage,
        nameFilter: false,
        locFilter: false,
        favFilter: false
      });
      this.getDataFromDB();
    }
  }

  componentWillReceiveProps(newProps) {
    var rests = [];
    
    for( var i = 0; i < newProps.rests.length; i++ ){
      newProps.rests[i].num = 20 * (this.state.curPage - 1) + i + 1;
      rests.push(newProps.rests[i]);
    }
    
    var total = newProps.totalNum;
    var totalPage = (total - total % 20) / 20 + 1;

    console.log(rests);
    this.setState({
      rests: [...rests],
      totalPage: totalPage  
    }); 
  }

  /************ CRUD *************/

  getDataFromDB = () => {
    var reqData = {
      curPage: this.state.curPage,
      nameFilter: this.state.nameFilter?this.state.nameFilter:'',
      locFilter: this.state.locFilter?this.state.locFilter:'',
      favFilter: this.state.favFilter
    }
    axios.post(SERVER_URL + '/data/getData', {auth: this.props.auth, data: reqData})
      .then((res) => {
        if(res.data.result === 'OK'){
          this.props.setRests({rests: res.data.data.rests, totalNum: res.data.data.totalNum });
        } else if (res.data.result === "SESSION_ENDED") {
          this.props.history.push("/");
        } else {
          alert(res.data.result)
        }

      })
      .catch((err) => {
        console.log(err);
      })
  }

  removeOneItem = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Do you really want to delete this item?")){
      var reqData = {
        curPage: this.state.curPage,
        nameFilter: this.state.nameFilter?this.state.nameFilter:'',
        locFilter: this.state.locFilter?this.state.locFilter:'',
        favFilter: this.state.favFilter,
        id: id
      }
      axios.post(SERVER_URL + '/data/removeOne', {auth: this.props.auth, data: reqData})
        .then((res) => {
          if(res.data.result === 'OK'){
            this.props.setRests({rests: res.data.data.rests, totalNum: res.data.data.totalNum });
          } else if (res.data.result === "SESSION_ENDED") {
            this.props.history.push("/");
          } else {
            alert(res.data.result);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  setFav = (e, id, set) => {
    e.stopPropagation();
    var reqData = {
      curPage: this.state.curPage,
      nameFilter: this.state.nameFilter?this.state.nameFilter:'',
      locFilter: this.state.locFilter?this.state.locFilter:'',
      favFilter: this.state.favFilter,
      id: id,
      set: set
    }
    axios.post(SERVER_URL + '/data/setFav', {auth: this.props.auth, data: reqData})
      .then((res) => {
        if(res.data.result === 'OK'){
          this.props.setRests({rests: res.data.data.rests, totalNum: res.data.data.totalNum });
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
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  editItem = (e, num) => {
    e.stopPropagation();
    this.props.setSelNum(num % 20);
    window.$("#modal").show();
  }

  /************ FILTERING *************/

  filterByName = (e) => {
    var nameFilter = e.target.value;
    this.setState({
      nameFilter: nameFilter,
      curPage: 1
    }, () => this.getDataFromDB());
  }

  filterByLoc = (e) => {
    var locFilter = e.target.value;
    this.setState({
      locFilter: locFilter,
      curPage: 1
    }, () => this.getDataFromDB() );
  }

  setFavFilter = (val) => {
    this.setState({ favFilter: val}, () => this.getDataFromDB());
  }

  /************ PAGINATION **************/

  firstPage = () => {
    if(this.state.curPage !== 1){
      this.setState({curPage: 1}, ()=>this.getDataFromDB());      
    }
  }

  prevPage = () => {    
    if(this.state.curPage !== 1){
      var prevPage = this.state.curPage-1
      this.setState({curPage: prevPage}, () => this.getDataFromDB());      
    }
  }

  nextPage = () => {  
    if(this.state.curPage !== this.state.totalPage){
      var nextPage = this.state.curPage+1
      this.setState({curPage: nextPage}, () => this.getDataFromDB());      
    }
  }

  lastPage = () => { 
    if(this.state.curPage !== this.state.totalPage){
      this.setState({curPage: this.state.totalPage}, () => this.getDataFromDB());
    }    
  }
  
  /************ THE OTHERS **************/

  viewDetail = (num) => {
    this.props.setSelNum(num % 20);
    this.props.history.push("/detail");
  }
  
  /************ RENDERING **************/

  render() {
    return (
    <div className="outer_container">
          <div className="main_container" style={{padding: '50px 0px 150px'}}>
              <div className="ssu_container w3-card-4" style={{minHeight: '800px', height: 'auto', padding: '50px 50px'}}>
                <h1 className="w3-center">
                  RESTAURANTS
                </h1>
                <hr/>
                <h3>
                  <b style={{marginLeft: '3%'}}> total number : {this.props.totalNum} </b>
                  <span>
                    <button className="w3-button w3-grey w3-round w3-large" onClick={()=>window.$('#modal').show()} style={{float: 'right', marginRight: '3%'}}> 
                      <b style={{color: 'white'}}>ADD</b> 
                    </button>
                  </span>
                </h3>
                <div class="row" style={{width: '95%', overflowX: 'auto', margin: '20px auto 0px'}}>
                <table className="w3-table-all w3-hoverable" style={{minWidth: '700px', margin: '0px auto 20px', fontSize: '24px'}}>
                    <thead>
                      <tr style={{backgroundColor: 'grey', color: 'white'}}>
                        <th style={{width: '5%'}}> <b> No </b> </th>
                        <th style={{width: '40%'}} > 
                          <b style={{display: this.state.nameFilter!==false?"none":"block"}} onClick={()=>this.setState({nameFilter: ''})}> NAME </b> 
                          <p style={{position: 'relative', display: this.state.nameFilter!==false? "block": "none"}}>
                            <input className="w3-input" autoFocus={true} placeholder="filter by Name" value={this.state.nameFilter}
                             onChange={this.filterByName}/>
                            <HighlightOffIcon style={{position: 'absolute', right: '8px', top: '12px', color: 'grey'}} 
                            onClick={(e)=>{e.stopPropagation(); this.setState({nameFilter: false}, () => this.getDataFromDB());}} />
                          </p>
                        </th>
                        <th style={{width: '40%'}}> 
                          <b style={{display: this.state.locFilter!==false?"none":"block"}} onClick={()=>this.setState({locFilter: ''})}> LOCATION </b> 
                          <p style={{position: 'relative', display: 'none', display: this.state.locFilter!==false? "block": "none"}}>
                            <input className="w3-input" autoFocus={true} placeholder="filter by location" value={this.state.locFilter}
                              onChange={this.filterByLoc}/>
                            <HighlightOffIcon style={{position: 'absolute', right: '8px', top: '12px', color: 'grey'}} 
                            onClick={(e)=>{e.stopPropagation(); this.setState({locFilter: false}, ()=>this.getDataFromDB()); }} />
                          </p>
                        </th>
                        <th style={{width: '5%', textAlign: 'center'}}> 
                          <FavoriteIcon style={{display: this.state.favFilter?'block':'none'}} onClick={() => this.setFavFilter(false)}/>
                          <FavoriteBorderIcon style={{display: this.state.favFilter?'none':'block'}} onClick={() => this.setFavFilter(true)}/> 
                        </th>                        
                        <th style={{width: '5%', textAlign: 'center'}}> <EditIcon/></th>
                        <th style={{width: '5%', textAlign: 'center'}}> 
                          <DeleteIcon /> 
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>             
                <div className="row" style={{overflowX: 'auto', minHeight: 500, width: '95%', margin: '-22px auto 0px', height: 'auto', maxHeight: '500px', overflowY: 'auto'}}>
                  <table className="w3-table-all w3-hoverable" style={{minWidth: '700px', margin: '0px auto 20px', height: '150px', fontSize: '24px'}}>
                    <tbody>
                      {
                        this.state.rests.map((item) => {
                          return <tr key={item._id} style={{height: '30px'}} onClick={() => this.viewDetail(item.num)}>
                                    <td style={{width: '5%'}}> {item.num} </td>
                                    <td style={{width: '40%', paddingLeft: 20}}> {item.name} </td>
                                    <td style={{width: '40%', paddingLeft: 20}}> {item.loc} </td>
                                    <td style={{width: '5%', textAlign: 'center'}}> 
                                      <FavoriteBorderIcon style={{display: item.fav.indexOf(this.props.auth.email) > -1?'none':'block'}} onClick={(e) => this.setFav(e, item._id, true)}/>
                                      <FavoriteIcon style={{display: item.fav.indexOf(this.props.auth.email) > -1?'block':'none'}} onClick={(e) => this.setFav(e, item._id, false)}/> 
                                    </td>                        
                                    <td style={{width: '5%', textAlign: 'center'}}> 
                                      <EditIcon style={{display: item.email===this.props.auth.email?'block':'none'}} onClick={(e) => this.editItem(e, item.num)}/>
                                      <NotInterestedIcon style={{display: item.email===this.props.auth.email?'none':'block'}} />
                                    </td>
                                    <td style={{width: '5%', textAlign: 'center'}}> 
                                      <DeleteOutlineIcon style={{display: item.email===this.props.auth.email?'block':'none'}} onClick={(e) => this.removeOneItem(e, item._id)}/>
                                      <NotInterestedIcon style={{display: item.email===this.props.auth.email?'none':'block'}} />
                                    </td>
                                  </tr>
                        })
                      }                    
                    </tbody>
                  </table>
                </div>
                <div className="row">
                  <div style={{width: 'auto', margin: '20px auto 0px', height: 'auto'}}>
                    <button className="w3-button w3-border w3-round w3-xlarge" onClick={this.firstPage}> {'|<'} </button>
                    <button className="w3-button w3-border w3-round w3-xlarge" onClick={this.prevPage} style={{marginLeft: '15px'}}> {'<'} </button>
                    <button className="w3-button w3-border w3-round w3-xlarge" style={{width: '100px',marginLeft: '15px'}}> {this.state.curPage + ' / ' + this.state.totalPage } </button>
                    <button className="w3-button w3-border w3-round w3-xlarge" onClick={this.nextPage} style={{marginLeft: '15px'}}> {'>'} </button>
                    <button className="w3-button w3-border w3-round w3-xlarge" onClick={this.lastPage} style={{marginLeft: '15px'}}> {'>|'} </button>
                  </div>
                </div>
              </div>
          </div>
          <Modal curPage={this.state.curPage} nameFilter={this.state.nameFilter} locFilter={this.state.locFilter}
            favFilter={this.state.favFilter} auth={this.props.auth} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
