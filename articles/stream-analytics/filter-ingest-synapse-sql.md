---
title: Filter and ingest to Azure Synapse SQL using the Stream Analytics no code editor
description: Learn how to use the no code editor to easily create a Stream Analytics job. It continuously reads from your Event Hubs, filters the incoming data, and then writes the results continuously to a Synapse SQL table.
author: xujxu
ms.author: xujiang1
ms.service: stream-analytics
ms.topic: how-to
ms.custom: mvc, event-tier1-build-2022, ignite-2022
ms.date: 10/12/2022
---

# Filter and ingest to Azure Synapse SQL using the Stream Analytics no code editor

This article describes how you can use the no code editor to easily create a Stream Analytics job. It continuously reads from your Event Hubs, filters the incoming data, and then writes the results continuously to Synapse SQL table.

## Prerequisites

- Your Azure Event Hubs resources must be publicly accessible and can't be behind a firewall or secured in an Azure Virtual Network.
- The data in your Event Hubs must be serialized in either JSON, CSV, or Avro format.

## Develop a Stream Analytics job to filter and ingest data

Use the following steps to develop a Stream Analytics job to filter and ingest real time data into a Synapse SQL table.

1. In the Azure portal, locate and select your Azure Event Hubs instance.
1. Select **Features** > **Process Data**, and select **Start** on the **Filter and ingest to Synapse SQL** card.  
    :::image type="content" source="./media/filter-ingest-synapse-sql/process-event-hub-data-cards.png" alt-text="Screenshot showing the Process Event Hubs data start cards." lightbox="./media/filter-ingest-synapse-sql/process-event-hub-data-cards.png" :::
1. Enter a name to identify your Stream Analytics job, then select **Create**.  
    :::image type="content" source="./media/filter-ingest-synapse-sql/create-new-stream-analytics-job.png" alt-text="Screenshot showing the New Stream Analytics job window where you enter the job name." lightbox="./media/filter-ingest-synapse-sql/create-new-stream-analytics-job.png" :::
1. Specify the **Serialization type** of your data in the Event Hubs window and the **Authentication method** that the job will use to connect to the Event Hubs. Then select **Connect**.  
    :::image type="content" source="./media/filter-ingest-synapse-sql/event-hub-configuration.png" alt-text="Screenshot showing the Event Hubs connection configuration." lightbox="./media/filter-ingest-synapse-sql/event-hub-configuration.png" :::
1. When the connection is established successfully and you have data streams flowing into your Event Hubs instance, you'll immediately see two things:
    - Fields that are present in the input data. You can choose **Add field** or select the three dot symbol next to a field to remove, rename, or change its type.  
        :::image type="content" source="./media/filter-ingest-synapse-sql/no-code-schema.png" alt-text="Screenshot showing the Event Hubs field list where you can remove, rename, or change the field type." lightbox="./media/filter-ingest-synapse-sql/no-code-schema.png" :::
    - A live sample of incoming data in the **Data preview** table under the diagram view. It automatically refreshes periodically. You can select **Pause streaming preview** to see a static view of the sample input data.  
        :::image type="content" source="./media/filter-ingest-synapse-sql/no-code-sample-input.png" alt-text="Screenshot showing sample data under Data Preview." lightbox="./media/filter-ingest-synapse-sql/no-code-sample-input.png" :::
1. In the Filter area, select a field to filter the incoming data with a condition.  
    :::image type="content" source="./media/filter-ingest-synapse-sql/no-code-filter-data.png" alt-text="Screenshot showing the Filter area where you can filter incoming data with a condition." lightbox="./media/filter-ingest-synapse-sql/no-code-filter-data.png" :::
1. Select the Synapse SQL table to send your filtered data:
    1. Select the **Subscription**, **Database (dedicated SQL pool name)** and **Authentication method** from the drop-down menu.
    1. Enter Table name where the filtered data will be ingested. Select **Connect**.  
        :::image type="content" source="./media/filter-ingest-synapse-sql/no-code-synapse-configuration.png" alt-text="Screenshot showing Synapse SQL table connection details." lightbox="./media/filter-ingest-synapse-sql/no-code-synapse-configuration.png" :::  
    > [!NOTE]
    > The table schema must exactly match the number of fields and their types that your data preview generates.  
1. Optionally, select **Get static preview/Refresh static preview** to see the data preview that will be ingested in selected Synapse SQL table.  
    :::image type="content" source="./media/filter-ingest-synapse-sql/no-code-synapse-static-preview.png" alt-text="Screenshot showing the Get static preview/Refresh static preview option." lightbox="./media/filter-ingest-synapse-sql/no-code-synapse-static-preview.png" :::
1. Select **Save** and then select **Start** the Stream Analytics job.  
    :::image type="content" source="./media/filter-ingest-synapse-sql/no-code-save-start.png" alt-text="Screenshot showing the Save and Start options." lightbox="./media/filter-ingest-synapse-sql/no-code-save-start.png" :::
1. To start the job, specify:  
    - The number of **Streaming Units (SUs)** the job runs with. SUs represents the amount of compute and memory allocated to the job. We recommended that you start with three and then adjust as needed. 
    - **Output data error handling** – It allows you to specify the behavior you want when a job’s output to your destination fails due to data errors. By default, your job retries until the write operation succeeds. You can also choose to drop such output events.  
        :::image type="content" source="./media/filter-ingest-synapse-sql/no-code-start-job.png" alt-text="Screenshot showing the Start Stream Analytics job options where you can change the output time, set the number of streaming units, and select the Output data error handling options." lightbox="./media/filter-ingest-synapse-sql/no-code-start-job.png" :::
1. After you select **Start**, the job starts running within two minutes and the metrics will be open in tab section below.   

    You can also see the job under the Process Data section on the **Stream Analytics jobs** tab. Select **Open metrics** to monitor it or stop and restart it, as needed.

    :::image type="content" source="./media/filter-ingest-synapse-sql/no-code-list-jobs.png" alt-text="Screenshot of the Stream Analytics jobs tab where you view the running jobs status." lightbox="./media/filter-ingest-synapse-sql/no-code-list-jobs.png" :::

## Next steps

Learn more about Azure Stream Analytics and how to monitor the job you've created.

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Monitor Stream Analytics job with Azure portal](stream-analytics-monitoring.md)
