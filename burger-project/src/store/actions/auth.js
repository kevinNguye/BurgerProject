import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId ) => {

    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId
    };
};

export const authFailed = ( error ) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate'); 
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = ( expirationTime ) => {
    return ( dispatch ) => {
        setTimeout(() => {
            dispatch(logout());
        } ,expirationTime*1000   );
    };
};

export const auth = ( email, password, isSignUp ) => {
    return ( dispatch ) => {

        dispatch(authStart());

        const payLoad = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDUNDfv7JX9MjeRirTFOCTitby3aIrbTxo";
        if(!isSignUp) {
            url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDUNDfv7JX9MjeRirTFOCTitby3aIrbTxo";
        }

        axios.post(url, payLoad)
        .then((response) => {

            console.log(response);
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000)
            localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userId', response.data.localId);
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(checkAuthTimeout(response.data.expiresIn));
        })
        .catch((error) => {
            console.log(error.response);
            dispatch(authFailed(error.response.data.error));
        }); 
       
    }
}

export const setAuthRedirectPath = ( path ) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path 
    };
};

export const authCheckState = () => {
    console.log("auth checking");
    return (dispatch) => {
        const token = localStorage.getItem('token');
        if(!token) {
            dispatch(logout());
        } else {
            const expirationTime = new Date(localStorage.getItem('expirationDate'));
            if(expirationTime <= new Date().getTime()){
                 dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId)); 
                dispatch(checkAuthTimeout( (expirationTime.getTime() - new Date().getTime()) / 1000));
            }
        }
    };
};