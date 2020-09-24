---
title: SELECT clause in Azure Cosmos DB
description: Learn about SQL SELECT clause for Azure Cosmos DB. Use SQL as an Azure Cosmos DB JSON query language.
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/08/2020
ms.author: tisande
---

# SELECT clause in Azure Cosmos DB

Every query consists of a `SELECT` clause and optional [FROM](sql-query-from.md) and [WHERE](sql-query-where.md) clauses, per ANSI SQL standards. Typically, the source in the `FROM` clause is enumerated, and the `WHERE` clause applies a filter on the source to retrieve a subset of JSON items. The `SELECT` clause then projects the requested JSON values in the select list.

## Syntax

```sql
SELECT <select_specification>  

<select_specification> ::=
      '*'
      | [DISTINCT] <object_property_list>
      | [DISTINCT] VALUE <scalar_expression> [[ AS ] value_alias]  
  
<object_property_list> ::=
{ <scalar_expression> [ [ AS ] property_alias ] } [ ,...n ]  
```  
  
## Arguments
  
- `<select_specification>`  

  Properties or value to be selected for the result set.  
  
- `'*'`  

  Specifies that the value should be retrieved without making any changes. Specifically if the processed value is an object, all properties will be retrieved.  
  
- `<object_property_list>`  
  
  Specifies the list of properties to be retrieved. Each returned value will be an object with the properties specified.  
  
- `VALUE`  

  Specifies that the JSON value should be retrieved instead of the complete JSON object. This, unlike `<property_list>` does not wrap the projected value in an object.  

- `DISTINCT`
  
  Specifies that duplicates of projected properties should be removed.  

- `<scalar_expression>`  

  Expression representing the value to be computed. See [Scalar expressions](sql-query-scalar-expressions.md) section for details.  

## Remarks

The `SELECT *` syntax is only valid if FROM clause has declared exactly one alias. `SELECT *` provides an identity projection, which can be useful if no projection is needed. SELECT * is only valid if FROM clause is specified and introduced only a single input source.  
  
Both `SELECT <select_list>` and `SELECT *` are "syntactic sugar" and can be alternatively expressed by using simple SELECT statements as shown below.  
  
1. `SELECT * FROM ... AS from_alias ...`  
  
   is equivalent to:  
  
   `SELECT from_alias FROM ... AS from_alias ...`  
  
2. `SELECT <expr1> AS p1, <expr2> AS p2,..., <exprN> AS pN [other clauses...]`  
  
   is equivalent to:  
  
   `SELECT VALUE { p1: <expr1>, p2: <expr2>, ..., pN: <exprN> }[other clauses...]`  
  
## Examples

The following SELECT query example returns `address` from `Families` whose `id` matches `AndersenFamily`:

```sql
    SELECT f.address
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

The results are:

```json
    [{
      "address": {
        "state": "WA",
        "county": "King",
        "city": "Seattle"
      }
    }]
```

## Next steps

- [Getting started](sql-query-getting-started.md)
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmos-dotnet-v3)
- [WHERE clause](sql-query-where.md)
