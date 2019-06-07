---
title: Aggregate functions
description: Learn about SQL aggregate function syntax for Azure Cosmos DB.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/31/2019
ms.author: mjbrown

---
# <a id="aggregate_functions></a> Aggregate functions

Aggregate functions perform a calculation on a set of values in the SELECT clause and return a single value. For example, the following query returns the count of items within the `Families` container:

```sql
    SELECT COUNT(1)
    FROM Families f
```

The results are:

```json
    [{
        "$1": 2
    }]
```

You can also return only the scalar value of the aggregate by using the VALUE keyword. For example, the following query returns the count of values as a single number:

```sql
    SELECT VALUE COUNT(1)
    FROM Families f
```

The results are:

```json
    [ 2 ]
```

You can also combine aggregations with filters. For example, the following query returns the count of items with the address state of `WA`.

```sql
    SELECT VALUE COUNT(1)
    FROM Families f
    WHERE f.address.state = "WA"
```

The results are:

```json
    [ 1 ]
```

The SQL API supports the following aggregate functions. SUM and AVG operate on numeric values, and COUNT, MIN, and MAX work on numbers, strings, Booleans, and nulls.

| Function | Description |
|-------|-------------|
| COUNT | Returns the number of items in the expression. |
| SUM   | Returns the sum of all the values in the expression. |
| MIN   | Returns the minimum value in the expression. |
| MAX   | Returns the maximum value in the expression. |
| AVG   | Returns the average of the values in the expression. |

You can also aggregate over the results of an array iteration.

> [!NOTE]
> In the Azure portal's Data Explorer, aggregation queries may aggregate partial results over only one query page. The SDK produces a single cumulative value across all pages. To perform aggregation queries using code, you need .NET SDK 1.12.0, .NET Core SDK 1.1.0, or Java SDK 1.9.5 or above.
>

## <a id="References"></a>References

- [Azure Cosmos DB SQL specification](https://go.microsoft.com/fwlink/p/?LinkID=510612)
- [ANSI SQL 2011](https://www.iso.org/iso/iso_catalogue/catalogue_tc/catalogue_detail.htm?csnumber=53681)
- [JSON](https://json.org/)
- [Javascript Specification](https://www.ecma-international.org/publications/standards/Ecma-262.htm) 
- [LINQ](/previous-versions/dotnet/articles/bb308959(v=msdn.10)) 
- Graefe, Goetz. [Query evaluation techniques for large databases](https://dl.acm.org/citation.cfm?id=152611). *ACM Computing Surveys* 25, no. 2 (1993).
- Graefe, G. "The Cascades framework for query optimization." *IEEE Data Eng. Bull.* 18, no. 3 (1995).
- Lu, Ooi, Tan. "Query Processing in Parallel Relational Database Systems." *IEEE Computer Society Press* (1994).
- Olston, Christopher, Benjamin Reed, Utkarsh Srivastava, Ravi Kumar, and Andrew Tomkins. "Pig Latin: A Not-So-Foreign Language for Data Processing." *SIGMOD* (2008).

## Next steps

- [Introduction to Azure Cosmos DB][introduction]
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [Azure Cosmos DB consistency levels][consistency-levels]

[1]: ./media/how-to-sql-query/sql-query1.png
[introduction]: introduction.md
[consistency-levels]: consistency-levels.md