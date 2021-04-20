---
title: Bicep operators
description: Describes the Bicep operators available for Azure Resource Manager deployments.
ms.topic: conceptual
ms.date: 04/15/2021
---

# Bicep operators

This article describes the Bicep operators that are available when you create a Bicep template and use Azure Resource Manager to deploy resources. Operators are used to calculate values, compare values, or evaluate conditions. There are three types of Bicep operators:

- [comparison](#comparison)
- [logical](#logical)
- [numeric](#numeric)

Enclosing an expression between `(` and `)` allows you to override the default Bicep operator precedence. For example, the expression x + y / z evaluates the division first and then the addition. However, the expression (x + y) / z evaluates the addition first and division second.

## Comparison

The comparison operators compare values and return either `true` or `false`.

| Operator | Name | Description |
| ---- | ---- | ---- |
| `>=` | [Greater than or equal](bicep-operators-comparison.md#greater-than-or-equal-) | Evaluates if the first value is greater than or equal to the second value. |
| `>`  | [Greater than](bicep-operators-comparison.md#greater-than-) | Evaluates if the first value is greater than the second value. |
| `<=` | [Less than or equal](bicep-operators-comparison.md#less-than-or-equal-) | Evaluates if the first value is less than or equal to the second value. |
| `<`  | [Less than](bicep-operators-comparison.md#less-than-) | Evaluates if the first value is less than the second value. |
| `==` | [Equals](bicep-operators-comparison.md#equals-) | Evaluates if two values are equal. |
| `!=` | [Not equal](bicep-operators-comparison.md#not-equal-) | Evaluates if two values are **not** equal. |
| `=~` | [Equal case-insensitive](bicep-operators-comparison.md#equal-case-insensitive-) | Ignores case to determine if two values are equal. |
| `!~` | [Not equal case-insensitive](bicep-operators-comparison.md#not-equal-case-insensitive-) | Ignores case to determine if two values are **not** equal. |

## Logical

The logical operators evaluate boolean values, return non-null values, or evaluate a conditional expression.

| Operator | Name | Description |
| ---- | ---- | ---- |
| `&&` | [And](bicep-operators-logical.md#and-) | Returns `true` if all values are true. |
| `||`| [Or](bicep-operators-logical.md#or-) | Returns `true` if either value is true. |
| `!` | [Not](bicep-operators-logical.md#not-) | Negates a boolean value. |
| `??` | [Coalesce](bicep-operators-logical.md#coalesce-) | Returns the first non-null value. |
| `?` `:` | [Conditional expression](bicep-operators-logical.md#conditional-expression--) | Evaluates a condition for true or false and returns a value. |

## Numeric

The numeric operators use integers to do calculations and return integer values.

| Operator | Name | Description |
| ---- | ---- | ---- |
| `*` | [Multiply](bicep-operators-numeric.md#multiply-) | Multiplies two integers. |
| `/` | [Divide](bicep-operators-numeric.md#divide-) | Divides an integer by an integer. |
| `%` | [Modulo](bicep-operators-numeric.md#modulo-) | Divides an integer by an integer and returns the remainder. |
| `+` | [Add](bicep-operators-numeric.md#add-) | Adds two integers. |
| `-` | [Subtract](bicep-operators-numeric.md#subtract--) | Subtracts an integer from an integer. |
| `-` | [Minus](bicep-operators-numeric.md#minus--) | Multiplies an integer by `-1`. |

> [!NOTE]
> Subtract and minus use the same operator. The functionality is different because subtract uses two
> operands and minus uses one operand.

## Next steps

- To create a Bicep file, see [Tutorial: Create and deploy first Azure Resource Manager Bicep file](bicep-tutorial-create-first-bicep.md).
- For information about how to resolve Bicep type errors, see [Any function for Bicep](template-functions-any.md).
- To compare syntax for Bicep and JSON, see [Comparing JSON and Bicep for templates](compare-template-syntax.md).
- For examples of Bicep and ARM template functions, see [ARM template functions](template-functions.md).
