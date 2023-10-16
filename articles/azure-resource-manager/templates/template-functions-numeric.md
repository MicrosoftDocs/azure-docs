---
title: Template functions - numeric
description: Describes the functions to use in an Azure Resource Manager template (ARM template) to work with numbers.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 05/22/2023
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
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more about using `int`, `min`, and `max` in Bicep, see [numeric](../bicep/bicep-functions-numeric.md) functions. For other numeric values, see [numeric](../bicep/operators-numeric.md) operators.

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

The following example adds two parameters.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/numeric/add.json":::

The output from the preceding example with the default values is:

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

The **loopName** property enables you to specify whether copyIndex is referring to a resource iteration or property iteration. If no value is provided for **loopName**, the current resource type iteration is used. Provide a value for **loopName** when iterating on a property.

For more information about using copy, see:

* [Resource iteration in ARM templates](copy-resources.md)
* [Property iteration in ARM templates](copy-properties.md)
* [Variable iteration in ARM templates](copy-variables.md)
* [Output iteration in ARM templates](copy-outputs.md)

### Example

The following example shows a copy loop and the index value included in the name.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/numeric/copyindex.json":::

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
| operand2 |Yes |int |The number that is used to divide. Can't be 0. |

### Return value

An integer representing the division.

### Example

The following example divides one parameter by another parameter.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/numeric/div.json":::

The output from the preceding example with the default values is:

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

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/numeric/float.json":::

## int

`int(valueToConvert)`

Converts the specified value to an integer.

In Bicep, use the [int](../bicep/bicep-functions-numeric.md#int) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| valueToConvert |Yes |string or int |The value to convert to an integer. |

### Return value

An integer of the converted value.

### Example

The following example template converts the user-provided parameter value to integer.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/numeric/int.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| intResult | Int | 4 |

## max

`max(arg1)`

Returns the maximum value from an array of integers or a comma-separated list of integers.

In Bicep, use the [max](../bicep/bicep-functions-numeric.md#max) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array of integers, or comma-separated list of integers |The collection to get the maximum value. |

### Return value

An integer representing the maximum value from the collection.

### Example

The following example shows how to use max with an array and a list of integers.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/numeric/max.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Int | 5 |
| intOutput | Int | 5 |

## min

`min(arg1)`

Returns the minimum value from an array of integers or a comma-separated list of integers.

In Bicep, use the [min](../bicep/bicep-functions-numeric.md#min) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array of integers, or comma-separated list of integers |The collection to get the minimum value. |

### Return value

An integer representing minimum value from the collection.

### Example

The following example shows how to use min with an array and a list of integers.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/numeric/min.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Int | 0 |
| intOutput | Int | 0 |

## mod

`mod(operand1, operand2)`

Returns the remainder of the integer division using the two provided integers.

The `mod` function isn't supported in Bicep. Use the [% operator](../bicep/operators-numeric.md#modulo-) instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| operand1 |Yes |int |The number being divided. |
| operand2 |Yes |int |The number that is used to divide, Can't be 0. |

### Return value

An integer representing the remainder.

### Example

The following example returns the remainder of dividing one parameter by another parameter.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/numeric/mod.json":::

The output from the preceding example with the default values is:

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

The following example multiplies one parameter by another parameter.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/numeric/mul.json":::

The output from the preceding example with the default values is:

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
| operand1 |Yes |int |The number that is subtracted from. |
| operand2 |Yes |int |The number that is subtracted. |

### Return value

An integer representing the subtraction.

### Example

The following example subtracts one parameter from another parameter.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/numeric/sub.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| subResult | Int | 4 |

## Next steps

* For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
* To iterate a specified number of times when creating a type of resource, see [Resource iteration in ARM templates](copy-resources.md).
