---
title: Reference existing resource in Bicep
description: Describes how to reference a resource that already exists.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/23/2023
---

# Existing resources in Bicep

To reference an existing resource that isn't deployed in your current Bicep file, declare the resource with the `existing` keyword. Use the `existing` keyword when you're deploying a resource that needs to get a value from an existing resource. You access the existing resource's properties through its symbolic name.

The resource isn't redeployed when referenced with the `existing` keyword.

## Same scope

The following example gets an existing storage account in the same resource group as the current deployment. Notice that you provide only the name of the existing resource. The properties are available through the symbolic name.

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
  name: 'examplestorage'
}

output blobEndpoint string = stg.properties.primaryEndpoints.blob
```

## Different scope

Set the `scope` property to access a resource in a different scope. The following example references an existing storage account in a different resource group.

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
  name: 'examplestorage'
  scope: resourceGroup(exampleRG)
}

output blobEndpoint string = stg.properties.primaryEndpoints.blob
```

For more information about setting the scope, see [Scope functions for Bicep](bicep-functions-scope.md).

## Troubleshooting

If you attempt to reference a resource that doesn't exist, you get the `NotFound` error and your deployment fails. Check the name and scope of the resource you're trying to reference.

## Next steps

For the syntax to deploy a resource, see [Resource declaration in Bicep](resource-declaration.md).
