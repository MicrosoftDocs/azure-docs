---
title: Template functions - objects
description: Describes the functions to use in an Azure Resource Manager template (ARM template) for working with objects.
ms.topic: conceptual
ms.date: 09/09/2021
---

# Object functions for ARM templates

Resource Manager provides several functions for working with objects in your Azure Resource Manager template (ARM template):

* [contains](#contains)
* [createObject](#createobject)
* [empty](#empty)
* [intersection](#intersection)
* [json](#json)
* [length](#length)
* [null](#null)
* [union](#union)

## contains

`contains(container, itemToFind)`

Checks whether an array contains a value, an object contains a key, or a string contains a substring. The string comparison is case-sensitive. However, when testing if an object contains a key, the comparison is case-insensitive.

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

## createObject

`createObject(key1, value1, key2, value2, ...)`

Creates an object from the keys and values.

The `createObject` function isn't supported by Bicep.  Construct an object by using `{}`. See [Objects](../bicep/data-types.md#objects).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| key1 |No |string |The name of the key. |
| value1 |No |int, boolean, string, object, or array |The value for the key. |
| more keys |No |string |More names of the keys. |
| more values |No |int, boolean, string, object, or array |More values for the keys. |

The function only accepts an even number of parameters. Each key must have a matching value.

### Return value

An object with each key and value pair.

### Example

The following example creates an object from different types of values.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/object/createobject.json":::

The output from the preceding example with the default values is an object named `newObject` with the following value:

```json
{
  "intProp": 1,
  "stringProp": "abc",
  "boolProp": true,
  "arrayProp": ["a", "b", "c"],
  "objectProp": {"key1": "value1"}
}
```

## empty

`empty(itemToTest)`

Determines if an array, object, or string is empty.

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

## intersection

`intersection(arg1, arg2, arg3, ...)`

Returns a single array or object with the common elements from the parameters.

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

<a id="json"></a>

## json

`json(arg1)`

Converts a valid JSON string into a JSON data type.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |string |The value to convert to JSON. The string must be a properly formatted JSON string. |

### Return value

The JSON data type from the specified string, or an empty value when **null** is specified.

### Remarks

If you need to include a parameter value or variable in the JSON object, use the [concat](template-functions-string.md#concat) function to create the string that you pass to the function.

You can also use [null()](#null) to get a null value.

### Example

The following example shows how to use the `json` function. Notice that you can pass in `null` for an empty object.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/object/json.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| emptyObjectOutput | Boolean | True |
| objectOutput | Object | {"a": "b"} |
| stringOutput | String | test |
| booleanOutput | Boolean | True |
| intOutput | Integer | 3 |
| arrayOutput | Array | [ 1, 2, 3 ] |
| concatObjectOutput | Object | { "a": "demo value" } |

## length

`length(arg1)`

Returns the number of elements in an array, characters in a string, or root-level properties in an object.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array, string, or object |The array to use for getting the number of elements, the string to use for getting the number of characters, or the object to use for getting the number of root-level properties. |

### Return value

An int.

### Example

The following example shows how to use length with an array and string:

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/length.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayLength | Int | 3 |
| stringLength | Int | 13 |
| objectLength | Int | 4 |

## null

`null()`

Returns null.

The `null` function isn't available in Bicep. Use the `null` keyword instead.

### Parameters

The null function doesn't accept any parameters.

### Return value

A value that is always null.

### Example

The following example uses the null function.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/object/null.json":::

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| emptyOutput | Bool | True |

## union

`union(arg1, arg2, arg3, ...)`

Returns a single array or object with all elements from the parameters. For arrays, duplicate values are included once. For objects, duplicate property names are only included once.

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

For arrays, the function iterates through each element in the first parameter and adds it to the result if it isn't already present. Then, it repeats the process for the second parameter and any additional parameters. If a value is already present, it's earlier placement in the array is preserved.

For objects, property names and values from the first parameter are added to the result. For later parameters, any new names are added to the result. If a later parameter has a property with the same name, that value overwrites the existing value. The order of the properties isn't guaranteed.

### Example

The following example shows how to use union with arrays and objects:

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/array/union.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| objectOutput | Object | {"one": "a", "two": "b", "three": "c2", "four": "d", "five": "e"} |
| arrayOutput | Array | ["one", "two", "three", "four"] |

## Next steps

* For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
