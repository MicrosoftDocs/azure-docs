---
title: AVG in Azure Cosmos DB query language
description: Learn about the Average (AVG) SQL system function in Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 12/02/2020
ms.author: sidandrews
ms.reviewer: jucocchi
ms.custom: query-reference, ignite-2022
---
# AVG (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

This aggregate function returns the average of the values in the expression.
  
## Syntax
  
```sql
AVG(<numeric_expr>)  
```  
  
## Arguments
  
*numeric_expr*  
   Is a numeric expression.  
  
## Return types
  
Returns a numeric expression.  
  
## Examples
  
The following example returns the average value of `propertyA`:
  
```sql
SELECT AVG(c.propertyA)
FROM c
```  

## Remarks

This system function will benefit from a [range index](../../index-policy.md#includeexclude-strategy). If any arguments in `AVG` are string, boolean, or null, the entire aggregate system function will return `undefined`. If any argument has an `undefined` value, it will not impact the `AVG` calculation.

## Next steps

- [Mathematical functions in Azure Cosmos DB](mathematical-functions.md)
- [System functions in Azure Cosmos DB](system-functions.md)
- [Aggregate functions in Azure Cosmos DB](aggregate-functions.md)
