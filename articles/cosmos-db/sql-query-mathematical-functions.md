---
title: Mathematical functions in Azure Cosmos DB query language
description: Learn about the mathematical functions in Azure Cosmos DB to perform a calculation, based on input values that are provided as arguments, and return a numeric value.
author: ginamr
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 06/22/2021
ms.author: girobins
ms.custom: query-reference
---
# Mathematical functions (Azure Cosmos DB)  
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

The mathematical functions each perform a calculation, based on input values that are provided as arguments, and return a numeric value.

You can run queries like the following example:

```sql
    SELECT VALUE ABS(-4)
```

The result is:

```json
    [4]
```

## Functions

The following supported built-in mathematical functions perform a calculation, usually based on input arguments, and return a numeric expression. The **index usage** column assumes, where applicable, that you're comparing the mathematical system function to another value with an equality filter.
 
| System function                 | Index usage | [Index usage in queries with scalar aggregate functions](index-overview.md#index-utilization-for-scalar-aggregate-functions) | Remarks                                                      |
| ------------------------------- | ----------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| [ABS](sql-query-abs.md)         | Index seek  | Index seek                                             |                                                              |
| [ACOS](sql-query-acos.md)       | Full scan   | Full scan                                              |                                                              |
| [ASIN](sql-query-asin.md)       | Full scan   | Full scan                                              |                                                              |
| [ATAN](sql-query-atan.md)       | Full scan   | Full scan                                              |                                                              |
| [ATN2](sql-query-atn2.md)       | Full scan   | Full scan                                              |                                                              |
| [CEILING](sql-query-ceiling.md) | Index seek  | Index seek                                             |                                                              |
| [COS](sql-query-cos.md)         | Full scan   | Full scan                                              |                                                              |
| [COT](sql-query-cot.md)         | Full scan   | Full scan                                              |                                                              |
| [DEGREES](sql-query-degrees.md) | Index seek  | Index seek                                             |                                                              |
| [EXP](sql-query-exp.md)         | Full scan   | Full scan                                              |                                                              |
| [FLOOR](sql-query-floor.md)     | Index seek  | Index seek                                             |                                                              |
| [LOG](sql-query-log.md)         | Full scan   | Full scan                                              |                                                              |
| [LOG10](sql-query-log10.md)     | Full scan   | Full scan                                              |                                                              |
| [PI](sql-query-pi.md)           | N/A         | N/A                                                    | PI () returns a constant value. Because the result is deterministic, comparisons with PI() can use the index. |
| [POWER](sql-query-power.md)     | Full scan   | Full scan                                              |                                                              |
| [RADIANS](sql-query-radians.md) | Index seek  | Index seek                                             |                                                              |
| [RAND](sql-query-rand.md)       | N/A         | N/A                                                    | Rand() returns a random number. Because the result is non-deterministic, comparisons that involve Rand() cannot use the index. |
| [ROUND](sql-query-round.md)     | Index seek  | Index seek                                             |                                                              |
| [SIGN](sql-query-sign.md)       | Index seek  | Index seek                                             |                                                              |
| [SIN](sql-query-sin.md)         | Full scan   | Full scan                                              |                                                              |
| [SQRT](sql-query-sqrt.md)       | Full scan   | Full scan                                              |                                                              |
| [SQUARE](sql-query-square.md)   | Full scan   | Full scan                                              |                                                              |
| [TAN](sql-query-tan.md)         | Full scan   | Full scan                                              |                                                              |
| [TRUNC](sql-query-trunc.md)     | Index seek  | Index seek                                              |                                                              |
## Next steps

- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
- [User Defined Functions](sql-query-udfs.md)
- [Aggregates](sql-query-aggregate-functions.md)
