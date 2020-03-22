---
title: Parameters in templates
description: Describes how to define parameters in an Azure Resource Manager template.
ms.topic: conceptual
ms.date: 09/05/2019
---
# Parameters in Azure Resource Manager templates

This article describes how to define and use parameters in your Azure Resource Manager template. By providing different values for parameters, you can reuse a template for different environments.

Resource Manager resolves parameter values before starting the deployment operations. Wherever the parameter is used in the template, Resource Manager replaces it with the resolved value.

## Define parameter

The following example shows a simple parameter definition. It defines a parameter named **storageSKU**. The parameter is a string value, and only accepts values that are valid for its intended use. The parameter uses a default value when no value is provided during deployment.

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

## Use parameter

In the template, you reference the value for the parameter by using the [parameters](template-functions-deployment.md#parameters) function. In the following example, the parameter value is used to set SKU for the storage account.

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

## Template functions

When specifying the default value for a parameter, you can use most template functions. You can use another parameter value to build a default value. The following template demonstrates the use of functions in the default value. When no name is provided for the site, it creates a unique string value and appends it to **site**. When no name is provided for the host plan, it takes the value for the site, and appends **-plan**.

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

You can't use the [reference](template-functions-resource.md#reference) function or any of the [list](template-functions-resource.md#list) functions in the parameters section. These functions get the runtime state of a resource, and can't be executed before deployment when parameters are resolved.

## Objects as parameters

It can be easier to organize related values by passing them in as an object. This approach also reduces the number of parameters in the template.

The following example shows a parameter that is an object. The default value shows the expected properties for the object.

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

You reference the properties of the object by using the dot operator.

```json
"resources": [
  {
    "type": "Microsoft.Network/virtualNetworks",
    "apiVersion": "2015-06-15",
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

## Example templates

The following examples demonstrate scenarios for using parameters.

|Template  |Description  |
|---------|---------|
|[parameters with functions for default values](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/parameterswithfunctions.json) | Demonstrates how to use template functions when defining default values for parameters. The template doesn't deploy any resources. It constructs parameter values and returns those values. |
|[parameter object](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/parameterobject.json) | Demonstrates using an object for a parameter. The template doesn't deploy any resources. It constructs parameter values and returns those values. |


## Next steps

* To learn about the available properties for parameters, see [Understand the structure and syntax of Azure Resource Manager templates](template-syntax.md).
* To learn about passing in parameter values as a file, see [Create Resource Manager parameter file](parameter-files.md).
* For recommendations about creating parameters, see [Best practices - parameters](template-best-practices.md#parameters).
