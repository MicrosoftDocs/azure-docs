---
title: Azure Synapse Analytics (formerly SQL DW) Frequently Asked Questions 
description: This article lists out frequently asked questions about Azure Synapse Analytics (formerly SQL DW) from customers and developers
services: synapse-analytics
author: mlee3gsd
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: sql-dw 
ms.date: 11/04/2019
ms.author: martinle
ms.reviewer: igorstan
---

# Azure Synapse Analytics (formerly SQL DW) Frequently asked questions

## General

Q. What is Azure Synapse?

A. Azure Synapse is an analytics service that brings together data warehousing and Big Data analytics. Azure Synapse brings these two worlds together with a unified experience to ingest, prepare, manage, and serve data for BI and machine learning needs. For more information, see, [What is Azure Synapse Analytics](sql-data-warehouse-overview-what-is.md).

Q. What happened to Azure SQL Data Warehouse?

A. Azure Synapse is Azure SQL Data Warehouse (SQL DW) evolved. We've taken the same industry-leading data warehouse to a whole new level of performance and capabilities. You can continue running your existing data warehouse workloads in production with Azure Synapse. For more information, see [What is Azure Synapse Analytics](sql-data-warehouse-overview-what-is.md).

Q. What is Synapse SQL pool?

A. Synapse SQL pool refers to the enterprise data warehousing features that are generally available with Azure Synapse. For more information, see, [What is Azure Synapse Analytics](sql-data-warehouse-overview-what-is.md).

Q. How do I get started with Azure Synapse?

A. You can get started with an [Azure free account](https://azure.microsoft.com/free/sql-data-warehouse/) or [contact sales for more information](https://info.microsoft.com/ww-landing-azure-sql-data-warehouse-contactme.html).

Q. What does Azure Synapse offer for data security?

A. Azure Synapse offers several solutions for protecting data such as TDE and auditing. For more information, see [Security](sql-data-warehouse-overview-manage-security.md).

Q. Where can I find out what legal or business standards Azure Synapse is compliant with?

A. Visit the [Microsoft Compliance](https://www.microsoft.com/trustcenter/compliance/complianceofferings) page for various compliance offerings by product such as SOC and ISO. First, choose by Compliance title. Then expand Azure in the Microsoft in-scope cloud services section on the right side of the page to see what services are Azure Synapse compliant.

Q. Can I connect Power BI?

A. Yes! Though Power BI supports direct query with Azure Synapse, it's not intended for a large number of users or real-time data. To optimize Power BI performance further, consider using Power BI on top of Azure Analysis Services or Analysis Service IaaS.

Q. What are Synapse SQL pool capacity limits?

A. See our current [capacity limits](sql-data-warehouse-service-capacity-limits.md) page.

Q. Why is my Scale/Pause/Resume taking so long?

A. Several factors can influence the time for compute management operations. A common case for long running operations is transactional rollback. When a scale or pause operation is initiated, all incoming sessions are blocked and queries are drained. In order to leave the system in a stable state, transactions must be rolled back before an operation can commence. The greater the number and larger the log size of transactions, the longer the operation will be stalled restoring the system to a stable state.

## User support

Q. I have a feature request, where do I submit it?

A. If you have a feature request, submit it on our [UserVoice](https://feedback.azure.com/forums/307516-sql-data-warehouse) page

Q. How can I do x?

A. For help with developing with Azure Synapse, you can ask questions on our [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-sqldw) page.

Q. How do I submit a support ticket?

A. [Support Tickets](sql-data-warehouse-get-started-create-support-ticket.md) can be filed through Azure portal.

## SQL language/feature support

Q. What data types are supported?

A. See  [data types](sql-data-warehouse-tables-data-types.md).

Q. What table features do you support?

A. Many features are supported. Features that aren't supported can be found in [Unsupported Table Features](sql-data-warehouse-tables-data-types.md).

## Tooling and administration

Q. Does Synapse SQL pool support REST APIs?

A. Yes. Most REST functionality that can be used with SQL Database is also available with Synapse SQL pool. You can find API information within REST documentation pages or
[Databases](/rest/api/sql/databases?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

## Loading

Q. What client drivers do you support?

A. Driver support for Synapse SQL pool can be found on the [Connection Strings](../sql/connection-strings.md) page

Q: What file formats are supported by PolyBase?

A: Orc, RC, Parquet, and flat delimited text

Q: What data sources can I connect to using PolyBase?

A: [Azure Data Lake Storage](sql-data-warehouse-load-from-azure-data-lake-store.md) and [Azure Storage Blobs](sql-data-warehouse-load-from-azure-blob-storage-with-polybase.md)

Q: Is computation pushdown possible when connecting to Azure Storage Blobs or ADLS?

A: No, PolyBase only interacts with the storage components.

Q: Can I connect to HDI?

A: HDI can use either ADLS or WASB as the HDFS layer. If you have either as your HDFS layer, you can load that data into a Synapse SQL pool. However, you cannot generate pushdown computation to the HDI instance.

## Next steps

For more information on Azure Synapse as a whole, see our [Overview](sql-data-warehouse-overview-faq.md) page.
