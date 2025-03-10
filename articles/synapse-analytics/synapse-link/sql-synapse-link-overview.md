---
title: What is Azure Synapse Link for SQL?
description: Learn about Azure Synapse Link for SQL, the benefits it offers, and price.
author: whhender
ms.service: azure-synapse-analytics
ms.topic: overview
ms.subservice: synapse-link
ms.date: 11/18/2024
ms.author: whhender
ms.reviewer: whhender
---

# What is Azure Synapse Link for SQL?

Azure Synapse Link for SQL enables near real time analytics over operational data in Azure SQL Database or SQL Server 2022. With a seamless integration between operational stores including Azure SQL Database and SQL Server 2022 and Azure Synapse Analytics, Azure Synapse Link for SQL enables you to run analytics, business intelligence and machine learning scenarios on your operational data with minimum impact on source databases with a new change feed technology.

The following image shows the Azure Synapse Link integration with Azure SQL DB, SQL Server 2022, and Azure Synapse Analytics:

:::image type="content" source="../media/sql-synapse-link-overview/synapse-link-sql-architecture.png" alt-text="Diagram of the Azure Synapse Link for SQL architecture.":::

Azure Synapse Link for SQL provides fully managed and turnkey experience for you to land operational data in Azure Synapse Analytics dedicated SQL pools. It does this by continuously replicating the data from Azure SQL Database or SQL Server 2022 with full consistency. By using Azure Synapse Link for SQL, you can get the following benefits:

* **Minimum impact on operational workload**
With the new change feed technology in Azure SQL Database and SQL Server 2022, Azure Synapse Link for SQL can automatically extract incremental changes from Azure SQL Database or SQL Server 2022. It then replicates to Azure Synapse Analytics dedicated SQL pool with minimal impact on the operational workload.

* **Reduced complexity with No ETL jobs to manage**
After selecting your operational database and tables, updates made to the operational data in Azure SQL Database or SQL Server 2022 are visible in the Azure Synapse Analytics dedicated SQL pool. They're available in near real-time with no ETL or data integration logic. You can focus on analytical and reporting logic against operational data via all the capabilities within Azure Synapse Analytics.

* **Near real-time insights into your operational data**
You can now get rich insights by analyzing operational data in Azure SQL Database or SQL Server 2022 in near real-time to enable new business scenarios including operational BI reporting, real time scoring and personalization, or supply chain forecasting etc. via Azure Synapse Link for SQL.

## Related content

* [Azure Synapse Link for Azure SQL Database](sql-database-synapse-link.md) and how to [configure Azure Synapse Link for Azure SQL Database](connect-synapse-link-sql-database.md).
* [Azure Synapse Link for SQL Server 2022](sql-server-2022-synapse-link.md) and how to [configure Azure Synapse Link for SQL Server 2022](connect-synapse-link-sql-server-2022.md).

