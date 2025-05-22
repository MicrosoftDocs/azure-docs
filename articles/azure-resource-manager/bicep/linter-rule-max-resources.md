---
title: Linter rule - max resources
description: Linter rule - max resources.
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 02/12/2025
---

# Linter rule - max resources

This rule checks that the number of resources does not exceed the [ARM template limits](../templates/best-practices.md#template-limits).

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`max-resources`

## Solution

Reduce the number of outputs in your template.

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
