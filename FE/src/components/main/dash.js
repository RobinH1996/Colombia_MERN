import React from 'react';
import { connect } from 'react-redux';
import back from '../../assets/images/back.gif';

const mapStateToProps = state => {
  return {
    email: state.auth.email
  }};  

const mapDispatchToProps = dispatch => ({
  
});

class Dash extends React.Component {
  componentWillReceiveProps(nextProps) {

  }

  componentWillMount() {
      window.scrollTo({top: 0, behavior: 'smooth'});    
  }

  render() {
    return (
      <div className="row">
            <img src={back} width='100%' height='auto'/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dash);
