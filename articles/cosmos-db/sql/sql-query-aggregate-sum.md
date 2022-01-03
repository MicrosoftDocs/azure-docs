---
title: SUM in Azure Cosmos DB query language
description: Learn about the Sum (SUM) SQL system function in Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 12/02/2020
ms.author: tisande
ms.custom: query-reference
---
# SUM (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

This aggregate function returns the sum of the values in the expression.
  
## Syntax
  
```sql
SUM(<numeric_expr>)  
```  
  
## Arguments
  
*numeric_expr*  
   Is a numeric expression.  
  
## Return types
  
Returns a numeric expression.  
  
## Examples
  
The following example returns the sum of `propertyA`:
  
```sql
SELECT SUM(c.propertyA)
FROM c
```  

## Remarks

This system function will benefit from a [range index](../index-policy.md#includeexclude-strategy). If any arguments in `SUM` are string, boolean, or null, the entire aggregate system function will return `undefined`. If any argument has an `undefined` value, it will be not impact the `SUM` calculation.

## Next steps

- [Mathematical functions in Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions in Azure Cosmos DB](sql-query-system-functions.md)
- [Aggregate functions in Azure Cosmos DB](sql-query-aggregate-functions.md)