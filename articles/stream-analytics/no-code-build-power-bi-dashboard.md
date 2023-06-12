---
title: Build real-time dashboard with Power BI dataset produced from Stream Analytics no code editor
description: Learn how to use the no code editor to easily create a Stream Analytics job to produce the Power BI dataset, and use it to build the real-time dashboard. It continuously reads from Event Hubs, and outputs the data into Power BI dataset to build the real-time Power BI dashboard.
author: xujxu
ms.author: xujiang1
ms.service: stream-analytics
ms.custom: 
ms.topic: how-to
ms.date: 2/17/2023
---

# Build real-time dashboard with Power BI dataset produced from Stream Analytics no code editor

This article describes how you can use the no code editor to easily create a Stream Analytics job to produce processed data into Power BI dataset. It continuously reads from your Event Hubs, processes and outputs the data into Power BI dataset to build the real-time Power BI dashboard.

## Prerequisites

- Your Azure Event Hubs resources must be publicly accessible and not be behind a firewall or secured in an Azure Virtual Network
- You should have an existing Power BI workspace, and you have the permission to create dataset there.
- The data in your Event Hubs must be serialized in either JSON, CSV, or Avro format.

## Develop a Stream Analytics job to create Power BI dataset with selected data

1. In the [Azure portal](https://portal.azure.com), locate and select the Azure Event Hubs instance.
1. Select **Features** > **Process Data** and then select **Start** on the **Build the real-time data dashboard with Power BI** card.

    :::image type="content" source="./media/no-code-build-power-bi-dashboard/event-hub-process-data-templates.png" alt-text="Screenshot showing the Filter and ingest to ADLS Gen2 card where you select Start." lightbox="./media/no-code-build-power-bi-dashboard/event-hub-process-data-templates.png" :::

1. Enter a name for the Stream Analytics job, then select **Create**.  
    
    :::image type="content" source="./media/no-code-build-power-bi-dashboard/create-new-stream-analytics-job.png" alt-text="Screenshot showing where to enter a job name." lightbox="./media/no-code-build-power-bi-dashboard/create-new-stream-analytics-job.png" :::

1. Specify the **Serialization type** of your data in the Event Hubs window and the **Authentication method** that the job will use it to connect to the Event Hubs. Then select **Connect**.  
    :::image type="content" source="./media/no-code-build-power-bi-dashboard/event-hub-configuration.png" alt-text="Screenshot showing the Event Hubs connection configuration." lightbox="./media/no-code-build-power-bi-dashboard/event-hub-configuration.png" :::

1. When the connection is established successfully and you have data streams flowing into your Event Hubs instance, you immediately see two things:
    - Fields that are present in the input data. You can choose **Add field** or select the three dot symbol next to a field to remove, rename, or change its type.  
        :::image type="content" source="./media/no-code-build-power-bi-dashboard/no-code-schema.png" alt-text="Screenshot showing the Event Hubs field list where you can remove, rename, or change the field type." lightbox="./media/no-code-build-power-bi-dashboard/no-code-schema.png" :::
    - A live sample of incoming data in the **Data preview** table under the diagram view. It automatically refreshes periodically. You can select **Pause streaming preview** to see a static view of the sample input data.  
        :::image type="content" source="./media/no-code-build-power-bi-dashboard/no-code-sample-input.png" alt-text="Screenshot showing sample data under Data Preview." lightbox="./media/no-code-build-power-bi-dashboard/no-code-sample-input.png" :::


1. Select the **Manage** tile. In the **Manage fields** configuration panel, choose the fields you want to output. If you want to add all the fields, select **Add all fields**.

    :::image type="content" source="./media/no-code-build-power-bi-dashboard/manage-fields-configuration.png" alt-text="Screenshot that shows the manage field operator configuration." lightbox="./media/no-code-build-power-bi-dashboard/manage-fields-configuration.png" :::

1. Select **Power BI** tile. In the **Power BI** configuration panel, fill in needed parameters and connect. 
    - **Dataset**: it's the Power BI destination where the Azure Stream Analytics job output data is written into.
    - **Table**: it's the table name in the Dataset where the output data goes to.

    :::image type="content" source="./media/no-code-build-power-bi-dashboard/no-code-pbi-configuration.png" alt-text="Screenshot that shows the Power BI output configuration." lightbox="./media/no-code-build-power-bi-dashboard/no-code-pbi-configuration.png" :::

1. Optionally, select **Get static preview/Refresh static preview** to see the data preview that will be ingested in event hub.  
    :::image type="content" source="./media/no-code-build-power-bi-dashboard/no-code-output-static-preview.png" alt-text="Screenshot showing the Get static preview/Refresh static preview option." lightbox="./media/no-code-build-power-bi-dashboard/no-code-output-static-preview.png" :::

1. Select **Save** and then select **Start** the Stream Analytics job.  
    :::image type="content" source="./media/no-code-build-power-bi-dashboard/no-code-save-start.png" alt-text="Screenshot showing the Save and Start options." lightbox="./media/no-code-build-power-bi-dashboard/no-code-save-start.png" :::

1. To start the job, specify:  
    - The number of **Streaming Units (SUs)** the job runs with. SUs represents the amount of compute and memory allocated to the job. We recommended that you start with three and then adjust as needed. 
    - **Output data error handling** – It allows you to specify the behavior you want when a job’s output to your destination fails due to data errors. By default, your job retries until the write operation succeeds. You can also choose to drop such output events.  
        :::image type="content" source="./media/no-code-build-power-bi-dashboard/no-code-start-job.png" alt-text="Screenshot showing the Start Stream Analytics job options where you can change the output time, set the number of streaming units, and select the Output data error handling options." lightbox="./media/no-code-build-power-bi-dashboard/no-code-start-job.png" :::

1. After you select **Start**, the job starts running within two minutes, and the metrics will be open in tab section below.   

    :::image type="content" source="./media/no-code-build-power-bi-dashboard/job-metrics-after-started.png" alt-text="Screenshot that shows the job metrics after it's started." lightbox="./media/no-code-build-power-bi-dashboard/job-metrics-after-started.png" :::

    You can also see the job under the Process Data section on the **Stream Analytics jobs** tab. Select **Open metrics** to monitor it or stop and restart it, as needed.

    :::image type="content" source="./media/no-code-build-power-bi-dashboard/no-code-list-jobs.png" alt-text="Screenshot of the Stream Analytics jobs tab where you view the running jobs status." lightbox="./media/no-code-build-power-bi-dashboard/no-code-list-jobs.png" :::

## Build the real-time dashboard in Power BI
Now, you have the Azure Stream Analytics job running and the data is continuously written into the table in the Power BI dataset you've configured. You can now create the real-time dashboard in Power BI workspace.

1. Go to the Power BI workspace, which you've configured in above Power BI output tile, and select **+ New** in the top left corner, then choose **Dashboard** to give the new dashboard a name.
    :::image type="content" source="./media/no-code-build-power-bi-dashboard/pbi-dashboard-creation.png" alt-text="Screenshot of the pbi dashboard creation." lightbox="./media/no-code-build-power-bi-dashboard/pbi-dashboard-creation.png" :::
2. Once the new dashboard is created, you'll be led to the new dashboard. Select **Edit**, and choose **+ Add a tile** in the top menu bar. A right pane is open. Select **Custom Streaming Data** to go to next page.
    :::image type="content" source="./media/no-code-build-power-bi-dashboard/pbi-dashboard-add-tile.png" alt-text="Screenshot of the pbi dashboard adding tile." lightbox="./media/no-code-build-power-bi-dashboard/pbi-dashboard-add-tile.png" :::
3. Select the streaming dataset (for example **nocode-pbi-demo-xujx**) which you've configured in Power BI node, and go to next page.
    :::image type="content" source="./media/no-code-build-power-bi-dashboard/pbi-dashboard-add-tile-select-dataset.png" alt-text="Screenshot of the pbi dashboard adding tile with selected dataset." lightbox="./media/no-code-build-power-bi-dashboard/pbi-dashboard-add-tile-select-dataset.png" :::
4. Fill in the tile details, and follow the next step to complete the tile configuration.
    :::image type="content" source="./media/no-code-build-power-bi-dashboard/pbi-dashboard-add-tile-details.png" alt-text="Screenshot of the pbi dashboard adding tile with configured details." lightbox="./media/no-code-build-power-bi-dashboard/pbi-dashboard-add-tile-details.png" :::
5. Then, you can adjust its size and get the continuously updated dashboard as below.
    :::image type="content" source="./media/no-code-build-power-bi-dashboard/pbi-dashboard-report.png" alt-text="Screenshot of the pbi dashboard report." lightbox="./media/no-code-build-power-bi-dashboard/pbi-dashboard-report.png" :::


## Next steps

Learn more about Azure Stream Analytics and how to monitor the job you've created.

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Monitor Stream Analytics job with Azure portal](stream-analytics-monitoring.md)
* [Azure Stream Analytics no code editor](./no-code-stream-processing.md)
