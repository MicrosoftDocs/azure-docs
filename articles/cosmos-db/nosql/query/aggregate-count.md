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
   Is any scalar expression
  
## Return types
  
Returns a numeric expression.  
  
## Examples
  
The following example returns the total count of items in a container:
  
```sql
SELECT COUNT(1)
FROM c
``` 
COUNT can take any scalar expression as input. The below query will produce an equivalent results:

```sql
SELECT COUNT(2)
FROM c
```

## Remarks

This system function will benefit from a [range index](../../index-policy.md#includeexclude-strategy) for any properties in the query's filter.

## Next steps

- [Mathematical functions in Azure Cosmos DB](mathematical-functions.md)
- [System functions in Azure Cosmos DB](system-functions.md)
- [Aggregate functions in Azure Cosmos DB](aggregate-functions.md)
