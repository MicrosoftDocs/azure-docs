---
title: Linter rule - max variables
description: Linter rule - max variables
ms.topic: conceptual
ms.date: 11/18/2021
---

# Linter rule - max variables

This rule checks if the number of variables does not exceed the [ARM template limits](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/best-practices#template-limits).

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`max-variables`

## Solution

Reduce the number of variables in your template.

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
