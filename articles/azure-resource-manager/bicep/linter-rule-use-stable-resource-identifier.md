---
title: Linter rule - use stable resource identifier
description: Linter rule - use stable resource identifier
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule - use stable resource identifier

Resource name shouldn't use a non-deterministic value. For example, [`newGuid()`](./bicep-functions-string.md#newguid) or [`utcNow()`](./bicep-functions-date.md#utcnow) can't be used in resource name; resource name can't contain a parameter/variable whose default value uses [`newGuid()`](./bicep-functions-string.md#newguid) or [`utcNow()`](./bicep-functions-date.md#utcnow).

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-stable-resource-identifiers`

## Solution

The following example fails this test because `utcNow()` is used in the resource name.

```bicep
param location string = resourceGroup().location
param time string = utcNow()

resource sa 'Microsoft.Storage/storageAccounts@2021-09-01' = {
  name: 'store${toLower(time)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}
```

You can fix it by removing the `utcNow()` function from the example.

```bicep
param location string = resourceGroup().location

resource sa 'Microsoft.Storage/storageAccounts@2021-09-01' = {
  name: 'store${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
