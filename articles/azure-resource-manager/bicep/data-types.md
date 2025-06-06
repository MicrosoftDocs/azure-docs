---
title: Data types in Bicep
description: This article describes the data types that are available in Bicep.
ms.topic: reference
ms.date: 05/20/2025
ms.custom: devx-track-bicep
---

# Data types in Bicep

This article describes the data types that are supported in [Bicep](./overview.md). To define custom data types, see [User-defined data types](./user-defined-data-types.md).

## Arrays

A **array** in Bicep is an ordered collection of values—such as strings, integers, objects, or even other arrays—commonly used to group related items like resource names, configuration settings, or parameters. Arrays are helpful for organizing deployment data, passing lists to resources, and iterating over multiple values.

Arrays in Bicep are immutable. Once declared, their contents can't be changed. To "modify" an array, create a new array using functions like [`concat`](./bicep-functions-array.md#concat), [`map`](./bicep-functions-lambda.md#map), or [`filter`](./bicep-functions-lambda.md#filter).

You can declare arrays in Bicep using either single-line or multi-line syntax. Multi-line array declarations require [Bicep CLI version 0.7.X or later](https://github.com/Azure/bicep/releases/tag/v0.7.4).

```bicep
var multiLineArray = [
  'abc'
  'def'
  'ghi'
]

var singleLineArray = ['abc', 'def', 'ghi']

var mixedArray = ['abc', 'def'
    'ghi']
```

**Single-line arrays** use commas (`,`) to separate values. **Multi-line arrays** don't use commas between values. You can mix single-line and multi-line declarations as needed.

Each array element can be of any type. You can have an array where each item is the same data type, or an array that holds different data types.

```bicep
var integerArray = [
  1
  2
  3
]

var mixedArray = [
  resourceGroup().name
  1
  true
  'example string'
]

var arrayOfObjects = [
  { name: 'dev', size: 1 }
  { name: 'prod', size: 2 }
]
```

Arrays in Bicep are zero-based. You can access elements by index:

```bicep
var exampleArray = [1, 2, 3]
output firstElement int = exampleArray[0] // 1
output thirdElement int = exampleArray[2] // 3

var index = 1
output secondElement int = exampleArray[index] // 2
```

Starting with [Bicep CLI version 0.34.x](https://github.com/Azure/bicep/releases/tag/v0.34.1), you can use the `array[^index]` syntax to access elements from the end of an array — `^1` refers to the last element, `^2` to the second-to-last, and so on.

```bicep
var exampleArray = [1, 2, 3]

output lastElement int = exampleArray[^1] // 3
output secondToLastElement int = exampleArray[^2] // 2
```

If you access an index that is out of bounds, you get an error:

```error
The language expression property array index 'x' is out of bounds
```

To avoid out-of-bounds exception, use the [Or logical operator](./operators-logical.md#or-), as shown in the following example:

```bicep
param emptyArray array = []
param numberArray array = [1, 2, 3]

output foo bool = empty(emptyArray) || emptyArray[0] == 'bar'
output bar bool = length(numberArray) <= 3 || numberArray[3] == 4
```

### Array-related operators

- Use [Comparison operators](./operators-comparison.md) to compare two arrays.
- Use [Index accessor](./operators-access.md#index-accessor) to get an element from an array.
- Use [Safe-dereference operator](./operator-safe-dereference.md) to access elements of an array.
- Use [Spread](./operator-spread.md) to merge arrays.

### Array-related functions

- See [Array functions](./bicep-functions-array.md).
- See [Lambda functions](./bicep-functions-lambda.md).

## Booleans

When you specify Boolean values, use `true` or `false`. Don't surround the value with quotation marks.

```bicep
param exampleBool bool = true
```

### Boolean-related operators

- Use [Comparison operators](./operators-comparison.md) to compare boolean values.
- See [Logical operators](./operators-logical.md).

### Boolean-related functions

See [Logical function](./bicep-functions-logical.md)

## Integers

When you specify integer values, don't use quotation marks.

```bicep
param exampleInt int = 1
```

Bicep integers are 64-bit integers. When they're passed as inline parameters, the SDK or command-line tool you use for deployment can limit the range of values. For example, when you use PowerShell to deploy Bicep, integer types can range from -2147483648 to 2147483647. To avoid this limitation, specify large integer values in a [parameters file](parameter-files.md). Resource types apply their own limits for integer properties.

Bicep supports an integer literal type that refers to a specific value that's an exact integer. In the following example, `1` is an integer literal type, and `foo` can only be assigned the value `1` and no other value.

```bicep
output foo 1 = 1
```

You can declare an integer literal type either inline, as shown in the preceding example, or in a [`type` statement](./user-defined-data-types.md).  

```bicep
type oneType = 1

output foo oneType = 1
output bar oneType = 2
```

In the preceding example, assigning `2` to `bar` results in a [BCP033](./bicep-error-bcp033.md) error: "Expected a value of type `1` but the provided value is of type `2`."

The following example uses an integer literal type with a [union type](#union-types):

```bicep
output bar 1 | 2 | 3 = 3
```

Floating point, decimal, or binary formats aren't currently supported.

### Integer-related operators

- See [Comparison operators](./operators-comparison.md).
- See [Numeric operators](./operators-numeric.md).

### Integer-related functions

See [Numeric functions](./bicep-functions-numeric.md).

## Objects

Objects start with a left brace (`{`) and end with a right brace (`}`). In Bicep, you can declare an object in a single line or in multiple lines. Each property in an object consists of a key and a value. The key and value are separated by a colon (`:`). An object allows any property of any type. Commas (`,`) are used between properties for single-line declarations, but they aren't used between properties for multiple-line declarations. You can mix and match single-line and multiple-line declarations. The multiple-line declaration requires [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.7.X or later.

```bicep
param singleLineObject object = {name: 'test name', id: '123-abc', isCurrent: true, tier: 1}

param multiLineObject object = {
  name: 'test name'
  id: '123-abc'
  isCurrent: true
  tier: 1
}

param mixedObject object = {name: 'test name', id: '123-abc', isCurrent: true
    tier: 1}
```

In Bicep, quotation marks are optionally allowed on object property keys:

```bicep
var test = {
  'my - special. key': 'value'
}
```

In the preceding example, quotation marks are used when the object property keys contain special characters. Examples are space, `-`, or `.`. The following example shows how to use interpolation in object property keys.

```bicep
var stringVar = 'example value'
var objectVar = {
  '${stringVar}': 'this value'
}
```

Property accessors are used to access properties of an object. They're constructed by using the `.` operator.

```bicep
var a = {
  b: 'Dev'
  c: 42
  d: {
    e: true
  }
}

output result1 string = a.b // returns 'Dev'
output result2 int = a.c // returns 42
output result3 bool = a.d.e // returns true
```

You can use property accessors with any object, including parameters and variables of object types and object literals. A property accessor used on an expression of a nonobject type is an error.

You can also use the `[]` syntax to access a property. The following example returns `Development`.

```bicep
var environmentSettings = {
  dev: {
    name: 'Development'
  }
  prod: {
    name: 'Production'
  }
}

output accessorResult string = environmentSettings['dev'].name
```

[!INCLUDE [JSON object ordering](../../../includes/resource-manager-object-ordering-bicep.md)]

You get the following error when you access a nonexisting property of an object:

```error
The language expression property 'foo' doesn't exist
```

To avoid the exception, you can use the [And logical operator](./operators-logical.md#and-), as shown in the following example:

```bicep
param objectToTest object = {
  one: 1
  two: 2
  three: 3
}

output bar bool = contains(objectToTest, 'four') && objectToTest.four == 4
```

### Object-related operators

- Use [Comparison operators](./operators-comparison.md) to compare objects.
- Use [Index accessor](./operators-access.md#index-accessor) to get a property from an object.
- Use [Safe-dereference operator](./operator-safe-dereference.md) to access object members.
- Use [Spread](./operator-spread.md) to merge objects.

### Object-related functions

See [Object functions](./bicep-functions-object.md).

## Strings

In Bicep, strings are marked with single quotation marks, and you must declare them on a single line. All Unicode characters with code points between `0` and `10FFFF` are allowed.

```bicep
param exampleString string = 'test value'
```

The following table lists the set of reserved characters that you must escape by using a backslash (`\`) character:

| Escape sequence | Represented value | Notes |
|:-|:-|:-|
| `\\` | `\` ||
| `\'` | `'` ||
| `\n` | Line feed (LF) ||
| `\r` | Carriage return (CR) ||
| `\t` | Tab character ||
| `\u{x}` | Unicode code point `x` | The `x` represents a hexadecimal code point value between `0` and `10FFFF` (both inclusive). Leading zeros are allowed. Code points above `FFFF` are emitted as a surrogate pair. |
| `\$` | `$` | Only escape when followed by `{`. |

```bicep
// evaluates to "what's up?"
var myVar = 'what\'s up?'
```

Bicep supports a string literal type that refers to a specific string value. In the following example, `red` is a string literal type. You can only assign the value `red` to `redColor`.

```bicep
output redColor 'red' = 'red'
```

You can declare a string literal type either inline, as shown in the preceding example, or in a [`type` statement](./user-defined-data-types.md).

```bicep
type redColor = 'red'

output colorRed redColor = 'red'
output colorBlue redColor = 'blue'
```

In the preceding example, assigning `blue` to `colorBlue` results in a [BCP033](./bicep-error-bcp033.md) error: "Expected a value of type `red` but the provided value is of type `blue`."

The following example shows a string literal type used with a [union type](#union-types):

```bicep
type direction = 'north' | 'south' | 'east' | 'west'

output west direction = 'west'
output northWest direction = 'northwest'
```

All strings in Bicep support interpolation. To inject an expression, surround it by `${` and `}`. Expressions that are referenced can't span multiple lines.

```bicep
var storageName = 'storage${uniqueString(resourceGroup().id)}'
```

### Multi-line strings

In Bicep, multi-line strings are defined between three single quotation marks (`'''`) followed optionally by a newline (the opening sequence) and three single quotation marks (`'''` is the closing sequence). Characters that are entered between the opening and closing sequence are read verbatim. Escaping isn't necessary or possible.

> [!NOTE]
> The Bicep parser reads every characters as it is. Depending on the line endings of your Bicep file, newlines are interpreted as either `\r\n` or `\n`.
>
> Interpolation isn't currently supported in multi-line strings. Because of this limitation, you might need to use the [`concat`](./bicep-functions-string.md#concat) function instead of using [interpolation](#strings).
>
> Multi-line strings that contain `'''` aren't supported.

```bicep
// evaluates to "hello!"
var myVar = '''hello!'''

// evaluates to "hello!" because the first newline is skipped
var myVar2 = '''
hello!'''

// evaluates to "hello!\n" because the final newline is included
var myVar3 = '''
hello!
'''

// evaluates to "  this\n    is\n      indented\n"
var myVar4 = '''
  this
    is
      indented
'''

// evaluates to "comments // are included\n/* because everything is read as-is */\n"
var myVar5 = '''
comments // are included
/* because everything is read as-is */
'''

// evaluates to "interpolation\nis ${blocked}"
// note ${blocked} is part of the string, and is not evaluated as an expression
var myVar6 = '''interpolation
is ${blocked}'''
```

### String-related operators

- See [Comparison operators](./operators-comparison.md).

### String-related functions

- See [String functions](./bicep-functions-string.md).

## Union types

In Bicep, a union type allows the creation of a combined type that consists of a set of subtypes. An assignment is valid if any of the individual subtype assignments are permitted. The `|` character separates individual subtypes that use an `or` condition. For example, the syntax `a | b` means that a valid assignment could be either `a` or `b`. Union types are translated into the [allowed-value](../templates/definitions.md#allowed-values) constraint in Bicep, so only literals are permitted as members. Unions can include any number of literal-typed expressions.

```bicep
type color = 'Red' | 'Blue' | 'White'
type trueOrFalse = 'true' | 'false'
type permittedIntegers = 1 | 2 | 3
type oneOfSeveralObjects = {foo: 'bar'} | {fizz: 'buzz'} | {snap: 'crackle'}
type mixedTypeArray = ('fizz' | 42 | {an: 'object'} | null)[]
```

Type unions must be reducible to a single Azure Resource Manager type, such as `string`, `int`, or `bool`. Otherwise, you get the [BCP294](./diagnostics/bcp294.md) error code. For example:

```bicep
type foo = 'a' | 1
```

You can use any type of expression as a subtype in a union type declaration (between `|` characters). For example, the following examples are all valid:

```bicep
type foo = 1 | 2
type bar = foo | 3
type baz = bar | (4 | 5) | 6
```

### Custom-tagged union data type

Bicep supports a custom-tagged union data type, which represents a value that can be one of several types. To declare a custom-tagged union data type, you can use a `@discriminator()` decorator. [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.21.X or later is required to use this decorator. The syntax is:

```bicep
@discriminator('<property-name>')
```

The discriminator decorator takes a single parameter, which represents a shared property name among all union members. This property name must be a required string literal on all members and is case sensitive. The values of the discriminated property on the union members must be unique in a case-insensitive manner.

```bicep
type FooConfig = {
  type: 'foo'
  value: int
}

type BarConfig = {
  type: 'bar'
  value: bool
}

@discriminator('type')
param ServiceConfig  FooConfig | BarConfig | { type: 'baz', *: string } = { type: 'bar', value: true }
```

The parameter value is validated based on the discriminated property value. For instance, in the preceding example, if the `serviceConfig` parameter is of type `foo`, it's validated by using the `FooConfig` type. Similarly, if the parameter is of type `bar`, it's validated by using the `BarConfig` type. This pattern also applies to other types.

The union type has some limitations:

- Union types must be reducible to a single Azure Resource Manager type. The following definition is invalid:
  
  ```bicep
  type foo = 'a' | 1
  ```

- Only literals are permitted as members.
- All literals must be of the same primitive data type (for example, all strings or all integers).

You can use the union type syntax in [user-defined data types](./user-defined-data-types.md).

## Secure strings and objects

Secure strings use the same format as string, and secure objects use the same format as object. With Bicep, you add the `@secure()` [decorator](./parameters.md#use-decorators) to a string or object.

When you set a parameter (or an output) to a secure string or secure object, the value of the parameter (or the output) isn't saved to the deployment history or logged. If you set that secure value to a property that isn't expecting a secure value, the value isn't protected. For example, if you set a secure string to a tag, that value is stored as plain text. Use secure strings for passwords and secrets.

The following example shows two secure parameters:

```bicep
@secure()
param password string

@secure()
param configValues object
```

For more information, see [Secure parameters](./parameters.md#secure-parameters) and [Secure outputs](./outputs.md#secure-outputs).

## Data type assignability

In Bicep, you can assign a value of one type (source type) to another type (target type). The following table shows which source type (listed horizontally) you can or can't assign to which target type (listed vertically). In the table, _X_ means assignable, an empty space means not assignable, and _?_ means only if the types are compatible.

| Types | `any` | `error` | `string` | `number` | `int` | `bool` | `null` | `object` | `array` | Named resource | Named module | `scope` |
|-|-|-|-|-|-|-|-|-|-|-|-|-|
| `any`          |X| |X|X|X|X|X|X|X|X|X|X|
| `error`        | | | | | | | | | | | | |
| `string`       |X| |X| | | | | | | | | |
| `number`       |X| | |X|X| | | | | | | |
| `int`          |X| | | |X| | | | | | | |
| `bool`         |X| | | | |X| | | | | | |
| `null`         |X| | | | | |X| | | | | |
| `object`       |X| | | | | | |X| | | | |
| `array`        |X| | | | | | | |X| | | |
| `resource`     |X| | | | | | | | |X| | |
| `module`       |X| | | | | | | | | |X| |
| `scope`        | | | | | | | | | | | |?|
| Named resource |X| | | | | | |?| |?| | |
| Named module   |X| | | | | | |?| | |?| |

## Next steps

To learn about the structure and syntax of Bicep, see [Bicep file structure and syntax](./file.md).
