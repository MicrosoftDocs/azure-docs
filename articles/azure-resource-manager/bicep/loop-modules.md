---
title: Deploy multiple instances of modules in Bicep
description: Use loops and arrays in a Bicep file to deploy multiple instances of modules.

author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 09/30/2021
---

# Module iteration in Bicep

This article shows you how to deploy more than one instance of a [module](modules.md) in your Bicep file. You can add a loop to a `module` declaration and dynamically set the number of times to deploy that module. You avoid repeating syntax in your Bicep file.

You can also use a loop with [resources](loop-resources.md), [properties](loop-properties.md), [variables](loop-variables.md), and [outputs](loop-outputs.md).

### Microsoft Learn

To learn more about loops, and for hands-on guidance, see [Build flexible Bicep templates by using conditions and loops](/learn/modules/build-flexible-bicep-templates-conditions-loops/) on **Microsoft Learn**.

## Syntax

Loops can be used to declare multiple modules by:

- Using a loop index.

  ```bicep
  module <module-symbolic-name> '<module-file>' = [for <index> in range(<start>, <stop>): {
    <module-properties>
  }]
  ```

  For more information, see [Loop index](#loop-index).

- Iterating over an array.

  ```bicep
  module <module-symbolic-name> '<module-file>' = [for <item> in <collection>: {
    <module-properties>
  }]
  ```

  For more information, see [Loop array](#loop-array).

- Iterating over an array and index:

  ```bicep
  module <module-symbolic-name> 'module-file' = [for (<item>, <index>) in <collection>: {
    <module-properties>
  }]
  ```

## Loop limits

The Bicep file's loop iterations can't be a negative number or exceed 800 iterations.

## Loop index

The following example deploys a module the number of times specified in the `storageCount` parameter. Each instance of the module creates a storage account.

```bicep
param location string = resourceGroup().location
param storageCount int = 2

var baseName = 'store${uniqueString(resourceGroup().id)}'

module stgModule './storageAccount.bicep' = [for i in range(0, storageCount): {
  name: '${i}storage${baseName}'
  params: {
    storageName: '${i}${baseName}'
    location: location
  }
}]
```

Notice the index `i` is used in creating the storage account resource name. The storage account is passed as a parameter value to the module.

## Loop array

The following example deploys a module for each name provided in the `storageNames` parameter. The module creates a storage account

```bicep
param rgLocation string = resourceGroup().location
param storageNames array = [
  'contoso'
  'fabrikam'
  'coho'
]

module stgModule './storageAccount.bicep' = [for name in storageNames: {
  name: '${name}${uniqueString(resourceGroup().id)}'
  params: {
    storageName: name
    location: location
  }
}]

```

Referencing a module collection isn't supported in output loops. To output results from modules in a collection, apply an array indexer to the expression. For more information, see [Output iteration](loop-outputs.md).

## Module iteration with condition

The following example shows a Bicep file with a filtered module loop. Filters must be expressions that evaluate to a boolean value.

```bicep
param location string = resourceGroup().location
param storageCount int = 2
param createNewStorage bool = true

var baseName = 'store${uniqueString(resourceGroup().id)}'

module stgModule './storageAccount.bicep' = [for i in range(0, storageCount): if(createNewStorage) {
  name: '${i}storage${baseName}'
  params: {
    storageName: '${i}${baseName}'
    location: location
  }
}]
```

In the preceding example, the module is called only when the boolean value is `true`.

Filters are also supported with [resource loops](loop-resources.md).

## Deploy in batches

By default, Resource Manager creates resources in parallel. When you use a loop to create multiple instances of a resource type, those instances are all deployed at the same time. The order in which they're created isn't guaranteed. There's no limit to the number of resources deployed in parallel, other than the total limit of 800 resources in the Bicep file.

You might not want to update all instances of a resource type at the same time. For example, when updating a production environment, you may want to stagger the updates so only a certain number are updated at any one time. You can specify that a subset of the instances be batched together and deployed at the same time. The other instances wait for that batch to complete.

To serially deploy instances of a module, add the [batchSize decorator](./file.md#resource-and-module-decorators). Set its value to the number of instances to deploy concurrently. A dependency is created on earlier instances in the loop, so it doesn't start one batch until the previous batch completes.

```bicep
param location string = resourceGroup().location

@batchSize(2)
module stgModule './storageAccount.bicep' = [for i in range(0, 4): {
  name: '${i}storage${uniqueString(resourceGroup().id)}'
  params: {
    storageName: '${i}${baseName}'
    location: location
  }
}]
```

For purely sequential deployment, set the batch size to 1.

The `batchSize` decorator is in the [sys namespace](bicep-functions.md#namespaces-for-functions). If you need to differentiate this decorator from another item with the same name, preface the decorator with **sys**: `@sys.batchSize(2)`

## Next steps

- For other uses of the loop, see:
  - [Resource iteration in Bicep](loop-resources.md)
  - [Property iteration in Bicep](loop-properties.md)
  - [Variable iteration in Bicep](loop-variables.md)
  - [Output iteration in Bicep](loop-outputs.md)
- For information about modules, see [Use Bicep modules](modules.md).
- To set dependencies on resources that are created in a loop, see [Set resource dependencies](./resource-declaration.md#set-resource-dependencies).
