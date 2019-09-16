---
title: ROUND (Azure Cosmos DB)
description: Learn about SQL system function ROUND in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# ROUND (Azure Cosmos DB)
 Returns a numeric value, rounded to the closest integer value.  
  
## Syntax
  
```  
ROUND(<numeric_expression>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Remarks
  
  The rounding operation performed follows midpoint rounding away from zero. If the input is a numeric expression which falls exactly between two integers then the result will be the closest integer value away from zero.  
  
  |<numeric_expression>|Rounded|
  |-|-|
  |-6.5000|-7|
  |-0.5|-1|
  |0.5|1|
  |6.5000|7||
  
## Examples
  
  The following example rounds the following positive and negative numbers to the nearest integer.  
  
```  
SELECT ROUND(2.4) AS r1, ROUND(2.6) AS r2, ROUND(2.5) AS r3, ROUND(-2.4) AS r4, ROUND(-2.6) AS r5  
```  
  
  Here is the result set.  
  
```  
[{r1: 2, r2: 3, r3: 3, r4: -2, r5: -3}]  
```  


## See Also

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
