---
title: Linter rule - max asserts
description: Linter rule - max asserts.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule - max asserts

This rule checks that the number of predeployment conditions doesn't exceed `32`.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`max-asserts`

> [!WARNING]
> This rule is intended used in tandem with `testFramework` experimental feature flag for expected functionality. For more information, see [Bicep Experimental Test Framework](https://github.com/Azure/bicep/issues/11967).

## Solution

Reduce the number of predeployment conditions in your template.

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).