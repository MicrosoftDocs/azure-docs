---
title: Template functions - numeric
description: Describes the functions to use in an Azure Resource Manager template (ARM template) to work with numbers.
ms.topic: reference
ms.custom: devx-track-arm-template
ms.date: 08/01/2025
---

# Numeric functions for ARM templates

Resource Manager provides the following functions for working with integers in your Azure Resource Manager template (ARM template):

* [add](#add)
* [copyIndex](#copyindex)
* [div](#div)
* [float](#float)
* [int](#int)
* [max](#max)
* [min](#min)
* [mod](#mod)
* [mul](#mul)
* [sub](#sub)

> [!TIP]
> [Bicep](../bicep/overview.md) is recommended since it offers the same capabilities as ARM templates, and the syntax is easier to use. To learn more about using `int`, `min`, and `max` in Bicep, see [`numeric`](../bicep/bicep-functions-numeric.md) functions. For other numeric values, see [numeric](../bicep/operators-numeric.md) operators.

## add

`add(operand1, operand2)`

Returns the sum of the two provided integers.

The `add` function isn't supported in Bicep. Use the [`+` operator](../bicep/operators-numeric.md#add-) instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
|operand1 |Yes |int |First number to add. |
|operand2 |Yes |int |Second number to add. |

### Return value

An integer that contains the sum of the parameters.

### Example

The following example adds two parameters:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
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

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| addResult | Int | 8 |

## copyIndex

`copyIndex(loopName, offset)`

Returns the index of an iteration loop.

In Bicep, use [iterative loops](../bicep/loops.md).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| loopName | No | string | The name of the loop for getting the iteration. |
| offset |No |int |The number to add to the zero-based iteration value. |

### Remarks

This function is always used with a **copy** object. If no value is provided for **offset**, the current iteration value is returned. The iteration value starts at zero.

The **loopName** property enables you to specify if `copyIndex` is referring to a resource iteration or property iteration. If no value is provided for **loopName**, the current resource type iteration is used. Provide a value for **loopName** when iterating on a property.

For more information about using copy, see:

* [Resource iteration in ARM templates](copy-resources.md)
* [Property iteration in ARM templates](copy-properties.md)
* [Variable iteration in ARM templates](copy-variables.md)
* [Output iteration in ARM templates](copy-outputs.md)

### Example

The following example shows a copy loop and the index value included in the name:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageCount": {
      "type": "int",
      "defaultValue": 2
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-09-01",
      "name": "[format('{0}storage{1}', range(0, parameters('storageCount'))[copyIndex()], uniqueString(resourceGroup().id))]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": {},
      "copy": {
        "name": "storagecopy",
        "count": "[parameters('storageCount')]"
      }
    }
  ]
}
```

### Return value

An integer representing the current index of the iteration.

## div

`div(operand1, operand2)`

Returns the integer division of the two provided integers.

The `div` function isn't supported in Bicep. Use the [`/` operator](../bicep/operators-numeric.md#divide-) instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| operand1 |Yes |int |The number being divided. |
| operand2 |Yes |int |The number that's used to divide. Can't be 0. |

### Return value

An integer representing the division.

### Example

The following example divides one parameter by another one:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
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

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| divResult | Int | 2 |

## float

`float(arg1)`

Converts the value to a floating point number. You only use this function when passing custom parameters to an application, such as a Logic App.

The `float` function isn't supported in Bicep.

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

## int

`int(valueToConvert)`

Converts the specified value to an integer.

In Bicep, use the [`int`](../bicep/bicep-functions-numeric.md#int) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| valueToConvert |Yes |string or int |The value to convert to an integer. |

### Return value

An integer of the converted value.

### Example

The following example template converts the user-provided parameter value to an integer:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
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

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| intResult | Int | 4 |

## max

`max(arg1)`

Returns the maximum value from an array of integers or a comma-separated list of integers.

In Bicep, use the [`max`](../bicep/bicep-functions-numeric.md#max) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array of integers, or comma-separated list of integers |The collection to get the maximum value. |

### Return value

An integer representing the maximum value from the collection.

### Example

The following example shows how to use `max` with an array and a list of integers:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "arrayToTest": {
      "type": "array",
      "defaultValue": [ 0, 3, 2, 5, 4 ]
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

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Int | 5 |
| intOutput | Int | 5 |

## min

`min(arg1)`

Returns the minimum value from an array of integers or a comma-separated list of integers.

In Bicep, use the [`min`](../bicep/bicep-functions-numeric.md#min) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array of integers, or comma-separated list of integers |The collection to get the minimum value. |

### Return value

An integer representing minimum value from the collection.

### Example

The following example shows how to use `min` with an array and a list of integers:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "arrayToTest": {
      "type": "array",
      "defaultValue": [ 0, 3, 2, 5, 4 ]
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

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Int | 0 |
| intOutput | Int | 0 |

## mod

`mod(operand1, operand2)`

Returns the quotient of the integer division using the two provided integers.

The `mod` function isn't supported in Bicep. Use the [% operator](../bicep/operators-numeric.md#modulo-) instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| operand1 |Yes |int |The number being divided. |
| operand2 |Yes |int |The number that's used to divide, Can't be 0. |

### Return value

An integer representing the remainder.

### Example

The following example returns the quotient of dividing one parameter by another one:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
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

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| modResult | Int | 1 |

## mul

`mul(operand1, operand2)`

Returns the multiplication of the two provided integers.

The `mul` function isn't supported in Bicep. Use the [* operator](../bicep/operators-numeric.md#multiply-) instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| operand1 |Yes |int |First number to multiply. |
| operand2 |Yes |int |Second number to multiply. |

### Return value

An integer representing the multiplication.

### Example

The following example multiplies one parameter by another one:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
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
      "value": "[mul(mul(parameters('first'), parameters('second')), 3)]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| mulResult | Int | 45 |

## sub

`sub(operand1, operand2)`

Returns the subtraction of the two provided integers.

The `sub` function isn't supported in Bicep. Use the [- operator](../bicep/operators-numeric.md#subtract--) instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| operand1 |Yes |int |The number that's subtracted from. |
| operand2 |Yes |int |The number that's subtracted. |

### Return value

An integer representing the subtraction.

### Example

The following example subtracts one parameter from another one:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
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

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| subResult | Int | 4 |

## Next steps

* For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
* To iterate a specified number of times when creating a type of resource, see [Resource iteration in ARM templates](copy-resources.md).
