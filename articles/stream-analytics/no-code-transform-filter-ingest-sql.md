---
title: Use Azure Stream Analytics no code editor to transform and store data in Azure SQL Database
description: Learn how to use the Azure Stream Analytics no-code editor to transform data flowing in from Event Hubs and store the result data in an Azure SQL database.
author: xujxu
ms.author: xujiang1
ms.service: stream-analytics
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 06/13/2023
---

# Use Azure Stream Analytics no-code editor to transform and store data in Azure SQL database

This article describes how you can use the no code editor to easily create a Stream Analytics job, which continuously reads data from an Event Hubs instance (event hub), transforms the data, and then writes results to an Azure SQL database.

## Prerequisites
Your Azure Event Hubs and Azure SQL Database resources must be publicly accessible and not be behind a firewall or secured in an Azure Virtual Network. The data in your Event Hubs must be serialized in either JSON, CSV, or Avro format. 

If you want to try steps in this article, follow these steps. 

- [Create an event hub](../event-hubs/event-hubs-create.md) if you don't have one already. Generate data in the event hub. On the **Event Hubs Instance** page, select **Generate data (preview)** on the left menu, select **Stock data** for **Dataset**, and then select **Send** to send some sample data to the event hub. This step is required if you want to test steps in this article. 
    
    :::image type="content" source="./media/no-code-transform-filter-ingest-sql/send-stock-data-to-event-hub.png" alt-text="Screenshot showing the Generate data (preview) page of an Event Hubs instance." lightbox="./media/no-code-transform-filter-ingest-sql/send-stock-data-to-event-hub.png"::: 
- [Create an Azure SQL database](/azure/azure-sql/database/single-database-create-quickstart). Here are a few important points to note while creating the database.
    1. On the **Basics** page, select **Create new** for **Server**. Then, on the **Create SQL Database server** page, select **Use SQL authentication**, and specify admin user ID and password. 
    1. On the **Networking** page, follow these steps:
        1. Enable **Public endpoint**.
        1. Select **Yes** for **Allow Azure services and resources to access this server**. 
        1. Select **Yes** for **Add current client IP address**.
    1. On the **Additional settings** page, select **None** for **Use existing data**. 
    1. In the article, skip steps in the **Query the database** and **Clean up resources** sections. 
    1. If you want to test steps, create a table in the SQL database by using the **Query editor (preview)**. 

        ```sql
        create table stocks (
            symbol varchar(4),
            price decimal
        )
        ```

## Use no-code editor to create a Stream Analytics job 
In this section, you create an Azure Stream Analytics job using the no-code editor. The job transforms data streaming from an Event Hubs instance (event hub) and store result data in an Azure SQL database. 

1. In the [Azure portal](https://portal.azure.com), navigate to the **Event Hubs Instance** page for your event hub.
1. Select **Features** > **Process Data** on the left menu and then select **Start** on the **Transform and store data to SQL database** card.
  
    :::image type="content" source="./media/no-code-transform-filter-ingest-sql/event-hub-process-data-templates.png" alt-text="Screenshot showing the Filter and ingest to ADLS Gen2 card where you select Start." lightbox="./media/no-code-transform-filter-ingest-sql/event-hub-process-data-templates.png" :::
1. Enter a name for the Stream Analytics job, then select **Create**. You see the Stream Analytics job diagram with Event Hubs window to the right. 
    
    :::image type="content" source="./media/no-code-transform-filter-ingest-sql/create-new-stream-analytics-job.png" alt-text="Screenshot showing where to enter a job name." lightbox="./media/no-code-transform-filter-ingest-sql/create-new-stream-analytics-job.png" :::
1. On the **Event hub** window, review **Serialization** and **Authentication mode** settings, and select **Connect**.
 
    :::image type="content" source="./media/no-code-transform-filter-ingest-sql/event-hub-configuration.png" alt-text="Screenshot showing the Event Hubs connection configuration." lightbox="./media/no-code-transform-filter-ingest-sql/event-hub-configuration.png" :::
1. When the connection is established successfully and you have data in your Event Hubs instance, you see two things:
    - Fields that are present in the input data. You can choose **Add field** or select the three dot symbol next to a field to remove, rename, or change its type.  
    
        :::image type="content" source="./media/no-code-transform-filter-ingest-sql/no-code-schema.png" alt-text="Screenshot showing the Event Hubs field list where you can remove, rename, or change the field type." lightbox="./media/no-code-transform-filter-ingest-sql/no-code-schema.png" :::
    - A live sample of incoming data in the **Data preview** table under the diagram view. It automatically refreshes periodically. You can select **Pause streaming preview** to see a static view of the sample input data.
      
        :::image type="content" source="./media/no-code-transform-filter-ingest-sql/no-code-sample-input.png" alt-text="Screenshot showing sample data under Data Preview." lightbox="./media/no-code-transform-filter-ingest-sql/no-code-sample-input.png" :::
1. Select the **Group by** tile to aggregate the data. In the **Group by** configuration panel, You can specify the field that you want to **Group By** along with the **Time window**. 

    In the following example, average of **price** and **symbol** are used.

    :::image type="content" source="./media/no-code-transform-filter-ingest-sql/group-by-operation-configuration.png" alt-text="Screenshot that shows the group by operator configuration." lightbox="./media/no-code-transform-filter-ingest-sql/group-by-operation-configuration.png" :::
1. You can validate the results of the step in the **Data preview** section.

    :::image type="content" source="./media/no-code-transform-filter-ingest-sql/group-by-data-preview.png" alt-text="Screenshot that shows the data preview for the group by operator." lightbox="./media/no-code-transform-filter-ingest-sql/group-by-data-preview.png" :::    
1. Select the **Manage fields** tile. In the **Manage fields** configuration panel, choose the fields you want to output by selecting **Add field** -> **Imported Schema** -> field. 

    If you want to add all the fields, select **Add all fields**. While adding a field, you can specify different name for the output. For example, `AVG_Value` to `Value`. After you save the selections, you see data in the **Data preview** pane. 

    In the following example, **Symbol** and **AVG_Value** are selected. **Symbol** is mapped to **symbol**, and **AVG_Value** is mapped to **price**. 

    :::image type="content" source="./media/no-code-transform-filter-ingest-sql/manage-fields-configuration.png" alt-text="Screenshot that shows the manage field operator configuration." lightbox="./media/no-code-transform-filter-ingest-sql/manage-fields-configuration.png" :::
1. Select **SQL** tile. In the **SQL Database** configuration panel, fill in needed parameters and connect. Select **Load existing table** to have the table automatically picked. In the following example, `[dbo].[stocks]` is picked. Then, select **Connect**. 

    > [!NOTE]
    > The schema of the table you choose to write must exactly match the number of fields and their types that your data preview generates.

    :::image type="content" source="./media/no-code-transform-filter-ingest-sql/sql-output-configuration.png" alt-text="Screenshot that shows the sql database output configuration." lightbox="./media/no-code-transform-filter-ingest-sql/sql-output-configuration.png" :::
1. In the **Data preview** pane, you see the data preview that is ingested in SQL database.  

    :::image type="content" source="./media/no-code-transform-filter-ingest-sql/no-code-output-static-preview.png" alt-text="Screenshot showing the Get static preview/Refresh static preview option." lightbox="./media/no-code-transform-filter-ingest-sql/no-code-output-static-preview.png" :::
1. Select **Save** and then select **Start** the Stream Analytics job.  

    :::image type="content" source="./media/no-code-transform-filter-ingest-sql/no-code-save-start.png" alt-text="Screenshot showing the Save and Start options." lightbox="./media/no-code-transform-filter-ingest-sql/no-code-save-start.png" :::
1. To start the job, specify:  
    - The number of **Streaming Units (SUs)** the job runs with. SUs represents the amount of compute and memory allocated to the job. We recommended that you start with three and then adjust as needed. 
    - **Output data error handling** – It allows you to specify the behavior you want when a job’s output to your destination fails due to data errors. By default, your job retries until the write operation succeeds. You can also choose to drop such output events.  
    
        :::image type="content" source="./media/no-code-transform-filter-ingest-sql/no-code-start-job.png" alt-text="Screenshot showing the Start Stream Analytics job options where you can change the output time, set the number of streaming units, and select the Output data error handling options." lightbox="./media/no-code-transform-filter-ingest-sql/no-code-start-job.png" :::
1. After you select **Start**, the job starts running within two minutes. You see the **metrics** panel in the bottom pane open. It takes sometime for this panel to updated. Select **Refresh** in the top-right corner of the panel to refresh the chart. Proceed to the next step in a separate tab or window of the web browser.

    :::image type="content" source="./media/no-code-transform-filter-ingest-sql/job-metrics-after-started.png" alt-text="Screenshot that shows the job metrics after it's started." lightbox="./media/no-code-transform-filter-ingest-sql/job-metrics-after-started.png" :::

    You can also see the job under the Process Data section on the **Stream Analytics jobs** tab. Select **Open metrics** to monitor it or stop and restart it, as needed.

    :::image type="content" source="./media/no-code-transform-filter-ingest-sql/no-code-list-jobs.png" alt-text="Screenshot of the Stream Analytics jobs tab where you view the running jobs status." lightbox="./media/no-code-transform-filter-ingest-sql/no-code-list-jobs.png" :::
1. Navigate to your event hub in the portal in a separate browser window or tab, and send sample stock data again (as you did in the prerequisites). On the **Event Hubs Instance** page, select **Generate data (preview)** on the left menu, select **Stock data** for **Dataset**, and then select **Send** to send some sample data to the event hub. It make take a few minutes to see the **Metrics** panel updated. 
1. You should see records inserted in the Azure SQL database.

    :::image type="content" source="./media/no-code-transform-filter-ingest-sql/sql-output.png" alt-text="Screenshot that shows contents of the stocks table in the database." lightbox="./media/no-code-transform-filter-ingest-sql/sql-output.png":::

## Next steps

Learn more about Azure Stream Analytics and how to monitor the job you've created.

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Monitor Stream Analytics job with Azure portal](stream-analytics-monitoring.md)
