---
title: Variables in Bicep
description: Describes how to define variables in Bicep
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 05/05/2021
---

# Variables in Bicep

This article describes how to define and use variables in your Bicep file. You use variables to simplify your Bicep file development. Rather than repeating complicated expressions throughout your Bicep file, you define a variable that contains the complicated expression. Then, you use that variable as needed throughout your Bicep file.

Resource Manager resolves variables before starting the deployment operations. Wherever the variable is used in the Bicep file, Resource Manager replaces it with the resolved value.

[!INCLUDE [Bicep preview](../../../includes/resource-manager-bicep-preview.md)]

## Define variable

When defining a variable, you don't specify a [data type](data-types.md) for the variable. Instead provide a value or template expression. The variable type is inferred from the resolved value. The following example sets a variable to a string.

```bicep
var stringVar = 'example value'
```

You can use the value from a parameter or another variable when constructing the variable.

```bicep
param inputValue string = 'deployment parameter'

var stringVar = 'myVariable'
var concatToVar =  '${stringVar}-addtovar'
var concatToParam = '${inputValue}-addtoparam'
```

You can use [template functions](./template-functions.md) to construct the variable value.

The following example creates a string value for a storage account name. It uses several template functions to get a parameter value, and concatenates it to a unique string.

```bicep
var storageName = '${toLower(storageNamePrefix)}${uniqueString(resourceGroup().id)}'
```

In JSON templates, you can't use the [reference](template-functions-resource.md#reference) function or any of the [list](template-functions-resource.md#list) functions in the variable declaration. These functions get the runtime state of a resource, and can't be executed before deployment when variables are resolved.

In Bicep files, the reference and list functions are valid when declaring a variable.

## Use variable

The following example shows how to use the variable for a resource property. You reference the value for the variable by providing the variable name.

```bicep
var storageName = '${toLower(storageNamePrefix)}${uniqueString(resourceGroup().id)}'

resource demoAccount 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: storageName
  ...
}
```

## Example template

The following template doesn't deploy any resources. It shows some ways of declaring variables of different types.

:::code language="bicep" source="~/resourcemanager-templates/azure-resource-manager/variables.bicep":::

## Configuration variables

You can define variables that hold related values for configuring an environment. You define the variable as an object with the values. The following example shows an object that holds values for two environments - **test** and **prod**. Pass in one of these values during deployment.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/variablesconfigurations.bicep":::

## Next steps

* To learn about the available properties for variables, see [Understand the structure and syntax of Bicep](./file.md).
* For recommendations about creating variables, see [Best practices - variables](../templates/template-best-practices.md#variables).
