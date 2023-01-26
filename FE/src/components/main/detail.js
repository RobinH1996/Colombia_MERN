import React from 'react';
import { connect } from 'react-redux';
import { SET_SEL_NUM } from '../../constants/actionTypes';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
const mapStateToProps = state => {
  return {
      selNum: state.main.selNum,
      rests: state.main.rests,
      auth: state.auth
  }
};

const mapDispatchToProps = dispatch => ({
  setSelNum: (data) => dispatch({type: SET_SEL_NUM, data})
});

class Detail extends React.Component {

  componentWillMount = () => {
    if(!this.props.selNum){
      this.props.history.push('/home'); 
    }
  }
  
  backToHome = () => {
    this.props.setSelNum(false);
    this.props.history.push('/home');
  }

  render() {
    if(this.props.selNum){
      const detail = this.props.rests[this.props.selNum-1];
      return (
        <div className="outer_container">
              <div className="main_container" style={{padding: '50px 0px 150px'}}>
                  <div className="ssu_container w3-card-4">
                      <div className="ssu_txt1" style={{marginTop: '100px'}}>
                          <span><AccountBalanceIcon style={{fontSize: '70px', marginTop: '-10px', marginRight: '40px'}}/></span>
                          {detail.name}
                      </div>
                      <div className="ssu3_body row">
                        <div className="col-md-6 col-sm-12">
                          <h1> location : {detail.loc} </h1>
                          <br/><br/>
                          <h1> Added by : {detail.email!==""?detail.email: "Manager"}</h1>
                        </div>
                        <div className="col-md-6 col-sm-12 w3-center">                        
                          <FavoriteBorderIcon style={{fontSize: '200px', color: 'red', display: detail.fav.indexOf(this.props.auth.email) > -1?'none':'block'}}/>
                          <FavoriteIcon style={{fontSize: '200px',  color: 'red',display: detail.fav.indexOf(this.props.auth.email) > -1?'block':'none'}}/> 
                        </div>
                      </div>  
                      <hr style={{margin: '60px 0px 0px'}}/>
                      <div className="row ssu_bottom" style={{paddingBottom: '50px'}}>
                          <button className="ssu_button" onClick={this.backToHome}> {"<< BACK"} </button>
                      </div>
                  </div>
              </div>
          </div>
      );}
      return null;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
