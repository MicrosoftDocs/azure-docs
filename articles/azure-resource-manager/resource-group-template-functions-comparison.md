---
title: Azure Resource Manager template functions - comparison | Microsoft Docs
description: Describes the functions to use in an Azure Resource Manager template to compare values.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/26/2017
ms.author: tomfitz

---
# Comparison functions for Azure Resource Manager templates

Resource Manager provides several functions for making comparisons in your templates.

* [equals](#equals)
* [less](#less)
* [lessOrEquals](#lessorequals)
* [greater](#greater)
* [greaterOrEquals](#greaterorequals)

<a id="equals" />

## equals
`equals(arg1, arg2)`

Checks whether two values equal each other.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int, string, array, or object |The first value to check for equality. |
| arg2 |Yes |int, string, array, or object |The second value to check for equality. |

### Examples

The example template checks different types of values for equality. All the default values return True.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "firstInt": {
            "type": "int",
            "defaultValue": 1
        },
        "secondInt": {
            "type": "int",
            "defaultValue": 1
        },
        "firstString": {
            "type": "string",
            "defaultValue": "a"
        },
        "secondString": {
            "type": "string",
            "defaultValue": "a"
        },
        "firstArray": {
            "type": "array",
            "defaultValue": ["a", "b"]
        },
        "secondArray": {
            "type": "array",
            "defaultValue": ["a", "b"]
        },
        "firstObject": {
            "type": "object",
            "defaultValue": {"a": "b"}
        },
        "secondObject": {
            "type": "object",
            "defaultValue": {"a": "b"}
        }
    },
    "resources": [
    ],
    "outputs": {
        "checkInts": {
            "type": "bool",
            "value": "[equals(parameters('firstInt'), parameters('secondInt') )]"
        },
        "checkStrings": {
            "type": "bool",
            "value": "[equals(parameters('firstString'), parameters('secondString'))]"
        },
        "checkArrays": {
            "type": "bool",
            "value": "[equals(parameters('firstArray'), parameters('secondArray'))]"
        },
        "checkObjects": {
            "type": "bool",
            "value": "[equals(parameters('firstObject'), parameters('secondObject'))]"
        }
    }
}
```

### Return value

Returns **True** if the values are equal; otherwise, **False**.

<a id="less" />

## less
`less(arg1, arg2)`

Checks whether the first value is less than the second value.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the less comparison. |
| arg2 |Yes |int or string |The second value for the less comparison. |

### Examples

The example template checks whether the one value is less than the other.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "firstInt": {
            "type": "int"
        },
        "secondInt": {
            "type": "int"
        },
        "firstString": {
            "type": "string"
        },
        "secondString": {
            "type": "string"
        }
    },
    "resources": [
    ],
    "outputs": {
        "checkInts": {
            "type": "bool",
            "value": "[less(parameters('firstInt'), parameters('secondInt') )]"
        },
        "checkStrings": {
            "type": "bool",
            "value": "[less(parameters('firstString'), parameters('secondString'))]"
        }
    }
}
```

### Return value

Returns **True** if the first value is less than the second value; otherwise, **False**.

<a id="lessorequals" />

## lessOrEquals
`lessOrEquals(arg1, arg2)`

Checks whether the first value is less than or equal to the second value.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the less or equals comparison. |
| arg2 |Yes |int or string |The second value for the less or equals comparison. |

### Examples

The example template checks whether the one value is less than or equal to the other.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "firstInt": {
            "type": "int"
        },
        "secondInt": {
            "type": "int"
        },
        "firstString": {
            "type": "string"
        },
        "secondString": {
            "type": "string"
        }
    },
    "resources": [
    ],
    "outputs": {
        "checkInts": {
            "type": "bool",
            "value": "[lessOrEquals(parameters('firstInt'), parameters('secondInt') )]"
        },
        "checkStrings": {
            "type": "bool",
            "value": "[lessOrEquals(parameters('firstString'), parameters('secondString'))]"
        }
    }
}
```

### Return value

Returns **True** if the first value is less than or equal to the second value; otherwise, **False**.

<a id="greater" />

## greater
`greater(arg1, arg2)`

Checks whether the first value is greater than the second value.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the greater comparison. |
| arg2 |Yes |int or string |The second value for the greater comparison. |

### Examples

The example template checks whether the one value is greater than the other.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "firstInt": {
            "type": "int"
        },
        "secondInt": {
            "type": "int"
        },
        "firstString": {
            "type": "string"
        },
        "secondString": {
            "type": "string"
        }
    },
    "resources": [
    ],
    "outputs": {
        "checkInts": {
            "type": "bool",
            "value": "[greater(parameters('firstInt'), parameters('secondInt') )]"
        },
        "checkStrings": {
            "type": "bool",
            "value": "[greater(parameters('firstString'), parameters('secondString'))]"
        }
    }
}
```

### Return value

Returns **True** if the first value is greater than the second value; otherwise, **False**.

<a id="greaterorequals" />

## greaterOrEquals
`greaterOrEquals(arg1, arg2)`

Checks whether the first value is greater than or equal to the second value.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the greater or equal comparison. |
| arg2 |Yes |int or string |The second value for the greater or equal comparison. |

### Examples

The example template checks whether the one value is greater than or equal to the other.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "firstInt": {
            "type": "int"
        },
        "secondInt": {
            "type": "int"
        },
        "firstString": {
            "type": "string"
        },
        "secondString": {
            "type": "string"
        }
    },
    "resources": [
    ],
    "outputs": {
        "checkInts": {
            "type": "bool",
            "value": "[greaterOrEquals(parameters('firstInt'), parameters('secondInt') )]"
        },
        "checkStrings": {
            "type": "bool",
            "value": "[greaterOrEquals(parameters('firstString'), parameters('secondString'))]"
        }
    }
}
```

### Return value

Returns **True** if the first value is greater than or equal to the second value; otherwise, **False**.

## Next Steps
* For a description of the sections in an Azure Resource Manager template, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
* To merge multiple templates, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).
* To iterate a specified number of times when creating a type of resource, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).
* To see how to deploy the template you have created, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md).

