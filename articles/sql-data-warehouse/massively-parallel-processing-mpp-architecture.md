---
title: What is Azure Synapse Analytics? | Microsoft Docs
description: Azure Synapse Analytics provides Enable a fully integrated analytics experience built to ingest, prepare, manage, and serve data so it’s immediately ready for BI, machine learning, and AI needs.
services: sql-data-warehouse
author: mlee3gsd 
manager: craigg
ms.service: sql-data-warehouse
ms.topic: overview
ms.subservice: design
ms.date: 05/30/2019
ms.author: martinle
ms.reviewer: igorstan
---

# What is Azure Synapse Analytics?

Azure Synapse Analytics is a limitless cloud data warehouse that gives you the freedom to query data on your terms, using on-demand or provisioned resources. Synapse Analytics brings a multitude of new capabilities that simplify enterprise data lake and data warehousing solutions. Empower all data engineers and SQL data professionals to collaborate, manage, and analyze all your most important data with ease. Enable a fully integrated analytics experience built to ingest, prepare, manage, and serve data so it’s immediately ready for your BI, machine learning, and AI needs.

Azure Synapse Analytics has four components:
- SQL Analytics 
    - Provisioned (formerly SQL DW)
    - On-demand (Preview)
- Spark : Deeply integrated Apache Spark (Preview) 
- Data Integration : Hybrid data integration (Preview)
- Studio (Preview) : unified user experience.  (Preview)


## SQL Analytics

SQL Analytics is a cloud-based Enterprise Data Warehouse (EDW) that uses Massively Parallel Processing (MPP) to quickly run complex queries across petabytes of data and is a key component of a big data solution. Import big data into SQL Analytics with simple [PolyBase](/sql/relational-databases/polybase/polybase-guide?view=sql-server-2017&viewFallbackFrom=azure-sqldw-latest) T-SQL queries, and then use the power of MPP to run high-performance analytics. As you integrate and analyze, the data warehouse will become the single version of truth your business can count on for insights.  

## Key component of big data solution

Data warehousing is a key component of an end-to-end big data solution in the Cloud.

![Data warehouse solution](media/sql-data-warehouse-overview-what-is/data-warehouse-solution.png) 

In a cloud data solution, data is ingested into big data stores from a variety of sources. Once in a big data store, Hadoop, Spark, and machine learning algorithms prepare and train the data. When the data is ready for complex analysis, Synapse Analytics uses PolyBase to query the big data stores. PolyBase uses standard T-SQL queries to bring the data into Synapse Analytics.
 
Synapse Analytics stores data into relational tables with columnar storage. This format significantly reduces the data storage costs, and improves query performance. Once data is stored in Synapse Analytics, you can run analytics at massive scale. Compared to traditional database systems, analysis queries finish in seconds instead of minutes, or hours instead of days. 

The analysis results can go to worldwide reporting databases or applications. Business analysts can then gain insights to make well-informed business decisions.

## Next steps

- Explore [Azure Synapse Analytics architecture](/azure/sql-data-warehouse/massively-parallel-processing-mpp-architecture)
- Quickly [create a data warehouse][create a SQL Data Warehouse]
- [Load sample data][load sample data].
- Explore [Videos](/azure/sql-data-warehouse/sql-data-warehouse-videos)

Or look at some of these other Synapse Analytics resources.  
* Search [Blogs]
* Submit a [Feature requests]
* Search [Customer Advisory Team blogs]
* [Create a support ticket]
* Search [MSDN forum]
* Search [Stack Overflow forum]


<!--Image references-->
[1]: ./media/sql-data-warehouse-overview-what-is/dwarchitecture.png

<!--Article references-->
[Create a support ticket]: ./sql-data-warehouse-get-started-create-support-ticket.md
[load sample data]: ./sql-data-warehouse-load-sample-databases.md
[create a data warehouse]: ./sql-data-warehouse-get-started-provision.md
[Migration documentation]: ./sql-data-warehouse-overview-migrate.md
[Azure Synapse Analytics solution partners]: ./sql-data-warehouse-partner-business-intelligence.md
[Integrated tools overview]: ./sql-data-warehouse-overview-integrate.md
[Backup and restore overview]: ./sql-data-warehouse-restore-database-overview.md
[Azure glossary]: ../azure-glossary-cloud-terminology.md

<!--MSDN references-->

<!--Other Web references-->
[Blogs]: https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/
[Customer Advisory Team blogs]: https://blogs.msdn.microsoft.com/sqlcat/tag/sql-dw/
[Feature requests]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[MSDN forum]: https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=AzureSQLDataWarehouse
[Stack Overflow forum]: https://stackoverflow.com/questions/tagged/azure-sqldw
[Twitter]: https://twitter.com/hashtag/SQLDW
[Videos]: https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse
[SLA for Azure Synapse Analytics]: https://azure.microsoft.com/support/legal/sla/sql-data-warehouse/v1_0/
[Volume Licensing]: https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=37
[Service Level Agreements]: https://azure.microsoft.com/support/legal/sla/
