---
title: String functions in Azure Cosmos DB query language
description: Learn about string SQL system functions in Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 05/26/2021
ms.author: tisande
ms.custom: query-reference
---
# String functions (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

The string functions let you perform operations on strings in Azure Cosmos DB.

## Functions

The below scalar functions perform an operation on a string input value and return a string, numeric, or Boolean value. The **index usage** column assumes, where applicable, that you're comparing the string system function to another value with an equality filter.

| System function                                 | Index usage        | [Index usage in queries with scalar aggregate functions](index-overview.md#index-utilization-for-scalar-aggregate-functions) | Remarks                                                      |
| ----------------------------------------------- | ------------------ | ------------------------------------------------------ | ------------------------------------------------------------ |
| [CONCAT](sql-query-concat.md)                   | Full scan          | Full scan                                              |                                                              |
| [CONTAINS](sql-query-contains.md)               | Full index scan    | Full scan                                              |                                                              |
| [ENDSWITH](sql-query-endswith.md)               | Full index scan    | Full scan                                              |                                                              |
| [INDEX_OF](sql-query-index-of.md)               | Full scan          | Full scan                                              |                                                              |
| [LEFT](sql-query-left.md)                       | Precise index scan | Precise index scan                                     |                                                              |
| [LENGTH](sql-query-length.md)                   | Full scan          | Full scan                                              |                                                              |
| [LOWER](sql-query-lower.md)                     | Full scan          | Full scan                                              |                                                              |
| [LTRIM](sql-query-ltrim.md)                     | Full scan          | Full scan                                              |                                                              |
| [REGEXMATCH](sql-query-regexmatch.md)           | Full index scan    | Full scan                                              |                                                              |
| [REPLACE](sql-query-replace.md)                 | Full scan          | Full scan                                              |                                                              |
| [REPLICATE](sql-query-replicate.md)             | Full scan          | Full scan                                              |                                                              |
| [REVERSE](sql-query-reverse.md)                 | Full scan          | Full scan                                              |                                                              |
| [RIGHT](sql-query-right.md)                     | Full scan          | Full scan                                              |                                                              |
| [RTRIM](sql-query-rtrim.md)                     | Full scan          | Full scan                                              |                                                              |
| [STARTSWITH](sql-query-startswith.md)           | Precise index scan | Precise index scan                                     | Will be Expanded index scan if case-insensitive option is true. |
| [STRINGEQUALS](sql-query-stringequals.md)       | Index seek         | Index seek                                             | Will be Expanded index scan if case-insensitive option is true. |
| [StringToArray](sql-query-stringtoarray.md)     | Full scan          | Full scan                                              |                                                              |
| [StringToBoolean](sql-query-stringtoboolean.md) | Full scan          | Full scan                                              |                                                              |
| [StringToNull](sql-query-stringtonull.md)       | Full scan          | Full scan                                              |                                                              |
| [StringToNumber](sql-query-stringtonumber.md)   | Full scan          | Full scan                                              |                                                              |

Learn about about [index usage](index-overview.md#index-usage) in Azure Cosmos DB.

## Next steps

- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
- [User Defined Functions](sql-query-udfs.md)
- [Aggregates](sql-query-aggregate-functions.md)
