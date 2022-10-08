---
title: SIN in Azure Cosmos DB query language
description: Learn about SQL system function SIN in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# SIN (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

 Returns the trigonometric sine of the specified angle, in radians, in the specified expression.  
  
## Syntax
  
```sql
SIN(<numeric_expr>)  
```  
  
## Arguments
  
*numeric_expr*  
   Is a numeric expression.  
  
## Return types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example calculates the `SIN` of the specified angle.  
  
```sql
SELECT SIN(45.175643) AS sin  
```  
  
 Here is the result set.  
  
```json
[{"sin": 0.929607286611012}]  
```  

## Remarks

This system function will not utilize the index.

## Next steps

- [Mathematical functions Azure Cosmos DB](mathematical-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
