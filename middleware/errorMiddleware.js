const catchError = (error, req, res, next) => {
    console.error("An error occurred:", error);
    next(error);
  };
  
  export default catchError;
  