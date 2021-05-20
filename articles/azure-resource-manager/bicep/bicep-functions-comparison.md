---
title: Bicep functions - comparison
description: Describes the functions to use in a Bicep file to compare values.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 11/18/2020
---
# Comparison functions for Bicep

Resource Manager provides several functions for making comparisons in your Bicep file:

* [equals](#equals)
* [greater](#greater)
* [greaterOrEquals](#greaterorequals)
* [less](#less)
* [lessOrEquals](#lessorequals)

## equals

`equals(arg1, arg2)`

Checks whether two values equal each other. The `equals` function is not supported in Bicep. Use the `==` operator instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int, string, array, or object |The first value to check for equality. |
| arg2 |Yes |int, string, array, or object |The second value to check for equality. |

### Return value

Returns **True** if the values are equal; otherwise, **False**.

### Example

The following example checks different types of values for equality. All the default values return True.

```bicep
param firstInt int = 1
param secondInt int = 1
param firstString string = 'a'
param secondString string = 'a'
param firstArray array = [
  'a'
  'b'
]
param secondArray array = [
  'a'
  'b'
]
param firstObject object = {
  'a': 'b'
}
param secondObject object = {
  'a': 'b'
}

output checInts bool = firstInt == secondInt
output checkStrings bool = firstString == secondString
output checkArrays bool = firstArray == secondArray
output checkObjects bool = firstObject == secondObject
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkInts | Bool | True |
| checkStrings | Bool | True |
| checkArrays | Bool | True |
| checkObjects | Bool | True |

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/not-equals.json) uses [not](./bicep-functions-logical.md#not) with **equals**.

```bicep
output checkNotEquals bool = ! (1 == 2)
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkNotEquals | Bool | True |

## greater

`greater(arg1, arg2)`

Checks whether the first value is greater than the second value. The `greater` function is not supported in Bicep. Use the `>` operator instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the greater comparison. |
| arg2 |Yes |int or string |The second value for the greater comparison. |

### Return value

Returns **True** if the first value is greater than the second value; otherwise, **False**.

### Example

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/greater.json) checks whether the one value is greater than the other.

```bicep
param firstInt int = 1
param secondInt int = 2
param firstString string = 'A'
param secondString string = 'a'

output checkInts bool = firstInt > secondInt
output checkStrings bool = firstString > secondString
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkInts | Bool | False |
| checkStrings | Bool | True |

## greaterOrEquals

`greaterOrEquals(arg1, arg2)`

Checks whether the first value is greater than or equal to the second value. The `greaterOrEquals` function is not supported in Bicep. Use the `>=` operator instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the greater or equal comparison. |
| arg2 |Yes |int or string |The second value for the greater or equal comparison. |

### Return value

Returns **True** if the first value is greater than or equal to the second value; otherwise, **False**.

### Example

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/greaterorequals.json) checks whether the one value is greater than or equal to the other.

```bicep
param firstInt int = 1
param secondInt int = 2
param firstString string = 'A'
param secondString string = 'a'

output checkInts bool = firstInt >= secondInt
output checkStrings bool = firstString >= secondString
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkInts | Bool | False |
| checkStrings | Bool | True |

## less

`less(arg1, arg2)`

Checks whether the first value is less than the second value. The `less` function is not supported in Bicep. Use the `<` operator instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the less comparison. |
| arg2 |Yes |int or string |The second value for the less comparison. |

### Return value

Returns **True** if the first value is less than the second value; otherwise, **False**.

### Example

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/less.json) checks whether the one value is less than the other.

```bicep
param firstInt int = 1
param secondInt int = 2
param firstString string = 'A'
param secondString string = 'a'

output checkInts bool = firstInt < secondInt
output checkStrings bool = firstString < secondString
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkInts | Bool | True |
| checkStrings | Bool | False |

## lessOrEquals

`lessOrEquals(arg1, arg2)`

Checks whether the first value is less than or equal to the second value. The `lessOrEquals` function is not supported in Bicep. Use the `<=` operator instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |int or string |The first value for the less or equals comparison. |
| arg2 |Yes |int or string |The second value for the less or equals comparison. |

### Return value

Returns **True** if the first value is less than or equal to the second value; otherwise, **False**.

### Example

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/lessorequals.json) checks whether the one value is less than or equal to the other.

```bicep
param firstInt int = 1
param secondInt int = 2
param firstString string = 'A'
param secondString string = 'a'

output checkInts bool = firstInt <= secondInt
output checkStrings bool = firstString <= secondString
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkInts | Bool | True |
| checkStrings | Bool | False |

## Next steps

* For a description of the sections in a Bicep file, see [Understand the structure and syntax of Bicep files](./file.md).
