---
title: Azure Synapse Analytics (formerly SQL DW) Frequently Asked Questions | Microsoft Docs
description: This article lists out frequently asked questions about Azure Synapse Analytics (formerly SQL DW) from customers and developers
services: sql-data-warehouse
author: mlee3gsd
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: design
ms.date: 11/04/2019
ms.author: martinle
ms.reviewer: igorstan
---

# Azure Synapse Analytics (formerly SQL DW) Frequently asked questions

## General

Q. What is Azure Synapse?

A. Azure Synapse is a limitless analytics service that brings together data warehousing and Big Data analytics. It gives you the freedom to query data on your terms, using either serverless on-demand or provisioned resources - at scale. Azure Synapse brings these two worlds together with a unified experience to ingest, prepare, manage, and serve data for immediate BI and machine learning needs. For more information see, [What is Azure Synapse Analytics](sql-data-warehouse-overview-what-is.md).

Q. What happened to Azure SQL Data Warehouse?

A. Azure Synapse is Azure SQL Data Warehouse (SQL DW) evolved. We have taken the same industry leading data warehouse to a whole new level of performance and capabilities. You can continue running your existing data warehouse workloads in production today with Azure Synapse and automatically benefit from the new capabilities which are in preview. For more information see, [What is Azure Synapse Analytics](sql-data-warehouse-overview-what-is.md).

Q. What is SQL Analytics?

A. SQL Analytics refers to the enterprise data warehousing features that are generally available with Azure Synapse. For more information see, [What is Azure Synapse Analytics](sql-data-warehouse-overview-what-is.md).

Q. How do I get started with Azure Synapse?

A. You can get started with an [Azure free account](https://azure.microsoft.com/free/sql-data-warehouse/) or [contact sales for more information](https://info.microsoft.com/ww-landing-azure-sql-data-warehouse-contactme.html). 

Q. What does Azure Synapse offer for data security?

A. Azure Synapse offers several solutions for protecting data such as TDE and auditing. For more information, see [Security].

Q. Where can I find out what legal or business standards Azure Synapse is compliant with?

A. Visit the [Microsoft Compliance] page for various compliance offerings by product such as SOC and ISO. 
First choose by Compliance title, then expand Azure in the Microsoft in-scope cloud services section on the right side of the page to see what services are Azure Synapse compliant.

Q. Can I connect Power BI?

A. Yes! Though Power BI supports direct query with Azure Synapse, it’s not intended for large number of users or real-time data. For production use of Power BI, we recommend using Power BI on top of Azure Analysis Services or Analysis Service IaaS. 

Q. What are SQL Analytics capacity limits?

A. See our current [capacity limits] page. 

Q. Why is my Scale/Pause/Resume taking so long?

A. A variety of factors can influence the time for compute management operations. A common case for  long running operations is transactional rollback. When a scale or pause operation is initiated, all incoming sessions are blocked and queries are drained. In order to leave the system in a stable state, transactions must be rolled back before an operation can commence. The greater the number and larger the log size of transactions, the longer the operation will be stalled restoring the system to a stable state.

## User support

Q. I have a feature request, where do I submit it?

A. If you have a feature request, submit it on our [UserVoice] page

Q. How can I do x?

A. For help in developing with Azure Synapse, you can ask questions on our [Stack Overflow] page. 

Q. How do I submit a support ticket?

A. [Support Tickets] can be filed through Azure portal.

## SQL language/feature support 

Q. What datatypes are supported?

A. See  [data types].

Q. What table features do you support?

A. Many features are supported, the ones that are not supported and are documented in [Unsupported Table Features].

## Tooling and administration

Q. Do you support Database projects in Visual Studio.

A. We currently do not support Database projects in Visual Studio. If you'd like to cast a vote to get this feature, visit our User Voice 
[Database projects feature request].

Q. Does SQL Analytics support REST APIs?

A. Yes. Most REST functionality that can be used with SQL Database is also available with SQL Analytics. You can find API information within REST documentation pages or
[MSDN].


## Loading

Q. What client drivers do you support?

A. Driver support for DW can be found on the [Connection Strings] page

Q: What file formats are supported by PolyBase?

A: Orc, RC, Parquet, and flat delimited text

Q: What data sources can I connect to using PolyBase? 

A: [Azure Data Lake Store] and [Azure Storage Blobs]

Q: Is computation pushdown possible when connecting to Azure Storage Blobs or ADLS? 

A: No, PolyBase only interacts with the storage components. 

Q: Can I connect to HDI?

A: HDI can use either ADLS or WASB as the HDFS layer. If you have either as your HDFS layer, then you can load that data into SQL DW. However, you cannot generate pushdown computation to the HDI instance. 

## Next steps
For more information on Azure Synapse as a whole, see our [Overview] page.


<!-- Article references -->
[UserVoice]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[Connection Strings]: ./sql-data-warehouse-connection-strings.md
[Stack Overflow]: https://stackoverflow.com/questions/tagged/azure-sqldw
[Support Tickets]: ./sql-data-warehouse-get-started-create-support-ticket.md
[Security]: ./sql-data-warehouse-overview-manage-security.md
[Microsoft Compliance]: https://www.microsoft.com/en-us/trustcenter/compliance/complianceofferings
[capacity limits]: ./sql-data-warehouse-service-capacity-limits.md
[data types]: ./sql-data-warehouse-tables-data-types.md
[Unsupported Table Features]: ./sql-data-warehouse-tables-overview.md#unsupported-table-features
[Azure Data Lake Store]: ./sql-data-warehouse-load-from-azure-data-lake-store.md
[Azure Storage Blobs]: ./sql-data-warehouse-load-from-azure-blob-storage-with-polybase.md
[Database projects feature request]: https://feedback.azure.com/forums/307516-sql-data-warehouse/suggestions/13313247-database-project-from-visual-studio-to-support-azu
[MSDN]: https://msdn.microsoft.com/library/azure/mt163685.aspx
[Overview]: ./sql-data-warehouse-overview-faq.md
