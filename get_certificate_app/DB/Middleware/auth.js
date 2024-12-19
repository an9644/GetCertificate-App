//commmon cookie handling method
import jwt from 'jsonwebtoken' 
import dotenv from 'dotenv';
 
dotenv.config();
const secretkey=process.env.Secretkey


const authenticate=(req,res,next)=>{
   const cookies= req.headers.cookie;//cookies create 
    console.log(cookies)
    const cookie=cookies.split(';');
    for(let cooki of cookie){   //2 variabe authtoken name and token they are stored in different arrays 
        const [name,token]=cooki.trim().split('=')
        if(name=='authToken'){
            //to verify the token using the inbuilt function in jwt jwt.verify(token stored veriable and secretkey)
            const verified= jwt.verify(token,secretkey)
            console.log(verified)
           

            req.UserName=verified.UserName;
            req.Role=verified.Role
            break;
        }
        }
        next();

    }

export{authenticate}
