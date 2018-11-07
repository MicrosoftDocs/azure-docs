---
title: Configuring indexing policy in Azure Cosmos DB
description: Overview of indexing policies in Azure Cosmos DB
services: cosmos-db
author: rimman
manager: dharmas-cosmos

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 11/5/2018
ms.author: rimman

---

# Index types in Azure Cosmos DB

There are multiple options when you configure the indexing policy for a path. You can specify one or more indexing definitions for every path:

- Data type: String, Number, Point, Polygon, or LineString (can contain only one entry per data type per path).
- Index kind: Hash (equality queries), Range (equality, range or ORDER BY queries), or Spatial (spatial queries).
- Precision: For a Hash index, this varies from 1 to 8 for both strings and numbers. The default is 3. For a Range index, this value can be -1 (maximum precision). It can vary from between 1 and 100 (maximum precision) for string or number values.

## Index kind

Cosmos DB supports Hash index and Range index for every path that can be configured for String or Number data types, or both.

- Hash supports efficient equality and JOIN queries. For most use cases, Hash indexes don't need a higher precision than the default value of 3 bytes. The data type can be String or Number.
- Range supports efficient equality queries, range queries (using >, <, >=, <=, !=), and ORDER BY queries. ORDER By queries by default also require maximum index precision (-1). The data type can be String or Number.
- Spatial supports efficient spatial (within and distance) queries. The data type can be Point, Polygon, or LineString. Cosmos DB also supports the Spatial index kind for every path that can be specified for the Point, Polygon, or LineString data types. The value at the specified path must be a valid GeoJSON fragment like {"type": "Point", "coordinates": [0.0, 10.0]}. Cosmos DB supports automatic indexing of Point, Polygon, and LineString data types.

Here are examples of queries that Hash, Range and Spatial indexes can be used to serve:

![Index types examples](./media/indexing/index-types-examples.png)

## Default behavior

- By default, an error is returned for queries with range operators such as >= if there is no Range index (of any precision) to signal that a scan might be necessary to serve the query.
- Range queries can be performed without a Range index by using the x-ms-documentdb-enable-scan header in the REST API or the EnableScanInQuery request option by using the .NET SDK. If there are any other filters in the query that Cosmos DB can use the index to filter against, no error is returned.
- By default, an error is returned for spatial queries if there is no spatial index, and there are no other filters that can be served from the index. They can be performed as a scan by using x-ms-documentdb-enable-scan or EnableScanInQuery.

## Index precision

- You can use index precision to make trade-offs between index storage overhead and query performance. For numbers, we recommend using the default precision configuration of -1 (maximum). Because numbers are 8 bytes in JSON, this is equivalent to a configuration of 8 bytes. Choosing a lower value for precision, such as 1 through 7, means that values within some ranges map to the same index entry. Therefore, you can reduce index storage space, but query execution might have to process more items. Consequently, it consumes more throughput in terms of provisioned throughput (RUs).
- Index precision has even more practical application with string ranges. Because strings can be any arbitrary length, the choice of the index precision might affect the performance of string range queries. It also might affect the amount of index storage space that's required. String Range indexes can be configured with 1 through 100 or -1 (maximum). If you want to perform ORDER BY queries against string properties, you must specify a precision of -1 for the corresponding paths.
- Spatial indexes always use the default index precision for all types (Point, LineString, and Polygon). The default index precision for spatial indexes can't be overridden.

Cosmos DB returns an error when a query uses ORDER BY but doesn't have a Range index against the queried path with the maximum precision.

## Examples
- See how to increase precision for range indexes in [Indexing Examples](TBD)
- See how to completely exclude paths from indexing in [Indexing Examples](TBD)
- See how to exclude a subtree from indexing by using the * wildcard operator in [Indexing Examples](TBD)

### Next steps
- [Overview of indexing](TBD)
- [Indexing policy](TBD)
- [Modifying indexing policy](TBD)
- [Index paths](TBD)
- [Opt in and opt out of indexing](TBD)
- [Changes to the indexing policy specification](TBD)
- [Indexing Examples](TBD)
