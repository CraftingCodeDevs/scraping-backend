const success = (req, res, message, status) => {
    let statusCode = status || 200;
    let statusMessage = message || '';

    res.status(statusCode).send({
        error: false,
        status: statusCode, 
        body: statusMessage,
    });
} 
const err = (req, res, error, status, details) => {
    let statusCode = status || 500;
    let statusMessage = error || 'Internal server error';

    console.error('[Response error] ' + error);
    res.status(statusCode).send({
        error: 'Ocurrio un error inesperado',
        status: statusCode,  
        body: statusMessage,
});
} 

module.exports = {
    
    success,
    err
    
}