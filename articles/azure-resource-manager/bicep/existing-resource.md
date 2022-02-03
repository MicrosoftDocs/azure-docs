---
title: Reference existing resource in Bicep
description: Describes how to reference a resource that already exists.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 02/03/2022
---

# Existing resources

To reference a resource that's outside of the current Bicep file, use the `existing` keyword in a resource declaration.

## Syntax

When using the `existing` keyword, provide the `name` of the resource. The following example gets an existing storage account in the same resource group as the current deployment.

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2019-06-01' existing = {
  name: 'examplestorage'
}

output blobEndpoint string = stg.properties.primaryEndpoints.blob
```

Optionally, you can set the `scope` property to access a resource in a different scope. The following example references an existing storage account in a different resource group.

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2019-06-01' existing = {
  name: 'examplestorage'
  scope: resourceGroup(exampleRG)
}

output blobEndpoint string = stg.properties.primaryEndpoints.blob
```

If you attempt to reference a resource that doesn't exist, you get the `NotFound` error and your deployment fails.

For more information about setting the scope, see [Scope functions for Bicep](bicep-functions-scope.md).

The preceding examples don't deploy the storage account. Instead, you can access properties on the existing resource by using the symbolic name.

## Next steps

- To conditionally deploy a resource, see [Conditional deployment in Bicep](./conditional-resource-deployment.md).
