---
title: Template functions - arrays
description: Describes the functions to use in an Azure Resource Manager template (ARM template) for working with arrays.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 05/22/2023
---

# Array functions for ARM templates

This article describes the template functions for working with arrays.

To get an array of string values delimited by a value, see [split](template-functions-string.md#split).

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [array](../bicep/bicep-functions-array.md) functions.

## array

`array(convertToArray)`

Converts the value to an array.

In Bicep, use the [array](../bicep/bicep-functions-array.md#array) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| convertToArray |Yes |int, string, array, or object |The value to convert to an array. |

### Return value

An array.

### Example

The following example shows how to use the array function with different types.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/array.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| intOutput | Array | [1] |
| stringOutput | Array | ["efgh"] |
| objectOutput | Array | [{"a": "b", "c": "d"}] |

## concat

`concat(arg1, arg2, arg3, ...)`

Combines multiple arrays and returns the concatenated array, or combines multiple string values and returns the concatenated string.

In Bicep, use the [concat](../bicep/bicep-functions-array.md#concat) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or string |The first array or string for concatenation. |
| more arguments |No |array or string |More arrays or strings in sequential order for concatenation. |

This function can take any number of arguments, and can accept either strings or arrays for the parameters. However, you can't provide both arrays and strings for parameters. Arrays are only concatenated with other arrays.

### Return value

A string or array of concatenated values.

### Example

The following example shows how to combine two arrays.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/concat-array.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| return | Array | ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3"] |

The following example shows how to combine two string values and return a concatenated string.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/string/concat-string.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| concatOutput | String | prefix-5yj4yjf5mbg72 |

## contains

`contains(container, itemToFind)`

Checks whether an array contains a value, an object contains a key, or a string contains a substring. The string comparison is case-sensitive. However, when testing if an object contains a key, the comparison is case-insensitive.

In Bicep, use the [contains](../bicep/bicep-functions-array.md#contains) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| container |Yes |array, object, or string |The value that contains the value to find. |
| itemToFind |Yes |string or int |The value to find. |

### Return value

**True** if the item is found; otherwise, **False**.

### Example

The following example shows how to use contains with different types:

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/contains.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| stringTrue | Bool | True |
| stringFalse | Bool | False |
| objectTrue | Bool | True |
| objectFalse | Bool | False |
| arrayTrue | Bool | True |
| arrayFalse | Bool | False |

## createArray

`createArray(arg1, arg2, arg3, ...)`

Creates an array from the parameters.

In Bicep, the `createArray` function isn't supported. To construct an array, see the Bicep [array](../bicep/data-types.md#arrays) data type.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| args |No |String, Integer, Array, or Object |The values in the array. |

### Return value

An array. When no parameters are provided, it returns an empty array.

### Example

The following example shows how to use createArray with different types:

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/createarray.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| stringArray | Array | ["a", "b", "c"] |
| intArray | Array | [1, 2, 3] |
| objectArray | Array | [{"one": "a", "two": "b", "three": "c"}] |
| arrayArray | Array | [["one", "two", "three"]] |
| emptyArray | Array | [] |

## empty

`empty(itemToTest)`

Determines if an array, object, or string is empty.

In Bicep, use the [empty](../bicep/bicep-functions-array.md#empty) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| itemToTest |Yes |array, object, or string |The value to check if it's empty. |

### Return value

Returns **True** if the value is empty; otherwise, **False**.

### Example

The following example checks whether an array, object, and string are empty.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/empty.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayEmpty | Bool | True |
| objectEmpty | Bool | True |
| stringEmpty | Bool | True |

## first

`first(arg1)`

Returns the first element of the array, or first character of the string.

In Bicep, use the [first](../bicep/bicep-functions-array.md#first) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or string |The value to retrieve the first element or character. |

### Return value

The type (string, int, array, or object) of the first element in an array, or the first character of a string.

### Example

The following example shows how to use the first function with an array and string.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/first.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | String | one |
| stringOutput | String | O |

## indexOf

`indexOf(arrayToSearch, itemToFind)`

Returns an integer for the index of the first occurrence of an item in an array. The comparison is **case-sensitive** for strings.

### Parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| arrayToSearch | Yes | array | The array to use for finding the index of the searched item. |
| itemToFind | Yes | int, string, array, or object | The item to find in the array. |

### Return value

An integer representing the first index of the item in the array. The index is zero-based. If the item isn't found, -1 is returned.

### Examples

The following example shows how to use the indexOf and lastIndexOf functions:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "names": [
      "one",
      "two",
      "three"
    ],
    "numbers": [
      4,
      5,
      6
    ],
    "collection": [
      "[variables('names')]",
      "[variables('numbers')]"
    ],
    "duplicates": [
      1,
      2,
      3,
      1
    ]
  },
  "resources": [],
  "outputs": {
    "index1": {
      "type": "int",
      "value": "[lastIndexOf(variables('names'), 'two')]"
    },
    "index2": {
      "type": "int",
      "value": "[indexOf(variables('names'), 'one')]"
    },
    "notFoundIndex1": {
      "type": "int",
      "value": "[lastIndexOf(variables('names'), 'Three')]"
    },
    "index3": {
      "type": "int",
      "value": "[lastIndexOf(variables('numbers'), 4)]"
    },
    "index4": {
      "type": "int",
      "value": "[indexOf(variables('numbers'), 6)]"
    },
    "notFoundIndex2": {
      "type": "int",
      "value": "[lastIndexOf(variables('numbers'), '5')]"
    },
    "index5": {
      "type": "int",
      "value": "[indexOf(variables('collection'), variables('numbers'))]"
    },
    "index6": {
      "type": "int",
      "value": "[indexOf(variables('duplicates'), 1)]"
    },
    "index7": {
      "type": "int",
      "value": "[lastIndexOf(variables('duplicates'), 1)]"
    }
  }
}
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| index1 |int | 1 |
| index2 | int | 0 |
| index3 | int | 0 |
| index4 | int | 2 |
| index5 | int | 1 |
| index6 | int | 0 |
| index7 | int | 3 |
| notFoundIndex1 | int | -1 |
| notFoundIndex2 | int | -1 |

## intersection

`intersection(arg1, arg2, arg3, ...)`

Returns a single array or object with the common elements from the parameters.

In Bicep, use the [intersection](../bicep/bicep-functions-array.md#intersection) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or object |The first value to use for finding common elements. |
| arg2 |Yes |array or object |The second value to use for finding common elements. |
| more arguments |No |array or object |More values to use for finding common elements. |

### Return value

An array or object with the common elements.

### Example

The following example shows how to use intersection with arrays and objects.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/intersection.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| objectOutput | Object | {"one": "a", "three": "c"} |
| arrayOutput | Array | ["two", "three"] |

## last

`last(arg1)`

Returns the last element of the array, or last character of the string.

In Bicep, use the [last](../bicep/bicep-functions-array.md#last) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or string |The value to retrieve the last element or character. |

### Return value

The type (string, int, array, or object) of the last element in an array, or the last character of a string.

### Example

The following example shows how to use the last function with an array and string.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/last.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | String | three |
| stringOutput | String | e |

## lastIndexOf

`lastIndexOf(arrayToSearch, itemToFind)`

Returns an integer for the index of the last occurrence of an item in an array. The comparison is **case-sensitive** for strings.

### Parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| arrayToSearch | Yes | array | The array to use for finding the index of the searched item. |
| itemToFind | Yes | int, string, array, or object | The item to find in the array. |

### Return value

An integer representing the last index of the item in the array. The index is zero-based. If the item isn't found, -1 is returned.

### Examples

The following example shows how to use the indexOf and lastIndexOf functions:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "names": [
      "one",
      "two",
      "three"
    ],
    "numbers": [
      4,
      5,
      6
    ],
    "collection": [
      "[variables('names')]",
      "[variables('numbers')]"
    ],
    "duplicates": [
      1,
      2,
      3,
      1
    ]
  },
  "resources": [],
  "outputs": {
    "index1": {
      "type": "int",
      "value": "[lastIndexOf(variables('names'), 'two')]"
    },
    "index2": {
      "type": "int",
      "value": "[indexOf(variables('names'), 'one')]"
    },
    "notFoundIndex1": {
      "type": "int",
      "value": "[lastIndexOf(variables('names'), 'Three')]"
    },
    "index3": {
      "type": "int",
      "value": "[lastIndexOf(variables('numbers'), 4)]"
    },
    "index4": {
      "type": "int",
      "value": "[indexOf(variables('numbers'), 6)]"
    },
    "notFoundIndex2": {
      "type": "int",
      "value": "[lastIndexOf(variables('numbers'), '5')]"
    },
    "index5": {
      "type": "int",
      "value": "[indexOf(variables('collection'), variables('numbers'))]"
    },
    "index6": {
      "type": "int",
      "value": "[indexOf(variables('duplicates'), 1)]"
    },
    "index7": {
      "type": "int",
      "value": "[lastIndexOf(variables('duplicates'), 1)]"
    }
  }
}
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| index1 |int | 1 |
| index2 | int | 0 |
| index3 | int | 0 |
| index4 | int | 2 |
| index5 | int | 1 |
| index6 | int | 0 |
| index7 | int | 3 |
| notFoundIndex1 | int | -1 |
| notFoundIndex2 | int | -1 |

## length

`length(arg1)`

Returns the number of elements in an array, characters in a string, or root-level properties in an object.

In Bicep, use the [length](../bicep/bicep-functions-array.md#length) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array, string, or object |The array to use for getting the number of elements, the string to use for getting the number of characters, or the object to use for getting the number of root-level properties. |

### Return value

An int.

### Example

The following example shows how to use length with an array and string.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/length.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayLength | Int | 3 |
| stringLength | Int | 13 |
| objectLength | Int | 4 |

You can use this function with an array to specify the number of iterations when creating resources. In the following example, the parameter **siteNames** would refer to an array of names to use when creating the web sites.

```json
"copy": {
  "name": "websitescopy",
  "count": "[length(parameters('siteNames'))]"
}
```

For more information about using this function with an array, see [Resource iteration in ARM templates](copy-resources.md).

## max

`max(arg1)`

Returns the maximum value from an array of integers or a comma-separated list of integers.

In Bicep, use the [max](../bicep/bicep-functions-array.md#max) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array of integers, or comma-separated list of integers |The collection to get the maximum value. |

### Return value

An int representing the maximum value.

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

In Bicep, use the [min](../bicep/bicep-functions-array.md#min) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array of integers, or comma-separated list of integers |The collection to get the minimum value. |

### Return value

An int representing the minimum value.

### Example

The following example shows how to use min with an array and a list of integers.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/numeric/min.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Int | 0 |
| intOutput | Int | 0 |

## range

`range(startIndex, count)`

Creates an array of integers from a starting integer and containing a number of items.

In Bicep, use the [range](../bicep/bicep-functions-array.md#range) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| startIndex |Yes |int |The first integer in the array. The sum of startIndex and count must be no greater than 2147483647. |
| count |Yes |int |The number of integers in the array. Must be non-negative integer up to 10000. |

### Return value

An array of integers.

### Example

The following example shows how to use the range function.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/range.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| rangeOutput | Array | [5, 6, 7] |

## skip

`skip(originalValue, numberToSkip)`

Returns an array with all the elements after the specified number in the array, or returns a string with all the characters after the specified number in the string.

In Bicep, use the [skip](../bicep/bicep-functions-array.md#skip) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalValue |Yes |array or string |The array or string to use for skipping. |
| numberToSkip |Yes |int |The number of elements or characters to skip. If this value is 0 or less, all the elements or characters in the value are returned. If it's larger than the length of the array or string, an empty array or string is returned. |

### Return value

An array or string.

### Example

The following example skips the specified number of elements in the array, and the specified number of characters in a string.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/skip.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Array | ["three"] |
| stringOutput | String | two three |

## take

`take(originalValue, numberToTake)`

Returns an array or string. An array has the specified number of elements from the start of the array. A string has the specified number of characters from the start of the string.

In Bicep, use the [take](../bicep/bicep-functions-array.md#take) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalValue |Yes |array or string |The array or string to take the elements from. |
| numberToTake |Yes |int |The number of elements or characters to take. If this value is 0 or less, an empty array or string is returned. If it's larger than the length of the given array or string, all the elements in the array or string are returned. |

### Return value

An array or string.

### Example

The following example takes the specified number of elements from the array, and characters from a string.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/take.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Array | ["one", "two"] |
| stringOutput | String | on |

## union

`union(arg1, arg2, arg3, ...)`

Returns a single array or object with all elements from the parameters. For arrays, duplicate values are included once. For objects, duplicate property names are only included once.

In Bicep, use the [union](../bicep/bicep-functions-array.md#union) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or object |The first value to use for joining elements. |
| arg2 |Yes |array or object |The second value to use for joining elements. |
| more arguments |No |array or object |More values to use for joining elements. |

### Return value

An array or object.

### Remarks

The union function uses the sequence of the parameters to determine the order and values of the result.

For arrays, the function iterates through each element in the first parameter and adds it to the result if it isn't already present. Then, it repeats the process for the second parameter and any more parameters. If a value is already present, its earlier placement in the array is preserved.

For objects, property names and values from the first parameter are added to the result. For later parameters, any new names are added to the result. If a later parameter has a property with the same name, that value overwrites the existing value. The order of the properties isn't guaranteed.

### Example

The following example shows how to use union with arrays and objects.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/union.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| objectOutput | Object | {"one": "a", "two": "b", "three": "c2", "four": "d", "five": "e"} |
| arrayOutput | Array | ["one", "two", "three", "four"] |

## Next steps

* For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
