---
title: 'Use Azure Data Factory template for bulk copy from database to Azure Data Explorer'
description: 'In this topic, you learn to use an Azure Data Factory template for bulk copy from database to Azure Data Explorer'
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 09/08/2019

#Customer intent: I want to use Azure Data Factory template for bulk copy from database to Azure Data Explorer.
---

# Use Azure Data Factory template for bulk copy from database to Azure Data Explorer

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from many sources such as applications, websites, and IoT devices. Azure Data Factory is a fully managed cloud-based data integration service. You can use the Azure Data Factory service to populate your Azure Data Explorer database with data from your existing system and save time when building your analytics solutions. 

[Azure Data Factory Templates](/azure/data-factory/solution-templates-introduction) are predefined Azure Data Factory pipelines that allow you to get started quickly with Data Factory and reduce development time for building data integration projects. 
The **Bulk copy from database to Azure Data Explorer** template is created using **Lookup** and **ForEach** activities. You can use the template to create many pipelines per database or table for faster copying of data. 

> [!IMPORTANT]
> * Use the **Bulk copy from database to Azure Data Explorer** template to copy large amounts of data from databases such as SQL server and Google BigQuery to Azure Data Explorer. 
> * Use the [copy tool](data-factory-load-data.md) to copy a few tables with small or moderate amounts of data into Azure Data Explorer. 

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* [An Azure Data Explorer cluster and database](create-cluster-database-portal.md)
* [Create a data factory](data-factory-load-data.md#create-a-data-factory)
* Source of data in database

## Create ControlTableDataset

The **ControlTableDataset** indicates what data will be copied from source to destination in the pipeline. The number of rows indicate the total number of pipelines needed to copy the data. The **ControlTableDataset** should be defined as part of the source database.

Example of SQL Server source table format:
    
```sql   
CREATE TABLE control_table (
PartitionId int,
SourceQuery varchar(255),
ADXTableName varchar(255)
);
```
    
|Property  |Description  | Example
|---------|---------| ---------|
|PartitionId   |   copy order | 1  |  
|SourceQuery   |   query that indicates which data will be copied during the pipeline runtime | <br>`select * from table where lastmodifiedtime  LastModifytime >= ''2015-01-01 00:00:00''>` </br>    
|ADXTableName  |  destination table name | MyAdxTable       |  

If your **ControlTableDataset** is in a different format, create a comparable **ControlTableDataset** for your format.

## Use bulk copy from database to Azure Data Explorer template

1. In the **Let's get started** page, select the **Create pipeline from template** tile, or select the pencil icon (**Author** tab) on the right > **+** > **Pipeline from template** to open the template gallery.

    ![Azure Data Factory let's get started](media/data-factory-template/adf-get-started.png)

1. Select template **Bulk Copy from Database to Azure Data Explorer**.
 
    ![Select pipeline from template](media/data-factory-template/pipeline-from-template.png)

1.  In the **Bulk Copy from Database to Azure Data Explorer** window, select existing datasets from drop-down. 

    * **ControlTableDataset** - linked service to control table that indicates what data is copied from source to destination and where it will be placed in the destination. 
    * **SourceDataset** – Linked service to source database. 
    * **AzureDataExplorerTable** - Azure Data Explorer Table. If the dataset doesn't exist, [create the Azure Data Explorer linked service](data-factory-load-data.md#create-the-azure-data-explorer-linked-service) to add the dataset.
    * Select **Use this template**.

    ![configure bulk copy Azure Data Explorer template](media/data-factory-template/configure-bulk-copy-adx-template.png)

1. Select an area in the canvas, outside the activities, to access the template pipeline. Select **Parameters** to enter the parameters for the table including **Name** (control table name) and **Default value** (column names).

    ![Pipeline parameters](media/data-factory-template/pipeline-parameters.png)

1.	Select Lookup activity, **GetPartitionList**, to view default settings. The query is automatically created.
1.	Select Command activity **ForEachPartition**, select **Settings**
    * **Batch count**: Select number from 1-50. This selection determines the number of pipelines that run in parallel until the **ControlTableDataset** number of rows is reached. 
    * DO NOT select the **Sequential** checkbox so the pipeline batches run in parallel.

    ![ForEachPartition settings](media/data-factory-template/foreach-partition-settings.png)

    > [!TIP]
    > Best practice is to run many pipelines in parallel so data can be copied more quickly. Partition the data in the source table and allocate a partition per pipeline, according to date and table, to increase efficiency.

1. Select **Validate All** to validate the ADF pipeline. See **Pipeline Validation Output**.

    ![Validate template pipelines](media/data-factory-template/validate-template-pipelines.png)

1. Select **Debug**, if needed, and then **Add trigger** to run the pipeline.

    ![Run pipeline](media/data-factory-template/trigger-run-of-pipeline.png)    


You can now use the **bulk copy from database to Azure Data Explorer** template to efficiently copy large amounts of data from your databases and tables.

## Next steps

* Learn about the procedure to [copy data to Azure Data Explorer using Azure Data Factory](data-factory-load-data.md).

* Learn about the [Azure Data Explorer connector](/azure/data-factory/connector-azure-data-explorer) in Azure Data Factory.

* Learn about [Azure Data Explorer queries](/azure/data-explorer/web-query-data) for data querying.






