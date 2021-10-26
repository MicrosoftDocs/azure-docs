---
title: Linter rule - no unused variables
description: Linter rule - no unused variables
ms.topic: conceptual
ms.date: 10/14/2021
---

# Linter rule - no unused variables

This rule finds variables that aren't referenced anywhere in the Bicep file.

## Returned code

`no-unused-vars`

## Solution

To reduce confusion in your template, delete any variables that are defined but not used. This test finds any variables that aren't used anywhere in the template.

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
