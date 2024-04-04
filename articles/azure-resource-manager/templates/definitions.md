---
title: Type definitions in templates
description: Describes how to create type definitions in an Azure Resource Manager template (ARM template).
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 08/22/2023
---

# Type definitions in ARM templates

This article describes how to create and use definitions in your Azure Resource Manager template (ARM template). By defining your own types, you can reuse these types. Type definitions can only be used with [languageVersion 2.0](./syntax.md#languageversion-20).

[!INCLUDE [VSCode ARM Tools extension doesn't support languageVersion 2.0](../../../includes/resource-manager-vscode-language-version-20.md)]

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [User-defined data types in Bicep](../bicep/user-defined-data-types.md).

## Minimal declaration

At a minimum, every type definition needs a name and either a `type` or a [`$ref`](#use-definition).

```json
"definitions": {
  "demoStringType": {
    "type": "string"
  },
  "demoIntType": {
    "type": "int"
  },
  "demoBoolType": {
    "type": "bool"
  },
  "demoObjectType": {
    "type": "object"
  },
  "demoArrayType": {
    "type": "array"
  }
}
```

## Allowed values

You can define allowed values for a type definition. You provide the allowed values in an array. The deployment fails during validation if a value is passed in for the type definition that isn't one of the allowed values.

```json
"definitions": {
  "demoEnumType": {
    "type": "string",
    "allowedValues": [
      "one",
      "two"
    ]
  }
}
```

## Length constraints

You can specify minimum and maximum lengths for string and array type definitions. You can set one or both constraints. For strings, the length indicates the number of characters. For arrays, the length indicates the number of items in the array.

The following example declares two type definitions. One type definition is for a storage account name that must have 3-24 characters. The other type definition is an array that must have from 1-5 items.

```json
"definitions": {
  "storageAccountNameType": {
    "type": "string",
    "minLength": 3,
    "maxLength": 24
  },
  "appNameType": {
    "type": "array",
    "minLength": 1,
    "maxLength": 5
  }
}
```

## Integer constraints

You can set minimum and maximum values for integer type definitions. You can set one or both constraints.

```json
"definitions": {
  "monthType": {
    "type": "int",
    "minValue": 1,
    "maxValue": 12
  }
}
```

## Object constraints

### Properties

The value of `properties` is a map of property name => type definition.

The following example would accept `{"foo": "string", "bar": 1}`, but reject `{"foo": "string", "bar": -1}`, `{"foo": "", "bar": 1}`, or any object without a `foo` or `bar` property.

```json
"definitions": {
  "objectDefinition": {
    "type": "object",
    "properties": {
      "foo": {
        "type": "string",
        "minLength": 3
      },
      "bar": {
        "type": "int",
        "minValue": 0
      }
    }
  }
},
"parameters": {
  "objectParameter": {
    "$ref": "#/definitions/objectDefinition",
  }
}
```

All properties are required unless the property’s type definition has the ["nullable": true](#nullable-constraint) constraint. To make both properties in the preceding example optional, it would look like:

```json
"definitions": {
  "objectDefinition": {
    "type": "object",
    "properties": {
      "foo": {
        "type": "string",
        "minLength": 3,
        "nullable": true
      },
      "bar": {
        "type": "int",
        "minValue": 0,
        "nullable": true
      }
    }
  }
}
```

### additionalProperties

The value of `additionalProperties` is a type definition or a boolean value. If no `additionalProperties` constraint is defined, the default value is `true`.

If value is a type definition, the value describes the schema that is applied to all properties not mentioned in the [`properties`](#properties) constraint. The following example would accept `{"fizz": "buzz", "foo": "bar"}` but reject `{"property": 1}`.

```json
"definitions": {
  "dictionaryDefinition": {
    "type": "object",
    "properties": {
      "foo": {
        "type": "string",
        "minLength": 3,
        "nullable": true
      },
      "bar": {
        "type": "int",
        "minValue": 0,
        "nullable": true
      }
    },
    "additionalProperties": {
      "type": "string"
    }
  }
}
```

If the value is `false`, no properties beyond those defined in the [`properties`](#properties) constraint may be supplied. The following example would accept `{"foo": "string", "bar": 1}`, but reject `{"foo": "string", "bar": 1, "fizz": "buzz"}`.

```json
"definitions": {
  "dictionaryDefinition": {
    "type": "object",
    "properties": {
      "foo": {
        "type": "string",
        "minLength": 3
      },
      "bar": {
        "type": "int",
        "minValue": 0
      }
    },
    "additionalProperties": false
  }
}
```

If the value is `true`, any property not defined in the [`properties`](#properties) constraint accepts any value. The following example would accept `{"foo": "string", "bar": 1, "fizz": "buzz"}`.

```json
"definitions": {
  "dictionaryDefinition": {
    "type": "object",
    "properties": {
      "foo": {
        "type": "string",
        "minLength": 3
      },
      "bar": {
        "type": "int",
        "minValue": 0
      }
    },
    "additionalProperties": true
  }
}
```

### discriminator

The value `discriminator` defines what schema to apply based on a discriminator property. The following example would accept either `{"type": "ints", "foo": 1, "bar": 2}` or `{"type": "strings", "fizz": "buzz", "pop": "goes", "the": "weasel"}`, but reject `{"type": "ints", "fizz": "buzz"}`.

```json
"definitions": {
  "taggedUnionDefinition": {
    "type": "object",
    "discriminator": {
      "propertyName": "type",
      "mapping": {
        "ints": {
          "type": "object",
          "additionalProperties": {"type": "int"}
        },
        "strings": {
          "type": "object",
          "additionalProperties": {"type": "string"}
          }
      }
    }
  }
}
```

## Array constraints

### prefixItems

The value of `prefixItems` is an array of type definitions. Each type definition in the value is the schema to be used to validate the element of an array at the same index. The following example would accept `[1, true]` but reject `[1, "string"]` or `[1]`:

```json
"definitions": {
  "tupleDefinition": {
    "type": "array",
    "prefixItems": [
      { "type": "int" },
      { "type": "bool" }
    ]
  }
},
"parameters": {
  "tupleParameter": {
    "$ref": "#/definitions/tupleDefinition"
  }
}
```

### items

The value of `items` is a type definition or a boolean. If no `items` constraint is defined, the default value is `true`.

If value is a type definition, the value describes the schema that is applied to all elements of the array whose index is greater than the largest index of the [`prefixItems`](#prefixitems) constraint. The following example would accept `[1, true, 1]` or `[1, true, 1, 1]` but reject `[1, true, "foo"]`:

```json
"definitions": {
  "tupleDefinition": {
    "type": "array",
    "prefixItems": [
      { "type": "int" },
      { "type": "bool" }
    ],
    "items": { "type": "int" }
  }
},
"parameters": {
  "tupleParameter": {
    "$ref": "#/definitions/tupleDefinition"
  }
}
```

You can use `items` without using `prefixItems`. The following example would accept `[1, 2]` or `[1]` but reject `["foo"]`:

```json
"definitions": {
  "intArrayDefinition": {
    "type": "array",
    "items": { "type": "int" }
  }
},
"parameters": {
  "intArrayParameter": {
    "$ref": "#/definitions/intArrayDefinition"
  }
}
```

If the value is `false`, the validated array must be the exact same length as the [`prefixItems`](#prefixitems) constraint. The following example would accept `[1, true]`,  but reject `[1, true, 1]`, and `[1, true, false, "foo", "bar"]`.

```json
"definitions": {
  "tupleDefinition": {
    "type": "array",
    "prefixItems": [
      {"type": "int"},
      {"type": "bool"}
    ]
  },
  "items": false
}
```

If the value is true, elements of the array whose index is greater than the largest index of the [`prefixItems`](#prefixitems) constraint accept any value. The following examples would accept `[1, true]`, `[1, true, 1]` and `[1, true, false, "foo", "bar"]`.

```json
"definitions": {
  "tupleDefinition": {
    "type": "array",
    "prefixItems": [
      {"type": "int"},
      {"type": "bool"}
    ]
  }
}
```

```json
"definitions": {
  "tupleDefinition": {
    "type": "array",
    "prefixItems": [
      {"type": "int"},
      {"type": "bool"}
    ]
  },
  "items": true
}
```

## nullable constraint

The nullable constraint indicates that the value may be `null` or omitted. See [Properties](#properties) for an example.


## Description

You can add a description to a type definition to help users of your template understand the value to provide.

```json
"definitions": {
  "virtualMachineSize": {
    "type": "string",
    "metadata": {
      "description": "Must be at least Standard_A3 to support 2 NICs."
    },
    "defaultValue": "Standard_DS1_v2"
  }
}
```

## Use definition

To reference a type definition, use the following syntax:

```json
"$ref": "#/definitions/<definition-name>"
```

The following example shows how to reference a type definition from parameters and outputs:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "languageVersion": "2.0",

  "definitions": {
    "naturalNumber": {
      "type": "int",
      "minValue": 1
    }
  },
  "parameters": {
    "numberParam": {
      "$ref": "#/definitions/naturalNumber",
      "defaultValue": 0
    }
  },
  "resources": {},
  "outputs": {
    "output1": {
      "$ref": "#/definitions/naturalNumber",
      "value": "[parameters('numberParam')]"
    }
  }
}
```

## Next steps

* To learn about the available properties for type definitions, see [Understand the structure and syntax of ARM templates](./syntax.md).
