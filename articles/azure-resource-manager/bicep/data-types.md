---
title: Data types in Bicep
description: Describes the data types that are available in Bicep
ms.topic: conceptual
ms.date: 06/01/2021
---

# Data types in Bicep

This article describes the data types supported in [Bicep](./overview.md).

## Supported types

Within a Bicep, you can use these data types:

* array
* bool
* int
* object
* secureObject - indicated by modifier in Bicep
* secureString - indicated by modifier in Bicep
* string

## Arrays

Arrays start with a left bracket (`[`) and end with a right bracket (`]`). In Bicep, an array must be declared in multiple lines. Don't use commas between values.

```bicep
var index = 1

var exampleArray = [
  1
  2
  3
]
```

Arrays in Bicep are 0-based. The expression exampleArray[0] evaluates to 1 and exampleArray[2] evaluates to 3. The index of the indexer may itself be another expression. In the above example, exampleArray[index] would evaluate to 2. Integer indexers are only allowed on expression of array types.

String-based indexers are allowed in Bicep.

```bicep
param environment string = 'prod'

var environmentSettings = {
  dev: {
    name: 'dev'
  }
  prod: {
    name: 'prod'
  }
}
```

The expression environmentSettings['dev'] evaluates to the following object:

```bicep
{
  name: 'dev'
}
```

The elements of an array can be the same type or different types.

```bicep
var mixedArray = [
  resourceGroup().name
  1
  true
  'example string'
]
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

For integers passed as inline parameters, the range of values may be limited by the SDK or command-line tool you use for deployment. For example, when using PowerShell to deploy a Bicep, integer types can range from -2147483648 to 2147483647. To avoid this limitation, specify large integer values in a [parameter file](parameter-files.md). Resource types apply their own limits for integer properties.

## Objects

Objects start with a left brace (`{`) and end with a right brace (`}`). Each property in an object consists of key and value. The key and value are separated by a colon (`:`).

In Bicep, the key isn't enclosed by quotes. Don't use commas to between properties.

```bicep
param exampleObject object = {
  name: 'test name'
  id: '123-abc'
  isCurrent: true
  tier: 1
}
```

Property accessors are used to access properties of an object. They are constructed using the `.` operator. For example:

```bicep
var x = {
  y: {
    z: 'Hello`
    a: true
  }
  q: 42
}
```

Given the previous declaration, the expression x.y.z evaluates to the literal string 'Hello'. Similarly, the expression x.q evaluates to the integer literal 42.

Property accessors can be used with any object. This includes parameters and variables of object types and object literals. Using a property accessor on an expression of non-object type is an error.

## Strings

In Bicep, strings are marked with singled quotes,and must be declared on a single line. All Unicode characters with codepoints between 0 and 10FFFF are allowed.

```bicep
param exampleString string = 'test value'
```

The following table lists the set of reserved characters which must be escaped by a backslash (`\`) character:
| Escape Sequence | Represented value | Notes |
|:-|:-|:-|
| `\\` | `\` ||
| `\'` | `'` ||
| `\n` | line feed (LF) ||
| `\r` | carriage return (CR) ||
| `\t` | tab character ||
| `\u{x}` | Unicode code point `x` | `x` represents a hexadecimal codepoint value between `0` and `10FFFF` (both inclusive). Leading zeros are allowed. Codepoints above `FFFF` are emitted as a surrogate pair.
| `\$` | `$` | Only needs to be escaped if it is followed by `{` |

All strings in Bicep support interpolation. To inject an expression, surround it by `${` and `}`. Expressions that are referenced cannot span multiple lines.


## Secure strings and objects

Secure string uses the same format as string, and secure object uses the same format as object. With Bicep, you add the `@secure()` modifier to a string or object.

When you set a parameter to a secure string or secure object, the value of the parameter isn't saved to the deployment history and isn't logged. However, if you set that secure value to a property that isn't expecting a secure value, the value isn't protected. For example, if you set a secure string to a tag, that value is stored as plain text. Use secure strings for passwords and secrets.

The following example shows two secure parameters:

```bicep
@secure()
param password string

@secure()
param configValues object
```


## Next steps

To learn about the structure and syntax of Bicep, see [Bicep file structure](./file.md).
