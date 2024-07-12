---
title: BCP328
description: Error - The provided value (which will always be less than or equal to <value>) is too small to assign to a target for which the minimum allowable value is <min-value>.
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 07/12/2024
---

# Bicep error code - BCP328

This error occurs when you assign a value that is less than the allowable value.

## Error description

`The provided value (which will always be less than or equal to <value>) is too small to assign to a target for which the minimum allowable value is <min-value>.`

## Solution

Assign a value that falls within the permitted range.

## Examples

The following example raises the error because `0` is less than minimum allowable value:

```bicep
@minValue(1)
@maxValue(12)
param month int = 0

```

You can fix the error by assigning a value within the permitted range:

```bicep
@minValue(1)
@maxValue(12)
param month int = 1
```

## Next steps

For more information about Bicep warning and error codes, see [Bicep warnings and errors](./bicep-error-codes.md).