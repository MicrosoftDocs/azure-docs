---
title: Template functions - lambda
description: Describes the lambda functions to use in an Azure Resource Manager template (ARM template)
ms.topic: reference
ms.custom: devx-track-arm-template
ms.date: 02/12/2025
---

# Lambda functions for ARM templates

This article describes the lambda functions to use in ARM templates. [Lambda functions](/dotnet/csharp/language-reference/operators/lambda-expressions) are essentially blocks of code that can be passed as an argument. They can take multiple parameters, but are restricted to a single line of code. In Bicep, lambda expression is in this format:

```bicep
lambda(<lambda variable>, [<lambda variable>, ...], <expression>)
```

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [deployment](../bicep/bicep-functions-deployment.md) functions.

## Limitations

ARM template lambda function has these limitations:

- Lambda expression can only be specified directly as function arguments in these functions: [`filter()`](#filter), [`groupBy()`](#groupby), [`map()`](#map), [`mapValues()`](#mapvalues), [`reduce()`](#reduce), [`sort()`](#sort), and [`toObject()`](#toobject).
- Using lambda variables (the temporary variables used in the lambda functions) inside resource or module array access isn't currently supported.
- Using lambda variables inside the [`listKeys`](./template-functions-resource.md#list) function isn't currently supported.
- Using lambda variables inside the [reference](./template-functions-resource.md#reference) function isn't currently supported.

## filter

`filter(inputArray, lambda function)`

Filters an array with a custom filtering function.

In Bicep, use the [filter](../bicep/bicep-functions-lambda.md#filter) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to filter.|
| lambda function |Yes |expression |The lambda function applied to each input array element. If false, the item is filtered out of the output array.|

### Return value

An array.

### Examples

The following examples show how to use the `filter` function.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "dogs": [
      {
        "name": "Evie",
        "age": 5,
        "interests": [
          "Ball",
          "Frisbee"
        ]
      },
      {
        "name": "Casper",
        "age": 3,
        "interests": [
          "Other dogs"
        ]
      },
      {
        "name": "Indy",
        "age": 2,
        "interests": [
          "Butter"
        ]
      },
      {
        "name": "Kira",
        "age": 8,
        "interests": [
          "Rubs"
        ]
      }
    ]
  },
  "resources": [],
  "outputs": {
    "oldDogs": {
      "type": "array",
      "value": "[filter(variables('dogs'), lambda('dog', greaterOrEquals(lambdaVariables('dog').age, 5)))]"
    },
    "dogNameIndex": {
      "type": "array",
      "value": "[filter(variables('dogs'), lambda('val', 'i', and(less(lambdaVariables('i'), 2), equals(substring(lambdaVariables('val').name, 0, 1), 'C'))))]"
    }
  }
}
```

The outputs from the preceding example:

| Name | Type | Value |
| ---- | ---- | ----- |
| oldDogs | Array | [{"name":"Evie","age":5,"interests":["Ball","Frisbee"]},{"name":"Kira","age":8,"interests":["Rubs"]}] |
| dogNameIndex | Array | [{"name":"Casper","age":3,"interests":["Other dogs"]}] |

**oldDogs** lists the dogs that are five or older; **dogNameIndex** identifies the dogs whose index number is less than two and whose name starts with the letter "C". 

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "copy": [
      {
        "name": "itemForLoop",
        "count": "[length(range(0, 10))]",
        "input": "[range(0, 10)[copyIndex('itemForLoop')]]"
      }
    ]
  },
  "resources": [],
  "outputs": {
    "filteredLoop": {
      "type": "array",
      "value": "[filter(variables('itemForLoop'), lambda('i', greater(lambdaVariables('i'), 5)))]"
    },
    "isEven": {
      "type": "array",
      "value": "[filter(range(0, 10), lambda('i', equals(0, mod(lambdaVariables('i'), 2))))]"
    }
  }
}
```

The output from the preceding example:

| Name | Type | Value |
| ---- | ---- | ----- |
| filteredLoop | Array | [6, 7, 8, 9] |
| isEven | Array | [0, 2, 4, 6, 8] |

**filterdLoop** shows the numbers in an array that are greater than 5; and **isEven** shows the even numbers in the array.

## groupBy

`groupBy(inputArray, lambda expression)`

Creates an object with array values from an array, using a grouping condition.

In Bicep, use the [groupBy](../bicep/bicep-functions-lambda.md#groupby) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array for grouping.|
| lambda expression |Yes |expression |The lambda expression is applied to each input array element, and group the elements using the grouping condition.|

### Return value

An object.

### Examples

The following example shows how to use the `groupBy` function.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "inputArray": [
      "foo",
      "bar",
      "baz"
    ]
  },
  "resources": [],
  "outputs": {
    "outObject": {
      "type": "object",
      "value": "[groupBy(variables('inputArray'), lambda('x', substring(lambdaVariables('x'), 0, 1)))]"
    }
  }
}
```

The output from the preceding example shows the dogs that are five or older:

| Name | Type | Value |
| ---- | ---- | ----- |
| outObject | Object | {"f":["foo"],"b":["bar","baz"]} |

**outObject** shows an object that groups the array elements by their first letters.

## map

`map(inputArray, lambda function)`

Applies a custom mapping function to each element of an array.

In Bicep, use the [map](../bicep/bicep-functions-lambda.md#map) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to map.|
| lambda function |Yes |expression |The lambda function applied to each input array element, in order to generate the output array.|

### Return value

An array.

### Example

The following example shows how to use the `map` function.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "dogs": [
      {
        "name": "Evie",
        "age": 5,
        "interests": [
          "Ball",
          "Frisbee"
        ]
      },
      {
        "name": "Casper",
        "age": 3,
        "interests": [
          "Other dogs"
        ]
      },
      {
        "name": "Indy",
        "age": 2,
        "interests": [
          "Butter"
        ]
      },
      {
        "name": "Kira",
        "age": 8,
        "interests": [
          "Rubs"
        ]
      }
    ]
  },
  "resources": [],
  "outputs": {
    "dogNames": {
      "type": "array",
      "value": "[map(variables('dogs'), lambda('dog', lambdaVariables('dog').name))]"
    },
    "sayHi": {
      "type": "array",
      "value": "[map(variables('dogs'), lambda('dog', format('Hello {0}!', lambdaVariables('dog').name)))]"
    },
    "mapArray": {
      "type": "array",
      "value": "[map(range(0, length(variables('dogs'))), lambda('i', createObject('i', lambdaVariables('i'), 'dog', variables('dogs')[lambdaVariables('i')].name, 'greeting', format('Ahoy, {0}!', variables('dogs')[lambdaVariables('i')].name))))]"
    },
    "mapArrayIndex": {
      "type": "array",
      "value": "[map(variables('dogs'), lambda('x', 'i', createObject('index', lambdaVariables('i'), 'val', lambdaVariables('x').name)))]"
    }
  }
}
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| dogNames | Array | ["Evie","Casper","Indy","Kira"]  |
| sayHi | Array | ["Hello Evie!","Hello Casper!","Hello Indy!","Hello Kira!"] |
| mapArray | Array | [{"i":0,"dog":"Evie","greeting":"Ahoy, Evie!"},{"i":1,"dog":"Casper","greeting":"Ahoy, Casper!"},{"i":2,"dog":"Indy","greeting":"Ahoy, Indy!"},{"i":3,"dog":"Kira","greeting":"Ahoy, Kira!"}] |
| mapArrayIndex | Array | [{"index":0,"val":"Evie"},{"index":1,"val":"Casper"},{"index":2,"val":"Indy"},{"index":3,"val":"Kira"}] |

**dogNames** shows the dog names from the array of objects; **sayHi** concatenates "Hello" and each of the dog names; **mapArray** and **mapArrayIndex** create another two arrays of objects.

## mapValues

`mapValues(inputObject, lambda expression)`

Creates an object from an input object, using a lambda expression to map values.

In Bicep, use the [mapValues](../bicep/bicep-functions-lambda.md#mapvalues) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputObject |Yes |object |The object to map.|
| lambda expression |Yes |expression |The lambda expression used to map the values.|

### Return value

An object.

### Example

The following example shows how to use the `mapValues` function.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "inputObject": {
      "foo": "foo",
      "bar": "bar"
    }
  },
  "resources": [],
  "outputs": {
    "mapObject": {
      "type": "object",
      "value": "[mapValues(variables('inputObject'), lambda('val', toUpper(lambdaVariables('val'))))]"
    }
  }
}
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| mapObject | Object | {foo: 'FOO', bar: 'BAR'} |

**mapObject** creates another object with the values in upper case.

## reduce

`reduce(inputArray, initialValue, lambda function)`

Reduces an array with a custom reduce function.

In Bicep, use the [reduce](../bicep/bicep-functions-lambda.md#reduce) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to reduce.|
| initialValue |Yes |any |Initial value.|
| lambda function |Yes |expression |The lambda function used to aggregate the current value and the next value.|

### Return value

Any.

### Example

The following examples show how to use the `reduce` function.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "dogs": [
      {
        "name": "Evie",
        "age": 5,
        "interests": [
          "Ball",
          "Frisbee"
        ]
      },
      {
        "name": "Casper",
        "age": 3,
        "interests": [
          "Other dogs"
        ]
      },
      {
        "name": "Indy",
        "age": 2,
        "interests": [
          "Butter"
        ]
      },
      {
        "name": "Kira",
        "age": 8,
        "interests": [
          "Rubs"
        ]
      }
    ],
    "ages": "[map(variables('dogs'), lambda('dog', lambdaVariables('dog').age))]"
  },
  "resources": [],
  "outputs": {
    "totalAge": {
      "type": "int",
      "value": "[reduce(variables('ages'), 0, lambda('cur', 'next', add(lambdaVariables('cur'), lambdaVariables('next'))))]"
    },
    "totalAgeAdd1": {
      "type": "int",
      "value": "[reduce(variables('ages'), 1, lambda('cur', 'next', add(lambdaVariables('cur'), lambdaVariables('next'))))]"
    },
    "oddAge": {
      "type": "int",
      "value": "[reduce(variables('ages'), 0, lambda('cur', 'next', 'i', if(equals(mod(lambdaVariables('i'), 2), 0), add(lambdaVariables('cur'), lambdaVariables('next')), lambdaVariables('cur'))))]"
    }
  }
}
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| totalAge | int | 18 |
| totalAgeAdd1 | int | 19 |
| oddAge | int | 7 |

**totalAge** sums the ages of the dogs; **totalAgeAdd1** has an initial value of 1, and adds all the dog ages to the initial values. **oddAge** sums the ages of dogs that are located at even indices, specifically **5** (Evie) and **2** (Indy).

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [],
  "outputs": {
    "reduceObjectUnion": {
      "type": "object",
      "value": "[reduce(createArray(createObject('foo', 123), createObject('bar', 456), createObject('baz', 789)), createObject(), lambda('cur', 'next', union(lambdaVariables('cur'), lambdaVariables('next'))))]"
    }
  }
}
```

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| reduceObjectUnion | object | {"foo":123,"bar":456,"baz":789} |

The [union](./template-functions-object.md#union) function returns a single object with all elements from the parameters. The function call unionizes the key value pairs of the objects into a new object.

## sort

`sort(inputArray, lambda function)`

Sorts an array with a custom sort function.

In Bicep, use the [sort](../bicep/bicep-functions-lambda.md#sort) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array to sort.|
| lambda function |Yes |expression |The lambda function used to compare two array elements for ordering. If true, the second element will be ordered after the first in the output array.|

### Return value

An array.

### Example

The following example shows how to use the `sort` function.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "dogs": [
      {
        "name": "Evie",
        "age": 5,
        "interests": [
          "Ball",
          "Frisbee"
        ]
      },
      {
        "name": "Casper",
        "age": 3,
        "interests": [
          "Other dogs"
        ]
      },
      {
        "name": "Indy",
        "age": 2,
        "interests": [
          "Butter"
        ]
      },
      {
        "name": "Kira",
        "age": 8,
        "interests": [
          "Rubs"
        ]
      }
    ]
  },
  "resources": [],
  "outputs": {
    "dogsByAge": {
      "type": "array",
      "value": "[sort(variables('dogs'), lambda('a', 'b', less(lambdaVariables('a').age, lambdaVariables('b').age)))]"
    }
  }
}
```

The output from the preceding example sorts the dog objects from the youngest to the oldest:

| Name | Type | Value |
| ---- | ---- | ----- |
| dogsByAge | Array | [{"name":"Indy","age":2,"interests":["Butter"]},{"name":"Casper","age":3,"interests":["Other dogs"]},{"name":"Evie","age":5,"interests":["Ball","Frisbee"]},{"name":"Kira","age":8,"interests":["Rubs"]}] |

## toObject

`toObject(inputArray, lambda function, [lambda function])`

Converts an array to an object with a custom key function and optional custom value function. See [items](template-functions-object.md#items) about converting an object to an array.

In Bicep, use the [toObject](../templates/template-functions-lambda.md#toobject) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| inputArray |Yes |array |The array used for creating an object.|
| lambda function |Yes |expression |The lambda function used to provide the key predicate.|
| lambda function |No |expression |The lambda function used to provide the value predicate.|

### Return value

An object.

### Example

The following example shows how to use the `toObject` function with the two required parameters:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "dogs": [
      {
        "name": "Evie",
        "age": 5,
        "interests": [
          "Ball",
          "Frisbee"
        ]
      },
      {
        "name": "Casper",
        "age": 3,
        "interests": [
          "Other dogs"
        ]
      },
      {
        "name": "Indy",
        "age": 2,
        "interests": [
          "Butter"
        ]
      },
      {
        "name": "Kira",
        "age": 8,
        "interests": [
          "Rubs"
        ]
      }
    ]
  },
  "resources": [],
  "outputs": {
    "dogsObject": {
      "type": "object",
      "value": "[toObject(variables('dogs'), lambda('entry', lambdaVariables('entry').name))]"
    }
  }
}
```

The preceding example generates an object based on an array.

| Name | Type | Value |
| ---- | ---- | ----- |
| dogsObject | Object | {"Evie":{"name":"Evie","age":5,"interests":["Ball","Frisbee"]},"Casper":{"name":"Casper","age":3,"interests":["Other dogs"]},"Indy":{"name":"Indy","age":2,"interests":["Butter"]},"Kira":{"name":"Kira","age":8,"interests":["Rubs"]}} |

The following `toObject` function with the third parameter provides the same output.

```json
"outputs": {
  "dogsObject": {
    "type": "object",
    "value": "[toObject(variables('dogs'), lambda('entry', lambdaVariables('entry').name), lambda('entry', lambdaVariables('entry')))]"
  }
}
```

The following example shows how to use the `toObject` function with three parameters.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "dogs": [
      {
        "name": "Evie",
        "properties": {
          "age": 5,
          "interests": [
            "Ball",
            "Frisbee"
          ]
        }
      },
      {
        "name": "Casper",
        "properties": {
          "age": 3,
          "interests": [
            "Other dogs"
          ]
        }
      },
      {
        "name": "Indy",
        "properties": {
          "age": 2,
          "interests": [
            "Butter"
          ]
        }
      },
      {
        "name": "Kira",
        "properties": {
          "age": 8,
          "interests": [
            "Rubs"
          ]
        }
      }
    ]
  },
  "resources": [],
  "outputs": {
    "dogsObject": {
      "type": "object",
      "value": "[toObject(variables('dogs'), lambda('entry', lambdaVariables('entry').name), lambda('entry', lambdaVariables('entry').properties))]"
    }
  }
}
```

The preceding example generates an object based on an array.

| Name | Type | Value |
| ---- | ---- | ----- |
| dogsObject | Object | {"Evie":{"age":5,"interests":["Ball","Frisbee"]},"Casper":{"age":3,"interests":["Other dogs"]},"Indy":{"age":2,"interests":["Butter"]},"Kira":{"age":8,"interests":["Rubs"]}} |

## Next steps

- See [Template functions - arrays](./template-functions-array.md) for more array related template functions.
