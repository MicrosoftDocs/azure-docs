---
title: Service Limits in Azure Cosmos DB for MongoDB vCore
description: This document outlines the service limits for vCore-based Azure Cosmos DB for MongoDB.
author: gahl-levy
ms.author: gahllevy
ms.service: azure-cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 06/27/2024
---

# Service Limits in Azure Cosmos DB for MongoDB vCore

This document outlines the current hard and soft limits for Azure Cosmos DB for MongoDB vCore. Many of these limitations are temporary and will evolve over time as the service continues to improve. If any of these limits are an issue for your organization, please [reach out to our team](mailto:mongodb-feedback@microsoft.com) for assistance.

## Query and Execution Limits

### MongoDB Execution Limits
- Maximum transaction lifetime: 30 seconds.
- Cursor lifetime: 10 minutes. Note: A cursorNotFound error might occur if the cursor exceeds its lifetime.
- Default query execution limit: 120 seconds. This can be overridden on a per-query basis using `maxTimeMS` in the respective MongoDB driver.
#### Example:
```javascript
db.collection.find({ field: "value" }).maxTimeMS(5000)
```

### Maximum MongoDB Query Size
- The maximum memory size for MongoDB queries depends on the tier. For example, for M80, the query memory size limit is approximately 150 MiB.
- In sharded clusters, if a query pulls data across nodes, the limit on that data size is 1GB.

## Indexing Limits

### General Indexing Limits
- Maximum number of compound index fields: 32.
- Maximum size for `_id` field value: 2KB.
- Maximum size for index path: 256B.
- Default maximum: 64.
  - Configurable up to: 300 indexes per collection.
- Sorting is done in memory and doesn't push down to the index.
- Maximum level of nesting for embedded objects/arrays on index definitions: 6.
- Background index builds are in preview. To enable, please [reach out to our team](mailto:mongodb-feedback@microsoft.com) for assistance.
  - A single index build can be in progress on the same collection.
  - The number of simultaneous index builds on different collections is configurable (default: 2).
  - Use the `currentOp` command to view the progress of long-running index builds.
  - Unique index builds are done in the foreground and block writes in the collection.

### Wildcard Indexing Limits
- For wildcard indexes, if the indexed field is an array of arrays, the entire embedded array is taken as a value instead of traversing its contents.

### Geospatial Indexing Limits
- No support for BigPolygons.
- Composite indexes don't support geospatial indexes.
- `$geoWithin` query doesn't support polygons with holes.
- The `key` field is required in the `$geoNear` aggregation stage.
- Indexes are recommended but not required for `$near`, `$nearSphere` query operators, and the `$geoNear` aggregation stage.

### Text Index Limits
- Only one text index can be defined on a collection.
- Supports simple text searches only; advanced search capabilities like regular expression searches aren't supported.
- `hint()` isn't supported in combination with a query using `$text` expression.
- Sort operations can't use the ordering of the text index.
- Tokenization for Chinese, Japanese, Korean isn't supported yet.
- Case insensitive tokenization isn't supported yet.

### Vector Search Limits
- Indexing vectors up to 2,000 dimensions in size.
- Indexing applies to only one vector per path.
- Only one index can be created per vector path.

## Cluster and Shard Limits

### Cluster Tier
- Maximum: M200. Please [reach out to our team](mailto:mongodb-feedback@microsoft.com) for higher tiers.

### Shards
- Maximum: 6 (in preview). Please [reach out to our team](mailto:mongodb-feedback@microsoft.com) for additional shards.

### Secondary Regions
- Maximum: 1 additional secondary region. Please [reach out to our team](mailto:mongodb-feedback@microsoft.com) for additional regions.

### Free Tier Limits
The following limitations can be overridden by upgrading a paid tier
- Maximum storage: 32GB.
- Backup / Restore not supported (available in M25+)
- High availability (HA) not supported (available in M30+)
- HNSW vector indexes not supported (available in M40+)
- Diagnostic logging not supported (available in M30+)
- No service-level-agreement provided (requires HA to be enabled)
- Free tier clusters are paused after 60 days of inactivity where there are no connections to the cluster.

## Replication and HA Limits

### Cross-Region Replication (Preview)
- Supported only on single shard (node) vCore clusters.
- The following configurations are the same on both primary and replica clusters and can't be changed on the replica cluster:
  - Compute configuration
  - Storage and shard count
  - User accounts
- HA isn't supported on replica clusters.
- Cross-region replication isn't available on clusters with burstable compute or Free tier clusters.

## Miscellaneous Limits

### Portal Mongo Shell Usage
- The Portal Mongo Shell can be used for 120 minutes within a 24-hour window.

## Next steps

- Get started by [creating a cluster.](quickstart-portal.md).
- Review options for [migrating from MongoDB to Azure Cosmos DB for MongoDB vCore.](migration-options.md)



