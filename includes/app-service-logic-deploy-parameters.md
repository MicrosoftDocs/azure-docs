With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called Parameters that contains all of the parameter values.
You should define a parameter for those values that will vary based on the project you are deploying or based on the 
environment you are deploying to. Do not define parameters for values that will always stay the same. Each parameter value is used in the template to define the resources that are deploy. 

When defining parameters, use the **allowedValues** field to specify which values a user can provide during deployment. Use the **defaultValue** field to assign a value to the parameter, if no value is provided 
during deployment.

We will describe each parameter in the template.

### logicAppName

The name of the logic app to create.

    "logicAppName": {
        "type": "string"
    }

### svcPlanName

The name of the App Service plan to create for hosting the logic app.
    
    "svcPlanName": {
        "type": "string"
    }

### sku

The pricing tier for the logic app.

    "sku": {
        "type": "string",
        "defaultValue": "Standard",
        "allowedValues": [
            "Free",
            "Basic",
            "Standard",
            "Premium"
        ]
    }

The template defines the values that are permitted for this parameter (Free, Basic, Standard, or Premium), and assigns a default value (Standard) if no value is specified.

### svcPlanSize

The instance size of the app.

    "svcPlanSize": {
        "defaultValue": "0",
        "type": "string",
        "allowedValues": [
            "0",
            "1",
            "2"
        ]
    }

The template defines the values that are permitted for this parameter (0, 1, or 2), and assigns a default value (0) if no value is specified. The values correspond to small, medium and large.
