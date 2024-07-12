---
title: BCP037
description: Warning - The property <property-name> is not allowed on objects of type <type-definition>.
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 07/12/2024
---

# Bicep warning code - BCP037

This warning occurs when you specify a property that is not defined in a [user-defined data type](./user-defined-data-types.md).

## Warning description

`The property <property-name> is not allowed on objects of type <type-defintion>.`

## Solution

Remove the undefined property.

## Examples

The following example raises the warning because `bar` is not defined in `storageAccountType`:

```bicep
type storageAccountConfigType = {
  name: string
  sku: string
}

param foo storageAccountConfigType = {
  name: 'myStorage'
  sku: 'Standard_LRS' 
  bar: 'myBar'
}
```

You can fix the issue by removing the property:

```bicep
type storageAccountConfigType = {
  name: string
  sku: string
}

param foo storageAccountConfigType = {
  name: 'myStorage'
  sku: 'Standard_LRS' 
}
```

## Next steps

For more information about Bicep warning and error codes, see [Bicep warnings and errors](./bicep-error-codes.md).
