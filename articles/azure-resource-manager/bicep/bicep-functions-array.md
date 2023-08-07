---
title: Bicep functions - arrays
description: Describes the functions to use in a Bicep file for working with arrays.
author: mumian
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.author: jgao
ms.date: 12/09/2022
---

# Array functions for Bicep

This article describes the Bicep functions for working with arrays. The lambda functions for working with arrays can be found [here](./bicep-functions-lambda.md).

## array

`array(convertToArray)`

Converts the value to an array.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| convertToArray |Yes |int, string, array, or object |The value to convert to an array. |

### Return value

An array.

### Example

The following example shows how to use the array function with different types.

```bicep
param intToConvert int = 1
param stringToConvert string = 'efgh'
param objectToConvert object = {
  a: 'b'
  c: 'd'
}

output intOutput array = array(intToConvert)
output stringOutput array = array(stringToConvert)
output objectOutput array = array(objectToConvert)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| intOutput | Array | [1] |
| stringOutput | Array | ["efgh"] |
| objectOutput | Array | [{"a": "b", "c": "d"}] |

## concat

`concat(arg1, arg2, arg3, ...)`

Combines multiple arrays and returns the concatenated array. For more information about combining multiple strings, see [concat](./bicep-functions-string.md#concat).

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array |The first array for concatenation. |
| more arguments |No |array |More arrays in sequential order for concatenation. |

This function takes any number of arrays and combines them.

### Return value

An array of concatenated values.

### Example

The following example shows how to combine two arrays.

```bicep
param firstArray array = [
  '1-1'
  '1-2'
  '1-3'
]
param secondArray array = [
  '2-1'
  '2-2'
  '2-3'
]

output return array = concat(firstArray, secondArray)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| return | Array | ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3"] |

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

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| itemToTest |Yes |array, object, or string |The value to check if it's empty. |

### Return value

Returns **True** if the value is empty; otherwise, **False**.

### Example

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

### Quickstart examples

The following example is extracted from a quickstart template, [Virtual Network with diagnostic logs settings](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/vnet-create-with-diagnostic-logs/main.bicep):

```bicep
@description('Array containing DNS Servers')
param dnsServers array = []

...

resource vnet 'Microsoft.Network/virtualNetworks@2021-02-01' = {
  name: vnetName
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: vnetAddressSpace
    }
    dhcpOptions: empty(dnsServers) ? null : {
      dnsServers: dnsServers
    }
    ...
  }
}
```

In the [conditional expression](./operators-logical.md#conditional-expression--), the empty function is used to check whether the **dnsServers** array is an empty array.

## first

`first(arg1)`

Returns the first element of the array, or first character of the string.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or string |The value to retrieve the first element or character. |

### Return value

The type (string, int, array, or object) of the first element in an array, or the first character of a string.

### Example

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

## flatten

`flatten(arrayToFlatten)`

Takes an array of arrays, and returns an array of subarray elements, in the original order. Subarrays are only flattened once, not recursively.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arrayToFlattern |Yes |array |The array of subarrays to flatten.|

### Return value

Array

### Example

The following example shows how to use the flatten function.

```bicep
param arrayToTest array = [
  ['one', 'two']
  ['three']
  ['four', 'five']
]
output arrayOutput array = flatten(arrayToTest)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | array | ['one', 'two', 'three', 'four', 'five'] |

## indexOf

`indexOf(arrayToSearch, itemToFind)`

Returns an integer for the index of the first occurrence of an item in an array. The comparison is **case-sensitive** for strings.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| arrayToSearch | Yes | array | The array to use for finding the index of the searched item. |
| itemToFind | Yes | int, string, array, or object | The item to find in the array. |

### Return value

An integer representing the first index of the item in the array. The index is zero-based. If the item isn't found, -1 is returned.

### Examples

The following example shows how to use the indexOf and lastIndexOf functions:

```bicep
var names = [
  'one'
  'two'
  'three'
]

var numbers = [
  4
  5
  6
]

var collection = [
  names
  numbers
]

var duplicates = [
  1
  2
  3
  1
]

output index1 int = lastIndexOf(names, 'two')
output index2 int = indexOf(names, 'one')
output notFoundIndex1 int = lastIndexOf(names, 'Three')

output index3 int = lastIndexOf(numbers, 4)
output index4 int = indexOf(numbers, 6)
output notFoundIndex2 int = lastIndexOf(numbers, '5')

output index5 int = indexOf(collection, numbers)

output index6 int = indexOf(duplicates, 1)
output index7 int = lastIndexOf(duplicates, 1)
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

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or object |The first value to use for finding common elements. |
| arg2 |Yes |array or object |The second value to use for finding common elements. |
| more arguments |No |array or object |More values to use for finding common elements. |

### Return value

An array or object with the common elements. The order of the elements is determined by the first array parameter.

### Example

The following example shows how to use intersection with arrays and objects:

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

The first array parameter determines the order of the intersected elements. The following example shows how the order of the returned elements is based on which array is first.

```bicep
var array1 = [
  1
  2
  3
  4
]

var array2 = [
  3
  2
  1
]

var array3 = [
  4
  1
  3
  2
]

output commonUp array = intersection(array1, array2, array3)
output commonDown array = intersection(array2, array3, array1)
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| commonUp | array | [1, 2, 3] |
| commonDown | array | [3, 2, 1] |

## last

`last(arg1)`

Returns the last element of the array, or last character of the string.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array or string |The value to retrieve the last element or character. |

### Return value

The type (string, int, array, or object) of the last element in an array, or the last character of a string.

### Example

The following example shows how to use the last function with an array and string.

```bicep
param arrayToTest array = [
  'one'
  'two'
  'three'
]

output arrayOutput string = last(arrayToTest)
output stringOutput string = last('One Two three')
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | String | three |
| stringOutput | String | e |

## lastIndexOf

`lastIndexOf(arrayToSearch, itemToFind)`

Returns an integer for the index of the last occurrence of an item in an array. The comparison is **case-sensitive** for strings.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| arrayToSearch | Yes | array | The array to use for finding the index of the searched item. |
| itemToFind | Yes | int, string, array, or object | The item to find in the array. |

### Return value

An integer representing the last index of the item in the array. The index is zero-based. If the item isn't found, -1 is returned.

### Examples

The following example shows how to use the indexOf and lastIndexOf functions:

```bicep
var names = [
  'one'
  'two'
  'three'
]

var numbers = [
  4
  5
  6
]

var collection = [
  names
  numbers
]

var duplicates = [
  1
  2
  3
  1
]

output index1 int = lastIndexOf(names, 'two')
output index2 int = indexOf(names, 'one')
output notFoundIndex1 int = lastIndexOf(names, 'Three')

output index3 int = lastIndexOf(numbers, 4)
output index4 int = indexOf(numbers, 6)
output notFoundIndex2 int = lastIndexOf(numbers, '5')

output index5 int = indexOf(collection, numbers)

output index6 int = indexOf(duplicates, 1)
output index7 int = lastIndexOf(duplicates, 1)
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

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array, string, or object |The array to use for getting the number of elements, the string to use for getting the number of characters, or the object to use for getting the number of root-level properties. |

### Return value

An int.

### Example

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

### Quickstart examples

The following example is extracted from a quickstart template, [Deploy API Management in external VNet with public IP
](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.apimanagement/api-management-create-with-external-vnet-publicip):

```bicep
@description('Numbers for availability zones, for example, 1,2,3.')
param availabilityZones array = [
  '1'
  '2'
]

resource exampleApim 'Microsoft.ApiManagement/service@2021-08-01' = {
  name: apiManagementName
  location: location
  sku: {
    name: sku
    capacity: skuCount
  }
  zones: ((length(availabilityZones) == 0) ? null : availabilityZones)
  ...
}
```

In the [conditional expression](./operators-logical.md#conditional-expression--), the `length` function check the length of the **availabilityZones** array.

More examples can be found in these quickstart Bicep files:
- [Backup Resource Manager VMs using Recovery Services vault
](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-backup-vms/)
- [Deploy API Management into Availability Zones](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.apimanagement/api-management-simple-zones)
- [Create a Firewall and FirewallPolicy with Rules and Ipgroups](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/azurefirewall-create-with-firewallpolicy-apprule-netrule-ipgroups)
- [Create a sandbox setup of Azure Firewall with Zones](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/azurefirewall-with-zones-sandbox)

## max

`max(arg1)`

Returns the maximum value from an array of integers or a comma-separated list of integers.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array of integers, or comma-separated list of integers |The collection to get the maximum value. |

### Return value

An int representing the maximum value.

### Example

The following example shows how to use max with an array and a list of integers:

```bicep
param arrayToTest array = [
  0
  3
  2
  5
  4
]

output arrayOutput int = max(arrayToTest)
output intOutput int = max(0,3,2,5,4)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Int | 5 |
| intOutput | Int | 5 |

## min

`min(arg1)`

Returns the minimum value from an array of integers or a comma-separated list of integers.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |array of integers, or comma-separated list of integers |The collection to get the minimum value. |

### Return value

An int representing the minimum value.

### Example

The following example shows how to use min with an array and a list of integers:

```bicep
param arrayToTest array = [
  0
  3
  2
  5
  4
]

output arrayOutput int = min(arrayToTest)
output intOutput int = min(0,3,2,5,4)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| arrayOutput | Int | 0 |
| intOutput | Int | 0 |

## range

`range(startIndex, count)`

Creates an array of integers from a starting integer and containing the number of items.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| startIndex |Yes |int |The first integer in the array. The sum of startIndex and count must be no greater than 2147483647. |
| count |Yes |int |The number of integers in the array. Must be non-negative integer up to 10000. |

### Return value

An array of integers.

### Example

The following example shows how to use the range function:

```bicep
param startingInt int = 5
param numberOfElements int = 3

output rangeOutput array = range(startingInt, numberOfElements)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| rangeOutput | Array | [5, 6, 7] |

### Quickstart examples

The following example is extracted from a quickstart template, [Two VMs in VNET - Internal Load Balancer and LB rules
](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/2-vms-internal-load-balancer):

```bicep
...
var numberOfInstances = 2

resource networkInterface 'Microsoft.Network/networkInterfaces@2021-05-01' = [for i in range(0, numberOfInstances): {
  name: '${networkInterfaceName}${i}'
  location: location
  properties: {
    ...
  }
}]

resource vm 'Microsoft.Compute/virtualMachines@2021-11-01' = [for i in range(0, numberOfInstances): {
  name: '${vmNamePrefix}${i}'
  location: location
  properties: {
    ...
  }
}]
```

The Bicep file creates two networkInterface and two virtualMachine resources.

More examples can be found in these quickstart Bicep files:

- [Multi VM Template with Managed Disk](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vm-copy-managed-disks)
- [Create a VM with multiple empty StandardSSD_LRS Data Disks](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vm-with-standardssd-disk)
- [Create a Firewall and FirewallPolicy with Rules and Ipgroups](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/azurefirewall-create-with-firewallpolicy-apprule-netrule-ipgroups)
- [Create an Azure Firewall with IpGroups](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/azurefirewall-create-with-ipgroups-and-linux-jumpbox)
- [Create a sandbox setup of Azure Firewall with Zones](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/azurefirewall-with-zones-sandbox)
- [Create an Azure Firewall with multiple IP public addresses](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/fw-docs-qs)
- [Create a standard load-balancer](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/load-balancer-standard-create)
- [Azure Traffic Manager VM example](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/traffic-manager-vm)
- [Create A Security Automation for specific Alerts](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.security/securitycenter-create-automation-for-alertnamecontains)
- [SQL Server VM with performance optimized storage settings](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.sqlvirtualmachine/sql-vm-new-storage)
- [Create a storage account with multiple Blob containers](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.storage/storage-multi-blob-container)
- [Create a storage account with multiple file shares](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.storage/storage-multi-file-share)

## skip

`skip(originalValue, numberToSkip)`

Returns an array with all the elements after the specified number in the array, or returns a string with all the characters after the specified number in the string.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalValue |Yes |array or string |The array or string to use for skipping. |
| numberToSkip |Yes |int |The number of elements or characters to skip. If this value is 0 or less, all the elements or characters in the value are returned. If it's larger than the length of the array or string, an empty array or string is returned. |

### Return value

An array or string.

### Example

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

## take

`take(originalValue, numberToTake)`

Returns an array with the specified number of elements from the start of the array, or a string with the specified number of characters from the start of the string.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| originalValue |Yes |array or string |The array or string to take the elements from. |
| numberToTake |Yes |int |The number of elements or characters to take. If this value is 0 or less, an empty array or string is returned. If it's larger than the length of the given array or string, all the elements in the array or string are returned. |

### Return value

An array or string.

### Example

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

## union

`union(arg1, arg2, arg3, ...)`

Returns a single array or object with all elements from the parameters. For arrays, duplicate values are included once. For objects, duplicate property names are only included once.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

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

The following example shows how to use union with arrays and objects:

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

## Next steps

* To get an array of string values delimited by a value, see [split](./bicep-functions-string.md#split).
