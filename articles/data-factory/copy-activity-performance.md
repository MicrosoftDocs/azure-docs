---
title: Copy Activity performance and tuning guide | Microsoft Docs
description: Learn about key factors that affect the performance of data movement in Azure Data Factory when you use Copy Activity.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/10/2017
ms.author: jingwang

---
# Copy Activity performance and tuning guide
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-copy-activity-performance.md)
> * [Version 2 - Preview](copy-activity-performance.md)


Azure Data Factory Copy Activity delivers a first-class secure, reliable, and high-performance data loading solution. It enables you to copy tens of terabytes of data every day across a rich variety of cloud and on-premises data stores. Blazing-fast data loading performance is key to ensure you can focus on the core “big data” problem: building advanced analytics solutions and getting deep insights from all that data.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [copy activity performance in V1](v1/data-factory-copy-activity-performance.md).


Azure provides a set of enterprise-grade data storage and data warehouse solutions, and Copy Activity offers a highly optimized data loading experience that is easy to configure and set up. With just a single copy activity, you can achieve:

* Loading data into **Azure SQL Data Warehouse** at **1.2 GBps**. For a walkthrough with a use case, see [Load 1 TB into Azure SQL Data Warehouse under 15 minutes with Azure Data Factory](connector-azure-sql-data-warehouse.md).
* Loading data into **Azure Blob storage** at **1.0 GBps**
* Loading data into **Azure Data Lake Store** at **1.0 GBps**

This article describes:

* [Performance reference numbers](#performance-reference) for supported source and sink data stores to help you plan your project;
* Features that can boost the copy throughput in different scenarios, including [cloud data movement units](#cloud-data-movement-units), [parallel copy](#parallel-copy), and [staged Copy](#staged-copy);
* [Performance tuning guidance](#performance-tuning-steps) on how to tune the performance and the key factors that can impact copy performance.

> [!NOTE]
> If you are not familiar with Copy Activity in general, see [Move data by using Copy Activity](copy-activity-overview.md) before reading this article.
>

## Performance reference

## Parallel copy

## Staged copy

## Performance tuning steps

## Considerations for Data Management Gateway

## Considerations for the source

## Considerations for the sink

## Considerations for serialization and deserialization

## Considerations for compression

## Considerations for column mapping

## Other considerations

## Sample scenario: Copy from an on-premises SQL Server to Blob storage
## Sample scenarios: Use parallel copy

## Reference
Here is performance monitoring and tuning references for some of the supported data stores:

* Azure Storage (including Blob storage and Table storage): [Azure Storage scalability targets](../storage/common/storage-scalability-targets.md) and [Azure Storage performance and scalability checklist](../storage/common/storage-performance-checklist.md)
* Azure SQL Database: You can [monitor the performance](../sql-database/sql-database-single-database-monitor.md) and check the database transaction unit (DTU) percentage
* Azure SQL Data Warehouse: Its capability is measured in data warehouse units (DWUs); see [Manage compute power in Azure SQL Data Warehouse (Overview)](../sql-data-warehouse/sql-data-warehouse-manage-compute-overview.md)
* Azure Cosmos DB: [Performance levels in Azure Cosmos DB](../cosmos-db/performance-levels.md)
* On-premises SQL Server: [Monitor and tune for performance](https://msdn.microsoft.com/library/ms189081.aspx)
* On-premises file server: [Performance tuning for file servers](https://msdn.microsoft.com/library/dn567661.aspx)

## Next steps
See the other Copy Activity articles:

- [Copy activity overview](copy-activity-overview.md)
- [Copy activity fault tolerance](copy-activity-fault-tolerance.md)
- [Copy activity security considerations](copy-activity-security-considerations.md)