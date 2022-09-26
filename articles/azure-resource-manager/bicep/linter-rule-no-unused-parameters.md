---
title: Linter rule - no unused parameters
description: Linter rule - no unused parameters
ms.topic: conceptual
ms.date: 11/18/2021
---

# Linter rule - no unused parameters

This rule finds parameters that aren't referenced anywhere in the Bicep file.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-unused-params`

## Solution

To reduce confusion in your template, delete any parameters that are defined but not used. This test finds any parameters that aren't used anywhere in the template. Eliminating unused parameters also makes it easier to deploy your template because you don't have to provide unnecessary values.

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
