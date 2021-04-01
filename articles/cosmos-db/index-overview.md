---
title: Indexing in Azure Cosmos DB 
description: Understand how indexing works in Azure Cosmos DB, different types of indexes such as Range, Spatial, composite indexes supported. 
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 03/23/2021
ms.author: tisande
---

# Indexing in Azure Cosmos DB - Overview
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

Azure Cosmos DB is a schema-agnostic database that allows you to iterate on your application without having to deal with schema or index management. By default, Azure Cosmos DB automatically indexes every property for all items in your [container](account-databases-containers-items.md#azure-cosmos-containers) without having to define any schema or configure secondary indexes.

The goal of this article is to explain how Azure Cosmos DB indexes data and how it uses indexes to improve query performance. It is recommended to go through this section before exploring how to customize [indexing policies](index-policy.md).

## From items to trees

Every time an item is stored in a container, its content is projected as a JSON document, then converted into a tree representation. What that means is that every property of that item gets represented as a node in a tree. A pseudo root node is created as a parent to all the first-level properties of the item. The leaf nodes contain the actual scalar values carried by an item.

As an example, consider this item:

```json
    {
        "locations": [
            { "country": "Germany", "city": "Berlin" },
            { "country": "France", "city": "Paris" }
        ],
        "headquarters": { "country": "Belgium", "employees": 250 },
        "exports": [
            { "city": "Moscow" },
            { "city": "Athens" }
        ]
    }
```

It would be represented by the following tree:

:::image type="content" source="./media/index-overview/item-as-tree.png" alt-text="The previous item represented as a tree" border="false":::

Note how arrays are encoded in the tree: every entry in an array gets an intermediate node labeled with the index of that entry within the array (0, 1 etc.).

## From trees to property paths

The reason why Azure Cosmos DB transforms items into trees is because it allows properties to be referenced by their paths within those trees. To get the path for a property, we can traverse the tree from the root node to that property, and concatenate the labels of each traversed node.

Here are the paths for each property from the example item described above:

- /locations/0/country: "Germany"
- /locations/0/city: "Berlin"
- /locations/1/country: "France"
- /locations/1/city: "Paris"
- /headquarters/country: "Belgium"
- /headquarters/employees: 250
- /exports/0/city: "Moscow"
- /exports/1/city: "Athens"

When an item is written, Azure Cosmos DB effectively indexes each property's path and its corresponding value.

## <a id="index-types"></a>Types of indexes

Azure Cosmos DB currently supports three types of indexes. You can configure these index types when defining the indexing policy.

### Range Index

**Range** index is based on an ordered tree-like structure. The range index type is used for:

- Equality queries:

    ```sql
   SELECT * FROM container c WHERE c.property = 'value'
   ```

   ```sql
   SELECT * FROM c WHERE c.property IN ("value1", "value2", "value3")
   ```

   Equality match on an array element
   ```sql
    SELECT * FROM c WHERE ARRAY_CONTAINS(c.tags, "tag1")
    ```

- Range queries:

   ```sql
   SELECT * FROM container c WHERE c.property > 'value'
   ```
  (works for `>`, `<`, `>=`, `<=`, `!=`)

- Checking for the presence of a property:

   ```sql
   SELECT * FROM c WHERE IS_DEFINED(c.property)
   ```

- String system functions:

   ```sql
   SELECT * FROM c WHERE CONTAINS(c.property, "value")
   ```

   ```sql
   SELECT * FROM c WHERE STRINGEQUALS(c.property, "value")
   ```

- `ORDER BY` queries:

   ```sql
   SELECT * FROM container c ORDER BY c.property
   ```

- `JOIN` queries:

   ```sql
   SELECT child FROM container c JOIN child IN c.properties WHERE child = 'value'
   ```

Range indexes can be used on scalar values (string or number). The default indexing policy for newly created containers enforces range indexes for any string or number. To learn how to configure range indexes, see [Range indexing policy examples](how-to-manage-indexing-policy.md#range-index)

### Spatial index

**Spatial** indices enable efficient queries on geospatial objects such as - points, lines, polygons, and multipolygon. These queries use ST_DISTANCE, ST_WITHIN, ST_INTERSECTS keywords. The following are some examples that use spatial index type:

- Geospatial distance queries:

   ```sql
   SELECT * FROM container c WHERE ST_DISTANCE(c.property, { "type": "Point", "coordinates": [0.0, 10.0] }) < 40
   ```

- Geospatial within queries:

   ```sql
   SELECT * FROM container c WHERE ST_WITHIN(c.property, {"type": "Point", "coordinates": [0.0, 10.0] })
   ```

- Geospatial intersect queries:

   ```sql
   SELECT * FROM c WHERE ST_INTERSECTS(c.property, { 'type':'Polygon', 'coordinates': [[ [31.8, -5], [32, -5], [31.8, -5] ]]  })  
   ```

Spatial indexes can be used on correctly formatted [GeoJSON](./sql-query-geospatial-intro.md) objects. Points, LineStrings, Polygons, and MultiPolygons are currently supported. To use this index type, set by using the `"kind": "Range"` property when configuring the indexing policy. To learn how to configure spatial indexes, see [Spatial indexing policy examples](how-to-manage-indexing-policy.md#spatial-index)

### Composite indexes

**Composite** indices increase the efficiency when you are performing operations on multiple fields. The composite index type is used for:

- `ORDER BY` queries on multiple properties:

```sql
 SELECT * FROM container c ORDER BY c.property1, c.property2
```

- Queries with a filter and `ORDER BY`. These queries can utilize a composite index if the filter property is added to the `ORDER BY` clause.

```sql
 SELECT * FROM container c WHERE c.property1 = 'value' ORDER BY c.property1, c.property2
```

- Queries with a filter on two or more properties where at least one property is an equality filter

```sql
 SELECT * FROM container c WHERE c.property1 = 'value' AND c.property2 > 'value'
```

As long as one filter predicate uses one of the index type, the query engine will evaluate that first before scanning the rest. For example, if you have a SQL query such as `SELECT * FROM c WHERE c.firstName = "Andrew" and CONTAINS(c.lastName, "Liu")`

* The above query will first filter for entries where firstName = "Andrew" by using the index. It then pass all of the firstName = "Andrew" entries through a subsequent pipeline to evaluate the CONTAINS filter predicate.

* You can speed up queries and avoid full container scans when using functions that don't use the index (e.g. CONTAINS) by adding additional filter predicates that do use the index. The order of filter clauses isn't important. The query engine is will figure out which predicates are more selective and run the query accordingly.

To learn how to configure composite indexes, see [Composite indexing policy examples](how-to-manage-indexing-policy.md#composite-index)

## Querying with indexes

The paths extracted when indexing data make it easy to lookup the index when processing a query. By matching the `WHERE` clause of a query with the list of indexed paths, it is possible to identify the items that match the query predicate very quickly.

For example, consider the following query: `SELECT location FROM location IN company.locations WHERE location.country = 'France'`. The query predicate (filtering on items, where any location has "France" as its country/region) would match the path highlighted in red below:

:::image type="content" source="./media/index-overview/matching-path.png" alt-text="Matching a specific path within a tree" border="false":::

> [!NOTE]
> An `ORDER BY` clause that orders by a single property *always* needs a range index and will fail if the path it references doesn't have one. Similarly, an `ORDER BY` query which orders by multiple properties *always* needs a composite index.

## Index usage

There are four ways that the query engine can evaluate query filters: an index seek, a precise index scan, an index scan, or a full scan. When you index properties, the query engine will automatically use the indexes as effiectively as possible. Aside from creating new indexes, there is nothing that you need to configure to optimize how queries use indexes.

An index seek is more efficient than an index scan because the query engine will only read index pages that match the query's filters. For an index seek, the query RU charge and index lookup time will be constant, even as data volume grows. For an index scan, the query engine will scan through all unique indexed values. Therefore, an index scan will become more expensive as that property's cardinality grows.

For example, consider two properties: town and country. The cardinality of town is 5,000 and the cardinality of country is 200. Here are two example queries that each have a [Contains](sql-query-contains.md) system functions that does an index scan on the `town` property:

```sql
    SELECT *
    FROM c
    WHERE CONTAINS(c.town, "Red", false)
```

```sql
    SELECT *
    FROM c
    WHERE CONTAINS(c.country, "States", false)
```

A precise index scan is similar to an index scan in the sense that both scan through all unique indexed values and load only matching items. However, unlike an index scan, a precise index scan does an optimized search and only reads a subset of the unique indexed values. A precise index scan will become more expensive as that property's cardinality grows but this will be a logarithmic, rather than linear, increase.

For example, consider a query with a range filter on the `age` property:

```sql
   SELECT *
   FROM c 
   WHERE c.age > 20
```

Because indexed values are sorted, the query engine can do a binary search to find all of the age values that are greater than 20. While the query engine will still scan distinct index values like in an index scan, it only needs to read a subset of them. In this case, the query charge will increase gradually as the cardinality of `age` increases.


The first query will likely use more RUs than the second query because the cardinality of town is higher than country.

| Index lookup type  | Description                                                  | Common Examples                                       | Query charge                                                 |
| ------------------ | ------------------------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------ |
| Index seek         | Read only index pages that match the query filter and load only matching items | Equality filters, IN | Constant                                                     |
| Precise index scan | Optimized search of index pages and load only matching items | Range comparisons (>, <, <=, or >=), StartsWith       | Comparable to index seek for low cardinality properties. Gradual increase as cardinality of indexed properties increases. |
| Index scan         | Read all index pages and load only matching items            | Contains, EndsWith, RegexMatch, LIKE                  | Increases linearly with cardinality of indexed properties    |
| Full scan          | Load all items                                      | Upper, Lower                                           | Increases linearly with data size                                     |
## Next steps

Read more about indexing in the following articles:

- [Indexing policy](index-policy.md)
- [How to manage indexing policy](how-to-manage-indexing-policy.md)