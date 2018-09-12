import React from 'react';
import classes from './Input.css';

const input = ( props ) => {

    let inputElement = null;
    let validationError = null;
    const inputClasses = [classes.InputElement];

    if(props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
        validationError = <p className={classes.ValidationError}>Please Enter a Valid {props.valueType}!</p>;
    }

``
    switch(props.elementType) {
        case('input'):
            inputElement = <input
                className={inputClasses.join(" ")}
                {...props.elementConfig}
                onChange={props.changed}
                value={props.value}/>;
            break;
        case('textArea'):
            inputElement = <textarea
                className={inputClasses.join(" ")}
                onChange={props.changed}
                {...props.elementConfig}
                value={props.value}/>;
            break;

        case('select'):
            inputElement = (
                <select
                    className={inputClasses.join(" ")}
                    onChange={props.changed}
                    value={props.value}>
                    {props.elementConfig.options.map(option => (
                        <option
                            value={option.value}
                            key={option.value}>{option.displayValue}</option>
                    ))}
                </select>

            );
            break;

        default:
            inputElement = <input
                className={inputClasses.join(" ")}
                {...props.elementConfig}
                onChange={props.changed}
                value={props.value}/>;
    }

    
    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
            {validationError}
        </div>

    );

   
}


export default input;