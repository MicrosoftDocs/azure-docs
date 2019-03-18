---
title: Azure SQL Data Warehouse Release Notes | Microsoft Docs
description: Release notes for Azure SQL Data Warehouse.
services: sql-data-warehouse
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: manage
ms.date: 02/09/2019
author: mlee3gsd
ms.author: anumjs
ms.reviewer: jrasnick
manager: craigg
---

# Azure SQL Data Warehouse release notes
This article summarizes the new features and improvements in the recent releases of [Azure SQL Data Warehouse](sql-data-warehouse-overview-what-is.md). The article also lists notable content updates that are not directly related to the release but published in the same time frame. For improvements to other Azure services, see [Service updates](https://azure.microsoft.com/updates)

## SQL Data Warehouse Version 10.0.10106.0 (January)

### Service improvements

| Service improvements | Details |
| --- | --- |
|**Return Order By Optimization**|SELECT…ORDER BY queries get a performance boost in this release.   Now, all compute nodes send their results to a single compute node, which merges and sorts the results, which are returned to the user via the compute node.  Merging through a single compute node results in a significant performance gain when the query result set contains a large number of rows. Previously, the query execution engine would order results on each compute node, and stream them to the control node, which would then merge the results.|
|**Data Movement Enhancements for PartitionMove and BroadcastMove**|In Azure SQL Data Warehouse Gen2, data movement steps of type ShuffleMove, use instant data movement techniques outlined in the [performance enhancements blog](https://azure.microsoft.com/blog/lightning-fast-query-performance-with-azure-sql-data-warehouse/). With this release, data movement types PartitionMove and BroadcastMove are now also powered by the same instant data movement techniques. User queries that utilize these types of data movement steps will run with improved performance. No code change is required to take advantage of these performance improvements.|
|**Notable Bugs**|Incorrect Azure SQL Data Warehouse version - 'SELECT @@VERSION' may return the incorrect version, 10.0.9999.0. The correct version for the current release is 10.0.10106.0. This bug has been reported and is under review.

### Documentation improvements

| Documentation improvements | Details |
| --- | --- |
|none | |
| | |

## Next steps
- [create a SQL Data Warehouse](./create-data-warehouse-portal.md)

## More information
- [Blog - Azure SQL Data Warehouse](https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/)
- [Customer Advisory Team blogs](https://blogs.msdn.microsoft.com/sqlcat/tag/sql-dw/)
- [Customer success stories](https://azure.microsoft.com/case-studies/?service=sql-data-warehouse)
- [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-sqldw)
- [Twitter](https://twitter.com/hashtag/SQLDW)
- [Videos](https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse)
- [Azure glossary](../azure-glossary-cloud-terminology.md)
