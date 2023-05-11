---
title: Bicep functions - logical
description: Describes the functions to use in a Bicep file to determine logical values.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 01/30/2023
---

# Logical functions for Bicep

Bicep provides the `bool` function for converting values to a boolean.

Most of the logical functions in Azure Resource Manager templates are replaced with [logical operators](./operators-logical.md) in Bicep.

## bool

`bool(arg1)`

Converts the parameter to a boolean.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |string or int |The value to convert to a boolean. String value "true" with any combination of upper and lower case characters (for example "True", "TRUE", "tRue", "true") are considered to be equivalent and represent the boolean value of `true`, otherwise `false`. Integer value 0 is considered to be `false` and all other integers are considered to be `true`.  |

### Return value

A boolean of the converted value.

### Examples

The following example shows how to use bool with a string or integer.

```bicep
output trueString1 bool = bool('true')
output trueString2 bool = bool('trUe')
output falseString1 bool = bool('false')
output falseString2 bool = bool('falSe')
output trueInt2 bool = bool(2)
output trueInt1 bool = bool(1)
output trueIntNeg1 bool = bool(-1)
output falseInt0 bool = bool(0)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| trueString1 | Bool | true |
| trueString2 | Bool | true |
| falseString1 | Bool | false |
| falseString2 | Bool | false |
| trueInt2 | Bool | true |
| trueInt1 | Bool | true |
| trueIntNeg1 | Bool | true |
| falseInt | Bool | false |

## Next steps

* For other actions involving logical values, see [logical operators](./operators-logical.md).
