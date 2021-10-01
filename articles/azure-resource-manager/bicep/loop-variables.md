---
title: Define multiple instances of a variable in Bicep
description: Use Bicep variable loop to iterate when creating a variable.

author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 08/30/2021
---

# Variable iteration in Bicep

This article shows you how to create more than one value for a variable in your Bicep file. You can add a loop to the `variables` declaration and dynamically set the number of items for a variable. You avoid repeating syntax in your Bicep file.

You can also use copy with [modules](loop-modules.md), [resources](loop-resources.md), [properties in a resource](loop-properties.md), and [outputs](loop-outputs.md).

### Microsoft Learn

To learn more about loops, and for hands-on guidance, see [Build flexible Bicep templates by using conditions and loops](/learn/modules/build-flexible-bicep-templates-conditions-loops/) on **Microsoft Learn**.

## Syntax

Loops can be used to declare multiple variables by:

- Using a loop index.

  ```bicep
  var <variable-name> = [for <index> in range(<start>, <stop>): {
    <properties>
  }]
  ```

  For more information, see [Loop index](#loop-index).

- Iterating over an array.

  ```bicep
  var <variable-name> = [for <item> in <collection>: {
    <properties>
  }]

  ```

  For more information, see [Loop array](#loop-array).

- Iterating over an array and index.

  ```bicep
  var <variable-name> = [for <item>, <index> in <collection>: {
    <properties>
  }]
  ```

## Loop limits

The Bicep file's loop iterations can't be a negative number or exceed 800 iterations. 

## Loop index

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

## Loop array

The following example loops over an array that is passed in as a parameter. The variable constructs objects in the required format from the parameter.

```bicep
@description('An array that contains objects with properties for the security rules.')
param securityRules array = [
  {
    name: 'RDPAllow'
    description: 'allow RDP connections'
    direction: 'Inbound'
    priority: 100
    sourceAddressPrefix: '*'
    destinationAddressPrefix: '10.0.0.0/24'
    sourcePortRange: '*'
    destinationPortRange: '3389'
    access: 'Allow'
    protocol: 'Tcp'
  }
  {
    name: 'HTTPAllow'
    description: 'allow HTTP connections'
    direction: 'Inbound'
    priority: 200
    sourceAddressPrefix: '*'
    destinationAddressPrefix: '10.0.1.0/24'
    sourcePortRange: '*'
    destinationPortRange: '80'
    access: 'Allow'
    protocol: 'Tcp'
  }
]


var securityRulesVar = [for rule in securityRules: {
  name: rule.name
  properties: {
    description: rule.description
    priority: rule.priority
    protocol: rule.protocol
    sourcePortRange: rule.sourcePortRange
    destinationPortRange: rule.destinationPortRange
    sourceAddressPrefix: rule.sourceAddressPrefix
    destinationAddressPrefix: rule.destinationAddressPrefix
    access: rule.access
    direction: rule.direction
  }
}]

resource netSG 'Microsoft.Network/networkSecurityGroups@2020-11-01' = {
  name: 'NSG1'
  location: resourceGroup().location
  properties: {
    securityRules: securityRulesVar
  }
}
```

## Next steps

- For other uses of loops, see:
  - [Resource iteration in Bicep](loop-resources.md)
  - [Module iteration in Bicep](loop-modules.md)
  - [Property iteration in Bicep](loop-properties.md)
  - [Output iteration in Bicep](loop-outputs.md)
- To set dependencies on resources that are created in a loop, see [Set resource dependencies](./resource-declaration.md#set-resource-dependencies).
