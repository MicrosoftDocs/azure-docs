---
title: JSON in mapping data flow
description: Azure Data Factory mapping data flow has built-in capabilities for handling JSON documents with hierarchies
author: kromerm
ms.author: makromer
ms.review: djpmsft
ms.service: data-factory
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 08/30/2019
---

# Mapping data flow JSON handling

## Higher-order functions

A higher-order function is a function that takes in one or more functions as an argument. Below are a list of higher-order functions supported in mapping data flows that enable array operations.

### filter
Filters elements out of the array that do not meet the provided predicate. Filter expects a reference to one element in the predicate function as #item.

#### Examples
```
filter([1, 2, 3, 4], #item > 2) => [3, 4]
filter(['a', 'b', 'c', 'd'], #item == 'a' || #item == 'b') => ['a', 'b']
```

### map
Maps each element of the array to a new element using the provided expression. Map expects a reference to one element in the expression function as #item.

#### Examples
```
map([1, 2, 3, 4], #item + 2) => [3, 4, 5, 6]
map(['a', 'b', 'c', 'd'], #item + '_processed') => ['a_processed', 'b_processed', 'c_processed', 'd_processed']
```

### reduce
Accumulates elements in an array. Reduce expects a reference to an accumulator and one element in the first expression function as #acc and #item and it expects the resulting value as #result to be used in the second expression function.

#### Examples
```
reduce([1, 2, 3, 4], 0, #acc + #item, #result) => 10
reduce(['1', '2', '3', '4'], '0', #acc + #item, #result) => '01234'
reduce([1, 2, 3, 4], 0, #acc + #item, #result + 15) => 25
```

### sort
Sorts the array using the provided predicate function. Sort expects a reference to two consecutive elements in the expression function as #item1 and #item2.

#### Examples
```
sort([4, 8, 2, 3], compare(#item1, #item2)) => [2, 3, 4, 8]
sort(['a3', 'b2', 'c1'],
        iif(right(#item1, 1) >= right(#item2, 1), 1, -1)) => ['c1', 'b2', 'a3']
sort(['a3', 'b2', 'c1'],
        iif(#item1 >= #item2, 1, -1)) => ['a3', 'b2', 'c1']
```

### contains
Returns true if any element in the provided array evaluates as true in the provided predicate. Contains expects a reference to one element in the predicate function as #item.

#### Examples
```
contains([1, 2, 3, 4], #item == 3) => true
contains([1, 2, 3, 4], #item > 5) => false
```

## Next steps

* [Use the Derived Column transformation to build your hierarchical structures](data-flow-derived-column.md)
