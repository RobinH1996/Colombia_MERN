import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    email: state.auth.email
  }};

const mapDispatchToProps = dispatch => ({
  
});

class Favorite extends React.Component {
  componentWillReceiveProps(nextProps) {

  }

  componentWillMount() {
    if(!this.props.email)
      this.props.history.push('/');
    else
      window.scrollTo({top: 0, behavior: 'smooth'});    
  }

  render() {
    return (
      <div> SighUp </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorite);
