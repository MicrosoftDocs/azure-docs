---
title: Bicep functions - objects
description: Describes the functions to use in a Bicep file for working with objects.
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 02/12/2025
---

# Object functions for Bicep

This article describes the Bicep functions for working with objects.

## contains

`contains(container, itemToFind)`

Checks whether an array contains a value, an object contains a key, or a string contains a substring. The string comparison is case-sensitive. However, when testing if an object contains a key, the comparison is case-insensitive.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| container |Yes |array, object, or string |The value that contains the value to find. |
| itemToFind |Yes |string or int |The value to find. |

### Return value

**True** if the item is found; otherwise, **False**.

### Example

The following example shows how to use `contains` with different types:

```bicep
param stringToTest string = 'OneTwoThree'
param objectToTest object = {
  one: 'a'
  two: 'b'
  three: 'c'
}
param arrayToTest array = [
  'one'
  'two'
  'three'
]

output stringTrue bool = contains(stringToTest, 'e')
output stringFalse bool = contains(stringToTest, 'z')
output objectTrue bool = contains(objectToTest, 'one')
output objectFalse bool = contains(objectToTest, 'a')
output arrayTrue bool = contains(arrayToTest, 'three')
output arrayFalse bool = contains(arrayToTest, 'four')
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

Determines if an array, object, or string is empty or null.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| itemToTest |Yes |array, object, or string |The value to check if it's empty or null. |

### Return value

Returns **True** if the value is empty or null; otherwise, **False**.

### Example

The following example checks whether an array, object, and string are empty or null.

```bicep
param testArray array = []
param testObject object = {}
param testString string = ''
param testNullString string?

output arrayEmpty bool = empty(testArray)
output objectEmpty bool = empty(testObject)
output stringEmpty bool = empty(testString)
output stringNull bool = empty(testNullString)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayEmpty | Bool | True |
| objectEmpty | Bool | True |
| stringEmpty | Bool | True |
| stringNull | Bool | True |

## intersection

`intersection(arg1, arg2, arg3, ...)`

Returns a single array or object with the common elements from the parameters.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or object |The first value to use for finding common elements. |
| arg2 |Yes |array or object |The second value to use for finding common elements. |
| additional arguments |No |array or object |More values to use for finding common elements. |

### Return value

An array or object with the common elements.

### Example

The following example shows how to use `intersection` with arrays and objects:

```bicep
param firstObject object = {
  one: 'a'
  two: 'b'
  three: 'c'
}
param secondObject object = {
  one: 'a'
  two: 'z'
  three: 'c'
}
param firstArray array = [
  'one'
  'two'
  'three'
]
param secondArray array = [
  'two'
  'three'
]

output objectOutput object = intersection(firstObject, secondObject)
output arrayOutput array = intersection(firstArray, secondArray)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| objectOutput | Object | {"one": "a", "three": "c"} |
| arrayOutput | Array | ["two", "three"] |

## items

`items(object)`

Converts a dictionary object to an array. See [toObject](bicep-functions-lambda.md#toobject) about converting an array to an object.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| object |Yes |object |The dictionary object to convert to an array. |

### Return value

An array of objects for the converted dictionary. Each object in the array has a `key` property that contains the key value for the dictionary. Each object also has a `value` property that contains the properties for the object.

### Example

The following example converts a dictionary object to an array. For each object in the array, it creates a new object with modified values.

```bicep
var entities = {
  item002: {
    enabled: false
    displayName: 'Example item 2'
    number: 200
  }
  item001: {
    enabled: true
    displayName: 'Example item 1'
    number: 300
  }
}

var modifiedListOfEntities = [for entity in items(entities): {
  key: entity.key
  fullName: entity.value.displayName
  itemEnabled: entity.value.enabled
}]

output modifiedResult array = modifiedListOfEntities
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

The following example shows the array that is returned from the items function.

```bicep
var entities = {
  item002: {
    enabled: false
    displayName: 'Example item 2'
    number: 200
  }
  item001: {
    enabled: true
    displayName: 'Example item 1'
    number: 300
  }
}

var entitiesArray = items(entities)

output itemsResult array = entitiesArray
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

[!INCLUDE [JSON object ordering](../../../includes/resource-manager-object-ordering-bicep.md)]

<a id="json"></a>

## json

`json(arg1)`

Converts a valid JSON string into a JSON data type.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |string |The value to convert to JSON. The string must be a properly formatted JSON string. |

### Return value

The JSON data type from the specified string, or an empty value when **null** is specified.

### Remarks

If you need to include a parameter value or variable in the JSON object, use the [concat](./bicep-functions-string.md#concat) function to create the string that you pass to the function.

### Example

The following example shows how to use the `json` function. Notice that you can pass in **null** for an empty object.

```bicep
param jsonEmptyObject string = 'null'
param jsonObject string = '{\'a\': \'b\'}'
param jsonString string = '\'test\''
param jsonBoolean string = 'true'
param jsonInt string = '3'
param jsonArray string = '[[1,2,3]]'
param concatValue string = 'demo value'

output emptyObjectOutput bool = empty(json(jsonEmptyObject))
output objectOutput object = json(jsonObject)
output stringOutput string =json(jsonString)
output booleanOutput bool = json(jsonBoolean)
output intOutput int = json(jsonInt)
output arrayOutput array = json(jsonArray)
output concatObjectOutput object = json(concat('{"a": "', concatValue, '"}'))
```

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

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array, string, or object |The array to use for getting the number of elements, the string to use for getting the number of characters, or the object to use for getting the number of root-level properties. |

### Return value

An int.

### Example

The following example shows how to use `length` with an array and string:

```bicep
param arrayToTest array = [
  'one'
  'two'
  'three'
]
param stringToTest string = 'One Two Three'
param objectToTest object = {
  propA: 'one'
  propB: 'two'
  propC: 'three'
  propD: {
      'propD-1': 'sub'
      'propD-2': 'sub'
  }
}

output arrayLength int = length(arrayToTest)
output stringLength int = length(stringToTest)
output objectLength int = length(objectToTest)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayLength | Int | 3 |
| stringLength | Int | 13 |
| objectLength | Int | 4 |

## objectKeys

`objectKeys(object)`

Returns the keys from an object, where an object is a collection of key-value pairs.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| object |Yes |object |The object, which is a collection of key-value pairs. |

### Return value

An array.

### Example

The following example shows how to use `objectKeys` with an object:

```bicep
var obj = { a: 1, b: 2 }

output keyArray array = objectKeys(obj)
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| keyArray | Array | [ "a", "b" ] |

**keyArray** returns a list of keys of the input object.

[!INCLUDE [JSON object ordering](../../../includes/resource-manager-object-ordering-bicep.md)]

## shallowMerge

`shallowMerge(inputArray)`

Combines an array of objects, where only the top-level objects are merged. This means that if the objects being merged contain nested objects, those nested object aren't deeply merged. Instead, they're replaced entirely by the corresponding property from the merging object.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |An array of objects. |

### Return value

An object.

### Example

The following example shows how to use `shallowMerge`:

```bicep
var firstArray = [{ one: 'a' }, { two: 'b' }, { two: 'c'}]
var secondArray = [{ one: 'a', nested: {a: 1, nested: {c: 3}} }, { two: 'b', nested: {b: 2}}]

output firstOutput object = shallowMerge(firstArray)
output secondOutput object = shallowMerge(secondArray)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| firstOutput | object | {"one":"a","two":"c"}|
| secondOutput | object | {"one":"a","nested":{"b":2},"two":"b"} |

**firstOutput** shows the properties from the merging objects are combined into a new object. If there are conflicting properties (that is, properties with the same name), the property from the last object being merged usually takes precedence.

**secondOutput** shows the shallow merge doesn't recursively merge these nested objects. Instead, the entire nested object is replaced by the corresponding property from the merging object.

## union

`union(arg1, arg2, arg3, ...)`

Returns a single array or object with all elements from the parameters. For arrays, duplicate values are included once. For objects, duplicate property names are only included once.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or object |The first value to use for joining elements. |
| arg2 |Yes |array or object |The second value to use for joining elements. |
| additional arguments |No |array or object |More values to use for joining elements. |

### Return value

An array or object.

### Remarks

The union function uses the sequence of the parameters to determine the order and values of the result.

For arrays, the function iterates through each element in the first parameter and adds it to the result if it isn't already present. Then, it repeats the process for the second parameter and any other parameters. If a value is already present, it's earlier placement in the array is preserved.

For objects, property names and values from the first parameter are added to the result. For later parameters, any new names are added to the result. If a later parameter has a property with the same name, that value overwrites the existing value. The order of the properties isn't guaranteed.

The union function merges not only the top-level elements but also recursively merges any nested objects within them. Nested array values aren't merged. See the second example in the following section.

### Example

The following example shows how to use `union` with arrays and objects:

```bicep
param firstObject object = {
  one: 'a'
  two: 'b'
  three: 'c1'
}

param secondObject object = {
  three: 'c2'
  four: 'd'
  five: 'e'
}

param firstArray array = [
  'one'
  'two'
  'three'
]

param secondArray array = [
  'three'
  'four'
  'two'
]

output objectOutput object = union(firstObject, secondObject)
output arrayOutput array = union(firstArray, secondArray)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| objectOutput | Object | {"one": "a", "two": "b", "three": "c2", "four": "d", "five": "e"} |
| arrayOutput | Array | ["one", "two", "three", "four"] |

The following example shows the deep merge capability:

```bicep
var firstObject = {
  property: {
    one: 'a'
    two: 'b'
    three: 'c1'
  }
  nestedArray: [
    1
    2
  ]
}
var secondObject = {
  property: {
    three: 'c2'
    four: 'd'
    five: 'e'
  }
  nestedArray: [
    3
    4
  ]
}
var firstArray = [
  [
    'one'
    'two'
  ]
  [
    'three'
  ]
]
var secondArray = [
  [
    'three'
  ]
  [
    'four'
    'two'
  ]
]

output objectOutput object = union(firstObject, secondObject)
output arrayOutput array = union(firstArray, secondArray)
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| objectOutput | Object |{"property":{"one":"a","two":"b","three":"c2","four":"d","five":"e"},"nestedArray":[3,4]}|
| arrayOutput | Array |[["one","two"],["three"],["four","two"]]|

If nested arrays were merged, then the value of **objectOutput.nestedArray** would be [1, 2, 3, 4], and the value of **arrayOutput** would be [["one", "two", "three"], ["three", "four", "two"]].

## Next steps

* For a description of the sections in a Bicep file, see [Understand the structure and syntax of Bicep files](./file.md).
