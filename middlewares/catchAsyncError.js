export const catchAsyncError = (passedFunction) =>(req,res,next) =>{
    try{
        passedFunction(req,res,next);
    }catch(err){
        next(err)
    }
}