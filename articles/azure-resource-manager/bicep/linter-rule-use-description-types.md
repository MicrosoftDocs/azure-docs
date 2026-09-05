---
title: Linter rule - use description types
description: Linter rule - use description types
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 08/12/2026
---

# Linter rule - use description types

This rule requires user-defined types to have a non-empty `@description` decorator. Clear descriptions explain the intended purpose of types that you define.

> [!NOTE]
> This rule is off by default. Change the level in [bicepconfig.json](./bicep-config-linter.md) to enable it. Types that have a `@discriminator` decorator aren't evaluated by this rule.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-description-types`

## Solution

The following user-defined type fails this rule because it has no description:

```bicep
type StorageConfig = {
  name: string
  sku: string
}
```

To fix the problem, add a non-empty `@description` decorator:

```bicep
@description('Configuration values for a storage account.')
type StorageConfig = {
  name: string
  sku: string
}
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
