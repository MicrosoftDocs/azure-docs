---
title: Define multiple instances of a property in Bicep
description: Use a Bicep property loop to iterate when creating a resource property.

author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 09/23/2021
---

# Property iteration in Bicep

This article shows you how to create more than one instance of a property in Bicep file. You can add a loop to a resource's `properties` section and dynamically set the number of items for a property. You avoid repeating syntax in your Bicep file.

You can only use a loop with top-level resources, even when applying a loop to a property. To learn about changing a child resource to a top-level resource, see [Iteration for a child resource](loop-resources.md#iteration-for-a-child-resource).

You can also use a loop with [modules](loop-modules.md), [resources](loop-resources.md), [variables](loop-variables.md), and [outputs](loop-outputs.md).

### Microsoft Learn

To learn more about loops, and for hands-on guidance, see [Build flexible Bicep templates by using conditions and loops](/learn/modules/build-flexible-bicep-templates-conditions-loops/) on **Microsoft Learn**.

## Syntax

Loops can be used to declare multiple properties by:

- Using a loop index.

  ```bicep
  <property-name>: [for <index> in range(<start>, <stop>): {
    <properties>
  }]
  ```

- Iterating over an array.

  ```bicep
  <property-name>: [for <item> in <collection>: {
    <properties>
  }]
  ```

  For more information, see [Loop array](#loop-array).

- Iterating over an array and index.

  ```bicep
  <property-name>: [for (<item>, <index>) in <collection>: {
    <properties>
  }]
  ```

## Loop limits

Bicep loop has these limitations:

- Can't loop on multiple levels of properties.
- Loop iterations can't be a negative number or exceed 800 iterations.

## Loop array

This example iterates through an array for the `subnets` property to create two subnets within a virtual network.

```bicep
param rgLocation string = resourceGroup().location

var subnets = [
  {
    name: 'api'
    subnetPrefix: '10.144.0.0/24'
  }
  {
    name: 'worker'
    subnetPrefix: '10.144.1.0/24'
  }
]

resource vnet 'Microsoft.Network/virtualNetworks@2020-07-01' = {
  name: 'vnet'
  location: rgLocation
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.144.0.0/20'
      ]
    }
    subnets: [for subnet in subnets: {
      name: subnet.name
      properties: {
        addressPrefix: subnet.subnetPrefix
      }
    }]
  }
}
```

## Next steps

- For other uses of loops, see:
  - [Resource iteration in Bicep](loop-resources.md)
  - [Module iteration in Bicep](loop-modules.md)
  - [Variable iteration in Bicep](loop-variables.md)
  - [Output iteration in Bicep](loop-outputs.md)
- To set dependencies on resources that are created in a loop, see [Set resource dependencies](./resource-declaration.md#set-resource-dependencies).
