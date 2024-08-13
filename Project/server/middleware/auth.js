const JWT = require("jsonwebtoken");
const { STATUS_CODES } = require("http");


module.exports  = (options={})=>
{
        return func (req,res,next)
        {
            try {
                const { jwt } = req.cookies;
                if(!jwt)
                {
                    return res.status(401).json({
                        error: STATUS_CODES[401],
                        message: "User not signed in",
                        statusCode: 401,
                      });
                }
            const decodedData = JWT.verify(jwt, process.env.JWT_SECRET);

        const { data } = decodedData;
       
            if (options.adminOnly && data.userType !== UserType.ADMIN)
                return res.status(401).json({
                  error: STATUS_CODES[401],
                  message: "User not authorized",
                  statusCode: 401,
             });
             Object.assign(req, { userData: decodedData.data });
      next();

            } catch (error) {
                
            }
        }

    }