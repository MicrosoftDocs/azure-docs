---
title: Service Limits in Azure Cosmos DB for MongoDB vCore
description: This document outlines the service limits for vCore-based Azure Cosmos DB for MongoDB.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 06/27/2024
---

# Service Limits in Azure Cosmos DB for MongoDB vCore

This document provides an overview of the service limits for Azure Cosmos DB for MongoDB vCore.

## Query and Execution Limits

### Maximum MongoDB Query Memory Size
- The maximum memory size for MongoDB queries depends on the tier. For example, for M80, the query memory size limit is approximately 150 MiB.
- In sharded clusters, if a query pulls data across nodes, the limit on that data size is 1GB.

### Maximum Execution Time for MongoDB Operations
- Maximum transaction lifetime: 30 seconds.
- Cursor lifetime: 10 minutes. Note: A cursorNotFound error might occur if the cursor exceeds its lifetime.
- Default: 120 seconds. This can be overridden on a per-query basis using `maxTimeMS`.
#### Example:
```javascript
db.collection.find({ field: "value" }).maxTimeMS(5000)
```

## Indexing Limits

### General Indexing Limits
- Maximum number of compound index paths: 32.
- Maximum size for `_id` field value: 2KB.
- Maximum size for index path: 256B.
- Sorting is done in memory and does not push down to the index.
- Background index builds are in private preview. To enable, customers need to file a support ticket.
- A single index build can be in progress on the same collection.
- The number of simultaneous index builds on different collections is configurable (default: 2).
- Use the `currentOp` command to view the progress of long-running index builds.
- Unique index builds are done in the foreground and block writes in the collection.
- Composite indexes do not support geospatial indexes (2d, 2d sphere indexes).

### Wildcard Indexing Limits
- No specific limits; restrictions mirror MongoDB wildcard index restrictions.
- For wildcard indexes, if the indexed field is an array of arrays, the entire embedded array is taken as a value instead of traversing its contents.

### Geospatial Indexing Limits
- No support for BigPolygons.
- Composite indexes do not support geospatial indexes.
- `$geoWithin` query does not support polygons with holes.
- The `key` field is required in the `$geoNear` aggregation stage.
- Indexes are recommended but not required for `$near`, `$nearSphere` query operators, and the `$geoNear` aggregation stage.

### Text Index Limits
- Only one text index can be defined on a collection.
- Supports simple text searches only; advanced search capabilities like regular expression searches are not supported.
- `hint()` is not supported in combination with a query using `$text` expression.
- Sort operations cannot use the ordering of the text index.
- Tokenization for Chinese, Japanese, Korean is not supported yet.
- Case insensitive tokenization is not supported yet.

### Vector Search Limits
- Supported distance metrics: L2 (Euclidean), inner product, and cosine.
- Supported indexing methods: IVFFLAT (GA) and HSNW.
- Indexing vectors up to 2,000 dimensions in size.
- Indexing applies to only one vector per path.
- Only one index can be created per vector path.

## Storage and Connection Limits

### Disk IOPS
| Disk Size (GiB) | IOPS per Disk |
|-----------------|---------------|
| 32              | 120           |
| 64              | 240           |
| 128             | 500           |
| 256             | 1,100         |
| 512             | 2,300         |
| 1 TB            | 5,000         |
| 2 TB            | 7,500         |
| 4 TB            | 7,500         |
| 8 TB            | 16,000        |
| 16 TB           | 18,000        |
| 32 TB           | 20,000        |

## Cluster and Shard Limits

### Cluster Tier
- Maximum: M200. Contact support for higher tiers.

### Shards
- Maximum: 6 (in preview). Contact support for additional shards.

### Secondary Regions
- Maximum: 1. Contact support for additional regions.

### Free Tier Limits
The following limitations can be overidden by upgrading a paid tier
- Maximum storage: 32GB.
- Backup / Restore not supported (available in M25+)
- High availability (HA) not supported (available in M30+)
- HNSW vector indexes not supported (available in M40+)
- Diagnostic logging not supported (available in M30+)
- No service-level-agreement provided (requires HA to be enabled)
- Free tier clusters are paused after 60 days of inactivity where there are no connections to the cluster.

## Collection, Index, and Database Limits

### Indexes
- Default maximum: 64.
- Configurable up to: 300 indexes per collection.

## Replication and HA Limits

### Cross-Region Replication
- Supported only on single shard (node) vCore clusters.
- The following configurations are the same on both primary and replica clusters and cannot be changed on the replica cluster:
  - Compute configuration
  - Storage and shard count
  - User accounts
- HA is not supported on replica clusters.
- Cross-region replication is not available on clusters with burstable compute.

## Miscellaneous Limits

### Nesting Levels
- Maximum level of nesting for embedded objects/arrays on index definitions: 6.

### Portal Mongo Shell Usage
- The Portal Mongo Shell can be used for 120 minutes within a 24-hour window.

## Next steps

- Get started by [creating a cluster.](quickstart-portal.md).
- Review options for [migrating from MongoDB to Azure Cosmos DB for MongoDB vCore.](migration-options.md)



