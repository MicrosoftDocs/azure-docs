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

## SQL Data Warehouse Version 

| Service improvements | Details |
| --- | --- |
|**Workload importance now available for preview**|Workload importance gives data engineers the ability to use importance to classify requests. Requests with higher importance are guaranteed quicker access to resources which helps meet SLAs.  Workload importance allows high business value work to meet SLAs in a shared environment with fewer resources.</br></br>For more information on workload importance refer to the [Classification](sql-data-warehouse-workload-classification.md) and [Importance](sql-data-warehouse-workload-importance.md) overview topics in the documentation. Check out the [CREATE WORKLOAD CLASSIFIER](/sql/t-sql/statements/create-workload-classifier-transact-sql?view=azure-sqldw-latest) doc as well.</br></br>See workload importance in action in the below videos:</br>Workload Importance concepts</br>Workload Importance scenarios|
|**Auto Update Statistics**|Automatic statistics updates are now available in Azure SQL Data Warehouse for public preview. Customers can use AUTO_UPDATE_STATISTICS and AUTO_UPDATE_STATISTICS_ASYNC options to turn ON/OFF this feature and configure whether the updates should be done synchronously or asynchronously. For more details on managing statistics in Azure SQL Data Warehouse, please out the check [statistics](/azure/sql-data-warehouse/sql-data-warehouse-tables-statistics) documentation.|
|**GROUP BY ROLLUP**|ROLLUP is now a supported GROUP BY option in Azure Data Warehouse.   GROUP BY ROLLUP creates a group for each combination of column expressions. In addition, it "rolls up" the results into subtotals and grand totals. To do this, it moves from right to left decreasing the number of column expressions over which it creates groups and aggregation(s).  The column order affects the ROLLUP output and can affect the number of rows in the result set.</br></br>The syntax is as simple as follows:</br>
```sql
GROUP BY {
      column-name [ WITH (DISTRIBUTED_AGG) ]  
    | column-expression
| ROLLUP ( <group_by_expression> [ ,...n ] ) 
} [ ,...n ]
```

For more information on GROUP BY ROLLUP, see the article, [GROUP BY (Transact-SQL)](/sql/t-sql/queries/select-group-by-transact-sql?view=azure-sqldw-latest)
|**DWU used and CPU portal metrics underreport in the Azure portal**|SQL Data Warehouse significantly enhances metric accuracy in the Azure portal.  This release includes a fix to the CPU and DWU Used metric definition to properly reflect your workload across all compute nodes.|
|**Additional T-SQL Support**|The T-SQL language surface area for SQL Data Warehouse has been extended to include the support for the following:</br>- [STRING_SPLIT](/sql/t-sql/functions/string-split-transact-sql?view=azure-sqldw-latest)</br>- [FORMAT](/sql/t-sql/functions/format-transact-sql?view=sql-server-2017&viewFallbackFrom=azure-sqldw-latest)</br>-	STRING_ESCAPE</br>-	TRANSLATE<</br>- TRIM








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
