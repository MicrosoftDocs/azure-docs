---
title: Linter rule - no unused existing resources
description: Linter rule - no unused existing resources
ms.topic: conceptual
ms.date: 07/21/2022
---

# Linter rule - no unused existing resources

This rule finds [existing resources](./existing-resource.md) that aren't referenced anywhere in the Bicep file.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-unused-existing-resources`

## Solution

To reduce confusion in your template, delete any [existing resources](./existing-resource.md) that are defined but not used. This test finds any existing resource that isn't used anywhere in the template.

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
