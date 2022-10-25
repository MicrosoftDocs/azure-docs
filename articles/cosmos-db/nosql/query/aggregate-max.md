---
title: MAX in Azure Cosmos DB query language
description: Learn about the Max (MAX) SQL system function in Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 12/02/2020
ms.author: sidandrews
ms.reviewer: jucocchi
ms.custom: query-reference, ignite-2022
---
# MAX (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

This aggregate function returns the maximum of the values in the expression.
  
## Syntax
  
```sql
MAX(<scalar_expr>)  
```  
  
## Arguments

*scalar_expr*  
   Is a scalar expression. 
  
## Return types
  
Returns a scalar expression.  
  
## Examples
  
The following example returns the maximum value of `propertyA`:
  
```sql
SELECT MAX(c.propertyA)
FROM c
```  

## Remarks

This system function will benefit from a [range index](../../index-policy.md#includeexclude-strategy). The arguments in `MAX` can be number, string, boolean, or null. Any undefined values will be ignored.

When comparing different types data, the following priority order is used (in descending order):

- string
- number
- boolean
- null

## Next steps

- [Mathematical functions in Azure Cosmos DB](mathematical-functions.md)
- [System functions in Azure Cosmos DB](system-functions.md)
- [Aggregate functions in Azure Cosmos DB](aggregate-functions.md)
