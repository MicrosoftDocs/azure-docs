---
title: Variables in templates
description: Describes how to define variables in an Azure Resource Manager template (ARM template).
ms.topic: conceptual
ms.date: 01/26/2021
---

# Variables in ARM template

This article describes how to define and use variables in your Azure Resource Manager template (ARM template). You use variables to simplify your template. Rather than repeating complicated expressions throughout your template, you define a variable that contains the complicated expression. Then, you reference that variable as needed throughout your template.

Resource Manager resolves variables before starting the deployment operations. Wherever the variable is used in the template, Resource Manager replaces it with the resolved value.

## Define variable

When defining a variable, provide a value or template expression that resolves to a [data type](template-syntax.md#data-types). You can use the value from a parameter or another variable when constructing the variable.

You can use [template functions](template-functions.md) in the variable declaration, but you can't use the [reference](template-functions-resource.md#reference) function or any of the [list](template-functions-resource.md#list) functions. These functions get the runtime state of a resource, and can't be executed before deployment when variables are resolved.

The following example shows a variable definition. It creates a string value for a storage account name. It uses several template functions to get a parameter value, and concatenates it to a unique string.

```json
"variables": {
  "storageName": "[concat(toLower(parameters('storageNamePrefix')), uniqueString(resourceGroup().id))]"
},
```

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

## Example template

The following template doesn't deploy any resources. It just shows some ways of declaring variables.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/variables.json":::

## Configuration variables

You can define variables that hold related values for configuring an environment. You define the variable as an object with the values. The following example shows an object that holds values for two environments - **test** and **prod**. You pass in one of these values during deployment.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/variablesconfigurations.json":::

## Next steps

* To learn about the available properties for variables, see [Understand the structure and syntax of ARM templates](template-syntax.md).
* For recommendations about creating variables, see [Best practices - variables](template-best-practices.md#variables).
* For an example template that assigns security rules to a network security group, see [network security rules](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.json) and [parameter file](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.parameters.json).
