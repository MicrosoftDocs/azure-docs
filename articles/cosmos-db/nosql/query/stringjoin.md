---
title: StringJoin
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that combines multiple strings into a single string with the specified separator.
author: seesharprun
ms.author: sidandrews
ms.reviewer: jacodel
ms.service: azure-cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.devlang: nosql
ms.date: 08/06/2024
ms.custom: query-reference
---

# StringJoin (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a string, which concatenates the elements of a specified array, using the specified separator between each element.

## Syntax

```nosql
StringJoin(<array_expr>, <string_expr>)
```

## Arguments

| | Description |
| --- | --- |
| **`array_expr`** | An array expression with all string items inside. |
| **`string_expr`** | A string expression to use as the separator. |

## Return types

Returns a string expression.

## Examples

The following example illustrates how to use this function to combine multiple strings.

```nosql
SELECT VALUE {
  joinUsingSpaces: StringJoin(["Iropa", "Mountain", "Bike"], " "),
  joinUsingEmptyString: StringJoin(["Iropa", "Mountain", "Bike"], ""),
  joinUsingUndefined: StringJoin(["Iropa", "Mountain", "Bike"], undefined),
  joinUsingCharacter: StringJoin(["6", "7", "4", "3"], "A"),
  joinUsingPhrase: StringJoin(["Adventure", "LT"], "Works")
}
```

```json
[
  {
    "joinUsingSpaces": "Iropa Mountain Bike",
    "joinUsingEmptyString": "IropaMountainBike",
    "joinUsingCharacter": "6A7A4A3",
    "joinUsingPhrase": "AdventureWorksLT"
  }
]
```

## Remarks

- This system function doesn't utilize the index.

## Related content

- [`StringSplit`](stringsplit.md)
- [`CONCAT`](concat.md)
