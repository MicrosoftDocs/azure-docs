---
title: Mathematical functions in Azure Cosmos DB query language
description: Learn about the mathematical functions in Azure Cosmos DB to perform a calculation, based on input values that are provided as arguments, and return a numeric value.
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 06/22/2021
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# Mathematical functions (Azure Cosmos DB)  
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

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
 
| System function                 | Index usage | [Index usage in queries with scalar aggregate functions](../../index-overview.md#index-utilization-for-scalar-aggregate-functions) | Remarks                                                      |
| ------------------------------- | ----------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| [ABS](abs.md)         | Index seek  | Index seek                                             |                                                              |
| [ACOS](acos.md)       | Full scan   | Full scan                                              |                                                              |
| [ASIN](asin.md)       | Full scan   | Full scan                                              |                                                              |
| [ATAN](atan.md)       | Full scan   | Full scan                                              |                                                              |
| [ATN2](atn2.md)       | Full scan   | Full scan                                              |                                                              |
| [CEILING](ceiling.md) | Index seek  | Index seek                                             |                                                              |
| [COS](cos.md)         | Full scan   | Full scan                                              |                                                              |
| [COT](cot.md)         | Full scan   | Full scan                                              |                                                              |
| [DEGREES](degrees.md) | Index seek  | Index seek                                             |                                                              |
| [EXP](exp.md)         | Full scan   | Full scan                                              |                                                              |
| [FLOOR](floor.md)     | Index seek  | Index seek                                             |                                                              |
| [LOG](log.md)         | Full scan   | Full scan                                              |                                                              |
| [LOG10](log10.md)     | Full scan   | Full scan                                              |                                                              |
| [PI](pi.md)           | N/A         | N/A                                                    | PI () returns a constant value. Because the result is deterministic, comparisons with PI() can use the index. |
| [POWER](power.md)     | Full scan   | Full scan                                              |                                                              |
| [RADIANS](radians.md) | Index seek  | Index seek                                             |                                                              |
| [RAND](rand.md)       | N/A         | N/A                                                    | Rand() returns a random number. Because the result is non-deterministic, comparisons that involve Rand() cannot use the index. |
| [ROUND](round.md)     | Index seek  | Index seek                                             |                                                              |
| [SIGN](sign.md)       | Index seek  | Index seek                                             |                                                              |
| [SIN](sin.md)         | Full scan   | Full scan                                              |                                                              |
| [SQRT](sqrt.md)       | Full scan   | Full scan                                              |                                                              |
| [SQUARE](square.md)   | Full scan   | Full scan                                              |                                                              |
| [TAN](tan.md)         | Full scan   | Full scan                                              |                                                              |
| [TRUNC](trunc.md)     | Index seek  | Index seek                                              |                                                              |
## Next steps

- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
- [User Defined Functions](udfs.md)
- [Aggregates](aggregate-functions.md)
