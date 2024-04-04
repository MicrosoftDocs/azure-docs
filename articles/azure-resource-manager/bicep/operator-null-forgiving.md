---
title: Bicep null-forgiving operator
description: Describes Bicep null-forgiving operator.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 05/04/2023
---

# Bicep null-forgiving operator

The unary postfix `!` operator is the null-forgiving, or null-suppression, operator. It's used to suppress all nullable warnings for the preceding expression. The null-forgiving operator has no effect at run time. It only affects the compiler's static flow analysis by changing the null state of the expression. At run time, expression `x!` evaluates to the result of the underlying expression `x`.

## Null-forgiving

`expression!`

The null-forgiving operator ensures that a value isn't null, thereby changing the assigned type of the value from `null | <type>` to `<type>`.
The following example fails the design time validation:

```bicep
param inputString string

output outString string = first(skip(split(input, '/'), 1))
```

The warning message is:

```error
Expected a value of type "string" but the provided value is of type "null | string".
```

To solve the problem, use the null-forgiving operator:

```bicep
param inputString string

output outString string = first(skip(split(input, '/'), 1))!
```

## Next steps

- To run the examples, use Azure CLI or Azure PowerShell to [deploy a Bicep file](./quickstart-create-bicep-use-visual-studio-code.md#deploy-the-bicep-file).
- To create a Bicep file, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
- For information about how to resolve Bicep type errors, see [Any function for Bicep](./bicep-functions-any.md).
