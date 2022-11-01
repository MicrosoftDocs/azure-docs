---
title: Linter rule - decompiler cleanup
description: Linter rule - decompiler cleanup
ms.topic: conceptual
ms.date: 11/01/2022
---

# Linter rule - decompiler cleanup

The [Bicep CLI decompile](./bicep-cli.md#decompile) command converts ARM template JSON to a Bicep file. If a variable name, or a parameter name, or a resource symbolic symbolic name is ambiguous, the Bicep CLI adds a suffix to the name, for example *accountName_var* or *virtualNetwork_resource*. This rule finds these names in Bicep files.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`decompiler-cleanup`

## Solution

To increase the readability, update these names with more meaningful names.

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
