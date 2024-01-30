---
title: Variables in templates
description: Describes how to define variables in an Azure Resource Manager template (ARM template).
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 09/28/2022
---

# Variables in ARM templates

This article describes how to define and use variables in your Azure Resource Manager template (ARM template). You use variables to simplify your template. Rather than repeating complicated expressions throughout your template, you define a variable that contains the complicated expression. Then, you use that variable as needed throughout your template.

Resource Manager resolves variables before starting the deployment operations. Wherever the variable is used in the template, Resource Manager replaces it with the resolved value.

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [variables](../bicep/variables.md).

You are limited to 256 variables in a template. For more information, see [Template limits](./best-practices.md#template-limits).

## Define variable

When defining a variable, you don't specify a [data type](data-types.md) for the variable. Instead provide a value or template expression. The variable type is inferred from the resolved value. The following example sets a variable to a string.

```json
"variables": {
  "stringVar": "example value"
},
```

To construct the variable, you can use the value from a parameter or another variable.

```json
"parameters": {
  "inputValue": {
    "defaultValue": "deployment parameter",
    "type": "string"
  }
},
"variables": {
  "stringVar": "myVariable",
  "concatToVar": "[concat(variables('stringVar'), '-addtovar') ]",
  "concatToParam": "[concat(parameters('inputValue'), '-addtoparam')]"
}
```

You can use [template functions](template-functions.md) to construct the variable value.

The following example creates a string value for a storage account name. It uses several template functions to get a parameter value, and concatenates it to a unique string.

```json
"variables": {
  "storageName": "[concat(toLower(parameters('storageNamePrefix')), uniqueString(resourceGroup().id))]"
},
```

You can't use the [reference](template-functions-resource.md#reference) function or any of the [list](template-functions-resource.md#list) functions in the variable declaration. These functions get the runtime state of a resource, and can't be executed before deployment when variables are resolved.

## Use variable

The following example shows how to use the variable for a resource property.

To reference the value for the variable, use the [variables](template-functions-deployment.md#variables) function.

```json
"variables": {
  "storageName": "[concat(toLower(parameters('storageNamePrefix')), uniqueString(resourceGroup().id))]"
},
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "name": "[variables('storageName')]",
    ...
  }
]
```

## Example template

The following template doesn't deploy any resources. It shows some ways of declaring variables of different types.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/variables.json":::

## Configuration variables

You can define variables that hold related values for configuring an environment. You define the variable as an object with the values. The following example shows an object that holds values for two environments - **test** and **prod**. Pass in one of these values during deployment.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/variablesconfigurations.json":::

## Next steps

* To learn about the available properties for variables, see [Understand the structure and syntax of ARM templates](./syntax.md).
* For recommendations about creating variables, see [Best practices - variables](./best-practices.md#variables).
* For an example template that assigns security rules to a network security group, see [network security rules](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.json) and [parameter file](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.parameters.json).
