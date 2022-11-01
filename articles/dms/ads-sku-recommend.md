---
title: Get SKU recommendation in SQL Server database migration
description: Learn how to use the Azure SQL Migration extension in Azure Data Studio to get SKU recommendation to migrate SQL Server database(s) to the right-sized Azure SQL Managed Instance, SQL Server on Azure Virtual Machines, or Azure SQL Database.
services: database-migration
author: croblesm
ms.author: roblescarlos
manager: 
ms.reviewer: 
ms.service: dms
ms.workload: data-services
ms.topic: conceptual
ms.date: 02/22/2022
ms.custom: references_regions
---

# Get right-sized Azure recommendation for your on-premises SQL Server database (preview)

Learn how to use the unified experience in the [Azure SQL Migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension) to assess your database requirements, get right-sized SKU recommendations for Azure resources, and migrate your SQL Server databases to Azure.

Before you migrate your SQL Server databases to Azure, it's important to assess the databases to identify any migration issues. Then, you can remediate any issues and confidently migrate your databases to Azure. It's equally important to identify the right-sized configuration in Azure to ensure that your database workload performance requirements are met with minimal cost.

The Azure SQL Migration extension for Azure Data Studio provides both the assessment and SKU recommendation when you're trying to select the best option to migrate your SQL Server databases to Azure SQL Managed Instance, SQL Server on Azure Virtual Machines, or Azure SQL Database (Preview). The extension provides a user-friendly interface where you can run the assessment and generate recommendations in a short time frame.

> [!NOTE]
> Assessment and the Azure recommendation feature in the Azure SQL Migration extension for Azure Data Studio supports source SQL Server instances running on Linux.

## Performance data collection and SKU recommendation

With the Azure SQL Migration extension, you can get a right-sized Azure recommendation to migrate your SQL Server databases to Azure SQL Managed Instance, SQL Server on Azure Virtual Machines or, Azure SQL Database (Preview). The extension collects and analyzes performance data from your SQL Server instance to generate a recommended SKU each for Azure SQL Managed Instance, SQL Server on Azure Virtual Machines, or Azure SQL Database (Preview) that meets your database performance characteristics with the lowest cost.

The following diagram shows the workflow for data collection and SKU recommendations:

:::image type="content" source="media/ads-sku-recommend/ads-sql-sku-recommend.png" border="false" alt-text="Diagram that shows the workflow of the SKU recommendation process.":::

1. **Performance data collection**: To start the performance data collection process in the migration wizard, select **Get Azure recommendation** and choose the option to collect performance data as shown below. Provide the folder where the collected data will be saved and select **Start**.

    :::image type="content" source="media/ads-sku-recommend/collect-performance-data.png" alt-text="Collect performance data for SKU recommendation":::
  
    When you start the data collection process in the migration wizard, the Azure SQL Migration extension for Azure Data Studio collects data from your SQL Server instance. The data collection includes hardware configuration and aggregated SQL Server-specific performance data from system Dynamic Management Views like CPU utilization, memory utilization, storage size, input/output (I/O), throughput, and I/O latency.

    > [!IMPORTANT]
    >
    > - The data collection process runs for 10 minutes to generate the first recommendation. It's important to start the data collection process when your active database workload reflects usage that's similar to your production scenarios.
    > - After the first recommendation is generated, you can continue to run the data collection process to refine recommendations especially if your usage patterns vary for an extended duration.

1. **Save generated data files locally**: The performance data is periodically aggregated and written to your local file system (in the folder that you selected when you began data collection in the migration wizard). Usually, you'll see a set of CSV files with the following suffixes in the folder you selected:

    - **_CommonDbLevel_Counters.csv** : This file contains static configuration data about the database file layout and metadata. 
    - **_CommonInstanceLevel_Counters.csv** : This file contains static data about the hardware configuration of the server instance.
    - **_PerformanceAggregated_Counters.csv** : This file contains aggregated performance data that is updated frequently.

1. **Analyze and recommend SKU**: The SKU recommender analyzes the captured common and performance data to recommend the minimum configuration with the least cost that will meet your database's performance requirements. You can also view details about the reason behind the recommendation and source properties that were analyzed. *For SQL Server on Azure Virtual Machines, the SKU recommender also recommends the desired storage configuration for data files, log files and tempdb.*

   You can use optional parameters to refine recommendations based on your inputs about the production workload:

    - **Scale factor**: Scale (*comfort*) factor is used to inflate or deflate a SKU recommendation based on your understanding of the production workload. For example, if you determine that a 4-vCore CPU requirement has a scale factor of 150%, the true CPU requirement will be 6 vCores. The default scale factor volume is 100%.
    - **Percentage utilization**: Percentile of data points to be used performance data is aggregated. The default value is the 95th percentile.
    - **Enable preview features**: Enabling this option includes the latest hardware generations that have improved performance and scalability. Currently, these SKUs are in preview, and they might not be available yet in all regions. This option is enabled by default.

    > [!IMPORTANT]
    > The data collection process terminates if you close Azure Data Studio. The data that was collected up to that point is saved in your folder.
    >
    > If you close Azure Data Studio while data collection is in progress, you can use one of the following options:
    >
    > - Reopen Azure Data Studio and import the data files that are saved in your local folder. Then, generate a recommendation from the collected data.
    > - Reopen Azure Data Studio to start the data collection again by using the migration wizard.

### Import existing performance data

You can import any existing performance data that you collected earlier by using the Azure SQL Migration extension or by using the [console application in Data Migration Assistant](/sql/dma/dma-sku-recommend-sql-db).

In the migration wizard, provide the folder location where the performance data files are saved. Then, select **Start** to view the recommendation and related details.

:::image type="content" source="media/ads-sku-recommend/import-sku-data.png" alt-text="Screenshot that shows the pane to import performance data for a SKU recommendation.":::

## Prerequisites

You must meet the following prerequisites to get an Azure recommendation:

- [Download and install Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).
- [Install the Azure SQL Migration extension](/sql/azure-data-studio/extensions/azure-sql-migration-extension) from Azure Data Studio Marketplace.
- Ensure that the logins that you use to connect the source SQL Server instance are members of the SYSADMIN server role or have CONTROL SERVER permissions.

## Next steps

- Learn how to [migrate databases by using the Azure SQL Migration extension in Azure Data Studio](migration-using-azure-data-studio.md).
