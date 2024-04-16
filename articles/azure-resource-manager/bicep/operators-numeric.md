---
title: Bicep numeric operators
description: Describes Bicep numeric operators that calculate values.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/23/2023
---

# Bicep numeric operators

The numeric operators use integers to do calculations and return integer values. To run the examples, use Azure CLI or Azure PowerShell to [deploy Bicep file](./quickstart-create-bicep-use-visual-studio-code.md#deploy-the-bicep-file).

| Operator | Name |
| ---- | ---- |
| `*` | [Multiply](#multiply-) |
| `/` | [Divide](#divide-) |
| `%` | [Modulo](#modulo-) |
| `+` | [Add](#add-) |
| `-` | [Subtract](#subtract--) |
| `-` | [Minus](#minus--) |

> [!NOTE]
> Subtract and minus use the same operator. The functionality is different because subtract uses two
> operands and minus uses one operand.

## Multiply *

`operand1 * operand2`

Multiplies two integers.

### Operands

| Operand | Type | Description |
| ---- | ---- | ---- |
| `operand1`  | integer | Number to multiply. |
| `operand2`  | integer  | Multiplier of the number. |

### Return value

The multiplication returns the product as an integer.

### Example

Two integers are multiplied and return the product.

```bicep
param firstInt int = 5
param secondInt int = 2

output product int = firstInt * secondInt
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| `product` | integer | 10 |

## Divide /

`operand1 / operand2`

Divides an integer by an integer.

### Operands

| Operand | Type | Description |
| ---- | ---- | ---- |
| `operand1` | integer | Integer that's divided. |
| `operand2` | integer | Integer that's used for division. Can't be zero. |

### Return value

The division returns the quotient as an integer.

### Example

Two integers are divided and return the quotient.

```bicep
param firstInt int = 10
param secondInt int = 2

output quotient int = firstInt / secondInt
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| `quotient` | integer | 5 |

## Modulo %

`operand1 % operand2`

Divides an integer by an integer and returns the remainder.

### Operands

| Operand | Type | Description |
| ---- | ---- | ---- |
| `operand1`  | integer  | The integer that's divided. |
| `operand2`  | integer  | The integer that's used for division. Can't be 0. |

### Return value

The remainder is returned as an integer. If the division doesn't produce a remainder, 0 is returned.

### Example

Two pairs of integers are divided and return the remainders.

```bicep
param firstInt int = 10
param secondInt int = 3

param thirdInt int = 8
param fourthInt int = 4

output remainder int = firstInt % secondInt
output zeroRemainder int = thirdInt % fourthInt
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| `remainder` | integer | 1 |
| `zeroRemainder` | integer | 0 |

## Add +

`operand1 + operand2`

Adds two integers.

### Operands

| Operand | Type | Description |
| ---- | ---- | ---- |
| `operand1` | integer | Number to add. |
| `operand2` | integer | Number that's added to a number. |

### Return value

The addition returns the sum as an integer.

### Example

Two integers are added and return the sum.

```bicep
param firstInt int = 10
param secondInt int = 2

output sum int = firstInt + secondInt
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| `sum` | integer | 12 |

## Subtract -

`operand1 - operand2`

Subtracts an integer from an integer.

### Operands

| Operand | Type | Description |
| ---- | ---- | ---- |
| `operand1` | integer | Larger number that's subtracted from. |
| `operand2` | integer | Number that's subtracted from the larger number. |

### Return value

The subtraction returns the difference as an integer.

### Example

An integer is subtracted and returns the difference.

```bicep
param firstInt int = 10
param secondInt int = 4

output difference int = firstInt - secondInt
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| `difference` | integer | 6 |

## Minus -

`-integerValue`

Multiplies an integer by `-1`.

### Operand

| Operand | Type | Description |
| ---- | ---- | ---- |
| `integerValue` | integer | Integer multiplied by `-1`. |

### Return value

An integer is multiplied by `-1`. A positive integer returns a negative integer and a negative integer returns a positive integer. The values can be wrapped with parentheses.

### Example

```bicep
param posInt int = 10
param negInt int = -20

output startedPositive int = -posInt
output startedNegative int = -(negInt)
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| `startedPositive` | integer | -10 |
| `startedNegative` | integer | 20 |

## Next steps

- To create a Bicep file, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
- For information about how to resolve Bicep type errors, see [Any function for Bicep](./bicep-functions-any.md).
- To compare syntax for Bicep and JSON, see [Comparing JSON and Bicep for templates](./compare-template-syntax.md).
- For examples of Bicep functions, see [Bicep functions](./bicep-functions.md).
