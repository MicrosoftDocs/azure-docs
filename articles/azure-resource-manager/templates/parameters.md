---
title: Parameters in templates
description: Describes how to define parameters in an Azure Resource Manager template (ARM template).
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 08/22/2023
---

# Parameters in ARM templates

This article describes how to define and use parameters in your Azure Resource Manager template (ARM template). By providing different values for parameters, you can reuse a template for different environments.

Resource Manager resolves parameter values before starting the deployment operations. Wherever the parameter is used in the template, Resource Manager replaces it with the resolved value.

Each parameter must be set to one of the [data types](data-types.md).

In addition to minValue, maxValue, minLength, maxLength, and allowedValues, [languageVersion 2.0](./syntax.md#languageversion-20) introduces some aggregate type validation constraints to be used in [definitions](./syntax.md#definitions), [parameters](./syntax.md#parameters) and [outputs](./syntax.md#outputs) definitions. These constraints include:

- [additionalProperties](#additionalproperties)
- [discriminator](#discriminator)
- [items](#items)
- [nullable](#nullable-constraint)
- [prefixItems](#prefixitems)
- [properties](#properties)

[!INCLUDE [VSCode ARM Tools extension doesn't support languageVersion 2.0](../../../includes/resource-manager-vscode-language-version-20.md)]

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [parameters](../bicep/parameters.md).

You are limited to 256 parameters in a template. For more information, see [Template limits](./best-practices.md#template-limits).

For parameter best practices, see [Parameters](./best-practices.md#parameters).

## Minimal declaration

At a minimum, every parameter needs a name and type.

When you deploy a template via the Azure portal, camel-cased parameter names are turned into space-separated names. For example, *demoString* in the following example is shown as *Demo String*. For more information, see [Use a deployment button to deploy templates from GitHub repository](./deploy-to-azure-button.md) and [Deploy resources with ARM templates and Azure portal](./deploy-portal.md).

```json
"parameters": {
  "demoString": {
    "type": "string"
  },
  "demoInt": {
    "type": "int"
  },
  "demoBool": {
    "type": "bool"
  },
  "demoObject": {
    "type": "object"
  },
  "demoArray": {
    "type": "array"
  }
}
```

## Secure parameters

You can mark string or object parameters as secure. The value of a secure parameter isn't saved to the deployment history and isn't logged.

```json
"parameters": {
  "demoPassword": {
    "type": "secureString"
  },
  "demoSecretObject": {
    "type": "secureObject"
  }
}
```

## Allowed values

You can define allowed values for a parameter. You provide the allowed values in an array. The deployment fails during validation if a value is passed in for the parameter that isn't one of the allowed values.

```json
"parameters": {
  "demoEnum": {
    "type": "string",
    "allowedValues": [
      "one",
      "two"
    ]
  }
}
```

## Default value

You can specify a default value for a parameter. The default value is used when a value isn't provided during deployment.

```json
"parameters": {
  "demoParam": {
    "type": "string",
    "defaultValue": "Contoso"
  }
}
```

To specify a default value along with other properties for the parameter, use the following syntax.

```json
"parameters": {
  "demoParam": {
    "type": "string",
    "defaultValue": "Contoso",
    "allowedValues": [
      "Contoso",
      "Fabrikam"
    ]
  }
}
```

You can use expressions with the default value. You can't use the [reference](template-functions-resource.md#reference) function or any of the [list](template-functions-resource.md#list) functions in the parameters section. These functions get the runtime state of a resource, and can't be executed before deployment when parameters are resolved.

Expressions aren't allowed with other parameter properties.

```json
"parameters": {
  "location": {
    "type": "string",
    "defaultValue": "[resourceGroup().location]"
  }
}
```

You can use another parameter value to build a default value. The following template constructs a host plan name from the site name.

```json
"parameters": {
  "siteName": {
    "type": "string",
    "defaultValue": "[concat('site', uniqueString(resourceGroup().id))]"
  },
  "hostingPlanName": {
    "type": "string",
    "defaultValue": "[concat(parameters('siteName'),'-plan')]"
  }
}
```

## Length constraints

You can specify minimum and maximum lengths for string  and array parameters. You can set one or both constraints. For strings, the length indicates the number of characters. For arrays, the length indicates the number of items in the array.

The following example declares two parameters. One parameter is for a storage account name that must have 3-24 characters. The other parameter is an array that must have from 1-5 items.

```json
"parameters": {
  "storageAccountName": {
    "type": "string",
    "minLength": 3,
    "maxLength": 24
  },
  "appNames": {
    "type": "array",
    "minLength": 1,
    "maxLength": 5
  }
}
```

## Integer constraints

You can set minimum and maximum values for integer parameters. You can set one or both constraints.

```json
"parameters": {
  "month": {
    "type": "int",
    "minValue": 1,
    "maxValue": 12
  }
}
```

## Object constraints

The object constraints are only allowed on [objects](./data-types.md#objects), and can only be used with [languageVersion 2.0](./syntax.md#languageversion-20).

### Properties

The value of `properties` is a map of property name => [type definition](./definitions.md).

The following example would accept `{"foo": "string", "bar": 1}`, but reject `{"foo": "string", "bar": -1}`, `{"foo": "", "bar": 1}`, or any object without a `foo` or `bar` property.

```json
"parameters": {
  "objectParameter": {
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
}
```

All properties are required unless the property’s [type definition](./definitions.md) has the ["nullable": true](#nullable-constraint) constraint. To make both properties in the preceding example optional, it would look like:

```json
"parameters": {
  "objectParameter": {
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

The value of `additionalProperties` is a [type definition](./definitions.md) or a boolean value. If no `additionalProperties` constraint is defined, the default value is `true`.

If value is a type definition, the value describes the schema that is applied to all properties not mentioned in the [`properties`](#properties) constraint. The following example would accept `{"fizz": "buzz", "foo": "bar"}` but reject `{"property": 1}`.

```json
"parameters": {
  "dictionaryParameter": {
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
"parameters": {
  "dictionaryParameter": {
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
"parameters": {
  "dictionaryParameter": {
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
"parameters": {
  "taggedUnionParameter": {
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

The array constraints are only allowed on [arrays](./data-types.md#arrays), and can only be used with [languageVersion 2.0](./syntax.md#languageversion-20).

### prefixItems

The value of `prefixItems` is an array of [type definitions](./definitions.md). Each type definition in the value is the schema to be used to validate the element of an array at the same index. The following example would accept `[1, true]` but reject `[1, "string"]` or `[1]`:

```json
"parameters": {
  "tupleParameter": {
    "type": "array",
    "prefixItems": [
      {"type": "int"},
      {"type": "bool"}
    ]
  }
}
```

### items

The value of `items` is a [type definition](./definitions.md) or a boolean. If no `items` constraint is defined, the default value is `true`.

If value is a type definition, the value describes the schema that is applied to all elements of the array whose index is greater than the largest index of the [`prefixItems`](#prefixitems) constraint. The following example would accept `[1, true, 1]` or `[1, true, 1, 1]` but reject `[1, true, "foo"]`:

```json
"parameters": {
  "tupleParameter": {
    "type": "array",
    "prefixItems": [
      { "type": "int" },
      { "type": "bool" }
    ],
    "items": { "type": "int" },
    "defaultValue": [1, true, "foo"]
  }
}
```

You can use `items` without using `prefixItems`. The following example would accept `[1, 2]` or `[1]` but reject `["foo"]`:

```json
"parameters": {
  "intArrayParameter": {
    "type": "array",
    "items": {"type": "int"}
  }
}
```

If the value is `false`, the validated array must be the exact same length as the [`prefixItems`](#prefixitems) constraint. The following example would accept `[1, true]`,  but reject `[1, true, 1]`, and `[1, true, false, "foo", "bar"]`.

```json
"parameters": {
  "tupleParameter": {
    "type": "array",
    "prefixItems": [
      {"type": "int"},
      {"type": "bool"}
    ],
    "items": false
  }
}
```

If the value is true, elements of the array whose index is greater than the largest index of the [`prefixItems`](#prefixitems) constraint accept any value. The following examples would accept `[1, true]`, `[1, true, 1]` and `[1, true, false, "foo", "bar"]`.

```json
"parameters": {
  "tupleParameter": {
    "type": "array",
    "prefixItems": [
      {"type": "int"},
      {"type": "bool"}
    ]
  }
}
```

```json
"parameters": {
  "tupleParameter": {
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

The nullable constraint can only be used with [languageVersion 2.0](./syntax.md#languageversion-20). It indicates that the value may be `null` or omitted. See [Properties](#properties) for an example.

## Description

You can add a description to a parameter to help users of your template understand the value to provide. When deploying the template through the portal, the text you provide in the description is automatically used as a tip for that parameter. Only add a description when the text provides more information than can be inferred from the parameter name.

```json
"parameters": {
  "virtualMachineSize": {
    "type": "string",
    "metadata": {
      "description": "Must be at least Standard_A3 to support 2 NICs."
    },
    "defaultValue": "Standard_DS1_v2"
  }
}
```

## Use parameter

To reference a parameter's value, use the [parameters](template-functions-deployment.md#parameters) function. The following example uses a parameter value for a key vault name.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vaultName": {
      "type": "string",
      "defaultValue": "[format('keyVault{0}', uniqueString(resourceGroup().id))]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.KeyVault/vaults",
      "apiVersion": "2021-06-01-preview",
      "name": "[parameters('vaultName')]",
      ...
    }
  ]
}
```

## Objects as parameters

You can organize related values by passing them in as an object. This approach also reduces the number of parameters in the template.

The following example shows a parameter that is an object. The default value shows the expected properties for the object. Those properties are used when defining the resource to deploy.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vNetSettings": {
      "type": "object",
      "defaultValue": {
        "name": "VNet1",
        "location": "eastus",
        "addressPrefixes": [
          {
            "name": "firstPrefix",
            "addressPrefix": "10.0.0.0/22"
          }
        ],
        "subnets": [
          {
            "name": "firstSubnet",
            "addressPrefix": "10.0.0.0/24"
          },
          {
            "name": "secondSubnet",
            "addressPrefix": "10.0.1.0/24"
          }
        ]
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2021-02-01",
      "name": "[parameters('vNetSettings').name]",
      "location": "[parameters('vNetSettings').location]",
      "properties": {
        "addressSpace": {
          "addressPrefixes": [
            "[parameters('vNetSettings').addressPrefixes[0].addressPrefix]"
          ]
        },
        "subnets": [
          {
            "name": "[parameters('vNetSettings').subnets[0].name]",
            "properties": {
              "addressPrefix": "[parameters('vNetSettings').subnets[0].addressPrefix]"
            }
          },
          {
            "name": "[parameters('vNetSettings').subnets[1].name]",
            "properties": {
              "addressPrefix": "[parameters('vNetSettings').subnets[1].addressPrefix]"
            }
          }
        ]
      }
    }
  ]
}
```

## Example templates

The following examples demonstrate scenarios for using parameters.

|Template  |Description  |
|---------|---------|
|[parameters with functions for default values](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/parameterswithfunctions.json) | Demonstrates how to use template functions when defining default values for parameters. The template doesn't deploy any resources. It constructs parameter values and returns those values. |
|[parameter object](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/parameterobject.json) | Demonstrates using an object for a parameter. The template doesn't deploy any resources. It constructs parameter values and returns those values. |

## Next steps

* To learn about the available properties for parameters, see [Understand the structure and syntax of ARM templates](./syntax.md).
* To learn about passing in parameter values as a file, see [Create Resource Manager parameter file](parameter-files.md).
* For recommendations about creating parameters, see [Best practices - parameters](./best-practices.md#parameters).
