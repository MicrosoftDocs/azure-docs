---
title: Bicep safe-dereference operator
description: Describes Bicep safe-dereference operator.
ms.topic: conceptual
ms.date: 05/04/2023
---

# Bicep safe-dereference operator

A safe-dereference operator applies a member access, `?.`, or element access, `?[]`, operation to its operand only if that operand evaluates to non-null; otherwise, it returns null. That is,

- If `a` evaluates to `null`, the result of `a?.x` or `a?[x]` is `null`.
- If a evaluates to non-null, the result of `a?.x` or `a?[x]` is the same as the result of `a.x` or `a[x]`, respectively.

## safe-dereference

`expression!`

The safe-dereference operator ensures that a value is not null, thereby changing the assigned type of the value from `null | <type>` to `<type>`.
The following example fails the design time validation:

```bicep
param inputString string

output outString string = first(skip(split(input, '/'), 1))
```

The warning message is:

```error
Expected a value of type "string" but the provided value is of type "null | string".
```

To solve the problem use the safe-dereference operator:

```bicep
param inputString string

output outString string = first(skip(split(input, '/'), 1))!
```

## Next steps

- To run the examples, use Azure CLI or Azure PowerShell to [deploy a Bicep file](./quickstart-create-bicep-use-visual-studio-code.md#deploy-the-bicep-file).
- To create a Bicep file, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
- For information about how to resolve Bicep type errors, see [Any function for Bicep](./bicep-functions-any.md).