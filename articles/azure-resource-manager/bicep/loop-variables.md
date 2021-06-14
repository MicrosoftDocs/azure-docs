---
title: Define multiple instances of a variable in Bicep
description: Use Bicep variable loop to iterate when creating a variable.

author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 06/01/2021
---

# Variable iteration in Bicep

This article shows you how to create more than one value for a variable in your Bicep file. You can add a loop to the `variables` section and dynamically set the number of items for a variable during deployment. You also avoid repeating syntax in your Bicep file.

You can also use copy with [resources](loop-resources.md), [properties in a resource](loop-properties.md), and [outputs](loop-outputs.md).

## Syntax

Loops can be used to declare multiple variables by:

- Iterating over an array.

  ```bicep
  var <variable-name> = [for <item> in <collection>: {
    <properties>
  }]

  ```

- Iterating over the elements of an array.

  ```bicep
  var <variable-name> = [for <item>, <index> in <collection>: {
    <properties>
  }]
  ```

- Using a loop index.

  ```bicep
  var <variable-name> = [for <index> in range(<start>, <stop>): {
    <properties>
  }]
  ```

## Loop limits

The Bicep file's loop iterations can't be a negative number or exceed 800 iterations. To deploy Bicep files, install the latest version of [Bicep tools](install.md).

## Variable iteration

The following example shows how to create an array of string values:

```bicep
param itemCount int = 5

var stringArray = [for i in range(0, itemCount): 'item${(i + 1)}']

output arrayResult array = stringArray
```

The output returns an array with the following values:

```json
[
  "item1",
  "item2",
  "item3",
  "item4",
  "item5"
]
```

The next example shows how to create an array of objects with three properties - `name`, `diskSizeGB`, and `diskIndex`.

```bicep
param itemCount int = 5

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
  },
  {
    "name": "myDataDisk4",
    "diskSizeGB": "1",
    "diskIndex": 3
  },
  {
    "name": "myDataDisk5",
    "diskSizeGB": "1",
    "diskIndex": 4
  }
]
```

## Example templates

The following examples show common scenarios for creating more than one value for a variable.

|Template  |Description  |
|---------|---------|
|[Loop variables](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/loopvariables.bicep) | Demonstrates how to iterate on variables. |
|[Multiple security rules](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.bicep) |Deploys several security rules to a network security group. It constructs the security rules from a parameter. For the parameter, see [multiple NSG parameter file](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.parameters.json). |

## Next steps

- For other uses of loops, see:
  - [Resource iteration in Bicep files](loop-resources.md)
  - [Property iteration in Bicep files](loop-properties.md)
  - [Output iteration in Bicep files](loop-outputs.md)
- If you want to learn about the sections of a Bicep file, see [Understand the structure and syntax of Bicep files](file.md).
- For information about how to deploy multiple resources, see [Use Bicep modules](modules.md).
- To set dependencies on resources that are created in a loop, see [Set resource dependencies](./resource-declaration.md#set-resource-dependencies).
- To learn how to deploy with PowerShell, see [Deploy resources with Bicep and Azure PowerShell](deploy-powershell.md).
- To learn how to deploy with Azure CLI, see [Deploy resources with Bicep and Azure CLI](deploy-cli.md).
