---
title: Azure Resource Manager template parameter section | Microsoft Docs
description: Describes the parameters section of Azure Resource Manager templates using declarative JSON syntax.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/18/2018
ms.author: tomfitz

---
# Parameters section of Azure Resource Manager templates
In the parameters section of the template, you specify which values you can input when deploying the resources. These parameter values enable you to customize the deployment by providing values that are tailored for a particular environment (such as dev, test, and production). You do not have to provide parameters in your template, but without parameters your template would always deploy the same resources with the same names, locations, and properties.

You are limited to 255 parameters in a template. You can reduce the number of parameters by using objects that contain multiple properties, as shown in this article.

## Define and use a parameter

The following example shows a simple parameter definition. It defines the name of the parameter, and specifies that it takes a string value. The parameter only accepts values that make sense for its intended use. It specifies a default value when no value is provided during deployment. Finally, the parameter includes a description of its use. 

```json
"parameters": {
  "storageSKU": {
    "type": "string",
    "allowedValues": [
      "Standard_LRS",
      "Standard_ZRS",
      "Standard_GRS",
      "Standard_RAGRS",
      "Premium_LRS"
    ],
    "defaultValue": "Standard_LRS",
    "metadata": {
      "description": "The type of replication to use for the storage account."
    }
  }   
}
```

In the template, you reference the value for the parameter with the following syntax:

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "sku": {
      "name": "[parameters('storageSKU')]"
    },
    ...
  }
]
```

## Available properties

The preceding example showed only some of the properties you can use in the parameter section. The available properties are:

```json
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
```

| Element name | Required | Description |
|:--- |:--- |:--- |
| parameterName |Yes |Name of the parameter. Must be a valid JavaScript identifier. |
| type |Yes |Type of the parameter value. The allowed types and values are **string**, **securestring**, **int**, **bool**, **object**, **secureObject**, and **array**. |
| defaultValue |No |Default value for the parameter, if no value is provided for the parameter. |
| allowedValues |No |Array of allowed values for the parameter to make sure that the right value is provided. |
| minValue |No |The minimum value for int type parameters, this value is inclusive. |
| maxValue |No |The maximum value for int type parameters, this value is inclusive. |
| minLength |No |The minimum length for string, securestring, and array type parameters, this value is inclusive. |
| maxLength |No |The maximum length for string, securestring, and array type parameters, this value is inclusive. |
| description |No |Description of the parameter that is displayed to users through the portal. |

## Template functions with parameters

When providing the default value for a parameter, you can use most template functions. You can use another parameter value to build a default value. The following template demonstrates the use of functions in the default value:

```json
"parameters": {
  "siteName": {
    "type": "string",
    "defaultValue": "[concat('site', uniqueString(resourceGroup().id))]",
    "metadata": {
      "description": "The site name. To use the default value, do not specify a new value."
    }
  },
  "hostingPlanName": {
    "type": "string",
    "defaultValue": "[concat(parameters('siteName'),'-plan')]",
    "metadata": {
      "description": "The host name. To use the default value, do not specify a new value."
    }
  }
}
```

You cannot use the `reference` function in the parameters section. Parameters are evaluated before deployment so the `reference` function cannot obtain the runtime state of a resource. 

## Objects as parameters

It can be easier to organize related values by passing them in as an object. This approach also reduces the number of parameters in the template.

Define the parameter in your template and specify a JSON object instead of a single value during deployment. 

```json
"parameters": {
  "VNetSettings": {
    "type": "object",
    "defaultValue": {
      "name": "VNet1",
      "location": "eastus",
      "addressPrefixes": [
        {
          "name": "firstPrefix",
          "addressPrefix": "10.0.0.0/22"
        }
      ],
      "subnets": [
        {
          "name": "firstSubnet",
          "addressPrefix": "10.0.0.0/24"
        },
        {
          "name": "secondSubnet",
          "addressPrefix": "10.0.1.0/24"
        }
      ]
    }
  }
},
```

Then, reference the subproperties of the parameter by using the dot operator.

```json
"resources": [
  {
    "apiVersion": "2015-06-15",
    "type": "Microsoft.Network/virtualNetworks",
    "name": "[parameters('VNetSettings').name]",
    "location": "[parameters('VNetSettings').location]",
    "properties": {
      "addressSpace":{
        "addressPrefixes": [
          "[parameters('VNetSettings').addressPrefixes[0].addressPrefix]"
        ]
      },
      "subnets":[
        {
          "name":"[parameters('VNetSettings').subnets[0].name]",
          "properties": {
            "addressPrefix": "[parameters('VNetSettings').subnets[0].addressPrefix]"
          }
        },
        {
          "name":"[parameters('VNetSettings').subnets[1].name]",
          "properties": {
            "addressPrefix": "[parameters('VNetSettings').subnets[1].addressPrefix]"
          }
        }
      ]
    }
  }
]
```

## Recommendations
The following information can be helpful when you work with parameters:

* Minimize your use of parameters. Whenever possible, use a variable or a literal value. Use parameters only for these scenarios:
   
   * Settings that you want to use variations of according to environment (SKU, size, capacity).
   * Resource names that you want to specify for easy identification.
   * Values that you use frequently to complete other tasks (such as an admin user name).
   * Secrets (such as passwords).
   * The number or array of values to use when you create multiple instances of a resource type.
* Use camel case for parameter names.
* Provide a description of every parameter in the metadata:

   ```json
   "parameters": {
       "storageAccountType": {
           "type": "string",
           "metadata": {
               "description": "The type of the new storage account created to store the VM disks."
           }
       }
   }
   ```

* Define default values for parameters (except for passwords and SSH keys). By providing a default value, the parameter becomes optional during deployment. The default value can be an empty string. 
   
   ```json
   "parameters": {
        "storageAccountType": {
            "type": "string",
            "defaultValue": "Standard_GRS",
            "metadata": {
                "description": "The type of the new storage account created to store the VM disks."
            }
        }
   }
   ```

* Use **securestring** for all passwords and secrets. If you pass sensitive data in a JSON object, use the **secureObject** type. Template parameters with securestring or secureObject types cannot be read after resource deployment. 
   
   ```json
   "parameters": {
       "secretValue": {
           "type": "securestring",
           "metadata": {
               "description": "The value of the secret to store in the vault."
           }
       }
   }
   ```

* Use a parameter to specify location, and share that parameter value as much as possible with resources that are likely to be in the same location. This approach minimizes the number of times users are asked to provide location information. If a resource type is supported in only a limited number of locations, you might want to specify a valid location directly in the template, or add another location parameter. When an organization limits the allowed regions for its users, the **resourceGroup().location** expression might prevent a user from being able to deploy the template. For example, one user creates a resource group in a region. A second user must deploy to that resource group but does not have access to the region. 
   
   ```json
   "resources": [
     {
         "name": "[variables('storageAccountName')]",
         "type": "Microsoft.Storage/storageAccounts",
         "apiVersion": "2016-01-01",
         "location": "[parameters('location')]",
         ...
     }
   ]
   ```
    
* Avoid using a parameter or variable for the API version for a resource type. Resource properties and values can vary by version number. IntelliSense in a code editor cannot determine the correct schema when the API version is set to a parameter or variable. Instead, hard-code the API version in the template.
* Avoid specifying a parameter name in your template that matches a parameter in the deployment command. Resource Manager resolves this naming conflict by adding the postfix **FromTemplate** to the template parameter. For example, if you include a parameter named **ResourceGroupName** in your template, it conflicts with the **ResourceGroupName** parameter in the [New-AzureRmResourceGroupDeployment](/powershell/module/azurerm.resources/new-azurermresourcegroupdeployment) cmdlet. During deployment, you are prompted to provide a value for **ResourceGroupNameFromTemplate**.

## Example templates

These example templates demonstrate some scenarios for using parameters. Deploy them to test how parameters are handled in different scenarios.

|Template  |Description  |
|---------|---------|
|[parameters with functions for default values](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/parameterswithfunctions.json) | Demonstrates how to use template functions when defining default values for parameters. The template does not deploy any resources. It constructs parameter values and returns those values. |
|[parameter object](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/parameterobject.json) | Demonstrates using an object for a parameter. The template does not deploy any resources. It constructs parameter values and returns those values. |

## Next steps

* To view complete templates for many different types of solutions, see the [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/).
* For how to input the parameter values during deployment, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md). 
* For details about the functions you can use from within a template, see [Azure Resource Manager Template Functions](resource-group-template-functions.md).
* For information about using a parameter object, see [Use an object as a parameter in an Azure Resource Manager template](/azure/architecture/building-blocks/extending-templates/objects-as-parameters).
