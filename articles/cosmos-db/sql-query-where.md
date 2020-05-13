---
title: WHERE clause in Azure Cosmos DB
description: Learn about SQL WHERE clause for Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/06/2020
ms.author: tisande

---
# WHERE clause in Azure Cosmos DB

The optional WHERE clause (`WHERE <filter_condition>`) specifies condition(s) that the source JSON items must satisfy for the query to include them in results. A JSON item must evaluate the specified conditions to `true` to be considered for the result. The index layer uses the WHERE clause to determine the smallest subset of source items that can be part of the result.
  
## Syntax
  
```sql  
WHERE <filter_condition>  
<filter_condition> ::= <scalar_expression>  
  
```  
  
## Arguments

- `<filter_condition>`  
  
   Specifies the condition to be met for the documents to be returned.  
  
- `<scalar_expression>`  
  
   Expression representing the value to be computed. See [Scalar expressions](sql-query-scalar-expressions.md) for details.  
  
## Remarks
  
  In order for the document to be returned an expression specified as filter condition must evaluate to true. Only Boolean value `true` will satisfy the condition, any other value: undefined, null, false, Number, Array, or Object will not satisfy the condition.

  If you include your partition key in the `WHERE` clause as part of an equality filter, your query will automatically filter to only the relevant partitions.

## Examples

The following query requests items that contain an `id` property whose value is `AndersenFamily`. It excludes any item that does not have an `id` property or whose value doesn't match `AndersenFamily`.

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

### Scalar expressions in the WHERE clause

The previous example showed a simple equality query. The SQL API also supports various [scalar expressions](sql-query-scalar-expressions.md). The most commonly used are binary and unary expressions. Property references from the source JSON object are also valid expressions.

You can use the following supported binary operators:  

|**Operator type**  | **Values** |
|---------|---------|
|Arithmetic | +,-,*,/,% |
|Bitwise    | \|, &, ^, <<, >>, >>> (zero-fill right shift) |
|Logical    | AND, OR, NOT      |
|Comparison | =, !=, &lt;, &gt;, &lt;=, &gt;=, <> |
|String     |  \|\| (concatenate) |

The following queries use binary operators:

```sql
    SELECT *
    FROM Families.children[0] c
    WHERE c.grade % 2 = 1     -- matching grades == 5, 1

    SELECT *
    FROM Families.children[0] c
    WHERE c.grade ^ 4 = 1    -- matching grades == 5

    SELECT *
    FROM Families.children[0] c
    WHERE c.grade >= 5    -- matching grades == 5
```

You can also use the unary operators +,-, ~, and NOT in queries, as shown in the following examples:

```sql
    SELECT *
    FROM Families.children[0] c
    WHERE NOT(c.grade = 5)  -- matching grades == 1

    SELECT *
    FROM Families.children[0] c
    WHERE (-c.grade = -5)  -- matching grades == 5
```

You can also use property references in queries. For example, `SELECT * FROM Families f WHERE f.isRegistered` returns the JSON item containing the property `isRegistered` with value equal to `true`. Any other value, such as `false`, `null`, `Undefined`, `<number>`, `<string>`, `<object>`, or `<array>`, excludes the item from the result.

## Next steps

- [Getting started](sql-query-getting-started.md)
- [IN keyword](sql-query-keywords.md#in)
- [FROM clause](sql-query-from.md)