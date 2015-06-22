With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called Parameters that contains all of the parameter values.
You should define a parameter for those values that will vary based on the project you are deploying or based on the 
environment you are deploying to. Do not define parameters for values that will always stay the same. Each parameter value is used in the template to define the resources that are deploy. 

We will describe each parameter in the template.

### gatewayName

The name of the gateway you wish to create. The API app gets registered to this gateway.

    "gatewayName": {
      "type": "string"
    }

### apiAppName

The name of the API app to create.
    
    "apiAppName": {
      "type": "string"
    }

### apiAppSecret

The secret for the API app. This value must be a base64-encoded string.

    "apiAppSecret": {
      "type": "securestring"
    }

### location

The location for the new API app.

    "location": {
      "type": "string"
    }

