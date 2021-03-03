---
title: Data types in templates
description: Describes the data types that are available in Azure Resource Manager templates (ARM templates).
ms.topic: conceptual
ms.author: tomfitz
author: tfitzmac
ms.date: 03/03/2021
---

# Data types in ARM templates

This article describes the data types supported in Azure Resource Manager templates (ARM templates). It covers both JSON and Bicep data types.

## Supported types

Within an ARM template, you can use these data types:

* array
* bool
* int
* object
* secureObject - supported in JSON, requires modifier in Bicep
* secureString - supported in JSON, requires modifier in Bicep
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

The elements of an array can be all the same type or different types.

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

When specifying boolean values, don't surround the value with quotation marks. Use `true` or `false`.

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

When specifying integer values, don't surround the value with quotation marks.

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

Objects start with a left brace (`{`) and end with a right brace (`}`). The object consists of key/value pairs. The key and value are separated by a colon (`:`). In JSON, the key is enclosed in double quotes. In Bicep, the key isn't enclosed by quotes.

# [JSON](#tab/json)

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

```bicep
param exampleObject object = {
  name: 'test name'
  id: '123-abc'
  isCurrent: true
  tier: 1
}
```

---

## Strings

In JSON, strings start and end with double quotes (`"string value"`). In Bicep, the string starts and ends with singled quotes (`'string value'`).



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

## Example

The following template shows the format for the data types. Each type has a default value in the correct format.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "stringParameter": {
      "type": "string",
      "defaultValue": "option 1"
    },
    "intParameter": {
      "type": "int",
      "defaultValue": 1
    },
    "boolParameter": {
      "type": "bool",
      "defaultValue": true
    },
    "objectParameter": {
      "type": "object",
      "defaultValue": {
        "one": "a",
        "two": "b"
      }
    },
    "arrayParameter": {
      "type": "array",
      "defaultValue": [ 1, 2, 3 ]
    }
  },
  "resources": [],
  "outputs": {}
}
```
