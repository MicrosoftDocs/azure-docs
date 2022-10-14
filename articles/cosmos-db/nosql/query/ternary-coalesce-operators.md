---
title: Ternary and coalesce operators in Azure Cosmos DB
description: Learn about SQL ternary and coalesce  operators supported by Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 01/07/2022
ms.author: sidandrews
ms.reviewer: jucocchi
---
# Ternary and coalesce operators in Azure Cosmos DB
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

This article details the ternary and coalesce operators supported by Azure Cosmos DB.

## Understanding ternary and coalesce operators

You can use the Ternary (?) and Coalesce (??) operators to build conditional expressions, as in programming languages like C# and JavaScript.

You can use the ? operator to construct new JSON properties on the fly. For example, the following query classifies grade levels into `elementary` or `other`:

```sql
     SELECT (c.grade < 5)? "elementary": "other" AS gradeLevel
     FROM Families.children[0] c
```

You can also nest calls to the ? operator, as in the following query: 

```sql
    SELECT (c.grade < 5)? "elementary": ((c.grade < 9)? "junior": "high") AS gradeLevel
    FROM Families.children[0] c
```

As with other query operators, the ? operator excludes items if the referenced properties are missing or the types being compared are different.

Use the ?? operator to efficiently check for a property in an item when querying against semi-structured or mixed-type data. For example, the following query returns `lastName` if present, or `surname` if `lastName` isn't present.

```sql
    SELECT f.lastName ?? f.surname AS familyName
    FROM Families f
```

## Next steps

- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmos-dotnet-v3)
- [Keywords](keywords.md)
- [SELECT clause](select.md)
