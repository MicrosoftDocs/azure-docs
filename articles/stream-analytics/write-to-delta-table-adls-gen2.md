---
title: Write to a Delta Table in ADLS Gen2 (Azure Stream Analytics)
description: This article shows how to create an ASA job writing to a delta table stored in ADLS Gen2.
author: an-emma
ms.author: raan
ms.service: stream-analytics
ms.custom: ignite-2022
ms.topic: tutorial 
ms.date: 10/12/2022
---

# Tutorial: Write to a Delta Table stored in Azure Data Lake Storage Gen2 (Public Preview)

This tutorial shows how you can create a Stream Analytics job to write to a Delta table in Azure Data Lake Storage Gen2. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy an event generator that sends data to your event hub
> * Create a Stream Analytics job
> * Configure Azure Data Lake Storage Gen2 to which the Delta table will be stored in
> * Run the Stream Analytics job

## Prerequisites

Before you start, make sure you've completed the following steps:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).
* Deploy the TollApp event generator to Azure, use this link to [Deploy TollApp Azure Template](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-stream-analytics%2Fmaster%2FSamples%2FTollApp%2FVSProjects%2FTollAppDeployment%2Fazuredeploy.json). Set the 'interval' parameter to 1. And use a new resource group for this step.
* Create a [Data Lake Storage Gen2 account](../storage/blobs/create-data-lake-storage-account.md).

## Create a Stream Analytics job

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Create a resource** in the upper left-hand corner of the Azure portal.  
3. Select **Analytics** > **Stream Analytics job** from the results list.  
4. On the **New Stream Analytics job** page, follow these steps:
    1. For **Subscription**, select your Azure subscription.
    2. For **Resource group**, select the same resource that you used earlier in the TollApp deployment.
    3. For **Name**, enter a name for the job. Stream Analytics job name can contain alphanumeric characters, hyphens, and underscores only and it must be between 3 and 63 characters long.
    4. For **Hosting environment**, confirm that **Cloud** is selected.
    5. For **Stream units**, select **1**. Streaming units represent the computing resources that are required to execute a job. To learn about scaling streaming units, refer to [understanding and adjusting streaming units](stream-analytics-streaming-unit-consumption.md) article.
    6. Select **Review + create** at the bottom of the page.
  

5. On the **Review + create** page, review settings, and select **Create** to create a Stream Analytics page.
6. On the deployment page, select **Go to resource** to navigate to the **Stream Analytics job** page.

## Configure job input

The next step is to define an input source for the job to read data using the event hub created in the TollApp deployment.

1. Find the Stream Analytics job created in the previous section.

2. In the **Job Topology** section of the Stream Analytics job, select **Inputs**.

3. Select **+ Add stream input** and **Event hub**.

4. Fill out the input form with the following values created through [TollApp Azure Template](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-stream-analytics%2Fmaster%2FSamples%2FTollApp%2FVSProjects%2FTollAppDeployment%2Fazuredeploy.json):

    1. For **Input alias**, enter **entrystream**.
    2. Choose **Select Event Hub from your subscriptions**.
    3. For **Subscription**, select your Azure subscription.
    4. For **Event Hub namespace**, select the event hub namespace you created in the previous section.
    5. Use default options on the remaining settings and select **Save**.


## Configure job output

The next step is to define an output sink where the job can write data to. In this tutorial, you write output to a Delta table in Azure Data Lake Storage Gen2.

1. In the **Job Topology** section of the Stream Analytics job, select the **Outputs** option.

2. Select **+ Add** > **Blob storage/ADLS Gen2**.

3. Fill the output form with the following details and select **Save**:
    1. For **Output alias**, enter **DeltaOutput**.
    2. Choose **Select Blob storage/ADLS Gen2 from your subscriptions**.
    3. For **Subscription**, select your Azure subscription.
    4. For **Storage account**, choose the ADLS Gen2 account you created.
    5. For **container**, provide a unique container name.
    6. For **Event Serialization Format**, select **Delta Lake**. Although Delta lake is listed as one of the options here, it isn't a data format. Delta Lake uses versioned Parquet files to store your data. To learn more about [Delta lake](write-to-delta-lake.md).
    7. For **Delta table path**, enter **tutorial folder/delta table**.
    8. Use default options on the remaining settings and select **Save**.

  
## Create queries

At this point, you have a Stream Analytics job set up to read an incoming data stream. The next step is to create a query that analyzes the data in real time. The queries use a SQL-like language that has some extensions specific to Stream Analytics.

1. Now, select **Query** under **Job topology** on the left menu.
2. Enter the following query into the query window. In this example, the query reads the data from Event Hubs and copies selected values to a Delta table in ADLS Gen2.

   ```sql
    SELECT State, CarModel.Make, TollAmount
    INTO DeltaOutput
    FROM EntryStream TIMESTAMP BY EntryTime
   ```

3. Select **Save query** on the toolbar.

## Start the Stream Analytics job and check the output

1. Return to the job overview page in the Azure portal, and select **Start**.
2. On the **Start job** page, confirm that **Now** is selected for Job output start time, and then select **Start** at the bottom of the page.
3. After few minutes, in the portal, find the storage account & the container that you've configured as output for the job. You can now see the delta table in the folder specified in the container. The job takes a few minutes to start for the first time, after it's started, it will continue to run as the data arrives.

## Clean up resources

When no longer needed, delete the resource group, the Stream Analytics job, and all related resources. Deleting the job avoids billing the streaming units consumed by the job. If you're planning to use the job in future, you can stop it and restart it later when you need. If you aren't going to continue to use this job, delete all resources created by this tutorial by using the following steps:

1. From the left-hand menu in the Azure portal, select Resource groups and then select the name of the resource you created.
2. On your resource group page, select Delete, type the name of the resource to delete in the text box, and then select Delete.

## Next steps

In this tutorial, you created a simple Stream Analytics job, filtered the incoming data, and write results in a Delta table in ADLS Gen2 account. To learn more about Stream Analytics jobs:

> [!div class="nextstepaction"]
> [ASA writes to Delta Lake output](write-to-delta-lake.md)
