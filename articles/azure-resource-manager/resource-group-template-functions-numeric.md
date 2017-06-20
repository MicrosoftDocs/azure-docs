---
title: Azure Resource Manager template functions - numeric | Microsoft Docs
description: Describes the functions to use in an Azure Resource Manager template to work with numbers.
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
ms.date: 06/13/2017
ms.author: tomfitz

---
# Numeric functions for Azure Resource Manager templates

Resource Manager provides the following functions for working with integers:

* [add](#add)
* [copyIndex](#copyindex)
* [div](#div)
* [float](#float)
* [int](#int)
* [min](#min)
* [max](#max)
* [mod](#mod)
* [mul](#mul)
* [sub](#sub)

<a id="add" />

## add
`add(operand1, operand2)`

Returns the sum of the two provided integers.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- | 
|operand1 |Yes |int |First number to add. |
|operand2 |Yes |int |Second number to add. |

### Return value

An integer that contains the sum of the parameters.

### Example

The following example adds two parameters.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "first": {
            "type": "int",
            "defaultValue": 5,
            "metadata": {
                "description": "First integer to add"
            }
        },
        "second": {
            "type": "int",
            "defaultValue": 3,
            "metadata": {
                "description": "Second integer to add"
            }
        }
    },
    "resources": [
    ],
    "outputs": {
        "addResult": {
            "type": "int",
            "value": "[add(parameters('first'), parameters('second'))]"
        }
    }
}
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| addResult | Int | 8 |

<a id="copyindex" />

## copyIndex
`copyIndex(loopName, offset)`

Returns the index of an iteration loop. 

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| loopName | No | string | The name of the loop for getting the iteration. |
| offset |No |int |The number to add to the zero-based iteration value. |

### Remarks

This function is always used with a **copy** object. If no value is provided for **offset**, the current iteration value is returned. The iteration value starts at zero.

The **loopName** property enables you to specify whether copyIndex is referring to a resource iteration or property iteration. If no value is provided for **loopName**, the current resource type iteration is used. Provide a value for **loopName** when iterating on a property. 
 
For a complete description of how you use **copyIndex**, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).

### Example

The following example shows a copy loop and the index value included in the name. 

```json
"resources": [ 
  { 
    "name": "[concat('examplecopy-', copyIndex())]", 
    "type": "Microsoft.Web/sites", 
    "copy": { 
      "name": "websitescopy", 
      "count": "[parameters('count')]" 
    }, 
    ...
  }
]
```

### Return value

An integer representing the current index of the iteration.

<a id="div" />

## div
`div(operand1, operand2)`

Returns the integer division of the two provided integers.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| operand1 |Yes |int |The number being divided. |
| operand2 |Yes |int |The number that is used to divide. Cannot be 0. |

### Return value

An integer representing the division.

### Example

The following example divides one parameter by another parameter.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "first": {
            "type": "int",
            "defaultValue": 8,
            "metadata": {
                "description": "Integer being divided"
            }
        },
        "second": {
            "type": "int",
            "defaultValue": 3,
            "metadata": {
                "description": "Integer used to divide"
            }
        }
    },
    "resources": [
    ],
    "outputs": {
        "divResult": {
            "type": "int",
            "value": "[div(parameters('first'), parameters('second'))]"
        }
    }
}
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| divResult | Int | 2 |

<a id="float" />

## float
`float(arg1)`

Converts the value to a floating point number. You only use this function when passing custom parameters to an application, such as a Logic App.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |string or int |The value to convert to a floating point number. |

### Return value
A floating point number.

### Example

The following example shows how to use float to pass parameters to a Logic App:

```json
{
    "type": "Microsoft.Logic/workflows",
    "properties": {
        ...
        "parameters": {
        "custom1": {
            "value": "[float('3.0')]"
        },
        "custom2": {
            "value": "[float(3)]"
        },
```

<a id="int" />

## int
`int(valueToConvert)`

Converts the specified value to an integer.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| valueToConvert |Yes |string or int |The value to convert to an integer. |

### Return value

An integer of the converted value.

### Example

The following example converts the user-provided parameter value to integer.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "stringToConvert": { 
            "type": "string",
            "defaultValue": "4"
        }
    },
    "resources": [
    ],
    "outputs": {
        "intResult": {
            "type": "int",
            "value": "[int(parameters('stringToConvert'))]"
        }
    }
}
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| intResult | Int | 4 |


<a id="min" />

## min
`min (arg1)`

Returns the minimum value from an array of integers or a comma-separated list of integers.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array of integers, or comma-separated list of integers |The collection to get the minimum value. |

### Return value

An integer representing minimum value from the collection.

### Example

The following example shows how to use min with an array and a list of integers:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "arrayToTest": {
            "type": "array",
            "defaultValue": [0,3,2,5,4]
        }
    },
    "resources": [],
    "outputs": {
        "arrayOutput": {
            "type": "int",
            "value": "[min(parameters('arrayToTest'))]"
        },
        "intOutput": {
            "type": "int",
            "value": "[min(0,3,2,5,4)]"
        }
    }
}
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Int | 0 |
| intOutput | Int | 0 |

<a id="max" />

## max
`max (arg1)`

Returns the maximum value from an array of integers or a comma-separated list of integers.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array of integers, or comma-separated list of integers |The collection to get the maximum value. |

### Return value

An integer representing the maximum value from the collection.

### Example

The following example shows how to use max with an array and a list of integers:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "arrayToTest": {
            "type": "array",
            "defaultValue": [0,3,2,5,4]
        }
    },
    "resources": [],
    "outputs": {
        "arrayOutput": {
            "type": "int",
            "value": "[max(parameters('arrayToTest'))]"
        },
        "intOutput": {
            "type": "int",
            "value": "[max(0,3,2,5,4)]"
        }
    }
}
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Int | 5 |
| intOutput | Int | 5 |

<a id="mod" />

## mod
`mod(operand1, operand2)`

Returns the remainder of the integer division using the two provided integers.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| operand1 |Yes |int |The number being divided. |
| operand2 |Yes |int |The number that is used to divide, Cannot be 0. |

### Return value
An integer representing the remainder.

### Example

The following example returns the remainder of dividing one parameter by another parameter.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "first": {
            "type": "int",
            "defaultValue": 7,
            "metadata": {
                "description": "Integer being divided"
            }
        },
        "second": {
            "type": "int",
            "defaultValue": 3,
            "metadata": {
                "description": "Integer used to divide"
            }
        }
    },
    "resources": [
    ],
    "outputs": {
        "modResult": {
            "type": "int",
            "value": "[mod(parameters('first'), parameters('second'))]"
        }
    }
}
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| modResult | Int | 1 |

<a id="mul" />

## mul
`mul(operand1, operand2)`

Returns the multiplication of the two provided integers.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| operand1 |Yes |int |First number to multiply. |
| operand2 |Yes |int |Second number to multiply. |

### Return value

An integer representing the multiplication.

### Example

The following example multiplies one parameter by another parameter.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "first": {
            "type": "int",
            "defaultValue": 5,
            "metadata": {
                "description": "First integer to multiply"
            }
        },
        "second": {
            "type": "int",
            "defaultValue": 3,
            "metadata": {
                "description": "Second integer to multiply"
            }
        }
    },
    "resources": [
    ],
    "outputs": {
        "mulResult": {
            "type": "int",
            "value": "[mul(parameters('first'), parameters('second'))]"
        }
    }
}
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| mulResult | Int | 15 |

<a id="sub" />

## sub
`sub(operand1, operand2)`

Returns the subtraction of the two provided integers.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| operand1 |Yes |int |The number that is subtracted from. |
| operand2 |Yes |int |The number that is subtracted. |

### Return value
An integer representing the subtraction.

### Example

The following example subtracts one parameter from another parameter.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "first": {
            "type": "int",
            "defaultValue": 7,
            "metadata": {
                "description": "Integer subtracted from"
            }
        },
        "second": {
            "type": "int",
            "defaultValue": 3,
            "metadata": {
                "description": "Integer to subtract"
            }
        }
    },
    "resources": [
    ],
    "outputs": {
        "subResult": {
            "type": "int",
            "value": "[sub(parameters('first'), parameters('second'))]"
        }
    }
}
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| subResult | Int | 4 |

## Next Steps
* For a description of the sections in an Azure Resource Manager template, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
* To merge multiple templates, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).
* To iterate a specified number of times when creating a type of resource, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).
* To see how to deploy the template you have created, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md).

