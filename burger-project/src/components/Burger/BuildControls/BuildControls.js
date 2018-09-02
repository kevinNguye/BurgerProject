import React from 'react';
import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    { label: 'Salad', type: 'salad' }, 
    { label: 'Bacon', type: 'bacon' }, 
    { label: 'Cheese', type: 'cheese' }, 
    { label: 'Meat', type: 'meat' }
];

const buildControls = ( props ) => (
    <div className={classes.BuildControls}>
        {controls.map(control => (
            <BuildControl 
                added={() => props.ingredientsAdded(control.type)}
                removed={() => props.ingredientsRemoved(control.type)}
                label={control.label}
                key={control.label}/>
        ))}
    </div>
);

export default buildControls;