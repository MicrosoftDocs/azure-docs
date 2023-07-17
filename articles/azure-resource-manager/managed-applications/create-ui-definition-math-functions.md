---
title: Create UI definition math functions
description: Describes the functions to use when performing math operations.
ms.topic: conceptual
ms.date: 07/13/2020
---

# CreateUiDefinition math functions

The functions enable you to perform math operations.

## add

Adds two numbers, and returns the result.

The following example returns `3`:

```json
"[add(1, 2)]"
```

## ceil

Returns the largest integer greater than or equal to the specified number.

The following example returns `4`:

```json
"[ceil(3.14)]"
```

## div

Divides the first number by the second number, and returns the result. The result is always an integer.

The following example returns `2`:

```json
"[div(6, 3)]"
```

## floor

Returns the largest integer less than or equal to the specified number.

The following example returns `3`:

```json
"[floor(3.14)]"
```

## max

Returns the larger of the two numbers.

The following example returns `2`:

```json
"[max(1, 2)]"
```

## min

Returns the smaller of the two numbers.

The following example returns `1`:

```json
"[min(1, 2)]"
```

## mod

Divides the first number by the second number, and returns the remainder.

The following example returns `0`:

```json
"[mod(6, 3)]"
```

The following example returns `2`:

```json
"[mod(6, 4)]"
```

## mul

Multiplies two numbers, and returns the result.

The following example returns `6`:

```json
"[mul(2, 3)]"
```

## rand

Returns a random integral number within the specified range. This function does not generate cryptographically secure random numbers.

The following example could return `42`:

```json
"[rand(-100, 100)]"
```

## range

Generates a sequence of integral numbers within the specified range.

The following example returns `[1,2,3]`:

```json
"[range(1, 3)]"
```

## sub

Subtracts the second number from the first number, and returns the result.

The following example returns `1`:

```json
"[sub(3, 2)]"
```

## Next steps

* For an introduction to Azure Resource Manager, see [Azure Resource Manager overview](../management/overview.md).
