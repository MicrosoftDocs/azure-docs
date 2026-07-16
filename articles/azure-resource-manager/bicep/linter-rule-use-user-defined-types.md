---
title: Linter rule - use user-defined types
description: Linter rule - use user-defined types
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 06/02/2026
---

# Linter rule - use user-defined types

This rule encourages the use of [user-defined data types](./user-defined-data-types.md) instead of the generic [`object`](./data-types.md#objects) or [`array`](./data-types.md#arrays) types. Using user-defined data types improves code readability, provides better IntelliSense support, enables compile-time validation, and makes your Bicep files more maintainable.

> [!NOTE]
> This rule is off by default. Change the level in [bicepconfig.json](./bicep-config-linter.md) to enable it.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-user-defined-types`

## Solution

The following parameter definitions for object and array types fail this test.

```bicep
param storageConfig object
param subnets array
param appSettings object
```

Instead, use user-define data types as shown in the following example:

```bicep
type StorageConfig = {
  name: string
  sku: string
  kind: 'StorageV2' | 'FileStorage'
  tags?: object
}

type Subnet = {
  name: string
  addressPrefix: string
}

type AppSettings = {
  key: string
  value: string
}

param storageConfig StorageConfig
param subnets Subnet[]
param appSettings AppSettings[]
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
