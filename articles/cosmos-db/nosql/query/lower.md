---
title: LOWER
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a string expression with uppercase characters converted to lowercase.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# LOWER (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a string expression after converting uppercase character data to lowercase.

> [!NOTE]
> This function automatically uses culture-independent (invariant) casing rules when returning the converted string expression.

## Syntax
  
```sql
LOWER(<string_expr>)  
```  
  
## Arguments

| | Description |
| --- | --- |
| **`string_expr`** | A string expression. |

## Return types
  
Returns a string expression.

## Examples
  
The following example shows how to use the function to modify various strings.
  
```sql
SELECT VALUE {
    lowercase: LOWER("adventureworks"),
    uppercase: LOWER("ADVENTUREWORKS"),
    camelCase: LOWER("adventureWorks"),
    pascalCase: LOWER("AdventureWorks"),
    upperSnakeCase: LOWER("ADVENTURE_WORKS")
}
```  
  
```json
[
  {
    "lowercase": "adventureworks",
    "uppercase": "adventureworks",
    "camelCase": "adventureworks",
    "pascalCase": "adventureworks",
    "upperSnakeCase": "adventure_works"
  }
]
```

## Remarks

- This system function doesn't use the index.
- If you plan to do frequent case insensitive comparisons, this function may consume a significant number of RUs. Consider normalizing the casing of strings when ingesting your data. Then a query like `SELECT * FROM c WHERE LOWER(c.name) = 'USERNAME'` is simplified to `SELECT * FROM c WHERE c.name = 'USERNAME'`.

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`UPPER`](upper.md)
