import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = ( props ) => {

    let items = null;

    if(props.isLoggedIn) {
        items = (
            <ul className={classes.NavigationItems} onClick={props.linkClicked}>
                <NavigationItem link="/" exact>Burger Builder</NavigationItem>
                <NavigationItem link="/orders">Order</NavigationItem>   
                <NavigationItem link="/logout">Log Out</NavigationItem>
            </ul>   
        )
        
    } else {

        items = (
            <ul className={classes.NavigationItems} onClick={props.linkClicked}>
                <NavigationItem link="/" exact>Burger Builder</NavigationItem>
                <NavigationItem link="/auth">Log In</NavigationItem>
            </ul>   
        );
    }
    return items;

}

export default navigationItems;