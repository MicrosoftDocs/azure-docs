---
title: MIN in Azure Cosmos DB query language
description: Learn about the Min (MIN) SQL system function in Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 12/02/2020
ms.author: tisande
ms.custom: query-reference
---
# MIN (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

This aggregate function returns the minimum of the values in the expression.
  
## Syntax
  
```sql
MIN(<scalar_expr>)  
```  
  
## Arguments
  
*scalar_expr*  
   Is a scalar expression. 
  
## Return types
  
Returns a scalar expression.  
  
## Examples
  
The following example returns the minimum value of `propertyA`:
  
```sql
SELECT MIN(c.propertyA)
FROM c
```  

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy). The arguments in `MIN` can be number, string, boolean, or null. Any undefined values will be ignored.

When comparing different types data, the following priority order is used (in ascending order):

- null
- boolean
- number
- string

## Next steps

- [Mathematical functions in Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions in Azure Cosmos DB](sql-query-system-functions.md)
- [Aggregate functions in Azure Cosmos DB](sql-query-aggregate-functions.md)