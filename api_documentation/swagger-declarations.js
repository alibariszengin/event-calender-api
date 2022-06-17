function swagger_calendar_get(req, res, next) {
    /* 	#swagger.tags = ['Calendar']
        #swagger.description = 'Endpoint to get the calendar of user'
         #swagger.security = [{ "Authorization": [] }],
*/  
    next();
}
function swagger_calendar_add(req, res, next) {
     /* 	#swagger.tags = ['Calendar']
        #swagger.description = 'Endpoint to add item to calendar of user'
         #swagger.security = [{ "Authorization": [] }],
         #swagger.parameters['CalendarItem'] = {
            'in': 'body',
            'required': true,
            'description':"User İnfos",
            'schema':{
                '$type':'string',
                '$title':'string',
                '$description':"string@gmail.com",
                '$startTime':"January 1, 2022 09:00:00",
                '$endTime':"January 1,2022 10:00:00"
            }

        }
*/  
    next();
}
function swagger_calendar_edit(req, res, next) {
    /* 	#swagger.tags = ['Calendar']
       #swagger.description = 'Endpoint to edit item to calendar of user'
        #swagger.security = [{ "Authorization": [] }],
        #swagger.parameters['CalendarItem'] = {
           'in': 'body',
           'required': true,
           'description':"User İnfos",
           'schema':{
               '$type':'string',
               '$title':'string',
               '$description':"string@gmail.com",
               '$startTime':"January 1, 2022 12:00:00",
               '$endTime':"January 1, 2022 13:00:00"
           }

       }
*/  
   next();
}
function swagger_profile(req, res, next) {

   
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to get the profile of specific user'
         #swagger.security = [{ "Authorization": [] }],
*/
  next();

}

function swagger_logout(req, res, next) {
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to log out a specific user'
        #swagger.security = [{ "Authorization": [] }],

*/ next();
}

function swagger_register(req, res, next) {
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to sign in a specific user'
        
        #swagger.parameters['User'] = {
            'in': 'body',
            'required': true,
            'description':"User İnfos",
            'schema':{
                '$name':'string',
                '$username':'string',
                '$email':"string@gmail.com",
                '$password':"string",
                '$passwordCheck':"string"
            }

        }

        #swagger.responses[200] = { 
            'schema':{
                'type':'object',
                'access_token':"string"
                
            },
            description: 'User registered successfully.'
        } 
        #swagger.responses[400] = { 
            
            description: "User could not registered. Check the credentials." 
        } 
     */
  next();
}
function swagger_login(req, res, next) {
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to sign in a specific user' 
        
        #swagger.parameters['User Validations'] = {
            'in': 'body',
            'required': true,
            'description':"User İnfos",
            'schema':{
                '$username':'string',
                '$password':"string"
                
            }

        }    

        #swagger.responses[200] = { 
            'schema':{
                'type':'object',
                'access_token':"string"
                
            },
            description: 'User login successfully.'
        } 
        #swagger.responses[400] = { 
            
            description: "User could not login. Check the credentials." 
        } 
    */
  next();
}

function swagger_forgot_password(req, res, next) {
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to sign in a specific user'

        #swagger.parameters['Forgot Password'] = {
            'in': 'body',
            'required': true,
            'description':"Forgot Password Request",
            'schema':{
                
                'username':'string',
                'email':"string"
            }

        }
*/ next();
}

function swagger_reset_password(req, res, next) {
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to sign in a specific user'

         #swagger.parameters['resetPasswordToken'] = {
            'in': 'query',
            'required': true,
            'description':"Reset Password",
            'schema':{
                
                'username':'string',
                'email':"string"
            }

        }
*/ next();
}

function swagger_edit(req, res, next) {
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to sign in a specific user'
        #swagger.security = [{ "Authorization": [] }],
        #swagger.parameters['User'] = {
            'in': 'body',
            'required': true,
            'description':"User Edit Infos",
            'schema':{
                name:"string",
                username:"string",
                events:{
                    'event-name':"string",
                    'start-date':"Date",
                    'end-date':"Date"
                },
                title:"string"
            }

        }

        #swagger.responses[200] = { 
            
            description: 'User edited successfully.'
        } 
        #swagger.responses[400] = { 
            
            description: "User could not edit. " 
        } 
         #swagger.responses[500] = { 
            
            description: "User could not edit. " 
        } 
         #swagger.responses[401] = { 
            
            description: "User could not edit. " 
        } 
*/
  next();
}

module.exports = {
    swagger_profile,
    swagger_logout,
    swagger_register,
    swagger_login,
    swagger_forgot_password,
    swagger_reset_password,
    swagger_edit,
    swagger_calendar_get,
    swagger_calendar_add,
    swagger_calendar_edit
}