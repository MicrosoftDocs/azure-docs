---
title: SQL query operators for Azure Cosmos DB
description: Learn about SQL operators for Azure Cosmos DB.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/31/2019
ms.author: mjbrown

---
# Operators in Azure Cosmos DB

This article details the various operators supported by Azure Cosmos DB.

## Equality and Comparison Operators

The following table shows the result of equality comparisons in the SQL API between any two JSON types.

| **Op** | **Undefined** | **Null** | **Boolean** | **Number** | **String** | **Object** | **Array** |
|---|---|---|---|---|---|---|---|
| **Undefined** | Undefined | Undefined | Undefined | Undefined | Undefined | Undefined | Undefined |
| **Null** | Undefined | **Ok** | Undefined | Undefined | Undefined | Undefined | Undefined |
| **Boolean** | Undefined | Undefined | **Ok** | Undefined | Undefined | Undefined | Undefined |
| **Number** | Undefined | Undefined | Undefined | **Ok** | Undefined | Undefined | Undefined |
| **String** | Undefined | Undefined | Undefined | Undefined | **Ok** | Undefined | Undefined |
| **Object** | Undefined | Undefined | Undefined | Undefined | Undefined | **Ok** | Undefined |
| **Array** | Undefined | Undefined | Undefined | Undefined | Undefined | Undefined | **Ok** |

For comparison operators such as `>`, `>=`, `!=`, `<`, and `<=`, comparison across types or between two objects or arrays produces `Undefined`.  

If the result of the scalar expression is `Undefined`, the item isn't included in the result, because `Undefined` doesn't equal `true`.

## Logical (AND, OR and NOT) operators

Logical operators operate on Boolean values. The following tables show the logical truth tables for these operators:

**OR operator**

| OR | True | False | Undefined |
| --- | --- | --- | --- |
| True |True |True |True |
| False |True |False |Undefined |
| Undefined |True |Undefined |Undefined |

**AND operator**

| AND | True | False | Undefined |
| --- | --- | --- | --- |
| True |True |False |Undefined |
| False |False |False |False |
| Undefined |Undefined |False |Undefined |

**NOT operator**

| NOT |  |
| --- | --- |
| True |False |
| False |True |
| Undefined |Undefined |


## * operator

The special operator * projects the entire item as is. When used, it must be the only projected field. A query like `SELECT * FROM Families f` is valid, but `SELECT VALUE * FROM Families f` and  `SELECT *, f.id FROM Families f` are not valid.

## ? and ?? operators

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

- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [Keywords](sql-query-keywords.md)
- [SELECT clause](sql-query-select.md)
