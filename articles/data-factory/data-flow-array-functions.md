---
title: Array functions in the mapping data flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about array functions in mapping data flow.
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 07/13/2023
---

# Array functions in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

The following articles provide details about array functions supported by Azure Data Factory and Azure Synapse Analytics in mapping data flows.

## Array function list

Array functions perform transformations on data structures that are arrays. These include special keywords to address array elements and indexes:

* ```#acc``` represents a value that you wish to include in your single output when reducing an array
* ```#index``` represents the current array index, along with array index numbers ```#index2, #index3 ...```
* ```#item``` represents the current element value in the array

| Array function | Task |
|----|----|
| [array](data-flow-expressions-usage.md#array) | Creates an array of items. All items should be of the same type. If no items are specified, an empty string array is the default. Same as a [] creation operator.  |
| [at](data-flow-expressions-usage.md#at) | Finds the element at an array index. The index is 1-based. Out of bounds index results in a null value. Finds a value in a map given a key. If the key is not found it returns null.|
| [contains](data-flow-expressions-usage.md#contains) | Returns true if any element in the provided array evaluates as true in the provided predicate. Contains expects a reference to one element in the predicate function as #item.  |
| [distinct](data-flow-expressions-usage.md#distinct) | Returns a distinct set of items from an array.|
| [except](data-flow-expressions-usage.md#except) | Returns a difference set of one array from another dropping duplicates.|
| [filter](data-flow-expressions-usage.md#filter) | Filters elements out of the array that do not meet the provided predicate. Filter expects a reference to one element in the predicate function as #item.  |
| [find](data-flow-expressions-usage.md#find) | Find the first item from an array that match the condition. It takes a filter function where you can address the item in the array as #item. For deeply nested maps you can refer to the parent maps using the #item_n(#item_1, #item_2...) notation.  |
| [flatten](data-flow-expressions-usage.md#flatten) | Flattens array or arrays into a single array. Arrays of atomic items are returned unaltered. The last argument is optional and is defaulted to false to flatten recursively more than one level deep.|
| [in](data-flow-expressions-usage.md#in) | Checks if an item is in the array.  |
| [intersect](data-flow-expressions-usage.md#intersect) | Returns an intersection set of distinct items from 2 arrays.|
| [map](data-flow-expressions-usage.md#map) | Maps each element of the array to a new element using the provided expression. Map expects a reference to one element in the expression function as #item.  |
| [mapIf](data-flow-expressions-usage.md#mapIf) | Conditionally maps an array to another array of same or smaller length. The values can be of any datatype including structTypes. It takes a mapping function where you can address the item in the array as #item and current index as #index. For deeply nested maps you can refer to the parent maps using the ``#item_[n](#item_1, #index_1...)`` notation.|
| [mapIndex](data-flow-expressions-usage.md#mapIndex) | Maps each element of the array to a new element using the provided expression. Map expects a reference to one element in the expression function as #item and a reference to the element index as #index.  |
| [mapLoop](data-flow-expressions-usage.md#mapLoop) | Loops through from 1 to length to create an array of that length. It takes a mapping function where you can address the index in the array as #index. For deeply nested maps you can refer to the parent maps using the #index_n(#index_1, #index_2...) notation.|
| [reduce](data-flow-expressions-usage.md#reduce) | Accumulates elements in an array. Reduce expects a reference to an accumulator and one element in the first expression function as #acc and #item and it expects the resulting value as #result to be used in the second expression function.  |
| [size](data-flow-expressions-usage.md#size) | Finds the size of an array or map type  |
| [slice](data-flow-expressions-usage.md#slice) | Extracts a subset of an array from a position. Position is 1 based. If the length is omitted, it is defaulted to end of the string.  |
| [sort](data-flow-expressions-usage.md#sort) | Sorts the array using the provided predicate function. Sort expects a reference to two consecutive elements in the expression function as #item1 and #item2.  |
| [unfold](data-flow-expressions-usage.md#unfold) | Unfolds an array into a set of rows and repeats the values for the remaining columns in every row.|
| [union](data-flow-expressions-usage.md#union) | Returns a union set of distinct items from 2 arrays.|
|||

## Next steps

- List of all [aggregate functions](data-flow-aggregate-functions.md).
- List of all [cached lookup functions](data-flow-cached-lookup-functions.md).
- List of all [conversion functions](data-flow-conversion-functions.md).
- List of all [date and time functions](data-flow-date-time-functions.md).
- List of all [expression functions](data-flow-expression-functions.md).
- List of all [map functions](data-flow-map-functions.md).
- List of all [metafunctions](data-flow-metafunctions.md).
- List of all [window functions](data-flow-window-functions.md).
- [Usage details of all data transformation expressions](data-flow-expressions-usage.md).
- [Learn how to use Expression Builder](concepts-data-flow-expression-builder.md).