import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route, Redirect } from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux/Aux';

class Checkout extends Component {

        cancelledClickedHandler = () => {
            this.props.history.goBack();
        }

        continueClickedHandler = () => {
            this.props.history.replace('/checkout/contact-data');
        }

        render () {
            console.log('[render] purchased is: ' + this.props.purchased);
            let summary = <Redirect to="/"/>;
            
            if(this.props.ingredients) {
                const purchasedRedirect = this.props.purchased ? <Redirect to="/" /> : null;
                summary = (
                    <Aux>
                        {purchasedRedirect}
                        <CheckoutSummary
                            ingredients={this.props.ingredients}
                            cancelled={this.cancelledClickedHandler}
                            continued={this.continueClickedHandler}/>
                        <Route
                            path={this.props.match.path + '/contact-data'}
                            component={ContactData} />
                    </Aux>
                );
            } 
            return summary
        }
}

const mapStateToProps = ( state ) => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
};

export default connect(mapStateToProps)(Checkout);