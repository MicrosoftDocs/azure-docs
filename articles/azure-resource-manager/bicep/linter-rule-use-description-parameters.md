---
title: Linter rule - use description parameters
description: Linter rule - use description parameters
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 08/06/2026
---

# Linter rule - use description parameters

This rule requires every parameter to have a non-empty `@description` decorator. Clear descriptions improve the usability of modules and templates by documenting the purpose and expected value of each input.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-description-params`

## Solution

The following example fails this rule because `storageAccountName` has no description and `sku` has an empty description:

```bicep
param storageAccountName string

param location string = resourceGroup().location

@description('')
param sku string = 'Standard_LRS'
```

You can fix the problem by adding a non-empty `@description` decorator to each parameter:

```bicep
@description('Name of the storage account.')
param storageAccountName string

@description('Location for all resources.')
param location string = resourceGroup().location

@description('Storage account SKU name.')
param sku string = 'Standard_LRS'
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
