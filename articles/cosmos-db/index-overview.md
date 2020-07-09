---
title: Indexing in Azure Cosmos DB 
description: Understand how indexing works in Azure Cosmos DB, different kinds of indexes such as Range, Spatial, composite indexes supported. 
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/21/2020
ms.author: tisande
---

# Indexing in Azure Cosmos DB - Overview

Azure Cosmos DB is a schema-agnostic database that allows you to iterate on your application without having to deal with schema or index management. By default, Azure Cosmos DB automatically indexes every property for all items in your [container](databases-containers-items.md#azure-cosmos-containers) without having to define any schema or configure secondary indexes.

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

## Index kinds

Azure Cosmos DB currently supports three kinds of indexes.

### Range Index

**Range** index is based on an ordered tree-like structure. The range index kind is used for:

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

Range indexes can be used on scalar values (string or number).

### Spatial index

**Spatial** indices enable efficient queries on geospatial objects such as - points, lines, polygons, and multipolygon. These queries use ST_DISTANCE, ST_WITHIN, ST_INTERSECTS keywords. The following are some examples that use spatial index kind:

- Geospatial distance queries:

   ```sql
   SELECT * FROM container c WHERE ST_DISTANCE(c.property, { "type": "Point", "coordinates": [0.0, 10.0] }) < 40
   ```

- Geospatial within queries:

   ```sql
   SELECT * FROM container c WHERE ST_WITHIN(c.property, {"type": "Point", "coordinates": [0.0, 10.0] } })
   ```

- Geospatial intersect queries:

   ```sql
   SELECT * FROM c WHERE ST_INTERSECTS(c.property, { 'type':'Polygon', 'coordinates': [[ [31.8, -5], [32, -5], [31.8, -5] ]]  })  
   ```

Spatial indexes can be used on correctly formatted [GeoJSON](geospatial.md) objects. Points, LineStrings, Polygons, and MultiPolygons are currently supported.

### Composite indexes

**Composite** indices increase the efficiency when you are performing operations on multiple fields. The composite index kind is used for:

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

As long as one filter predicate uses one of the index kind, the query engine will evaluate that first before scanning the rest. For example, if you have a SQL query such as `SELECT * FROM c WHERE c.firstName = "Andrew" and CONTAINS(c.lastName, "Liu")`

* The above query will first filter for entries where firstName = "Andrew" by using the index. It then pass all of the firstName = "Andrew" entries through a subsequent pipeline to evaluate the CONTAINS filter predicate.

* You can speed up queries and avoid full container scans when using functions that don't use the index (e.g. CONTAINS) by adding additional filter predicates that do use the index. The order of filter clauses isn't important. The query engine is will figure out which predicates are more selective and run the query accordingly.


## Querying with indexes

The paths extracted when indexing data make it easy to lookup the index when processing a query. By matching the `WHERE` clause of a query with the list of indexed paths, it is possible to identify the items that match the query predicate very quickly.

For example, consider the following query: `SELECT location FROM location IN company.locations WHERE location.country = 'France'`. The query predicate (filtering on items, where any location has "France" as its country/region) would match the path highlighted in red below:

:::image type="content" source="./media/index-overview/matching-path.png" alt-text="Matching a specific path within a tree" border="false":::

> [!NOTE]
> An `ORDER BY` clause that orders by a single property *always* needs a range index and will fail if the path it references doesn't have one. Similarly, an `ORDER BY` query which orders by multiple properties *always* needs a composite index.

## Next steps

Read more about indexing in the following articles:

- [Indexing policy](index-policy.md)
- [How to manage indexing policy](how-to-manage-indexing-policy.md)
