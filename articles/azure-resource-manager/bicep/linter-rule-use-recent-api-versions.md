---
title: Linter rule - use recent API versions
description: Linter rule - use recent API versions
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 10/14/2024
---

# Linter rule - use recent API versions

This rule looks for resource API versions that are older than 730 days. It is recommended to use the most recent API versions.

> [!NOTE]
> This rule is off by default. Change the level in [bicepconfig.json](./bicep-config-linter.md) to enable it.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-recent-api-versions`

The rule includes a configuration property named `maxAllowedAgeInDays`, with a default value of **730** days (equivalent to two years). A value of **0** indicates that the API version must be the latest version available not in preview or the latest preview version if only previews are available.

## Solution

Use the most recent API version or one that isn't older than 730 days.

Use **Quick Fix** to use the latest API version:

:::image type="content" source="./media/linter-rule-use-recent-api-versions/linter-rule-use-recent-api-versions-quick-fix.png" alt-text="A screenshot of using Quick Fix for the use-recent-api-versions linter rule.":::

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
