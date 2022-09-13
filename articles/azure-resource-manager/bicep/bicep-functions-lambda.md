---
title: Bicep functions - lambda
description: Describes the lambda functions to use in a Bicep file.
author: mumian
ms.topic: conceptual
ms.author: jgao
ms.date: 09/13/2022

---
# Lambda functions for Bicep

This article describes the lambda functions to use in Bicep.

To illustrate the lambda functions, the following input array is used in the examples:

```bicep
var dogs = [
  {
    name: 'Evie'
    age: 5
    interests: ['Ball', 'Frisbee']
  }
  {
    name: 'Casper'
    age: 3
    interests: ['Other dogs']
  }
  {
    name: 'Indy'
    age: 2
    interests: ['Butter']
  }
  {
    name: 'Kira'
    age: 8
    interests: ['Rubs']
  }
]
```

**Limitations**

- Lambdas can be only be used as parameters.  (inside parentheses? Lambda functions may only be specified directly as function arguments)
- Using lambda variables inside resource or module array access is not currently supported.
- Using lambda variables inside the \"listKeys\" function is not currently supported.
- Using lambda variables inside the \"reference\" function is not currently supported.

**Lambda expression**

output dogNames array = map(dogs, dog => dog.name) // ["Evie","Casper","Indy","Kira"] // dog = item; => = function call; left hand side is the variable, the right hand side is the expression.

## filter

`filter(inputArray, lambdaExpression)`

Filters an array with a custom filtering function.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to filter.|
| lamdaExperssion |Yes |lambda expression |The predicate applied to each input array element. If false, the item will be filtered out of the output array.|

### Return value

An array.

### Example

The following example shows how to use the filter function.

```bicep
output oldBois array = filter(dogs, dog => dog.age >=5)
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| oldBois | Array | [{"name":"Evie","age":5,"interests":["Ball","Frisbee"]},{"name":"Kira","age":8,"interests":["Rubs"]}] |

## map

`map(inputArray, lambdaExpression)`

Applies a custom mapping function to each element of an array.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to map.|
| lamdaExperssion |Yes |lambda expression |The predicate applied to each input array element, in order to generate the output array.|

### Return value

An array.

### Example

The following example shows how to use the map function.

```bicep
output dogNames array = map(dogs, dog => dog.name)
output sayHi array = map(dogs, dog => 'Hello ${dog.name}!')
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| dogNames | Array | ["Evie","Casper","Indy","Kira"]  |
| sayHi | Array | ["Hello Evie!","Hello Casper!","Hello Indy!","Hello Kira!"] |

## reduce

`reduce(inputArray, initialValue, lambdaExpression)`

Reduces an array with a custom reduce function.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to sort.|
| initialValue |No |Initial value.|
| lamdaExperssion |Yes |lambda expression |The predicate used to aggregate the current value and the next value.|

### Return value

Any.

### Example

The following example shows how to use the function.

```bicep
var ages = map(dogs, dog => dog.age)
output totalAge int = reduce(ages, 0, (cur, prev) => cur + prev)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| totalAge | Any | 18 |

## sort

`sort(inputArray, lambdaExpression)`

Sorts an array with a custom sort function.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to sort.|
| lamdaExperssion |Yes |lambda expression |The predicate used to compare two array elements for ordering. If true, the second element will be ordered after the first in the output array.|

### Return value

An array.

### Example

The following example shows how to use the filter function.

```bicep
output dogsByAge array = sort(dogs, (a, b) => a.age <= b.age) //
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| dogsByAge | Array | [{"name":"Indy","age":2,"interests":["Butter"]},{"name":"Casper","age":3,"interests":["Other dogs"]},{"name":"Evie","age":5,"interests":["Ball","Frisbee"]},{"name":"Kira","age":8,"interests":["Rubs"]}] |

## Next steps

- See [Bicep functions - arrays](./bicep-functions-array.md) for additional array related Bicep functions.
