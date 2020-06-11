---
title: Mathematical functions in Azure Cosmos DB query language
description: Learn about the mathematical functions in Azure Cosmos DB to perform a calculation, based on input values that are provided as arguments, and return a numeric value.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# Mathematical functions (Azure Cosmos DB)  

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

The following supported built-in mathematical functions perform a calculation, usually based on input arguments, and return a numeric expression.
  
||||  
|-|-|-|  
|[ABS](sql-query-abs.md)|[ACOS](sql-query-acos.md)|[ASIN](sql-query-asin.md)|  
|[ATAN](sql-query-atan.md)|[ATN2](sql-query-atn2.md)|[CEILING](sql-query-ceiling.md)|  
|[COS](sql-query-cos.md)|[COT](sql-query-cot.md)|[DEGREES](sql-query-degrees.md)|  
|[EXP](sql-query-exp.md)|[FLOOR](sql-query-floor.md)|[LOG](sql-query-log.md)|  
|[LOG10](sql-query-log10.md)|[PI](sql-query-pi.md)|[POWER](sql-query-power.md)|  
|[RADIANS](sql-query-radians.md)|[RAND](sql-query-rand.md)|[ROUND](sql-query-round.md)|
|[SIGN](sql-query-sign.md)|[SIN](sql-query-sin.md)|[SQRT](sql-query-sqrt.md)|
|[SQUARE](sql-query-square.md)|[TAN](sql-query-tan.md)|[TRUNC](sql-query-trunc.md)||  
  
All mathematical functions, except for RAND, are deterministic functions. This means they return the same results each time they are called with a specific set of input values.

## Next steps

- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
- [User Defined Functions](sql-query-udfs.md)
- [Aggregates](sql-query-aggregates.md)
