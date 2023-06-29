---
title: DocumentId
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the partition-specific integer identifier for an item.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# DocumentId (NoSQL query)

Extracts the integer identifier corresponding to a specific item within a physical partition.

## Syntax

```sql
DOCUMENTID(<root_specifier>)
```

## Arguments

| | Description |
| --- | --- |
| **`root_specifier`** | Alias that identifies the root. |

## Return types

Integer identifying an item within a physical partition.

## Examples

This example illustrates using this function to extract and return the integer identifier relative to a physical partition.

```json
[
  {
    "id": "63700",
    "name": "Joltage Kid's Vest"
  }
]
```

```sql
SELECT
    p.id,
    p._rid,
    DOCUMENTID(p) AS documentId
FROM  
    product p
```

```json
[
  {
    "id": "63700",
    "_rid": "36ZyAPW+uN8NAAAAAAAAAA==",
    "documentId": 13
  }
]
```

This function can also be used as a filter.

```sql
SELECT
    p.id,
    DOCUMENTID(p) AS documentId
FROM  
    product p
WHERE
    DOCUMENTID(p) >= 5 AND
    DOCUMENTID(p) <= 15
```

```json
[
  {
    "id": "63700",
    "documentId": 13
  }
]
```

## Remarks

- This function returns an integer value that is only unique within a single physical partition.

## See also

- [System functions](system-functions.yml)
- [`IS_OBJECT`](is-object.md)
