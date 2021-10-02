const sucRes =  function (result, message){
    return{
        success: true,
        messages: message, //message want to display
        results: result //explain content data. ex: content of req.body
    }
}
const failRes = function (result, message){
    return {
        success: false,
        messages: message,
        results: result
        
    }
}
module.exports = {sucRes, failRes};
