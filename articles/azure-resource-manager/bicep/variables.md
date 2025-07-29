---
title: Variables in Bicep
description: Describes how to define variables in Bicep
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 05/30/2025
---

# Variables in Bicep

This article describes how to define and use variables in your Bicep file. You use variables to simplify your Bicep file development. Rather than repeating complicated expressions throughout your Bicep file, you define a variable that contains the complicated expression. Then, you use that variable as needed throughout your Bicep file.

Resource Manager resolves variables before starting the deployment operations. Wherever the variable is used in the Bicep file, Resource Manager replaces it with the resolved value. You're limited to 512 variables in a Bicep file. For more information, see [Template limits](../templates/best-practices.md#template-limits).

## Define variables

A variable can't have the same name as a parameter, module, or resource. You can add one or more decorators for each variable. For more information, see Use [decorators](#use-decorators). 

### Untyped variables

When you define a variable without specifying a data type, the type is inferred from the value. The syntax for defining an untyped variable is:

```bicep
@<decorator>(<argument>)
var <variable-name> = <variable-value>
```

The following example sets a variable to a string.

```bicep
var stringVar = 'preset variable'
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

The output from the preceding example returns:

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

The preceding example returns a value like the following output:

```json
"uniqueStorageName": {
  "type": "String",
  "value": "stghzuunrvapn6sw"
}
```

### Typed variables

Starting with [Bicep CLI version 0.36.X](https://github.com/Azure/bicep/releases/tag/v0.36.1), Bicep supports **typed variables**, where you explicitly declare the data type of a variable to ensure type safety and improve code clarity. The benefits of typed variables:

- **Error detection**: The Bicep compiler validates that assigned values match the declared type, catching errors early.
- **Code clarity**: Explicit types make it clear what kind of data a variable holds.
- **Intellisense support**: Tools like Visual Studio Code provide better autocompletion and validation for typed variables.
- **Refactoring safety**: Ensures that changes to variable assignments don’t inadvertently break type expectations.

To define a typed variable, use the `var` keyword followed by the variable name, the type, and the assigned value:

```bicep
var <variable-name> <data-type> = <variable-value>
```

The following examples show how to define typed variables:

```bicep
var resourceName string = 'myResource'
var instanceCount int = 3
var isProduction bool = true
var tags object = { environment: 'dev' }
var subnets array = ['subnet1', 'subnet2']
```

For `object` types, you can define a schema to enforce a specific structure. The compiler ensures the object adheres to the defined schema.

```bicep
var config {
  name: string
  count: int
  enabled: bool
} = {
  name: 'myApp'
  count: 5
  enabled: true
}
```

The following example uses typed variables with decorators to enforce constraints:

```bicep
@description('The environment to deploy to')
@allowed(['dev', 'test', 'prod'])
param environment string = 'dev'

var instanceCount int = environment == 'prod' ? 5 : 2
var resourcePrefix string = 'app'
var tags {
  environment: string
  deployedBy: string 
} = {
  environment: environment
  deployedBy: 'Bicep'
}

resource storage 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: '${resourcePrefix}storage${instanceCount}'
  location: 'westus'
  tags: tags
  kind: 'Storage'
  sku: {
    name: 'Standard_LRS'
  }
}
```

In this example:

- `instanceCount` is typed as `int` and uses a conditional expression.
- `resourcePrefix` is typed as `string`.
- `tags` is typed as `object` with a specific structure.

## Use iterative loops

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

Decorators are written in the format `@expression` and are placed above variable declarations. The following table shows the available decorators for variables.

| Decorator | Argument | Description |
| --------- | ----------- | ------- |
| [description](#description) | string | Provide descriptions for the variable. |
| [export](#export) | none | Indicates that the variable is available for import by another Bicep file. |

Decorators are in the [sys namespace](bicep-functions.md#namespaces-for-functions). If you need to differentiate a decorator from another item with the same name, preface the decorator with `sys`. For example, if your Bicep file includes a variable named `description`, you must add the sys namespace when using the **description** decorator.

### Description

To add explanation, add a description to variable declaration. For example:

```bicep
@description('Create a unique storage account name.')
var storageAccountName = uniqueString(resourceGroup().id)
```

Markdown-formatted text can be used for the description text.

### Export

Use `@export()` to share the variable with other Bicep files. For more information, see [Export variables, types, and functions](./bicep-import.md#export-variables-types-and-functions).

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
