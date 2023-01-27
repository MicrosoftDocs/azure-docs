---
title: Ingest data into a dedicated SQL pool 
description: Learn how to ingest data into a dedicated SQL pool in Azure Synapse Analytics
services: synapse-analytics 
author: kromerm
ms.author: makromer
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: pipeline
ms.date: 02/15/2022
ms.reviewer: sngun
---

# Ingest data into a dedicated SQL pool

In this article, you'll learn how to ingest data from an Azure Data Lake Gen 2 storage account into a dedicated SQL pool in Azure Synapse Analytics.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
- **Azure storage account**: You use Azure Data Lake Storage Gen 2 as a *source* data store. If you don't have a storage account, see [Create an Azure Storage account](../../storage/common/storage-account-create.md) for steps to create one.
- **Azure Synapse Analytics**: You use a dedicated SQL pool as a *sink* data store. 
    - If you don't have an existing Synapse workspace, see [Creating a Synapse workspace](../get-started-create-workspace.md)
    - If you don't have an existing dedicated SQL pool. see [Create a dedicated SQL pool](../get-started-analyze-sql-pool.md#create-a-dedicated-sql-pool).

## Create linked services

In Azure Synapse Analytics, a linked service is where you define your connection information to other services. In this section, you'll add an Azure Synapse Analytics and Azure Data Lake Storage Gen2 linked service.

1. Open the Azure Synapse Analytics UX and go to the **Manage** tab.
1. Under **External connections**, select **Linked services**.
1. To add a linked service, select **New**.
1. Select the Azure Data Lake Storage Gen2 tile from the list and select **Continue**.
1. Enter your authentication credentials. Account key, service principal, and managed identity are currently supported authentication types. Select test connection to verify your credentials are correct. Select **Create** when finished.
1. Repeat steps 3-5, but instead of Azure Data Lake Storage Gen2, select the Azure Synapse Analytics tile and enter in the corresponding connection credentials. For Azure Synapse Analytics, SQL authentication, managed identity, and service principal are currently supported.

## Create pipeline

A pipeline contains the logical flow for an execution of a set of activities. In this section, you'll create a pipeline containing a copy activity that ingests data from ADLS Gen2 into a dedicated SQL pool.

1. Go to the **Integrate** tab. Select on the plus icon 
next to the pipelines header and select **Pipeline**.
1. Under **Move and Transform** in the activities pane, drag **Copy data** onto the pipeline canvas.
1. Select on the copy activity and go to the **Source** tab. Select **New** to create a new source dataset.
1. Select Azure Data Lake Storage gen2 as your data store and select continue.
1. Select DelimitedText as your format and select continue.
1. In the set properties pane, select the ADLS linked service you created. Specify the file path of your source data and specify whether the first row has a header. You can import the schema from the file store or a sample file. Select OK when finished.
1. Go to the **Sink** tab. Select **New** to create a new sink dataset.
1. Select Azure Synapse Analytics as your data store and select continue.
1. In the set properties pane, select the Azure Synapse Analytics linked service you created. If you're writing to an existing table, select it from the dropdown. Otherwise, check **Edit** and enter in your new table name. Select OK when finished
1. If you're creating a table, enable **Auto create table** in the table option field.

## Debug and publish pipeline

Once you've finished configuring your pipeline, you can execute a debug run before you publish your artifacts to verify everything is correct.

1. To debug the pipeline, select **Debug** on the toolbar. You see the status of the pipeline run in the **Output** tab at the bottom of the window. 
1. Once the pipeline can run successfully, in the top toolbar, select **Publish All**. This action publishes entities (datasets, and pipelines) you created to the Synapse Analytics service.
1. Wait until you see the **Successfully published** message. To see notification messages, select the bell button on the top-right. 


## Trigger and monitor the pipeline

In this step, you manually trigger the pipeline published in the previous step. 

1. Select **Add Trigger** on the toolbar, and then select **Trigger Now**. On the **Pipeline Run** page, select **Finish**.  
1. Go to the **Monitor** tab located in the left sidebar. You see a pipeline run that is triggered by a manual trigger. You can use links in the **Actions** column to view activity details and to rerun the pipeline.
1. To see activity runs associated with the pipeline run, select the **View Activity Runs** link in the **Actions** column. In this example, there's only one activity, so you see only one entry in the list. For details about the copy operation, select the **Details** link (eyeglasses icon) in the **Actions** column. Select **Pipeline Runs** at the top to go back to the Pipeline Runs view. To refresh the view, select **Refresh**.
1. Verify your data is correctly written in the dedicated SQL pool.


## Next steps

For more information on data integration for Azure Synapse Analytics, see the [Ingesting data into Azure Data Lake Storage Gen2 ](data-integration-data-lake.md) article.