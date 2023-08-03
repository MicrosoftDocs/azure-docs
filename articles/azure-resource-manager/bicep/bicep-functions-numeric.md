---
title: Bicep functions - numeric
description: Describes the functions to use in a Bicep file to work with numbers.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/23/2023
---

# Numeric functions for Bicep

This article describes the Bicep functions for working with integers.

Some of the Azure Resource Manager JSON numeric functions are replaced with [Bicep numeric operators](./operators-numeric.md).

## int

`int(valueToConvert)`

Converts the specified value to an integer.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| valueToConvert |Yes |string or int |The value to convert to an integer. |

### Return value

An integer of the converted value.

### Example

The following example converts the user-provided parameter value to integer.

```bicep
param stringToConvert string = '4'

output inResult int = int(stringToConvert)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| intResult | Int | 4 |

## max

`max(arg1)`

Returns the maximum value from an array of integers or a comma-separated list of integers.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array of integers, or comma-separated list of integers |The collection to get the maximum value. |

### Return value

An integer representing the maximum value from the collection.

### Example

The following example shows how to use max with an array and a list of integers:

```bicep
param arrayToTest array = [
  0
  3
  2
  5
  4
]

output arrayOutPut int = max(arrayToTest)
output intOutput int = max(0,3,2,5,4)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Int | 5 |
| intOutput | Int | 5 |

## min

`min(arg1)`

Returns the minimum value from an array of integers or a comma-separated list of integers.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array of integers, or comma-separated list of integers |The collection to get the minimum value. |

### Return value

An integer representing minimum value from the collection.

### Example

The following example shows how to use min with an array and a list of integers:

```bicep
param arrayToTest array = [
  0
  3
  2
  5
  4
]

output arrayOutPut int = min(arrayToTest)
output intOutput int = min(0,3,2,5,4)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Int | 0 |
| intOutput | Int | 0 |

## Next steps

* For other actions involving numbers, see [Bicep numeric operators](./operators-numeric.md).
