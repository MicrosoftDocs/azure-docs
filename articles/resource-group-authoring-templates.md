---
title: Authoring Azure Resource Manager Templates | Microsoft Docs
description: Create Azure Resource Manager templates using declarative JSON syntax to deploy applications to Azure.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/24/2016
ms.author: tomfitz

---
# Authoring Azure Resource Manager templates
This topic describes the structure of an Azure Resource Manager template. It presents the different sections of a template and the properties that are available in those sections. The template consists of JSON and expressions that you can use to construct values for your deployment. 

To view the template for resources you have already deployed, see [Export an Azure Resource Manager template from existing resources](resource-manager-export-template.md). For guidance on creating a template, see [Resource Manager Template Walkthrough](resource-manager-template-walkthrough.md). For recommendations about creating templates, see [Best practices for creating Azure Resource Manager templates](resource-manager-template-best-practices.md).

A good JSON editor can simplify the task of creating templates. For information about using Visual Studio with your templates, see [Creating and deploying Azure resource groups through Visual Studio](vs-azure-tools-resource-groups-deployment-projects-create-deploy.md). For information about using VS Code, see [Working with Azure Resource Manager Templates in Visual Studio Code](resource-manager-vs-code.md).

Limit the size your template to 1 MB, and each parameter file to 64 KB. The 1 MB limit applies to the final state of the template after it has been expanded with iterative resource definitions, and values for variables and parameters. 

## Template format
In its simplest structure, a template contains the following elements:

    {
       "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
       "contentVersion": "",
       "parameters": {  },
       "variables": {  },
       "resources": [  ],
       "outputs": {  }
    }

| Element name | Required | Description |
|:---:|:---:|:--- |
| $schema |Yes |Location of the JSON schema file that describes the version of the template language. Use the URL shown in the preceding example. |
| contentVersion |Yes |Version of the template (such as 1.0.0.0). You can provide any value for this element. When deploying resources using the template, this value can be used to make sure that the right template is being used. |
| parameters |No |Values that are provided when deployment is executed to customize resource deployment. |
| variables |No |Values that are used as JSON fragments in the template to simplify template language expressions. |
| resources |Yes |Resource types that are deployed or updated in a resource group. |
| outputs |No |Values that are returned after deployment. |

We examine the sections of the template in greater detail later in this topic. For now, we will review some of the syntax that makes up the template.

## Expressions and functions
The basic syntax of the template is JSON. However, expressions and functions extend the JSON that is available in the template. With expressions, you create values that are not strict literal values. Expressions are enclosed with brackets [ and ], and are evaluated when the template is deployed. Expressions can appear anywhere in a JSON string value and always return another JSON value. If you need to use a literal string that starts with a bracket [, you must use two brackets [[.

Typically, you use expressions with functions to perform operations for configuring the deployment. Just like in JavaScript, function calls are formatted as **functionName(arg1,arg2,arg3)**. You reference properties by using the dot and [index] operators.

The following example shows how to use several functions when constructing values:

    "variables": {
       "location": "[resourceGroup().location]",
       "usernameAndPassword": "[concat('parameters('username'), ':', parameters('password'))]",
       "authorizationHeader": "[concat('Basic ', base64(variables('usernameAndPassword')))]"
    }

For the full list of template functions, see [Azure Resource Manager template functions](resource-group-template-functions.md). 

## Parameters
In the parameters section of the template, you specify which values you can input when deploying the resources. These parameter values enable you to customize the deployment by providing values that are tailored for a particular environment (such as dev, test, and production). You do not have to provide parameters in your template, but without parameters your template would always deploy the same resources with the same names, locations, and properties.

You can use these parameter values throughout the template to set values for the deployed resources. Only parameters that are declared in the parameters section can be used in other sections of the template.

You define parameters with the following structure:

    "parameters": {
       "<parameter-name>" : {
         "type" : "<type-of-parameter-value>",
         "defaultValue": "<default-value-of-parameter>",
         "allowedValues": [ "<array-of-allowed-values>" ],
         "minValue": <minimum-value-for-int>,
         "maxValue": <maximum-value-for-int>,
         "minLength": <minimum-length-for-string-or-array>,
         "maxLength": <maximum-length-for-string-or-array-parameters>,
         "metadata": {
             "description": "<description-of-the parameter>" 
         }
       }
    }

| Element name | Required | Description |
|:---:|:---:|:--- |
| parameterName |Yes |Name of the parameter. Must be a valid JavaScript identifier. |
| type |Yes |Type of the parameter value. See the list below of allowed types. |
| defaultValue |No |Default value for the parameter, if no value is provided for the parameter. |
| allowedValues |No |Array of allowed values for the parameter to make sure that the right value is provided. |
| minValue |No |The minimum value for int type parameters, this value is inclusive. |
| maxValue |No |The maximum value for int type parameters, this value is inclusive. |
| minLength |No |The minimum length for string, secureString, and array type parameters, this value is inclusive. |
| maxLength |No |The maximum length for string, secureString, and array type parameters, this value is inclusive. |
| description |No |Description of the parameter, which is displayed to users of the template through the portal custom template interface. |

The allowed types and values are:

* **string**
* **secureString**
* **int**
* **bool**
* **object** 
* **secureObject**
* **array**

To specify a parameter as optional, provide a defaultValue (can be an empty string). 

If you specify a parameter name that matches one of the parameters in the command to deploy the template, you are prompted to provide a value for a parameter with the postfix **FromTemplate**. For example, if you include a parameter named **ResourceGroupName** in your template that is the same as the **ResourceGroupName** parameter in the [New-AzureRmResourceGroupDeployment][deployment2cmdlet] cmdlet, you are prompted to provide a value for **ResourceGroupNameFromTemplate**. In general, you should avoid this confusion by not naming parameters with the same name as parameters used for deployment operations.

> [!NOTE]
> All passwords, keys, and other secrets should use the **secureString** type. Template parameters with the secureString type cannot be read after resource deployment. 
> 
> 

The following example shows how to define parameters:

    "parameters": {
      "siteName": {
        "type": "string",
        "defaultValue": "[concat('site', uniqueString(resourceGroup().id))]"
      },
      "hostingPlanName": {
        "type": "string",
        "defaultValue": "[concat(parameters('siteName'),'-plan')]"
      },
      "skuName": {
        "type": "string",
        "defaultValue": "F1",
        "allowedValues": [
          "F1",
          "D1",
          "B1",
          "B2",
          "B3",
          "S1",
          "S2",
          "S3",
          "P1",
          "P2",
          "P3",
          "P4"
        ]
      },
      "skuCapacity": {
        "type": "int",
        "defaultValue": 1,
        "minValue": 1
      }
    }

For how to input the parameter values during deployment, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md#parameter-file). 

## Variables
In the variables section, you construct values that can be used throughout your template. Typically, variables are based on values provided from the parameters. You do not need to define variables, but they often simplify your template by reducing complex expressions.

You define variables with the following structure:

    "variables": {
       "<variable-name>": "<variable-value>",
       "<variable-name>": { 
           <variable-complex-type-value> 
       }
    }

The following example shows how to define a variable that is constructed from two parameter values:

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
       "instancesSize": "[variables('currentEnvironmentSettings').instancesSize]",
       "instancesCount": "[variables('currentEnvironmentSettings').instancesCount]"
    }

## Resources
In the resources section, you define the resources that are deployed or updated. This section can get complicated because you must understand the types you are deploying to provide the right values. 

You define resources with the following structure:

    "resources": [
       {
         "apiVersion": "<api-version-of-resource>",
         "type": "<resource-provider-namespace/resource-type-name>",
         "name": "<name-of-the-resource>",
         "location": "<location-of-resource>",
         "tags": "<name-value-pairs-for-resource-tagging>",
         "comments": "<your-reference-notes>",
         "dependsOn": [
           "<array-of-related-resource-names>"
         ],
         "properties": "<settings-for-the-resource>",
         "copy": {
           "name": "<name-of-copy-loop>",
           "count": "<number-of-iterations>"
         }
         "resources": [
           "<array-of-child-resources>"
         ]
       }
    ]

| Element name | Required | Description |
|:---:|:---:|:--- |
| apiVersion |Yes |Version of the REST API to use for creating the resource. |
| type |Yes |Type of the resource. This value is a combination of the namespace of the resource provider and the resource type (such as **Microsoft.Storage/storageAccounts**). |
| name |Yes |Name of the resource. The name must follow URI component restrictions defined in RFC3986. In addition, Azure services that expose the resource name to outside parties validate the name to make sure it is not an attempt to spoof another identity. See [Check resource name](https://msdn.microsoft.com/library/azure/mt219035.aspx). |
| location |Varies |Supported geo-locations of the provided resource. You can select any of the available locations, but typically it makes sense to pick one that is close to your users. Usually, it also makes sense to place resources that interact with each other in the same region. Most resource types require a location, but some types (such as a role assignment) do not require a location. |
| tags |No |Tags that are associated with the resource. |
| comments |No |Your notes for documenting the resources in your template |
| dependsOn |No |Resources that the resource being defined depends on. The dependencies between resources are evaluated and resources are deployed in their dependent order. When resources are not dependent on each other, they are deployed in parallel. The value can be a comma-separated list of a resource names or resource unique identifiers. |
| properties |No |Resource-specific configuration settings. The values for the properties are the same as the values you provide in the request body for the REST API operation (PUT method) to create the resource. For links to resource schema documentation or REST API, see [Resource Manager providers, regions, API versions and schemas](resource-manager-supported-services.md). |
| copy |No |If more than one instance is needed, the number of resources to create. For more information, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md). |
| resources |No |Child resources that depend on the resource being defined. You can provide only resource types that are permitted by the schema of the parent resource. The fully qualified name of the child resource type includes the parent resource type, such as **Microsoft.Web/sites/extensions**. Dependency on the parent resource is not implied; you must explicitly define that dependency. |

Knowing what values to specify for **apiVersion**, **type**, and **location** is not immediately obvious. Fortunately, you can determine these values through Azure PowerShell or Azure CLI.

To get all the resource providers with **PowerShell**, use:

    Get-AzureRmResourceProvider -ListAvailable

From the returned list, find the resource providers you are interested in. To get the resource types for a resource provider (such as Storage), use:

    (Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Storage).ResourceTypes

To get the API versions for a resource type (such storage accounts), use:

    ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Storage).ResourceTypes | Where-Object ResourceTypeName -eq storageAccounts).ApiVersions

To get supported locations for a resource type, use:

    ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Storage).ResourceTypes | Where-Object ResourceTypeName -eq storageAccounts).Locations

To get all the resource providers with **Azure CLI**, use:

    azure provider list

From the returned list, find the resource providers you are interested in. To get the resource types for a resource provider (such as Storage), use:

    azure provider show Microsoft.Storage

To get supported locations and API versions, use:

    azure provider show Microsoft.Storage --details --json

To learn more about resource providers, see [Resource Manager providers, regions, API versions and schemas](resource-manager-supported-services.md).

The resources section contains an array of the resources to deploy. Within each resource, you can also define an array of child resources. Therefore, your resources section could have a structure like:

    "resources": [
       {
           "name": "resourceA",
       },
       {
           "name": "resourceB",
           "resources": [
               {
                   "name": "firstChildResourceB",
               },
               {   
                   "name": "secondChildResourceB",
               }
           ]
       },
       {
           "name": "resourceC",
       }
    ]


The following example shows a **Microsoft.Web/serverfarms** resource and a **Microsoft.Web/sites** resource with a child **Extensions** resource. Notice that the site is marked as dependent on the server farm since the server farm must exist before the site can be deployed. Notice too that the **Extensions** resource is a child of the site.

    "resources": [
      {
        "apiVersion": "2015-08-01",
        "name": "[parameters('hostingPlanName')]",
        "type": "Microsoft.Web/serverfarms",
        "location": "[resourceGroup().location]",
        "tags": {
          "displayName": "HostingPlan"
        },
        "sku": {
          "name": "[parameters('skuName')]",
          "capacity": "[parameters('skuCapacity')]"
        },
        "properties": {
          "name": "[parameters('hostingPlanName')]",
          "numberOfWorkers": 1
        }
      },
      {
        "apiVersion": "2015-08-01",
        "type": "Microsoft.Web/sites",
        "name": "[parameters('siteName')]",
        "location": "[resourceGroup().location]",
        "tags": {
          "environment": "test",
          "team": "Web"
        },
        "dependsOn": [
          "[concat('Microsoft.Web/serverFarms/', parameters('hostingPlanName'))]"
        ],
        "properties": {
          "name": "[parameters('siteName')]",
          "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]"
        },
        "resources": [
          {
            "apiVersion": "2015-08-01",
            "type": "extensions",
            "name": "MSDeploy",
            "dependsOn": [
              "[concat('Microsoft.Web/sites/', parameters('siteName'))]"
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
    ]


## Outputs
In the Outputs section, you specify values that are returned from deployment. For example, you could return the URI to access a deployed resource.

The following example shows the structure of an output definition:

    "outputs": {
       "<outputName>" : {
         "type" : "<type-of-output-value>",
         "value": "<output-value-expression>"
       }
    }

| Element name | Required | Description |
|:---:|:---:|:--- |
| outputName |Yes |Name of the output value. Must be a valid JavaScript identifier. |
| type |Yes |Type of the output value. Output values support the same types as template input parameters. |
| value |Yes |Template language expression that is evaluated and returned as output value. |

The following example shows a value that is returned in the Outputs section.

    "outputs": {
       "siteUri" : {
         "type" : "string",
         "value": "[concat('http://',reference(resourceId('Microsoft.Web/sites', parameters('siteName'))).hostNames[0])]"
       }
    }

For more information about working with output, see [Sharing state in Azure Resource Manager templates](best-practices-resource-manager-state.md).

## Next Steps
* To view complete templates for many different types of solutions, see the [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/).
* For details about the functions you can use from within a template, see [Azure Resource Manager Template Functions](resource-group-template-functions.md).
* To combine multiple templates during deployment, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).
* You may need to use resources that exist within a different resource group. This scenario is common when working with storage accounts or virtual networks that are shared across multiple resource groups. For more information, see the [resourceId function](resource-group-template-functions.md#resourceid).

[deployment2cmdlet]: https://msdn.microsoft.com/library/mt740620(v=azure.200).aspx
