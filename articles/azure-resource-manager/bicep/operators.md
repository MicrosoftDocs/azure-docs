---
title: Bicep operators
description: Describes the Bicep operators available for Azure Resource Manager deployments.
ms.topic: conceptual
ms.custom: devx-track-bicep, devx-track-arm-template
ms.date: 05/16/2023
---

# Bicep operators

This article describes the Bicep operators. Operators are used to calculate values, compare values, or evaluate conditions. There are six types of Bicep operators:

- [accessor](#accessor)
- [comparison](#comparison)
- [logical](#logical)
- [null-forgiving](#null-forgiving)
- [numeric](#numeric)
- [safe-dereference](#safe-dereference)

## Operator precedence and associativity

The operators below are listed in descending order of precedence (the higher the position the higher the precedence). Operators listed at the same level have equal precedence.

| Symbol | Type of Operation | Associativity |
|:-|:-|:-|
| `(` `)` `[` `]` `.` `::` | Parentheses, array indexers, property accessors, and nested resource accessor  | Left to right |
| `!` `-` | Unary | Right to left |
| `%` `*` `/` | Multiplicative | Left to right |
| `+` `-` | Additive | Left to right |
| `<=` `<` `>` `>=` | Relational | Left to right |
| `==` `!=` `=~` `!~` | Equality | Left to right |
| `&&` | Logical AND | Left to right |
| `||` | Logical OR | Left to right |
| `??` | Coalesce | Left to right
| `?` `:` | Conditional expression (ternary) | Right to left

## Parentheses

Enclosing an expression between parentheses allows you to override the default Bicep operator precedence. For example, the expression `x + y / z` evaluates the division first and then the addition. However, the expression `(x + y) / z` evaluates the addition first and division second.

## Accessor

The accessor operators are used to access nested resources and properties on objects.

| Operator | Name | Description |
| ---- | ---- | ---- |
| `[]` | [Index accessor](./operators-access.md#index-accessor) | Access an element of an array or property on an object. |
| `.` | [Function accessor](./operators-access.md#function-accessor) | Call a function on a resource. |
| `::` | [Nested resource accessor](./operators-access.md#nested-resource-accessor) | Access a nested resource from outside of the parent resource. |
| `.` | [Property accessor](./operators-access.md#property-accessor) | Access properties of an object. |

## Comparison

The comparison operators compare values and return either `true` or `false`.

| Operator | Name | Description |
| ---- | ---- | ---- |
| `>=` | [Greater than or equal](./operators-comparison.md#greater-than-or-equal-) | Evaluates if the first value is greater than or equal to the second value. |
| `>`  | [Greater than](./operators-comparison.md#greater-than-) | Evaluates if the first value is greater than the second value. |
| `<=` | [Less than or equal](./operators-comparison.md#less-than-or-equal-) | Evaluates if the first value is less than or equal to the second value. |
| `<`  | [Less than](./operators-comparison.md#less-than-) | Evaluates if the first value is less than the second value. |
| `==` | [Equals](./operators-comparison.md#equals-) | Evaluates if two values are equal. |
| `!=` | [Not equal](./operators-comparison.md#not-equal-) | Evaluates if two values are **not** equal. |
| `=~` | [Equal case-insensitive](./operators-comparison.md#equal-case-insensitive-) | Ignores case to determine if two values are equal. |
| `!~` | [Not equal case-insensitive](./operators-comparison.md#not-equal-case-insensitive-) | Ignores case to determine if two values are **not** equal. |

## Logical

The logical operators evaluate boolean values, return non-null values, or evaluate a conditional expression.

| Operator | Name | Description |
| ---- | ---- | ---- |
| `&&` | [And](./operators-logical.md#and-) | Returns `true` if all values are true. |
| `||`| [Or](./operators-logical.md#or-) | Returns `true` if either value is true. |
| `!` | [Not](./operators-logical.md#not-) | Negates a boolean value. Takes one operand. |
| `??` | [Coalesce](./operators-logical.md#coalesce-) | Returns the first non-null value. |
| `?` `:` | [Conditional expression](./operators-logical.md#conditional-expression--) | Evaluates a condition for true or false and returns a value. |

## Null-forgiving

The null-forgiving operator suppresses all nullable warnings for the preceding expression.

| Operator | Name | Description |
| ---- | ---- | ---- |
| `!` | [Null-forgiving](./operator-null-forgiving.md#null-forgiving) | Suppresses all nullable warnings for the preceding expression. |

## Numeric

The numeric operators use integers to do calculations and return integer values.

| Operator | Name | Description |
| ---- | ---- | ---- |
| `*` | [Multiply](./operators-numeric.md#multiply-) | Multiplies two integers. |
| `/` | [Divide](./operators-numeric.md#divide-) | Divides an integer by an integer. |
| `%` | [Modulo](./operators-numeric.md#modulo-) | Divides an integer by an integer and returns the remainder. |
| `+` | [Add](./operators-numeric.md#add-) | Adds two integers. |
| `-` | [Subtract](./operators-numeric.md#subtract--) | Subtracts one integer from another integer. Takes two operands. |
| `-` | [Minus](./operators-numeric.md#minus--) (unary) | Multiplies an integer by `-1`. Takes one operand. |

> [!NOTE]
> Subtract and minus use the same operator. The functionality is different because subtract uses two
> operands and minus uses one operand.

## Safe-dereference

The safe-dereference operator helps to prevent errors that can occur when attempting to access properties or elements without proper knowledge of their existence or value.

| Operator | Name | Description |
| ---- | ---- | ---- |
| `<base>.?<property>`, `<base>[?<index>]` | [Safe-dereference](./operator-safe-dereference.md#safe-dereference) | Applies an object member access or an array element access operation to its operand only if that operand evaluates to non-null, otherwise, it returns `null`. |

## Next steps

- To create a Bicep file, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
- For information about how to resolve Bicep type errors, see [Any function for Bicep](./bicep-functions-any.md).
- To compare syntax for Bicep and JSON, see [Comparing JSON and Bicep for templates](./compare-template-syntax.md).
- For examples of Bicep functions, see [Bicep functions](./bicep-functions.md).
