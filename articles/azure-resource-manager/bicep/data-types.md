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

In an array, each item is represented by the [any type](bicep-functions-any.md). You can have an array where each item is the same data type, or an array that holds different data types.

Arrays in Bicep are 0-based. In the following example, the expression `exampleArray[0]` evaluates to 1 and `exampleArray[2]` evaluates to 3. The index of the indexer may itself be another expression. The expression `exampleArray[index]` evaluates to 2. Integer indexers are only allowed on expression of array types.

```bicep
var index = 1

var exampleArray = [
  1
  2
  3
]
```

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

The following example shows an array with different types.

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

Floating point, decimal or binary formats aren't currently supported.

## Objects

Objects start with a left brace (`{`) and end with a right brace (`}`). In Bicep, an object must be declared in multiple lines. Each property in an object consists of key and value. The key and value are separated by a colon (`:`). An object allows any property of any type.

In Bicep, the key isn't enclosed by quotes. Don't use commas to between properties.

```bicep
param exampleObject object = {
  name: 'test name'
  id: '123-abc'
  isCurrent: true
  tier: 1
}
```

Property accessors are used to access properties of an object. They're constructed using the `.` operator. For example:

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

Property accessors can be used with any object, including parameters and variables of object types and object literals. Using a property accessor on an expression of non-object type is an error.

## Strings

In Bicep, strings are marked with singled quotes, and must be declared on a single line. All Unicode characters with codepoints between *0* and *10FFFF* are allowed.

```bicep
param exampleString string = 'test value'
```

The following table lists the set of reserved characters that must be escaped by a backslash (`\`) character:

| Escape Sequence | Represented value | Notes |
|:-|:-|:-|
| \\ | \ ||
| \' | ' ||
| \n | line feed (LF) ||
| \r | carriage return (CR) ||
| \t | tab character ||
| \u{x} | Unicode code point *x* | *x* represents a hexadecimal codepoint value between *0* and *10FFFF* (both inclusive). Leading zeros are allowed. Codepoints above *FFFF* are emitted as a surrogate pair.
| \$ | $ | Only needs to be escaped if it's followed by *{*. |

```bicep
// evaluates to "what's up?"
var myVar = 'what\'s up?'
```

All strings in Bicep support interpolation. To inject an expression, surround it by *${* and *}`. Expressions that are referenced can't span multiple lines.

```bicep
var storageName = 'storage${uniqueString(resourceGroup().id)}
```

## Multi-line strings

In Bicep, multi-line strings are defined between 3 single quote characters (`'''`) followed optionally by a newline (the opening sequence), and 3 single quote characters (`'''` - the closing sequence). Characters that are entered between the opening and closing sequence are read verbatim, and no escaping is necessary or possible.

> [!NOTE]
> Because the Bicep parser reads all characters as is, depending on the line endings of your Bicep file, newlines can be interpreted as either `\r\n` or `\n`.
> Interpolation is not currently supported in multi-line strings.
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
myVar6 = '''interpolation
is ${blocked}'''
```

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
