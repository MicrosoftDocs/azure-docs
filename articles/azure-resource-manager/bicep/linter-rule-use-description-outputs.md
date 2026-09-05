---
title: Linter rule - use description outputs
description: Linter rule - use description outputs
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 08/12/2026
---

# Linter rule - use description outputs

This rule requires every output to have a non-empty `@description` decorator. Clear descriptions explain the value returned by an output.

> [!NOTE]
> This rule is off by default. Change the level in [bicepconfig.json](./bicep-config-linter.md) to enable it.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-description-outputs`

## Solution

The following output fails this rule because it has no description:

```bicep
output storageAccountName string = storageAccount.name
```

To fix the problem, add a non-empty `@description` decorator:

```bicep
@description('The name of the deployed storage account.')
output storageAccountName string = storageAccount.name
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
