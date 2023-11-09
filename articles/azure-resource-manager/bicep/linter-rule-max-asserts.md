---
title: Linter rule - max asserts
description: Linter rule - max asserts.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 11/09/2023
---

# Linter rule - max asserts

This rule checks that the number of predeployment conditions does not exceed `32`.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`max-asserts`

## Solution

Reduce the number of predeployment conditions in your template.

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
