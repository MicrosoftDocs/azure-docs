---
title: "Azure Synapse Analytics: Migration guide"
description: Follow this guide to migrate your databases to an Azure Synapse Analytics dedicated SQL pool. 
ms.service: synapse-analytics
ms.subservice: sql
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: 
ms.date: 04/12/2023
---
# Migrate a data warehouse to a dedicated SQL pool in Azure Synapse Analytics

The following sections provide an overview of what's involved with migrating an existing data warehouse solution to an Azure Synapse Analytics dedicated SQL pool (formerly SQL data warehouse).

## Overview

Before you begin your migration, you should verify that Azure Synapse Analytics is the best solution for your workload. Azure Synapse Analytics is a distributed system designed to perform analytics on large data. Migrating to Azure Synapse Analytics requires some design changes that aren't difficult to understand but that might take some time to implement. If your business requires an enterprise-class data warehouse, the benefits are worth the effort. However, if you don't need the power of Azure Synapse Analytics, it's more cost-effective to use [SQL Server](/sql/sql-server/) or [Azure SQL Database](/azure/azure-sql/index).

Consider using Azure Synapse Analytics when you:

- Have one or more terabytes of data.
- Plan to run analytics on substantial amounts of data.
- Need the ability to scale compute and storage.
- Want to save on costs by pausing compute resources when you don't need them.

Rather than Azure Synapse Analytics, consider other options for operational online transaction processing (OLTP) workloads that have:

- High frequency reads and writes.
- Large numbers of singleton selects.
- High volumes of single row inserts.
- Row-by-row processing needs.
- Incompatible formats (for example, JSON and XML).


## Pre-migration

After you decide to migrate an existing solution to Azure Synapse Analytics, you need to plan your migration before you get started. A primary goal of planning is to ensure that your data, table schemas, and code are compatible with Azure Synapse Analytics. There are some compatibility differences between your current system and Azure Synapse Analytics that you'll need to work around. In addition, migrating large amounts of data to Azure takes time. Careful planning will speed up the process of getting your data to Azure.

Another key goal of planning is to adjust your design to ensure that your solution takes full advantage of the high query performance that Azure Synapse Analytics is designed to provide. Designing data warehouses for scale introduces unique design patterns, so traditional approaches aren't always the best. While some design adjustments can be made after migration, making changes earlier in the process will save you time later.

## Migrate

Performing a successful migration requires you to migrate your table schemas, code, and data. For more detailed guidance on these topics, see the following articles:

- [Consider table design](../sql-data-warehouse/sql-data-warehouse-tables-overview.md)
- [Consider code change](../sql-data-warehouse/sql-data-warehouse-overview-develop.md#development-recommendations-and-coding-techniques)
- [Migrate your data](../sql-data-warehouse/design-elt-data-loading.md)
- [Consider workload management](../sql-data-warehouse/sql-data-warehouse-workload-management.md)

## More resources

For more information specifically about migrations from Netezza or Teradata to Azure Synapse Analytics, start at the first step of a seven-article sequence on migrations: 

- [Netezza to Azure Synapse Analytics migrations](netezza/1-design-performance-migration.md)
- [Teradata to Azure Synapse Analytics migrations](teradata/1-design-performance-migration.md)

## Migration assets from real-world engagements

For more assistance with completing this migration scenario, see the following resources. They were developed in support of a real-world migration project engagement.

| Title/link                              | Description                                                                                                                       |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [Data Workload Assessment Model and Tool](https://www.microsoft.com/download/details.aspx?id=103130) | This tool provides suggested "best fit" target platforms, cloud readiness, and application or database remediation level for a given workload. It offers simple, one-click calculation and report generation that helps to accelerate large estate assessments by providing an automated and uniform target platform decision process. |
| [Handling data encoding issues while loading data to Azure Synapse Analytics](https://azure.microsoft.com/blog/handling-data-encoding-issues-while-loading-data-to-sql-data-warehouse/) | This blog post provides insight on some of the data encoding issues you might encounter while using PolyBase to load data to dedicated SQL pools (formerly SQL data warehouse). This article also provides some options that you can use to overcome such issues and load the data successfully. |
| [Getting table sizes in Azure Synapse Analytics dedicated SQL pool](https://github.com/Microsoft/DataMigrationTeam/blob/master/Whitepapers/Getting%20table%20sizes%20in%20SQL%20DW.pdf) | One of the key tasks that an architect must perform is to get metrics about a new environment post-migration. Examples include collecting load times from on-premises to the cloud and collecting PolyBase load times. One of the most important tasks is to determine the storage size indedicated SQL pools (formerly SQL data warehouse) compared to the customer's current platform. |

The Data SQL Engineering team developed these resources. This team's core charter is to unblock and accelerate complex modernization for data platform migration projects to Microsoft's Azure data platform.

## Videos

Watch how [Walgreens migrated its retail inventory system](https://www.youtube.com/watch?v=86dhd8N1lH4) with about 100 TB of data from Netezza to Azure Synapse Analytics in record time.

> [!TIP]
> For more information on Synapse migrations, see [Azure Synapse Analytics migration guides](index.yml).
