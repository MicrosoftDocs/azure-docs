---
title: Linter rule - no unused types
description: Linter rule - no unused types
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 07/14/2026
---

# Linter rule - no unused types

This rule finds [user-defined data types](./user-defined-data-types.md) that aren't referenced anywhere in the Bicep file.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-unused-types`

## Solution

To reduce confusion in your Bicep file, delete any types that are defined but not used. This test finds all types that aren't used anywhere in the file.

The following example fails this test because the `unusedType` type is declared but never used:

```bicep
type unusedType = {
  name: string
  age: int
}

param location string = resourceGroup().location

output deployedToLocation string = location
```

You can fix it by removing the unused type declaration, or by referencing the type, for example in a `param` or `output` declaration:

```bicep
type storageAccountConfigType = {
  name: string
  sku: string
}

param storageAccountConfig storageAccountConfigType = {
  name: 'mystorageaccount'
  sku: 'Standard_LRS'
}

output configuredName string = storageAccountConfig.name
```

Types that are shared with other Bicep files by using the [`@export()`](./user-defined-data-types.md#export) decorator are excluded from this rule, because they're intended to be consumed elsewhere.

Use **Quick Fix** to remove the unused types.

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
