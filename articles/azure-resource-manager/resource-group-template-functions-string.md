---
title: Azure Resource Manager template functions - string | Microsoft Docs
description: Describes the functions to use in an Azure Resource Manager template to work with strings.
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
ms.date: 04/26/2017
ms.author: tomfitz

---
# String functions for Azure Resource Manager templates

Resource Manager provides the following functions for working with strings:

* [base64](#base64)
* [base64ToJson](#base64tojson)
* [base64ToString](#base64tostring)
* [bool](#bool)
* [concat](#concat)
* [contains](#contains)
* [dataUri](#datauri)
* [dataUriToString](#datauritostring)
* [empty](#empty)
* [endsWith](#endswith)
* [first](#first)
* [indexOf](#indexof)
* [last](#last)
* [lastIndexOf](#lastindexof)
* [length](#length)
* [padLeft](#padleft)
* [replace](#replace)
* [skip](#skip)
* [split](#split)
* [startsWith](resource-group-template-functions-string.md#startswith)
* [string](#string)
* [substring](#substring)
* [take](#take)
* [toLower](#tolower)
* [toUpper](#toupper)
* [trim](#trim)
* [uniqueString](#uniquestring)
* [uri](#uri)
* [uriComponent](resource-group-template-functions-string.md#uricomponent)
* [uriComponentToString](resource-group-template-functions-string.md#uricomponenttostring)

<a id="base64" />

## base64
`base64(inputString)`

Returns the base64 representation of the input string.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputString |Yes |string |The value to return as a base64 representation. |

### Examples

The following example shows how to use the base64 function.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "stringData": {
            "type": "string",
            "defaultValue": "one, two, three"
        },
        "jsonFormattedData": {
            "type": "string",
            "defaultValue": "{'one': 'a', 'two': 'b'}"
        }
    },
    "variables": {
        "base64String": "[base64(parameters('stringData'))]",
        "base64Object": "[base64(parameters('jsonFormattedData'))]"
    },
    "resources": [
    ],
    "outputs": {
        "base64Output": {
            "type": "string",
            "value": "[variables('base64String')]"
        },
        "toStringOutput": {
            "type": "string",
            "value": "[base64ToString(variables('base64String'))]"
        },
        "toJsonOutput": {
            "type": "object",
            "value": "[base64ToJson(variables('base64Object'))]"
        }
    }
}
```

### Return value

A string containing the base64 representation.

<a id="base64tojson" />

## base64ToJson
`base64tojson`

Converts a base64 representation to a JSON object.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| base64Value |Yes |string |The base64 representation to convert to a JSON object. |

### Examples

The following example uses the base64ToJson function to convert a base64 value:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "stringData": {
            "type": "string",
            "defaultValue": "one, two, three"
        },
        "jsonFormattedData": {
            "type": "string",
            "defaultValue": "{'one': 'a', 'two': 'b'}"
        }
    },
    "variables": {
        "base64String": "[base64(parameters('stringData'))]",
        "base64Object": "[base64(parameters('jsonFormattedData'))]"
    },
    "resources": [
    ],
    "outputs": {
        "base64Output": {
            "type": "string",
            "value": "[variables('base64String')]"
        },
        "toStringOutput": {
            "type": "string",
            "value": "[base64ToString(variables('base64String'))]"
        },
        "toJsonOutput": {
            "type": "object",
            "value": "[base64ToJson(variables('base64Object'))]"
        }
    }
}
```

### Return value

A JSON object.

<a id="base64tostring" />

## base64ToString
`base64ToString(base64Value)`

Converts a base64 representation to a string.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| base64Value |Yes |string |The base64 representation to convert to a string. |

### Examples

The following example uses the base64ToString function to convert a base64 value:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "stringData": {
            "type": "string",
            "defaultValue": "one, two, three"
        },
        "jsonFormattedData": {
            "type": "string",
            "defaultValue": "{'one': 'a', 'two': 'b'}"
        }
    },
    "variables": {
        "base64String": "[base64(parameters('stringData'))]",
        "base64Object": "[base64(parameters('jsonFormattedData'))]"
    },
    "resources": [
    ],
    "outputs": {
        "base64Output": {
            "type": "string",
            "value": "[variables('base64String')]"
        },
        "toStringOutput": {
            "type": "string",
            "value": "[base64ToString(variables('base64String'))]"
        },
        "toJsonOutput": {
            "type": "object",
            "value": "[base64ToJson(variables('base64Object'))]"
        }
    }
}
```

### Return value

A string of the converted base64 value.

<a id="bool" />

## bool
`bool(arg1)`

Converts the parameter to a boolean.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |string or int |The value to convert to a boolean. |

### Examples

The following example shows how to use bool with a string or integer.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [],
    "outputs": {
        "trueString": {
            "value": "[bool('true')]",
            "type" : "bool"
        },
        "falseString": {
            "value": "[bool('false')]",
            "type" : "bool"
        },
        "trueInt": {
            "value": "[bool(1)]",
            "type" : "bool"
        },
        "falseInt": {
            "value": "[bool(0)]",
            "type" : "bool"
        }
    }
}
```

### Return value
A boolean.

<a id="concat" />

## concat
`concat (arg1, arg2, arg3, ...)`

Combines multiple string values and returns the concatenated string, or combines multiple arrays and returns the concatenated array.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |string or array |The first value for concatenation. |
| additional arguments |No |String |Additional values in sequential order for concatenation. |

### Examples

The following example shows how to combine two string values and return a concatenated string.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
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
            "value": "[concat(parameters('prefix'), uniqueString(resourceGroup().id))]",
            "type" : "string"
        }
    }
}
```

The following example shows how to combine two arrays.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
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

### Return value
A string or array of concatenated values.

<a id="contains" />

## contains
`contains (container, itemToFind)`

Checks whether an array contains a value, an object contains a key, or a string contains a substring.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| container |Yes |array, object, or string |The value that contains the value to find. |
| itemToFind |Yes |string or int |The value to find. |

### Examples

The following example shows how to use contains with different types:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
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

### Return value

**True** if the item is found; otherwise, **False**.

<a id="datauri" />

## dataUri
`dataUri(stringToConvert)`

Converts a value to a data URI.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToConvert |Yes |string |The value to convert to a data URI. |

### Examples

The following example converts a value to a data URI, and converts a data URI to a string:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "stringToTest": {
            "type": "string",
            "defaultValue": "Hello"
        },
        "dataFormattedString": {
            "type": "string",
            "defaultValue": "data:;base64,SGVsbG8sIFdvcmxkIQ=="
        }
    },
    "resources": [],
    "outputs": {
        "dataUriOutput": {
            "value": "[dataUri(parameters('stringToTest'))]",
            "type" : "string"
        },
        "toStringOutput": {
            "type": "string",
            "value": "[dataUriToString(parameters('dataFormattedString'))]"
        }
    }
}
```

### Return value

A string formatted as a data URI.

<a id="datauritostring" />

## dataUriToString
`dataUriToString(dataUriToConvert)`

Converts a data URI formatted value to a string.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| dataUriToConvert |Yes |string |The data URI value to convert. |

### Examples

The following example converts a value to a data URI, and converts a data URI to a string:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "stringToTest": {
            "type": "string",
            "defaultValue": "Hello"
        },
        "dataFormattedString": {
            "type": "string",
            "defaultValue": "data:;base64,SGVsbG8sIFdvcmxkIQ=="
        }
    },
    "resources": [],
    "outputs": {
        "dataUriOutput": {
            "value": "[dataUri(parameters('stringToTest'))]",
            "type" : "string"
        },
        "toStringOutput": {
            "type": "string",
            "value": "[dataUriToString(parameters('dataFormattedString'))]"
        }
    }
}
```

### Return value

A string containing the converted value.

<a id="empty" /> 

## empty
`empty(itemToTest)`

Determines if an array, object, or string is empty.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| itemToTest |Yes |array, object, or string |The value to check if it is empty. |

### Examples

The following example checks whether an array, object, and string are empty.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
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

### Return value

Returns **True** if the value is empty; otherwise, **False**.

<a id="endswith" />

## endsWith
`endsWith(stringToSearch, stringToFind)`

Determines whether a string ends with a value. The comparison is case-insensitive.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToSearch |Yes |string |The value that contains the item to find. |
| stringToFind |Yes |string |The value to find. |

### Examples

The following example shows how to use the startsWith and endsWith functions:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [],
    "outputs": {
        "startsTrue": {
            "value": "[startsWith('abcdef', 'ab')]",
            "type" : "bool"
        },
        "startsCapTrue": {
            "value": "[startsWith('abcdef', 'A')]",
            "type" : "bool"
        },
        "startsFalse": {
            "value": "[startsWith('abcdef', 'e')]",
            "type" : "bool"
        },
        "endsTrue": {
            "value": "[endsWith('abcdef', 'ef')]",
            "type" : "bool"
        },
        "endsCapTrue": {
            "value": "[endsWith('abcdef', 'F')]",
            "type" : "bool"
        },
        "endsFalse": {
            "value": "[endsWith('abcdef', 'e')]",
            "type" : "bool"
        }
    }
}
```

### Return value

**True** if the last character or characters of the string match the value; otherwise, **False**.

<a id="first" />

## first
`first(arg1)`

Returns the first character of the string, or first element of the array.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or string |The value to retrieve the first element or character. |

### Examples

The following example shows how to use the first function with an array and string.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "arrayToTest": {
            "type": "array",
            "defaultValue": ["one", "two", "three"]
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

### Return value

A string of the first character, or the type (string, int, array, or object) of the first element in an array.

<a id="indexof" />

## indexOf
`indexOf(stringToSearch, stringToFind)`

Returns the first position of a value within a string. The comparison is case-insensitive.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToSearch |Yes |string |The value that contains the item to find. |
| stringToFind |Yes |string |The value to find. |

### Examples

The following example shows how to use the indexOf and lastIndexOf functions:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [],
    "outputs": {
        "firstT": {
            "value": "[indexOf('test', 't')]",
            "type" : "int"
        },
        "lastT": {
            "value": "[lastIndexOf('test', 't')]",
            "type" : "int"
        },
        "firstString": {
            "value": "[indexOf('abcdef', 'CD')]",
            "type" : "int"
        },
        "lastString": {
            "value": "[lastIndexOf('abcdef', 'AB')]",
            "type" : "int"
        },
        "notFound": {
            "value": "[indexOf('abcdef', 'z')]",
            "type" : "int"
        }
    }
}
```

### Return value

An integer that represents the position of the item to find. The value is zero-based. If the item is not found, -1 is returned.


<a id="last" />

## last
`last (arg1)`

Returns last character of the string, or the last element of the array.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or string |The value to retrieve the last element or character. |

### Examples

The following example shows how to use the last function with an array and string.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "arrayToTest": {
            "type": "array",
            "defaultValue": ["one", "two", "three"]
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

### Return value

A string of the last character, or the type (string, int, array, or object) of the last element in an array.

<a id="lastindexof" />

## lastIndexOf
`lastIndexOf(stringToSearch, stringToFind)`

Returns the last position of a value within a string. The comparison is case-insensitive.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToSearch |Yes |string |The value that contains the item to find. |
| stringToFind |Yes |string |The value to find. |

### Examples

The following example shows how to use the indexOf and lastIndexOf functions:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [],
    "outputs": {
        "firstT": {
            "value": "[indexOf('test', 't')]",
            "type" : "int"
        },
        "lastT": {
            "value": "[lastIndexOf('test', 't')]",
            "type" : "int"
        },
        "firstString": {
            "value": "[indexOf('abcdef', 'CD')]",
            "type" : "int"
        },
        "lastString": {
            "value": "[lastIndexOf('abcdef', 'AB')]",
            "type" : "int"
        },
        "notFound": {
            "value": "[indexOf('abcdef', 'z')]",
            "type" : "int"
        }
    }
}
```

### Return value

An integer that represents the last position of the item to find. The value is zero-based. If the item is not found, -1 is returned.


<a id="length" />

## length
`length(string)`

Returns the number of characters in a string, or elements in an array.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or string |The array to use for getting the number of elements, or the string to use for getting the number of characters. |

### Examples

The following example shows how to use length with an array and string:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
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
        }
    }
}
```

### Return value

An int. 

<a id="padleft" />

## padLeft
`padLeft(valueToPad, totalLength, paddingCharacter)`

Returns a right-aligned string by adding characters to the left until reaching the total specified length.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| valueToPad |Yes |string or int |The value to right-align. |
| totalLength |Yes |int |The total number of characters in the returned string. |
| paddingCharacter |No |Single character |The character to use for left-padding until the total length is reached. The default value is a space. |

### Examples

The following example shows how to pad the user-provided parameter value by adding the zero character until the string reaches 10 characters. If the original parameter value is longer than 10 characters, no characters are added.

```json
"parameters": {
    "appName": { "type": "string" }
},
"variables": { 
    "paddedAppName": "[padLeft(parameters('appName'),10,'0')]"
}
```

<a id="replace" />

## replace
`replace(originalString, oldCharacter, newCharacter)`

Returns a new string with all instances of one character in the specified string replaced by another character.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalString |Yes |string |The value that has all instances of one character replaced by another character. |
| oldCharacter |Yes |string |The character to be removed from the original string. |
| newCharacter |Yes |string |The character to add in place of the removed character. |

### Examples

The following example shows how to remove all dashes from the user-provided string.

```json
"parameters": {
    "identifier": { "type": "string" }
},
"variables": { 
    "newidentifier": "[replace(parameters('identifier'),'-','')]"
}
```

<a id="skip" />

## skip
`skip(originalValue, numberToSkip)`

Returns a string with all the characters after the specified number in the string.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalValue |Yes |string |The string to use for skipping. |
| numberToSkip |Yes |int |The number of characters to skip. If this value is 0 or less, all the characters in the string are returned. If it is larger than the length of the string, an empty string is returned. |

For an example of using skip with an array, see [skip - array](#skip).

### Examples

The following example skips the specified number of characters in the string.

```json
"parameters": {
  "first": {
    "type": "string",
    "metadata": {
      "description": "Value to use for skipping"
    }
  },
  "second": {
    "type": "int",
    "metadata": {
      "description": "Number of characters to skip"
    }
  }
},
"resources": [
],
"outputs": {
  "return": {
    "type": "string",
    "value": "[skip(parameters('first'),parameters('second'))]"
  }
}
```

<a id="split" />

## split
`split(inputString, delimiterString)`

`split(inputString, delimiterArray)`

Returns an array of strings that contains the substrings of the input string that are delimited by the specified delimiters.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputString |Yes |String |The string to split. |
| delimiter |Yes |String or Array of strings |The delimiter to use for splitting the string. |

### Examples

The following example splits the input string with a comma.

```json
"parameters": {
    "inputString": { "type": "string" }
},
"variables": { 
    "stringPieces": "[split(parameters('inputString'), ',')]"
}
```

The next example splits the input string with either a comma or a semi-colon.

```json
"variables": {
  "stringToSplit": "test1,test2;test3",
  "delimiters": [ ",", ";" ]
},
"resources": [ ],
"outputs": {
  "exampleOutput": {
    "value": "[split(variables('stringToSplit'), variables('delimiters'))]",
    "type": "array"
  }
}
```

<a id="startswith" />

## startsWith
`startsWith(stringToSearch, stringToFind)`

Determines whether a string starts with a value. The comparison is case-insensitive.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToSearch |Yes |string |The value that contains the item to find. |
| stringToFind |Yes |string |The value to find. |

### Examples

The following example shows how to use the startsWith and endsWith functions:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [],
    "outputs": {
        "startsTrue": {
            "value": "[startsWith('abcdef', 'ab')]",
            "type" : "bool"
        },
        "startsCapTrue": {
            "value": "[startsWith('abcdef', 'A')]",
            "type" : "bool"
        },
        "startsFalse": {
            "value": "[startsWith('abcdef', 'e')]",
            "type" : "bool"
        },
        "endsTrue": {
            "value": "[endsWith('abcdef', 'ef')]",
            "type" : "bool"
        },
        "endsCapTrue": {
            "value": "[endsWith('abcdef', 'F')]",
            "type" : "bool"
        },
        "endsFalse": {
            "value": "[endsWith('abcdef', 'e')]",
            "type" : "bool"
        }
    }
}
```

### Return value

**True** if the first character or characters of the string match the value; otherwise, **False**.


<a id="string" />

## string
`string(valueToConvert)`

Converts the specified value to a string.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| valueToConvert |Yes | Any |The value to convert to string. Any type of value can be converted, including objects and arrays. |

### Examples

The following example converts the user-provided parameter values to strings.

```json
"parameters": {
  "jsonObject": {
    "type": "object",
    "defaultValue": {
      "valueA": 10,
      "valueB": "Example Text"
    }
  },
  "jsonArray": {
    "type": "array",
    "defaultValue": [ "a", "b", "c" ]
  },
  "jsonInt": {
    "type": "int",
    "defaultValue": 5
  }
},
"variables": { 
  "objectString": "[string(parameters('jsonObject'))]",
  "arrayString": "[string(parameters('jsonArray'))]",
  "intString": "[string(parameters('jsonInt'))]"
}
```

<a id="substring" />

## substring
`substring(stringToParse, startIndex, length)`

Returns a substring that starts at the specified character position and contains the specified number of characters.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToParse |Yes |string |The original string from which the substring is extracted. |
| startIndex |No |int |The zero-based starting character position for the substring. |
| length |No |int |The number of characters for the substring. Must refer to a location within the string. |

### Examples

The following example extracts the first three characters from a parameter.

```json
"parameters": {
    "inputString": { "type": "string" }
},
"variables": { 
    "prefix": "[substring(parameters('inputString'), 0, 3)]"
}
```

The following example will fail with the error "The index and length parameters must refer to a location within the string. The index parameter: '0', the length parameter: '11', the length of the string parameter: '10'.".

```json
"parameters": {
    "inputString": { "type": "string", "value": "1234567890" }
},
"variables": { 
    "prefix": "[substring(parameters('inputString'), 0, 11)]"
}
```

<a id="take" />

## take
`take(originalValue, numberToTake)`

Returns a string with the specified number of characters from the start of the string.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalValue |Yes |string |The value to take the characters from. |
| numberToTake |Yes |int |The number of characters to take. If this value is 0 or less, an empty string is returned. If it is larger than the length of the given string, all the characters in the string are returned. |

For an example of using take with an array, see [take - array](#take).

### Examples

The following example takes the specified number of characters from the string.

```json
"parameters": {
  "first": {
    "type": "string",
    "metadata": {
      "description": "Value to use for taking"
    }
  },
  "second": {
    "type": "int",
    "metadata": {
      "description": "Number of characters to take"
    }
  }
},
"resources": [
],
"outputs": {
  "return": {
    "type": "string",
    "value": "[take(parameters('first'), parameters('second'))]"
  }
}
```

<a id="tolower" />

## toLower
`toLower(stringToChange)`

Converts the specified string to lower case.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToChange |Yes |string |The value to convert to lower case. |

### Examples

The following example converts the user-provided parameter value to lower case.

```json
"parameters": {
    "appName": { "type": "string" }
},
"variables": { 
    "lowerCaseAppName": "[toLower(parameters('appName'))]"
}
```

<a id="toupper" />

## toUpper
`toUpper(stringToChange)`

Converts the specified string to upper case.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToChange |Yes |string |The value to convert to upper case. |

### Examples

The following example converts the user-provided parameter value to upper case.

```json
"parameters": {
    "appName": { "type": "string" }
},
"variables": { 
    "upperCaseAppName": "[toUpper(parameters('appName'))]"
}
```

<a id="trim" />

## trim
`trim (stringToTrim)`

Removes all leading and trailing white-space characters from the specified string.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToTrim |Yes |string |The value to trim. |

### Examples

The following example trims the white-space characters from the user-provided parameter value.

```json
"parameters": {
    "appName": { "type": "string" }
},
"variables": { 
    "trimAppName": "[trim(parameters('appName'))]"
}
```

<a id="uniquestring" />

## uniqueString
`uniqueString (baseString, ...)`

Creates a deterministic hash string based on the values provided as parameters. 

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| baseString |Yes |string |The value used in the hash function to create a unique string. |
| additional parameters as needed |No |string |You can add as many strings as needed to create the value that specifies the level of uniqueness. |

### Remarks

This function is helpful when you need to create a unique name for a resource. You provide parameter values that limit the scope of uniqueness for the result. You can specify whether the name is unique down to subscription, resource group, or deployment. 

The returned value is not a random string, but rather the result of a hash function. The returned value is 13 characters long. It is not globally unique. You may want to combine the value with a prefix from your naming convention to create a name that is meaningful. The following example shows the format of the returned value. The actual value varies by the provided parameters.

    tcvhiyu5h2o5o

### Examples

The following examples show how to use uniqueString to create a unique value for commonly used levels.

Unique scoped to subscription

```json
"[uniqueString(subscription().subscriptionId)]"
```

Unique scoped to resource group

```json
"[uniqueString(resourceGroup().id)]"
```

Unique scoped to deployment for a resource group

```json
"[uniqueString(resourceGroup().id, deployment().name)]"
```

The following example shows how to create a unique name for a storage account based on your resource group. Inside the resource group, the name is not unique if constructed the same way.

```json
"resources": [{ 
    "name": "[concat('storage', uniqueString(resourceGroup().id))]", 
    "type": "Microsoft.Storage/storageAccounts", 
    ...
```

### Return value

A string containing 13 characters

<a id="uri" />

## uri
`uri (baseUri, relativeUri)`

Creates an absolute URI by combining the baseUri and the relativeUri string.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| baseUri |Yes |string |The base uri string. |
| relativeUri |Yes |string |The relative uri string to add to the base uri string. |

The value for the **baseUri** parameter can include a specific file, but only the base path is used when constructing the URI. For example, passing `http://contoso.com/resources/azuredeploy.json` as the baseUri parameter results in a base URI of `http://contoso.com/resources/`.

### Examples

The following example shows how to construct a link to a nested template based on the value of the parent template.

```json
"templateLink": "[uri(deployment().properties.templateLink.uri, 'nested/azuredeploy.json')]"
```

The following example show how to use uri, uriComponent, and uriComponentToString:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {
        "uriFormat": "[uri('http://contoso.com/resources/', 'nested/azuredeploy.json')]",
        "uriEncoded": "[uriComponent(variables('uriFormat'))]" 
    },
    "resources": [
    ],
    "outputs": {
        "uriOutput": {
            "type": "string",
            "value": "[variables('uriFormat')]"
        },
        "componentOutput": {
            "type": "string",
            "value": "[variables('uriEncoded')]"
        },
        "toStringOutput": {
            "type": "string",
            "value": "[uriComponentToString(variables('uriEncoded'))]"
        }
    }
}
```

### Return value

A string representing the absolute URI for the base and relative values.

<a id="uricomponent" />

## uriComponent
`uricomponent(stringToEncode)`

Encodes a URI.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToEncode |Yes |string |The value to URI encode. |

### Examples

The following example show how to use uri, uriComponent, and uriComponentToString:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {
        "uriFormat": "[uri('http://contoso.com/resources/', 'nested/azuredeploy.json')]",
        "uriEncoded": "[uriComponent(variables('uriFormat'))]" 
    },
    "resources": [
    ],
    "outputs": {
        "uriOutput": {
            "type": "string",
            "value": "[variables('uriFormat')]"
        },
        "componentOutput": {
            "type": "string",
            "value": "[variables('uriEncoded')]"
        },
        "toStringOutput": {
            "type": "string",
            "value": "[uriComponentToString(variables('uriEncoded'))]"
        }
    }
}
```

### Return value

A string of the URI encoded value.

<a id="uricomponenttostring" />

## uriComponentToString
`uriComponentToString(uriEncodedString)`

Returns a string of a URI encoded value.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| uriEncodedString |Yes |string |The URI encoded value to convert to a string. |

### Examples

The following example show how to use uri, uriComponent, and uriComponentToString:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {
        "uriFormat": "[uri('http://contoso.com/resources/', 'nested/azuredeploy.json')]",
        "uriEncoded": "[uriComponent(variables('uriFormat'))]" 
    },
    "resources": [
    ],
    "outputs": {
        "uriOutput": {
            "type": "string",
            "value": "[variables('uriFormat')]"
        },
        "componentOutput": {
            "type": "string",
            "value": "[variables('uriEncoded')]"
        },
        "toStringOutput": {
            "type": "string",
            "value": "[uriComponentToString(variables('uriEncoded'))]"
        }
    }
}
```

### Return value

A decoded string of URI encoded value.

## Next Steps
* For a description of the sections in an Azure Resource Manager template, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
* To merge multiple templates, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).
* To iterate a specified number of times when creating a type of resource, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).
* To see how to deploy the template you have created, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md).

