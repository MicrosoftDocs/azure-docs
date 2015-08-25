With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called Parameters that contains all of the parameter values.
You should define a parameter for those values that will vary based on the project you are deploying or based on the 
environment you are deploying to. Do not define parameters for values that will always stay the same. Each parameter value is used in the template to define the resources that are deployed. 

We will describe each parameter in the template.

### gatewayName

The name of the gateway. The API app gets registered to this gateway.

    "gatewayName": {
      "type": "string"
    }

### apiAppName

The name of the API app to create. The name must contain at least 8 characters and no more than 50 characters.
    
    "apiAppName": {
      "type": "string"
    }

### apiAppSecret

The secret for the API app. This value must be a base64-encoded string. It should be a random string with 64 characters, and consist of only integers and lowercase characters.

    "apiAppSecret": {
      "type": "securestring"
    }

### location

The location for the new API app. You can get valid locations by running the PowerShell command `Get-AzureLocation` or the Azure CLI command `azure location list`.

    "location": {
      "type": "string"
    }

