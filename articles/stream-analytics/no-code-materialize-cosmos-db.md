---
title: Materialize data in Azure Cosmos DB using no code editor
description: Learn how to use the no code editor in Stream Analytics to materialize data from Event Hubs to Azure Cosmos DB.
author: xujxu
ms.author: xujiang1
ms.service: stream-analytics
ms.topic: how-to
ms.custom: mvc, event-tier1-build-2022, ignite-2022
ms.date: 05/12/2022
---
# Materialize data in Azure Cosmos DB using the Stream Analytics no code editor

This article describes how you can use the no code editor to easily create a Stream Analytics job. The job continuously reads from your Event Hubs and performs aggregations like count, sum, and average. You select fields to group by over a time window and then the job writes the results continuously to Azure Cosmos DB.

## Prerequisites

* Your Azure Event Hubs and Azure Cosmos DB resources must be publicly accessible and can't be behind a firewall or secured in an Azure Virtual Network.
* The data in your Event Hubs must be serialized in either JSON, CSV, or Avro format.

## Develop a Stream Analytics job

Use the following steps to develop a Stream Analytics job to materialize data in Azure Cosmos DB.

1. In the Azure portal, locate and select your Azure Event Hubs instance.
2.	Under **Features**, select **Process Data**. Then, select **Start** in the card titled **Materialize Data in Azure Cosmos DB**.  
    :::image type="content" source="./media/no-code-materialize-cosmos-db/no-code-materialize-view-start.png" alt-text="Screenshot showing the Start Materialize Data Flow." lightbox="./media/no-code-materialize-cosmos-db/no-code-materialize-view-start.png" :::
3.	Enter a name for your job and select **Create**.
4.	Specify the **Serialization** type of your data in the event hub and the **Authentication method** that the job will use to connect to the Event Hubs. Then select **Connect**.
5.	If the connection is successful and you have data streams flowing into your Event Hubs instance, you'll immediately see two things:
    -  Fields that are present in your input payload. Select the three dot symbol next to a field optionally remove, rename, or change the data type of the field.  
        :::image type="content" source="./media/no-code-materialize-cosmos-db/no-code-schema.png" alt-text="Screenshot showing the event hub fields of input for you to review." lightbox="./media/no-code-materialize-cosmos-db/no-code-schema.png" :::    
    - A sample of your input data in the bottom pane under **Data preview** that automatically refreshes periodically. You can select **Pause streaming preview** if you prefer to have a static view of your sample input data.  
        :::image type="content" source="./media/no-code-materialize-cosmos-db/no-code-sample-input.png" alt-text="Screenshot showing sample input data." lightbox="./media/no-code-materialize-cosmos-db/no-code-sample-input.png" :::
6.	In the next step, you specify the field and the **aggregate** you want to calculate, such as Average and Count. You can also specify the field that you want to **Group By** along with the **time window**. Then you can validate the results of the step in the **Data preview** section.  
    :::image type="content" source="./media/no-code-materialize-cosmos-db/no-code-group-by.png" alt-text="Screenshot showing the Group By area." lightbox="./media/no-code-materialize-cosmos-db/no-code-group-by.png" :::
7.	Choose the **Cosmos DB database** and **container** where you want results written.
8.	Start the Stream Analytics job by selecting **Start**.  
    :::image type="content" source="./media/no-code-materialize-cosmos-db/no-code-cosmos-db-start.png" alt-text="Screenshot showing your definition where you select Start." lightbox="./media/no-code-materialize-cosmos-db/no-code-cosmos-db-start.png" :::  
To start the job, you must specify:
    -  The number of **Streaming Units (SU)** the job runs with. SUs represent the amount of compute and memory allocated to the job. We recommended that you start with three and adjust as needed.
    - **Output data error handling** allows you to specify the behavior you want when a job’s output to your destination fails due to data errors. By default, your job retries until the write operation succeeds. You can also choose to drop  output events.
9.	After you select **Start**, the job starts running within two minutes. View the job under the **Process Data** section in the Stream Analytics jobs tab. You can explore job metrics and stop and restart it as needed.

## Next steps

Now you know how to use the Stream Analytics no code editor to develop a job that reads from Event Hubs and calculates aggregates such as counts, averages and writes it to your Azure Cosmos DB resource.

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Monitor Stream Analytics job with Azure portal](./stream-analytics-monitoring.md)
