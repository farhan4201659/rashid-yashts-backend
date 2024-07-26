export const catchAsyncError = (recFunc)=>{
  return (req , res , next) => {
    Promise.resolve(recFunc(req , res , next)).catch(next);
  }
}