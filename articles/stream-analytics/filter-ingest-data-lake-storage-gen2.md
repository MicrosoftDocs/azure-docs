---
title: Filter and ingest to Azure Data Lake Storage Gen2 using the Stream Analytics no code editor
description: Learn how to use the no code editor to easily create a Stream Analytics job. It continuously reads from Event Hubs, filters the incoming data, and then writes the results continuously to Azure Data Lake Storage Gen2.
author: sidramadoss
ms.author: sidram
ms.service: stream-analytics
ms.topic: how-to
ms.custom: mvc
ms.date: 05/08/2022
---

# Filter and ingest to Azure Data Lake Storage Gen2 using the Stream Analytics no code editor

This article describes how you can use the no code editor to easily create a Stream Analytics job. It continuously reads from your Event Hubs, filters the incoming data, and then writes the results continuously to Azure Data Lake Storage Gen2.

## Prerequisites

- Your Azure Event Hubs resources must be publicly accessible and not be behind a firewall or secured in an Azure Virtual Network
- The data in your Event Hubs must be serialized in either JSON, CSV, or Avro format.

## Develop a Stream Analytics job to filter and ingest real time data

1. In the Azure portal, locate and select the Azure Event Hubs instance.
1. Select **Features** > **Process Data** and then select **Start** on the **Filter and ingest to ADLS Gen2** card.  
    :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/filter-data-lake-gen2-card-start.png" alt-text="Screenshot showing the Filter and ingest to ADLS Gen2 card where you select Start." lightbox="./media/filter-ingest-data-lake-storage-gen2/filter-data-lake-gen2-card-start.png" :::
1. Enter a name for the Stream Analytics job, then select **Create**.  
    :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/create-job.png" alt-text="Screenshot showing where to enter a job name." lightbox="./media/filter-ingest-data-lake-storage-gen2/create-job.png" :::
1. Specify the **Serialization** type of your data in the Event Hubs window and the **Authentication method** that the job will use to connect to the Event Hubs. Then select **Connect**.  
    :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/event-hub-review-connect.png" alt-text="Screenshot showing the Event Hubs area where you select Serialization and Authentication method." lightbox="./media/filter-ingest-data-lake-storage-gen2/event-hub-review-connect.png" :::
1. If the connection is established successfully and you have data streams flowing in to the Event Hubs instance, you'll immediately see two things:
    1. Fields that are present in the input data. You can choose **Add field** or select the three dot symbol next to each field to remove, rename, or change its type.  
        :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/add-field.png" alt-text="Screenshot showing where you can add a field or remove, rename, or change a field type." lightbox="./media/filter-ingest-data-lake-storage-gen2/add-field.png" :::
    1. A live sample of incoming data in **Data preview** table under the diagram view. It automatically refreshes periodically. You can select **Pause streaming preview** to see a static view of sample input data.  
        :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/sample-input.png" alt-text="Screenshot showing sample data on the Data preview tab." lightbox="./media/filter-ingest-data-lake-storage-gen2/sample-input.png" :::
1. In the **Filter** area, select a field to filter the incoming data with a condition.  
    :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/filter-data.png" alt-text="Screenshot showing the Filter area where you can add a conditional filter." lightbox="./media/filter-ingest-data-lake-storage-gen2/filter-data.png" :::
1. Select the Azure Data Lake Gen2 table to send your filtered data:
    1. Select the **subscription**, **storage account name**, and **container** from the drop-down menu.
    1. After the **subscription** is selected, the **authentication method** and **storage account key** should be automatically filled in. Select **Connect**.  
    For more information about the fields and to see examples of path pattern, see [Blob storage and Azure Data Lake Gen2 output from Azure Stream Analytics](blob-storage-azure-data-lake-gen2-output.md).  
        :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/data-lake-configuration.png" alt-text="Screenshot showing the Azure Data Lake Gen2 blob container connection configuration settings." lightbox="./media/filter-ingest-data-lake-storage-gen2/data-lake-configuration.png" :::
1. Optionally, select **Get static preview/Refresh static preview** to see the data preview that will be ingested from Azure Data Lake Storage Gen2.  
:::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/data-lake-static-preview.png" alt-text="Screenshot showing the data preview and Refresh static preview option." lightbox="./media/filter-ingest-data-lake-storage-gen2/data-lake-static-preview.png" :::
1. Select **Save** and then select **Start** the Stream Analytics job.  
    :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/no-code-save-start.png" alt-text="Screenshot showing the job Save and Start options." lightbox="./media/filter-ingest-data-lake-storage-gen2/no-code-save-start.png" :::
1. To start the job, specify the number of **Streaming Units (SUs)** that the job runs with. SUs represents the amount of compute and memory allocated to the job. We recommended that you start with three and then adjust as needed.
1. After your select **Start**, the job starts running within two minutes.  
:::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/no-code-start-job.png" alt-text="Screenshot showing the Start Stream Analytics job window." lightbox="./media/filter-ingest-data-lake-storage-gen2/no-code-start-job.png" :::

You can see the job under the Process Data section in the **Stream Analytics jobs** tab. Select **Open metrics** to monitor it or stop and restart it, as needed.

:::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/no-code-list-jobs.png" alt-text="Screenshot showing the Stream Analytics jobs tab." lightbox="./media/filter-ingest-data-lake-storage-gen2/no-code-list-jobs.png" :::

## Next steps

Learn more about Azure Stream Analytics and how to monitor the job you've created.

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Monitor Stream Analytics jobs](stream-analytics-monitoring.md)