---
title: StringSplit
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that splits a single string into multiple substrings using a delimiter.
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

# StringSplit (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns an array of substrings obtained from separating the source string by the specified delimiter.

## Syntax

```nosql
StringSplit(<string_expr1>, <string_expr2>)
```

## Arguments

| | Description |
| --- | --- |
| **`string_expr1`** | The source string expression to parse. |
| **`string_expr2`** | The string used as the delimiter. |

## Return types

Returns an array expression.

## Examples

The following example illustrates how to use this function to split a string.

```nosql
SELECT VALUE {
  seperateOnLetter: StringSplit("Handlebar", "e"),
  seperateOnSymbol: StringSplit("CARBON_STEEL_BIKE_WHEEL", "_"),
  seperateOnWhitespace: StringSplit("Road Bike", " "),
  seperateOnPhrase: StringSplit("xenmoun mountain bike", "moun"),
  undefinedSeperator: StringSplit("AluminumBikeFrame", undefined),
  emptySeparatorString: StringSplit("Helmet", ""),
  emptySourceString: StringSplit("", "")
}
```

```json
[
  {
    "seperateOnLetter": [
      "Handl",
      "bar"
    ],
    "seperateOnSymbol": [
      "CARBON",
      "STEEL",
      "BIKE",
      "WHEEL"
    ],
    "seperateOnWhitespace": [
      "Road",
      "Bike"
    ],
    "seperateOnPhrase": [
      "xen",
      " ",
      "tain bike"
    ],
    "emptySeparatorString": [
      "Helmet"
    ],
    "emptySourceString": [
      ""
    ]
  }
]
```

## Remarks

- This system function doesn't utilize the index.

## Related content

- [`StringJoin`](stringjoin.md)
- [`CONCAT`](concat.md)
