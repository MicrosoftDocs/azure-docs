---
title: Azure Managed Application create UI definition functions | Microsoft Docs
description: Describes the functions to use when constructing UI definitions for Azure Managed Applications
services: managed-applications
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.service: managed-applications
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/12/2017
ms.author: tomfitz

---
# CreateUiDefinition functions
This section contains the signatures for all supported functions of a CreateUiDefinition.

To use a function, surround the declaration with square brackets. For example:

```json
"[function()]"
```

Strings and other functions can be referenced as parameters for a function, but strings must be surrounded in single quotes. For example:

```json
"[fn1(fn2(), 'foobar')]"
```

Where applicable, you can reference properties of the output of a function by using the dot operator. For example:

```json
"[func().prop1]"
```

## Referencing functions
These functions can be used to reference outputs from the properties or context of a CreateUiDefinition.

### basics
Returns the output values of an element that is defined in the Basics step.

The following example returns the output of the element named `foo` in the Basics step:

```json
"[basics('foo')]"
```

### steps
Returns the output values of an element that is defined in the specified step. To get the output values of elements in the Basics step, use `basics()` instead.

The following example returns the output of the element named `bar` in the step named `foo`:

```json
"[steps('foo').bar]"
```

### location
Returns the location selected in the Basics step or the current context.

The following example could return `"westus"`:

```json
"[location()]"
```

## String functions
These functions can only be used with JSON strings.

### concat
Concatenates one or more strings.

For example, if the output value of `element1` if `"bar"`, then this example returns the string `"foobar!"`:

```json
"[concat('foo', steps('step1').element1, '!')]"
```

### substring
Returns the substring of the specified string. The substring starts at the specified index and has the specified length.

The following example returns `"ftw"`:

```json
"[substring('azure-ftw!!!1one', 6, 3)]"
```

### replace
Returns a string in which all occurrences of the specified string in the current string are replaced with another string.

The following example returns `"Everything is awesome!"`:

```json
"[replace('Everything is terrible!', 'terrible', 'awesome')]"
```

### guid
Generates a globally unique string (GUID).

The following example could return `"c7bc8bdc-7252-4a82-ba53-7c468679a511"`:

```json
"[guid()]"
```

### toLower
Returns a string converted to lowercase.

The following example returns `"foobar"`:

```json
"[toLower('FOOBAR')]"
```

### toUpper
Returns a string converted to uppercase.

The following example returns `"FOOBAR"`:

```json
"[toUpper('foobar')]"
```

## Collection functions
These functions can be used with collections, like JSON strings, arrays and objects.

### contains
Returns `true` if a string contains the specified substring, an array contains the specified value, or an object contains the specified key.

#### Example 1: string
The following example returns `true`:

```json
"[contains('foobar', 'foo')]"
```

#### Example 2: array
Assume `element1` returns `[1, 2, 3]`. The following example returns `false`:

```json
"[contains(steps('foo').element1, 4)]"
```

#### Example 3: object
Assume `element1` returns:

```json
{
  "key1": "foobar",
  "key2": "raboof"
}
```

The following example returns `true`:

```json
"[contains(steps('foo').element1, 'key1')]"
```

### length
Returns the number of characters in a string, the number of values in an array, or the number of keys in an object.

#### Example 1: string
The following example returns `6`:

```json
"[length('foobar')]"
```

#### Example 2: array
Assume `element1` returns `[1, 2, 3]`. The following example returns `3`:

```json
"[length(steps('foo').element1)]"
```

#### Example 3: object
Assume `element1` returns:

```json
{
  "key1": "foobar",
  "key2": "raboof"
}
```

The following example returns `2`:

```json
"[length(steps('foo').element1)]"
```

### empty
Returns `true` if the string, array, or object is null or empty.

#### Example 1: string
The following example returns `true`:

```json
"[empty('')]"
```

#### Example 2: array
Assume `element1` returns `[1, 2, 3]`. The following example returns `false`:

```json
"[empty(steps('foo').element1)]"
```

#### Example 3: object
Assume `element1` returns:

```json
{
  "key1": "foobar",
  "key2": "raboof"
}
```

The following example returns `false`:

```json
"[empty(steps('foo').element1)]"
```

#### Example 4: null and undefined
Assume `element1` is `null` or undefined. The following example returns `true`:

```json
"[empty(steps('foo').element1)]"
```

### first
Returns the first character of the specified string; first value of the specified array; or the first key and value of the specified object.

#### Example 1: string
The following example returns `"f"`:

```json
"[first('foobar')]"
```

#### Example 2: array
Assume `element1` returns `[1, 2, 3]`. The following example returns `1`:

```json
"[first(steps('foo').element1)]"
```

#### Example 3: object
Assume `element1` returns:

```json
{
  "key1": "foobar",
  "key2": "raboof"
}
```
The following example returns `{"key1": "foobar"}`:

```json
"[first(steps('foo').element1)]"
```

### last
Returns the last character of the specified string, the last value of the specified array, or the last key and value of the specified object.

#### Example 1: string
The following example returns `"r"`:

```json
"[last('foobar')]"
```

#### Example 2: array
Assume `element1` returns `[1, 2, 3]`. The following example returns `2`:

```json
"[last(steps('foo').element1)]"
```

#### Example 3: object
Assume `element1` returns:

```json
{
  "key1": "foobar",
  "key2": "raboof"
}
```

The following example returns `{"key2": "raboof"}`:

```json
"[last(steps('foo').element1)]"
```

### take
Returns a specified number of contiguous characters from the start of the string, a specified number of contiguous values from the start of the array, or a specified number of contiguous keys and values from the start of the object.

#### Example 1: string
The following example returns `"foo"`:

```json
"[take('foobar', 3)]"
```

#### Example 2: array
Assume `element1` returns `[1, 2, 3]`. The following example returns `[1, 2]`:

```json
"[take(steps('foo').element1, 2)]"
```

#### Example 3: object
Assume `element1` returns:

```json
{
  "key1": "foobar",
  "key2": "raboof"
}
```

The following example returns `{"key1": "foobar"}`:

```json
"[take(steps('foo').element1, 1)]"
```

### skip
Bypasses a specified number of elements in a collection, and then returns the remaining elements.

#### Example 1: string
The following example returns `"bar"`:

```json
"[skip('foobar', 3)]"
```

#### Example 2: array
Assume `element1` returns `[1, 2, 3]`. The following example returns `[3]`:

```json
"[skip(steps('foo').element1, 2)]"
```

#### Example 3: object
Assume `element1` returns:

```json
{
  "key1": "foobar",
  "key2": "raboof"
}
```
The following example returns `{"key2": "raboof"}`:

```json
"[skip(steps('foo').element1, 1)]"
```

## Logical functions
These functions can be used in conditionals. Some functions may not support all JSON data types.

### equals
Returns `true` if both parameters have the same type and value. This function supports all JSON data types.

The following example returns `true`:

```json
"[equals(0, 0)]"
```

The following example returns `true`:

```json
"[equals('foo', 'foo')]"
```

The following example returns `false`:

```json
"[equals('abc', ['a', 'b', 'c'])]"
```

### less
Returns `true` if the first parameter is strictly less than the second parameter. This function supports parameters only of type number and string.

The following example returns `true`:

```json
"[less(1, 2)]"
```

The following example returns `false`:

```json
"[less('9', '10')]"
```

### lessOrEquals
Returns `true` if the first parameter is less than or equal to the second parameter. This function supports parameters only of type number and string.

The following example returns `true`:

```json
"[lessOrEquals(2, 2)]"
```

### greater
Returns `true` if the first parameter is strictly greater than the second parameter. This function supports parameters only of type number and string.

The following example returns `false`:

```json
"[greater(1, 2)]"
```

The following example returns `true`:

```json
"[greater('9', '10')]"
```

### greaterOrEquals
Returns `true` if the first parameter is greater than or equal to the second parameter. This function supports parameters only of type number and string.

The following example returns `true`:

```json
"[greaterOrEquals(2, 2)]"
```

### and
Returns `true` if all the parameters evaluate to `true`. This function supports two or more parameters only of type Boolean.

The following example returns `true`:

```json
"[and(equals(0, 0), equals('foo', 'foo'), less(1, 2))]"
```

The following example returns `false`:

```json
"[and(equals(0, 0), greater(1, 2))]"
```

### or
Returns `true` if at least one of the parameters evaluates to `true`. This function supports two or more parameters only of type Boolean.

The following example returns `true`:

```json
"[or(equals(0, 0), equals('foo', 'foo'), less(1, 2))]"
```

The following example returns `true`:

```json
"[or(equals(0, 0), greater(1, 2))]"
```

### not
Returns `true` if the parameter evaluates to `false`. This function supports parameters only of type Boolean.

The following example returns `true`:

```json
"[not(false)]"
```

The following example returns `false`:

```json
"[not(equals(0, 0))]"
```

### coalesce
Returns the value of the first non-null parameter. This function supports all JSON data types.

Assume `element1` and `element2` are undefined. The following example returns `"foobar"`:

```json
"[coalesce(steps('foo').element1, steps('foo').element2, 'foobar')]"
```

## Conversion functions
These functions can be used to convert values between JSON data types and encodings.

### int
Converts the parameter to an integer. This function supports parameters of type number and string.

The following example returns `1`:

```json
"[int('1')]"
```

The following example returns `2`:

```json
"[int(2.9)]"
```

### float
Converts the parameter to a floating-point. This function supports parameters of type number and string.

The following example returns `1.0`:

```json
"[float('1.0')]"
```

The following example returns `2.9`:

```json
"[float(2.9)]"
```

### string
Converts the parameter to a string. This function supports parameters of all JSON data types.

The following example returns `"1"`:

```json
"[string(1)]"
```

The following example returns `"2.9"`:

```json
"[string(2.9)]"
```

The following example returns `"[1,2,3]"`:

```json
"[string([1,2,3])]"
```

The following example returns `"{"foo":"bar"}"`:

```json
"[string({\"foo\":\"bar\"})]"
```

### bool
Converts the parameter to a Boolean. This function supports parameters of type number, string, and Boolean. Similar to Booleans in JavaScript, any value except `0` or `'false'` returns `true`.

The following example returns `true`:

```json
"[bool(1)]"
```

The following example returns `false`:

```json
"[bool(0)]"
```

The following example returns `true`:

```json
"[bool(true)]"
```

The following example returns `true`:

```json
"[bool('true')]"
```

### parse
Converts the parameter to a native type. In other words, this function is the inverse of `string()`. This function supports parameters only of type string.

The following example returns `1`:

```json
"[parse('1')]"
```

The following example returns `true`:

```json
"[parse('true')]"
```

The following example returns `[1,2,3]`:

```json
"[parse('[1,2,3]')]"
```

The following example returns `{"foo":"bar"}`:

```json
"[parse('{\"foo\":\"bar\"}')]"
```

### encodeBase64
Encodes the parameter to a base-64 encoded string. This function supports parameters only of type string.

The following example returns `"Zm9vYmFy"`:

```json
"[encodeBase64('foobar')]"
```

### decodeBase64
Decodes the parameter from a base-64 encoded string. This function supports parameters only of type string.

The following example returns `"foobar"`:

```json
"[decodeBase64('Zm9vYmFy')]"
```

### encodeUriComponent
Encodes the parameter to a URL encoded string. This function supports parameters only of type string.

The following example returns `"https%3A%2F%2Fportal.azure.com%2F"`:

```json
"[encodeUriComponent('https://portal.azure.com/')]"
```

### decodeUriComponent
Decodes the parameter from a URL encoded string. This function supports parameters only of type string.

The following example returns `"https://portal.azure.com/"`:

```json
"[decodeUriComponent('https%3A%2F%2Fportal.azure.com%2F')]"
```

## Math functions
### add
Adds two numbers, and returns the result.

The following example returns `3`:

```json
"[add(1, 2)]"
```

### sub
Subtracts the second number from the first number, and returns the result.

The following example returns `1`:

```json
"[sub(3, 2)]"
```

### mul
Multiplies two numbers, and returns the result.

The following example returns `6`:

```json
"[mul(2, 3)]"
```

### div
Divides the first number by the second number, and returns the result. The result is always an integer.

The following example returns `2`:

```json
"[div(6, 3)]"
```

### mod
Divides the first number by the second number, and returns the remainder.

The following example returns `0`:

```json
"[mod(6, 3)]"
```

The following example returns `2`:

```json
"[mod(6, 4)]"
```

### min
Returns the small of the two numbers.

The following example returns `1`:

```json
"[min(1, 2)]"
```

### max
Returns the larger of the two numbers.

The following example returns `2`:

```json
"[max(1, 2)]"
```

### range
Generates a sequence of integral numbers within the specified range.

The following example returns `[1,2,3]`:

```json
"[range(1, 3)]"
```

### rand
Returns a random integral number within the specified range. This function does not generate cryptographically secure random numbers.

The following example could return `42`:

```json
"[rand(-100, 100)]"
```

### floor
Returns the largest integer less than or equal to the specified number.

The following example returns `3`:

```json
"[floor(3.14)]"
```

### ceil
Returns the largest integer greater than or equal to the specified number.

The following example returns `4`:

```json
"[ceil(3.14)]"
```

## Date functions
### utcNow
Returns a string in ISO 8601 format of the current date and time on the local computer.

The following example could return `"1990-12-31T23:59:59.000Z"`:

```json
"[utcNow()]"
```

### addSeconds
Adds an integral number of seconds to the specified timestamp.

The following example returns `"1991-01-01T00:00:00.000Z"`:

```json
"[addSeconds('1990-12-31T23:59:60Z', 1)]"
```

### addMinutes
Adds an integral number of minutes to the specified timestamp.

The following example returns `"1991-01-01T00:00:59.000Z"`:

```json
"[addMinutes('1990-12-31T23:59:59Z', 1)]"
```

### addHours
Adds an integral number of hours to the specified timestamp.

The following example returns `"1991-01-01T00:59:59.000Z"`:

```json
"[addHours('1990-12-31T23:59:59Z', 1)]"
```

## Next steps
* For an introduction to Azure Resource Manager, see [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md).

