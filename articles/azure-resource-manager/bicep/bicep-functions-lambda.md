---
title: Bicep functions - lambda
description: Describes the lambda functions to use in a Bicep file.
author: mumian
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.author: jgao
ms.date: 03/15/2023
---
# Lambda functions for Bicep

This article describes the lambda functions to use in Bicep. [Lambda expressions (or lambda functions)](/dotnet/csharp/language-reference/operators/lambda-expressions) are essentially blocks of code that can be passed as an argument. They can take multiple parameters, but are restricted to a single line of code. In Bicep, lambda expression is in this format:

```bicep
<lambda variable> => <expression>
```

> [!NOTE]
> The lambda functions are only supported in Bicep CLI version 0.10.61 or newer.

## Limitations

Bicep lambda function has these limitations:

- Lambda expression can only be specified directly as function arguments in these functions: [`filter()`](#filter), [`map()`](#map), [`reduce()`](#reduce), [`sort()`](#sort), and [`toObject()`](#toobject).
- Using lambda variables (the temporary variables used in the lambda expressions) inside resource or module array access isn't currently supported.
- Using lambda variables inside the [`listKeys`](./bicep-functions-resource.md#list) function isn't currently supported.
- Using lambda variables inside the [reference](./bicep-functions-resource.md#reference) function isn't currently supported.

## filter

`filter(inputArray, lambda expression)`

Filters an array with a custom filtering function.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to filter.|
| lambda expression |Yes |expression |The lambda expression is applied to each input array element. If the result is true, the item will be included in the output array; otherwise, the item is discarded.|

### Return value

An array.

### Examples

The following examples show how to use the `filter` function.

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

output oldDogs array = filter(dogs, dog => dog.age >=5)
```

The output from the preceding example shows the dogs that are five or older:

| Name | Type | Value |
| ---- | ---- | ----- |
| oldDogs | Array | [{"name":"Evie","age":5,"interests":["Ball","Frisbee"]},{"name":"Kira","age":8,"interests":["Rubs"]}] |

```bicep
var itemForLoop = [for item in range(0, 10): item]

output filteredLoop array = filter(itemForLoop, i => i > 5)
output isEven array = filter(range(0, 10), i => 0 == i % 2)
```

The output from the preceding example:

| Name | Type | Value |
| ---- | ---- | ----- |
| filteredLoop | Array | [6, 7, 8, 9] |
| isEven | Array | [0, 2, 4, 6, 8] |

**filterdLoop** shows the numbers in an array that are greater than 5; and **isEven** shows the even numbers in the array.

## map

`map(inputArray, lambda expression)`

Applies a custom mapping function to each element of an array.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to map.|
| lambda expression |Yes |expression |The lambda expression applied to each input array element, in order to generate the output array.|

### Return value

An array.

### Example

The following example shows how to use the `map` function.

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
| mapObject | Array | [{"i":0,"dog":"Evie","greeting":"Ahoy, Evie!"},{"i":1,"dog":"Casper","greeting":"Ahoy, Casper!"},{"i":2,"dog":"Indy","greeting":"Ahoy, Indy!"},{"i":3,"dog":"Kira","greeting":"Ahoy, Kira!"}] |

**dogNames** shows the dog names from the array of objects; **sayHi** concatenates "Hello" and each of the dog names; and **mapObject** creates another array of objects.

## reduce

`reduce(inputArray, initialValue, lambda expression)`

Reduces an array with a custom reduce function.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to reduce.|
| initialValue |No |any |Initial value.|
| lambda expression |Yes |expression |The lambda expression used to aggregate the current value and the next value.|

### Return value

Any.

### Example

The following examples show how to use the `reduce` function.

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
output totalAge int = reduce(ages, 0, (cur, next) => cur + next)
output totalAgeAdd1 int = reduce(ages, 1, (cur, next) => cur + next)
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| totalAge | int | 18 |
| totalAgeAdd1 | int | 19 |

**totalAge** sums the ages of the dogs; **totalAgeAdd1** has an initial value of 1, and adds all the dog ages to the initial values.

```bicep
output reduceObjectUnion object = reduce([
  { foo: 123 }
  { bar: 456 }
  { baz: 789 }
], {}, (cur, next) => union(cur, next))
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| reduceObjectUnion | object | {"foo":123,"bar":456,"baz":789} |

The [union](./bicep-functions-object.md#union) function returns a single object with all elements from the parameters. The function call unionizes the key value pairs of the objects into a new object.

## sort

`sort(inputArray, lambda expression)`

Sorts an array with a custom sort function.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to sort.|
| lambda expression |Yes |expression |The lambda expression used to compare two array elements for ordering. If true, the second element will be ordered after the first in the output array.|

### Return value

An array.

### Example

The following example shows how to use the `sort` function.

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

output dogsByAge array = sort(dogs, (a, b) => a.age < b.age)
```

The output from the preceding example sorts the dog objects from the youngest to the oldest:

| Name | Type | Value |
| ---- | ---- | ----- |
| dogsByAge | Array | [{"name":"Indy","age":2,"interests":["Butter"]},{"name":"Casper","age":3,"interests":["Other dogs"]},{"name":"Evie","age":5,"interests":["Ball","Frisbee"]},{"name":"Kira","age":8,"interests":["Rubs"]}] |

## toObject

`toObject(inputArray, lambda expression, [lambda expression])`

Converts an array to an object with a custom key function and optional custom value function. See [items](bicep-functions-object.md#items) about converting an object to an array.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array used for creating an object.|
| lambda expression |Yes |expression |The lambda expression used to provide the key predicate.|
| lambda expression |No |expression |The lambda expression used to provide the value predicate.|

### Return value

An object.

### Example

The following example shows how to use the `toObject` function with the two required parameters:

```Bicep
var dogs = [
  {
    name: 'Evie'
    age: 5
    interests: [ 'Ball', 'Frisbee' ]
  }
  {
    name: 'Casper'
    age: 3
    interests: [ 'Other dogs' ]
  }
  {
    name: 'Indy'
    age: 2
    interests: [ 'Butter' ]
  }
  {
    name: 'Kira'
    age: 8
    interests: [ 'Rubs' ]
  }
]

output dogsObject object = toObject(dogs, entry => entry.name)
```

The preceding example generates an object based on an array.

| Name | Type | Value |
| ---- | ---- | ----- |
| dogsObject | Object | {"Evie":{"name":"Evie","age":5,"interests":["Ball","Frisbee"]},"Casper":{"name":"Casper","age":3,"interests":["Other dogs"]},"Indy":{"name":"Indy","age":2,"interests":["Butter"]},"Kira":{"name":"Kira","age":8,"interests":["Rubs"]}} |

The following `toObject` function with the third parameter provides the same output.

```Bicep
output dogsObject object = toObject(dogs, entry => entry.name, entry => entry)
```

The following example shows how to use the `toObject` function with three parameters.

```Bicep
var dogs = [
  {
    name: 'Evie'
    properties: {
      age: 5
      interests: [ 'Ball', 'Frisbee' ]
    }
  }
  {
    name: 'Casper'
    properties: {
      age: 3
      interests: [ 'Other dogs' ]
    }
  }
  {
    name: 'Indy'
    properties: {
      age: 2
      interests: [ 'Butter' ]
    }
  }
  {
    name: 'Kira'
    properties: {
      age: 8
      interests: [ 'Rubs' ]
    }
  }
]
output dogsObject object = toObject(dogs, entry => entry.name, entry => entry.properties)
```

The preceding example generates an object based on an array.

| Name | Type | Value |
| ---- | ---- | ----- |
| dogsObject | Object | {"Evie":{"age":5,"interests":["Ball","Frisbee"]},"Casper":{"age":3,"interests":["Other dogs"]},"Indy":{"age":2,"interests":["Butter"]},"Kira":{"age":8,"interests":["Rubs"]}} |

## Next steps

- See [Bicep functions - arrays](./bicep-functions-array.md) for additional array related Bicep functions.
