---
title: Linter rule - no unused variables
description: Linter rule - no unused variables
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 10/14/2024
---

# Linter rule - no unused variables

This rule finds variables that aren't referenced anywhere in the Bicep file.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-unused-vars`

## Solution

To reduce confusion in your template, delete any variables that are defined but not used. This test finds all variables that aren't used anywhere in the template.

Use **Quick Fix** to remove the unused variables:

:::image type="content" source="./media/linter-rule-no-unused-variables/linter-rule-no-unused-variables-quick-fix.png" alt-text="A screenshot of using Quick Fix for the no-unused-variables linter rule.":::

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
