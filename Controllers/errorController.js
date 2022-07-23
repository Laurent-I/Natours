const AppError = require('./../utils/appError');

const handleCastErrorDB = err =>{
    const message = `Invalid ${err.path}: ${err.path}`;
    return new AppError(message, 400);
}
 const handleDuplicateErrorDB = err =>{
     // err.keyValue = undefined;
     console.log(JSON.stringify(err.keyValue));
     const value =JSON.stringify(err.keyValue).match(/[^"{}]/gi).join("");
     const message = `Duplicate field ${value} Please use another value`
     // console.log(value);
     // console.log(err);
     return new AppError(message, 400);
 }

 const handleValidationErrorDB = err =>{
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
 }

 const handleJSONWebTokenErrorDB = () => new AppError('Invalid Token please Login again', 404)

const handleTokenExpiredErrorDB = () => new AppError('Your token has expired, Login again', 401);

const sendErrorDev = (err, res) =>{
    res.status(err.statusCode) .json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) =>{
    //Operational, trusted error: Send message to client
    if(err.isOperational){
        res.status(err.statusCode) .json({
            status: err.status,
            message: err.message
        });
        //Programming or other unknown error: don't leak error details
    }else{
        //1) Log Error
        console.error('ERROR 💥💥', err);

        //2) Send generic Message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        })
    }

};

module.exports = (err, req, res, next) =>{
    // console.log(err.stack)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    }else if(!(process.env.NODE_ENV === 'development')){
        let error = {...err};

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateErrorDB(error);
        if(error.name === "ValidationError") error = handleValidationErrorDB(error);
        if(error.name === 'JSONWebTokenError') error = handleJSONWebTokenErrorDB(error);
        if(error.name === 'TokenExpiredError') error = handleTokenExpiredErrorDB(error);
        sendErrorProd(error, res);
    }

};