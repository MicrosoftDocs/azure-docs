---
title: UPPER in Azure Cosmos DB query language
description: Learn about SQL system function UPPER in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 04/08/2021
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# UPPER (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a string expression after converting lowercase character data to uppercase.

> [!NOTE]
> This function uses culture-independent (invariant) casing rules when returning the converted string expression. 

The UPPER system function doesn't utilize the index. If you plan to do frequent case insensitive comparisons, the UPPER system function may consume a significant number of RUs. If so, instead of using the UPPER system function to normalize data each time for comparisons, you can normalize the casing upon insertion. Then a query such as SELECT * FROM c WHERE UPPER(c.name) = 'USERNAME' simply becomes SELECT * FROM c WHERE c.name = 'USERNAME'.

## Syntax
  
```sql
UPPER(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is a string expression.  
  
## Return types
  
Returns a string expression.  
  
## Examples
  
The following example shows how to use `UPPER` in a query  
  
```sql
SELECT UPPER("Abc") AS upper  
```  
  
Here's the result set.  
  
```json
[{"upper": "ABC"}]
```

## Remarks

This system function won't [use indexes](../../index-overview.md#index-usage).

## Next steps

- [String functions Azure Cosmos DB](string-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
