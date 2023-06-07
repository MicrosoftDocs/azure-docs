---
title: Filter and ingest to Azure Data Explorer using the Stream Analytics no code editor
description: Learn how to use the no code editor to easily create a Stream Analytics job. It continuously reads from Event Hubs, filters the incoming data, and then writes the results continuously to Azure Data Explorer.
author: xujxu
ms.author: xujiang1
ms.service: stream-analytics
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 10/12/2022
---

# Filter and ingest to Azure Data Explorer using the Stream Analytics no code editor

This article describes how you can use the no code editor to easily create a Stream Analytics job. It continuously reads from your Event Hubs, filters the incoming data, and then writes the results continuously to Azure Data Explorer.

## Prerequisites

- Your Azure Event Hubs and Azure Data Explorer resources must be publicly accessible and not be behind a firewall or secured in an Azure Virtual Network
- The data in your Event Hubs must be serialized in either JSON, CSV, or Avro format.

## Develop a Stream Analytics job to filter and ingest real time data

1. In the [Azure portal](https://portal.azure.com), locate and select the Azure Event Hubs instance.
1. Select **Features** > **Process Data** and then select **Start** on the **Filter and store data to Azure Data Explorer** card.
  
    :::image type="content" source="./media/no-code-filter-ingest-data-explorer/event-hub-process-data-templates.png" alt-text="Screenshot showing the Filter and ingest to ADLS Gen2 card where you select Start." lightbox="./media/no-code-filter-ingest-data-explorer/event-hub-process-data-templates.png" :::

1. Enter a name for the Stream Analytics job, then select **Create**.  
    
    :::image type="content" source="./media/no-code-filter-ingest-data-explorer/create-new-stream-analytics-job.png" alt-text="Screenshot showing where to enter a job name." lightbox="./media/no-code-filter-ingest-data-explorer/create-new-stream-analytics-job.png" :::

1. Specify the **Serialization type** of your data in the Event Hubs window and the **Authentication method** that the job will use to connect to the Event Hubs. Then select **Connect**.  
    :::image type="content" source="./media/no-code-filter-ingest-data-explorer/event-hub-configuration.png" alt-text="Screenshot showing the Event Hubs connection configuration." lightbox="./media/no-code-filter-ingest-data-explorer/event-hub-configuration.png" :::

1. When the connection is established successfully and you have data streams flowing into your Event Hubs instance, you'll immediately see two things:
    - Fields that are present in the input data. You can choose **Add field** or select the three dot symbol next to a field to remove, rename, or change its type.  
        :::image type="content" source="./media/no-code-filter-ingest-data-explorer/no-code-schema.png" alt-text="Screenshot showing the Event Hubs field list where you can remove, rename, or change the field type." lightbox="./media/no-code-filter-ingest-data-explorer/no-code-schema.png" :::
    - A live sample of incoming data in the **Data preview** table under the diagram view. It automatically refreshes periodically. You can select **Pause streaming preview** to see a static view of the sample input data.  
        :::image type="content" source="./media/no-code-filter-ingest-data-explorer/no-code-sample-input.png" alt-text="Screenshot showing sample data under Data Preview." lightbox="./media/no-code-filter-ingest-data-explorer/no-code-sample-input.png" :::

1. Select the **Filter** tile to aggregate the data. In the Filter area, select a field to filter the incoming data with a condition.

    :::image type="content" source="./media/no-code-filter-ingest-data-explorer/filter-operator-configuration.png" alt-text="Screenshot that shows the filter operator configuration." lightbox="./media/no-code-filter-ingest-data-explorer/filter-operator-configuration.png" :::

1. Select the **Manage** tile. In the **Manage fields** configuration panel, choose the fields you want to output to event hub. If you want to add all the fields, select **Add all fields**.

    :::image type="content" source="./media/no-code-filter-ingest-data-explorer/manage-fields-configuration.png" alt-text="Screenshot that shows the manage field operator configuration." lightbox="./media/no-code-filter-ingest-data-explorer/manage-fields-configuration.png" :::

1. Select **Azure Data Explorer** tile. In the configuration panel, fill in needed parameters and connect. 

    > [!NOTE]
    > The table must exist in your selected database and the table schema must exactly match the number of fields and their types that your data preview generates.  

    :::image type="content" source="./media/no-code-filter-ingest-data-explorer/adx-output-configuration.png" alt-text="Screenshot that shows the Kusto output configuration." lightbox="./media/no-code-filter-ingest-data-explorer/adx-output-configuration.png" :::

1. Optionally, select **Get static preview/Refresh static preview** to see the data preview that will be ingested in event hub.  
    :::image type="content" source="./media/no-code-filter-ingest-data-explorer/no-code-output-static-preview.png" alt-text="Screenshot showing the Get static preview/Refresh static preview option." lightbox="./media/no-code-filter-ingest-data-explorer/no-code-output-static-preview.png" :::

1. Select **Save** and then select **Start** the Stream Analytics job.  
    :::image type="content" source="./media/no-code-filter-ingest-data-explorer/no-code-save-start.png" alt-text="Screenshot showing the Save and Start options." lightbox="./media/no-code-filter-ingest-data-explorer/no-code-save-start.png" :::

1. To start the job, specify:  
    - The number of **Streaming Units (SUs)** the job runs with. SUs represents the amount of compute and memory allocated to the job. We recommended that you start with three and then adjust as needed. 
    - **Output data error handling** – It allows you to specify the behavior you want when a job’s output to your destination fails due to data errors. By default, your job retries until the write operation succeeds. You can also choose to drop such output events.  
        :::image type="content" source="./media/no-code-filter-ingest-data-explorer/no-code-start-job.png" alt-text="Screenshot showing the Start Stream Analytics job options where you can change the output time, set the number of streaming units, and select the Output data error handling options." lightbox="./media/no-code-filter-ingest-data-explorer/no-code-start-job.png" :::

1. After you select **Start**, the job starts running within two minutes, and the metrics will be open in tab section below.   

    :::image type="content" source="./media/no-code-filter-ingest-data-explorer/job-metrics-after-started.png" alt-text="Screenshot that shows the job metrics data after it's started." lightbox="./media/no-code-filter-ingest-data-explorer/job-metrics-after-started.png" :::

    You can also see the job under the Process Data section on the **Stream Analytics jobs** tab. Select **Open metrics** to monitor it or stop and restart it, as needed.

    :::image type="content" source="./media/no-code-filter-ingest-data-explorer/no-code-list-jobs.png" alt-text="Screenshot of the Stream Analytics jobs tab where you view the running jobs status." lightbox="./media/no-code-filter-ingest-data-explorer/no-code-list-jobs.png" :::

## Next steps

Learn more about Azure Stream Analytics and how to monitor the job you've created.

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Monitor Stream Analytics job with Azure portal](stream-analytics-monitoring.md)
