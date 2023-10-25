---
title: Bicep comparison operators
description: Describes Bicep comparison operators that compare values.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/23/2023
---

# Bicep comparison operators

The comparison operators compare values and return either `true` or `false`. To run the examples, use Azure CLI or Azure PowerShell to [deploy a Bicep file](./quickstart-create-bicep-use-visual-studio-code.md#deploy-the-bicep-file).

| Operator | Name |
| ---- | ---- |
| `>=` | [Greater than or equal](#greater-than-or-equal-) |
| `>`  | [Greater than](#greater-than-) |
| `<=` | [Less than or equal](#less-than-or-equal-) |
| `<`  | [Less than](#less-than-) |
| `==` | [Equals](#equals-) |
| `!=` | [Not equal](#not-equal-) |
| `=~` | [Equal case-insensitive](#equal-case-insensitive-) |
| `!~` | [Not equal case-insensitive](#not-equal-case-insensitive-) |

## Greater than or equal >=

`operand1 >= operand2`

Evaluates if the first value is greater than or equal to the second value.

### Operands

| Operand | Type | Description |
| ---- | ---- | ---- |
| `operand1` | integer, string | First value in the comparison. |
| `operand2` | integer, string | Second value in the comparison. |

### Return value

If the first value is greater than or equal to the second value, `true` is returned. Otherwise, `false` is returned.

### Example

A pair of integers and pair of strings are compared.

```bicep
param firstInt int = 10
param secondInt int = 5

param firstString string = 'A'
param secondString string = 'A'

output intGtE bool = firstInt >= secondInt
output stringGtE bool = firstString >= secondString
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| `intGtE` | boolean | true |
| `stringGtE` | boolean | true |

## Greater than >

`operand1 > operand2`

Evaluates if the first value is greater than the second value.

### Operands

| Operand | Type | Description |
| ---- | ---- | ---- |
| `operand1` | integer, string | First value in the comparison. |
| `operand2` | integer, string | Second value in the comparison. |

### Return value

If the first value is greater than the second value, `true` is returned. Otherwise, `false` is returned.

### Example

A pair of integers and pair of strings are compared.

```bicep
param firstInt int = 10
param secondInt int = 5

param firstString string = 'bend'
param secondString string = 'band'

output intGt bool = firstInt > secondInt
output stringGt bool = firstString > secondString
```

Output from the example:

The **e** in **bend** makes the first string greater.

| Name | Type | Value |
| ---- | ---- | ---- |
| `intGt` | boolean | true |
| `stringGt` | boolean | true |

## Less than or equal <=

`operand1 <= operand2`

Evaluates if the first value is less than or equal to the second value.

### Operands

| Operand | Type | Description |
| ---- | ---- | ---- |
| `operand1` | integer, string | First value in the comparison. |
| `operand2` | integer, string | Second value in the comparison. |

### Return value

If the first value is less than or equal to the second value, `true` is returned. Otherwise, `false` is returned.

### Example

A pair of integers and pair of strings are compared.

```bicep
param firstInt int = 5
param secondInt int = 10

param firstString string = 'demo'
param secondString string = 'demo'

output intLtE bool = firstInt <= secondInt
output stringLtE bool = firstString <= secondString
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| `intLtE` | boolean | true |
| `stringLtE` | boolean | true |

## Less than <

`operand1 < operand2`

Evaluates if the first value is less than the second value.

### Operands

| Operand | Type | Description |
| ---- | ---- | ---- |
| `operand1` | integer, string | First value in the comparison. |
| `operand2` | integer, string | Second value in the comparison. |

### Return value

If the first value is less than the second value, `true` is returned. Otherwise, `false` is returned.

### Example

A pair of integers and pair of strings are compared.

```bicep
param firstInt int = 5
param secondInt int = 10

param firstString string = 'demo'
param secondString string = 'Demo'

output intLt bool = firstInt < secondInt
output stringLt bool = firstString < secondString
```

Output from the example:

The string is `true` because lowercase letters are less than uppercase letters.

| Name | Type | Value |
| ---- | ---- | ---- |
| `intLt` | boolean | true |
| `stringLt` | boolean | true |

## Equals ==

`operand1 == operand2`

Evaluates if the values are equal.

### Operands

| Operand | Type | Description |
| ---- | ---- | ---- |
| `operand1` | string, integer, boolean, array, object | First value in the comparison. |
| `operand2` | string, integer, boolean, array, object | Second value in the comparison. |

### Return value

If the operands are equal, `true` is returned. If the operands are different, `false` is returned.

### Example

Pairs of integers, strings, and booleans are compared.

```bicep
param firstInt int = 5
param secondInt int = 5

param firstString string = 'demo'
param secondString string = 'demo'

param firstBool bool = true
param secondBool bool = true

output intEqual bool = firstInt == secondInt
output stringEqual bool = firstString == secondString
output boolEqual bool = firstBool == secondBool
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| `intEqual` | boolean | true |
| `stringEqual` | boolean | true |
| `boolEqual` | boolean | true |

When comparing arrays, the two arrays must have the same elements and order. The arrays don't need to be assigned to each other.

```bicep
var array1 = [
  1
  2
  3
]

var array2 = [
  1
  2
  3
]

var array3 = array2

var array4 = [
  3
  2
  1
]

output sameElements bool = array1 == array2 // returns true because arrays are defined with same elements
output assignArray bool = array2 == array3 // returns true because one array was defined as equal to the other array
output differentOrder bool = array4 == array1 // returns false because order of elements is different
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| sameElements | bool | true |
| assignArray | bool | true |
| differentOrder | bool | false |

When comparing objects, the property names and values must be the same. The properties don't need to be defined in the same order.

```bicep
var object1 = {
  prop1: 'val1'
  prop2: 'val2'
}

var object2 = {
  prop1: 'val1'
  prop2: 'val2'
}

var object3 = {
  prop2: 'val2'
  prop1: 'val1'
}

var object4 = object3

var object5 = {
  prop1: 'valX'
  prop2: 'valY'
}

output sameObjects bool = object1 == object2 // returns true because both objects defined with same properties
output differentPropertyOrder bool = object3 == object2 // returns true because both objects have same properties even though order is different
output assignObject bool = object4 == object1 // returns true because one object was defined as equal to the other object
output differentValues bool = object5 == object1 // returns false because values are different
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| sameObjects | bool | true |
| differentPropertyOrder | bool | true |
| assignObject | bool | true |
| differentValues | bool | false |

## Not equal !=

`operand1 != operand2`

Evaluates if two values are **not** equal.

### Operands

| Operand | Type | Description |
| ---- | ---- | ---- |
| `operand1` | string, integer, boolean, array, object | First value in the comparison. |
| `operand2` | string, integer, boolean, array, object | Second value in the comparison. |

### Return value

If the operands are **not** equal, `true` is returned. If the operands are equal, `false` is returned.

### Example

Pairs of integers, strings, and booleans are compared.

```bicep
param firstInt int = 10
param secondInt int = 5

param firstString string = 'demo'
param secondString string = 'test'

param firstBool bool = false
param secondBool bool = true

output intNotEqual bool = firstInt != secondInt
output stringNotEqual bool = firstString != secondString
output boolNotEqual bool = firstBool != secondBool
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| `intNotEqual` | boolean | true |
| `stringNotEqual` | boolean | true |
| `boolNotEqual` | boolean | true |

For arrays and objects, see examples in [equals](#equals-).

## Equal case-insensitive =~

`operand1 =~ operand2`

Ignores case to determine if the two values are equal.

### Operands

| Operand | Type | Description |
| ---- | ---- | ---- |
| `operand1`  | string | First string in the comparison. |
| `operand2`  | string | Second string in the comparison. |

### Return value

If the strings are equal, `true` is returned. Otherwise, `false` is returned.

### Example

Compares strings that use mixed-case letters.

```bicep
param firstString string = 'demo'
param secondString string = 'DEMO'

param thirdString string = 'demo'
param fourthString string = 'TEST'

output strEqual1 bool = firstString =~ secondString
output strEqual2 bool = thirdString =~ fourthString
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| `strEqual1` | boolean | true |
| `strEqual2` | boolean | false |

## Not equal case-insensitive !~

`operand1 !~ operand2`

Ignores case to determine if the two values are **not** equal.

### Operands

| Operand | Type | Description |
| ---- | ---- | ---- |
| `operand1` | string | First string in the comparison. |
| `operand2` | string | Second string in the comparison. |

### Return value

If the strings are **not** equal, `true` is returned. Otherwise, `false` is returned.

### Example

Compares strings that use mixed-case letters.

```bicep
param firstString string = 'demo'
param secondString string = 'TEST'

param thirdString string = 'demo'
param fourthString string = 'DeMo'

output strNotEqual1 bool = firstString !~ secondString
output strEqual2 bool = thirdString !~ fourthString
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| `strNotEqual1` | boolean | true |
| `strNotEqual2` | boolean | false |

## Next steps

- To create a Bicep file, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
- For information about how to resolve Bicep type errors, see [Any function for Bicep](./bicep-functions-any.md).
- To compare syntax for Bicep and JSON, see [Comparing JSON and Bicep for templates](./compare-template-syntax.md).
- For examples of Bicep functions, see [Bicep functions](./bicep-functions.md).
