---
title: Get right-sized Azure recommendation for your on-premises SQL Server database(s) (Preview)
description: Learn how to use the Azure SQL migration extension in Azure Data Studio to get SKU recommendation to migrate SQL Server database(s) to the right-sized Azure SQL Managed Instance, SQL Server on Azure Virtual Machines or, Azure SQL Database.
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

# Get right-sized Azure recommendation for your on-premises SQL Server database(s) (Preview)

The [Azure SQL migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension) provides a unified experience to assess, get right-sized SKU recommendations and migrate your SQL Server database(s) to Azure.

Before migrating your SQL Server databases to Azure, it is important to assess them to identify any migration issues (if any) so you can remediate them and confidently migrate them to Azure. Moreover, it is equally important to identify the right-sized configuration in Azure to ensure your database workload performance requirements are met with minimal cost.

The Azure SQL migration extension for Azure Data Studio provides both the assessment and SKU recommendation (right-sized Azure recommended configuration) capabilities when you are trying to select the best option to migrate your SQL Server database(s) to Azure SQL Managed Instance, SQL Server on Azure Virtual Machines or, Azure SQL Database (Preview). The extension provides a user friendly interface to run the assessment and generate recommendations within a short timeframe.

> [!NOTE]
> Assessment and Azure recommendation feature in the Azure SQL migration extension for Azure Data Studio also supports source SQL Server running on Linux.

## Performance data collection and SKU recommendation

With the Azure SQL migration extension, you can get a right-sized Azure recommendation to migrate your SQL Server databases to Azure SQL Managed Instance, SQL Server on Azure Virtual Machines or, Azure SQL Database (Preview). The extension collects and analyzes performance data from your SQL Server instance to generate a recommended SKU each for Azure SQL Managed Instance, SQL Server on Azure Virtual Machines or Azure SQL Database (Preview) that meets your database(s)' performance characteristics with the lowest cost.

The workflow for data collection and SKU recommendation is illustrated below.

:::image type="content" source="media/ads-sku-recommend/ads-sql-sku-recommend.png" alt-text="Diagram of SKU recommendation process":::

1. **Performance data collection**: To start the performance data collection process in the migration wizard, select **Get Azure recommendation** and choose the option to collect performance data as shown below. Provide the folder where the collected data will be saved and select **Start**.
    :::image type="content" source="media/ads-sku-recommend/collect-performance-data.png" alt-text="Collect performance data for SKU recommendation":::
    
    When you start the data collection process in the migration wizard, the Azure SQL migration extension for Azure Data Studio collects data from your SQL Server instance that includes information about the hardware configuration and aggregated SQL Server specific performance data from system Dynamic Management Views (DMVs) such as CPU utilization, memory utilization, storage size, IO, throughput and IO latency.
    > [!IMPORTANT]
    > - The data collection process runs for 10 minutes to generate the first recommendation. It is important to start the data collection process when your database workload reflects usage close to your production scenarios.</br>
    > - After the first recommendation is generated, you can continue to run the data collection process to refine recommendations especially if your usage patterns vary for an extended duration of time.

1. **Save generated data files locally**: The performance data is periodically aggregated and written to your local filesystem (in the folder that you selected while starting data collection in the migration wizard). Typically, you will see a set of CSV files with the following suffixes in the folder you selected:
    - **_CommonDbLevel_Counters.csv** : This file contains static configuration data about the database file layout and metadata. 
    - **_CommonInstanceLevel_Counters.csv** : This file contains static data about the hardware configuration of the server instance.
    - **_PerformanceAggregated_Counters.csv** : This file contains aggregated performance data that is updated frequently.
1. **Analyze and recommend SKU**: The SKU recommender analyzes the captured common and performance data to recommend the minimum configuration with the least cost that will meet your database's performance requirements. You can also view details about the reason behind the recommendation and source properties that were analyzed. *For SQL Server on Azure Virtual Machines, the SKU recommender also recommends the desired storage configuration for data files, log files and tempdb.*</br> The SKU recommender provides optional parameters that can be modified to refine recommendations based on your inputs about the production workload.
    - **Scale factor**: Scale ('comfort') factor used to inflate or deflate SKU recommendation based on your understanding of the production workload. For example, if it is determined that there is a 4 vCore CPU requirement with a scale factor of 150%, then the true CPU requirement will be 6 vCores. (Default value: 100)
    - **Percentage utilization**: Percentile of data points to be used during aggregation of the performance data. (Default: 95th Percentile)
    - **Enable preview features**: Enabling this option will include the latest hardware generations that have significantly improved performance and scalability. These SKUs are currently in Preview and may not yet be available in all regions. (Default value: Yes)


    > [!IMPORTANT]
    > The data collection process will terminate if you close Azure Data Studio. However, the data that was collected until that point will be saved in your folder.</br>
    >If you close Azure Data Studio while the data collection is in progress, you can either 
    > - return to import the data files that are saved in your local folder to generate a recommendation from the collected data; Or
    > - return to start the data collection again from the migration wizard;

### Import existing performance data
Any existing Performance data that you collected previously using the Azure SQL migration extension or [using the console application in Data Migration Assistant](/sql/dma/dma-sku-recommend-sql-db) can be imported in the migration wizard to view the recommendation.</br>
Simply provide the folder location where the performance data files are saved and select **Start** to instantly view the recommendation and its details.</br>
    :::image type="content" source="media/ads-sku-recommend/import-sku-data.png" alt-text="Import performance data for SKU recommendation":::
## Prerequisites

The following prerequisites are required to get Azure recommendation:
* [Download and install Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio)
* [Install the Azure SQL migration extension](/sql/azure-data-studio/extensions/azure-sql-migration-extension) from the Azure Data Studio marketplace
* Ensure that the logins used to connect the source SQL Server are members of the *sysadmin* server role or have `CONTROL SERVER` permission. 

## Next steps

- For an overview of the architecture to migrate databases, see [Migrate databases with Azure SQL migration extension for Azure Data Studio](migration-using-azure-data-studio.md).