---
title: Define multiple instances of an output value in Bicep
description: Use a Bicep output loop to iterate and return deployment values.

author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 06/01/2021
---

# Output iteration in Bicep

This article shows you how to create more than one value for an output in your Bicep file. You can add a loop to the file's `output` section and dynamically return several items during deployment.

You can also use a loop with [resources](loop-resources.md), [properties in a resource](loop-properties.md), and [variables](loop-variables.md).

## Syntax

Loops can be used to return many items during deployment by:

- Iterating over an array.

  ```bicep
  output <output-name> array = [for <item> in <collection>: {
    <properties>
  }]

  ```

- Iterating over the elements of an array.

  ```bicep
  output <output-name> array = [for <item>, <index> in <collection>: {
    <properties>
  }]
  ```

- Using a loop index.

  ```bicep
  output <output-name> array = [for <index> in range(<start>, <stop>): {
    <properties>
  }]
  ```

## Loop limits

The Bicep file's loop iterations can't be a negative number or exceed 800 iterations. To deploy Bicep files, install the latest version of [Bicep tools](install.md).

## Output iteration

The following example creates a variable number of storage accounts and returns an endpoint for each storage account.

```bicep
param rgLocation string = resourceGroup().location
param storageCount int = 2

var baseNameVar = 'storage${uniqueString(resourceGroup().id)}'

resource baseName 'Microsoft.Storage/storageAccounts@2021-02-01' = [for i in range(0, storageCount): {
  name: '${i}${baseNameVar}'
  location: rgLocation
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
}]

output storageEndpoints array = [for i in range(0, storageCount): reference('${i}${baseNameVar}').primaryEndpoints.blob]
```

The output returns an array with the following values:

```json
[
  "https://0storagecfrbqnnmpeudi.blob.core.windows.net/",
  "https://1storagecfrbqnnmpeudi.blob.core.windows.net/"
]
```

This example returns three properties from the new storage accounts.

```bicep
param rgLocation string = resourceGroup().location
param storageCount int = 2

var baseNameVar = 'storage${uniqueString(resourceGroup().id)}'

resource baseName 'Microsoft.Storage/storageAccounts@2021-02-01' = [for i in range(0, storageCount): {
  name: '${i}${baseNameVar}'
  location: rgLocation
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
}]

output storageInfo array = [for i in range(0, storageCount): {
  id: reference('${i}${baseNameVar}', '2021-02-01', 'Full').resourceId
  blobEndpoint: reference('${i}${baseNameVar}').primaryEndpoints.blob
  status: reference('${i}${baseNameVar}').statusOfPrimary
}]
```

The output returns an array with the following values:

```json
[
  {
    "id": "Microsoft.Storage/storageAccounts/0storagecfrbqnnmpeudi",
    "blobEndpoint": "https://0storagecfrbqnnmpeudi.blob.core.windows.net/",
    "status": "available"
  },
  {
    "id": "Microsoft.Storage/storageAccounts/1storagecfrbqnnmpeudi",
    "blobEndpoint": "https://1storagecfrbqnnmpeudi.blob.core.windows.net/",
    "status": "available"
  }
]
```

This example uses an array index because direct references to a resource module or module collection aren't supported in output loops.

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
    "resourceId": "/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.Storage/storageAccounts/demostg1"
  },
  {
    "name": "demostg2",
    "resourceId": "/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.Storage/storageAccounts/demostg2"
  },
  {
    "name": "demostg3",
    "resourceId": "/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.Storage/storageAccounts/demostg3"
  }
]
```

## Next steps

- For other uses of loops, see:
  - [Resource iteration in Bicep files](loop-resources.md)
  - [Property iteration in Bicep files](loop-properties.md)
  - [Variable iteration in Bicep files](loop-variables.md)
- If you want to learn about the sections of a Bicep file, see [Understand the structure and syntax of Bicep files](file.md).
- For information about how to deploy multiple resources, see [Use Bicep modules](modules.md).
- To set dependencies on resources that are created in a loop, see [Set resource dependencies](./resource-declaration.md#set-resource-dependencies).
- To learn how to deploy with PowerShell, see [Deploy resources with Bicep and Azure PowerShell](deploy-powershell.md).
- To learn how to deploy with Azure CLI, see [Deploy resources with Bicep and Azure CLI](deploy-cli.md).
