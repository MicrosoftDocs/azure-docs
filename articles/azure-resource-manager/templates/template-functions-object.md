---
title: Template functions - objects
description: Describes the functions to use in an Azure Resource Manager template for working with objects.
ms.topic: conceptual
ms.date: 04/27/2020
---
# Object functions for ARM templates

Resource Manager provides several functions for working with objects in your Azure Resource Manager (ARM) template.

* [contains](#contains)
* [empty](#empty)
* [intersection](#intersection)
* [json](#json)
* [length](#length)
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

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/contains.json) shows how to use contains with different types:

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
            "defaultValue": {"one": "a", "two": "b", "three": "c"}
        },
        "arrayToTest": {
            "type": "array",
            "defaultValue": ["one", "two", "three"]
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

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| stringTrue | Bool | True |
| stringFalse | Bool | False |
| objectTrue | Bool | True |
| objectFalse | Bool | False |
| arrayTrue | Bool | True |
| arrayFalse | Bool | False |

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

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/empty.json) checks whether an array, object, and string are empty.

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
| additional arguments |No |array or object |Additional values to use for finding common elements. |

### Return value

An array or object with the common elements.

### Example

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/intersection.json) shows how to use intersection with arrays and objects:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "firstObject": {
            "type": "object",
            "defaultValue": {"one": "a", "two": "b", "three": "c"}
        },
        "secondObject": {
            "type": "object",
            "defaultValue": {"one": "a", "two": "z", "three": "c"}
        },
        "firstArray": {
            "type": "array",
            "defaultValue": ["one", "two", "three"]
        },
        "secondArray": {
            "type": "array",
            "defaultValue": ["two", "three"]
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

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| objectOutput | Object | {"one": "a", "three": "c"} |
| arrayOutput | Array | ["two", "three"] |

## json

`json(arg1)`

Returns a JSON object.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |string |The value to convert to JSON. |

### Return value

The JSON object from the specified string, or an empty object when **null** is specified.

### Remarks

If you need to include a parameter value or variable in the JSON object, use the [concat](template-functions-string.md#concat) function to create the string that you pass to the function.

### Example

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/json.json) shows how to use the json function. Notice that you can either pass in a string that represents the object or use **null** when no value is needed.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "jsonObject1": {
            "type": "string",
            "defaultValue": "null"
        },
        "jsonObject2": {
            "type": "string",
            "defaultValue": "{\"a\": \"b\"}"
        },
        "testValue": {
            "type": "string",
            "defaultValue": "demo value"
        }
    },
    "resources": [
    ],
    "outputs": {
        "jsonOutput1": {
            "type": "bool",
            "value": "[empty(json(parameters('jsonObject1')))]"
        },
        "jsonOutput2": {
            "type": "object",
            "value": "[json(parameters('jsonObject2'))]"
        },
        "paramOutput": {
            "type": "object",
            "value": "[json(concat('{\"a\": \"', parameters('testValue'), '\"}'))]"
        }
    }
}
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| jsonOutput1 | Boolean | True |
| jsonOutput2 | Object | {"a": "b"} |
| paramOutput | Object | {"a": "demo value"}

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

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/length.json) shows how to use length with an array and string:

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

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayLength | Int | 3 |
| stringLength | Int | 13 |
| objectLength | Int | 4 |

## union

`union(arg1, arg2, arg3, ...)`

Returns a single array or object with all elements from the parameters. Duplicate values or keys are only included once.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or object |The first value to use for joining elements. |
| arg2 |Yes |array or object |The second value to use for joining elements. |
| additional arguments |No |array or object |Additional values to use for joining elements. |

### Return value

An array or object.

### Example

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/union.json) shows how to use union with arrays and objects:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "firstObject": {
            "type": "object",
            "defaultValue": {"one": "a", "two": "b", "three": "c1"}
        },
        "secondObject": {
            "type": "object",
            "defaultValue": {"three": "c2", "four": "d", "five": "e"}
        },
        "firstArray": {
            "type": "array",
            "defaultValue": ["one", "two", "three"]
        },
        "secondArray": {
            "type": "array",
            "defaultValue": ["three", "four"]
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

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| objectOutput | Object | {"one": "a", "two": "b", "three": "c2", "four": "d", "five": "e"} |
| arrayOutput | Array | ["one", "two", "three", "four"] |

## Next steps

* For a description of the sections in an Azure Resource Manager template, see [Understand the structure and syntax of ARM templates](template-syntax.md).
