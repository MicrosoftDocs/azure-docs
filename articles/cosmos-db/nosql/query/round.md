---
title: ROUND in Azure Cosmos DB query language
description: Learn about SQL system function ROUND in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# ROUND (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

 Returns a numeric value, rounded to the closest integer value.  
  
## Syntax
  
```sql
ROUND(<numeric_expr>)  
```  
  
## Arguments
  
*numeric_expr*  
   Is a numeric expression.  
  
## Return types
  
  Returns a numeric expression.  
  
## Remarks
  
The rounding operation performed follows midpoint rounding away from zero. If the input is a numeric expression which falls exactly between two integers then the result will be the closest integer value away from zero. This system function will benefit from a [range index](../../index-policy.md#includeexclude-strategy).
  
|<numeric_expr>|Rounded|
|-|-|
|-6.5000|-7|
|-0.5|-1|
|0.5|1|
|6.5000|7|
  
## Examples
  
The following example rounds the following positive and negative numbers to the nearest integer.  
  
```sql
SELECT ROUND(2.4) AS r1, ROUND(2.6) AS r2, ROUND(2.5) AS r3, ROUND(-2.4) AS r4, ROUND(-2.6) AS r5  
```  
  
Here is the result set.  
  
```json
[{r1: 2, r2: 3, r3: 3, r4: -2, r5: -3}]  
```  

## Next steps

- [Mathematical functions Azure Cosmos DB](mathematical-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
