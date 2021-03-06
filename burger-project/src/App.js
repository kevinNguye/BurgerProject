import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter   } from 'react-router-dom';

import * as actionCreators from './store/actions/index';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout'; 

class App extends Component {

  componentDidMount () {
    this.props.onTryAutoSignUp();
  }
    
   
  render() {

    let routes = (
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/" component={BurgerBuilder} />
      </Switch>
    );

    if (this.props.isAuthenticated) {
       routes = (
        <Switch>
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" component={Orders} />
          <Route path="/logout" component={Logout} />
          <Route path="/" component={BurgerBuilder} />
        </Switch>
       );
    }

    return (
      <div>
        <Layout>
          {routes}  
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = ( state ) => {
  return {
    isAuthenticated: state.auth.token !== null
  };

};

const mapDispatchToProps = ( dispatch ) => {
  return {
     onTryAutoSignUp: () => dispatch(actionCreators.authCheckState())
  };
};
 
export default withRouter(connect(mapStateToProps , mapDispatchToProps) (App));
