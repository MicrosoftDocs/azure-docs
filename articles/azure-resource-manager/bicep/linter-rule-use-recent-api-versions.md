---
title: Linter rule - use recent API versions
description: Linter rule - use recent API versions
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule - use recent API versions

This rule looks for resource API versions that are older than 730 days. It is recommended to use the most recent API versions.

> [!NOTE]
> This rule is off by default, change the level in [bicepconfig.json](./bicep-config-linter.md) to enable it.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-recent-api-versions`

The rule includes a configuration property named `maxAllowedAgeInDays`, with a default value of **730** days (equivalent to 2 years). A value of **0** indicates that the apiVersion must be the latest non-preview version available or the latest preview version if only previews are available.

## Solution

Use the most recent API version, or one that is no older than 730 days.

Use **Quick Fix** to use the latest API versions:

:::image type="content" source="./media/linter-rule-use-recent-api-versions/linter-rule-use-recent-api-versions-quick-fix.png" alt-text="The screenshot of Simplify interpolation linter rule quick fix.":::

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
