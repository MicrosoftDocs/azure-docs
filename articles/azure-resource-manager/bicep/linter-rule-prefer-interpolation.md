---
title: Linter rule - prefer interpolation
description: Linter rule - prefer interpolation
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule - prefer interpolation

This rule finds uses of the concat function that can be replaced by string interpolation.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`prefer-interpolation`

## Solution

Use string interpolation instead of the `concat` function.

The following example fails this test because the `concat` function is used.

```bicep
param suffix string = '001'
var vnetName = concat('vnet-', suffix)
```

You can fix it by replacing `concat` with string interpolation. The following example passes this test.

```bicep
param suffix string = '001'
var vnetName = 'vnet-${suffix}'
```

Optionally, you can use **Quickfix** to replace the `concat` with string interpolation:

:::image type="content" source="./media/linter-rule-prefer-interpolation/linter-rule-prefer-interpolation-quick-fix.png" alt-text="The screenshot of Prefer interpolation linter rule quick fix.":::

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
