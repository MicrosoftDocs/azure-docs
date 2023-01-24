---
title: String functions in Azure Cosmos DB query language
description: Learn about string SQL system functions in Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 05/26/2021
ms.author: sidandrews
ms.reviewer: jucocchi
ms.custom: query-reference, ignite-2022
---
# String functions (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

The string functions let you perform operations on strings in Azure Cosmos DB.

## Functions

The below scalar functions perform an operation on a string input value and return a string, numeric, or Boolean value. The **index usage** column assumes, where applicable, that you're comparing the string system function to another value with an equality filter.

| System function                                 | Index usage        | [Index usage in queries with scalar aggregate functions](../../index-overview.md#index-utilization-for-scalar-aggregate-functions) | Remarks                                                      |
| ----------------------------------------------- | ------------------ | ------------------------------------------------------ | ------------------------------------------------------------ |
| [CONCAT](concat.md)                   | Full scan          | Full scan                                              |                                                              |
| [CONTAINS](contains.md)               | Full index scan    | Full scan                                              |                                                              |
| [ENDSWITH](endswith.md)               | Full index scan    | Full scan                                              |                                                              |
| [INDEX_OF](index-of.md)               | Full scan          | Full scan                                              |                                                              |
| [LEFT](left.md)                       | Precise index scan | Precise index scan                                     |                                                              |
| [LENGTH](length.md)                   | Full scan          | Full scan                                              |                                                              |
| [LOWER](lower.md)                     | Full scan          | Full scan                                              |                                                              |
| [LTRIM](ltrim.md)                     | Full scan          | Full scan                                              |                                                              |
| [REGEXMATCH](regexmatch.md)           | Full index scan    | Full scan                                              |                                                              |
| [REPLACE](replace.md)                 | Full scan          | Full scan                                              |                                                              |
| [REPLICATE](replicate.md)             | Full scan          | Full scan                                              |                                                              |
| [REVERSE](reverse.md)                 | Full scan          | Full scan                                              |                                                              |
| [RIGHT](right.md)                     | Full scan          | Full scan                                              |                                                              |
| [RTRIM](rtrim.md)                     | Full scan          | Full scan                                              |                                                              |
| [STARTSWITH](startswith.md)           | Precise index scan | Precise index scan                                     | Will be Expanded index scan if case-insensitive option is true. |
| [STRINGEQUALS](stringequals.md)       | Index seek         | Index seek                                             | Will be Expanded index scan if case-insensitive option is true. |
| [StringToArray](stringtoarray.md)     | Full scan          | Full scan                                              |                                                              |
| [StringToBoolean](stringtoboolean.md) | Full scan          | Full scan                                              |                                                              |
| [StringToNull](stringtonull.md)       | Full scan          | Full scan                                              |                                                              |
| [StringToNumber](stringtonumber.md)   | Full scan          | Full scan                                              |                                                              |
| [StringToObject](stringtoobject.md)   | Full scan          | Full scan                                              |                                                              |
| [SUBSTRING](substring.md)             | Full scan          | Full scan                                              |                                                              |
| [ToString](tostring.md)               | Full scan          | Full scan                                              |                                                              |
| [TRIM](trim.md)                       | Full scan          | Full scan                                              |                                                              |
| [UPPER](upper.md)                     | Full scan          | Full scan                                              |                                                              |

Learn about about [index usage](../../index-overview.md#index-usage) in Azure Cosmos DB.

## Next steps

- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
- [User Defined Functions](udfs.md)
- [Aggregates](aggregate-functions.md)
