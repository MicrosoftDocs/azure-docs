---
title: Azure SQL Data Warehouse Release Notes December 2018 | Microsoft Docs
description: Release notes for Azure SQL Data Warehouse.
services: sql-data-warehouse
author: twounder
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 12/12/2018
ms.author: mausher
ms.reviewer: twounder
---

# What's new in Azure SQL Data Warehouse version - 10.0.10106.0?
Azure SQL Data Warehouse (SQL DW) is continuously improving. This article describes the new features and changes that have been introduced in SQL DW version 10.0.10106.0.

## Query Restartability - CTAS and Insert/Select
In rare situations (that is, intermittent network connection problems, node failures) queries executing in Azure SQL DW can fail. Longer running statements, such as [CREATE TABLE AS SELECT (CTAS)](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-develop-ctas) and INSERT-SELECT operations, are more exposed to this potential problem. With this release, Azure SQL DW implements retry logic for CTAS and INSERT-SELECT statements (in addition to SELECT statements announced previously), allowing the system to transparently handle these transient problems and preventing queries from failing. The number of retry attempts and the list of transient errors handled are system configured.

## Return Order By Optimization
SELECT…ORDER BY queries get a performance boost in this release.  Previously, the query execution engine would order results on each compute node, and stream them to the control node, which would then merge the results. With this enhancement, all compute nodes instead send their results to a single compute node, which then merges them and returns the sorted results to the user via the compute node.  This offers a significant performance gain when the query result set contains a large number of rows.

## Data Movement Enhancements for PartitionMove and BroadcastMove
In Azure SQL Data Warehouse Gen2, data movement steps of type ShuffleMove leverage instant data movement techniques outlined in the [performance enhancements blog here](https://azure.microsoft.com/blog/lightning-fast-query-performance-with-azure-sql-data-warehouse/).  With this release, data movement types PartitionMove and BroadcastMove are now also powered by the same instant data movement techniques.  User queries that utilize these types of data movement steps will see a performance boost.  No code change is required to take advantage of these performance gains.

## Next steps
Now that you know a bit about SQL Data Warehouse, learn how to quickly [create a SQL Data Warehouse][create a SQL Data Warehouse]. If you are new to Azure, you may find the [Azure glossary][Azure glossary] helpful as you learn new terminology. Or look at some of these other SQL Data Warehouse Resources.  

* [Customer success stories]
* [Blogs]
* [Feature requests]
* [Videos]
* [Customer Advisory Team blogs]
* [Stack Overflow forum]
* [Twitter]


[Blogs]: https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/
[Customer Advisory Team blogs]: https://blogs.msdn.microsoft.com/sqlcat/tag/sql-dw/
[Customer success stories]: https://azure.microsoft.com/case-studies/?service=sql-data-warehouse
[Feature requests]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[Stack Overflow forum]: http://stackoverflow.com/questions/tagged/azure-sqldw
[Twitter]: https://twitter.com/hashtag/SQLDW
[Videos]: https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse
[create a SQL Data Warehouse]: ./create-data-warehouse-portal.md
[Azure glossary]: ../azure-glossary-cloud-terminology.md
