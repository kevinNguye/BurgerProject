import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class  ContactData extends Component {

    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postCode: '',
        },
        loading: false
    }


    orderHandler = (event) => {
        //prevents your page from refreshing
        event.preventDefault();

        this.setState({
            loading: true
        });
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            customer: {
                name: 'Kevin',
                address: {
                    street: 'Bob Street',
                    zipCode: '2131',
                    country: 'Australia'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        };

        axios.post('/orders.json', order)
            .then((response) => {
                this.setState({
                    loading: false,
                    purchasing: false
                });
                this.props.history.push('/');
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    loading: false,
                    purchasing: false
                });
            });

    }

    render () {
        let form = (
            <form>
                <Input inputtype="input" type="text" name="name" placeholder="Your Name"/>
                <Input inputtype="input" type="email" name="email" placeholder="Your Email"/>
                <Input inputtype="input" type="text" name="street" placeholder="Street"/>
                <Input inputtype="input" type="text" name="postal" placeholder="Postal Code"/>
                <Button buttonType="Success" clicked={this.orderHandler}>
                    ORDER </Button>
            </form>
        );
        if(this.state.loading) {
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


export default ContactData;
