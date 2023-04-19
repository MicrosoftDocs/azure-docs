---
title: LOWER in Azure Cosmos DB query language
description: Learn about the LOWER SQL system function in Azure Cosmos DB to return a string expression after converting uppercase character data to lowercase
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 04/07/2021
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# LOWER (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a string expression after converting uppercase character data to lowercase.

> [!NOTE]
> This function uses culture-independent (invariant) casing rules when returning the converted string expression.

The LOWER system function doesn't utilize the index. If you plan to do frequent case insensitive comparisons, the LOWER system function may consume a significant number of RUs. If so, instead of using the LOWER system function to normalize data each time for comparisons, you can normalize the casing upon insertion. Then a query such as SELECT * FROM c WHERE LOWER(c.name) = 'username' simply becomes SELECT * FROM c WHERE c.name = 'username'.

## Syntax
  
```sql
LOWER(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is a string expression.  
  
## Return types
  
Returns a string expression.  
  
## Examples
  
The following example shows how to use `LOWER` in a query.  
  
```sql
SELECT LOWER("Abc") AS lower
```  
  
 Here's the result set.  
  
```json
[{"lower": "abc"}]
```  

## Remarks

This system function won't [use indexes](../../index-overview.md#index-usage).

## Next steps

- [String functions Azure Cosmos DB](string-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
