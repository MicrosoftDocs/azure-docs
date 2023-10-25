---
title: Template functions - comparison
description: Describes the functions to use in an Azure Resource Manager template (ARM template) to compare values.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 05/22/2023
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
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see the [coalesce](../bicep/operators-logical.md) logical operator and [comparison](../bicep/operators-comparison.md) operators.

## coalesce

`coalesce(arg1, arg2, arg3, ...)`

Returns first non-null value from the parameters. Empty strings, empty arrays, and empty objects are not null.

In Bicep, use the `??` operator instead. See [Coalesce ??](../bicep/operators-logical.md#coalesce-).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int, string, array, or object |The first value to test for null. |
| more args |No |int, string, array, or object | More values to test for null. |

### Return value

The value of the first non-null parameters, which can be a string, int, array, or object. Null if all parameters are null.

### Example

The following example template shows the output from different uses of coalesce.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/comparison/coalesce.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| stringOutput | String | default |
| intOutput | Int | 1 |
| objectOutput | Object | {"first": "default"} |
| arrayOutput | Array | [1] |
| emptyOutput | Bool | True |

## equals

`equals(arg1, arg2)`

Checks whether two values equal each other.

In Bicep, use the `==` operator instead. See [Equals ==](../bicep/operators-comparison.md#equals-).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int, string, array, or object |The first value to check for equality. |
| arg2 |Yes |int, string, array, or object |The second value to check for equality. |

### Return value

Returns **True** if the values are equal; otherwise, **False**.

### Remarks

The equals function is often used with the `condition` element to test whether a resource is deployed.

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

The following example checks different types of values for equality. All the default values return True.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/comparison/equals.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkInts | Bool | True |
| checkStrings | Bool | True |
| checkArrays | Bool | True |
| checkObjects | Bool | True |

The following example template uses [not](template-functions-logical.md#not) with **equals**.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/logical/not-equals.json":::

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkNotEquals | Bool | True |

## greater

`greater(arg1, arg2)`

Checks whether the first value is greater than the second value.

In Bicep, use the `>` operator instead. See [Greater than >](../bicep/operators-comparison.md#greater-than-).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the greater comparison. |
| arg2 |Yes |int or string |The second value for the greater comparison. |

### Return value

Returns **True** if the first value is greater than the second value; otherwise, **False**.

### Example

The following example checks whether the one value is greater than the other.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/comparison/greater.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkInts | Bool | False |
| checkStrings | Bool | True |

## greaterOrEquals

`greaterOrEquals(arg1, arg2)`

Checks whether the first value is greater than or equal to the second value.

In Bicep, use the `>=` operator instead. See [Greater than or equal >=](../bicep/operators-comparison.md#greater-than-or-equal-).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the greater or equal comparison. |
| arg2 |Yes |int or string |The second value for the greater or equal comparison. |

### Return value

Returns **True** if the first value is greater than or equal to the second value; otherwise, **False**.

### Example

The following example checks whether the one value is greater than or equal to the other.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/comparison/greaterorequals.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkInts | Bool | False |
| checkStrings | Bool | True |

## less

`less(arg1, arg2)`

Checks whether the first value is less than the second value.

In Bicep, use the `<` operator instead. See [Less than <](../bicep/operators-comparison.md#less-than-).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the less comparison. |
| arg2 |Yes |int or string |The second value for the less comparison. |

### Return value

Returns **True** if the first value is less than the second value; otherwise, **False**.

### Example

The following example checks whether the one value is less than the other.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/comparison/less.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkInts | Bool | True |
| checkStrings | Bool | False |

## lessOrEquals

`lessOrEquals(arg1, arg2)`

Checks whether the first value is less than or equal to the second value.

In Bicep, use the `<=` operator instead. See [Less than or equal <=](../bicep/operators-comparison.md#less-than-or-equal-).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the less or equals comparison. |
| arg2 |Yes |int or string |The second value for the less or equals comparison. |

### Return value

Returns **True** if the first value is less than or equal to the second value; otherwise, **False**.

### Example

The following example checks whether the one value is less than or equal to the other.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/comparison/lessorequals.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkInts | Bool | True |
| checkStrings | Bool | False |

## Next steps

* For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
