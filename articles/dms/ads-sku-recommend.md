---
title: Get Azure recommendations for your SQL Server migration
description: Learn how to use the Azure SQL Migration extension in Azure Data Studio to get SKU recommendation when you migrate SQL Server databases to the Azure SQL Managed Instance, SQL Server on Azure Virtual Machines, or Azure SQL Database.
author: croblesm
ms.author: roblescarlos
ms.date: 02/22/2022
ms.service: dms
ms.topic: conceptual
ms.custom: references_regions
---

# Get Azure recommendations to migrate your SQL Server database

Learn how to use the unified experience in the [Azure SQL Migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension) to assess your database requirements, get right-sized SKU recommendations for Azure resources, and migrate your SQL Server databases to Azure.

Before you migrate your SQL Server databases to Azure, it's important to assess the databases to identify any potential migration issues. You can remediate anticipated issues, and then confidently migrate your databases to Azure.

It's equally important to identify the right-sized Azure resource to migrate to so that your database workload performance requirements are met with minimal cost.

The Azure SQL Migration extension for Azure Data Studio provides both the assessment and SKU recommendations when you're trying to choose the best option to migrate your SQL Server databases to Azure SQL Managed Instance, SQL Server on Azure Virtual Machines, or Azure SQL Database. The extension has an intuitive interface to help you efficiently run the assessment and generate recommendations.

> [!NOTE]
> Assessment and the Azure recommendation feature in the Azure SQL Migration extension for Azure Data Studio supports source SQL Server instances running on Windows or Linux.

## Prerequisites

To get an Azure recommendation for your SQL Server database migration, you must meet the following prerequisites:

- [Download and install Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).
- [Install the Azure SQL Migration extension](/sql/azure-data-studio/extensions/azure-sql-migration-extension) from Azure Data Studio Marketplace.
- Ensure that the logins that you use to connect the source SQL Server instance are members of the SYSADMIN server role or have CONTROL SERVER permissions.

## Performance data collection and SKU recommendation

The Azure SQL Migration extension first collects performance data from your SQL Server instance. Then, it analyzes the data to generate a recommended SKU for Azure SQL Managed Instance, SQL Server on Azure Virtual Machines, or Azure SQL Database. The SKU recommendation is designed to meet your database performance requirements at the lowest cost in the Azure service.

The following diagram shows the workflow for data collection and SKU recommendations:

:::image type="content" source="media/ads-sku-recommend/ads-sql-sku-recommend.png" border="false" alt-text="Diagram that shows the workflow of the SKU recommendation process.":::

The following list describes each step in the workflow:

(1) **Performance data collection**: To start the performance data collection process in the migration wizard, select **Get Azure recommendation** and choose the option to collect performance data. Enter the folder path where the collected data will be saved, and then select **Start**.

:::image type="content" source="media/ads-sku-recommend/collect-performance-data.png" alt-text="Screenshot that shows the wizard pane to collect performance data for SKU recommendations.":::
  
When you start the data collection process in the migration wizard, the Azure SQL Migration extension for Azure Data Studio collects data from your SQL Server instance. The data collection includes hardware configuration and aggregated SQL Server-specific performance data from system Dynamic Management Views like CPU utilization, memory utilization, storage size, input/output (I/O), throughput, and I/O latency.

> [!IMPORTANT]
>
> - The data collection process runs for 10 minutes to generate the first recommendation. It's important to start the data collection process when your active database workload reflects usage that's similar to your production scenarios.
> - After the first recommendation is generated, you can continue to run the data collection process to refine recommendations. This option is especially useful if your usage patterns vary over time.

(2) **Save generated data files locally**: The performance data is periodically aggregated and written to the local folder that you selected in the migration wizard. You typically see a set of CSV files with the following suffixes in the folder:

- **_CommonDbLevel_Counters.csv** : Contains static configuration data about the database file layout and metadata.
- **_CommonInstanceLevel_Counters.csv** : Contains static data about the hardware configuration of the server instance.
- **_PerformanceAggregated_Counters.csv** : Contains aggregated performance data that's updated frequently.

(3) **Analyze and recommend SKU**: The SKU recommendation process analyzes the captured common and performance data to recommend the minimum configuration with the least cost that will meet your database's performance requirements. You can also view details about the reason behind the recommendation and the source properties that were analyzed. *For SQL Server on Azure Virtual Machines, the process also includes a recommendation for storage configuration for data files, log files, and tempdb.*

You can use optional parameters as inputs about the production workload to refine recommendations:

- **Scale factor**: Scale (*comfort*) factor is used to inflate or deflate a SKU recommendation based on your understanding of the production workload. For example, if you determine that a four-vCore CPU requirement has a scale factor of 150%, the true CPU requirement is six vCores. The default scale factor volume is 100%.
- **Percentage utilization**: The percentile of data points to be used as performance data is aggregated. The default value is the 95th percentile.
- **Enable preview features**: Enabling this option includes the latest hardware generations that have improved performance and scalability. Currently, these SKUs are in preview, and they might not be available yet in all regions. This option is enabled by default.

> [!IMPORTANT]
> The data collection process terminates if you close Azure Data Studio. The data that was collected up to that point is saved in your folder.
>
> If you close Azure Data Studio while data collection is in progress, use one of the following options to restart data collection:
>
> - Reopen Azure Data Studio and import the data files that are saved in your local folder. Then, generate a recommendation from the collected data.
> - Reopen Azure Data Studio and start data collection again by using the migration wizard.

### Import existing performance data

You can import any existing performance data that you collected earlier by using the Azure SQL Migration extension or by using the [console application in Data Migration Assistant](/sql/dma/dma-sku-recommend-sql-db).

In the migration wizard, enter the folder path where the performance data files are saved. Then, select **Start** to view the recommendation and related details.

:::image type="content" source="media/ads-sku-recommend/import-sku-data.png" alt-text="Screenshot that shows the pane to import performance data for a SKU recommendation.":::

## Next steps

- Learn how to [migrate databases by using the Azure SQL Migration extension in Azure Data Studio](migration-using-azure-data-studio.md).
