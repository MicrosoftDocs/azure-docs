---
title: Data types in templates
description: Describes the data types that are available in Azure Resource Manager templates.
ms.topic: conceptual
ms.author: tomfitz
author: tfitzmac
ms.date: 03/04/2021
---

# Data types in ARM templates

This article describes the data types supported in Azure Resource Manager templates (ARM templates). It covers both JSON and Bicep data types.

## Supported types

Within an ARM template, you can use these data types:

* array
* bool
* int
* object
* secureObject - indicated by modifier in Bicep
* secureString - indicated by modifier in Bicep
* string

## Arrays

Arrays start with a left bracket (`[`) and end with a right bracket (`]`).

In JSON, an array can be declared in a single line or multiple lines. Each element is separated by a comma.

In Bicep, an array must be declared in multiple lines. Don't use commas between values.

# [JSON](#tab/json)

```json
"parameters": {
  "exampleArray": {
    "type": "array",
    "defaultValue": [
      1,
      2,
      3
    ]
  }
},
```

# [Bicep](#tab/bicep)

```bicep
param exampleArray array = [
  1
  2
  3
]
```

---

The elements of an array can be the same type or different types.

# [JSON](#tab/json)

```json
"variables": {
  "mixedArray": [
    "[resourceGroup().name]",
    1,
    true,
    "example string"
  ]
}
```

# [Bicep](#tab/bicep)

```bicep
var mixedArray = [
  resourceGroup().name
  1
  true
  'example string'
]
```

---

## Booleans

When specifying boolean values, use `true` or `false`. Don't surround the value with quotation marks.

# [JSON](#tab/json)

```json
"parameters": {
  "exampleBool": {
    "type": "bool",
    "defaultValue": true
  }
},
```

# [Bicep](#tab/bicep)

```bicep
param exampleBool bool = true
```

---

## Integers

When specifying integer values, don't use quotation marks.

# [JSON](#tab/json)

```json
"parameters": {
  "exampleInt": {
    "type": "int",
    "defaultValue": 1
  }
}
```

# [Bicep](#tab/bicep)

```bicep
param exampleInt int = 1
```

---

For integers passed as inline parameters, the range of values may be limited by the SDK or command-line tool you use for deployment. For example, when using PowerShell to deploy a template, integer types can range from -2147483648 to 2147483647. To avoid this limitation, specify large integer values in a [parameter file](parameter-files.md). Resource types apply their own limits for integer properties.

## Objects

Objects start with a left brace (`{`) and end with a right brace (`}`). Each property in an object consists of key and value. The key and value are separated by a colon (`:`).

# [JSON](#tab/json)

In JSON, the key is enclosed in double quotes. Each property is separated by a comma.

```json
"parameters": {
  "exampleObject": {
    "type": "object",
    "defaultValue": {
      "name": "test name",
      "id": "123-abc",
      "isCurrent": true,
      "tier": 1
    }
  }
}
```

# [Bicep](#tab/bicep)

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

---

## Strings

In JSON, strings are marked with double quotes. In Bicep, strings are marked with singled quotes.

# [JSON](#tab/json)

```json
"parameters": {
  "exampleString": {
    "type": "string",
    "defaultValue": "test value"
  }
},
```

# [Bicep](#tab/bicep)

```bicep
param exampleString string = 'test value'
```
---

## Secure strings and objects

Secure string uses the same format as string, and secure object uses the same format as object. When you set a parameter to a secure string or secure object, the value of the parameter isn't saved to the deployment history and isn't logged. However, if you set that secure value to a property that isn't expecting a secure value, the value isn't protected. For example, if you set a secure string to a tag, that value is stored as plain text. Use secure strings for passwords and secrets.

With Bicep, you add the `@secure()` modifier to a string or object.

The following example shows two secure parameters:

# [JSON](#tab/json)

```json
"parameters": {
  "password": {
    "type": "secureString"
  },
  "configValues": {
    "type": "secureObject"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
@secure()
param password string

@secure()
param configValues object
```

---

## Next steps

To learn about the template syntax, see [Understand the structure and syntax of ARM templates](template-syntax.md).
