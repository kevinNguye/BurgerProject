import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../Aux/Aux';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

    state = {
        showSideDrawer: false
    }

    sideDrawerCloseHandler = () => {
        this.setState({
            showSideDrawer: false
        }); 
    };

    sideDrawerToggleHandler = () => {
        this.setState((prevState) => {
            return {showSideDrawer: !prevState.showSideDrawer};
        });
    };




    render () {
        return (
            <Aux>
                <Toolbar
                    drawToggled={this.sideDrawerToggleHandler}
                    isAuthenticated={this.props.loggedIn}/>
                <SideDrawer
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerCloseHandler}
                    isAuthenticated={this.props.loggedIn}/> 

                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }

}

const mapStateToProps = ( state ) => {
    return {
        loggedIn: state.auth.token !== null
    };
};

export default connect(mapStateToProps) (Layout);