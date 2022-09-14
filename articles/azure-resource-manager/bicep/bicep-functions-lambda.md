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

Bicep lambda function has these limitations:

- Lambda can only be specified directly as function arguments.
- Using lambda variables inside resource or module array access isn't currently supported.
- Using lambda variables inside the [`listKeys`](./bicep-functions-resource.md#list) function isn't currently supported.
- Using lambda variables inside the [reference](./bicep-functions-resource.md#reference) function isn't currently supported.

## filter

`filter(inputArray, predicate)`

Filters an array with a custom filtering function.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to filter.|
| predicate |Yes |lambda expression |The predicate applied to each input array element. If false, the item will be filtered out of the output array.|

### Return value

An array.

### Example

The following example shows how to use the filter function.

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
var itemForLoop = [for item in range(0, 10): item]

output filteredLoop array = filter(itemForLoop, i => i > 5)
output isEven array = filter(range(0, 10), i => 0 == i % 2)

output oldBois array = filter(dogs, dog => dog.age >=5)
```

The output from the preceding example shows the dogs that are five or older:

| Name | Type | Value |
| ---- | ---- | ----- |
| itemForLoop | Array | [6, 7, 8, 9] |
| isEven | Array | [0, 2, 4, 6, 8] |
| oldBois | Array | [{"name":"Evie","age":5,"interests":["Ball","Frisbee"]},{"name":"Kira","age":8,"interests":["Rubs"]}] |

## map

`map(inputArray, predicate)`

Applies a custom mapping function to each element of an array.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to map.|
| predicate |Yes |lambda expression |The predicate applied to each input array element, in order to generate the output array.|

### Return value

An array.

### Example

The following example shows how to use the map function.

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

output dogNames array = map(dogs, dog => dog.name)
output sayHi array = map(dogs, dog => 'Hello ${dog.name}!')
output mapObject array = map(range(0, length(dogs)), i => {
  i: i
  dog: dogs[i].name
  greeting: 'Ahoy, ${dogs[i].name}!'
})

```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| dogNames | Array | ["Evie","Casper","Indy","Kira"]  |
| sayHi | Array | ["Hello Evie!","Hello Casper!","Hello Indy!","Hello Kira!"] |
| mapObject | Array | [{"dog": "Evie", "greeting": "Ahoy, Evie!", "i": 0}, {"dog": "Casper", "greeting": "Ahoy, Casper!", "i": 1}, {"dog": "Indy", "greeting": "Ahoy, Indy!", "i": 2}, {"dog": "Kira", "greeting": "Ahoy, Kira!", "i": 3}] |

## reduce

`reduce(inputArray, initialValue, predicate)`

Reduces an array with a custom reduce function.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to reduce.|
| initialValue |No |any |Initial value.|
| predicate |Yes |lambda expression |The predicate used to aggregate the current value and the next value.|

### Return value

Any.

### Example

The following example shows how to use the reduce function.

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
var ages = map(dogs, dog => dog.age)
output totalAge int = reduce(ages, 0, (cur, prev) => cur + prev)
output totalAgeAdd1 int = reduce(ages, 1, (cur, prev) => cur + prev)

output reduceObjectUnion object = reduce([
  { foo: 123 }
  { bar: 456 }
  { baz: 789 }
], {}, (cur, next) => union(cur, next))
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| totalAge | int | 18 |
| totalAgeAdd1 | int | 19 |
| reduceObjectUnion | object | {"bar": 456, "baz": 789, "foo": 123} |

## sort

`sort(inputArray, predicate)`

Sorts an array with a custom sort function.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to sort.|
| predicate |Yes |lambda expression |The predicate used to compare two array elements for ordering. If true, the second element will be ordered after the first in the output array.|

### Return value

An array.

### Example

The following example shows how to use the sort function.

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

output dogsByAge array = sort(dogs, (a, b) => a.age <= b.age)
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| dogsByAge | Array | [{"name":"Indy","age":2,"interests":["Butter"]},{"name":"Casper","age":3,"interests":["Other dogs"]},{"name":"Evie","age":5,"interests":["Ball","Frisbee"]},{"name":"Kira","age":8,"interests":["Rubs"]}] |

## Next steps

- See [Bicep functions - arrays](./bicep-functions-array.md) for additional array related Bicep functions.
