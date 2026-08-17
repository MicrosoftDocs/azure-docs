---
title: Linter rule - use description type properties
description: Linter rule - use description type properties
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 08/12/2026
---

# Linter rule - use description type properties

This rule requires properties in user-defined object types to have non-empty `@description` decorators. Clear descriptions explain the expected values in a type.

> [!NOTE]
> This rule is off by default. Change the level in [bicepconfig.json](./bicep-config-linter.md) to enable it. This rule also evaluates additional properties declared with `*`.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-description-type-properties`

## Solution

The following type fails this rule because its properties have no descriptions:

```bicep
type StorageConfig = {
  name: string
  sku: string
}
```

To fix the problem, add a non-empty `@description` decorator to each property:

```bicep
type StorageConfig = {
  @description('The name of the storage account.')
  name: string

  @description('The SKU of the storage account.')
  sku: string
}
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
