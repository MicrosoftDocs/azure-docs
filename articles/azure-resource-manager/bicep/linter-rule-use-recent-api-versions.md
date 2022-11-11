---
title: Linter rule - use recent API versions
description: Linter rule - use recent API versions
ms.topic: conceptual
ms.date: 09/30/2022
---

# Linter rule - use recent API versions

This rule looks for resource API versions that are older than 730 days. It is recommended to use the most recent API versions.

> [!NOTE]
> This rule is off by default, change the level in [bicepconfig.json](./bicep-config-linter.md) to enable it.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-recent-api-versions`

## Solution

Use the most recent API version, or one that is no older than 730 days.

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
