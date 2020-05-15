---
title: Variables in templates
description: Describes how to define variables in an Azure Resource Manager template. 
ms.topic: conceptual
ms.date: 09/05/2019
---
# Variables in Azure Resource Manager template

This article describes how to define and use variables in your Azure Resource Manager template. You use variables to simplify your template. Rather than repeating complicated expressions throughout your template, you define a variable that contains the complicated expression. Then, you reference that variable as needed throughout your template.

Resource Manager resolves variables before starting the deployment operations. Wherever the variable is used in the template, Resource Manager replaces it with the resolved value.

## Define variable

The following example shows a variable definition. It creates a string value for a storage account name. It uses several template functions to get a parameter value, and concatenates it to a unique string.

```json
"variables": {
  "storageName": "[concat(toLower(parameters('storageNamePrefix')), uniqueString(resourceGroup().id))]"
},
```

You can't use the [reference](template-functions-resource.md#reference) function or any of the [list](template-functions-resource.md#list) functions in the variables section. These functions get the runtime state of a resource, and can't be executed before deployment when variables are resolved.

## Use variable

In the template, you reference the value for the parameter by using the [variables](template-functions-deployment.md#variables) function. The following example shows how to use the variable for a resource property.

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "name": "[variables('storageName')]",
    ...
  }
]
```

## Configuration variables

You can define variables that hold related values for configuring an environment. You define the variable as an object with the values. The following example shows an object that holds values for two environments - **test** and **prod**.

```json
"variables": {
  "environmentSettings": {
    "test": {
      "instanceSize": "Small",
      "instanceCount": 1
    },
    "prod": {
      "instanceSize": "Large",
      "instanceCount": 4
    }
  }
},
```

In parameters, you create a value that indicates which configuration values to use.

```json
"parameters": {
  "environmentName": {
    "type": "string",
    "allowedValues": [
      "test",
      "prod"
    ]
  }
},
```

To retrieve settings for the specified environment, use the variable and parameter together.

```json
"[variables('environmentSettings')[parameters('environmentName')].instanceSize]"
```

## Example templates

The following examples demonstrate scenarios for using variables.

|Template  |Description  |
|---------|---------|
| [variable definitions](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/variables.json) | Demonstrates the different types of variables. The template doesn't deploy any resources. It constructs variable values and returns those values. |
| [configuration variable](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/variablesconfigurations.json) | Demonstrates the use of a variable that defines configuration values. The template doesn't deploy any resources. It constructs variable values and returns those values. |
| [network security rules](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.json) and [parameter file](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.parameters.json) | Constructs an array in the correct format for assigning security rules to a network security group. |

## Next steps

* To learn about the available properties for variables, see [Understand the structure and syntax of Azure Resource Manager templates](template-syntax.md).
* For recommendations about creating variables, see [Best practices - variables](template-best-practices.md#variables).
