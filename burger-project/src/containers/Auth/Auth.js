import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Button from '../../components/UI/Button/Button'; 
import Input from '../../components/UI/Input/Input'; 
import classes from './Auth.css';
import * as actionCreators from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Auth extends Component {


    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Email'
                },
                value:'',
                validation: { 
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'password'
                },
                value:'',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false 
            }
        },
        isSignUp: true
    }

    componentDidMount () {
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath('/');
        }
    }
    
    inputChangeHandler = ( event, controlId ) => {
        const updatedControls = {
            ...this.state.controls, 
            [controlId]: {
                ...this.state.controls[controlId],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlId].validation),
                touched: true
            }
        };

        this.setState({
            controls: updatedControls
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

        if(rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid;
        }
        return isValid;
    }

    submitHandler = ( event ) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
    }


    switchAuthModeHandler = () => {

        this.setState((prevState) => {
            return {
                isSignUp: !prevState.isSignUp
            }
        });
    }

    render () {

        const formElementArray = [];
        for(let key in this.state.controls) {

            formElementArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }



        let form  = formElementArray.map((formElement) => (
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
        ));

        if(this.props.loading) {
            form = <Spinner />;
        }

        let errorMessage = null;

        if(this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }

        let authenticated = null;
        if(this.props.isAuth) {
            authenticated = <Redirect to={this.props.authRedirectPath} /> 
        }        

        return (
            <div className={classes.Auth}>
                {authenticated}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button buttonType="Success">SUBMIT</Button>
                </form>

                <Button
                    clicked={this.switchAuthModeHandler} 
                    buttonType="Danger">SWITCH TO {this.state.isSignUp ? 'SIGN IN': 'SIGN UP'}</Button>
            </div>

        );
    }

};

const mapStateToProps = ( state ) => {
    return {
          loading: state.auth.loading,
          error: state.auth.error,
          isAuth: state.auth.token !== null,
          buildingBurger: state.burgerBuilder.building,
          authRedirectPath: state.auth.authRedirectPath
    };  
};

const mapDispatchToProps = ( dispatch ) => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actionCreators.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: (path) => dispatch(actionCreators.setAuthRedirectPath(path))
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (Auth); 