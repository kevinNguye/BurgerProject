import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';
import * as actionCreators from '../../../store/actions/order';
import withErrorHandler from '../../../hoc/WithErrorHandler/WithErrorHandler';

class ContactData extends Component {

    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value:'',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value:'',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            PostCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Post Code'
                },
                value:'',
                validation: {
                    required: true,
                    minLength: 4,
                    maxLength: 4
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'email',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Email'
                },
                value:'',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            }, 
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}]
                },
                validation: {
                },
                valid: true,
                value: 'fastest'
            },
        },
        formIsValid: false,
        loading: false
    }

    orderHandler = ( event ) => {
        //prevents your page from refreshing
        event.preventDefault(); 
 
        const orderForm = {};
        for(let formID in this.state.orderForm) {
            orderForm[formID] = this.state.orderForm[formID].value;
        }

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            contactDetails: orderForm,
            userId: this.props.userId
        };

        this.props.onOrderClicked(order, this.props.token);

    }

    inputChangeHandler = (event, inputIdentifier) =>{
        //... not a deep clone
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        
        let formIsValid = true;
        for(let formID in updatedOrderForm) {
            formIsValid = updatedOrderForm[formID].valid && formIsValid;
        }
        console.log(formIsValid);
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        this.setState({
            orderForm: updatedOrderForm,
            formIsValid: formIsValid
        });

    }

    checkValidity ( value, rules ) {
        let isValid = true;
        if(rules.required) {
            isValid = value.trim() !== "" && isValid;
        }

        if(rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if(rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }

    render () {

        const formElementConfig = [];
        for(let key in this.state.orderForm) {
            formElementConfig.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>  
                {formElementConfig.map((formElement) => {
                    return (
                        <Input
                            key={formElement.id}
                            elementType={formElement.config.elementType}
                            elementConfig={formElement.config.elementConfig}
                            changed={(event) => this.inputChangeHandler(event, formElement.id)}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            value={formElement.config.value}
                            touched={formElement.config.touched}
                            valueType={formElement.id}/>
                    );
                })}
                <Button buttonType="Success" disabled={!this.state.formIsValid}> ORDER </Button>
            </form>
        );
        if(this.props.loading) {
            form = <Spinner />
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
               {form}
            </div>
        );
    }
}


const mapStateToProps = ( state ) => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = ( dispatch ) => {
    return {
        onOrderClicked: (orderData, token) => dispatch(actionCreators.purchaseBurger(orderData, token))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData,axios));
