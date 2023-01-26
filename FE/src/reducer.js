import auth from './reducers/auth_reducer';
import main from './reducers/main_reducer';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  auth: auth,
  main: main,
  router: routerReducer
});
