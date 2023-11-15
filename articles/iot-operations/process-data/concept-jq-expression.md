---
title: Data Processor jq expressions
description: Understand the jq expressions used by Azure IoT Data Processor to operate on messages in the pipeline.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.custom:
  - ignite-2023
ms.date: 09/07/2023

#CustomerIntent: As an operator, I want to understand the jq expressions used by Data Processor so that I can configure my pipeline stages.
---

# What are jq expressions?

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

_jq expressions_ provide a powerful way to perform computations and manipulations on data pipeline messages. This guide demonstrates language patterns and approaches for common computation and processing needs in your data pipelines.

> [!TIP]
> To try out the examples in this guide, you can use the [jq playground](https://jqplay.org/) and paste the example inputs and expressions into the editor.

## Language fundamentals

If you're not familiar with jq as a language, this language fundamentals section provides some background information.

### Functional programming

The jq language is a functional programming language. Every operation takes an input and produces an output. Multiple operations are combined together to perform complex logic. For example, given the following input:

```json
{
  "payload": {
    "temperature": 25
  }
}
```

Here's a simple jq expression that specifies a path to retrieve:

```jq
.payload.temperature
```

This path is an operation that takes a value as input and outputs another value. In this example, the output value is `25`.

There are some important considerations when you work with complex, chained operations in jq:

- Any data not returned by an operation is no longer available in the rest of the expression. There are some ways around this constraint, but in general you should think about what data you need later in the expression and prevent it from dropping out of previous operations.
- Expressions are best thought of as a series of data transformations rather than a set of computations to perform. Even operations such as assignments are just a transformation of the overall value where one field has changed.

### Everything is an expression

In most nonfunctional languages, there's a distinction between two types of operation:

- _Expressions_ that produce a value that can be used in the context of another expression.
- _Statements_ that create some form of side-effect rather than directly manipulating an input and output.

With a few exceptions, everything in jq is an expression. Loops, if/else operations, and even assignments are all expressions that produce a new value, rather than creating a side effect in the system. For example, given the following input:

```json
{
  "temperature": 21,
  "humidity": 65
}
```

If I wanted to change the `humidity` field to `63`, you can use an assignment expression:

```jq
.humidity = 63
```

While this expression appears to change the input object, in jq it's producing a new object with a new value for `humidity`:

```json
{
  "temperature": 21,
  "humidity": 65
}
```

This difference seems subtle, but it means that you can chain the result of this operation with further operations by using `|`, as described later.

### Chain operations with a pipe: `|`

Performing computations and data manipulation in jq often requires you to combine multiple operations together. You chain operations by placing a `|` between them. For example, to compute the length of an array of data in a message:

```json
{
  "data": [5, 2, 4, 1]
}
```

First, isolate the portion of the message that holds the array:

```jq
.data
```

This expression gives you just the array:

```json
[5, 2, 4, 1]
```

Then, use the `length` operation to compute the length of that array:

```jq
length
```

This expression gives you your answer:

```json
4
```

Use the `|` operator as the separator between the steps, so as a single jq expression, the computation becomes:

```jq
.data | length
```

If you're trying to perform a complex transformation and you don't see an example here that matches your problem exactly, it's likely that you can solve your problem by chaining multiple solutions in this guide with the `|` symbol.

### Function inputs and arguments

One of the primary operations in jq is calling a function. Functions in jq come in many forms and can take varying numbers of inputs. Function inputs come in two forms:

- **Data context** - the data that's automatically fed into the function by jq. Typically the data produced by the operation before the most recent `|` symbol.
- **Function arguments** - other expressions and values that you provide to configure the behavior of a function.

Many functions have zero arguments and do all of their work by using the data context that jq provides. The `length` function is an example:

```jq
["a", "b", "c"] | length
```

In the previous example, the input to `length` is the array created to the left of the `|` symbol. The function doesn't need any other inputs to compute the length of the input array. You call functions with zero arguments by using their name only. In other words, use `length`, not `length()`.

Some functions combine the data context with a single argument to define their behavior. For example, the `map` function:

```jq
[1, 2, 3] | map(. * 2)
```

In the previous example, the input to `map` is the array of numbers created to the left of the `|` symbol. The  `map` function executes an expression against each element of the input array. You provide the expression as an argument to `map`, in this case `. * 2` to multiply the value of each entry in the array by 2 to output the array `[2, 4, 6]`. You can configure any internal behavior you want with the map function.

Some functions take more than one argument. These functions work the same way as the single argument functions and use the `;` symbol to separate the arguments. For example, the `sub` function:

```jq
"Hello World" | sub("World"; "jq!")
```

In the previous example, the `sub` function receives "Hello World" as its input data context and then takes two arguments:

- A regular expression to search for in the string.
- A string to replace any matching substring. Separate the arguments with the `;` symbol. The same pattern applies to functions with more than two arguments.

> [!IMPORTANT]
> Be sure to use `;` as the argument separator and not `,`.

## Work with objects

There are many ways to extract data from, manipulate, and construct objects in jq. The following sections describe some of the most common patterns:

### Extract values from an object

To retrieve keys, you typically use a path expression. This operation is often combined with other operations to get more complex results.

It's easy to retrieve data from objects. When you need to retrieve many pieces of data from non-object structures, a common pattern is to convert non-object structures into objects. Given the following input:

```json
{
  "payload": {
    "values": {
      "temperature": 45,
      "humidity": 67
    }
  }
}
```

Use the following expression to retrieve the humidity value:

```jq
.payload.values.humidity
```

This expression generates the following output:

```json
67
```

### Change keys in an object

To rename or modify object keys, you can use the `with_entries` function. This function takes an expression that operates on the key/value pairs of an object and returns a new object with the results of the expression.

The following example shows you how to rename the `temp` field to `temperature` to align with a downstream schema. Given the following input:

```json
{
  "payload": {
    "temp": 45,
    "humidity": 67
  }
}
```

Use the following expression to rename the `temp` field to `temperature`:

```jq
.payload |= with_entries(if .key == "temp" then .key = "temperature" else . end)
```

In the previous jq expression:

- `.payload |= <expression>` uses `|=` to update the value of `.payload` with the result of running `<expression>`. Using `|=` instead of `=` sets the data context of `<expression>` to `.payload` rather than `.`.
- `with_entries(<expression>)` is a shorthand for running several operations together. It does the following operations:
  - Takes an object as input and converts each key/value pair to an entry with structure `{"key": <key>, "value": <value>}`.
  - Runs `<expression>` against each entry generated from the object, replacing the input value of that entry with the result of running `<expression>`.
  - Converts the transformed set of entries back into an object, using `key` as the key in the key/value pair and `value` as the key's value.
- `if .key == "temp" then .key = "temperature" else . end` performs conditional logic against the key of the entry. If the key is `temp` then it's converted to `temperature` leaving the value is unchanged. If the key isn't `temp`, the entry is left unchanged by returning `.` from the expression.

The following JSON shows the output from the previous expression:

```json
{
  "payload": {
    "temperature": 45,
    "humidity": 67
  }
}
```

### Convert an object to an array

While objects are useful for accessing data, arrays are often more useful when you want to [split messages](#split-messages-apart) or dynamically combine information. Use `to_entries` to convert an object to an array.

The following example shows you how to convert the `payload` field to an array. Given the following input:

```json
{
  "id": "abc",
  "payload": {
    "temperature": 45,
    "humidity": 67
  }
}
```

Use the following expression to convert the payload field to an array:

```jq
.payload | to_entries
```

The following JSON is the output from the previous jq expression:

```json
[
  {
    "key": "temperature",
    "value": 45
  },
  {
    "key": "humidity",
    "value": 67
  }
]
```

> [!TIP]
> This example simply extracts the array and discards any other information in the message. To preserve the overall message but swap the structure of the `.payload` to an array, use `.payload |= to_entries` instead.

### Create objects

You construct objects using syntax that's similar to JSON, where you can provide a mix of static and dynamic information.

The following example shows you how to completely restructure an object by creating a new object with renamed fields and an updated structure. Given the following input:

```json
{
  "payload": {
    "Timestamp": 1681926048,
    "Payload": {
      "dtmi:com:prod1:slicer3345:humidity": {
        "SourceTimestamp": 1681926048,
        "Value": 10
      },
      "dtmi:com:prod1:slicer3345:lineStatus": {
        "SourceTimestamp": 1681926048,
        "Value": [1, 5, 2]
      },
      "dtmi:com:prod1:slicer3345:speed": {
        "SourceTimestamp": 1681926048,
        "Value": 85
      },
      "dtmi:com:prod1:slicer3345:temperature": {
        "SourceTimestamp": 1681926048,
        "Value": 46
      }
    },
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092
  }
}
```

Use the following jq expression to create an object with the new structure:

```jq
{
  payload: {
    humidity: .payload.Payload["dtmi:com:prod1:slicer3345:humidity"].Value,
    lineStatus: .payload.Payload["dtmi:com:prod1:slicer3345:lineStatus"].Value,
    temperature: .payload.Payload["dtmi:com:prod1:slicer3345:temperature"].Value
  },
  (.payload.DataSetWriterName): "active"
}
```

In the previous jq expression:

- `{payload: {<fields>}}` creates an object with a literal field named `payload` that is itself a literal object containing more fields. This approach is the most basic way to construct objects.
- `humidity: .payload.Payload["dtmi:com:prod1:slicer3345:humidity"].Value,` creates a static key name with a dynamically computed value. The data context for all expressions within object construction is the full input to the object construction expression, in this case the full message.
- `(.payload.DataSetWriterName): "active"` is an example of a dynamic object key. In this example, the value of `.payload.DataSetWriterName` is mapped to a static value. Use static and dynamic keys and values in any combination when you create an object.

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": {
    "humidity": 10,
    "lineStatus": [1, 5, 2],
    "temperature": 46
  },
  "slicer-3345": "active"
}
```

### Add fields to an object

You can augment an object by adding fields to provide extra context for the data. Use an assignment to a field that doesn't exist.

The following example shows how to add an `averageVelocity` field to the payload. Given the following input:

```json
{
  "payload": {
    "totalDistance": 421,
    "elapsedTime": 1598
  }
}
```

Use the following jq expression to add an `averageVelocity` field to the payload:

```jq
.payload.averageVelocity = (.payload.totalDistance / .payload.elapsedTime)
```

Unlike other examples that use the `|=` symbol, this example uses a standard assignment, `=`. Therefore it doesn't scope the expression on the right hand side to the field on the left. This approach is necessary so that you can access other fields on the payload.

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": {
    "totalDistance": 421,
    "elapsedTime": 1598,
    "averageVelocity": 0.2634543178973717
  }
}
```

### Conditionally add fields to an object

Combining conditional logic with the syntax for adding fields to an object enables scenarios such as adding default values for fields that aren't present.

The following example shows you how to add a unit to any temperature measurements that don't have one. The default unit is celsius. Given the following input:

```json
{
  "payload": [
    {
      "timestamp": 1689712296407,
      "temperature": 59.2,
      "unit": "fahrenheit"
    },
    {
      "timestamp": 1689712399609,
      "temperature": 52.2
    },
    {
      "timestamp": 1689712400342,
      "temperature": 50.8,
      "unit": "celsius"
    }
  ]
}
```

Use the following jq expression to add a unit to any temperature measurements that don't have one:

```jq
.payload |= map(.unit //= "celsius")
```

In the previous jq expression:

- `.payload |= <expression>` uses `|=` to update the value of `.payload` with the result of running `<expression>`. Using `|=` instead of `=` sets the data context of `<expression>` to `.payload` rather than `.`.
- `map(<expression>)` executes `<expression>` against each entry in the array and replaces the input value with whatever `<expression>` produces.
- `.unit //= "celsius"` uses the special `//=` assignment. This assignment combines (`=`) with the alternative operator (`//`) to  assign the existing value of `.unit` to itself if it's not `false` or `null`. If `.unit` is false or null, then the expression assigns `"celsius"` as the value of `.unit`, creating `.unit` if necessary.

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": [
    {
      "timestamp": 1689712296407,
      "temperature": 59.2,
      "unit": "fahrenheit"
    },
    {
      "timestamp": 1689712399609,
      "temperature": 52.2,
      "unit": "celsius"
    },
    {
      "timestamp": 1689712400342,
      "temperature": 50.8,
      "unit": "celsius"
    }
  ]
}
```

### Remove fields from an object

Use the `del` function to remove unnecessary fields from an object.

The following example shows how to remove the `timestamp` field because it's not relevant to the rest of the computation. Given the following input:

```json
{
  "payload": {
    "timestamp": "2023-07-18T20:57:23.340Z",
    "temperature": 153,
    "pressure": 923,
    "humidity": 24
  }
}
```

Use the following jq expression removes the `timestamp` field:

```jq
del(.payload.timestamp)
```

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": {
    "temperature": 153,
    "pressure": 923,
    "humidity": 24
  }
}
```

## Work with arrays

Arrays are the core building block for iteration and message splitting in jq. The following examples show you how to manipulate arrays.

### Extract values from an array

Arrays are more difficult to inspect than objects because data can be located in different indexes of the array in different messages. Therefore, to extract values from an array you often have to search through the array for the data you need.

The following example shows you how to extract a few values from an array to create a new object that holds the data you're interested in. Given the following input:

```json
{
  "payload": {
    "data": [
      {
        "field": "dtmi:com:prod1:slicer3345:humidity",
        "value": 10
      },
      {
        "field": "dtmi:com:prod1:slicer3345:lineStatus",
        "value": [1, 5, 2]
      },
      {
        "field": "dtmi:com:prod1:slicer3345:speed",
        "value": 85
      },
      {
        "field": "dtmi:com:prod1:slicer3345:temperature",
        "value": 46
      }
    ],
    "timestamp": "2023-07-18T20:57:23.340Z"
  }
}
```

Use the following jq expression to extract the `timestamp`, `temperature`, `humidity`, and `pressure` values from the array to create a new object:

```jq
.payload |= {
    timestamp,
    temperature: .data | map(select(.field == "dtmi:com:prod1:slicer3345:temperature"))[0]?.value,
    humidity: .data | map(select(.field == "dtmi:com:prod1:slicer3345:humidity"))[0]?.value,
    pressure: .data | map(select(.field == "dtmi:com:prod1:slicer3345:pressure"))[0]?.value,
}
```

In the previous jq expression:

- `.payload |= <expression>` uses `|=` to update the value of `.payload` with the result of running `<expression>`. Using `|=` instead of `=` sets the data context of `<expression>` to `.payload` rather than `.`.
- `{timestamp, <other-fields>}` is shorthand for `timestamp: .timestamp`, which adds the timestamp as a field to the object using the field of the same name from the original object. `<other-fields>` adds more fields to the object.
- `temperature: <expression>, humidity: <expression>, pressure: <expression>` set temperature, humidity, and pressure in the resulting object based on the results of the three expressions.
- `.data | <expression>` scopes the value computation to the `data` array of the payload and executes `<expression>` on the array.
- `map(<expression>)[0]?.value` does several things:
  - `map(<expression>)` executes `<expression>` against each element in the array returning the result of running that expression against each element.
  - `[0]` extracts the first element of the resulting array.
  - `?` enables further chaining of a path segment, even if the preceding value is null. When the preceding value is null, the subsequent path also returns null rather than failing.
  - `.value` extracts the `value` field from the result.
- `select(.field == "dtmi:com:prod1:slicer3345:temperature")` executes the boolean expression inside of `select()` against the input. If the result is true, the input is passed through. If the result is false, the input is dropped. `map(select(<expression>))` is a common combination that's used to filter elements in an array.

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": {
    "timestamp": "2023-07-18T20:57:23.340Z",
    "temperature": 46,
    "humidity": 10,
    "pressure": null
  }
}
```

### Change array entries

Modify entries in an array with a `map()` expression. Use these expressions to modify each element of the array.

The following example shows you how to convert the timestamp of each entry in the array from a unix millisecond time to an RFC3339 string. Given the following input:

```json
{
  "payload": [
    {
      "field": "humidity",
      "timestamp": 1689723806615,
      "value": 10
    },
    {
      "field": "lineStatus",
      "timestamp": 1689723849747,
      "value": [1, 5, 2]
    },
    {
      "field": "speed",
      "timestamp": 1689723868830,
      "value": 85
    },
    {
      "field": "temperature",
      "timestamp": 1689723880530,
      "value": 46
    }
  ]
}
```

Use the following jq expression to convert the timestamp of each entry in the array from a unix millisecond time to an RFC3339 string:

```jq
.payload |= map(.timestamp |= (. / 1000 | strftime("%Y-%m-%dT%H:%M:%SZ")))
```

In the previous jq expression:

- `.payload |= <expression>` uses `|=` to update the value of `.payload` with the result of running `<expression>`. Using `|=` instead of `=` sets the data context of `<expression>` to `.payload` rather than `.`.
- `map(<expression>)` executes `<expression>` against each element in the array, replacing each with the output of running `<expression>`.
- `.timestamp |= <expression>` sets timestamp to a new value based on running `<expression>`, where the data context for `<expression>` is the value of `.timestamp`.
- `(. / 1000 | strftime("%Y-%m-%dT%H:%M:%SZ"))` converts the millisecond time to seconds and uses a time string formatter to produce an ISO 8601 timestamp.

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": [
    {
      "field": "humidity",
      "timestamp": "2023-07-18T23:43:26Z",
      "value": 10
    },
    {
      "field": "lineStatus",
      "timestamp": "2023-07-18T23:44:09Z",
      "value": [1, 5, 2]
    },
    {
      "field": "speed",
      "timestamp": "2023-07-18T23:44:28Z",
      "value": 85
    },
    {
      "field": "temperature",
      "timestamp": "2023-07-18T23:44:40Z",
      "value": 46
    }
  ]
}
```

### Convert an array to an object

To restructure an array into an object so that it's easier to access or conforms to a desired schema, use `from_entries`. Given the following input:

```json
{
  "payload": [
    {
      "field": "humidity",
      "timestamp": 1689723806615,
      "value": 10
    },
    {
      "field": "lineStatus",
      "timestamp": 1689723849747,
      "value": [1, 5, 2]
    },
    {
      "field": "speed",
      "timestamp": 1689723868830,
      "value": 85
    },
    {
      "field": "temperature",
      "timestamp": 1689723880530,
      "value": 46
    }
  ]
}
```

Use the following jq expression to convert the array into an object:

```jq
.payload |= (
    map({key: .field, value: {timestamp, value}})
    | from_entries
)
```

In the previous jq expression:

- `.payload |= <expression>` uses `|=` to update the value of `.payload` with the result of running `<expression>`. Using `|=` instead of `=` sets the data context of `<expression>` to `.payload` rather than `.`.
- `map({key: <expression>, value: <expression>})` converts each element of the array into an object of the form `{"key": <data>, "value": <data>}`, which is the structure  `from_entries` needs.
- `{key: .field, value: {timestamp, value}}` creates an object from an array entry, mapping `field` to the key and creating a value that's an object holding `timestamp` and `value`. `{timestamp, value}` is shorthand for `{timestamp: .timestamp, value: .value}`.
- `<expression> | from_entries` converts an array-valued `<expression>` into an object, mapping the `key` field of each array entry to the object key and the `value` field of each array entry to that key's value.

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": {
    "humidity": {
      "timestamp": 1689723806615,
      "value": 10
    },
    "lineStatus": {
      "timestamp": 1689723849747,
      "value": [1, 5, 2]
    },
    "speed": {
      "timestamp": 1689723868830,
      "value": 85
    },
    "temperature": {
      "timestamp": 1689723880530,
      "value": 46
    }
  }
}
```

### Create arrays

Creating array literals is similar to creating object literals. The jq syntax for an array literal is similar JSON and JavaScript.

The following example shows you how to extract some values into a simple array for later processing.

Given the following input:

```json
{
  "payload": {
    "temperature": 14,
    "humidity": 56,
    "pressure": 910
  }
}
```

Use the following jq expression creates an array from the values of the `temperature`, `humidity`, and `pressure` fields:

```jq
.payload |= ([.temperature, .humidity, .pressure])
```

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": [14, 56, 910]
}
```

### Add entries to an array

You can add entries to the beginning or end of an array by using the `+` operator with the array and its new entries. The `+=` operator simplifies this operation by automatically updating the array with the new entries at the end. Given the following input:

```json
{
  "payload": {
    "Timestamp": 1681926048,
    "Payload": {
      "dtmi:com:prod1:slicer3345:humidity": {
        "SourceTimestamp": 1681926048,
        "Value": 10
      },
      "dtmi:com:prod1:slicer3345:lineStatus": {
        "SourceTimestamp": 1681926048,
        "Value": [1, 5, 2]
      },
      "dtmi:com:prod1:slicer3345:speed": {
        "SourceTimestamp": 1681926048,
        "Value": 85
      },
      "dtmi:com:prod1:slicer3345:temperature": {
        "SourceTimestamp": 1681926048,
        "Value": 46
      }
    },
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092
  }
}
```

Use the following jq expression to add the values `12` and `41` to the end of the `lineStatus` value array:

```jq
.payload.Payload["dtmi:com:prod1:slicer3345:lineStatus"].Value += [12, 41]
```

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": {
    "Timestamp": 1681926048,
    "Payload": {
      "dtmi:com:prod1:slicer3345:humidity": {
        "SourceTimestamp": 1681926048,
        "Value": 10
      },
      "dtmi:com:prod1:slicer3345:lineStatus": {
        "SourceTimestamp": 1681926048,
        "Value": [1, 5, 2, 12, 41]
      },
      "dtmi:com:prod1:slicer3345:speed": {
        "SourceTimestamp": 1681926048,
        "Value": 85
      },
      "dtmi:com:prod1:slicer3345:temperature": {
        "SourceTimestamp": 1681926048,
        "Value": 46
      }
    },
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092
  }
}
```

### Remove entries from an array

Use the `del` function to remove entries from an array in the same way as for an object. Given the following input:

```json
{
  "payload": {
    "Timestamp": 1681926048,
    "Payload": {
      "dtmi:com:prod1:slicer3345:humidity": {
        "SourceTimestamp": 1681926048,
        "Value": 10
      },
      "dtmi:com:prod1:slicer3345:lineStatus": {
        "SourceTimestamp": 1681926048,
        "Value": [1, 5, 2]
      },
      "dtmi:com:prod1:slicer3345:speed": {
        "SourceTimestamp": 1681926048,
        "Value": 85
      },
      "dtmi:com:prod1:slicer3345:temperature": {
        "SourceTimestamp": 1681926048,
        "Value": 46
      }
    },
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092
  }
}
```

Use the following jq expression to remove the second entry from the `lineStatus` value array:

```jq
del(.payload.Payload["dtmi:com:prod1:slicer3345:lineStatus"].Value[1])
```

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": {
    "Timestamp": 1681926048,
    "Payload": {
      "dtmi:com:prod1:slicer3345:humidity": {
        "SourceTimestamp": 1681926048,
        "Value": 10
      },
      "dtmi:com:prod1:slicer3345:lineStatus": {
        "SourceTimestamp": 1681926048,
        "Value": [1, 2]
      },
      "dtmi:com:prod1:slicer3345:speed": {
        "SourceTimestamp": 1681926048,
        "Value": 85
      },
      "dtmi:com:prod1:slicer3345:temperature": {
        "SourceTimestamp": 1681926048,
        "Value": 46
      }
    },
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092
  }
}
```

### Remove duplicate array entries

If array elements overlap, you can remove the duplicate entries. In most programming languages, you can remove duplicates by using side lookup variables. In jq, the best approach is to organize the data into how it should be processed, then perform any operations before you convert it back to the desired format.

The following example shows you how to take a message with some values in it and then filter it so that you only have the latest reading for each value. Given the following input:

```json
{
  "payload": [
    {
      "name": "temperature",
      "value": 12,
      "timestamp": 1689727870701
    },
    {
      "name": "humidity",
      "value": 51,
      "timestamp": 1689727944440
    },
    {
      "name": "temperature",
      "value": 15,
      "timestamp": 1689727994085
    },
    {
      "name": "humidity",
      "value": 25,
      "timestamp": 1689727914558
    },
    {
      "name": "temperature",
      "value": 31,
      "timestamp": 1689727987072
    }
  ]
}
```

Use the following jq expression to filter the input so that you only have the latest reading for each value:

```jq
.payload |= (group_by(.name) | map(sort_by(.timestamp)[-1]))
```

> [!TIP]
> If you didn't care about retrieving the most recent value for each name, you can simplify the expression to `.payload |= unique_by(.name)`

In the previous jq expression:

- `.payload |= <expression>` uses `|=` to update the value of `.payload` with the result of running `<expression>`. Using `|=` instead of `=` sets the data context of `<expression>` to `.payload` rather than `.`.
- `group_by(.name)` given an array as an input, places elements into sub-arrays based on the value of `.name` in each element. Each sub-array contains all elements from the original array with the same value of `.name`.
- `map(<expression>)` takes the array of arrays produced by `group_by` and executes `<expression>` against each of the sub-arrays.
- `sort_by(.timestamp)[-1]` extracts the element you care about from each sub-array:
  - `sort_by(.timestamp)` orders the elements by increasing value of their `.timestamp` field for the current sub-array.
  - `[-1]` retrieves the last element from the sorted sub-array, which is the entry with the most recent time for each name.

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": [
    {
      "name": "humidity",
      "value": 51,
      "timestamp": 1689727944440
    },
    {
      "name": "temperature",
      "value": 15,
      "timestamp": 1689727994085
    }
  ]
}
```

### Compute values across array elements

You can combine the values of array elements to calculate values such as averages across the elements.

This example shows you how to reduce the array by retrieving the highest timestamp and the average value for entries that share the same name. Given the following input:

```json
{
  "payload": [
    {
      "name": "temperature",
      "value": 12,
      "timestamp": 1689727870701
    },
    {
      "name": "humidity",
      "value": 51,
      "timestamp": 1689727944440
    },
    {
      "name": "temperature",
      "value": 15,
      "timestamp": 1689727994085
    },
    {
      "name": "humidity",
      "value": 25,
      "timestamp": 1689727914558
    },
    {
      "name": "temperature",
      "value": 31,
      "timestamp": 1689727987072
    }
  ]
}
```

Use the following jq expression to retrieve the highest timestamp and the average value for entries that share the same name:

```jq
.payload |= (group_by(.name) | map(
  {
    name: .[0].name,
    value: map(.value) | (add / length),
    timestamp: map(.timestamp) | max
  }
))
```

In the previous jq expression:

- `.payload |= <expression>` uses `|=` to update the value of `.payload` with the result of running `<expression>`. Using `|=` instead of `=` sets the data context of `<expression>` to `.payload` rather than `.`.
- `group_by(.name)` takes an array as an input, places elements into sub-arrays based on the value of `.name` in each element. Each sub-array contains all elements from the original array with the same value of `.name`.
- `map(<expression>)` takes the array of arrays produced by `group_by` and executes `<expression>` against each of the sub-arrays.
- `{name: <expression>, value: <expression>, timestamp: <expression>}` constructs an object out of the input sub-array with `name`, `value`, and `timestamp` fields. Each `<expression>` produces the desired value for the associated key.
- `.[0].name` retrieves the first element from the sub-array and extracts the `name` field from it. All elements in the sub-array have the same name, so you only need to retrieve the first one.
- `map(.value) | (add / length)` computes the average `value` of each sub-array:
  - `map(.value)` converts the sub-array into an array of the `value` field in each entry, in this case returning an array of numbers.
  - `add` is a built-in jq function that computes the sum of an array of numbers.
  - `length` is a built-in jq function that computes the count or length of an array.
  - `add / length` divides the sum by the count to determine the average.
- `map(.timestamp) | max` finds the maximum `timestamp` value of each sub-array:
  - `map(.timestamp)` converts the sub-array into an array of the `timestamp` fields in each entry, in this case returning an array of numbers.
  - `max` is built-in jq function that finds the maximum value in an array.

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": [
    {
      "name": "humidity",
      "value": 38,
      "timestamp": 1689727944440
    },
    {
      "name": "temperature",
      "value": 19.333333333333332,
      "timestamp": 1689727994085
    }
  ]
}
```

## Work with strings

jq provides several utilities for manipulating and constructing strings. The following examples show some common use cases.

### Split strings

If a string contains multiple pieces of information separated by a common character, you can use the `split()` function to extract the individual pieces.

The following example shows you how to split up a topic string and return a specific segment of the topic. This technique is often useful when you're working with partition key expressions. Given the following input:

```json
{
  "systemProperties": {
    "timestamp": "2023-01-11T10:02:07Z"
  },
  "qos": 1,
  "topic": "assets/slicer-3345/tags/rpm",
  "properties": {
    "contentType": "application/json"
  },
  "payload": {
    "Timestamp": 1681926048,
    "Value": 142
  }
}
```

Use the following jq expression to split up the topic string, using `/` as the separator, and return a specific segment of the topic:

```jq
.topic | split("/")[1]
```

In the previous jq expression:

- `.topic | <expression>` selects the `topic` key from the root object and runs `<expression>` against the data it contains.
- `split("/")` breaks up the topic string into an array by splitting the string apart each time it finds `/` character in the string. In this case, it produces `["assets", "slicer-3345", "tags", "rpm"]`.
- `[1]` retrieves element at index 1 of the array from the previous step, in this case `slicer-3345`.`

The following JSON shows the output from the previous jq expression:

```json
"slicer-3345"
```

### Construct strings dynamically

jq lets you construct strings by using string templates with the syntax `\(<expression>)` within a string. Use these templates to build strings dynamically.

The following example shows you how to add a prefix to each key in an object by using string templates. Given the following input:

```json
{
  "temperature": 123,
  "humidity": 24,
  "pressure": 1021
}
```

Use the following jq expression to add a prefix to each key in the object:

```jq
with_entries(.key |= "current-\(.)")
```

In the previous jq expression:

- `with_entries(<expression>)` converts the object to an array of key/value pairs with structure `{key: <key>, value: <value>}`, executes `<expression>` against each key/value pair, and converts the pairs back into an object.
- `.key |= <expression>` updates the value of `.key` in the key/value pair object to the result of `<expression>`. Using `|=` instead of `=` sets the data context of `<expression>` to the value of `.key`, rather than the full key/value pair object.
- `"current-\(.)"` produces a string that starts with "current-" and then inserts the value of the current data context `.`, in this case the value of the key. The `\(<expression>)` syntax within the string indicates that you want to replace that portion of the string with the result of running `<expression>`.

The following JSON shows the output from the previous jq expression:

```json
{
  "current-temperature": 123,
  "current-humidity": 24,
  "current-pressure": 1021
}
```

## Work with regular expressions

jq supports standard regular expressions. You can use regular expressions to extract, replace, and check patterns within strings. Common regular expression functions for jq include `test()`, `match()`, `split()`, `capture()`, `sub()`, and `gsub()`.

### Extract values by using regular expressions

If you can't use string splitting to extract a value from a string, you may be able to use regular expressions to extract the values that you need.

The following example shows you how to normalize object keys by testing for a regular expression and then replacing it with a different format. Given the following input:

```json
{
  "payload": {
    "Timestamp": 1681926048,
    "Payload": {
      "dtmi:com:prod1:slicer3345:humidity": {
        "SourceTimestamp": 1681926048,
        "Value": 10
      },
      "dtmi:com:prod1:slicer3345:speed": {
        "SourceTimestamp": 1681926048,
        "Value": 85
      },
      "temperature": {
        "SourceTimestamp": 1681926048,
        "Value": 46
      }
    },
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092
  }
}
```

Use the following jq expression to normalize the object keys:

```jq
.payload.Payload |= with_entries(
    .key |= if test("^dtmi:.*:(?<tag>[^:]+)$") then
        capture("^dtmi:.*:(?<tag>[^:]+)$").tag
    else
        .
    end
)
```

In the previous jq expression:

- `.payload |= <expression>` uses `|=` to update the value of `.payload` with the result of running `<expression>`. Using `|=` instead of `=` sets the data context of `<expression>` to `.payload` rather than `.`.
- `with_entries(<expression>)` converts the object to an array of key/value pairs with structure `{key: <key>, value: <value>}`, executes `<expression>` against each key/value pair, and converts the pairs back into an object.
- `.key |= <expression>` updates the value of `.key` in the key/value pair object to the result of `<expression>`. using `|=` instead of `=` sets the data context of `<expression>` to the value of `.key`, rather than the full key/value pair object.
- `if test("^dtmi:.*:(?<tag>[^:]+)$") then capture("^dtmi:.*:(?<tag>[^:]+)$").tag else . end` checks and updates the key based on a regular expression:
  - `test("^dtmi:.*:(?<tag>[^:]+)$")` checks the input data context, the key in this case, against the regular expression `^dtmi:.*:(?<tag>[^:]+)$`. If the regular expression matches, it returns true. If not, it returns false.
  - `capture("^dtmi:.*:(?<tag>[^:]+)$").tag` executes the regular expression `^dtmi:.*:(?<tag>[^:]+)$` against the input data context, the key in this case, and places any capture groups from the regular expression, indicated by `(?<tag>...)`, in an object as the output. The expression then extracts `.tag` from that object to return the information extracted by the regular expression.
  - `.` in the `else` branch, the expression passes the data through unchanged.

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": {
    "Timestamp": 1681926048,
    "Payload": {
      "humidity": {
        "SourceTimestamp": 1681926048,
        "Value": 10
      },
      "speed": {
        "SourceTimestamp": 1681926048,
        "Value": 85
      },
      "temperature": {
        "SourceTimestamp": 1681926048,
        "Value": 46
      }
    },
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092
  }
}
```

## Split messages apart

A useful feature of the jq language is its ability to produce multiple outputs from a single input. This feature lets you split messages into multiple separate messages for the pipeline to process. The key to this technique is `.[]`, which splits arrays into separate values. The following examples show a few scenarios that use this syntax.

### Dynamic number of outputs

Typically, when you want to split a message into multiple outputs, the number of outputs you want depends on the structure of the message. The `[]` syntax lets you do this type of split.

For example, you have a message with a list of tags that you want to place into separate messages. Given the following input:

```json
{
  "systemProperties": {
    "partitionKey": "slicer-3345",
    "partitionId": 5,
    "timestamp": "2023-01-11T10:02:07Z"
  },
  "qos": 1,
  "topic": "assets/slicer-3345",
  "properties": {
    "responseTopic": "assets/slicer-3345/output",
    "contentType": "application/json"
  },
  "payload": {
    "Timestamp": 1681926048,
    "Payload": {
      "dtmi:com:prod1:slicer3345:humidity": {
        "sourceTimestamp": 1681926048,
        "value": 10
      },
      "dtmi:com:prod1:slicer3345:lineStatus": {
        "sourceTimestamp": 1681926048,
        "value": [1, 5, 2]
      },
      "dtmi:com:prod1:slicer3345:speed": {
        "sourceTimestamp": 1681926048,
        "value": 85
      },
      "dtmi:com:prod1:slicer3345:temperature": {
        "sourceTimestamp": 1681926048,
        "value": 46
      }
    },
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092
  }
}
```

Use the following jq expression to split the message into multiple messages:

```jq
.payload.Payload = (.payload.Payload | to_entries[])
| .payload |= {
  DataSetWriterName,
  SequenceNumber,
  Tag: .Payload.key,
  Value: .Payload.value.value,
  Timestamp: .Payload.value.sourceTimestamp
}
```

In the previous jq expression:

- `.payload.Payload = (.payload.Payload | to_entries[])` splits the message into several messages:
  - `.payload.Payload = <expression>` assigns the result of running `<expression>` to `.payload.Payload`. Typically, you use `|=` in this case to scope the context of `<expression>` down to `.payload.Payload`, but `|=` doesn't support splitting the message apart, so use `=` instead.
  - `(.payload.Payload | <expression>)` scopes the right hand side of the assignment expression down to `.payload.Payload` so that `<expression>` operates against the correct portion of the message.
  - `to_entries[]` is two operations and is a shorthand for `to_entries | .[]`:
    - `to_entries` converts the object into an array of key/value pairs with schema `{"key": <key>, "value": <value>}`. This information is what you want to separate out into different messages.
    - `[]` performs the message splitting. Each entry in the array becomes a separate value in jq. When the assignment to `.payload.Payload` occurs, each separate value results in a copy of the overall message being made, with `.payload.Payload` set to the corresponding value produced by the right hand side of the assignment.
- `.payload |= <expression>` replaces the value of `.payload` with the result of running `<expression>`. At this point, the query is dealing with a _stream_ of values rather than a single value as a result of the split in the previous operation. Therefore, the assignment is executed once for each message that the previous operation produces rather than just executing once overall.
- `{DataSetWriterName, SequenceNumber, ...}` constructs a new object that's the value of `.payload`. `DataSetWriterName` and `SequenceNumber` are unchanged, so you can use the shorthand syntax rather than writing `DataSetWriterName: .DataSetWriterName` and `SequenceNumber: .SequenceNumber`.
- `Tag: .Payload.key,` extracts the original object key from the inner `Payload` and up-levels it to the parent object. The `to_entries` operation earlier in the query created the `key` field.
- `Value: .Payload.value.value` and `Timestamp: .Payload.value.sourceTimestamp` perform a similar extraction of data from the inner payload. This time from the original key/value pair's value. The result is a flat payload object that you can use in further processing.

The following JSON shows the outputs from the previous jq expression. Each output becomes a
standalone message for later processing stages in the pipeline:

```json
{
  "systemProperties": {
    "partitionKey": "slicer-3345",
    "partitionId": 5,
    "timestamp": "2023-01-11T10:02:07Z"
  },
  "qos": 1,
  "topic": "assets/slicer-3345",
  "properties": {
    "responseTopic": "assets/slicer-3345/output",
    "contentType": "application/json"
  },
  "payload": {
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092,
    "Tag": "dtmi:com:prod1:slicer3345:humidity",
    "Value": 10,
    "Timestamp": 1681926048
  }
}
```

```json
{
  "systemProperties": {
    "partitionKey": "slicer-3345",
    "partitionId": 5,
    "timestamp": "2023-01-11T10:02:07Z"
  },
  "qos": 1,
  "topic": "assets/slicer-3345",
  "properties": {
    "responseTopic": "assets/slicer-3345/output",
    "contentType": "application/json"
  },
  "payload": {
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092,
    "Tag": "dtmi:com:prod1:slicer3345:lineStatus",
    "Value": [1, 5, 2],
    "Timestamp": 1681926048
  }
}
```

```json
{
  "systemProperties": {
    "partitionKey": "slicer-3345",
    "partitionId": 5,
    "timestamp": "2023-01-11T10:02:07Z"
  },
  "qos": 1,
  "topic": "assets/slicer-3345",
  "properties": {
    "responseTopic": "assets/slicer-3345/output",
    "contentType": "application/json"
  },
  "payload": {
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092,
    "Tag": "dtmi:com:prod1:slicer3345:speed",
    "Value": 85,
    "Timestamp": 1681926048
  }
}
```

```json
{
  "systemProperties": {
    "partitionKey": "slicer-3345",
    "partitionId": 5,
    "timestamp": "2023-01-11T10:02:07Z"
  },
  "qos": 1,
  "topic": "assets/slicer-3345",
  "properties": {
    "responseTopic": "assets/slicer-3345/output",
    "contentType": "application/json"
  },
  "payload": {
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092,
    "Tag": "dtmi:com:prod1:slicer3345:temperature",
    "Value": 46,
    "Timestamp": 1681926048
  }
}
```

### Fixed number of outputs

To split a message into a fixed number of outputs instead of dynamic number of outputs based on the structure of the message, use the `,` operator instead of `[]`.

The following example shows you how to split the data into two messages based on the existing field names. Given the following input:

```json
{
  "topic": "test/topic",
  "payload": {
    "minTemperature": 12,
    "maxTemperature": 23,
    "minHumidity": 52,
    "maxHumidity": 92
  }
}
```

Use the following jq expression to split the message into two messages:

```jq
.payload = (
  {
    field: "temperature",
    minimum: .payload.minTemperature,
    maximum: .payload.maxTemperature
  },
  {
    field: "humidity",
    minimum: .payload.minHumidity,
    maximum: .payload.maxHumidity
  }
)
```

In the previous jq expression:

- `.payload = ({<fields>},{<fields>})` assigns the two object literals to `.payload` in the message. The comma-separated objects produce two separate values and assigns into `.payload`, which causes the entire message to be split into two messages. Each new message has `.payload` set to one of the values.
- `{field: "temperature", minimum: .payload.minTemperature, maximum: .payload.maxTemperature}` is a literal object constructor that populates the fields of an object with a literal string and other data fetched from the object.

The following JSON shows the outputs from the previous jq expression. Each output becomes a standalone message for further processing stages:

```json
{
  "topic": "test/topic",
  "payload": {
    "field": "temperature",
    "minimum": 12,
    "maximum": 23
  }
}
```

```json
{
  "topic": "test/topic",
  "payload": {
    "field": "humidity",
    "minimum": 52,
    "maximum": 92
  }
}
```

## Mathematic operations

jq supports common mathematic operations. Some operations are operators such as `+` and `-`. Other operations are functions such as `sin` and `exp`.

### Arithmetic

jq supports five common arithmetic operations: addition (`+`), subtraction (`-`), multiplication (`*`), division (`/`) and modulo (`%`). Unlike many features of jq, these operations are infix operations that let you write the full mathematical expression in a single expression with no `|` separators.

The following example shows you how to convert a temperature from fahrenheit to celsius and extract the current seconds reading from a unix millisecond timestamp. Given the following input:

```json
{
  "payload": {
    "temperatureF": 94.2,
    "timestamp": 1689766750628
  }
}
```

Use the following jq expression to convert the temperature from fahrenheit to celsius and extract the current seconds reading from a unix millisecond timestamp:

```jq
.payload.temperatureC = (5/9) * (.payload.temperatureF - 32)
| .payload.seconds = (.payload.timestamp / 1000) % 60
```

In the previous jq expression:

- `.payload.temperatureC = (5/9) * (.payload.temperatureF - 32)` creates a new `temperatureC` field in the payload that's set to the conversion of `temperatureF` from fahrenheit to celsius.
- `.payload.seconds = (.payload.timestamp / 1000) % 60` takes a unix millisecond time and converts it to seconds, then extracts the number of seconds in the current minute using a modulo calculation.

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": {
    "temperatureF": 94.2,
    "timestamp": 1689766750628,
    "temperatureC": 34.55555555555556,
    "seconds": 10
  }
}
```

### Mathematic functions

jq includes several functions that perform mathematic operations. You can find the full list in the [jq manual](https://jqlang.github.io/jq/manual/#Math).

The following example shows you how to compute kinetic energy from mass and velocity fields. Given the following input:

```json
{
  "userProperties": [
    { "key": "mass", "value": 512.1 },
    { "key": "productType", "value": "projectile" }
  ],
  "payload": {
    "velocity": 97.2
  }
}
```

Use the following jq expression to compute the kinetic energy from the mass and velocity fields:

```jq
.payload.energy = (0.5 * (.userProperties | from_entries).mass * pow(.payload.velocity; 2) | round)
```

In the previous jq expression:

- `.payload.energy = <expression>` creates a new `energy` field in the payload
  that's the result of executing `<expression>`.
- `(0.5 * (.userProperties | from_entries).mass * pow(.payload.velocity; 2) | round)` is the formula for energy:
  - `(.userProperties | from_entries).mass` extracts the `mass` entry from the `userProperties` list. The data is already set up as objects with `key` and `value`, so `from_entries` can directly convert it to an object. The expression retrieves the `mass` key from the resulting object, and returns its value.
  - `pow(.payload.velocity; 2)` extracts the velocity from the payload and squares it by raising it to the power of 2.
  - `<expression> | round` rounds the result to the nearest whole number to avoid misleadingly high precision in the result.

The following JSON shows the output from the previous jq expression:

```json
{
  "userProperties": [
    { "key": "mass", "value": 512.1 },
    { "key": "productType", "value": "projectile" }
  ],
  "payload": {
    "velocity": 97.2,
    "energy": 2419119
  }
}
```

## Boolean logic

Data processing pipelines often use jq to filter messages. Filtering typically uses boolean expressions and operators. In addition, boolean logic is useful to perform control flow in transformations and more advanced filtering use cases.

The following examples show some of the most common functionality used in boolean expressions in jq

### Basic boolean and conditional operators

jq provides the basic boolean logic operators `and`, `or`, and `not`. The `and` and `or` operators are infix operators. `not` is a function that you invoke as a filter, For example, `<expression> | not`.

jq has the conditional operators `>`, `<`, `==`, `!=`, `>=`,  and `<=`. These operators are infix operators.

The following example shows you how to perform some basic boolean logic using conditionals. Given the following input:

```json
{
  "payload": {
    "temperature": 50,
    "humidity": 92,
    "site": "Redmond"
  }
}
```

Use the following jq expression to check if either:

- The temperature is between 30 degrees and 60 degrees inclusive on the upper bound.
- The humidity is less than 80 and the site is Redmond.

```jq
.payload
| ((.temperature > 30 and .temperature <= 60) or .humidity < 80) and .site == "Redmond"
| not
```

In the previous jq expression:

- `.payload | <expression>` scopes `<expression>` to the contents of `.payload`. This syntax makes the rest of the expression less verbose.
- `((.temperature > 30 and .temperature <= 60) or .humidity < 80) and .site == "Redmond"` returns true if the temperature is between 30 degrees and 60 degrees (inclusive on the upper bound) or the humidity is less than 80 then only returns true if the site is also Redmond.
- `<expression> | not` takes the result of the preceding expression and applies a logical NOT to it, in this example reversing the result from `true` to `false`.

The following JSON shows the output from the previous jq expression:

```json
false
```

### Check object key existence

You can create a filter that checks the structure of a message rather than its contents. For example, you could check whether a particular key is present in an object. To do this check, use the `has` function or a check against null. The following example shows both of these approaches. Given the following input:

```json
{
  "payload": {
    "temperature": 51,
    "humidity": 41,
    "site": null
  }
}
```

Use the following jq expression to check if the payload has a `temperature` field, if the `site` field isn't null, and other checks:

```jq
.payload | {
    hasTemperature: has("temperature"),
    temperatureNotNull: (.temperature != null),
    hasSite: has("site"),
    siteNotNull: (.site != null),
    hasMissing: has("missing"),
    missingNotNull: (.missing != null),
    hasNested: (has("nested") and (.nested | has("inner"))),
    nestedNotNull: (.nested?.inner != null)
}
```

In the previous jq expression:

- `.payload | <expression>` scopes the data context of `<expression>` to the value of `.payload` to make `<expression>` less verbose.
- `hasTemperature: has("temperature"),` this and other similar expressions demonstrate how the `has` function behaves with an input object. The function returns true only if the key is present. `hasSite` is true despite the value of `site` being `null`.
- `temperatureNotNull: (.temperature != null),` this and other similar expressions demonstrate how the `!= null` check performs a similar check to `has`. A nonexistent key in an object is `null` if accessed by using the `.<key>` syntax, or key exists but has a value of `null`. Both `siteNotNull` and `missingNotNull` are false, even though one key is present and the other is absent.
- `hasNested: (has("nested") and (.nested | has("inner")))` performs a check on a nested object with `has`, where the parent object may not exist. The result is a cascade of checks at each level to avoid an error.
- `nestedNotNull: (.nested?.inner != null)` performs the same check on a nested object using `!= null` and the `?` to enable path chaining on fields that may not exist. This approach produces cleaner syntax for deeply nested chains that may or may not exist, but it can't differentiate `null` key values from ones that don't exist.

The following JSON shows the output from the previous jq expression:

```json
{
  "hasTemperature": true,
  "temperatureNotNull": true,
  "hasSite": true,
  "siteNotNull": false,
  "hasMissing": false,
  "missingNotNull": false,
  "hasNested": false,
  "nestedNotNull": false
}
```

### Check array entry existence

Use the `any` function to check for the existence of an entry in an array. Given the following input:

```json
{
  "userProperties": [
    { "key": "mass", "value": 512.1 },
    { "key": "productType", "value": "projectile" }
  ],
  "payload": {
    "velocity": 97.2,
    "energy": 2419119
  }
}
```

Use the following jq expression to check if the `userProperties` array has an entry with a key of `mass` and no entry with a key of `missing`:

```jq
.userProperties | any(.key == "mass") and (any(.key == "missing") | not)
```

In the previous jq expression:

- `.userProperties | <expression>` scopes the data context of `<expression>` to the value of `userProperties` to make the rest of `<expression>` less verbose.
- `any(.key == "mass")` executes the `.key == "mass"` expression against each element of the `userProperties` array, returning true if the expression evaluates to true for at least one element of the array.
- `(any(.key == "missing") | not)` executes `.key == "missing"` against each element of the `userProperties` array, returning true if any element evaluates to true, then negates the overall result with `| not`.

The following JSON shows the output from the previous jq expression:

```json
true
```

## Control flow

Control flow in jq is different from most languages as most forms of control flow are directly data-driven. There's still support for if/else expressions with traditional functional programming semantics, but you can achieve most loop structures by using combinations of the `map` and `reduce` functions.

The following examples show some common control flow scenarios in jq.

### If-else statements

jq supports conditions by using `if <test-expression> then <true-expression> else <false-expression> end`. You can insert more cases by adding `elif <test-expression> then <true-expression>` in the middle. A key difference between jq and many other languages is that each `then` and `else` expression produces a result that's used in subsequent operations in the overall jq expression.

The following example demonstrates how to use `if` statements to produce conditional information. Given the following input:

```json
{
  "payload": {
    "temperature": 25,
    "humidity": 52
  }
}
```

Use the following jq expression to check if the temperature is high, low, or normal:

```jq
.payload.status = if .payload.temperature > 80 then
  "high"
elif .payload.temperature < 30 then
  "low"
else
  "normal"
end
```

In the previous jq expression:

- `.payload.status = <expression>` assigns the result of running `<expression>` to a new `status` field in the payload.
- `if ... end` is the core `if/elif/else` expression:
  - `if .payload.temperature > 80 then "high"` checks the temperature against a high value, returning `"high"` if true, otherwise it continues.
  - `elif .payload.temperature < 30 then "low"` performs a second check against temperature for a low value, setting the result to `"low"` if true, otherwise it continues.
  - `else "normal" end` returns `"normal"` if none of the previous checks were true and closes off the expression with `end`.

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": {
    "temperature": 25,
    "humidity": 52,
    "status": "low"
  }
}
```

### Map

In functional languages like jq, the most common way to perform iterative logic is to create an array and then map the values of that array to new ones. This technique is achieved in jq by using the `map` function, which appears in many of the examples in this guide. If you want to perform some operation against multiple values, `map` is probably the answer.

The following example shows you how to use `map` to remove a prefix from the keys of an object. This solution can be written more succinctly using `with_entries`, but the more verbose version shown here demonstrates the actual mapping going on under the hood in the shorthand approach. Given the following input:

```json
{
  "payload": {
    "rotor_rpm": 150,
    "rotor_temperature": 51,
    "rotor_cycles": 1354
  }
}
```

Use the following jq expression to remove the `rotor_` prefix from the keys of the payload:

```jq
.payload |= (to_entries | map(.key |= ltrimstr("rotor_")) | from_entries)
```

In the previous jq expression:

- `.payload |= <expression>` uses `|=` to update the value of `.payload` with the result of running `<expression>`. Using `|=` instead of `=` sets the data context of `<expression>` to `.payload` rather than `.`.
- `(to_entries | map(<expression) | from_entries)` performs object-array conversion and maps each entry to a new value with `<expression>`. This approach is semantically equivalent to `with_entries(<expression>)`:
  - `to_entries` converts an object into an array, with each key/value pair becoming a separate object with structure `{"key": <key>, "value": <value>}`.
  - `map(<expression>)` executes `<expression>` against each element in the array and produces an output array with the results of each expression.
  - `from_entries` is the inverse of `to_entries`. The function converts an array of objects with structure `{"key": <key>, "value": <value>}` into an object with the `key` and `value` fields mapped into key/value pairs.
- `.key |= ltrimstr("rotor_")` updates the value of `.key` in each entry with the result of `ltrimstr("rotor_")`. The `|=` syntax scopes the data context of the right hand side to the value of `.key`. `ltrimstr` removes the given prefix from the string if present.

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": {
    "rpm": 150,
    "temperature": 51,
    "cycles": 1354
  }
}
```

### Reduce

Reducing is the primary way to perform loop or iterative operations across the elements of an array. The reduce operation consists of an _accumulator_ and an operation that uses the accumulator and the current element of the array as inputs. Each iteration of the loop returns the next value of the accumulator, and the final output of the reduce operation is the last accumulator value. Reduce is referred to as _fold_ in some other functional programming languages.

Use the `reduce` operation in jq perform reducing. Most use cases don't need this low-level manipulation and can instead use higher-level functions, but `reduce` is a useful general tool.

The following example shows you how to compute the average change in value for a metric over the data points you have. Given the following input:

```json
{
  "payload": [
    {
      "value": 65,
      "timestamp": 1689796743559
    },
    {
      "value": 55,
      "timestamp": 1689796771131
    },
    {
      "value": 59,
      "timestamp": 1689796827766
    },
    {
      "value": 62,
      "timestamp": 1689796844883
    },
    {
      "value": 58,
      "timestamp": 1689796864853
    }
  ]
}
```

Use the following jq expression to compute the average change in value across the data points:

```jq
.payload |= (
  reduce .[] as $item (
    null;
    if . == null then
      {totalChange: 0, previous: $item.value, count: 0}
    else
      .totalChange += (($item.value - .previous) | length)
      | .previous = $item.value
      | .count += 1
    end
  )
  | .totalChange / .count
)
```

In the previous jq expression:

- `.payload |= <expression>` uses `|=` to update the value of `.payload` with the result of running `<expression>`. Using `|=` instead of `=` sets the data context of `<expression>` to `.payload` rather than `.`.
- `reduce .[] as $item (<init>; <expression>)` is the scaffolding of a typical reduce operation with the following parts:
  - `.[] as $item` must always be `<expression> as <variable>` and is most often `.[] as $item`. The `<expression>` produces a stream of values, each of which is saved to `<variable>` for an iteration of the reduce operation. If you have an array you want to iterate over, `.[]` splits it apart into a stream. This syntax is the same as the syntax used to split messages apart, but the `reduce` operation doesn't use the stream to generate multiple outputs. `reduce` doesn't split your message apart.
  - `<init>` in this case `null` is the initial value of the accumulator that's used in the reduce operation. This value is often set to empty or zero. This value becomes the data context, `.` in this loop `<expression>`, for the first iteration.
  - `<expression>` is the operation performed on each iteration of the reduce operation. It has access to the current accumulator value, through `.`, and the current value in the stream through the `<variable>` declared earlier, in this case `$item`.
- `if . == null then {totalChange: 0, previous: $item.value, count: 0}` is a conditional to handle the first iteration of reduce. It sets up the structure of the accumulator for the next iteration. Because the expression computes differences between entries, the first entry sets up data that's used to compute a difference on the second reduce iteration. The `totalChange`, `previous` and `count` fields serve as loop variables, and update on each iteration.
- `.totalChange += (($item.value - .previous) | length) | .previous = $item.value | .count += 1` is the expression in the `else` case. This expression sets each field in the accumulator object to a new value based on a computation. For `totalChange`, it finds the difference between the current and previous values and gets the absolute value. Counterintuitively it uses the `length` function to get the absolute value. `previous` is set to the current `$item`'s `value` for the next iteration to use, and `count` is incremented.
- `.totalChange / .count` computes the average change across data points after the reduce operation is complete and you have the final accumulator value.

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": 5.25
}
```

### Loops

Loops in jq are typically reserved for advanced use cases. Because every operation in jq is an expression that produces a value, the statement-driven semantics of loops in most languages aren't a natural fit in jq. Consider using [`map`](#map) or [`reduce`](#reduce) to address your needs.

There are two primary types of traditional loop in jq. Other loop types exist, but are for more specialized use cases:

- `while` applies an operation repeatedly against the input data context, updating the value of the data context for use in the next iteration and producing that value as an output. The output of a `while` loop is an array holding the values produced by each iteration of the loop.
- `until` like `while` applies an operation repeatedly against the input data context, updating the value of the data context for use in the next iteration. Unlike `while`, the `until` loop outputs the value produced by the last iteration of the loop.

The following example shows you how to use an `until` loop to progressively eliminate outlier data points from a list of readings until the standard deviation falls below a predefined value. Given the following input:

```json
{
  "payload": [
    {
      "value": 65,
      "timestamp": 1689796743559
    },
    {
      "value": 55,
      "timestamp": 1689796771131
    },
    {
      "value": 59,
      "timestamp": 1689796827766
    },
    {
      "value": 62,
      "timestamp": 1689796844883
    },
    {
      "value": 58,
      "timestamp": 1689796864853
    }
  ]
}
```

Use the following jq expression to progressively eliminate outlier data points from a list of readings until the standard deviation falls below 2:

```jq
def avg: add / length;
def stdev: avg as $mean | (map(. - $mean | . * .) | add) / (length - 1) | sqrt;
.payload |= (
  sort_by(.value)
  | until(
    (map(.value) | stdev) < 2 or length == 0;
    (map(.value) | avg) as $avg
    | if ((.[0].value - $avg) | length) > ((.[-1].value - $avg) | length) then
      del(.[0])
    else
      del(.[-1])
    end
  )
)
```

In the previous jq expression:

- `def avg: add / length;` defines a new function called `avg` that's used to compute averages later in the expression. The expression on the right of the `:` is the logical expression used whenever you use `avg`. The expression `<expression> | avg` is equivalent to `<expression> | add / length`
- `def stdev: avg as $mean | (map(. - $mean | . * .) | add) / (length - 1) | sqrt;` defines a new function called  `stdev`. The function computes the sample standard deviation of an array using a modified version of [community response](https://stackoverflow.com/questions/73599978/sample-standard-deviation-in-jq) on StackOverflow.
- `.payload |= <expression>` the first two `def`s are just declarations and start the actual expression. The expression executes `<expression>` with an input data object of `.payload` and assigns the result back to `.payload`.
- `sort_by(.value)` sorts the  array of array entries by their `value` field. This solution requires you to identify and manipulate the highest and lowest values in an array, so sorting the data in advance reduces computation and simplifies the code.
- `until(<condition>; <expression>)` executes `<expression>` against the input until `<condition>` returns true. The input to each execution of `<expression>` and `<condition>` is the output of the previous execution of `<expression>`. The result of the last execution of `<expression>` is returned from the loop.
- `(map(.value) | stdev) < 2 or length == 0` is the condition for the loop:
  - `map(.value)` converts the array into a list of pure numbers for use in the subsequent computation.
  - `(<expression> | stdev) < 2` computes the standard deviation of the array and returns true if the standard deviation is less than 2.
  - `length == 0` gets the length of the input array and returns true if it's 0. To protect against the case where all entries are eliminated, the result is `or`-ed with the overall expression.
- `(map(.value) | avg) as $avg` converts the array into an array of numbers and computes their average and then saves the result to an `$avg` variable. This approach saves computation costs because you reuse the average multiple times in the loop iteration. Variable assignment expressions don't change the data context for the next expression after `|`, so the rest of the computation still has access to the full array.
- `if <condition> then <expression> else <expression> end` is the core logic of the loop iteration. It uses `<condition>` to determine the `<expression>` to execute and return.
- `((.[0].value - $avg) | length) > ((.[-1].value - $avg) | length)` is the `if` condition that compares the highest and lowest values against the average value and then compares those differences:
  - `(.[0].value - $avg) | length` retrieves the `value` field of the first array entry and gets the difference between it and the overall average. The first array entry is the lowest because of the previous sort. This value may be negative, so the result is piped to `length`, which returns the absolute value when given a number as an input.
  - `(.[-1].value - $avg) | length` performs the same operation against the last array entry and computes the absolute value as well for safety. The last array entry is the highest because of the previous sort. The absolute values are then compared in the overall condition by using `>`.
- `del(.[0])` is the `then` expression that executes when the first array entry was the largest outlier. The expression removes the element at `.[0]` from the array. The expression returns the data left in the array after the operation.
- `del(.[-1])` is the `else` expression that executes when the last array entry was the largest outlier. The expression removes the element at `.[-1]`, which is the last entry, from the array. The expression returns the data left in the array after the operation.

The following JSON shows the output from the previous jq expression:

```json
{
  "payload": [
    {
      "value": 58,
      "timestamp": 1689796864853
    },
    {
      "value": 59,
      "timestamp": 1689796827766
    },
    {
      "value": 60,
      "timestamp": 1689796844883
    }
  ]
}
```

## Drop messages

When you write a filter expression, you can instruct the system to drop any messages you don't want by returning false. This behavior is the basic behavior of the [conditional expressions](#basic-boolean-and-conditional-operators) in jq. However, there are times when you're transforming messages or performing more advanced filters when want the system to explicitly or implicitly drop messages for you. The following examples show how to implement this behavior.

### Explicit drop

To explicitly drop a message in a filter expression, return `false` from the expression.

You can also drop a message from inside a transformation by using the builtin `empty` function in jq.

The following example shows you how to compute an average of data points in the message and drop any messages with an average below a fixed value. It's both possible and valid to achieve this behavior with the combination of a transform stage and a filter stage. Use the approach that suits your situation best. Given the following inputs:

#### Message 1

```json
{
  "payload": {
    "temperature": [23, 42, 63, 61],
    "humidity": [64, 36, 78, 33]
  }
}
```

#### Message 2

```json
{
  "payload": {
    "temperature": [42, 12, 32, 21],
    "humidity": [92, 63, 57, 88]
  }
}
```

Use the following jq expression to compute the average of the data points and drop any messages with an average temperature less than 30 or an average humidity greater than 90:

```jq
.payload |= map_values(add / length)
| if .payload.temperature > 30 and .payload.humidity < 90 then . else empty end
```

In the previous jq expression:

- `.payload |= <expression>` uses `|=` to update the value of `.payload` with the result of running `<expression>`. Using `|=` instead of `=` sets the data context of `<expression>` to `.payload` rather than `.`.
- `map_values(add / length)` executes `add / length` for each value in the `.payload` sub-object. The expression sums the elements in the array of values and then divides by the length of the array to calculate the average.
- `if .payload.temperature > 30 and .payload.humidity < 90 then . else empty end` checks two conditions against the resulting message. If the filter evaluates to true, as in the first input, then the full message is produced as an output. If the filter evaluates to false, as in the second input, it returns `empty`, which results in an empty stream with zero values. This result causes the expression to drop the corresponding message.

#### Output 1

```json
{
  "payload": {
    "temperature": 47.25,
    "humidity": 52.75
  }
}
```

#### Output 2

(no output)

### Implicit drop by using errors

Both filter and transform expressions can drop messages implicitly by causing jq to produce an error. While this approach isn't a best practice because the pipeline can't differentiate between an error you intentionally caused and one caused by unexpected input to your expression. The system currently handles a runtime error in filter or transform by dropping the message and recording the error.

A common scenario that uses this approach is when an input to a pipeline can have messages that are structurally disjoint. The following example shows you how to receive two types of messages, one of which successfully evaluates against the filter, and the other that's structurally incompatible with the expression. Given the following inputs:

#### Message 1

```json
{
  "payload": {
    "sensorData": {
      "temperature": 15,
      "humidity": 62
    }
  }
}
```

#### Message 2

```json
{
  "payload": [
    {
      "rpm": 12,
      "timestamp": 1689816609514
    },
    {
      "rpm": 52,
      "timestamp": 1689816628580
    }
  ]
}
```

Use the following jq expression to filter out messages with a temperature less than 10 and a humidity greater than 80:

```jq
.payload.sensorData.temperature > 10 and .payload.sensorData.humidity < 80
```

In the previous example, the expression itself is a simple compound boolean expression. The expression is designed to work with the structure of the first of the input messages shown previously. When the expression receives the second message, the array structure of `.payload` is incompatible with the object access in the expression and results in an error. If you want filter out based on temperature/humidity values and remove messages with incompatible structure, this expression works. Another approach that results in no error is to add `(.payload | type) == "object" and` to the start of the expression.

#### Output 1

```json
true
```

#### Output 2

(error)

## Binary manipulation

While jq itself is designed to work with data that can be represented as JSON, Azure IoT Data Processor (preview) pipelines also support a raw data format that holds unparsed binary data. To work with binary data, the version of jq that ships with Data Processor contains a package designed to help you process binary data. It lets you:

- Convert back and forth between binary and other formats such as base64 and integer arrays.
- Use built-in functions to read numeric and string values from a binary message.
- Perform point edits of binary data while still preserving its format.

> [!IMPORTANT]
> You can't use any built-in jq functions or operators that modify a binary value. This means no concatenation with `+`, no `map` operating against the bytes, and no mixed assignments with binary values such as `|=`, `+=`, `//=`. You can use the standard assignment (`==`). If you try to use binary data with an unsupported operation, the system throws a `jqImproperBinaryUsage` error. If you need to manipulate your binary data in custom ways, consider using one of the following functions to convert it to base64 or an integer array for your computation, and then converting it back to binary.

The following sections describe the binary support in the Data Processor jq engine.

### The `binary` module

All of the special binary support in the Data Processor jq engine is specified in a `binary` module that you can import.

Import the module at the beginning of your query in one of two ways:

- `import "binary" as binary;`
- `include "binary"`

The first method places all functions in the module under a namespace, for example `binary::tobase64`. The second method simply places all the binary functions at the top level, for example `tobase64`. Both syntaxes are valid and functionally equivalent.

### Formats and Conversion

The binary module works with three types:

- **binary** - a binary value, only directly usable with the functions in the binary module. Recognized by a pipeline as a binary data type when serializing. Use this type for raw serialization.
- **array** - a format that turns the binary into an array of numbers to enable you to do your own processing. Recognized by a pipeline as an array of integers when serializing.
- **base64** - a string format representation of binary. Mostly useful if you want to convert between binary and strings. Recognized by a pipeline as a string when serializing.

You can convert between all three types in your jq queries depending on your needs. For example, you can convert from binary to an array, do some custom manipulation, and then convert back into binary at the end to preserve the type information.

#### Functions

The following functions are provided for checking and manipulating between these types:

- `binary::tobinary` converts any of the three types to binary.
- `binary::toarray` converts any of the three types to array.
- `binary::tobase64` converts any of the three types to base64.
- `binary::isbinary` returns true if the data is in binary format.
- `binary::isarray` returns true if the data is in array format.
- `binary::isbase64` returns true if the data is in base64 format.

The module also provides the `binary::edit(f)` function for quick edits of binary data. The function converts the input to the array format, applies the function on it, and then converts the result back to  binary.

### Extract data from binary

The binary module lets you extract values from the binary data to use in unpacking of custom binary payloads. In general, this functionality follows that of other binary unpacking libraries and follows similar naming. The following types can be unpacked:

- Integers (int8, int16, int32, int64, uint8, uint16, uint32, uint64)
- Floats (float, double)
- Strings (utf8)

The module also lets specify offsets and endianness, where applicable.

#### Functions to read binary data

The binary module provides the following functions for extracting data from binary values. You can use all the functions with any of the three types the package can convert between.

All function parameters are optional, `offset` defaults to `0` and `length` defaults to the rest of the data.

- `binary::read_int8(offset)` reads an int8 from a binary value.
- `binary::read_int16_be(offset)` reads an int16 from a binary value in big-endian order.
- `binary::read_int16_le(offset)` reads an int16 from a binary value in little-endian order.
- `binary::read_int32_be(offset)` reads an int32 from a binary value in big-endian order.
- `binary::read_int32_le(offset)` reads an int32 from a binary value in little-endian order.
- `binary::read_int64_be(offset)` reads an int64 from a binary value in big-endian order.
- `binary::read_int64_le(offset)` reads an int64 from a binary value in little-endian order.
- `binary::read_uint8(offset)` reads a uint8 from a binary value.
- `binary::read_uint16_be(offset)` reads a uint16 from a binary value in big-endian order.
- `binary::read_uint16_le(offset)` reads a uint16 from a binary value in little-endian order.
- `binary::read_uint32_be(offset)` reads a uint32 from a binary value in big-endian order.
- `binary::read_uint32_le(offset)` reads a uint32 from a binary value in little-endian order.
- `binary::read_uint64_be(offset)` reads a uint64 from a binary value in big-endian order.
- `binary::read_uint64_le(offset)` reads a uint64 from a binary value in little-endian order.
- `binary::read_float_be(offset)` reads a float from a binary value in big-endian order.
- `binary::read_float_le(offset)` reads a float from a binary value in little-endian order.
- `binary::read_double_be(offset)` reads a double from a binary value in big-endian order.
- `binary::read_double_le(offset)` reads a double from a binary value in little-endian order.
- `binary::read_bool(offset; bit)` reads a bool from a binary value, checking the given bit for the value.
- `binary::read_bit(offset; bit)` reads a bit from a binary value, using the given bit index.
- `binary::read_utf8(offset; length)` reads a UTF-8 string from a binary value.

### Write binary data

The binary module lets you encode and write binary values. This capability enables you to construct or make edits to binary payloads directly in jq. Writing data supports the same set of data types as the data extraction and also lets you specify the endianness to use.

The writing of data comes in two forms:

- **`write_*` functions**  update data in-place in a binary value, used to update or manipulate existing values.
- **`append_*` functions** add data to the end of a binary value, used to add to or construct new binary values.

#### Functions to write binary data

The binary module provides the following functions for writing data into binary values. All functions can be run against any of the three valid types this package can convert between.

The `value` parameter is required for all functions, but `offset` is optional where valid and defaults to `0`.

Write functions:

- `binary::write_int8(value; offset)` writes an int8 to a binary value.
- `binary::write_int16_be(value; offset)` writes an int16 to a binary value in big-endian order.
- `binary::write_int16_le(value; offset)` writes an int16 to a binary value in little-endian order.
- `binary::write_int32_be(value; offset)` writes an int32 to a binary value in big-endian order.
- `binary::write_int32_le(value; offset)` writes an int32 to a binary value in little-endian order.
- `binary::write_int64_be(value; offset)` writes an int64 to a binary value in big-endian order.
- `binary::write_int64_le(value; offset)` writes an int64 to a binary value in little-endian order.
- `binary::write_uint8(value; offset)` writes a uint8 to a binary value.
- `binary::write_uint16_be(value; offset)` writes a uint16 to a binary value in big-endian order.
- `binary::write_uint16_le(value; offset)` writes a uint16 to a binary value in little-endian order.
- `binary::write_uint32_be(value; offset)` writes a uint32 to a binary value in big-endian order.
- `binary::write_uint32_le(value; offset)` writes a uint32 to a binary value in little-endian order.
- `binary::write_uint64_be(value; offset)` writes a uint64 to a binary value in big-endian order.
- `binary::write_uint64_le(value; offset)` writes a uint64 to a binary value in little-endian order.
- `binary::write_float_be(value; offset)` writes a float to a binary value in big-endian order.
- `binary::write_float_le(value; offset)` writes a float to a binary value in little-endian order.
- `binary::write_double_be(value; offset)` writes a double to a binary value in big-endian order.
- `binary::write_double_le(value; offset)` writes a double to a binary value in little-endian order.
- `binary::write_bool(value; offset; bit)` writes a bool to a single byte in a binary value, setting the given bit to the bool value.
- `binary::write_bit(value; offset; bit)` writes a single bit in a binary value, leaving other bits in the byte as-is.
- `binary::write_utf8(value; offset)` writes a UTF-8 string to a binary value.

Append functions:

- `binary::append_int8(value)` appends an int8 to a binary value.
- `binary::append_int16_be(value)` appends an int16 to a binary value in big-endian order.
- `binary::append_int16_le(value)` appends an int16 to a binary value in little-endian order.
- `binary::append_int32_be(value)` appends an int32 to a binary value in big-endian order.
- `binary::append_int32_le(value)` appends an int32 to a binary value in little-endian order.
- `binary::append_int64_be(value)` appends an int64 to a binary value in big-endian order.
- `binary::append_int64_le(value)` appends an int64 to a binary value in little-endian order.
- `binary::append_uint8(value)` appends a uint8 to a binary value.
- `binary::append_uint16_be(value)` appends a uint16 to a binary value in big-endian order.
- `binary::append_uint16_le(value)` appends a uint16 to a binary value in little-endian order.
- `binary::append_uint32_be(value)` appends a uint32 to a binary value in big-endian order.
- `binary::append_uint32_le(value)` appends a uint32 to a binary value in little-endian order.
- `binary::append_uint64_be(value)` appends a uint64 to a binary value in big-endian order.
- `binary::append_uint64_le(value)` appends a uint64 to a binary value in little-endian order.
- `binary::append_float_be(value)` appends a float to a binary value in big-endian order.
- `binary::append_float_le(value)` appends a float to a binary value in little-endian order.
- `binary::append_double_be(value)` appends a double to a binary value in big-endian order.
- `binary::append_double_le(value)` appends a double to a binary value in little-endian order.
- `binary::append_bool(value; bit)` appends a bool to a single byte in a binary value, setting the given bit to the bool value.
- `binary::append_utf8(value)` appends a UTF-8 string to a binary value.

### Binary examples

This section shows some common use cases for working with binary data. The examples use a common input message.

Assume you have a message with a payload that's a custom binary format that contains multiple sections. Each section contains the following data in big-endian byte order:

- A uint32 that holds the length of the field name in bytes.
- A utf-8 string that contains the field name whose length the previous uint32 specifies.
- A double that holds the value of the field.

For this example, you have three of these sections, holding:

- (uint32) 11
- (utf-8) temperature
- (double) 86.0

- (uint32) 8
- (utf-8) humidity
- (double) 51.290

- (uint32) 8
- (utf-8) pressure
- (double) 346.23

This data looks like this when printed within the `payload` section of a message:

```json
{
  "payload": "base64::AAAAC3RlbXBlcmF0dXJlQFWAAAAAAAAAAAAIaHVtaWRpdHlASaUeuFHrhQAAAAhwcmVzc3VyZUB1o64UeuFI"
}
```

> [!NOTE]
> The `base64::<string>` representation of binary data is just for ease of differentiating from other types and isn't representative of the physical data format during processing.

#### Extract values directly

If you know the exact structure of the message, you can retrieve the values from it by using the appropriate offsets.

Use the following jq expression to extract the values:

```jq
import "binary" as binary;
.payload | {
  temperature: binary::read_double_be(15),
  humidity: binary::read_double_be(35),
  pressure: binary::read_double_be(55)
}
```

The following JSON shows the output from the previous jq expression:

```json
{
  "humidity": 51.29,
  "pressure": 346.23,
  "temperature": 86
}
```

#### Extract values dynamically

If the message could contain any fields in any order, you can dynamically extract the full message:

Use the following jq expression to extract the values:

```jq
import "binary" as binary;
.payload
| {
    parts: {},
    rest: binary::toarray
}
|
until(
    (.rest | length) == 0;
    (.rest | binary::read_uint32_be) as $length
    | {
        parts: (
            .parts +
            {
                (.rest | binary::read_utf8(4; $length)): (.rest | binary::read_double_be(4 + $length))
            }
        ),
        rest: .rest[(12 + $length):]
    }
)
| .parts
```

The following JSON shows the output from the previous jq expression:

```json
{
  "humidity": 51.29,
  "pressure": 346.23,
  "temperature": 86
}
```

#### Edit values directly

This example shows you how to edit one of the values. As in the extraction case, it's easier if you know where the value you want to edit is in the binary data. This example shows you how to convert temperature from fahrenheit to celsius.

Use the following jq expression convert the temperature from fahrenheit to celsius in the binary message:

```jq
import "binary" as binary;
15 as $index
| .payload
| binary::write_double_be(
    ((5 / 9) * (binary::read_double_be($index) - 32));
    $index
)
```

The following JSON shows the output from the previous jq expression:

```json
"base64::AAAAC3RlbXBlcmF0dXJlQD4AAAAAAAAAAAAIaHVtaWRpdHlASaUeuFHrhQAAAAhwcmVzc3VyZUB1o64UeuFI"
```

If you apply the extraction logic shown previously, you get the following output:

```json
{
  "humidity": 51.29,
  "pressure": 346.23,
  "temperature": 30
}
```

#### Edit values dynamically

This example shows you how to achieve the same result as the previous example by dynamically locating the desired value in the query.

Use the following jq expression convert the temperature from fahrenheit to celsius in the binary message, dynamically locating the data to edit:

```jq
import "binary" as binary;
.payload
| binary::edit(
    {
        index: 0,
        data: .
    }
    | until(
        (.data | length) <= .index;
        .index as $index
        | (.data | binary::read_uint32_be($index)) as $length
        | if (.data | binary::read_utf8($index + 4; $length)) == "temperature" then
            (
                (.index + 4 + $length) as $index
                | .data |= binary::write_double_be(((5 / 9) * (binary::read_double_be($index) - 32)); $index)
            )
        end
        | .index += $length + 12
    )
    | .data
)
```

The following JSON shows the output from the previous jq expression:

```json
"base64::AAAAC3RlbXBlcmF0dXJlQD4AAAAAAAAAAAAIaHVtaWRpdHlASaUeuFHrhQAAAAhwcmVzc3VyZUB1o64UeuFI"
```

#### Insert new values

Add new values by using the append functions of the package. For example, to add a `windSpeed` field with a value of `31.678` to the input while preserving the incoming binary format, use the following jq expression:

```jq
import "binary" as binary;
"windSpeed" as $key
| 31.678 as $value
| .payload
| binary::append_uint32_be($key | length)
| binary::append_utf8($key)
| binary::append_double_be($value)
```

The following JSON shows the output from the previous jq expression:

```json
"base64:AAAAC3RlbXBlcmF0dXJlQFWAAAAAAAAAAAAIaHVtaWRpdHlASaUeuFHrhQAAAAhwcmVzc3VyZUB1o64UeuFIAAAACXdpbmRTcGVlZEA/rZFocrAh"
```

## Related content

- [What is jq in Data Processor pipelines?](concept-jq.md)
- [jq paths](concept-jq-path.md)
