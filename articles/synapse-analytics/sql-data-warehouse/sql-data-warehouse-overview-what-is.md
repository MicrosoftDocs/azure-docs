---
title: What is Azure Synapse Analytics (formerly SQL DW)?
description: Azure Synapse Analytics (formerly SQL DW) is a limitless analytics service that brings together enterprise data warehousing and Big Data analytics.
services: synapse-analytics
author: mlee3gsd 
manager: craigg
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: 
ms.date: 11/04/2019
ms.author: martinle
ms.reviewer: igorstan
---

# What is Azure Synapse Analytics (formerly SQL DW)?

> [!NOTE] 
>Explore the [Azure Synapse (workspaces preview) documentation](../overview-what-is.md).
>

Azure Synapse is an analytics service that brings together enterprise data warehousing and Big Data analytics. It gives you the freedom to query data on your terms, using either serverless on-demand or provisioned resources—at scale. Azure Synapse brings these two worlds together with a unified experience to ingest, prepare, manage, and serve data for immediate BI and machine learning needs.

Azure Synapse has four components:

- Synapse SQL: Complete T-SQL based analytics – Generally Available
  - SQL pool (pay per DWU provisioned)
  - SQL on-demand (pay per TB processed) (preview)
- Spark: Deeply integrated Apache Spark (preview)
- Synapse Pipelines: Hybrid data integration (preview)
- Studio: Unified user experience. (preview)

## Synapse SQL pool in Azure Synapse

Synapse SQL pool refers to the enterprise data warehousing features that are generally available in Azure Synapse.

SQL pool represents a collection of analytic resources that are being provisioned when using Synapse SQL. The size of SQL pool is determined by Data Warehousing Units (DWU).

Import big data with simple [PolyBase](/sql/relational-databases/polybase/polybase-guide?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest) T-SQL queries, and then use the power of MPP to run high-performance analytics. As you integrate and analyze, Synapse SQL pool will become the single version of truth your business can count on for faster and more robust insights.  

## Key component of a big data solution

Data warehousing is a key component of a cloud-based, end-to-end big data solution.

![Data warehouse solution](./media/sql-data-warehouse-overview-what-is/data-warehouse-solution.png)

In a cloud data solution, data is ingested into big data stores from a variety of sources. Once in a big data store, Hadoop, Spark, and machine learning algorithms prepare and train the data. When the data is ready for complex analysis, Synapse SQL pool uses PolyBase to query the big data stores. PolyBase uses standard T-SQL queries to bring the data into Synapse SQL pool tables.

Synapse SQL pool stores data in relational tables with columnar storage. This format significantly reduces the data storage costs, and improves query performance. Once data is stored, you can run analytics at massive scale. Compared to traditional database systems, analysis queries finish in seconds instead of minutes, or hours instead of days.

The analysis results can go to worldwide reporting databases or applications. Business analysts can then gain insights to make well-informed business decisions.

## Next steps

- Explore [Azure Synapse architecture](massively-parallel-processing-mpp-architecture.md)
- Quickly [create a SQL pool](create-data-warehouse-portal.md)
- [Load sample data](load-data-from-azure-blob-storage-using-polybase.md).
- Explore [Videos](https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse)

Or look at some of these other Azure Synapse resources.

- Search [Blogs](https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/)
- Submit a [Feature requests](https://feedback.azure.com/forums/307516-sql-data-warehouse)
- [Create a support ticket](sql-data-warehouse-get-started-create-support-ticket.md)
- Search [Microsoft Q&A question page](https://docs.microsoft.com/answers/topics/azure-synapse-analytics.html)
- Search [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-sqldw)
