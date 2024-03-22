---
title: Linter rule - no unused variables
description: Linter rule - no unused variables
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule - no unused variables

This rule finds variables that aren't referenced anywhere in the Bicep file.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-unused-vars`

## Solution

To reduce confusion in your template, delete any variables that are defined but not used. This test finds any variables that aren't used anywhere in the template.

You can use **Quick Fix** to remove the unused variables:

:::image type="content" source="./media/linter-rule-no-unused-variables/linter-rule-no-unused-variables-quick-fix.png" alt-text="The screenshot of No unused variables linter rule quick fix.":::

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
