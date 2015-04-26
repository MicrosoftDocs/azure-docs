<properties
   pageTitle="Authoring Azure Resource Manager Templates"
   description="Create Azure Resource Manager templates using declarative JSON syntax to deploy applications to Azure."
   services="na"
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="na"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="AzurePortal"
   ms.workload="na"
   ms.date="04/23/2015"
   ms.author="tomfitz"/>

# Authoring Azure Resource Manager Templates

Azure applications typically require a combination of resources (such as a database server, database, or website) to meet the desired goals. Rather than deploying and managing each resource separately, you can create an Azure Resource Manager template that deploys and provisions all of the resources for your application in a single, coordinated operation. In the template, you define the resources that are needed for the application and specify deployment parameters to input values for different environments. The template consists of JSON and expressions which you can use to construct values for your deployment.

## Template format

The following example shows the sections that make up the basic structure of a template.

    {
       "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
       "contentVersion": "",
       "parameters": {  },
       "variables": {  },
       "resources": [  ],
       "outputs": {  }
    }

| Element name   | Required | Description
| :------------: | :------: | :----------
| $schema        |   Yes    | Location of the JSON schema file that describes the version of the template language.
| contentVersion |   Yes    | Version of the template (such as 1.0.0.0). When deploying resources using the template, this value can be used to make sure that the right template is being used.
| parameters     |   No     | Values that are provided when deployment is executed to customize resource deployment.
| variables      |   No     | Values that are used as JSON fragments in the template to simplify template language expressions.
| resources      |   Yes    | Types of services that are deployed or updated in a resource group.
| outputs        |   No     | Values that are returned after deployment.

We will examine the sections of the template in greater detail later in this topic. For now, we will review some of the syntax that makes up the template.

## Expressions and functions

The basic syntax of the template is JSON; however, expressions and functions extend the JSON that is available in the template and enable you to create values that are not strict literal values. Expressions are enclosed with brackets ([ and ]), and are evaluated when the template is deployed. Expressions can appear anywhere in a JSON string value and always return another JSON value. If you need to use a literal string that starts with a bracket [, you must use two brackets [[.

Typically, you use expressions with functions to perform operations for configuring the deployment. Just like in JavaScript, function calls are formatted as **functionName(arg1,arg2,arg3)**. You reference properties by using the dot and [index] operators.

The following list shows common functions.

- **parameters**

    Returns a parameter value that is provided when the deployment is executed.

- **variables**

    Returns a variable that is defined in the template.

- **concat(arg1,arg2,arg3,...)**

    Combines multiple string values. This function can take any number of arguments.

- **base64**

    Returns the base64 representation of the input string.

- **resourceGroup**

    Returns a structured object (with id, name, and location properties) that represents the current resource group.

- **resourceId**

    Returns the unique identifier of a resource.

The following example shows how to use several of the functions when constructing values:
 
    "variables": {
       "location": "[resourceGroup().location]",
       "usernameAndPassword": "[concat('parameters('username'), ':', parameters('password'))]",
       "authorizationHeader": "[concat('Basic ', base64(variables('usernameAndPassword')))]"
    }

We will look at all of the functions in greater detail later in this topic. For now, you know enough about expressions and functions to understand the sections of the template.


## Parameters

In the parameters section of the template, you specify which values a user can input when deploying the resources. You can use these parameter values throughout the template to set values for the deployed resources. Only parameters that are declared in the parameters section can be used in other sections of the template.

Within parameters section, you cannot use a parameter value to construct another parameter value. That type of operation typically happens in the variables section.

You define parameters with the following structure:

    "parameters": {
       "<parameterName>" : {
         "type" : "<type-of-parameter-value>",
         "defaultValue": "<optional-default-value-of-parameter>",
         "allowedValues": [ "<optional-array-of-allowed-values>" ]
       }
    }

| Element name   | Required | Description
| :------------: | :------: | :----------
| parameterName  |   Yes    | Name of the parameter. Must be a valid JavaScript identifier.
| type           |   Yes    | Type of the parameter value. See the list below of allowed types.
| defaultValue   |   No     | Default value for the parameter, if no value is provided for the parameter.
| allowedValues  |   No     | Array of allowed values for the parameter to make sure that the right value is provided.

The allowed types and values are:

- string or secureString - any valid JSON string
- int - any valid JSON integer
- bool - any valid JSON boolean
- object - any valid JSON object
- array - any valid JSON array


>[AZURE.NOTE] All passwords, keys, and other secrets should use the **secureString** type. Template parameters with the secureString type cannot be read after resource deployment. 

The following example shows how to define parameters:

    "parameters": {
       "siteName": {
          "type": "string"
       },
       "siteLocation": {
          "type": "string"
       },
       "hostingPlanName": {
          "type": "string"
       },  
       "hostingPlanSku": {
          "type": "string",
          "allowedValues": [
            "Free",
            "Shared",
            "Basic",
            "Standard",
            "Premium"
          ],
          "defaultValue": "Free"
       }
    }

## Variables

In the variables section, you construct values that can be used to simplify template language expressions. Typically, these variables will be based on values provided from the parameters.

The following example shows how to define a variable that is constructed from two parameter values:

    "parameters": {
       "username": {
         "type": "string"
       },
       "password": {
         "type": "secureString"
       }
     },
     "variables": {
       "connectionString": "[concat('Name=', parameters('username'), ';Password=', parameters('password'))]"
    }

The next example shows a variable that is a complex JSON type, and variables that are constructed from other variables:

    "parameters": {
       "environmentName": {
         "type": "string",
         "allowedValues": [
           "test",
           "prod"
         ]
       }
    },
    "variables": {
       "environmentSettings": {
         "test": {
           "instancesSize": "Small",
           "instancesCount": 1
         },
         "prod": {
           "instancesSize": "Large",
           "instancesCount": 4
         }
       },
       "currentEnvironmentSettings": "[variables('environmentSettings')[parameters('environmentName')]]",
       "instancesSize": "[variables('currentEnvironmentSettings').instancesSize",
       "instancesCount": "[variables('currentEnvironmentSettings').instancesCount"
    }

## Resources

In the resources section, you define the resources are deployed or updated.

You define resources with the following structure:

    "resources": [
       {
         "apiVersion": "<api-version-of-resource>",
         "type": "<resource-provider-namespace/resource-type-name>",
         "name": "<name-of-the-resource>",
         "location": "<location-of-resource>",
         "tags": "<name-value-pairs-for-resource-tagging>",
         "dependsOn": [
           "<array-of-related-resource-names>"
         ],
         "properties": "<settings-for-the-resource>",
         "resources": [
           "<array-of-dependent-resources>"
         ]
       }
    ]

| Element name             | Required | Description
| :----------------------: | :------: | :----------
| apiVersion               |   Yes    | Version of the API that supports the resource.
| type                     |   Yes    | Type of the resource. This value is a combination of the namespace of the resource provider and the resource type that the resource provider supports.
| name                     |   Yes    | Name of the resource. The name must follow URI component restrictions defined in RFC3986.
| location                 |   No     | Supported geo-locations of the provided resource.
| tags                     |   No     | Tags that are associated with the resource.
| dependsOn                |   No     | Resources that the resource being defined depends on. The dependencies between resources are evaluated and resources are deployed in their dependent order. When resources are not dependent on each other, they are attempted to be deployed in parallel. The value can be a comma separated list of a resource names or resource unique identifiers.
| properties               |   No     | Resource specific configuration settings.
| resources                |   No     | Child resources that depend on the resource being defined.

If the resouce name is not unique, you can use the **resourceId** helper function (described below) to get the unique identifier for any resource.

The following shows 'Microsoft.Web/sites' and 'Microsoft.Web/sites/extensions' resources example:

    {
       "apiVersion": "2014-06-01",
       "type": "Microsoft.Web/sites",
       "name": "[parameters('siteName')]",
       "location": "[resourceGroup().location]",
       "tags": {
         "environment": "test",
         "team": "ARM"
       },
       "properties": {
         "name": "[parameters('siteName')]",
         "serverFarm": "[parameters('hostingPlanName')]"
       },
       "resources": [
         {
           "apiVersion": "2014-06-01",
           "type": "Extensions",
           "name": "MSDeploy",
           "dependsOn": [
             "[resourceId('Microsoft.Web/sites', parameters('siteName'))]"
           ],
           "properties": {
             "packageUri": "https://auxmktplceprod.blob.core.windows.net/packages/StarterSite-modified.zip",
             "dbType": "None",
             "connectionString": "",
             "setParameters": {
               "Application Path": "[parameters('siteName')]"
             }
           }
         }
       ]
    }

>[AZURE.NOTE] Dependency between a parent resource and nested resources is not implied by the current template schema. Therefore, you must use the **dependsOn** element to note a dependency.

## Outputs

In the Outputs section, you specify values that are returned from deployment. For example, you could return the URI to access a resource deployed using the template.

The following example shows the structure of an output definition:

    "outputs": {
       "<outputName>" : {
         "type" : "<type-of-output-value>",
         "value": "<output-value-expression>",
       }
    }

| Element name   | Required | Description
| :------------: | :------: | :----------
| outputName     |   Yes    | Name of the output value. Must be a valid JavaScript identifier.
| type           |   Yes    | Type of the output value. Output values support the same types as template input parameters.
| value          |   Yes    | Template language expression which will be evaluated and returned as output value.


The following example shows a value that is returned in the Outputs section.

    "outputs": {
       "siteUri" : {
         "type" : "string",
         "value": "[concat('http://',reference(resourceId('Microsoft.Web/sites', parameters('siteName'))).hostNames[0])]"
       }
    }

## Template language functions and operations:

**base64 (inputString)**

Returns the base64 representation of the input string.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| inputString                        |   Yes    | The string value to return as a base64 representation.

The following example show how to use the base64 function.

    "variables": {
      "usernameAndPassword": "[concat('parameters('username'), ':', parameters('password'))]",
      "authorizationHeader": "[concat('Basic ', base64(variables('usernameAndPassword')))]"
    }

**concat (arg1, arg2, arg3, ...)**

Combines multiple string values and returns the resulting string value. This function can take any number of arguments.

The following example shows how to combine multiple values to return a value.

    "outputs": {
        "siteUri": {
          "type": "string",
          "value": "[concat('http://',reference(resourceId('Microsoft.Web/sites', parameters('siteName'))).hostNames[0])]"
        }
    }

**copy**

Enables you to use iterate through an array and use each element when deploying a resource.
   
The following example deploys three web sites named examplecopy-Contoso, examplecopy-Fabrikam, examplecopy-Coho.

    "parameters": { 
      "org": { 
         "type": "array", 
             "defaultValue": [ 
             "Contoso", 
             "Fabrikam", 
             "Coho" 
          ] 
      },
      "count": { 
         "type": "int", 
         "defaultValue": 3 
      } 
    }, 
    "resources": [ 
      { 
          "name": "[concat('examplecopy-', parameters('org')[copyIndex()])]", 
          "type": "Microsoft.Web/sites", 
          "location": "East US", 
          "apiVersion": "2014-06-01",
          "copy": { 
             "name": "websitescopy", 
             "count": "[parameters('count')]" 
          }, 
          "properties": {} 
      } 
    ]

**listKeys (resourceName or resourceIdentifier, [apiVersion])**

Returns the keys of a storage account. This function takes the resourceId and the API version as parameters. The resourceId can be specified by using the resourceId function described above or by using the format 'providerNamespace/resourceType/resourceName'). You can use the function to get the primaryKey and secondaryKey.
  
| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| resourceName or resourceIdentifier |   Yes    | Unique identifier of a storage account.
| apiVersion                         |   Yes    | API version of resource runtime state.

The following example shows how to return the keys from a storage account in the outputs section.

    "outputs": { 
      "exampleOutput": { 
        "value": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), providers('Microsoft.Storage', 'storageAccounts').apiVersions[0])]", 
        "type" : "object" 
      } 
    } 

**nested template**

You can include one template inside of another template by providing the URI of the nested template, as shown below.

    "variables": {"templatelink":"https://www.contoso.com/ArmTemplates/newStorageAccount.json"}, 
    "resources": [ 
      { 
         "apiVersion": "2015-01-01", 
         "name": "nestedTemplate", 
         "type": "Microsoft.Resources/deployments", 
         "properties": { 
           "mode": "incremental", 
           "templateLink": {"uri":"[variables('templatelink')]","contentVersion":"1.0.0.0"}, 
           "parameters": { 
              "StorageAccountName":{"value":"[parameters('StorageAccountName')]"} 
           } 
         } 
      } 
    ] 

**parameters (parameterName)**

Returns a parameter value. The specified parameter name must be defined in the parameters section of the template.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| parameterName                      |   Yes    | The name of the parameter to return.

The following example shows a simplified use of the parameters function.

    "parameters": { 
      "siteName": {
          "type": "string"
      }
    },
    "resources": [
       {
          "apiVersion": "2014-06-01",
          "name": "[parameters('siteName')]",
          "type": "Microsoft.Web/Sites",
          ...
       }
    ]

**provider (providerNamespace, [resourceType])**

Return information about a resource provider and its supported resource types. If not type is provided, all of the supported types are returned.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| providerNamespace                  |   Yes    | Namespace of the provider
| resourceType                       |   No     | The type of resource within the specified namespace.

Each supported type is returned in the following format:

    {
        "resourceType": "",
        "locations": [ ],
        "apiVersions": [ ]
    }

The following example shows how to use the provider function:

    "outputs": {
	    "exampleOutput": {
		    "value": "[providers('Microsoft.Storage', 'storageAccounts')]",
		    "type" : "object"
	    }
    }

**reference (resourceName or resourceIdentifier, [apiVersion])**

Enables an expression to derive its value from another resource's runtime state.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| resourceName or resourceIdentifier |   Yes    | Name or the unique identifier of a resource.
| apiVersion                         |   No     | API version of resource runtime state. Parameter should be used if resource is not provisioned within same template.

The **reference** function derives its value from a runtime state, and therefore cannot be used in the variables section. It can be used in outputs section of a template.

By using the reference expression, you declare that one resource depends on another resource if the referenced resource is provisioned within same template.

    "outputs": {
      "siteUri": {
          "type": "string",
          "value": "[concat('http://',reference(resourceId('Microsoft.Web/sites', parameters('siteName'))).hostNames[0])]"
      }
    }

**resourceGroup()**

Returns a structured object (with id, name, and location properties) that represents the current resource group. The object will be in the following format:

    {
      "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}",
      "name": "{resourceGroupName}",
      "location": "{resourceGroupLocation}",
    }

The following example uses the resource group location to assign the location for a web site.

    "resources": [
       {
          "apiVersion": "2014-06-01",
          "type": "Microsoft.Web/sites",
          "name": "[parameters('siteName')]",
          "location": "[resourceGroup().location]",
          ...
       }
    ]

**resourceId ([resourceGroupName], resourceType, resourceName1, [resourceName2]...)**

Returns the unique identifier of a resource. You use this function when the resource name is ambiguous or not provisioned within same template. The identifier is returned in the following format:

    /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/{resourceProviderNamespace}/{resourceType}/{resourceName}
      
| Parameter         | Required | Description
| :---------------: | :------: | :----------
| resourceGroupName |   No     | Optional resource group name. Default value is current resource group.
| resourceType      |   Yes    | Type of resource including resource provider namespace.
| resourceName1     |   Yes    | Name of resource.
| resourceName2     |   No     | Next resource name segment if resource is nested.

The following examples show how to retrieve the resource id for a web site and a database:

    [resourceId('myWebsitesGroup', 'Microsoft.Web/sites', parameters('siteName'))]
    [resourceId('Microsoft.SQL/servers/databases', parameters('serverName'),parameters('databaseName'))]

**subscription()**

Returns details about the subscription in the following format.

    {
        "id": "/subscriptions/#####"
        "subscriptionId": "#####"
    }

The following example shows the subscription function called in the outputs section. 

    "outputs": { 
      "exampleOutput": { 
          "value": "[subscription()]", 
          "type" : "object" 
      } 
    } 

**variables (variableName)**

Returns the value of variable. The specified variable name must be defined in the variables section of the template.

| Parameter                          | Required | Description
| :--------------------------------: | :------: | :----------
| variable Name                      |   Yes    | The name of the variable to return.


## Complete template
The following template deploys a web app and provisions it with code from a .zip file. 

    {
       "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
       "contentVersion": "1.0.0.0",
       "parameters": {
         "siteName": {
           "type": "string"
         },
         "hostingPlanName": {
           "type": "string"
         },
         "hostingPlanSku": {
           "type": "string",
           "allowedValues": [
             "Free",
             "Shared",
             "Basic",
             "Standard",
             "Premium"
           ],
           "defaultValue": "Free"
         }
       },
       "resources": [
         {
           "apiVersion": "2014-06-01",
           "type": "Microsoft.Web/serverfarms",
           "name": "[parameters('hostingPlanName')]",
           "location": "[resourceGroup().location]",
           "properties": {
             "name": "[parameters('hostingPlanName')]",
             "sku": "[parameters('hostingPlanSku')]",
             "workerSize": "0",
             "numberOfWorkers": 1
           }
         },
         {
           "apiVersion": "2014-06-01",
           "type": "Microsoft.Web/sites",
           "name": "[parameters('siteName')]",
           "location": "[resourceGroup().location]",
           "tags": {
             "environment": "test",
             "team": "ARM"
           },
           "dependsOn": [
             "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]"
           ],
           "properties": {
             "name": "[parameters('siteName')]",
             "serverFarm": "[parameters('hostingPlanName')]"
           },
           "resources": [
             {
               "apiVersion": "2014-06-01",
               "type": "Extensions",
               "name": "MSDeploy",
               "dependsOn": [
                 "[resourceId('Microsoft.Web/sites', parameters('siteName'))]"
               ],
               "properties": {
                 "packageUri": "https://auxmktplceprod.blob.core.windows.net/packages/StarterSite-modified.zip",
                 "dbType": "None",
                 "connectionString": "",
                 "setParameters": {
                   "Application Path": "[parameters('siteName')]"
                 }
               }
             }
           ]
         }
       ],
       "outputs": {
         "siteUri": {
           "type": "string",
           "value": "[concat('http://',reference(resourceId('Microsoft.Web/sites', parameters('siteName'))).hostNames[0])]"
         }
       }
    }


