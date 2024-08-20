---
title: Variables in Bicep
description: Describes how to define variables in Bicep
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Variables in Bicep

This article describes how to define and use variables in your Bicep file. You use variables to simplify your Bicep file development. Rather than repeating complicated expressions throughout your Bicep file, you define a variable that contains the complicated expression. Then, you use that variable as needed throughout your Bicep file.

Resource Manager resolves variables before starting the deployment operations. Wherever the variable is used in the Bicep file, Resource Manager replaces it with the resolved value.

You are limited to 256 variables in a Bicep file. For more information, see [Template limits](../templates/best-practices.md#template-limits).

## Define variables

The syntax for defining a variable is:

```bicep
var <variable-name> = <variable-value>
```

A variable can't have the same name as a parameter, module, or resource.

Notice that you don't specify a [data type](data-types.md) for the variable. The type is inferred from the value. The following example sets a variable to a string.

```bicep
var stringVar = 'example value'
```

You can use the value from a parameter or another variable when constructing the variable.

```bicep
param inputValue string = 'deployment parameter'

var stringVar = 'preset variable'
var concatToVar =  '${stringVar}AddToVar'
var concatToParam = '${inputValue}AddToParam'

output addToVar string = concatToVar
output addToParam string = concatToParam
```

The preceding example returns:

```json
{
  "addToParam": {
    "type": "String",
    "value": "deployment parameterAddToParam"
  },
  "addToVar": {
    "type": "String",
    "value": "preset variableAddToVar"
  }
}
```

You can use [Bicep functions](bicep-functions.md) to construct the variable value. The following example uses Bicep functions to create a string value for a storage account name.

```bicep
param storageNamePrefix string = 'stg'
var storageName = '${toLower(storageNamePrefix)}${uniqueString(resourceGroup().id)}'

output uniqueStorageName string = storageName
```

The preceding example returns a value like the following:

```json
"uniqueStorageName": {
  "type": "String",
  "value": "stghzuunrvapn6sw"
}
```

You can use iterative loops when defining a variable. The following example creates an array of objects with three properties.

```bicep
param itemCount int = 3

var objectArray = [for i in range(0, itemCount): {
  name: 'myDataDisk${(i + 1)}'
  diskSizeGB: '1'
  diskIndex: i
}]

output arrayResult array = objectArray
```

The output returns an array with the following values:

```json
[
  {
    "name": "myDataDisk1",
    "diskSizeGB": "1",
    "diskIndex": 0
  },
  {
    "name": "myDataDisk2",
    "diskSizeGB": "1",
    "diskIndex": 1
  },
  {
    "name": "myDataDisk3",
    "diskSizeGB": "1",
    "diskIndex": 2
  }
]
```

For more information about the types of loops you can use with variables, see [Iterative loops in Bicep](loops.md).

## Use decorators

The following table describes the available decorators and how to use them.

| Decorator | Argument | Description |
| --------- | ----------- | ------- |
| [description](#description) | string | Text that explains how to use the variable. |
| [export](./bicep-import.md#export-variables-types-and-functions) | none | Indicates that the variable can be imported by another file. |

Decorators are in the [sys namespace](bicep-functions.md#namespaces-for-functions). If you need to differentiate a decorator from another item with the same name, preface the decorator with `sys`. For example, if your Bicep file includes a variable named `description`, you must add the sys namespace when using the **description** decorator.

### Description

To help users understand the value to provide, add a description to the variable. Only add a description when the text provides more information than can be inferred from the variable name.

```bicep
@description('Create a unique storage account name.')
var storageAccountName = uniqueString(resourceGroup().id)
```

### Export

For more information, see [Export variable](./bicep-import.md#export-variables-types-and-functions).

## Use variables

The following example shows how to use the variable for a resource property. You reference the value for the variable by providing the variable's name: `storageName`.

```bicep
param rgLocation string
param storageNamePrefix string = 'STG'

var storageName = '${toLower(storageNamePrefix)}${uniqueString(resourceGroup().id)}'

resource demoAccount 'Microsoft.Storage/storageAccounts@2023-04-01' = {
  name: storageName
  location: rgLocation
  kind: 'Storage'
  sku: {
    name: 'Standard_LRS'
  }
}

output stgOutput string = storageName
```

Because storage account names must use lowercase letters, the `storageName` variable uses the `toLower` function to make the `storageNamePrefix` value lowercase. The `uniqueString` function creates a unique value from the resource group ID. The values are concatenated to a string.

## Import variables between Bicep files

Only variables that bear the `@export()` decorator can be imported to other templates.

The following example enables you to import the variable from other templates:

```bicep
@export()
var myConstant = 'This is a constant value'
```

For more information, see [Import variables, types, and functions](./bicep-import.md#import-types-variables-and-functions).

## Configuration variables

You can define variables that hold related values for configuring an environment. You define the variable as an object with the values. The following example shows an object that holds values for two environments - **test** and **prod**. Pass in one of these values during deployment.

```bicep
@allowed([
  'test'
  'prod'
])
param environmentName string

var environmentSettings = {
  test: {
    instanceSize: 'Small'
    instanceCount: 1
  }
  prod: {
    instanceSize: 'Large'
    instanceCount: 4
  }
}

output instanceSize string = environmentSettings[environmentName].instanceSize
output instanceCount int = environmentSettings[environmentName].instanceCount
```

## Next steps

- To learn about the available properties for variables, see [Understand the structure and syntax of Bicep files](file.md).
- To learn about using loop syntax, see [Iterative loops in Bicep](loops.md).
