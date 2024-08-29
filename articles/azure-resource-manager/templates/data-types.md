---
title: Data types in templates
description: Describes the data types that are available in Azure Resource Manager templates.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 03/20/2024
---

# Data types in ARM templates

This article describes the data types supported in Azure Resource Manager templates (ARM templates).

## Supported types

Within an ARM template, you can use these data types:

* array
* bool
* int
* object
* secureObject
* securestring
* string

## Arrays

Arrays start with a left bracket (`[`) and end with a right bracket (`]`). An array can be declared in a single line or multiple lines. Each element is separated by a comma.

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

"outputs": {
  "arrayOutput": {
    "type": "array",
    "value": "[variables('exampleArray')]"
  },
  "firstExampleArrayElement": {
    "type": "int",
    "value": "[parameters('exampleArray')[0]]"
  }
}
```

The elements of an array can be the same type or different types.

```json
"variables": {
  "mixedArray": [
    "[resourceGroup().name]",
    1,
    true,
    "example string"
  ]
}

"outputs": {
  "arrayOutput": {
    "type": "array",
    "value": "[variables('mixedArray')]"
  },
  "firstMixedArrayElement": {
    "type": "string",
    "value": "[variables('mixedArray')[0]]"
  }
}
```

## Booleans

When specifying boolean values, use `true` or `false`. Don't surround the value with quotation marks.

```json
"parameters": {
  "exampleBool": {
    "type": "bool",
    "defaultValue": true
  }
},
```

## Integers

When specifying integer values, don't use quotation marks.

```json
"parameters": {
  "exampleInt": {
    "type": "int",
    "defaultValue": 1
  }
}
```

For integers passed as inline parameters, the range of values may be limited by the SDK or command-line tool you use for deployment. For example, when using PowerShell to deploy a template, integer types can range from -2147483648 to 2147483647. To avoid this limitation, specify large integer values in a [parameter file](parameter-files.md). Resource types apply their own limits for integer properties.

## Objects

Objects start with a left brace (`{`) and end with a right brace (`}`). Each property in an object consists of `key` and `value`. The `key` and `value` are enclosed in double quotes and separated by a colon (`:`). Each property is separated by a comma.

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

You can get a property from an object with dot notation.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
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
    },
    "resources": [
    ],
    "outputs": {
        "nameFromObject": {
            "type": "string",
            "value": "[parameters('exampleObject').name]"
        }
    }
}
```

[!INCLUDE [JSON object ordering](../../../includes/resource-manager-object-ordering-arm-template.md)]

## Strings

Strings are marked with double quotes.

```json
"parameters": {
  "exampleString": {
    "type": "string",
    "defaultValue": "test value"
  }
},
```

## Secure strings and objects

Secure string uses the same format as string, and secure object uses the same format as object. When you set a parameter to a secure string or secure object, the value of the parameter isn't saved to the deployment history and isn't logged. However, if you set that secure value to a property that isn't expecting a secure value, the value isn't protected. For example, if you set a secure string to a tag, that value is stored as plain text. Use secure strings for passwords and secrets.

The following example shows two secure parameters.

```json
"parameters": {
  "password": {
    "type": "securestring"
  },
  "configValues": {
    "type": "secureObject"
  }
}
```
> [!NOTE]
> Don't use secure strings or objects as output values. If you include a secure value as an output value, the value isn't displayed in the deployment history and can't be retrieved from another template. Instead, save the secure value in a key vault, and [pass as a parameter from the key vault](key-vault-parameter.md).

## Next steps

To learn about the template syntax, see [Understand the structure and syntax of ARM templates](./syntax.md).
