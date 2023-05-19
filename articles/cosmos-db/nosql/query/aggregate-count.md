---
title: COUNT in Azure Cosmos DB query language
description: Learn about the Count (COUNT) SQL system function in Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 12/02/2020
ms.author: sidandrews
ms.reviewer: jucocchi
ms.custom: query-reference, ignite-2022
---
# COUNT (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

This system function returns the count of the values in the expression.
  
## Syntax
  
```sql
COUNT(<scalar_expr>)  
```  
  
## Arguments
  
*scalar_expr*  
   Any expression that results in a scalar value
  
## Return types
  
Returns a numeric (scalar) value
  
## Examples
  
The following example returns the total count of items in a container:
  
```sql
SELECT COUNT(1)
FROM c
```

In the first example, the parameter of the `COUNT` function is any scalar value or expression, but the parameter does not influence the result. The first example passes in a scalar value of `1` to the `COUNT` function. This second example will produce an identical result even though a different scalar expression is used. In the second example, the scalar expression of `2 + 3` is passed in to the `COUNT` function, but the result will be equivalent to the first function.

```sql
SELECT COUNT(2 + 3)
FROM c
```

## Remarks

This system function will benefit from a [range index](../../index-policy.md#includeexclude-strategy) for any properties in the query's filter.

## Next steps

- [Mathematical functions in Azure Cosmos DB](mathematical-functions.md)
- [System functions in Azure Cosmos DB](system-functions.md)
- [Aggregate functions in Azure Cosmos DB](aggregate-functions.md)
