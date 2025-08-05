---
title: Template functions - arrays
description: Describes the functions to use in an Azure Resource Manager template (ARM template) for working with arrays.
ms.topic: reference
ms.custom: devx-track-arm-template
ms.date: 08/01/2025
---

# Array functions for ARM templates

This article describes the template functions for working with arrays.

To get an array of string values delimited by a value, see [split](template-functions-string.md#split).

> [!TIP]
> [Bicep](../bicep/overview.md) is recommended since it offers the same capabilities as ARM templates, and the syntax is easier to use. To learn more, see [`array`](../bicep/bicep-functions-array.md) functions.

## array

`array(convertToArray)`

Converts the value to an array.

In Bicep, use the [`array`](../bicep/bicep-functions-array.md#array) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| convertToArray |Yes |int, string, array, or object |The value to convert to an array. |

### Return value

An array.

### Example

The following example shows how to use the `array` function with different types:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "intToConvert": {
      "type": "int",
      "defaultValue": 1
    },
    "stringToConvert": {
      "type": "string",
      "defaultValue": "efgh"
    },
    "objectToConvert": {
      "type": "object",
      "defaultValue": {
        "a": "b",
        "c": "d"
      }
    }
  },
  "resources": [
  ],
  "outputs": {
    "intOutput": {
      "type": "array",
      "value": "[array(parameters('intToConvert'))]"
    },
    "stringOutput": {
      "type": "array",
      "value": "[array(parameters('stringToConvert'))]"
    },
    "objectOutput": {
      "type": "array",
      "value": "[array(parameters('objectToConvert'))]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| intOutput | Array | [1] |
| stringOutput | Array | ["efgh"] |
| objectOutput | Array | [{"a": "b", "c": "d"}] |

## concat

`concat(arg1, arg2, arg3, ...)`

Combines multiple arrays and returns the concatenated array, or combines multiple string values and returns the concatenated string.

In Bicep, use the [`concat`](../bicep/bicep-functions-array.md#concat) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or string |The first array or string for concatenation. |
| more arguments |No |array or string |More arrays or strings in sequential order for concatenation. |

This function can take any number of arguments and can accept either strings or arrays for the parameters. However, you can't provide both arrays and strings for parameters. Arrays are only concatenated with other arrays.

### Return value

A string or array of concatenated values.

### Example

The following example shows how to combine two arrays:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "firstArray": {
      "type": "array",
      "defaultValue": [
        "1-1",
        "1-2",
        "1-3"
      ]
    },
    "secondArray": {
      "type": "array",
      "defaultValue": [
        "2-1",
        "2-2",
        "2-3"
      ]
    }
  },
  "resources": [
  ],
  "outputs": {
    "return": {
      "type": "array",
      "value": "[concat(parameters('firstArray'), parameters('secondArray'))]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| return | Array | ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3"] |

The following example shows how to combine two string values and return a concatenated string:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "prefix": {
      "type": "string",
      "defaultValue": "prefix"
    }
  },
  "resources": [],
  "outputs": {
    "concatOutput": {
      "type": "string",
      "value": "[concat(parameters('prefix'), '-', uniqueString(resourceGroup().id))]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| concatOutput | String | prefix-5yj4yjf5mbg72 |

## contains

`contains(container, itemToFind)`

Checks if an array contains a value, an object contains a key, or a string contains a substring. The string comparison is case-sensitive. However, when testing if an object contains a key, the comparison is case-insensitive.

In Bicep, use the [`contains`](../bicep/bicep-functions-array.md#contains) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| container |Yes |array, object, or string |The value that contains the value to find. |
| itemToFind |Yes |string or int |The value to find. |

### Return value

**True** if the item is found; otherwise, **False**.

### Example

The following example shows how to use `contains` with different types:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "stringToTest": {
      "type": "string",
      "defaultValue": "OneTwoThree"
    },
    "objectToTest": {
      "type": "object",
      "defaultValue": {
        "one": "a",
        "two": "b",
        "three": "c"
      }
    },
    "arrayToTest": {
      "type": "array",
      "defaultValue": [ "one", "two", "three" ]
    }
  },
  "resources": [
  ],
  "outputs": {
    "stringTrue": {
      "type": "bool",
      "value": "[contains(parameters('stringToTest'), 'e')]"
    },
    "stringFalse": {
      "type": "bool",
      "value": "[contains(parameters('stringToTest'), 'z')]"
    },
    "objectTrue": {
      "type": "bool",
      "value": "[contains(parameters('objectToTest'), 'one')]"
    },
    "objectFalse": {
      "type": "bool",
      "value": "[contains(parameters('objectToTest'), 'a')]"
    },
    "arrayTrue": {
      "type": "bool",
      "value": "[contains(parameters('arrayToTest'), 'three')]"
    },
    "arrayFalse": {
      "type": "bool",
      "value": "[contains(parameters('arrayToTest'), 'four')]"
    }
  }
}
```

The output of default values from the preceding example is:

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

The following example shows how to use `createArray` with different types:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "objectToTest": {
      "type": "object",
      "defaultValue": {
        "one": "a",
        "two": "b",
        "three": "c"
      }
    },
    "arrayToTest": {
      "type": "array",
      "defaultValue": [ "one", "two", "three" ]
    }
  },
  "resources": [
  ],
  "outputs": {
    "stringArray": {
      "type": "array",
      "value": "[createArray('a', 'b', 'c')]"
    },
    "intArray": {
      "type": "array",
      "value": "[createArray(1, 2, 3)]"
    },
    "objectArray": {
      "type": "array",
      "value": "[createArray(parameters('objectToTest'))]"
    },
    "arrayArray": {
      "type": "array",
      "value": "[createArray(parameters('arrayToTest'))]"
    },
    "emptyArray": {
      "type": "array",
      "value": "[createArray()]"
    }
  }
}
```

The output of default values from the preceding example is:

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

In Bicep, use the [`empty`](../bicep/bicep-functions-array.md#empty) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| itemToTest |Yes |array, object, or string |The value to check if it's empty. |

### Return value

Returns **True** if the value is empty; otherwise, **False**.

### Example

The following example checks if an array, object, and string are empty:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "testArray": {
      "type": "array",
      "defaultValue": []
    },
    "testObject": {
      "type": "object",
      "defaultValue": {}
    },
    "testString": {
      "type": "string",
      "defaultValue": ""
    }
  },
  "resources": [
  ],
  "outputs": {
    "arrayEmpty": {
      "type": "bool",
      "value": "[empty(parameters('testArray'))]"
    },
    "objectEmpty": {
      "type": "bool",
      "value": "[empty(parameters('testObject'))]"
    },
    "stringEmpty": {
      "type": "bool",
      "value": "[empty(parameters('testString'))]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayEmpty | Bool | True |
| objectEmpty | Bool | True |
| stringEmpty | Bool | True |

## first

`first(arg1)`

Returns the first element of the array, or first character of the string.

In Bicep, use the [`first`](../bicep/bicep-functions-array.md#first) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or string |The value to retrieve the first element or character. |

### Return value

The type (string, int, array, or object) of the first element in an array, or the first character of a string.

### Example

The following example shows how to use the `first` function with an array and a string:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "arrayToTest": {
      "type": "array",
      "defaultValue": [ "one", "two", "three" ]
    }
  },
  "resources": [
  ],
  "outputs": {
    "arrayOutput": {
      "type": "string",
      "value": "[first(parameters('arrayToTest'))]"
    },
    "stringOutput": {
      "type": "string",
      "value": "[first('One Two Three')]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | String | one |
| stringOutput | String | O |

## indexFromEnd

`indexFromEnd(sourceArray, reverseIndex)`

Returns an element of the array by counting backwards from the end. This is useful when you want to reference elements starting from the end of a list rather than the beginning. The [`tryIndexFromEnd`](#tryindexfromend) function is a safe version of `indexFromEnd`.

In Bicep, use the [Reserved index accessor](../bicep/operators-access.md#reverse-index-accessor) operator.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| sourceArray |Yes |array |The value to retrieve the element by counting backwards from the end. |
| reverseIndex |Yes |integer |The one-based index from the end of the array. |

### Return value

A single element from an array, selected by counting backward from the end of the array.

### Example

The following example shows how to use the `indexFromEnd` function:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "items": [
      "apple",
      "banana",
      "orange",
      "grape"
    ]
  },
  "resources": [],
  "outputs": {
    "secondToLast": {
      "type": "string",
      "value": "[indexFromEnd(variables('items'), 2)]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| secondToLast | String | orange |

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

The following example shows how to use the `indexOf` and `lastIndexOf` functions:

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

In Bicep, use the [`intersection`](../bicep/bicep-functions-array.md#intersection) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or object |The first value to use for finding common elements. |
| arg2 |Yes |array or object |The second value to use for finding common elements. |
| more arguments |No |array or object |More values to use for finding common elements. |

### Return value

An array or object with the common elements.

### Example

The following example shows how to use `intersection` with arrays and objects:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "firstObject": {
      "type": "object",
      "defaultValue": {
        "one": "a",
        "two": "b",
        "three": "c"
      }
    },
    "secondObject": {
      "type": "object",
      "defaultValue": {
        "one": "a",
        "two": "z",
        "three": "c"
      }
    },
    "firstArray": {
      "type": "array",
      "defaultValue": [ "one", "two", "three" ]
    },
    "secondArray": {
      "type": "array",
      "defaultValue": [ "two", "three" ]
    }
  },
  "resources": [
  ],
  "outputs": {
    "objectOutput": {
      "type": "object",
      "value": "[intersection(parameters('firstObject'), parameters('secondObject'))]"
    },
    "arrayOutput": {
      "type": "array",
      "value": "[intersection(parameters('firstArray'), parameters('secondArray'))]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| objectOutput | Object | {"one": "a", "three": "c"} |
| arrayOutput | Array | ["two", "three"] |

## last

`last(arg1)`

Returns the last element of the array, or last character of the string.

In Bicep, use the [`last`](../bicep/bicep-functions-array.md#last) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or string |The value to retrieve the last element or character. |

### Return value

The type (string, int, array, or object) of the last element in an array, or the last character of a string.

### Example

The following example shows how to use the `last` function with an array and a string:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "arrayToTest": {
      "type": "array",
      "defaultValue": [ "one", "two", "three" ]
    }
  },
  "resources": [
  ],
  "outputs": {
    "arrayOutput": {
      "type": "string",
      "value": "[last(parameters('arrayToTest'))]"
    },
    "stringOutput": {
      "type": "string",
      "value": "[last('One Two Three')]"
    }
  }
}
```

The output of default values from the preceding example is:

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

The following example shows how to use the `indexOf` and `lastIndexOf` functions:

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

In Bicep, use the [`length`](../bicep/bicep-functions-array.md#length) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array, string, or object |The array to use for getting the number of elements, the string to use for getting the number of characters, or the object to use for getting the number of root-level properties. |

### Return value

An int.

### Example

The following example shows how to use `length` with an array and a string:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "arrayToTest": {
      "type": "array",
      "defaultValue": [
        "one",
        "two",
        "three"
      ]
    },
    "stringToTest": {
      "type": "string",
      "defaultValue": "One Two Three"
    },
    "objectToTest": {
      "type": "object",
      "defaultValue": {
        "propA": "one",
        "propB": "two",
        "propC": "three",
        "propD": {
          "propD-1": "sub",
          "propD-2": "sub"
        }
      }
    }
  },
  "resources": [],
  "outputs": {
    "arrayLength": {
      "type": "int",
      "value": "[length(parameters('arrayToTest'))]"
    },
    "stringLength": {
      "type": "int",
      "value": "[length(parameters('stringToTest'))]"
    },
    "objectLength": {
      "type": "int",
      "value": "[length(parameters('objectToTest'))]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayLength | Int | 3 |
| stringLength | Int | 13 |
| objectLength | Int | 4 |

You can use this function with an array to specify the number of iterations when creating resources. In the following example, the parameter **siteNames** refers to an array of names to use when creating websites:

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

In Bicep, use the [`max`](../bicep/bicep-functions-array.md#max) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array of integers, or comma-separated list of integers |The collection to get the maximum value. |

### Return value

An int representing the maximum value.

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

In Bicep, use the [`min`](../bicep/bicep-functions-array.md#min) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array of integers, or comma-separated list of integers |The collection to get the minimum value. |

### Return value

An int representing the minimum value.

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

## range

`range(startIndex, count)`

Creates an array of integers from a starting integer and containing a number of items.

In Bicep, use the [`range`](../bicep/bicep-functions-array.md#range) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| startIndex |Yes |int |The first integer in the array. The sum of startIndex and count must be no greater than 2147483647. |
| count |Yes |int |The number of integers in the array. Must be non-negative integer up to 10000. |

### Return value

An array of integers.

### Example

The following example shows how to use the `range` function:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "startingInt": {
      "type": "int",
      "defaultValue": 5
    },
    "numberOfElements": {
      "type": "int",
      "defaultValue": 3
    }
  },
  "resources": [],
  "outputs": {
    "rangeOutput": {
      "type": "array",
      "value": "[range(parameters('startingInt'),parameters('numberOfElements'))]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| rangeOutput | Array | [5, 6, 7] |

## skip

`skip(originalValue, numberToSkip)`

Returns an array with all the elements after the specified number in the array, or returns a string with all the characters after the specified number in the string.

In Bicep, use the [`skip`](../bicep/bicep-functions-array.md#skip) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalValue |Yes |array or string |The array or string to use for skipping. |
| numberToSkip |Yes |int |The number of elements or characters to skip. If this value is 0 or less, all the elements or characters in the value are returned. If it's larger than the length of the array or string, an empty array or string is returned. |

### Return value

An array or string.

### Example

The following example skips the specified number of elements in the array and the specified number of characters in a string:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "testArray": {
      "type": "array",
      "defaultValue": [
        "one",
        "two",
        "three"
      ]
    },
    "elementsToSkip": {
      "type": "int",
      "defaultValue": 2
    },
    "testString": {
      "type": "string",
      "defaultValue": "one two three"
    },
    "charactersToSkip": {
      "type": "int",
      "defaultValue": 4
    }
  },
  "resources": [],
  "outputs": {
    "arrayOutput": {
      "type": "array",
      "value": "[skip(parameters('testArray'),parameters('elementsToSkip'))]"
    },
    "stringOutput": {
      "type": "string",
      "value": "[skip(parameters('testString'),parameters('charactersToSkip'))]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Array | ["three"] |
| stringOutput | String | two three |

## take

`take(originalValue, numberToTake)`

Returns an array or string. An array has the specified number of elements from the start of the array. A string has the specified number of characters from the start of the string.

In Bicep, use the [`take`](../bicep/bicep-functions-array.md#take) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalValue |Yes |array or string |The array or string to take the elements from. |
| numberToTake |Yes |int |The number of elements or characters to take. If this value is 0 or less, an empty array or string is returned. If it's larger than the length of the given array or string, all the elements in the array or string are returned. |

### Return value

An array or string.

### Example

The following example takes the specified number of elements from an array and characters from a string:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "testArray": {
      "type": "array",
      "defaultValue": [
        "one",
        "two",
        "three"
      ]
    },
    "elementsToTake": {
      "type": "int",
      "defaultValue": 2
    },
    "testString": {
      "type": "string",
      "defaultValue": "one two three"
    },
    "charactersToTake": {
      "type": "int",
      "defaultValue": 2
    }
  },
  "resources": [],
  "outputs": {
    "arrayOutput": {
      "type": "array",
      "value": "[take(parameters('testArray'),parameters('elementsToTake'))]"
    },
    "stringOutput": {
      "type": "string",
      "value": "[take(parameters('testString'),parameters('charactersToTake'))]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Array | ["one", "two"] |
| stringOutput | String | on |

## tryGet

`tryGet(itemToTest, keyOrIndex)`

`tryGet` helps you avoid deployment failures when trying to access a non-existent property or index in an object or array. If the specified key or index doesn't exist, `tryGet` returns null instead of throwing an error.

In Bicep, use the [safe-dereference](../bicep/operator-safe-dereference.md#safe-dereference) operator.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| itemToTest |Yes |array, object |An object or array to look into. |
| keyOrIndex |Yes |string, int |A key or index to retrieve from the array or object. A property name for objects or index for arrays.|

### Return value

Returns the value at the key/index if it exists. Returns null if the key/index is missing or out of bounds.

### Example

The following example checks if an array, object, and string are empty:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "languageVersion": "2.0",
  "contentVersion": "1.0.0.0",
  "variables": {
    "users": {
      "name": "John Doe",
      "age": 30
    },
    "colors": [
      "red",
      "green"
    ]
  },
  "resources": [],
  "outputs": {
    "region": {
      "type": "string",
      "nullable": true,
      "value": "[tryGet(variables('users'), 'region')]"
    },
    "name": {
      "type": "string",
      "nullable": true,
      "value": "[tryGet(variables('users'), 'name')]"
    },
    "firstColor": {
      "type": "string",
      "nullable": true,
      "value": "[tryGet(variables('colors'), 0)]"
    }
  }
}
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| region | String | (NULL) |
| name | String | John Doe |
| firstColor | String | Red |

## tryIndexFromEnd

`tryndexFromEnd(sourceArray, reverseIndex)`

The `tryIndexFromEnd` function is a safe version of [`indexFromEnd`](#indexfromend). It retrieves a value from an array by counting backward from the end without throwing an error if the index is out of range.

In Bicep, use the [Reserved index accessor](../bicep/operators-access.md#reverse-index-accessor) operator and the [Safe dereference](../bicep/operator-safe-dereference.md#safe-dereference) operator.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| sourceArray |Yes |array |The value to retrieve the element by counting backwards from the end. |
| reverseIndex |Yes |integer |The one-based index from the end of the array. |

### Return value

If the index is valid (within array bounds), returns the array element at that reverse index. If the index is out of range, returns null instead of throwing an error.

### Example

The following example shows how to use the `tryIndexFromEnd` function:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "items": [
      "apple",
      "banana",
      "orange",
      "grape"
    ]
  },
  "resources": [],
  "outputs": {
    "secondToLast": {
      "type": "string",
      "value": "[tryIndexFromEnd(variables('items'), 2)]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| secondToLast | String | orange |

The following example shows an out-of-bound scenario:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "languageVersion": "2.0",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "items": {
      "type": "array",
      "defaultValue": [
        "apple",
        "banana",
        "orange",
        "grape"
      ]
    }
  },
  "resources": {},
  "outputs": {
    "outOfBound": {
      "type": "string",
      "nullable": true,
      "value": "[tryIndexFromEnd(parameters('items'), 5)]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| outOfBound | String | (null) |

## union

`union(arg1, arg2, arg3, ...)`

Returns a single array or object with all elements from the parameters. For arrays, duplicate values are included once. For objects, duplicate property names are only included once.

In Bicep, use the [`union`](../bicep/bicep-functions-array.md#union) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or object |The first value to use for joining elements. |
| arg2 |Yes |array or object |The second value to use for joining elements. |
| more arguments |No |array or object |More values to use for joining elements. |

### Return value

An array or object.

### Remarks

The `union function` uses the sequence of the parameters to determine the order and values of the result.

For arrays, the function iterates through each element in the first parameter and adds it to the result if it isn't already present. Then, it repeats the process for the second parameter and any more parameters. If a value is already present, its earlier placement in the array is preserved.

For objects, property names and values from the first parameter are added to the result. For later parameters, any new names are added to the result. If a later parameter has a property with the same name, that value overwrites the existing value. The order of the properties isn't guaranteed.

The `union` function not only merges the top-level elements but also recursively merges any nested objects within them. Nested array values aren't merged. See the second example in the following section.

### Example

The following example shows how to use `union` with arrays and objects:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "firstObject": {
      "type": "object",
      "defaultValue": {
        "one": "a",
        "two": "b",
        "three": "c1"
      }
    },
    "secondObject": {
      "type": "object",
      "defaultValue": {
        "three": "c2",
        "four": "d",
        "five": "e"
      }
    },
    "firstArray": {
      "type": "array",
      "defaultValue": [ "one", "two", "three" ]
    },
    "secondArray": {
      "type": "array",
      "defaultValue": [ "three", "four" ]
    }
  },
  "resources": [
  ],
  "outputs": {
    "objectOutput": {
      "type": "object",
      "value": "[union(parameters('firstObject'), parameters('secondObject'))]"
    },
    "arrayOutput": {
      "type": "array",
      "value": "[union(parameters('firstArray'), parameters('secondArray'))]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| objectOutput | Object | {"one": "a", "two": "b", "three": "c2", "four": "d", "five": "e"} |
| arrayOutput | Array | ["one", "two", "three", "four"] |

The following example shows the deep merge capability:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "firstObject": {
      "property": {
        "one": "a",
        "two": "b",
        "three": "c1"
      },
      "nestedArray": [
        1,
        2
      ]
    },
    "secondObject": {
      "property": {
        "three": "c2",
        "four": "d",
        "five": "e"
      },
      "nestedArray": [
        3,
        4
      ]
    },
    "firstArray": [
      [
        "one",
        "two"
      ],
      [
        "three"
      ]
    ],
    "secondArray": [
      [
        "three"
      ],
      [
        "four",
        "two"
      ]
    ]
  },
  "resources": [],
  "outputs": {
    "objectOutput": {
      "type": "Object",
      "value": "[union(variables('firstObject'), variables('secondObject'))]"
    },
    "arrayOutput": {
      "type": "Array",
      "value": "[union(variables('firstArray'), variables('secondArray'))]"
    }
  }
}
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| objectOutput | Object |{"property":{"one":"a","two":"b","three":"c2","four":"d","five":"e"},"nestedArray":[3,4]}|
| arrayOutput | Array |[["one","two"],["three"],["four","two"]]|

If nested arrays were merged, then the value of **objectOutput.nestedArray** is [1, 2, 3, 4], and the value of **arrayOutput** is [["one", "two", "three"], ["three", "four", "two"]].

## Next steps

* For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
