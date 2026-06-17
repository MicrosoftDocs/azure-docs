---
title: Linter rule - use recognized resource type
description: Linter rule - use recognized resource type
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 06/02/2026
---

# Linter rule - use recognized resource type

This rule warns when [`reference()`](./bicep-functions-resource.md#reference) or [`list*()`](./bicep-functions-resource.md#list) functions reference a resource type that Bicep's type system doesn't recognize (that is, an invalid Azure resource type).

To avoid potential problems and improve template maintainability, use only valid Azure resource types when you call `reference()` or `list*()` functions. This practice helps you catch typos or invalid resource type strings early. When the rule finds an unrecognized type, it might also suggest similar valid resource types through spell-checking.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-recognized-resource-type`

## Solution

The following example fails this test because 'Microsoft.Foo/bar' is not a recognized resource type:

```bicep
output foo object = reference('Microsoft.Foo/bar', '2020-01-01')
```

You can fix the problem by using a valid resource type:

```bicep
output storageKeys object = listKeys(resourceId('Microsoft.Storage/storageAccounts', storageAccountName), '2026-04-01')
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
