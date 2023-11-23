const roleVerificationMiddleware = (requiredRole) => {
    return async (req, res, next) => {
      try {
        const userRole = req.decoded.role;
  
        if (userRole !== requiredRole) {
          return res.status(403).json({
            error: true,
            message: `Forbidden: User must have the role '${requiredRole}'.`,
          });
        }
  
        next();
      } catch (error) {
        console.error('Role verification error:', error);
        res.status(500).json({
          error: true,
          message: 'Internal Server Error during role verification.',
        });
      }
    };
  };
  
  export default roleVerificationMiddleware;
  