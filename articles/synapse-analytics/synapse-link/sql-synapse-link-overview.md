---
title: What is Azure Synapse Link for SQL?
description: Learn about Azure Synapse Link for SQL, the benefits it offers, and price.
services: synapse-analytics 
author: SnehaGunda
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: synapse-link
ms.custom: event-tier1-build-2022
ms.date: 11/16/2022
ms.author: sngun
ms.reviewer: sngun
---

# What is Azure Synapse Link for SQL?

Azure Synapse Link for SQL enables near real time analytics over operational data in Azure SQL Database or SQL Server 2022. With a seamless integration between operational stores including Azure SQL Database and SQL Server 2022 and Azure Synapse Analytics, Azure Synapse Link for SQL enables you to run analytics, business intelligence and machine learning scenarios on your operational data with minimum impact on source databases with a new change feed technology.

The following image shows the Azure Synapse Link integration with Azure SQL DB, SQL Server 2022, and Azure Synapse Analytics:

:::image type="content" source="../media/sql-synapse-link-overview/synapse-link-sql-architecture.png" alt-text="Diagram of the Azure Synapse Link for SQL architecture.":::

## Benefit

Azure Synapse Link for SQL provides fully managed and turnkey experience for you to land operational data in Azure Synapse Analytics dedicated SQL pools. It does this by continuously replicating the data from Azure SQL Database or SQL Server 2022 with full consistency. By using Azure Synapse Link for SQL, you can get the following benefits:

* **Minimum impact on operational workload**
With the new change feed technology in Azure SQL Database and SQL Server 2022, Azure Synapse Link for SQL can automatically extract incremental changes from Azure SQL Database or SQL Server 2022. It then replicates to Azure Synapse Analytics dedicated SQL pool with minimal impact on the operational workload.

* **Reduced complexity with No ETL jobs to manage**
After going through a few clicks including selecting your operational database and tables, updates made to the operational data in Azure SQL Database or SQL Server 2022 are visible in the Azure Synapse Analytics dedicated SQL pool. They're available in near real-time with no ETL or data integration logic. You can focus on analytical and reporting logic against operational data via all the capabilities within Azure Synapse Analytics.

* **Near real-time insights into your operational data**
You can now get rich insights by analyzing operational data in Azure SQL Database or SQL Server 2022 in near real-time to enable new business scenarios including operational BI reporting, real time scoring and personalization, or supply chain forecasting etc. via Azure Synapse link for SQL.

## Next steps

* [Azure Synapse Link for Azure SQL Database](sql-database-synapse-link.md).
* [Azure Synapse Link for SQL Server 2022](sql-server-2022-synapse-link.md).
* How to [Configure Azure Synapse Link for SQL Server 2022](connect-synapse-link-sql-server-2022.md).
* How to [Configure Azure Synapse Link for Azure SQL Database](connect-synapse-link-sql-database.md).
