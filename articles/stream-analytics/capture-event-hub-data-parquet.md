---
title: Capture data from Event Hubs into Azure Data Lake Storage Gen2 in Parquet format
description: Learn how to use the node code editor to automatically capture the streaming data in Event Hubs in an Azure Data Lake Storage Gen2 account in Parquet format.
author: xujxu
ms.author: xujiang1
ms.service: stream-analytics
ms.topic: how-to
ms.custom: mvc, event-tier1-build-2022
ms.date: 05/24/2022
---
# Capture data from Event Hubs in Parquet format

This article explains how to use the no code editor to automatically capture streaming data in Event Hubs in an Azure Data Lake Storage Gen2 account in Parquet format. You have the flexibility of specifying a time or size interval.

## Prerequisites

- Your Azure Event Hubs and Azure Data Lake Storage Gen2 resources must be publicly accessible and can't be behind a firewall or secured in an Azure Virtual Network.
- The data in your Event Hubs must be serialized in either JSON, CSV, or Avro format.

## Configure a job to capture data

Use the following steps to configure a Stream Analytics job to capture data in Azure Data Lake Storage Gen2.

1. In the Azure portal, navigate to your event hub. 
1. Select **Features** > **Process Data**, and select **Start** on the **Capture data to ADLS Gen2 in Parquet format** card.  
    :::image type="content" source="./media/capture-event-hub-data-parquet/process-event-hub-data-cards.png" alt-text="Screenshot showing the Process Event Hubs data start cards." lightbox="./media/capture-event-hub-data-parquet/process-event-hub-data-cards.png" :::
1. Enter a **name** to identify your Stream Analytics job. Select **Create**.  
    :::image type="content" source="./media/capture-event-hub-data-parquet/new-stream-analytics-job-name.png" alt-text="Screenshot showing the New Stream Analytics job window where you enter the job name." lightbox="./media/capture-event-hub-data-parquet/new-stream-analytics-job-name.png" :::
1. Specify the **Serialization** type of your data in the Event Hubs and the **Authentication method** that the job will use to connect to Event Hubs. Then select **Connect**.
    :::image type="content" source="./media/capture-event-hub-data-parquet/event-hub-configuration.png" alt-text="Screenshot showing the Event Hubs connection configuration." lightbox="./media/capture-event-hub-data-parquet/event-hub-configuration.png" :::
1. When the connection is established successfully, you'll see:
    - Fields that are present in the input data. You can choose **Add field** or you can select the three dot symbol next to a field to optionally remove, rename, or change its name.
    - A live sample of incoming data in the **Data preview** table under the diagram view. It refreshes periodically. You can select **Pause streaming preview** to view a static view of the sample input.  
        :::image type="content" source="./media/capture-event-hub-data-parquet/edit-fields.png" alt-text="Screenshot showing sample data under Data Preview." lightbox="./media/capture-event-hub-data-parquet/edit-fields.png" :::
1. Select the **Azure Data Lake Storage Gen2** tile to edit the configuration. 
1. On the **Azure Data Lake Storage Gen2** configuration page, follow these steps:     
    1. Select the subscription, storage account name and container from the drop-down menu. 
    1. Once the subscription is selected, the authentication method and storage account key should be automatically filled in.  
    1. For streaming blobs, the directory path pattern is expected to be a dynamic value. It's required for the date to be a part of the file path for the blob – referenced as `{date}`. To learn about custom path patterns, see to [Azure Stream Analytics custom blob output partitioning](stream-analytics-custom-path-patterns-blob-storage-output.md).  
        :::image type="content" source="./media/capture-event-hub-data-parquet/blob-configuration.png" alt-text="First screenshot showing the Blob window where you edit a blob's connection configuration." lightbox="./media/capture-event-hub-data-parquet/blob-configuration.png" :::  
    1. Select **Connect**
1. When the connection is established, you'll see fields that are present in the output data.
1. Select **Save** on the command bar to save your configuration.
1. Select **Start** on the command bar to start the streaming flow to capture data. Then in the Start Stream Analytics job window:
    1. Choose the output start time.
    1. Select the number of Streaming Units (SU) that the job runs with. SU represents the computing resources that are allocated to execute a Stream Analytics job. For more information, see [Streaming Units in Azure Stream Analytics](stream-analytics-streaming-unit-consumption.md).
    1. In the **Choose Output data error handling** list, select the behavior you want when the output of the job fails due to data error. Select **Retry** to have the job retry until it writes successfully or select another option.  
        :::image type="content" source="./media/capture-event-hub-data-parquet/start-job.png" alt-text="Screenshot showing the Start Stream Analytics job window where you set the output start time, streaming units, and error handling." lightbox="./media/capture-event-hub-data-parquet/start-job.png" :::

## Verify output
Verify that the Parquet files are generated in the Azure Data Lake Storage container. 

:::image type="content" source="./media/capture-event-hub-data-parquet/verify-captured-data.png" alt-text="Screenshot showing the generated Parquet files in the ADLS container." lightbox="./media/capture-event-hub-data-parquet/verify-captured-data.png" :::


The new job is shown on the **Stream Analytics jobs** tab. Select **Open metrics** to monitor it. 

:::image type="content" source="./media/capture-event-hub-data-parquet/open-metrics-link.png" alt-text="Screenshot showing Open Metrics link selected." lightbox="./media/capture-event-hub-data-parquet/open-metrics-link.png" :::

Here's an example screenshot of metrics showing input and output events. 

:::image type="content" source="./media/capture-event-hub-data-parquet/job-metrics.png" alt-text="Screenshot showing metrics of the Stream Analytics job." lightbox="./media/capture-event-hub-data-parquet/job-metrics.png" :::

## Next steps

Now you know how to use the Stream Analytics no code editor to create a job that captures Event Hubs data to Azure Data Lake Storage Gen2 in Parquet format. Next, you can learn more about Azure Stream Analytics and how to monitor the job that you created.

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Monitor Stream Analytics job with Azure portal](stream-analytics-monitoring.md)
