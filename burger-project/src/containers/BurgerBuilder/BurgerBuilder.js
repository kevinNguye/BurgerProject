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
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        loading: false
    }

    componentDidMount () {
        // axios.get('ingredients.json')
        //     .then((response) => {
        //         this.setState({
        //             ingredients: response.data
        //         });
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });
    }

    updatePurchaseOrder = ( ingredients ) => {
   
        let sum = 0;
        for(let key in ingredients) {
            sum += ingredients[key];
        }
        // this.setState({
        //     purchaseable: sum > 0
        // });
        return sum > 0;
        
    };

    purchaseContinueHandler = () => {

        this.props.history.push('/checkout');

    };

    closeModalHandler = () => {
        this.setState({
            purchasing: false
        });
    };

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        });
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
        if(this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls
                        ingredientsAdded={this.props.onIngredientAdded}
                        ingredientsRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchaseable={this.updatePurchaseOrder(this.props.ings)}
                        price={this.props.currentPrice}
                        ordered={this.purchaseHandler}/>
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
        ings: state.ingredients,
        currentPrice: state.totalPrice
    }
};

const mapDispatchToProps = ( dispatch ) => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));