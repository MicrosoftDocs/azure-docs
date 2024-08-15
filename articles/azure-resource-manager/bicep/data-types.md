---
title: Data types in Bicep
description: Describes the data types that are available in Bicep
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 07/16/2024
---

# Data types in Bicep

This article describes the data types supported in [Bicep](./overview.md). To define custom data types, see [User-defined data types](./user-defined-data-types.md).

## Supported types

Within a Bicep, you can use these data types:

* [array](#arrays)
* [bool](#booleans)
* [int](#integers)
* [object](#objects)
* [secureObject - indicated by decorator in Bicep](#secure-strings-and-objects)
* [secureString - indicated by decorator     in Bicep](#secure-strings-and-objects)
* [string](#strings)

## Arrays

Arrays start with a left bracket (`[`) and end with a right bracket (`]`). In Bicep, an array can be declared in single line or multiple lines. Commas (`,`) are used between values in single-line declarations, but not used in multiple-line declarations,  You can mix and match single-line and multiple-line declarations. The multiple-line declaration requires [Bicep CLI version 0.7.X or higher](./install.md).

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

Each array element can be of any type. You can have an array where each item is the same data type, or an array that holds different data types.

The following example shows an array of integers and an array different types.

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
```

Arrays in Bicep are zero-based. In the following example, the expression `exampleArray[0]` evaluates to 1 and `exampleArray[2]` evaluates to 3. The index of the indexer can be another expression. The expression `exampleArray[index]` evaluates to 2. Integer indexers are only allowed on expression of array types.

```bicep
var index = 1

var exampleArray = [
  1
  2
  3
]
```

You get the following error when the index is out of bounds:

```error
The language expression property array index 'x' is out of bounds
```

To avoid this exception, you can use the [Or logical operator](./operators-logical.md#or-) as shown in the following example:

```bicep
param emptyArray array = []
param numberArray array = [1, 2, 3]

output foo bool = empty(emptyArray) || emptyArray[0] == 'bar'
output bar bool = length(numberArray) <= 3 || numberArray[3] == 4
```

## Booleans

When specifying boolean values, use `true` or `false`. Don't surround the value with quotation marks.

```bicep
param exampleBool bool = true
```

## Integers

When specifying integer values, don't use quotation marks.

```bicep
param exampleInt int = 1
```

Bicep integers are 64-bit integers. When passed as inline parameters, the range of values can be limited by the SDK or command-line tool you use for deployment. For example, when using PowerShell to deploy a Bicep, integer types can range from -2147483648 to 2147483647. To avoid this limitation, specify large integer values in a [parameter file](parameter-files.md). Resource types apply their own limits for integer properties.

Bicep supports integer literal type that refers to a specific value that is an exact integer. In the following example, _1_ is an integer literal type, _foo_ can only be assigned the value _1_ and no other value.

```bicep
output foo 1 = 1
```

An integer literal type can either be declared inline, as shown in the preceding example,  or in a [`type` statement](./user-defined-data-types.md).  

```bicep
type oneType = 1

output foo oneType = 1
output bar oneType = 2
```

In the preceding example, assigning _2_ to _bar_ results in a [BCP033](./bicep-error-bcp033.md) error - _Expected a value of type "1" but the provided value is of type "2"_.

The following example shows using integer literal type with [union type](#union-types):

```bicep
output bar 1 | 2 | 3 = 3
```

Floating point, decimal or binary formats aren't currently supported.

## Objects

Objects start with a left brace (`{`) and end with a right brace (`}`). In Bicep, an object can be declared in single line or multiple lines. Each property in an object consists of key and value. The key and value are separated by a colon (`:`). An object allows any property of any type. Commas (`,`) are used between properties for single-line declarations, but not used between properties for multiple-line declarations. You can mix and match single-line and multiple-line declarations. The multiple-line declaration requires [Bicep CLI version 0.7.X or higher](./install.md).

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

In Bicep, quotes are optionally allowed on object property keys:

```bicep
var test = {
  'my - special. key': 'value'
}
```

In the preceding example, quotes are used when the object property keys contain special characters. For example space, '-', or '.'. The following example shows how to use interpolation in object property keys.

```bicep
var stringVar = 'example value'
var objectVar = {
  '${stringVar}': 'this value'
}
```

Property accessors are used to access properties of an object. They're constructed using the `.` operator.

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

Property accessors can be used with any object, including parameters and variables of object types and object literals. Using a property accessor on an expression of non-object type is an error.

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

You get the following error when accessing a nonexisting property of an object:

```error
The language expression property 'foo' doesn't exist
```

To avoid the exception, you can use the [And logical operator](./operators-logical.md#and-) as shown in the following example:

```bicep
param objectToTest object = {
  one: 1
  two: 2
  three: 3
}

output bar bool = contains(objectToTest, 'four') && objectToTest.four == 4
```

## Strings

In Bicep, strings are marked with singled quotes, and must be declared on a single line. All Unicode characters with code points between _0_ and _10FFFF_ are allowed.

```bicep
param exampleString string = 'test value'
```

The following table lists the set of reserved characters that must be escaped by a backslash (`\`) character:

| Escape Sequence | Represented value | Notes |
|:-|:-|:-|
| `\\` | `\` ||
| `\'` | `'` ||
| `\n` | line feed (LF) ||
| `\r` | carriage return (CR) ||
| `\t` | tab character ||
| `\u{x}` | Unicode code point `x` | **x** represents a hexadecimal code point value between _0_ and _10FFFF_ (both inclusive). Leading zeros are allowed. Code points above _FFFF_ are emitted as a surrogate pair. |
| `\$` | `$` | Only escape when followed by `{`. |

```bicep
// evaluates to "what's up?"
var myVar = 'what\'s up?'
```

Bicep supports string literal type that refers to a specific string value. In the following example, _red_ is a string literal type, _redColor_ can only be assigned the value _red_ and no other value.

```bicep
output redColor 'red' = 'red'
```

A string literal type can either be declared inline, as shown in the preceding example, or in a [`type` statement](./user-defined-data-types.md).  

```bicep
type redColor = 'red'

output colorRed redColor = 'red'
output colorBlue redColor = 'blue'
```

In the preceding example, assigning _blue_ to _colorBlue_ results in a [BCP033](./bicep-error-bcp033.md) error - _Expected a value of type "'red'" but the provided value is of type "'blue'"_.

The following example shows using string literal type with [union type](#union-types):

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

In Bicep, multi-line strings are defined between three single quote characters (`'''`) followed optionally by a newline (the opening sequence), and three single quote characters (`'''` - the closing sequence). Characters that are entered between the opening and closing sequence are read verbatim, and no escaping is necessary or possible.

> [!NOTE]
> Because the Bicep parser reads all characters as is, depending on the line endings of your Bicep file, newlines can be interpreted as either `\r\n` or `\n`.
>
> Interpolation is not currently supported in multi-line strings. Due to this limitation, you may need to use the [`concat`](./bicep-functions-string.md#concat) function instead of use [interpolation](#strings).
>
> Multi-line strings containing `'''` are not supported.

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

## Union types

In Bicep, a union type allows the creation of a combined type consisting of a set of sub-types. An assignment is valid if any of the individual sub-type assignments are permitted. The `|` character separates individual sub-types using an _or_ condition. For example, the syntax _'a' | 'b'_ means that a valid assignment could be either _'a'_ or _'b'_. Union types are translated into the [allowed-value](../templates/definitions.md#allowed-values) constraint in Bicep, so only literals are permitted as members. Unions can include any number of literal-typed expressions.

```bicep
type color = 'Red' | 'Blue' | 'White'
type trueOrFalse = 'true' | 'false'
type permittedIntegers = 1 | 2 | 3
type oneOfSeveralObjects = {foo: 'bar'} | {fizz: 'buzz'} | {snap: 'crackle'}
type mixedTypeArray = ('fizz' | 42 | {an: 'object'} | null)[]
```

Any type expression can be used as a sub-type in a union type declaration (between `|` characters). For example, the following examples are all valid:

```bicep
type foo = 1 | 2
type bar = foo | 3
type baz = bar | (4 | 5) | 6
```

### Custom-tagged union data type

Bicep supports custom tagged union data type, which is used to represent a value that can be one of several different types. To declare a custom tagged union data type, you can use a `@discriminator()` decorator. [Bicep CLI version 0.21.X or higher](./install.md) is required to use this decorator. The syntax is:

```bicep
@discriminator('<property-name>')
```

The discriminator decorator takes a single parameter, which represents a shared property name among all union members. This property name must be a required string literal on all members and is case-sensitive. The values of the discriminated property on the union members must be unique in a case-insensitive manner.

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

The parameter value is validated based on the discriminated property value. For instance, in the preceding example, if the _serviceConfig_ parameter is of type _foo_, it's validated using the _FooConfig_ type. Similarly, if the parameter is of type _bar_, it's validated using the _BarConfig_ type. This pattern applies to other types as well.

There are some limitations with union type.

* Union types must be reducible to a single Azure Resource Manager (ARM) type.  The following definition is invalid:

  ```bicep
  type foo = 'a' | 1
  ```

* Only literals are permitted as members.
* All literals must be of the same primitive data type (e.g., all strings or all integers).

The union type syntax can be used in [user-defined data types](./user-defined-data-types.md).

## Secure strings and objects

Secure string uses the same format as string, and secure object uses the same format as object. With Bicep, you add the `@secure()` [decorator](./parameters.md#decorators) to a string or object.

When you set a parameter to a secure string or secure object, the value of the parameter isn't saved to the deployment history and isn't logged. However, if you set that secure value to a property that isn't expecting a secure value, the value isn't protected. For example, if you set a secure string to a tag, that value is stored as plain text. Use secure strings for passwords and secrets.

The following example shows two secure parameters:

```bicep
@secure()
param password string

@secure()
param configValues object
```

## Data type assignability

In Bicep, a value of one type (source type) can be assigned to another type (target type). The following table shows which source type (listed horizontally) can or can't be assigned to which target type (listed vertically). In the table, `X` means assignable, empty space means not assignable, and `?` means only if they types are compatible.

| Types | `any` | `error` | `string` | `number` | `int` | `bool` | `null` | `object` | `array` | named resource | named module | `scope` |
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
| **named resource** |X| | | | | | |?| |?| | |
| **named module**   |X| | | | | | |?| | |?| |

## Next steps

To learn about the structure and syntax of Bicep, see [Bicep file structure](./file.md).
