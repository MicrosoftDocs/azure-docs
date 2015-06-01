With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called Parameters that contains all of the parameter values.
You should define a parameter for those values that will vary based on the project you are deploying or based on the 
environment you are deploying to. Do not define parameters for values that will always stay the same. Each parameter value is used in the template to define the resources that are deploy. 

We will describe each parameter in the template.

### siteName

The name of the site you wish to create.

    "siteName":{
      "type":"string"
    }

### hostingPlanName

The name of the hosting plan to use for creating the web app.
    
    "hostingPlanName":{
      "type":"string"
    }

### siteLocation

The location to use for creating the web app. It must be one of the Azure locations that support web apps. It is used for both the hosting plan and the web app.

    "siteLocation":{
      "type":"string"
    }

### sku

The pricing tier for the hosting plan.

    "sku":{
      "type":"string",
      "allowedValues":[
        "Free",
        "Shared",
        "Basic",
        "Standard"
      ],
      "defaultValue":"Free"
    }

The template defines the values that are permitted for this parameter. You use the **allowedValues** element to specify which values a user of the template can provide during deployment.
The tempalte also defines a default value (Free) if no value is specified.

### workerSize

The instance size of the hosting plan (small, medium, or large).

    "workerSize":{
      "type":"string",
      "allowedValues":[
        "0",
        "1",
        "2"
      ],
      "defaultValue":"0"
    }
    
The template defines the values that are permitted for this parameter and a default value if no value is specified. The values correspond to small, medium and large.
