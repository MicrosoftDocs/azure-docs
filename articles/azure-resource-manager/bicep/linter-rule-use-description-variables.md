---
title: Linter rule - use description variables
description: Linter rule - use description variables
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 08/12/2026
---

# Linter rule - use description variables

This rule requires every variable to have a non-empty `@description` decorator. Clear descriptions explain the purpose of values that are calculated in a Bicep file.

> [!NOTE]
> This rule is off by default. Change the level in [bicepconfig.json](./bicep-config-linter.md) to enable it.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-description-vars`

## Solution

The following variable fails this rule because it has no description:

```bicep
var storageAccountName = '${namePrefix}storage'
```

To fix the problem, add a non-empty `@description` decorator:

```bicep
@description('The name assigned to the storage account.')
var storageAccountName = '${namePrefix}storage'
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
