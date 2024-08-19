---
title: Linter rule - use recent module versions
description: Linter rule - use recent module versions
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 07/30/2024
---

# Linter rule - use recent module versions

This rule looks for old [public module](./modules.md#public-module-registry) versions. It's best to use the most recent module versions.

> [!NOTE]
> This rule is off by default, change the level in [bicepconfig.json](./bicep-config-linter.md) to enable it.

## Linter rule code

To customize rule settings, use the following value in the [Bicep configuration file](bicep-config-linter.md) :

`use-recent-module-versions`

## Solution

The following example fails this test because an older module version is used:

```bicep
module storage 'br/public:avm/res/storage/storage-account:0.6.0' = {
  name: 'myStorage'
  params: {
    name: 'store${resourceGroup().name}'
  }
}
```

Use the most recent module version.

Use **Quick Fix** to use the latest module versions:

:::image type="content" source="./media/linter-rule-use-recent-module-versions/linter-rule-use-recent-module-versions-quick-fix.png" alt-text="The screenshot of Simplify interpolation linter rule quick fix.":::

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
