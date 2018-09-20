import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actionCreators from '../../store/actions/index';


class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        loading: false
    }

    componentDidMount () {
        this.props.onInitIngredients();
        this.props.onInitPrice();
    }

    updatePurchaseOrder = ( ingredients ) => {
   
        let sum = 0;
        for(let key in ingredients) {
            sum += ingredients[key];
        }

        return sum > 0;
        
    };

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    };

    closeModalHandler = () => {
        this.setState({
            purchasing: false
        });
    };

    purchaseHandler = () => {

        if(this.props.isAuthenticated) {
            this.setState({
                purchasing: true
            });
        } else {
            this.props.onSetAuthRedirectPath('/checkout')
            this.props.history.push('/auth');
        }

    };

    render() { 
 
        let disabledInfo = {
            ...this.props.ings
        };

        for(let key in disabledInfo) {
           disabledInfo[key] = disabledInfo[key] <= 0
        };

        let orderSummary = null;
        if(this.props.ings) {
            orderSummary =  <OrderSummary
                price={this.props.currentPrice}
                cancel={this.closeModalHandler}
                continue={this.purchaseContinueHandler}
                ingredients={this.props.ings}/>
        }

        if(this.state.loading) {
            orderSummary = <Spinner />
        }

        let burger = <Spinner/>
        if(this.props.ings && this.props.currentPrice) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls
                        ingredientsAdded={this.props.onIngredientAdded}
                        ingredientsRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchaseable={this.updatePurchaseOrder(this.props.ings)}
                        price={this.props.currentPrice}
                        ordered={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}/>
                </Aux> 
            );
        } 
        
        return (
            <Aux>
                <Modal
                    closeModal={this.closeModalHandler}
                    show={this.state.purchasing}>
                    {orderSummary}
                </Modal>
                {burger}
                
            </Aux>
        );
    }
}

const mapStateToProps = ( state ) => {
    return {
        ings: state.burgerBuilder.ingredients,
        currentPrice: state.burgerBuilder.totalPrice,
        isAuthenticated: state.auth.token !== null 
    }
};

const mapDispatchToProps = ( dispatch ) => {
    return {
        onIngredientAdded: (ingName) => dispatch(actionCreators.addIngredients(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actionCreators.removeIngredients(ingName)),
        onInitIngredients: () => dispatch(actionCreators.initIngredients()),
        onInitPurchase: () => dispatch(actionCreators.purchaseInit()),
        onInitPrice: () => dispatch(actionCreators.initPrice()),
        onSetAuthRedirectPath: (path) => dispatch(actionCreators.setAuthRedirectPath(path))
    }
};

 
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));