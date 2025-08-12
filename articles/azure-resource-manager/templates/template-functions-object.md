---
title: Template functions - objects
description: Describes the functions to use in an Azure Resource Manager template (ARM template) for working with objects.
ms.topic: reference
ms.custom: devx-track-arm-template
ms.date: 08/01/2025
---

# Object functions for ARM templates

Resource Manager provides several functions for working with objects in your Azure Resource Manager template (ARM template):

* [contains](#contains)
* [createObject](#createobject)
* [empty](#empty)
* [intersection](#intersection)
* [items](#items)
* [json](#json)
* [length](#length)
* [null](#null)
* [union](#union)

> [!TIP]
> [Bicep](../bicep/overview.md) is recommended since it offers the same capabilities as ARM templates, and the syntax is easier to use. To learn more, see [object](../bicep/bicep-functions-object.md) functions.

## contains

`contains(container, itemToFind)`

Checks if an array contains a value, an object contains a key, or a string contains a substring. The string comparison is case-sensitive. However, when testing if an object contains a key, the comparison is case-insensitive.

In Bicep, use the [`contains`](../bicep/bicep-functions-object.md#contains) function.

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

## createObject

`createObject(key1, value1, key2, value2, ...)`

Creates an object from the keys and values.

The `createObject` function isn't supported by Bicep. Construct an object by using `{}`. See [Objects](../bicep/data-types.md#objects).

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

The following example creates an object from different types of values:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
  ],
  "outputs": {
    "newObject": {
      "type": "object",
      "value": "[createObject('intProp', 1, 'stringProp', 'abc', 'boolProp', true(), 'arrayProp', createArray('a', 'b', 'c'), 'objectProp', createObject('key1', 'value1'))]"
    }
  }
}
```

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

In Bicep, use the [`empty`](../bicep/bicep-functions-object.md#empty) function.

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

## intersection

`intersection(arg1, arg2, arg3, ...)`

Returns a single array or object with common elements from the parameters.

In Bicep, use the [`intersection`](../bicep/bicep-functions-object.md#intersection) function.

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

## items

`items(object)`

Converts a dictionary object to an array. See [toObject](template-functions-lambda.md#toobject) about converting an array to an object.

In Bicep, use the [`items`](../bicep/bicep-functions-object.md#items) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| object |Yes |object |The dictionary object to convert to an array. |

### Return value

An array of objects for the converted dictionary. Each object in the array has a `key` property that contains the key value for the dictionary. Each object also has a `value` property that contains the properties for the object.

### Example

The following example converts a dictionary object to an array, creating a new object with modified values for each object in the array:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "copy": [
      {
        "name": "modifiedListOfEntities",
        "count": "[length(items(variables('entities')))]",
        "input": {
          "key": "[items(variables('entities'))[copyIndex('modifiedListOfEntities')].key]",
          "fullName": "[items(variables('entities'))[copyIndex('modifiedListOfEntities')].value.displayName]",
          "itemEnabled": "[items(variables('entities'))[copyIndex('modifiedListOfEntities')].value.enabled]"
        }
      }
    ],
    "entities": {
      "item002": {
        "enabled": false,
        "displayName": "Example item 2",
        "number": 200
      },
      "item001": {
        "enabled": true,
        "displayName": "Example item 1",
        "number": 300
      }
    }
  },
  "resources": [],
  "outputs": {
    "modifiedResult": {
      "type": "array",
      "value": "[variables('modifiedListOfEntities')]"
    }
  }
}
```

The preceding example returns:

```json
"modifiedResult": {
  "type": "Array",
  "value": [
    {
      "fullName": "Example item 1",
      "itemEnabled": true,
      "key": "item001"
    },
    {
      "fullName": "Example item 2",
      "itemEnabled": false,
      "key": "item002"
    }
  ]
}
```

The following example shows the array that the `items` function returns:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "entities": {
      "item002": {
        "enabled": false,
        "displayName": "Example item 2",
        "number": 200
      },
      "item001": {
        "enabled": true,
        "displayName": "Example item 1",
        "number": 300
      }
    },
    "entitiesArray": "[items(variables('entities'))]"
  },
  "resources": [],
  "outputs": {
    "itemsResult": {
      "type": "array",
      "value": "[variables('entitiesArray')]"
    }
  }
}
```

The example returns:

```json
"itemsResult": {
  "type": "Array",
  "value": [
    {
      "key": "item001",
      "value": {
        "displayName": "Example item 1",
        "enabled": true,
        "number": 300
      }
    },
    {
      "key": "item002",
      "value": {
        "displayName": "Example item 2",
        "enabled": false,
        "number": 200
      }
    }
  ]
}
```

[!INCLUDE [JSON object ordering](../../../includes/resource-manager-object-ordering-arm-template.md)]

<a id="json"></a>

## json

`json(arg1)`

Converts a valid JSON string into a JSON data type.

In Bicep, use the [`json`](../bicep/bicep-functions-object.md#json) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |string |The value to convert to JSON. The string must be a properly formatted JSON string. |

### Return value

The JSON data type from the specified string, or an empty value when **null** is specified.

### Remarks

If you need to include a parameter value or variable in the JSON object, use the [`format`](template-functions-string.md#format) function to create the string that you pass to the function.

You can also use [`null()`](#null) to get a null value.

### Example

The following example shows how to use the `json` function. Notice that you can pass in `null` for an empty object:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "jsonEmptyObject": {
      "type": "string",
      "defaultValue": "null"
    },
    "jsonObject": {
      "type": "string",
      "defaultValue": "{\"a\": \"b\"}"
    },
    "jsonString": {
      "type": "string",
      "defaultValue": "\"test\""
    },
    "jsonBoolean": {
      "type": "string",
      "defaultValue": "true"
    },
    "jsonInt": {
      "type": "string",
      "defaultValue": "3"
    },
    "jsonArray": {
      "type": "string",
      "defaultValue": "[[1,2,3 ]"
    },
    "concatValue": {
      "type": "string",
      "defaultValue": "demo value"
    }
  },
  "resources": [
  ],
  "outputs": {
    "emptyObjectOutput": {
      "type": "bool",
      "value": "[empty(json(parameters('jsonEmptyObject')))]"
    },
    "objectOutput": {
      "type": "object",
      "value": "[json(parameters('jsonObject'))]"
    },
    "stringOutput": {
      "type": "string",
      "value": "[json(parameters('jsonString'))]"
    },
    "booleanOutput": {
      "type": "bool",
      "value": "[json(parameters('jsonBoolean'))]"
    },
    "intOutput": {
      "type": "int",
      "value": "[json(parameters('jsonInt'))]"
    },
    "arrayOutput": {
      "type": "array",
      "value": "[json(parameters('jsonArray'))]"
    },
    "concatObjectOutput": {
      "type": "object",
      "value": "[json(concat('{\"a\": \"', parameters('concatValue'), '\"}'))]"
    }
  }
}
```

The output of default values from the preceding example is:

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

In Bicep, use the [`length`](../bicep/bicep-functions-object.md#length) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array, string, or object |The array to use for getting the number of elements, the string to use for getting the number of characters, or the object to use for getting the number of root-level properties. |

### Return value

An int.

### Example

The following example shows how to use `length` with an array and string:

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

## null

`null()`

Returns null.

The `null` function isn't available in Bicep. Use the `null` keyword instead.

### Parameters

The `null` function doesn't accept any parameters.

### Return value

A value that's always null.

### Example

The following example uses the `null` function:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [],
  "outputs": {
    "emptyOutput": {
      "type": "bool",
      "value": "[empty(null())]"
    }
  }
}
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| emptyOutput | Bool | True |

## objectKeys

`objectKeys(object)`

Returns the keys from an object, where an object is a collection of key-value pairs.

In Bicep, use the [`objectKeys`](../templates/template-functions-object.md#objectkeys) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| object |Yes |object |The object, which is a collection of key-value pairs. |

### Return value

An array.

### Example

The following example shows how to use `objectKeys` with an object:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "obj": {
      "a": 1,
      "b": 2
    }
  },
  "resources": [],
  "outputs": {
    "keyArray": {
      "type": "array",
      "value": "[objectKeys(variables('obj'))]"
    }
  }
}
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| keyArray | Array | [ "a", "b" ] |

[!INCLUDE [JSON object ordering](../../../includes/resource-manager-object-ordering-arm-template.md)]

## shallowMerge

`shallowMerge(inputArray)`

Combines an array of objects where only the top-level objects are merged. This means that if the objects being merged contain nested objects, those nested object aren't deeply merged; instead, they're replaced entirely by the corresponding property from the merging object.

In Bicep, use the [`shallowMerge`](../bicep/bicep-functions-object.md#shallowmerge) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |An array of objects. |

### Return value

An object.

### Example

The following example shows how to use `shallowMerge`:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "firstArray": [
      {
        "one": "a"
      },
      {
        "two": "b"
      },
      {
        "two": "c"
      }
    ],
    "secondArray": [
      {
        "one": "a",
        "nested": {
          "a": 1,
          "nested": {
            "c": 3
          }
        }
      },
      {
        "two": "b",
        "nested": {
          "b": 2
        }
      }
    ]
  },
  "resources": [],
  "outputs": {
    "firstOutput": {
      "type": "object",
      "value": "[shallowMerge(variables('firstArray'))]"
    },
    "secondOutput": {
      "type": "object",
      "value": "[shallowMerge(variables('secondArray'))]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| firstOutput | object | {"one":"a","two":"c"}|
| secondOutput | object | {"one":"a","nested":{"b":2},"two":"b"} |

**firstOutput** shows the properties from the merging objects are combined into a new object. If there are conflicting properties (i.e., properties with the same name), the property from the last object being merged usually takes precedence.

**secondOutput** shows the shallow merge doesn't recursively merge these nested objects. Instead, the entire nested object is replaced by the corresponding property from the merging object.

## tryGet

`tryGet(itemToTest, keyOrIndex)`

`tryGet` helps you avoid deployment failures when trying to access a nonexistent property or index in an object or array. If the specified key or index doesn't exist, `tryGet` returns null instead of throwing an error.

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

## union

`union(arg1, arg2, arg3, ...)`

Returns a single array or object with all elements from the parameters. For arrays, duplicate values are included once. For objects, duplicate property names are only included once.

In Bicep, use the [`union`](../bicep/bicep-functions-object.md#union) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or object |The first value to use for joining elements. |
| arg2 |Yes |array or object |The second value to use for joining elements. |
| more arguments |No |array or object |More values to use for joining elements. |

### Return value

An array or object.

### Remarks

The `union` function uses the sequence of the parameters to determine the order and values of the result.

For arrays, the function iterates through each element in the first parameter and adds it to the result if it isn't already present. Then, it repeats the process for the second parameter and any other parameters. If a value is already present, its earlier placement in the array is preserved.

For objects, property names and values from the first parameter are added to the result. For later parameters, any new names are added to the result. If a later parameter has a property with the same name, that value overwrites the existing value. The order of the properties isn't guaranteed.

The `union` function not only merges the top-level elements but also recursively merges any nested arrays and objects within them. See the second example in the following section.

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

If nested arrays were merged, then the value of **objectOutput.nestedArray** would be [1, 2, 3, 4], and the value of **arrayOutput** would be [["one", "two", "three"], ["three", "four", "two"]].

## Next steps

For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
