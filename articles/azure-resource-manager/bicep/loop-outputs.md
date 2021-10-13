---
title: Define multiple instances of an output value in Bicep
description: Use a Bicep output loop to iterate and return deployment values.

author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 08/30/2021
---

# Output iteration in Bicep

This article shows you how to create more than one value for an output in your Bicep file. You can add a loop to the file's `output` section and dynamically return several items during deployment.

You can also use a loop with [modules](loop-modules.md), [resources](loop-resources.md), [properties in a resource](loop-properties.md), and [variables](loop-variables.md).

### Microsoft Learn

To learn more about loops, and for hands-on guidance, see [Build flexible Bicep templates by using conditions and loops](/learn/modules/build-flexible-bicep-templates-conditions-loops/) on **Microsoft Learn**.

## Syntax

Loops can be used to return items during deployment by:

- Using a loop index.

  ```bicep
  output <output-name> array = [for <index> in range(<start>, <stop>): {
    <properties>
  }]
  ```

  For more information, see [Loop index](#loop-index).

- Iterating over an array.

  ```bicep
  output <output-name> array = [for <item> in <collection>: {
    <properties>
  }]

  ```

- Iterating over an array and index.

  ```bicep
  output <output-name> array = [for <item>, <index> in <collection>: {
    <properties>
  }]
  ```

  For more information, see [Loop array and index](#loop-array-and-index).

## Loop limits

The Bicep file's loop iterations can't be a negative number or exceed 800 iterations. 

## Loop index

The following example creates a variable number of storage accounts and returns an endpoint for each storage account.

```bicep
param rgLocation string = resourceGroup().location
param storageCount int = 2

var baseNameVar = 'storage${uniqueString(resourceGroup().id)}'

resource stg 'Microsoft.Storage/storageAccounts@2021-02-01' = [for i in range(0, storageCount): {
  name: '${i}${baseNameVar}'
  location: rgLocation
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
}]

output storageEndpoints array = [for i in range(0, storageCount): stg[i].properties.primaryEndpoints.blob]
```

The output returns an array with the following values:

```json
[
  "https://0storagecfrbqnnmpeudi.blob.core.windows.net/",
  "https://1storagecfrbqnnmpeudi.blob.core.windows.net/"
]
```

The next example returns three properties from the new storage accounts.

```bicep
param rgLocation string = resourceGroup().location
param storageCount int = 2

var baseNameVar = 'storage${uniqueString(resourceGroup().id)}'

resource stg 'Microsoft.Storage/storageAccounts@2021-02-01' = [for i in range(0, storageCount): {
  name: '${i}${baseNameVar}'
  location: rgLocation
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
}]

output storageInfo array = [for i in range(0, storageCount): {
  id: stg[i].id
  blobEndpoint: stg[i].properties.primaryEndpoints.blob
  status: stg[i].properties.statusOfPrimary
}]
```

The output returns an array with the following values:

```json
[
  {
    "id": "/subscriptions/{sub-id}/resourceGroups/{rg-name}/providers/Microsoft.Storage/storageAccounts/0storagecfrbqnnmpeudi",
    "blobEndpoint": "https://0storagecfrbqnnmpeudi.blob.core.windows.net/",
    "status": "available"
  },
  {
    "id": "/subscriptions/{sub-id}/resourceGroups/{rg-name}/providers/Microsoft.Storage/storageAccounts/1storagecfrbqnnmpeudi",
    "blobEndpoint": "https://1storagecfrbqnnmpeudi.blob.core.windows.net/",
    "status": "available"
  }
]
```

## Loop array and index

This example uses both the elements of an array and an index.

```bicep
param rgLocation string = resourceGroup().location

var stgNames = [
  'demostg1'
  'demostg2'
  'demostg3'
]

resource stg 'Microsoft.Storage/storageAccounts@2021-02-01' = [for name in stgNames: {
  name: name
  location: rgLocation
  kind: 'Storage'
  sku: {
    name: 'Standard_LRS'
    tier: 'Standard'
  }
}]

output stgOutput array = [for (name, i) in stgNames: {
  name: stg[i].name
  resourceId: stg[i].id
}]
```

The output returns an array with the following values:

```json
[
  {
    "name": "demostg1",
    "resourceId": "/subscriptions/{sub-id}/resourceGroups/{rg-name}/providers/Microsoft.Storage/storageAccounts/demostg1"
  },
  {
    "name": "demostg2",
    "resourceId": "/subscriptions/{sub-id}/resourceGroups/{rg-name}/providers/Microsoft.Storage/storageAccounts/demostg2"
  },
  {
    "name": "demostg3",
    "resourceId": "/subscriptions/{sub-id}/resourceGroups/{rg-name}/providers/Microsoft.Storage/storageAccounts/demostg3"
  }
]
```

## Next steps

- For other uses of loops, see:
  - [Resource iteration in Bicep](loop-resources.md)
  - [Module iteration in Bicep](loop-modules.md)
  - [Property iteration in Bicep](loop-properties.md)
  - [Variable iteration in Bicep](loop-variables.md)
- To set dependencies on resources that are created in a loop, see [Set resource dependencies](./resource-declaration.md#set-resource-dependencies).

