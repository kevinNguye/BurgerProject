import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.4,
    bacon: 1.7
};

class BurgerBuilder extends Component {

    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchaseable: false,
        purchasing: false
    }

    updatePurchaseOrder = ( ingredients ) => {
   
        let sum = 0;
        for(let key in ingredients) {
            sum += ingredients[key];
        }
        this.setState({
            purchaseable: sum > 0
        });
        
    };

    purchaseContinueHandler = () => {
        alert('You can continue!');
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


    addIngredientHandler = ( type ) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newPrice
        });
        this.updatePurchaseOrder(updatedIngredients);
    };

    removeIngredientHandler = ( type ) => {
        const oldCount = this.state.ingredients[type];

        if(oldCount <= 0) {
            return;
        }

        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newPrice
        })
        
        this.updatePurchaseOrder(updatedIngredients);
    };


    render() { 

        let disabledInfo = {
            ...this.state.ingredients
        };

        for(let key in disabledInfo) {
           disabledInfo[key] = disabledInfo[key] <= 0
        };
 
        return (
            <Aux>
                <Modal
                    closeModal={this.closeModalHandler}
                    show={this.state.purchasing}>
                    <OrderSummary
                        price={this.state.totalPrice}
                        cancel={this.closeModalHandler}
                        continue={this.purchaseContinueHandler}
                        ingredients={this.state.ingredients}/>
                </Modal>

                <Burger ingredients={this.state.ingredients}/>
                <BuildControls
                    ingredientsAdded={this.addIngredientHandler}
                    ingredientsRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchaseable={this.state.purchaseable}
                    price={this.state.totalPrice}
                    ordered={this.purchaseHandler}/>
            </Aux>
        );
    }
}

export default BurgerBuilder;