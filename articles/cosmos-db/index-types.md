---
title: Index types in Azure Cosmos DB
description: Overview of index types in Azure Cosmos DB
author: rimman
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/08/2019
ms.author: rimman

---

# Index types in Azure Cosmos DB

There are multiple options when you configure the indexing policy for a path. You can specify one or more indexing definitions for every path:

- **Data type:** String, Number, Point, Polygon, or LineString (can contain only one entry per data type per path).

- **Index kind:** Range (for equality, range or ORDER BY queries), or Spatial (for spatial queries).

- **Precision:** For a Range index, the maximum precision value is -1, which is also the default.

## Index kind

Azure Cosmos DB supports Range index for every path that can be configured for String or Number data types, or both.

- **Range index** supports efficient equality queries, JOIN queries, range queries (using >, <, >=, <=, !=), and ORDER BY queries. ORDER BY queries, by default, also require maximum index precision (-1). The data type can be String or Number.

- **Spatial index** supports efficient spatial (within and distance) queries. The data type can be Point, Polygon, or LineString. Azure Cosmos DB also supports the spatial index kind for every path that can be specified for the Point, Polygon, or LineString data types. The value at the specified path must be a valid GeoJSON fragment like {"type": "Point", "coordinates": [0.0, 10.0]}. Azure Cosmos DB supports automatic indexing of Point, Polygon, and LineString data types.

Here are examples of queries that Range, and Spatial indexes can be used to serve:

| **Index kind** | **Description/use case** |
| ---------- | ---------------- |
| Range      | Range over /prop/? (or /) can be used to serve the following queries efficiently:<br><br>SELECT FROM collection c WHERE c.prop = "value"<br><br>SELECT FROM collection c WHERE c.prop > 5<br><br>SELECT FROM collection c ORDER BY c.prop<br><br>Range over /props/[]/? (or / or /props/) can be used to serve the following queries efficiently:<br><br>SELECT tag FROM collection c JOIN tag IN c.props WHERE tag = 5  |
| Spatial    | Range over /prop/? (or /) can be used to serve the following queries efficiently:<br><br>SELECT FROM collection c WHERE ST_DISTANCE(c.prop, {"type": "Point", "coordinates": [0.0, 10.0]}) < 40<br><br>SELECT FROM collection c WHERE ST_WITHIN(c.prop, {"type": "Point", ... }) --with indexing on points enabled<br><br>SELECT FROM collection c WHERE ST_WITHIN({"type": "Polygon", ... }, c.prop) --with indexing on polygons enabled. |

## Default behavior of index kinds

- If there is no Range index of any precision to signal that a scan might be necessary to serve the query, in such case, by default, an error is returned for queries with range operators such as >=.

- Range queries can be performed without a Range index by using the **x-ms-documentdb-enable-scan** header in the REST API or the **EnableScanInQuery** request option by using the .NET SDK. If there are any other filters in the query that Azure Cosmos DB can use the index to filter against, no error is returned.

- By default, an error is returned for spatial queries if there isn't a spatial index, or other filters that can be served from the index. Such queries can be performed as a scan by using **x-ms-documentdb-enable-scan** or **EnableScanInQuery**.

## Index precision

> [!NOTE]
> Azure Cosmos containers support a new index layout that no longer requires a custom index precision other than the maximum precision value (-1). With this method, paths are always indexed with the maximum precision. If you specify a precision value on the indexing policy, the CRUD requests on a containers will silently ignore the precision value and the response from the container only contains the maximum precision value (-1).  All new Cosmos containers use the new index layout, by default.

- You can use index precision to make a trade-off between the index storage overhead and the query performance. For numbers, we recommend using the default precision configuration of -1 (the maximum). Because numbers are 8 bytes in JSON, this is equivalent to a configuration of 8 bytes. Choosing a lower value for precision, such as 1 through 7, means that values within some ranges map to the same index entry. Therefore, you can reduce the index storage space, but query execution might have to process more items. Consequently, it consumes more throughput/RUs.

- Index precision has more practical application with string ranges. Because strings can be any arbitrary length, the choice of the index precision might affect the performance of string range queries. It also might affect the amount of index storage space that is required. String Range indexes can be configured with an index precision between 1 and 100, or -1 (maximum). If you want to perform ORDER BY queries against string properties, you must specify a precision of -1 for the corresponding paths.

- Spatial indexes always use the default index precision for all types (Point, LineString, and Polygon). The default index precision for spatial indexes can't be overridden.

Azure Cosmos DB returns an error when a query uses ORDER BY but doesn't have a Range index against the queried path with the maximum precision.

## Next steps

To learn more about indexing in Azure Cosmos DB, see the following articles:

- [Overview of indexing](index-overview.md)
- [Indexing policy](indexing-policies.md)
- [Index paths](index-paths.md)

