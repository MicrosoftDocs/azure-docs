---
title: Bicep functions - string
description: Describes the functions to use in a Bicep file to work with strings.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 07/07/2023
---

# String functions for Bicep

This article describes the Bicep functions for working with strings.

## base64

`base64(inputString)`

Returns the base64 representation of the input string.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputString |Yes |string |The value to return as a base64 representation. |

### Return value

A string containing the base64 representation.

### Examples

The following example shows how to use the base64 function.

```bicep
param stringData string = 'one, two, three'
param jsonFormattedData string = '{\'one\': \'a\', \'two\': \'b\'}'

var base64String = base64(stringData)
var base64Object = base64(jsonFormattedData)

output base64Output string = base64String
output toStringOutput string = base64ToString(base64String)
output toJsonOutput object = base64ToJson(base64Object)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| base64Output | String | b25lLCB0d28sIHRocmVl |
| toStringOutput | String | one, two, three |
| toJsonOutput | Object | {"one": "a", "two": "b"} |

## base64ToJson

`base64ToJson(base64Value)`

Converts a base64 representation to a JSON object.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| base64Value |Yes |string |The base64 representation to convert to a JSON object. |

### Return value

A JSON object.

### Examples

The following example uses the base64ToJson function to convert a base64 value:

```bicep
param stringData string = 'one, two, three'
param jsonFormattedData string = '{\'one\': \'a\', \'two\': \'b\'}'

var base64String = base64(stringData)
var base64Object = base64(jsonFormattedData)

output base64Output string = base64String
output toStringOutput string = base64ToString(base64String)
output toJsonOutput object = base64ToJson(base64Object)

```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| base64Output | String | b25lLCB0d28sIHRocmVl |
| toStringOutput | String | one, two, three |
| toJsonOutput | Object | {"one": "a", "two": "b"} |

## base64ToString

`base64ToString(base64Value)`

Converts a base64 representation to a string.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| base64Value |Yes |string |The base64 representation to convert to a string. |

### Return value

A string of the converted base64 value.

### Examples

The following example uses the base64ToString function to convert a base64 value:

```bicep
param stringData string = 'one, two, three'
param jsonFormattedData string = '{\'one\': \'a\', \'two\': \'b\'}'

var base64String = base64(stringData)
var base64Object = base64(jsonFormattedData)

output base64Output string = base64String
output toStringOutput string = base64ToString(base64String)
output toJsonOutput object = base64ToJson(base64Object)
```

---

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| base64Output | String | b25lLCB0d28sIHRocmVl |
| toStringOutput | String | one, two, three |
| toJsonOutput | Object | {"one": "a", "two": "b"} |

## concat

`concat(arg1, arg2, arg3, ...)`

Combines multiple string values and returns the concatenated string, or combines multiple arrays and returns the concatenated array. To improve readability, use [string interpolation](./data-types.md#strings) instead of the `concat()` function. However, in some cases such as string replacement in [multi-line strings](../bicep/data-types.md#multi-line-strings), you may need to fall back on using the `concat()` function or the [`replace()` function](#replace).

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |string or array |The first string or array for concatenation. |
| more arguments |No |string or array |More strings or arrays in sequential order for concatenation. |

This function can take any number of arguments, and can accept either strings or arrays for the parameters. However, you can't provide both arrays and strings for parameters. Strings are only concatenated with other strings.

### Return value

A string or array of concatenated values.

### Examples

The following example shows a comparison between using interpolation and using the `concat()` function. The two outputs return the same value.

```bicep
param prefix string = 'prefix'

output concatOutput string = concat(prefix, uniqueString(resourceGroup().id))
output interpolationOutput string = '${prefix}And${uniqueString(resourceGroup().id)}'
```

The outputs from the preceding example with the default value are:

| Name | Type | Value |
| ---- | ---- | ----- |
| concatOutput | String | prefixAnd5yj4yjf5mbg72 |
| interpolationOutput | String | prefixAnd5yj4yjf5mbg72 |

Interpolation is not currently supported in multi-line strings. The following example shows a comparison between using interpolation and using the `concat()` function.

```bicep
var blocked = 'BLOCKED'

output concatOutput string = concat('''interpolation
is ''', blocked)
output interpolationOutput string = '''interpolation
is ${blocked}'''
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| concatOutput | String | interpolation\nis BLOCKED |
| interpolationOutput | String | interpolation\nis ${blocked} |

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

### Examples

The following example shows how to use contains with different types:

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

---

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| stringTrue | Bool | True |
| stringFalse | Bool | False |
| objectTrue | Bool | True |
| objectFalse | Bool | False |
| arrayTrue | Bool | True |
| arrayFalse | Bool | False |

## dataUri

`dataUri(stringToConvert)`

Converts a value to a data URI.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToConvert |Yes |string |The value to convert to a data URI. |

### Return value

A string formatted as a data URI.

### Examples

The following example converts a value to a data URI, and converts a data URI to a string:

```bicep
param stringToTest string = 'Hello'
param dataFormattedString string = 'data:;base64,SGVsbG8sIFdvcmxkIQ=='

output dataUriOutput string = dataUri(stringToTest)
output toStringOutput string = dataUriToString(dataFormattedString)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| dataUriOutput | String | data:text/plain;charset=utf8;base64,SGVsbG8= |
| toStringOutput | String | Hello, World! |

## dataUriToString

`dataUriToString(dataUriToConvert)`

Converts a data URI formatted value to a string.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| dataUriToConvert |Yes |string |The data URI value to convert. |

### Return value

A string containing the converted value.

### Examples

The following example converts a value to a data URI, and converts a data URI to a string:

```bicep
param stringToTest string = 'Hello'
param dataFormattedString string = 'data:;base64,SGVsbG8sIFdvcmxkIQ=='

output dataUriOutput string = dataUri(stringToTest)
output toStringOutput string = dataUriToString(dataFormattedString)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| dataUriOutput | String | data:text/plain;charset=utf8;base64,SGVsbG8= |
| toStringOutput | String | Hello, World! |

## empty

`empty(itemToTest)`

Determines if an array, object, or string is empty.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| itemToTest |Yes |array, object, or string |The value to check if it's empty. |

### Return value

Returns **True** if the value is empty; otherwise, **False**.

### Examples

The following example checks whether an array, object, and string are empty.

```bicep
param testArray array = []
param testObject object = {}
param testString string = ''

output arrayEmpty bool = empty(testArray)
output objectEmpty bool = empty(testObject)
output stringEmpty bool = empty(testString)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayEmpty | Bool | True |
| objectEmpty | Bool | True |
| stringEmpty | Bool | True |

## endsWith

`endsWith(stringToSearch, stringToFind)`

Determines whether a string ends with a value. The comparison is case-insensitive.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToSearch |Yes |string |The value that contains the item to find. |
| stringToFind |Yes |string |The value to find. |

### Return value

**True** if the last character or characters of the string match the value; otherwise, **False**.

### Examples

The following example shows how to use the startsWith and endsWith functions:

```bicep
output startsTrue bool = startsWith('abcdef', 'ab')
output startsCapTrue bool = startsWith('abcdef', 'A')
output startsFalse bool = startsWith('abcdef', 'e')
output endsTrue bool = endsWith('abcdef', 'ef')
output endsCapTrue bool = endsWith('abcdef', 'F')
output endsFalse bool = endsWith('abcdef', 'e')
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| startsTrue | Bool | True |
| startsCapTrue | Bool | True |
| startsFalse | Bool | False |
| endsTrue | Bool | True |
| endsCapTrue | Bool | True |
| endsFalse | Bool | False |

## first

`first(arg1)`

Returns the first character of the string, or first element of the array.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or string |The value to retrieve the first element or character. |

### Return value

A string of the first character, or the type (string, int, array, or object) of the first element in an array.

### Examples

The following example shows how to use the first function with an array and string.

```bicep
param arrayToTest array = [
  'one'
  'two'
  'three'
]

output arrayOutput string = first(arrayToTest)
output stringOutput string = first('One Two Three')
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | String | one |
| stringOutput | String | O |

## format

`format(formatString, arg1, arg2, ...)`

Creates a formatted string from input values.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| formatString | Yes | string | The composite format string. |
| arg1 | Yes | string, integer, or boolean | The value to include in the formatted string. |
| additional arguments | No | string, integer, or boolean | Additional values to include in the formatted string. |

### Remarks

Use this function to format a string in your Bicep file. It uses the same formatting options as the [System.String.Format](/dotnet/api/system.string.format) method in .NET.

### Examples

The following example shows how to use the format function.

```bicep
param greeting string = 'Hello'
param name string = 'User'
param numberToFormat int = 8175133
param objectToFormat object = { prop: 'value' }

output formatTest string = format('{0}, {1}. Formatted number: {2:N0}', greeting, name, numberToFormat)
output formatObject string = format('objectToFormat: {0}', objectToFormat)

```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| formatTest | String | `Hello, User. Formatted number: 8,175,133` |
| formatObject | String | `objectToFormat: {'prop':'value'}` |

## guid

`guid(baseString, ...)`

Creates a value in the format of a globally unique identifier based on the values provided as parameters.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| baseString |Yes |string |The value used in the hash function to create the GUID. |
| additional parameters as needed |No |string |You can add as many strings as needed to create the value that specifies the level of uniqueness. |

### Remarks

This function is helpful when you need to create a value in the format of a globally unique identifier. You provide parameter values that limit the scope of uniqueness for the result. You can specify whether the name is unique down to subscription, resource group, or deployment.

The returned value isn't a random string, but rather the result of a hash function on the parameters. The returned value is 36 characters long. It isn't globally unique. To create a new GUID that isn't based on that hash value of the parameters, use the [newGuid](#newguid) function.

> [!NOTE]
> The order of the parameters affects the returned value. For example:
>
> `guid('hello', 'world')` and `guid('world', 'hello')`
>
> don't return the same value.

The following examples show how to use guid to create a unique value for commonly used levels.

Unique scoped to subscription

```bicep
guid(subscription().subscriptionId)
```

Unique scoped to resource group

```bicep
guid(resourceGroup().id)
```

Unique scoped to deployment for a resource group

```bicep
guid(resourceGroup().id, deployment().name)
```

The `guid` function implements the algorithm from [RFC 4122 §4.3](https://www.ietf.org/rfc/rfc4122.txt). The original source can be found in [GuidUtility](https://github.com/LogosBible/Logos.Utility/blob/e7fc45123da090b8cf34da194a1161ed6a34d20d/src/Logos.Utility/GuidUtility.cs) with some modifications.

### Return value

A string containing 36 characters in the format of a globally unique identifier.

### Examples

The following example returns results from guid:

```bicep
output guidPerSubscription string = guid(subscription().subscriptionId)
output guidPerResourceGroup string = guid(resourceGroup().id)
output guidPerDeployment string = guid(resourceGroup().id, deployment().name)
```

## indexOf

`indexOf(stringToSearch, stringToFind)`

Returns the first position of a value within a string. The comparison is case-insensitive.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToSearch |Yes |string |The value that contains the item to find. |
| stringToFind |Yes |string |The value to find. |

### Return value

An integer that represents the position of the item to find. The value is zero-based. If the item isn't found, -1 is returned.

### Examples

The following example shows how to use the indexOf and lastIndexOf functions:

```bicep
output firstT int = indexOf('test', 't')
output lastT int = lastIndexOf('test', 't')
output firstString int = indexOf('abcdef', 'CD')
output lastString int = lastIndexOf('abcdef', 'AB')
output notFound int = indexOf('abcdef', 'z')
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| firstT | Int | 0 |
| lastT | Int | 3 |
| firstString | Int | 2 |
| lastString | Int | 0 |
| notFound | Int | -1 |

## join

`join(inputArray, delimiter)`

Joins a string array into a single string, separated using a delimiter.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray | Yes |An array of string. |An array of strings to join. |
| delimiter | Yes |The delimiter to use for splitting the string. |

### Return value

A string.

### Examples

The following example joins the input string array into strings delimited by either a comma or a semi-colon.

```bicep
var arrayString = [
  'one'
  'two'
  'three'
]

output firstOutput string = join(arrayString, ',')
output secondOutput string = join(arrayString, ';')
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| firstOutput | String | "one,two,three" |
| secondOutput | String | "one;two;three" |

This function requires **Bicep version 0.8.2 or later**.

<a id="json"></a>

## json

`json(arg1)`

Converts a valid JSON string into a JSON data type. For more information, see [json function](./bicep-functions-object.md#json).

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

## last

`last(arg1)`

Returns last character of the string, or the last element of the array.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or string |The value to retrieve the last element or character. |

### Return value

A string of the last character, or the type (string, int, array, or object) of the last element in an array.

### Examples

The following example shows how to use the last function with an array and string.

```bicep
param arrayToTest array = [
  'one'
  'two'
  'three'
]

output arrayOutput string = last(arrayToTest)
output stringOutput string = last('One Two Three')
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | String | three |
| stringOutput | String | e |

## lastIndexOf

`lastIndexOf(stringToSearch, stringToFind)`

Returns the last position of a value within a string. The comparison is case-insensitive.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToSearch |Yes |string |The value that contains the item to find. |
| stringToFind |Yes |string |The value to find. |

### Return value

An integer that represents the last position of the item to find. The value is zero-based. If the item isn't found, -1 is returned.

### Examples

The following example shows how to use the `indexOf` and `lastIndexOf` functions:

```bicep
output firstT int = indexOf('test', 't')
output lastT int = lastIndexOf('test', 't')
output firstString int = indexOf('abcdef', 'CD')
output lastString int = lastIndexOf('abcdef', 'AB')
output notFound int = indexOf('abcdef', 'z')
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| firstT | Int | 0 |
| lastT | Int | 3 |
| firstString | Int | 2 |
| lastString | Int | 0 |
| notFound | Int | -1 |

## length

`length(string)`

Returns the number of characters in a string, elements in an array, or root-level properties in an object.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array, string, or object |The array to use for getting the number of elements, the string to use for getting the number of characters, or the object to use for getting the number of root-level properties. |

### Return value

An int.

### Examples

The following example shows how to use length with an array and string:

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

## newGuid

`newGuid()`

Returns a value in the format of a globally unique identifier. **This function can only be used in the default value for a parameter.**

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Remarks

You can only use this function within an expression for the default value of a parameter. Using this function anywhere else in a Bicep file returns an error. The function isn't allowed in other parts of the Bicep file because it returns a different value each time it's called. Deploying the same Bicep file with the same parameters wouldn't reliably produce the same results.

The newGuid function differs from the [guid](#guid) function because it doesn't take any parameters. When you call guid with the same parameters, it returns the same identifier each time. Use guid when you need to reliably generate the same GUID for a specific environment. Use newGuid when you need a different identifier each time, such as deploying resources to a test environment.

The newGuid function uses the [Guid structure](/dotnet/api/system.guid) in the .NET Framework to generate the globally unique identifier.

If you use the [option to redeploy an earlier successful deployment](../templates/rollback-on-error.md), and the earlier deployment includes a parameter that uses newGuid, the parameter isn't reevaluated. Instead, the parameter value from the earlier deployment is automatically reused in the rollback deployment.

In a test environment, you may need to repeatedly deploy resources that only live for a short time. Rather than constructing unique names, you can use newGuid with [uniqueString](#uniquestring) to create unique names.

Be careful redeploying a Bicep file that relies on the newGuid function for a default value. When you redeploy and don't provide a value for the parameter, the function is reevaluated. If you want to update an existing resource rather than create a new one, pass in the parameter value from the earlier deployment.

### Return value

A string containing 36 characters in the format of a globally unique identifier.

### Examples

The following example shows a parameter with a new identifier.

```bicep
param guidValue string = newGuid()

output guidOutput string = guidValue
```

---

The output from the preceding example varies for each deployment but will be similar to:

| Name | Type | Value |
| ---- | ---- | ----- |
| guidOutput | string | b76a51fc-bd72-4a77-b9a2-3c29e7d2e551 |

The following example uses the newGuid function to create a unique name for a storage account. This Bicep file might work for test environment where the storage account exists for a short time and isn't redeployed.

```bicep
param guidValue string = newGuid()

var storageName = 'storage${uniqueString(guidValue)}'

resource myStorage 'Microsoft.Storage/storageAccounts@2018-07-01' = {
  name: storageName
  location: 'West US'
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {}
}

output nameOutput string = storageName
```

The output from the preceding example varies for each deployment but will be similar to:

| Name | Type | Value |
| ---- | ---- | ----- |
| nameOutput | string | storagenziwvyru7uxie |

## padLeft

`padLeft(valueToPad, totalLength, paddingCharacter)`

Returns a right-aligned string by adding characters to the left until reaching the total specified length.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| valueToPad |Yes |string or int |The value to right-align. |
| totalLength |Yes |int |The total number of characters in the returned string. |
| paddingCharacter |No |single character |The character to use for left-padding until the total length is reached. The default value is a space. |

If the original string is longer than the number of characters to pad, no characters are added.

### Return value

A string with at least the number of specified characters.

### Examples

The following example shows how to pad the user-provided parameter value by adding the zero character until it reaches the total number of characters.

```bicep
param testString string = '123'

output stringOutput string = padLeft(testString, 10, '0')
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| stringOutput | String | 0000000123 |

## replace

`replace(originalString, oldString, newString)`

Returns a new string with all instances of one string replaced by another string.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalString |Yes |string |The value that has all instances of one string replaced by another string. |
| oldString |Yes |string |The string to be removed from the original string. |
| newString |Yes |string |The string to add in place of the removed string. |

### Return value

A string with the replaced characters.

### Examples

The following example shows how to remove all dashes from the user-provided string, and how to replace part of the string with another string.

```bicep
param testString string = '123-123-1234'

output firstOutput string = replace(testString, '-', '')
output secondOutput string = replace(testString, '1234', 'xxxx')
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| firstOutput | String | 1231231234 |
| secondOutput | String | 123-123-xxxx |

## skip

`skip(originalValue, numberToSkip)`

Returns a string with all the characters after the specified number of characters, or an array with all the elements after the specified number of elements.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalValue |Yes |array or string |The array or string to use for skipping. |
| numberToSkip |Yes |int |The number of elements or characters to skip. If this value is 0 or less, all the elements or characters in the value are returned. If it's larger than the length of the array or string, an empty array or string is returned. |

### Return value

An array or string.

### Examples

The following example skips the specified number of elements in the array, and the specified number of characters in a string.

```bicep
param testArray array = [
  'one'
  'two'
  'three'
]
param elementsToSkip int = 2
param testString string = 'one two three'
param charactersToSkip int = 4

output arrayOutput array = skip(testArray, elementsToSkip)
output stringOutput string = skip(testString, charactersToSkip)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Array | ["three"] |
| stringOutput | String | two three |

## split

`split(inputString, delimiter)`

Returns an array of strings that contains the substrings of the input string that are delimited by the specified delimiters.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputString |Yes |string |The string to split. |
| delimiter |Yes |string or array of strings |The delimiter to use for splitting the string. |

### Return value

An array of strings.

### Examples

The following example splits the input string with a comma, and with either a comma or a semi-colon.

```bicep
param firstString string = 'one,two,three'
param secondString string = 'one;two,three'

var delimiters = [
  ','
  ';'
]

output firstOutput array = split(firstString, ',')
output secondOutput array = split(secondString, delimiters)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| firstOutput | Array | ["one", "two", "three"] |
| secondOutput | Array | ["one", "two", "three"] |

## startsWith

`startsWith(stringToSearch, stringToFind)`

Determines whether a string starts with a value. The comparison is case-insensitive.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToSearch |Yes |string |The value that contains the item to find. |
| stringToFind |Yes |string |The value to find. |

### Return value

**True** if the first character or characters of the string match the value; otherwise, **False**.

### Examples

The following example shows how to use the startsWith and endsWith functions:

```bicep
output startsTrue bool = startsWith('abcdef', 'ab')
output startsCapTrue bool = startsWith('abcdef', 'A')
output startsFalse bool = startsWith('abcdef', 'e')
output endsTrue bool = endsWith('abcdef', 'ef')
output endsCapTrue bool = endsWith('abcdef', 'F')
output endsFalse bool = endsWith('abcdef', 'e')
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| startsTrue | Bool | True |
| startsCapTrue | Bool | True |
| startsFalse | Bool | False |
| endsTrue | Bool | True |
| endsCapTrue | Bool | True |
| endsFalse | Bool | False |

## string

`string(valueToConvert)`

Converts the specified value to a string.
Strings are returned as-is. Other types are converted to their equivalent JSON representation.
If you need to convert a string to JSON, i.e. quote/escape it, you can use `substring(string([value]), 1, length(string([value]) - 2)`.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| valueToConvert |Yes | Any |The value to convert to string. Any type of value can be converted, including objects and arrays. |

### Return value

A string of the converted value.

### Examples

The following example shows how to convert different types of values to strings:

```bicep
param testObject object = {
  valueA: 10
  valueB: 'Example Text'
}
param testArray array = [
  '\'a\''
  '"b"'
  '\\c\\'
]
param testInt int = 5
param testString string = 'foo " \' \\'

output objectOutput string = string(testObject)
output arrayOutput string = string(testArray)
output intOutput string = string(testInt)
output stringOutput string = string(testString)
output stringEscapedOutput string = substring(string([testString]), 1, length(string([testString])) - 2)

```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| objectOutput | String | `{"valueA":10,"valueB":"Example Text"}` |
| arrayOutput | String | `["'a'","\"b\"","\\c\\"]` |
| intOutput | String | `5` |
| stringOutput | String | `foo " ' \` |
| stringEscapedOutput | String | `"foo \" ' \\"` |

## substring

`substring(stringToParse, startIndex, length)`

Returns a substring that starts at the specified character position and contains the specified number of characters.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToParse |Yes |string |The original string from which the substring is extracted. |
| startIndex |No |int |The zero-based starting character position for the substring. |
| length |No |int |The number of characters for the substring. Must refer to a location within the string. Must be zero or greater. If omitted, the remainder of the string from the start position will be returned.|

### Return value

The substring. Or, an empty string if the length is zero.

### Remarks

The function fails when the substring extends beyond the end of the string, or when length is less than zero. The following example fails with the error "The index and length parameters must refer to a location within the string. The index parameter: '0', the length parameter: '11', the length of the string parameter: '10'.".

```bicep
param inputString string = '1234567890'

var prefix = substring(inputString, 0, 11)
```

### Examples

The following example extracts a substring from a parameter.

```bicep
param testString string = 'one two three'
output substringOutput string = substring(testString, 4, 3)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| substringOutput | String | two |

## take

`take(originalValue, numberToTake)`

Returns a string with the specified number of characters from the start of the string, or an array with the specified number of elements from the start of the array.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalValue |Yes |array or string |The array or string to take the elements from. |
| numberToTake |Yes |int |The number of elements or characters to take. If this value is 0 or less, an empty array or string is returned. If it's larger than the length of the given array or string, all the elements in the array or string are returned. |

### Return value

An array or string.

### Examples

The following example takes the specified number of elements from the array, and characters from a string.

```bicep
param testArray array = [
  'one'
  'two'
  'three'
]
param elementsToTake int = 2
param testString string = 'one two three'
param charactersToTake int = 2

output arrayOutput array = take(testArray, elementsToTake)
output stringOutput string = take(testString, charactersToTake)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Array | ["one", "two"] |
| stringOutput | String | on |

## toLower

`toLower(stringToChange)`

Converts the specified string to lower case.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToChange |Yes |string |The value to convert to lower case. |

### Return value

The string converted to lower case.

### Examples

The following example converts a parameter value to lower case and to upper case.

```bicep
param testString string = 'One Two Three'

output toLowerOutput string = toLower(testString)
output toUpperOutput string = toUpper(testString)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| toLowerOutput | String | one two three |
| toUpperOutput | String | ONE TWO THREE |

## toUpper

`toUpper(stringToChange)`

Converts the specified string to upper case.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToChange |Yes |string |The value to convert to upper case. |

### Return value

The string converted to upper case.

### Examples

The following example converts a parameter value to lower case and to upper case.

```bicep
param testString string = 'One Two Three'

output toLowerOutput string = toLower(testString)
output toUpperOutput string = toUpper(testString)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| toLowerOutput | String | one two three |
| toUpperOutput | String | ONE TWO THREE |

## trim

`trim(stringToTrim)`

Removes all leading and trailing white-space characters from the specified string.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToTrim |Yes |string |The value to trim. |

### Return value

The string without leading and trailing white-space characters.

### Examples

The following example trims the white-space characters from the parameter.

```bicep
param testString string = '    one two three   '

output return string = trim(testString)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| return | String | one two three |

## uniqueString

`uniqueString(baseString, ...)`

Creates a deterministic hash string based on the values provided as parameters.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| baseString |Yes |string |The value used in the hash function to create a unique string. |
| additional parameters as needed |No |string |You can add as many strings as needed to create the value that specifies the level of uniqueness. |

### Remarks

This function is helpful when you need to create a unique name for a resource. You provide parameter values that limit the scope of uniqueness for the result. You can specify whether the name is unique down to subscription, resource group, or deployment.

The returned value isn't a random string, but rather the result of a hash function. The returned value is 13 characters long. It isn't globally unique. You may want to combine the value with a prefix from your naming convention to create a name that is meaningful. The following example shows the format of the returned value. The actual value varies by the provided parameters.

`tcvhiyu5h2o5o`

The following examples show how to use uniqueString to create a unique value for commonly used levels.

Unique scoped to subscription

```bicep
uniqueString(subscription().subscriptionId)
```

Unique scoped to resource group

```bicep
uniqueString(resourceGroup().id)
```

Unique scoped to deployment for a resource group

```bicep
uniqueString(resourceGroup().id, deployment().name)
```

The following example shows how to create a unique name for a storage account based on your resource group. Inside the resource group, the name isn't unique if constructed the same way.

```bicep
resource mystorage 'Microsoft.Storage/storageAccounts@2018-07-01' = {
  name: 'storage${uniqueString(resourceGroup().id)}'
  ...
}
```

If you need to create a new unique name each time you deploy a Bicep file, and don't intend to update the resource, you can use the [utcNow](./bicep-functions-date.md#utcnow) function with uniqueString. You could use this approach in a test environment. For an example, see [utcNow](./bicep-functions-date.md#utcnow). Note the utcNow function can only be used within an expression for the default value of a parameter.

### Return value

A string containing 13 characters.

### Examples

The following example returns results from uniquestring:

```bicep
output uniqueRG string = uniqueString(resourceGroup().id)
output uniqueDeploy string = uniqueString(resourceGroup().id, deployment().name)
```

## uri

`uri(baseUri, relativeUri)`

Creates an absolute URI by combining the baseUri and the relativeUri string.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| baseUri |Yes |string |The base uri string. Take care to observe the behavior regarding the handling of the trailing slash ('/'), as described following this table.  |
| relativeUri |Yes |string |The relative uri string to add to the base uri string. |

* If **baseUri** ends in a trailing slash, the result is simply
  **baseUri** followed by **relativeUri**.

* If **baseUri** does not end in a trailing slash one of two things
  happens.

   * If **baseUri** has no slashes at all (aside from the "//" near
     the front) the result is simply **baseUri** followed by **relativeUri**.

   * If **baseUri** has some slashes, but doesn't end with a slash,
     everything from the last slash onward is removed from **baseUri**
     and the result is **baseUri** followed by **relativeUri**.

Here are some examples:

```
uri('http://contoso.org/firstpath', 'myscript.sh') -> http://contoso.org/myscript.sh
uri('http://contoso.org/firstpath/', 'myscript.sh') -> http://contoso.org/firstpath/myscript.sh
uri('http://contoso.org/firstpath/azuredeploy.json', 'myscript.sh') -> http://contoso.org/firstpath/myscript.sh
uri('http://contoso.org/firstpath/azuredeploy.json/', 'myscript.sh') -> http://contoso.org/firstpath/azuredeploy.json/myscript.sh
```

For complete details, the **baseUri** and **relativeUri** parameters are
resolved as specified in
[RFC 3986, section 5](https://tools.ietf.org/html/rfc3986#section-5).

### Return value

A string representing the absolute URI for the base and relative values.

### Examples

The following example shows how to use uri, uriComponent, and uriComponentToString:

```bicep
var uriFormat = uri('http://contoso.com/resources/', 'nested/azuredeploy.json')
var uriEncoded = uriComponent(uriFormat)

output uriOutput string = uriFormat
output componentOutput string = uriEncoded
output toStringOutput string = uriComponentToString(uriEncoded)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| uriOutput | String | `http://contoso.com/resources/nested/azuredeploy.json` |
| componentOutput | String | `http%3A%2F%2Fcontoso.com%2Fresources%2Fnested%2Fazuredeploy.json` |
| toStringOutput | String | `http://contoso.com/resources/nested/azuredeploy.json` |

## uriComponent

`uricomponent(stringToEncode)`

Encodes a URI.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| stringToEncode |Yes |string |The value to encode. |

### Return value

A string of the URI encoded value.

### Examples

The following example shows how to use uri, uriComponent, and uriComponentToString:

```bicep
var uriFormat = uri('http://contoso.com/resources/', 'nested/azuredeploy.json')
var uriEncoded = uriComponent(uriFormat)

output uriOutput string = uriFormat
output componentOutput string = uriEncoded
output toStringOutput string = uriComponentToString(uriEncoded)
```

---

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| uriOutput | String | `http://contoso.com/resources/nested/azuredeploy.json` |
| componentOutput | String | `http%3A%2F%2Fcontoso.com%2Fresources%2Fnested%2Fazuredeploy.json` |
| toStringOutput | String | `http://contoso.com/resources/nested/azuredeploy.json` |

## uriComponentToString

`uriComponentToString(uriEncodedString)`

Returns a string of a URI encoded value.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| uriEncodedString |Yes |string |The URI encoded value to convert to a string. |

### Return value

A decoded string of URI encoded value.

### Examples

The following example shows how to use uri, uriComponent, and uriComponentToString:

```bicep
var uriFormat = uri('http://contoso.com/resources/', 'nested/azuredeploy.json')
var uriEncoded = uriComponent(uriFormat)

output uriOutput string = uriFormat
output componentOutput string = uriEncoded
output toStringOutput string = uriComponentToString(uriEncoded)
```

---

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| uriOutput | String | `http://contoso.com/resources/nested/azuredeploy.json` |
| componentOutput | String | `http%3A%2F%2Fcontoso.com%2Fresources%2Fnested%2Fazuredeploy.json` |
| toStringOutput | String | `http://contoso.com/resources/nested/azuredeploy.json` |

## Next steps

* For a description of the sections in a Bicep file, see [Understand the structure and syntax of Bicep files](./file.md).
* To iterate a specified number of times when creating a type of resource, see [Iterative loops in Bicep](loops.md).
* To see how to deploy the Bicep file you've created, see [Deploy resources with Bicep and Azure PowerShell](./deploy-powershell.md).
