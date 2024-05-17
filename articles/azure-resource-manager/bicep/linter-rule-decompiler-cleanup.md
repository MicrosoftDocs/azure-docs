---
title: Linter rule - decompiler cleanup
description: Linter rule - decompiler cleanup
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule - decompiler cleanup

The [Bicep CLI decompile](./bicep-cli.md#decompile) command converts ARM template JSON to a Bicep file. If a variable name, or a parameter name, or a resource symbolic name is ambiguous, the Bicep CLI adds a suffix to the name, for example *accountName_var* or *virtualNetwork_resource*. This rule finds these names in Bicep files.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`decompiler-cleanup`

## Solution

To increase the readability, update these names with more meaningful names.

The following example fails this test because the two variable names appear to have originated from a naming conflict during a decompilation from JSON.

```bicep
var hostingPlanName_var = functionAppName
var storageAccountName_var = 'azfunctions${uniqueString(resourceGroup().id)}'
```

This example passes this test.

```bicep
var hostingPlanName = functionAppName
var storageAccountName = 'azfunctions${uniqueString(resourceGroup().id)}'
```

Consider using <kbd>F2</kbd> in Visual Studio Code to replace symbols. 

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
