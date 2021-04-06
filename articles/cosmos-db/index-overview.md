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

> [!NOTE]
> An `ORDER BY` clause that orders by a single property *always* needs a range index and will fail if the path it references doesn't have one. Similarly, an `ORDER BY` query which orders by multiple properties *always* needs a composite index.

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

## Index usage

There are four ways that the query engine can evaluate query filters, sorted by most-efficient to least-efficient:

- Index seek
- Precise index scan
- Index scan
- Full scan

When you index properties, the query engine will automatically use the indexes as efficiently as possible. Aside from creating new indexes, you don't need to configure anything to optimize how queries use indexes. A query's RU charge is a combination of both the RU charge from index usage and the RU charge from loading item.

Here is a table that summarizes the different ways indexes are used in Azure Cosmos DB:

| Index lookup type  | Description                                                  | Common Examples                                 | RU charge from index usage                                   | RU charge from loading items                        |
| ------------------ | ------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| Index seek         | Read only index pages that match the query filter and load only matching items | Equality filters, IN                            | Constant                                                     | Increases based on number of items in query results |
| Precise index scan | Optimized search of index pages and load only matching items | Range comparisons (>, <, <=, or >=), StartsWith | Comparable to index seek, increases slightly as cardinality increases | Increases based on number of items in query results |
| Index scan         | Read all index pages and load only matching items            | Contains, EndsWith, RegexMatch, LIKE            | Increases linearly with cardinality of indexed properties    | Increases based on number of items in query results |
| Full scan          | Load all items                                               | Upper, Lower                                    | N/A                                                          | Increases with number of items in query results     |

## Index usage details

In this section, we'll cover more details about how queries use indexes. This isn't necessary to learn to get started with Azure Cosmos DB but is documented in detail for curious users. We'll reference the example item shared earlier in this document:

Example items:

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

```json
    {
        "locations": [
            { "country": "Ireland", "city": "Dublin" }
        ],
        "headquarters": { "country": "Belgium", "employees": 200 },
        "exports": [
            { "city": "Moscow" },
            { "city": "Athens" },
            { "city": "London" }
        ]
    }
```

Azure Cosmos DB uses an inverted index. The index works by dividing the item id space into many different index pages. Each index page contains a list of item id's, encoded as a compressed bitmap. 

Azure Cosmos DB maps each JSON path to the set of index pages that contain that value. A path may have many index pages that correspond to a particular value. Here is a sample diagram of an inverted index for a container that includes the two example items:

| Path                    | Value   | Index page | Bitmap            |
| ----------------------- | ------- | ---------- | ----------------- |
| /locations/0/country    | Germany | 7          | 0 0 1 0 0 0 1 ... |
| /locations/0/country    | Ireland | 6          | 0 1 0 1 1 0 0 ... |
| /locations/0/city       | Berlin  | 7          | 0 0 1 0 0 0 1 ... |
| /locations/0/city       | Dublin  | 6          | 0 1 0 1 1 0 0 ... |
| /locations/1/country    | France  | 7          | 0 1 1 0 1 0 0 ... |
| /locations/1/country    | France  | 18         | 0 0 0 0 1 0 0 ... |
| /locations/1/city       | Paris   | 7          | 0 1 1 0 0 0 0 ... |
| /locations/1/city       | Paris   | 18         | 0 0 0 0 1 0 0 ... |
| /headquarters/country   | Belgium | 6          | 0 1 1 0 0 0 1 ... |
| /headquarters/country   | Belgium | 7          | 0 0 1 0 0 0 1 ... |
| /headquarters/country   | Belgium | 17         | 0 0 1 0 1 1 1 ... |
| /headquarters/employees | 200     | 6          | 0 1 1 0 0 0 0 ... |
| /headquarters/employees | 250     | 7          | 0 0 1 0 0 0 0 ... |

The inverted index has two important attributes:
- For a given path, values are sorted in ascending order. Therefore, the query engine can easily serve `ORDER BY` from the index.
- For a given path, the query engine can scan through the distinct set of possible values to identify the index pages where there are results.

The query engine can utilize the inverted index in three different ways:

### Index seek

Consider the following query: 

```sql
SELECT location
FROM location IN company.locations
WHERE location.country = 'France'`
```

The query predicate (filtering on items where any location has "France" as its country/region) would match the path highlighted in red below:

:::image type="content" source="./media/index-overview/matching-path.png" alt-text="Matching a specific path within a tree" border="false":::

Since this query has an equality filter, after traversing this tree, we can quickly identify the index pages that contain the query results. In this case, the query engine would read index pages 7 and 18 and load the matching documents according to the bitmap for the those pages. An index seek is the most efficient way to use the index. With an index seek we only read the necessary index pages and load only the items in the query results. Therefore, the index lookup time and RU charge from index lookup are incredibly low, regardless of the total data volume. 

### Precise index scan

Consider the following query: 

```sql
SELECT *
FROM company
WHERE company.headquarters.employees > 200
``` 

The query predicate (filtering on items where there are more than 200 employees) can be evaluated with a precise index scan of the `headquarters/employees` path. When doing a precise index scan, the query engine starts by doing a binary search of the distinct set of possible values to find the location of the value `200` for the `headquarters/employees` path. Since the values for each path are sorted in ascending order, it's easy for the query engine to do a binary search. After the query engine finds the value `200`, it starts reading all remaining index pages (going into the ascending direction).

Because the query engine can do a binary search to avoid scanning unnecessary index pages, precise index scans tend to have comparable latency and RU charges to index seek operations.

### Index scan

Consider the following query: 

```sql
SELECT *
FROM company
WHERE CONTAINS(company.headquarters.country, "United")
```

The query predicate (filtering on items that have headquarters in a country that contains "United") can be evaluated with an index scan of the `headquarters/country` path. Unlike a precise index scan, an index scan will always scan through the distinct set of possible values to identify the index pages where there are results. The index lookup time and RU charge for index scans increases as the cardinality of the path increases. In other words, the more possible distinct values that the query engine needs to scan, the higher the latency and RU charge involved in doing an index scan.

For example, consider two properties: town and country. The cardinality of town is 5,000 and the cardinality of country is 200. Here are two example queries that each have a [Contains](sql-query-contains.md) system functions that does an index scan on the `town` property. The first query will use more RUs than the second query because the cardinality of town is higher than country.

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

### Full scan

In some cases, the query engine may not be able to evaluate a query filter using the index. In this case, the query engine will need to load all items to evaluate the query filter. Full scans do not use the index and have an RU charge that increases linearly with the total data size. Luckily, operations that require full scans are rare. 

### Queries with complex filter expressions

In the earlier examples, we only considered queries that had simple filter expressions (for example, queries with just a single equality or range filter). In reality, most queries have much more complex filter expressions.

Consider the following query:

```sql
SELECT *
FROM company
WHERE company.headquarters.employees = 200 AND CONTAINS(company.headquarters.country, "United")
```

To execute this query, the query engine must do a precise index seek on `headquarters/employees` and index scan on `headquarters/country`. The query engine has internal heuristics that it uses to evaluate the query filter expression as efficiently as possible. In this case, the query engine would avoid needing to read unncessary index pages by doing the index seek first, before the index scan. 

## Next steps

Read more about indexing in the following articles:

- [Indexing policy](index-policy.md)
- [How to manage indexing policy](how-to-manage-indexing-policy.md)