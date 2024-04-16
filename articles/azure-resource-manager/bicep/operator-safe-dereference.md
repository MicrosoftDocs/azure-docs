---
title: Bicep safe-dereference operator
description: Describes Bicep safe-dereference operator.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Bicep safe-dereference operator

The safe-dereference operator provides a way to access properties of an object or elements of an array in a safe manner. It helps to prevent errors that can occur when attempting to access properties or elements without proper knowledge of their existence or value.

## safe-dereference

`<base>.?<property>`
`<base>[?<index>]`

A safe-dereference operator applies a member access, `.?<property>`, or element access, `[?<index>]`, operation to its operand only if that operand evaluates to non-null; otherwise, it returns null. That is,

- If `a` evaluates to `null`, the result of `a.?x` or `a[?x]` is `null`.
- If `a` is an object that doesn't have an `x` property, then `a.?x` is `null`.
- If `a` is an array whose length is less than or equal to `x`, then `a[?x]` is `null`.
- If `a` is non-null and has a property named `x`, the result of `a.?x` is the same as the result of `a.x`.
- If `a` is non-null and has an element at index `x`, the result of `a[?x]` is the same as the result of `a[x]`

The safe-dereference operators are short-circuiting. That is, if one operation in a chain of conditional member or element access operations returns `null`, the rest of the chain doesn't execute. In the following example, `.?name` isn't evaluated if `storageAccountsettings[?i]` evaluates to `null`:

```bicep
param storageAccountSettings array = []
param storageCount int
param location string = resourceGroup().location

resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' = [for i in range(0, storageCount): {
  name: storageAccountSettings[?i].?name ?? 'defaultname'
  location: storageAccountSettings[?i].?location ?? location
  kind: storageAccountSettings[?i].?kind ?? 'StorageV2'
  sku: {
    name: storageAccountSettings[?i].?sku ?? 'Standard_GRS'
  }
}]

```

## Next steps

- To run the examples, use Azure CLI or Azure PowerShell to [deploy a Bicep file](./quickstart-create-bicep-use-visual-studio-code.md#deploy-the-bicep-file).
- To create a Bicep file, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
- For information about how to resolve Bicep type errors, see [Any function for Bicep](./bicep-functions-any.md).
