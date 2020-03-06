---
title: RAND in Azure Cosmos DB query language
description: Learn about SQL system function RAND in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/16/2019
ms.author: girobins
ms.custom: query-reference
---
# RAND (Azure Cosmos DB)
 Returns a randomly generated numeric value from [0,1).
 
## Syntax
  
```sql
RAND ()  
```  

## Return types

  Returns a numeric expression.

## Remarks

  `RAND` is a nondeterministic function. Repetitive calls of `RAND` do not return the same results.

## Examples
  
  The following example returns a randomly generated numeric value.
  
```sql
SELECT RAND() AS rand 
```  
  
 Here is the result set.  
  
```json
[{"rand": 0.87860053195618093}]  
``` 

## Remarks

This system function will not utilize the index.

## Next steps

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
