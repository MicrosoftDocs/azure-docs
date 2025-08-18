---
title: Template functions - comparison
description: Describes the functions to use in an Azure Resource Manager template (ARM template) to compare values.
ms.topic: reference
ms.custom: devx-track-arm-template
ms.date: 08/01/2025
---

# Comparison functions for ARM templates

Resource Manager provides several functions for making comparisons in your Azure Resource Manager template (ARM template):

* [coalesce](#coalesce)
* [equals](#equals)
* [greater](#greater)
* [greaterOrEquals](#greaterorequals)
* [less](#less)
* [lessOrEquals](#lessorequals)

> [!TIP]
> [Bicep](../bicep/overview.md) is recommended since it offers the same capabilities as ARM templates, and the syntax is easier to use. To learn more, see the [coalesce](../bicep/operators-logical.md) logical operator and [comparison](../bicep/operators-comparison.md) operators.

## coalesce

`coalesce(arg1, arg2, arg3, ...)`

Returns first non-null value from the parameters. Empty strings, empty arrays, and empty objects aren't null.

In Bicep, use the `??` operator instead. See [Coalesce ??](../bicep/operators-logical.md#coalesce-).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int, string, array, or object |The first value to test for null. |
| more args |No |int, string, array, or object | More values to test for null. |

### Return value

The value of the first non-null parameters, which can be a string, int, array, or object. Null if all parameters are null.

### Example

The following example template shows the output from different uses of `coalesce`:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "objectToTest": {
      "type": "object",
      "defaultValue": {
        "null1": null,
        "null2": null,
        "string": "default",
        "int": 1,
        "object": { "first": "default" },
        "array": [ 1 ]
      }
    }
  },
  "resources": [
  ],
  "outputs": {
    "stringOutput": {
      "type": "string",
      "value": "[coalesce(parameters('objectToTest').null1, parameters('objectToTest').null2, parameters('objectToTest').string)]"
    },
    "intOutput": {
      "type": "int",
      "value": "[coalesce(parameters('objectToTest').null1, parameters('objectToTest').null2, parameters('objectToTest').int)]"
    },
    "objectOutput": {
      "type": "object",
      "value": "[coalesce(parameters('objectToTest').null1, parameters('objectToTest').null2, parameters('objectToTest').object)]"
    },
    "arrayOutput": {
      "type": "array",
      "value": "[coalesce(parameters('objectToTest').null1, parameters('objectToTest').null2, parameters('objectToTest').array)]"
    },
    "emptyOutput": {
      "type": "bool",
      "value": "[empty(coalesce(parameters('objectToTest').null1, parameters('objectToTest').null2))]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| stringOutput | String | default |
| intOutput | Int | 1 |
| objectOutput | Object | {"first": "default"} |
| arrayOutput | Array | [1] |
| emptyOutput | Bool | True |

## equals

`equals(arg1, arg2)`

Checks if two values are identical. The comparison is case-sensitive.

In Bicep, use the `==` operator instead. See [Equals ==](../bicep/operators-comparison.md#equals-).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int, string, array, or object |The first value to check for equality. |
| arg2 |Yes |int, string, array, or object |The second value to check for equality. |

### Return value

Returns **True** if the values are equal; otherwise, **False**.

### Remarks

The `equals` function is often used with the `condition` element to test if a resource is deployed:

```json
{
  "condition": "[equals(parameters('newOrExisting'),'new')]",
  "type": "Microsoft.Storage/storageAccounts",
  "name": "[variables('storageAccountName')]",
  "apiVersion": "2022-09-01",
  "location": "[resourceGroup().location]",
  "sku": {
    "name": "[variables('storageAccountType')]"
  },
  "kind": "Storage",
  "properties": {}
}
```

### Example

The following example checks different types of values for equality. All default values return **True**:

```json
 "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
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
      "defaultValue": "demo"
```

The output of default values from the preceding example is:

| Name | Type | Value | Note |
| ---- | ---- | ----- | ---- | 
| checkInts | Bool | True |  |
| checkStrings | Bool | False | The result is `false` because the comparison is case-sensitive. | 
| checkArrays | Bool | True | |
| checkObjects | Bool | True | |

The following example template uses [`not`](template-functions-logical.md#not) with **equals**:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
  ],
  "outputs": {
    "checkNotEquals": {
      "type": "bool",
      "value": "[not(equals(1, 2))]"
    }
  }
}
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkNotEquals | Bool | True |

## greater

`greater(arg1, arg2)`

Checks if the first value is greater than the second value.

In Bicep, use the `>` operator instead. See [Greater than >](../bicep/operators-comparison.md#greater-than-).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the greater comparison. |
| arg2 |Yes |int or string |The second value for the greater comparison. |

### Return value

Returns **True** if the first value is greater than the second value; otherwise, **False**.

### Example

The following example checks if one value is greater than another:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "firstInt": {
      "type": "int",
      "defaultValue": 1
    },
    "secondInt": {
      "type": "int",
      "defaultValue": 2
    },
    "firstString": {
      "type": "string",
      "defaultValue": "A"
    },
    "secondString": {
      "type": "string",
      "defaultValue": "a"
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

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkInts | Bool | False |
| checkStrings | Bool | True |

## greaterOrEquals

`greaterOrEquals(arg1, arg2)`

Checks if the first value is greater than or equal to the second value.

In Bicep, use the `>=` operator instead. See [Greater than or equal >=](../bicep/operators-comparison.md#greater-than-or-equal-).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the greater or equal comparison. |
| arg2 |Yes |int or string |The second value for the greater or equal comparison. |

### Return value

Returns **True** if the first value is greater than or equal to the second value; otherwise, **False**.

### Example

The following example checks if one value is greater than or equal to another:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "firstInt": {
      "type": "int",
      "defaultValue": 1
    },
    "secondInt": {
      "type": "int",
      "defaultValue": 2
    },
    "firstString": {
      "type": "string",
      "defaultValue": "A"
    },
    "secondString": {
      "type": "string",
      "defaultValue": "a"
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

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkInts | Bool | False |
| checkStrings | Bool | True |

## less

`less(arg1, arg2)`

Checks if the first value is less than the second value.

In Bicep, use the `<` operator instead. See [Less than <](../bicep/operators-comparison.md#less-than-).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the less comparison. |
| arg2 |Yes |int or string |The second value for the less comparison. |

### Return value

Returns **True** if the first value is less than the second value; otherwise, **False**.

### Example

The following example checks if one value is less than another:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "firstInt": {
      "type": "int",
      "defaultValue": 1
    },
    "secondInt": {
      "type": "int",
      "defaultValue": 2
    },
    "firstString": {
      "type": "string",
      "defaultValue": "A"
    },
    "secondString": {
      "type": "string",
      "defaultValue": "a"
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

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkInts | Bool | True |
| checkStrings | Bool | False |

## lessOrEquals

`lessOrEquals(arg1, arg2)`

Checks if the first value is less than or equal to the second value.

In Bicep, use the `<=` operator instead. See [Less than or equal <=](../bicep/operators-comparison.md#less-than-or-equal-).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the less or equals comparison. |
| arg2 |Yes |int or string |The second value for the less or equals comparison. |

### Return value

Returns **True** if the first value is less than or equal to the second value; otherwise, **False**.

### Example

The following example checks if one value is less than or equal to another:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "firstInt": {
      "type": "int",
      "defaultValue": 1
    },
    "secondInt": {
      "type": "int",
      "defaultValue": 2
    },
    "firstString": {
      "type": "string",
      "defaultValue": "A"
    },
    "secondString": {
      "type": "string",
      "defaultValue": "a"
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

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkInts | Bool | True |
| checkStrings | Bool | False |

## Next steps

For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
