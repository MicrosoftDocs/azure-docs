---
title: Linter rule - use explicit values for module location parameters
description: Linter rule - use explicit values for module location parameters
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 11/27/2023
---

# Linter rule - use explicit values for module location parameters

This rule finds module parameters that are used for resource locations and may inadvertently default to an unexpected value.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`explicit-values-for-loc-params`

## Solution

When you consume a module, any location-related parameters that have a default value should be assigned an explicit value. Location-related parameters include parameters that have a default value referencing `resourceGroup().location` or `deployment().location` and also any parameter that is referenced from a resource's location property.

A parameter that defaults to a resource group's or deployment's location is convenient when a bicep file is used as a main deployment template. However, when such a default value is used in a module, it may cause unexpected behavior if the main template's resources aren't located in the same region as the resource group.

### Examples

The following example fails this test. Module `m1`'s parameter `location` isn't assigned an explicit value, so it will default to `resourceGroup().location`, as specified in *module1.bicep*. But using the resource group location may not be the intended behavior, since other resources in *main.bicep* might be created in a different location than the resource group's location.

*main.bicep*:

```bicep
param location string = 'eastus'

module m1 'module1.bicep' = {
 name: 'm1'
}

resource storageaccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: 'storageaccount'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}
```

*module1.bicep*:

```bicep
param location string = resourceGroup().location

resource stg 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: 'stg'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Premium_LRS'
  }
}
```

You can fix the failure by explicitly passing in a value for the module's `location` property:

*main.bicep*:

```bicep
param location string = 'eastus'

module m1 'module1.bicep' = {
  name: 'm1'
  params: {
   location: location // An explicit value will override the default value specified in module1.bicep
  }
}

resource storageaccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: 'storageaccount'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
