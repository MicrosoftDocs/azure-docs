---
title: Linter rule - no explicit any
description: Linter rule - no explicit any
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 10/23/2025
---

# Linter rule - no explicit any

This rule discourages the use of the `any` type in Bicep files.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-explicit-any`

## Solution

Using `any` disables type checking and removes the benefits of Bicep's strong typing system. This can lead to runtime deployment errors that could have been caught earlier by the compiler. Instead of `any`, specify a more precise type such as `string`, `int`, `bool`, `array`, `object`, and so on. This helps ensure your templates are predictable and maintainable. For more information about Bicep types, see [Data types in Bicep](./data-types.md).

The following example **fails** this rule:

```bicep
param inputValue any
```

You can fix it by declaring a specific type:

```bicep
param inputValue string
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
