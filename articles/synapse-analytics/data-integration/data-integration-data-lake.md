---
title: Ingest into Azure Data Lake Storage Gen2
description: Learn how to ingest data into Azure Data Lake Storage Gen2 in Azure Synapse Analytics
services: synapse-analytics 
author: djpmsft
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: 
ms.date: 04/15/2020
ms.author: daperlov
ms.reviewer: jrasnick
---

# Ingesting data into Azure Data Lake Storage Gen2 

In this article, you'll learn how to ingest data from one location to another in an Azure Data Lake Gen 2 (Azure Data Lake Gen 2) storage account using Azure Synapse Analytics.

## Prerequisites

* **Azure subscription**: If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* **Azure Storage account**: You use Azure Data Lake Gen 2 as a *source* data store. If you don't have a storage account, see [Create an Azure Storage account](../../storage/blobs/data-lake-storage-quickstart-create-account.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) for steps to create one.

## Create linked services

In Azure Synapse Analytics, a linked service is where you define your connection information to other services. In this section, you'll add Azure Synapse Analytics and Azure Data Lake Gen 2 as linked services.

1. Open the Azure Synapse Analytics UX and go to the **Manage** tab.
1. Under **External connections**, select **Linked services**.
1. To add a linked service, click **New**.
1. Select the Azure Data Lake Storage Gen2 tile from the list and click **Continue**.
1. Enter your authentication credentials. Account key, service principal, and managed identity are currently supported authentication types. Click test connection to verify your credentials are correct. 
1. Click **Create** when finished.

## Create pipeline

A pipeline contains the logical flow for an execution of a set of activities. In this section, you'll create a pipeline containing a copy activity that ingests data from Azure Data Lake Gen 2 into a SQL pool.

1. Go to the **Orchestrate** tab. Click on the plus icon 
next to the pipelines header and select **Pipeline**.
1. Under **Move and Transform** in the activities pane, drag **Copy data** onto the pipeline canvas.
1. Click on the copy activity and go to the **Source** tab. Click **New** to create a new source dataset.
1. Select Azure Data Lake Storage Gen2 as your data store and click continue.
1. Select DelimitedText as your format and click continue.
1. In the set properties pane, select the ADLS linked service you created. Specify the file path of your source data and specify whether the first row has a header. You can import the schema from the file store or a sample file. Click OK when finished.
1. Go to the **Sink** tab. Click **New** to create a new sink dataset.
1. Select Azure Data Lake Storage gen2 as your data store and click continue.
1. Select DelimitedText as your format and click continue.
1. In the set properties pane, select the ADLS linked service you created. Specify the path of the folder where you wish to write data. Click OK when finished.

## Debug and publish pipeline

Once you've finished configuring your pipeline, you can execute a debug run before you publish your artifacts to verify everything is correct.

1. To debug the pipeline, select **Debug** on the toolbar. You see the status of the pipeline run in the **Output** tab at the bottom of the window. 
1. Once the pipeline can run successfully, in the top toolbar, select **Publish All**. This action publishes entities (datasets, and pipelines) you created to the Synapse Analytics service.
1. Wait until you see the **Successfully published** message. To see notification messages, click the bell button on the top-right. 


## Trigger and monitor the pipeline

In this step, you manually trigger the pipeline published in the previous step. 

1. Select **Add Trigger** on the toolbar, and then select **Trigger Now**. On the **Pipeline Run** page, select **Finish**.  
1. Go to the **Monitor** tab located in the left sidebar. You see a pipeline run that is triggered by a manual trigger. You can use links in the **Actions** column to view activity details and to rerun the pipeline.
1. To see activity runs associated with the pipeline run, select the **View Activity Runs** link in the **Actions** column. In this example, there's only one activity, so you see only one entry in the list. For details about the copy operation, select the **Details** link (eyeglasses icon) in the **Actions** column. Select **Pipeline Runs** at the top to go back to the Pipeline Runs view. To refresh the view, select **Refresh**.
1. Verify your data is correctly written in the SQL pool.


## Next steps

For more information on data integration for Synapse Analytics, see the [Ingesting data into a SQL pool](data-integration-sql-pool.md) article.
