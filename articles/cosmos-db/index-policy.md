---
title: Azure Cosmos DB indexing policies
description:  Learn how to configure and change the default indexing policy for automatic indexing and greater performance in Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 12/07/2021
ms.author: sidandrews
ms.reviewer: jucocchi
---

# Indexing policies in Azure Cosmos DB
[!INCLUDE[NoSQL](includes/appliesto-nosql.md)]

In Azure Cosmos DB, every container has an indexing policy that dictates how the container's items should be indexed. The default indexing policy for newly created containers indexes every property of every item and enforces range indexes for any string or number. This allows you to get good query performance without having to think about indexing and index management upfront.

In some situations, you may want to override this automatic behavior to better suit your requirements. You can customize a container's indexing policy by setting its *indexing mode*, and include or exclude *property paths*.

> [!NOTE]
> The method of updating indexing policies described in this article only applies to Azure Cosmos DB API for NoSQL. Learn about indexing in [Azure Cosmos DB API for MongoDB](mongodb/indexing.md)

## Indexing mode

Azure Cosmos DB supports two indexing modes:

- **Consistent**: The index is updated synchronously as you create, update or delete items. This means that the consistency of your read queries will be the [consistency configured for the account](consistency-levels.md).
- **None**: Indexing is disabled on the container. This mode is commonly used when a container is used as a pure key-value store without the need for secondary indexes. It can also be used to improve the performance of bulk operations. After the bulk operations are complete, the index mode can be set to Consistent and then monitored using the [IndexTransformationProgress](how-to-manage-indexing-policy.md#dotnet-sdk) until complete.

> [!NOTE]
> Azure Cosmos DB also supports a Lazy indexing mode. Lazy indexing performs updates to the index at a much lower priority level when the engine is not doing any other work. This can result in **inconsistent or incomplete** query results. If you plan to query an Azure Cosmos DB container, you should not select lazy indexing. New containers cannot select lazy indexing. You can request an exemption by contacting cosmosdbindexing@microsoft.com (except if you are using an Azure Cosmos DB account in [serverless](serverless.md) mode which doesn't support lazy indexing).

By default, indexing policy is set to `automatic`. It's achieved by setting the `automatic` property in the indexing policy to `true`. Setting this property to `true` allows Azure Cosmos DB to automatically index items as they're written.

## <a id="index-size"></a>Index size

In Azure Cosmos DB, the total consumed storage is the combination of both the Data size and Index size. The following are some features of index size:

* The index size depends on the indexing policy. If all the properties are indexed, then the index size can be larger than the data size.
* When data is deleted, indexes are compacted on a near continuous basis. However, for small data deletions, you may not immediately observe a decrease in index size.
* The Index size can temporarily grow when physical partitions split. The index space is released after the partition split is completed.

## <a id="include-exclude-paths"></a>Including and excluding property paths

A custom indexing policy can specify property paths that are explicitly included or excluded from indexing. By optimizing the number of paths that are indexed, you can substantially reduce the latency and RU charge of write operations. These paths are defined following [the method described in the indexing overview section](index-overview.md#from-trees-to-property-paths) with the following additions:

- a path leading to a scalar value (string or number) ends with `/?`
- elements from an array are addressed together through the `/[]` notation (instead of `/0`, `/1` etc.)
- the `/*` wildcard can be used to match any elements below the node

Taking the same example again:

```
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

- the `headquarters`'s `employees` path is `/headquarters/employees/?`

- the `locations`' `country` path is `/locations/[]/country/?`

- the path to anything under `headquarters` is `/headquarters/*`

For example, we could include the `/headquarters/employees/?` path. This path would ensure that we index the employees property but wouldn't index additional nested JSON within this property.

## Include/exclude strategy

Any indexing policy has to include the root path `/*` as either an included or an excluded path.

- Include the root path to selectively exclude paths that don't need to be indexed. This approach is recommended as it lets Azure Cosmos DB proactively index any new property that may be added to your model.

- Exclude the root path to selectively include paths that need to be indexed. The partition key property path isn't indexed by default with the exclude strategy and should be explicitly included if needed.

- For paths with regular characters that include: alphanumeric characters and _ (underscore), you don't have to escape the path string around double quotes (for example, "/path/?"). For paths with other special characters, you need to escape the path string around double quotes (for example, "/\"path-abc\"/?"). If you expect special characters in your path, you can escape every path for safety. Functionally, it doesn't make any difference if you escape every path or just the ones that have special characters.

- The system property `_etag` is excluded from indexing by default, unless the etag is added to the included path for indexing.

- If the indexing mode is set to **consistent**, the system properties `id` and `_ts` are automatically indexed.

- If an explicitly indexed path doesn't exist in an item, a value will be added to the index to indicate that the path is undefined.

All explicitly included paths will have values added to the index for each item in the container, even if the path is undefined for a given item.

See [this section](how-to-manage-indexing-policy.md#indexing-policy-examples) for indexing policy examples for including and excluding paths.

## Include/exclude precedence

If your included paths and excluded paths have a conflict, the more precise path takes precedence.

Here's an example:

**Included Path**: `/food/ingredients/nutrition/*`

**Excluded Path**: `/food/ingredients/*`

In this case, the included path takes precedence over the excluded path because it's more precise. Based on these paths, any data in the `food/ingredients` path or nested within would be excluded from the index. The exception would be data within the included path: `/food/ingredients/nutrition/*`, which would be indexed.

Here are some rules for included and excluded paths precedence in Azure Cosmos DB:

- Deeper paths are more precise than narrower paths. for example: `/a/b/?` is more precise than `/a/?`.

- The `/?` is more precise than `/*`. For example `/a/?` is more precise than `/a/*` so `/a/?` takes precedence.

- The path `/*` must be either an included path or excluded path.

## Spatial indexes

When you define a spatial path in the indexing policy, you should define which index ```type``` should be applied to that path. Possible types for spatial indexes include:

* Point

* Polygon

* MultiPolygon

* LineString

Azure Cosmos DB, by default, won't create any spatial indexes. If you would like to use spatial SQL built-in functions, you should create a spatial index on the required properties. See [this section](sql-query-geospatial-index.md) for indexing policy examples for adding spatial indexes.

## Composite indexes

Queries that have an `ORDER BY` clause with two or more properties require a composite index. You can also define a composite index to improve the performance of many equality and range queries. By default, no composite indexes are defined so you should [add composite indexes](how-to-manage-indexing-policy.md#composite-index) as needed.

Unlike with included or excluded paths, you can't create a path with the `/*` wildcard. Every composite path has an implicit `/?` at the end of the path that you don't need to specify. Composite paths lead to a scalar value that is the only value included in the composite index. If a path in a composite index doesn't exist in an item, a value will be added to the index to indicate that the path is undefined.

When defining a composite index, you specify:

- Two or more property paths. The sequence in which property paths are defined matters.

- The order (ascending or descending).

> [!NOTE]
> When you add a composite index, the query will utilize existing range indexes until the new composite index addition is complete. Therefore, when you add a composite index, you may not immediately observe performance improvements. It is possible to track the progress of index transformation [by using one of the SDKs](how-to-manage-indexing-policy.md).

### ORDER BY queries on multiple properties:

The following considerations are used when using composite indexes for queries with an `ORDER BY` clause with two or more properties:

- If the composite index paths don't match the sequence of the properties in the `ORDER BY` clause, then the composite index can't support the query.

- The order of composite index paths (ascending or descending) should also match the `order` in the `ORDER BY` clause.

- The composite index also supports an `ORDER BY` clause with the opposite order on all paths.

Consider the following example where a composite index is defined on properties name, age, and _ts:

| **Composite Index**     | **Sample `ORDER BY` Query**      | **Supported by Composite Index?** |
| ----------------------- | -------------------------------- | -------------- |
| ```(name ASC, age ASC)```   | ```SELECT * FROM c ORDER BY c.name ASC, c.age asc``` | ```Yes```            |
| ```(name ASC, age ASC)```   | ```SELECT * FROM c ORDER BY c.age ASC, c.name asc```   | ```No```             |
| ```(name ASC, age ASC)```    | ```SELECT * FROM c ORDER BY c.name DESC, c.age DESC``` | ```Yes```            |
| ```(name ASC, age ASC)```     | ```SELECT * FROM c ORDER BY c.name ASC, c.age DESC``` | ```No```             |
| ```(name ASC, age ASC, timestamp ASC)``` | ```SELECT * FROM c ORDER BY c.name ASC, c.age ASC, timestamp ASC``` | ```Yes```            |
| ```(name ASC, age ASC, timestamp ASC)``` | ```SELECT * FROM c ORDER BY c.name ASC, c.age ASC``` | ```No```            |

You should customize your indexing policy so you can serve all necessary `ORDER BY` queries.

### Queries with filters on multiple properties

If a query has filters on two or more properties, it may be helpful to create a composite index for these properties.

For example, consider the following query that has both an equality and range filter:

```sql
SELECT *
FROM c
WHERE c.name = "John" AND c.age > 18
```

This query will be more efficient, taking less time and consuming fewer RUs, if it's able to leverage a composite index on `(name ASC, age ASC)`.

Queries with multiple range filters can also be optimized with a composite index. However, each individual composite index can only optimize a single range filter. Range filters include `>`, `<`, `<=`, `>=`, and `!=`. The range filter should be defined last in the composite index.

Consider the following query with an equality filter and two range filters:

```sql
SELECT *
FROM c
WHERE c.name = "John" AND c.age > 18 AND c._ts > 1612212188
```

This query will be more efficient with a composite index on `(name ASC, age ASC)` and `(name ASC, _ts ASC)`. However, the query wouldn't utilize a composite index on `(age ASC, name ASC)` because the properties with equality filters must be defined first in the composite index. Two separate composite indexes are required instead of a single composite index on `(name ASC, age ASC, _ts ASC)` since each composite index can only optimize a single range filter.

The following considerations are used when creating composite indexes for queries with filters on multiple properties

- Filter expressions can use multiple composite indexes.
- The properties in the query's filter should match those in composite index. If a property is in the composite index but isn't included in the query as a filter, the query won't utilize the composite index.
- If a query has other properties in the filter that aren't defined in a composite index, then a combination of composite and range indexes will be used to evaluate the query. This will require fewer RUs than exclusively using range indexes.
- If a property has a range filter (`>`, `<`, `<=`, `>=`, or `!=`), then this property should be defined last in the composite index. If a query has more than one range filter, it may benefit from multiple composite indexes.
- When creating a composite index to optimize queries with multiple filters, the `ORDER` of the composite index will have no impact on the results. This property is optional.

Consider the following examples where a composite index is defined on properties name, age, and timestamp:

| **Composite Index**     | **Sample Query**      | **Supported by Composite Index?** |
| ----------------------- | -------------------------------- | -------------- |
| ```(name ASC, age ASC)```   | ```SELECT * FROM c WHERE c.name = "John" AND c.age = 18``` | ```Yes```            |
| ```(name ASC, age ASC)```   | ```SELECT * FROM c WHERE c.name = "John" AND c.age > 18```   | ```Yes```             |
| ```(name ASC, age ASC)```   | ```SELECT COUNT(1) FROM c WHERE c.name = "John" AND c.age > 18```   | ```Yes```             |
| ```(name DESC, age ASC)```    | ```SELECT * FROM c WHERE c.name = "John" AND c.age > 18``` | ```Yes```            |
| ```(name ASC, age ASC)```     | ```SELECT * FROM c WHERE c.name != "John" AND c.age > 18``` | ```No```             |
| ```(name ASC, age ASC, timestamp ASC)``` | ```SELECT * FROM c WHERE c.name = "John" AND c.age = 18 AND c.timestamp > 123049923``` | ```Yes```            |
| ```(name ASC, age ASC, timestamp ASC)``` | ```SELECT * FROM c WHERE c.name = "John" AND c.age < 18 AND c.timestamp = 123049923``` | ```No```            |
| ```(name ASC, age ASC) and (name ASC, timestamp ASC)``` | ```SELECT * FROM c WHERE c.name = "John" AND c.age < 18 AND c.timestamp > 123049923``` | ```Yes```            |

### Queries with a filter and ORDER BY

If a query filters on one or more properties and has different properties in the ORDER BY clause, it may be helpful to add the properties in the filter to the `ORDER BY` clause.

For example, by adding the properties in the filter to the `ORDER BY` clause, the following query could be rewritten to leverage a composite index:

Query using range index:

```sql
SELECT *
FROM c 
WHERE c.name = "John" 
ORDER BY c.timestamp
```

Query using composite index:

```sql
SELECT * 
FROM c 
WHERE c.name = "John"
ORDER BY c.name, c.timestamp
```

The same query optimizations can be generalized for any `ORDER BY` queries with filters, keeping in mind that individual composite indexes can only support, at most, one range filter.

Query using range index:

```sql
SELECT * 
FROM c 
WHERE c.name = "John" AND c.age = 18 AND c.timestamp > 1611947901 
ORDER BY c.timestamp
```

Query using composite index:

```sql
SELECT * 
FROM c 
WHERE c.name = "John" AND c.age = 18 AND c.timestamp > 1611947901 
ORDER BY c.name, c.age, c.timestamp
```

In addition, you can use composite indexes to optimize queries with system functions and ORDER BY:

Query using range index:

```sql
SELECT * 
FROM c 
WHERE c.firstName = "John" AND Contains(c.lastName, "Smith", true) 
ORDER BY c.lastName
```

Query using composite index:

```sql
SELECT * 
FROM c 
WHERE c.firstName = "John" AND Contains(c.lastName, "Smith", true) 
ORDER BY c.firstName, c.lastName
```

The following considerations apply when creating composite indexes to optimize a query with a filter and `ORDER BY` clause:

* If you don't define a composite index on a query with a filter on one property and a separate `ORDER BY` clause using a different property, the query will still succeed. However, the RU cost of the query can be reduced with a composite index, particularly if the property in the `ORDER BY` clause has a high cardinality.
* If the query filters on properties, these properties should be included first in the `ORDER BY` clause.
* If the query filters on multiple properties, the equality filters must be the first properties in the `ORDER BY` clause.
* If the query filters on multiple properties, you can have a maximum of one range filter or system function utilized per composite index. The property used in the range filter or system function should be defined last in the composite index.
* All considerations for creating composite indexes for `ORDER BY` queries with multiple properties as well as queries with filters on multiple properties still apply.


| **Composite Index**                      | **Sample `ORDER BY` Query**                                  | **Supported by Composite Index?** |
| ---------------------------------------- | ------------------------------------------------------------ | --------------------------------- |
| ```(name ASC, timestamp ASC)```          | ```SELECT * FROM c WHERE c.name = "John" ORDER BY c.name ASC, c.timestamp ASC``` | `Yes` |
| ```(name ASC, timestamp ASC)```          | ```SELECT * FROM c WHERE c.name = "John" AND c.timestamp > 1589840355 ORDER BY c.name ASC, c.timestamp ASC``` | `Yes` |
| ```(timestamp ASC, name ASC)```          | ```SELECT * FROM c WHERE c.timestamp > 1589840355 AND c.name = "John" ORDER BY c.timestamp ASC, c.name ASC``` | `No` |
| ```(name ASC, timestamp ASC)```          | ```SELECT * FROM c WHERE c.name = "John" ORDER BY c.timestamp ASC, c.name ASC``` | `No`  |
| ```(name ASC, timestamp ASC)```          | ```SELECT * FROM c WHERE c.name = "John" ORDER BY c.timestamp ASC``` | ```No```   |
| ```(age ASC, name ASC, timestamp ASC)``` | ```SELECT * FROM c WHERE c.age = 18 and c.name = "John" ORDER BY c.age ASC, c.name ASC,c.timestamp ASC``` | `Yes` |
| ```(age ASC, name ASC, timestamp ASC)``` | ```SELECT * FROM c WHERE c.age = 18 and c.name = "John" ORDER BY c.timestamp ASC``` | `No` |

### Queries with a filter and an aggregate 

If a query filters on one or more properties and has an aggregate system function, it may be helpful to create a composite index for the properties in the filter and aggregate system function. This optimization applies to the [SUM](sql-query-aggregate-sum.md) and [AVG](sql-query-aggregate-avg.md) system functions.

The following considerations apply when creating composite indexes to optimize a query with a filter and aggregate system function.

* Composite indexes are optional when running queries with aggregates. However, the RU cost of the query can often be significantly reduced with a composite index.
* If the query filters on multiple properties, the equality filters must be the first properties in the composite index.
* You can have a maximum of one range filter per composite index and it must be on the property in the aggregate system function.
* The property in the aggregate system function should be defined last in the composite index.
* The `order` (`ASC` or `DESC`) doesn't matter.

| **Composite Index**                      | **Sample Query**                                  | **Supported by Composite Index?** |
| ---------------------------------------- | ------------------------------------------------------------ | --------------------------------- |
| ```(name ASC, timestamp ASC)```          | ```SELECT AVG(c.timestamp) FROM c WHERE c.name = "John"``` | `Yes` |
| ```(timestamp ASC, name ASC)```          | ```SELECT AVG(c.timestamp) FROM c WHERE c.name = "John"``` | `No` |
| ```(name ASC, timestamp ASC)```          | ```SELECT AVG(c.timestamp) FROM c WHERE c.name > "John"``` | `No` |
| ```(name ASC, age ASC, timestamp ASC)```          | ```SELECT AVG(c.timestamp) FROM c WHERE c.name = "John" AND c.age = 25``` | `Yes` |
| ```(age ASC, timestamp ASC)```          | ```SELECT AVG(c.timestamp) FROM c WHERE c.name = "John" AND c.age > 25``` | `No` |

## <a id=index-transformation></a>Modifying the indexing policy

A container's indexing policy can be updated at any time [by using the Azure portal or one of the supported SDKs](how-to-manage-indexing-policy.md). An update to the indexing policy triggers a transformation from the old index to the new one, which is performed online and in-place (so no additional storage space is consumed during the operation). The old indexing policy is efficiently transformed to the new policy without affecting the write availability, read availability, or the throughput provisioned on the container. Index transformation is an asynchronous operation, and the time it takes to complete depends on the provisioned throughput, the number of items and their size. If multiple indexing policy updates have to be made, it is recommended to do all the changes as a single operation in order to have the index transformation complete as quickly as possible.

> [!IMPORTANT]
> Index transformation is an operation that consumes [Request Units](request-units.md). Request Units consumed by an index transformation aren't currently billed if you are using [serverless](serverless.md) containers. These Request Units will get billed once serverless becomes generally available.

> [!NOTE]
> You can track the progress of index transformation in the [Azure portal](how-to-manage-indexing-policy.md#use-the-azure-portal) or by [using one of the SDKs](how-to-manage-indexing-policy.md#dotnet-sdk).

There's no impact to write availability during any index transformations. The index transformation uses your provisioned RUs but at a lower priority than your CRUD operations or queries.

There's no impact to read availability when adding new indexed paths. Queries will only utilize new indexed paths once an index transformation is complete. In other words, when adding a new indexed path, queries that benefit from that indexed path will have the same performance before and during the index transformation. After the index transformation is complete, the query engine will begin to use the new indexed paths.

When removing indexed paths, you should group all your changes into one indexing policy transformation. If you remove multiple indexes and do so in one single indexing policy change, the query engine provides consistent and complete results throughout the index transformation. However, if you remove indexes through multiple indexing policy changes, the query engine won't provide consistent or complete results until all index transformations complete. Most developers don't drop indexes and then immediately try to run queries that utilize these indexes so, in practice, this situation is unlikely.

When you drop an indexed path, the query engine will immediately stop using it, and will do a full scan instead.

> [!NOTE]
> Where possible, you should always try to group multiple index removals into one single indexing policy modification.

> [!IMPORTANT]
> Removing an index takes affect immediately, whereas adding a new index takes some time as it requires an indexing transformation. When replacing one index with another (for example, replacing a single property index with a composite-index) make sure to add the new index first and then wait for the index transformation to complete **before** you remove the previous index from the indexing policy. Otherwise this will negatively affect your ability to query the previous index and may break any active workloads that reference the previous index. 

## Indexing policies and TTL

Using the [Time-to-Live (TTL) feature](time-to-live.md) requires indexing. This means that:

- it isn't possible to activate TTL on a container where the indexing mode is set to `none`,
- it isn't possible to set the indexing mode to None on a container where TTL is activated.

For scenarios where no property path needs to be indexed, but TTL is required, you can use an indexing policy with an indexing mode set to `consistent`, no included paths, and `/*` as the only excluded path.

## Next steps

Read more about the indexing in the following articles:

- [Indexing overview](index-overview.md)
- [How to manage indexing policy](how-to-manage-indexing-policy.md)
