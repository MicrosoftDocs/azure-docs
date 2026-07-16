---
title: Capture Event Hubs Data to Parquet in Azure Data Lake Storage Gen2
description: Shows you how to use the Stream Analytics no code editor to create a job that captures Event Hubs data in to Azure Data Lake Storage Gen2 in the parquet format.
author: xujxu
ms.author: xujiang1
ms.reviewer: spelluru
ms.service: azure-stream-analytics
ms.topic: tutorial
ms.date: 03/25/2026
ms.custom: sfi-image-nochange
---

# Tutorial: Capture Event Hubs data in Parquet format and analyze with Azure Synapse Analytics
Azure Event Hubs generates large volumes of streaming data that you often need to store for analysis. This tutorial shows you how to capture that data in Parquet format - a columnar storage format optimized for analytics workloads - by using Azure Stream Analytics without writing any code.

Use the Stream Analytics no code editor to build a job that streams data from Event Hubs directly to Azure Data Lake Storage Gen2. Then, query the captured Parquet files by using Azure Synapse Analytics with both Spark and serverless SQL.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy an event generator that sends sample events to an event hub
> * Create a Stream Analytics job by using the no code editor
> * Review input data and schema
> * Configure Azure Data Lake Storage Gen2 to which event hub data is captured
> * Run the Stream Analytics job
> * Use Azure Synapse Analytics to query the Parquet files

## Prerequisites

Before you start, make sure you complete the following steps:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
* [Deploy the TollApp event generator app to Azure](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-stream-analytics%2Fmaster%2FSamples%2FTollApp%2FVSProjects%2FTollAppDeployment%2Fazuredeploy.json). Set the `interval` parameter to 1, and use a new resource group for this step.
* Create an [Azure Synapse Analytics workspace](../synapse-analytics/get-started-create-workspace.md) with a Data Lake Storage Gen2 account.

## Use no code editor to create a Stream Analytics job
1. Locate the resource group where you deployed the TollApp event generator. 
1. Select the Azure Event Hubs **namespace**. You might want to open it in a separate tab or a window.

    :::image type="content" source="./media/event-hubs-parquet-capture-tutorial/resource-group.png" alt-text="Screenshot showing the selection of the Event Hubs namespace in the resource group." lightbox="./media/event-hubs-parquet-capture-tutorial/resource-group.png":::
1. On the **Event Hubs namespace** page, select **Event Hubs** under **Entities** in the left menu. 
1. Select `entrystream` instance.

    :::image type="content" source="./media/stream-analytics-no-code/select-event-hub.png" alt-text="Screenshot showing the selection of the event hub." lightbox="./media/stream-analytics-no-code/select-event-hub.png":::
1. On the **Event Hubs instance** page, select **Process data** in the **Features** section of the left menu. 
1. Select **Start** on the **Capture data to ADLS Gen2 in Parquet format** tile.

    :::image type="content" source="./media/stream-analytics-no-code/parquet-capture-start.png" alt-text="Screenshot showing the selection of the **Capture data to ADLS Gen2 in Parquet format** tile." lightbox="./media/stream-analytics-no-code/parquet-capture-start.png":::
1. Name your job `parquetcapture` and select **Create**.

    :::image type="content" source="./media/stream-analytics-no-code/new-stream-analytics-job.png" alt-text="Screenshot of the New Stream Analytics job page." lightbox="./media/stream-analytics-no-code/new-stream-analytics-job.png":::    
1. On the **event hub** configuration page, follow these steps: 
    1. For **Consumer group**, select **Use existing**. 
    1. Confirm that the `$Default` consumer group is selected. 
    1. Confirm that **Serialization** is set to JSON.
    1. Confirm that **Authentication method** is set to **Connection String**. To keep the tutorial simple, you use the connection string authentication. In production scenarios, we recommend using [Azure Managed Identity](stream-analytics-user-assigned-managed-identity-overview.md) for better security and easier management. For more information, see [Use managed identities to access Event Hubs  from an Azure Stream Analytics job](event-hubs-managed-identity.md).
    1. Confirm that **Event hub shared access key name** is set to **RootManageSharedAccessKey**.  
    1. Select **Connect** at the bottom of the window.

        :::image type="content" source="./media/event-hubs-parquet-capture-tutorial/event-hub-configuration.png" alt-text="Screenshot of the configuration page for your event hub." lightbox="./media/event-hubs-parquet-capture-tutorial/event-hub-configuration.png":::
1. Within a few seconds, you see sample input data and the schema. You can choose to drop fields, rename fields, or change data type.

    :::image type="content" source="./media/event-hubs-parquet-capture-tutorial/data-preview.png" alt-text="Screenshot showing the fields and preview of data." lightbox="./media/event-hubs-parquet-capture-tutorial/data-preview.png":::
1. Select the **Azure Data Lake Storage Gen2** tile on your canvas and configure it by specifying
    * Subscription where your Azure Data Lake Gen2 account is located
    * Storage account name, which should be the same Azure Data Lake Storage Gen2 account used with your Azure Synapse Analytics workspace done in the Prerequisites section.
    * Container where the Parquet files are created. 
    * For **Delta table path**, specify a name for the table. 
    * Date and time pattern as the default `yyyy-MM-dd` and `HH`.
    * Select **Connect**

        :::image type="content" source="./media/event-hubs-parquet-capture-tutorial/data-lake-storage-settings.png" alt-text="Screenshot showing the configuration settings for the Data Lake Storage." lightbox="./media/event-hubs-parquet-capture-tutorial/data-lake-storage-settings.png":::    
1. Select **Save** in the top ribbon to save your job, and then select **Start** to run your job. Once the job starts, select X in the right corner to close the **Stream Analytics job** page.

    :::image type="content" source="./media/event-hubs-parquet-capture-tutorial/start-job.png" alt-text="Screenshot showing the Start Stream Analytics Job page." lightbox="./media/event-hubs-parquet-capture-tutorial/start-job.png":::
1. You see a list of all Stream Analytics jobs created using the no code editor. Within two minutes, your job goes to a **Running** state. Select the **Refresh** button on the page to see the status change from Created -> Starting -> Running.

    :::image type="content" source="./media/event-hubs-parquet-capture-tutorial/job-list.png" alt-text="Screenshot showing the list of Stream Analytics jobs." lightbox="./media/event-hubs-parquet-capture-tutorial/job-list.png":::

## View output in your Azure Data Lake Storage Gen 2 account
1. Locate the Azure Data Lake Storage Gen2 account you used in the previous step.
1. Select **Containers** under the **Data storage** section in the left menu.

    :::image type="content" source="./media/stream-analytics-no-code/select-container.png" alt-text="Screenshot showing the selection of the container in Azure Data Lake Storage Gen 2." lightbox="./media/stream-analytics-no-code/select-container.png":::
1. Select the container you used in the previous step. You see parquet files created in the folder you specified earlier.

    :::image type="content" source="./media/stream-analytics-no-code/capture-parquet-files.png" alt-text="Screenshot showing the captured parquet files in Azure Data Lake Storage Gen 2." lightbox="./media/stream-analytics-no-code/capture-parquet-files.png":::

## Query captured data in Parquet format with Azure Synapse Analytics
### Query using Azure Synapse Spark
1. Locate your Azure Synapse Analytics workspace and open Synapse Studio.
1. [Create a serverless Apache Spark pool](../synapse-analytics/get-started-analyze-spark.md#create-a-serverless-apache-spark-pool) in your workspace if one doesn't already exist.
1. Select **Open Synapse Studio** tile in the **Getting started** section to launch the Synapse Studio in a new tab or window.
1. In the Synapse Studio, go to the **Develop** hub and create a new **Notebook**.

    :::image type="content" source="./media/stream-analytics-no-code/synapse-studio-develop-notebook.png" alt-text="Screenshot showing the Synapse Studio." :::
1. Create a new code cell and paste the following code in that cell. Replace *container* and *adlsname* with the name of the container and Azure Data Lake Storage Gen2 account used in the previous step. 
    ```py
    %%pyspark
    df = spark.read.load('abfss://container@adlsname.dfs.core.windows.net/*/*.parquet', format='parquet')
    display(df.limit(10))
    df.count()
    df.printSchema()
    ```
1. For **Attach to** on the toolbar, select your Spark pool from the dropdown list. 
1. Select **Run All** to see the results.

    :::image type="content" source="./media/event-hubs-parquet-capture-tutorial/spark-run-all.png" alt-text="Screenshot of spark run results in Azure Synapse Analytics." lightbox="./media/event-hubs-parquet-capture-tutorial/spark-run-all.png"::: 

### Query using Azure Synapse Serverless SQL
1. In the **Develop** hub,  create a new **SQL script**.

    :::image type="content" source="./media/event-hubs-parquet-capture-tutorial/develop-sql-script.png" alt-text="Screenshot showing the Develop page with new SQL script menu selected.":::
1. Paste the following script and **Run** it using the **Built-in** serverless SQL endpoint. Replace *container* and *adlsname* with the name of the container and Azure Data Lake Storage Gen2 account used in the previous step.    
    ```SQL
    SELECT
        TOP 100 *
    FROM
        OPENROWSET(
            BULK 'https://adlsname.dfs.core.windows.net/container/*/*.parquet',
            FORMAT='PARQUET'
        ) AS [result]
     ```

    :::image type="content" source="./media/event-hubs-parquet-capture-tutorial/sql-results.png" alt-text="Screenshot of SQL script results in Azure Synapse Analytics." lightbox="./media/event-hubs-parquet-capture-tutorial/sql-results.png"::: 

## Clean up resources
1. Locate your Event Hubs instance and see the list of Stream Analytics jobs under the **Process Data** section. Stop any jobs that are running.
1. Go to the resource group you used while deploying the TollApp event generator.
1. Select **Delete resource group**. To confirm deletion, type the name of the resource group.

## Next steps
In this tutorial, you learned how to create a Stream Analytics job by using the no code editor to capture Event Hubs data streams in Parquet format. You then used Azure Synapse Analytics to query the Parquet files by using both Synapse Spark and Synapse SQL.

> [!div class="nextstepaction"]
> [No code stream processing with Azure Stream Analytics](https://aka.ms/asanocodeux)
