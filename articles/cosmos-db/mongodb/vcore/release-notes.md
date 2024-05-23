---
title: Service release notes
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Includes a list of all feature updates, grouped by release date, for the Azure Cosmos DB for MongoDB vCore service.
author: avijitgupta
ms.author: avijitgupta
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: release-notes
ms.date: 05/09/2024
#Customer intent: As a database administrator, I want to review the release notes, so I can understand what new features are released for the service.
---

# Release notes for Azure Cosmos DB for MongoDB vCore

This article contains release notes for the API for MongoDB vCore. These release notes are composed of feature release dates, and feature updates.

## Latest release: May 06, 2024

- Query operator enhancements.
  - $geoNear aggregation. This can be enabled through Flag - `Geospatial support for vcore "MongoDB for CosmosDB"` (Public Preview)
  - Support for accumulators
    - $push.
    - $mergeObjects.
    - $addToSet.
    - $tsSecond/$tsIncrement.
    - $map/$reduce.
  - Support for date expressions
    - $dateAdd.
    - $dateSubtract.
    - $dateDiff.
- Creating indexes with large index keys: values larger than 2.7 KB.
- Geo replicas enabling cross-region disaster recovery and reads scaling.
- Improved performance of group and distinct.
- Improved performance for $geoWithin queries with $centerSphere when radius is greater than π.

## Previous releases

### April 16, 2024

- Query operator enhancements.
  - $centerSphere with index pushdown along with support for GeoJSON coordinates.
  - $graphLookup support.

- Performance improvements.
  - $exists, { $eq: null}, {$ne: null} by adding new index terms.
  - scans with $in/$nq/$ne in the index.
  - compare partial (Range) queries.

### March 18, 2024

- [Private Endpoint](how-to-private-link.md) support enabled on Portal. (GA)
- [HNSW](vector-search.md) vector index on M40 & larger cluster tiers. (GA)
- Enable Geo-spatial queries. (Public Preview)
- Query operator enhancements.
  - $centerSphere with index pushdown.
  - $min & $max operator with $project.
  - $binarySize aggregation operator.
- Ability to build indexes in background (except Unique indexes). (Public Preview)

### March 03, 2024

This release contains enhancements to the **Explain** plan and various vector filtering abilities.

- The API for MongoDB vCore allows filtering by metadata columns while performing vector searches.
- The `Explain` plan offers two different modes

  | | Description |
  | --- | --- |
  | **`allShardsQueryPlan`** | This mode is a new explain mode to view the query plan for all shards involved in the query execution. This mode offers a comprehensive perspective for distributed queries. |
  | **`allShardsExecution`** | This mode presents an alternative explain mode to inspect the execution details across all shards involved in the query. This mode provides you with comprehensive information to use in performance optimization. |

- Free tier support is available in more regions. These regions now include **East US 2**. For more information, see [Azure Cosmos DB pricing](https://azure.microsoft.com/pricing/details/cosmos-db/mongodb/).

- The ability to build indexes in the background is now available in preview.

## Related content

- [Azure updates for Azure Cosmos DB for MongoDB vCore](https://azure.microsoft.com/updates?category=databases&query=Cosmos%20DB%20MongoDB).
