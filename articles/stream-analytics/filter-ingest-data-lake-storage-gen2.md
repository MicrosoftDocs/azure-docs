---
title: Filter and ingest to Azure Data Lake Storage Gen2 using the Stream Analytics no code editor
description: Learn how to use the no code editor to easily create a Stream Analytics job. It continuously reads from Event Hubs, filters the incoming data, and then writes the results continuously to Azure Data Lake Storage Gen2.
author: xujxu
ms.author: xujiang1
ms.service: stream-analytics
ms.topic: how-to
ms.custom: mvc, event-tier1-build-2022, ignite-2022
ms.date: 10/12/2022
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
1. Select the **Filter** tile. In the **Filter** area, select a field to filter the incoming data with a condition.  
    :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/filter-data.png" alt-text="Screenshot showing the Filter area where you can add a conditional filter." lightbox="./media/filter-ingest-data-lake-storage-gen2/filter-data.png" :::
1. Select the **Azure Data Lake Storage Gen2** tile. Select the **Azure Data Lake Gen2** account to send your filtered data:
    1. Select the **subscription**, **storage account name**, and **container** from the drop-down menu.
    1. After the **subscription** is selected, the **authentication method** and **storage account key** should be automatically filled in. Select **Connect**.  
    For more information about the fields and to see examples of path pattern, see [Blob storage and Azure Data Lake Gen2 output from Azure Stream Analytics](blob-storage-azure-data-lake-gen2-output.md).  
        :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/data-lake-configuration.png" alt-text="Screenshot showing the Azure Data Lake Gen2 blob container connection configuration settings." lightbox="./media/filter-ingest-data-lake-storage-gen2/data-lake-configuration.png" :::
1. Optionally, select **Get static preview/Refresh static preview** to see the data preview that will be ingested from Azure Data Lake Storage Gen2.  
:::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/data-lake-static-preview.png" alt-text="Screenshot showing the data preview and Refresh static preview option." lightbox="./media/filter-ingest-data-lake-storage-gen2/data-lake-static-preview.png" :::
1. Select **Save** and then select **Start** the Stream Analytics job.  
    :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/no-code-save-start.png" alt-text="Screenshot showing the job Save and Start options." lightbox="./media/filter-ingest-data-lake-storage-gen2/no-code-save-start.png" :::
1. To start the job, specify the number of **Streaming Units (SUs)** that the job runs with. SUs represents the amount of compute and memory allocated to the job. We recommended that you start with three and then adjust as needed.
1. After you select **Start**, the job starts running within two minutes and the metrics will be open in tab section below.   


    :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/no-code-start-job.png" alt-text="Screenshot showing the Start Stream Analytics job window." lightbox="./media/filter-ingest-data-lake-storage-gen2/no-code-start-job.png" :::

    You can see the job under the Process Data section in the **Stream Analytics jobs** tab. Select **Refresh** until you see the job status as **Running**. Select **Open metrics** to monitor it or stop and restart it, as needed.

    :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/no-code-list-jobs.png" alt-text="Screenshot showing the Stream Analytics jobs tab." lightbox="./media/filter-ingest-data-lake-storage-gen2/no-code-list-jobs.png" :::

    Here's a sample **Metrics** page:

    :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/metrics-page.png" alt-text="Screenshot showing the Metrics page." lightbox="./media/filter-ingest-data-lake-storage-gen2/metrics-page.png" :::


## Verify data in Data Lake Storage

1. You should see files created in the container you specified. 

    :::image type="content" source="./media/filter-ingest-data-lake-storage-gen2/filtered-data-file.png" alt-text="Screenshot showing the generated file with filtered data in the Azure Data Lake Storage." lightbox="./media/filter-ingest-data-lake-storage-gen2/filtered-data-file.png" :::        
1. Download and open the file to confirm that you see only the filtered data. In the following example, you see data with **SwitchNum** set to **US**.  

    ```json
    {"RecordType":"MO","SystemIdentity":"d0","FileNum":"548","SwitchNum":"US","CallingNum":"345697969","CallingIMSI":"466921402416657","CalledNum":"012332886","CalledIMSI":"466923101048691","DateS":"20220524","TimeType":0,"CallPeriod":0,"ServiceType":"S","Transfer":0,"OutgoingTrunk":"419","MSRN":"1416960750071","callrecTime":"2022-05-25T02:07:10Z","EventProcessedUtcTime":"2022-05-25T02:07:50.5478116Z","PartitionId":0,"EventEnqueuedUtcTime":"2022-05-25T02:07:09.5140000Z", "TimeS":null,"CallingCellID":null,"CalledCellID":null,"IncomingTrunk":null,"CalledNum2":null,"FCIFlag":null}
    {"RecordType":"MO","SystemIdentity":"d0","FileNum":"552","SwitchNum":"US","CallingNum":"012351287","CallingIMSI":"262021390056324","CalledNum":"012301973","CalledIMSI":"466922202613463","DateS":"20220524","TimeType":3,"CallPeriod":0,"ServiceType":"V","Transfer":0,"OutgoingTrunk":"442","MSRN":"886932428242","callrecTime":"2022-05-25T02:07:13Z","EventProcessedUtcTime":"2022-05-25T02:07:50.5478116Z","PartitionId":0,"EventEnqueuedUtcTime":"2022-05-25T02:07:12.7350000Z", "TimeS":null,"CallingCellID":null,"CalledCellID":null,"IncomingTrunk":null,"CalledNum2":null,"FCIFlag":null}
    {"RecordType":"MO","SystemIdentity":"d0","FileNum":"559","SwitchNum":"US","CallingNum":"456757102","CallingIMSI":"466920401237309","CalledNum":"345617823","CalledIMSI":"466923000886460","DateS":"20220524","TimeType":1,"CallPeriod":696,"ServiceType":"V","Transfer":1,"OutgoingTrunk":"419","MSRN":"886932429155","callrecTime":"2022-05-25T02:07:22Z","EventProcessedUtcTime":"2022-05-25T02:07:50.5478116Z","PartitionId":0,"EventEnqueuedUtcTime":"2022-05-25T02:07:21.9190000Z", "TimeS":null,"CallingCellID":null,"CalledCellID":null,"IncomingTrunk":null,"CalledNum2":null,"FCIFlag":null}
    ```


## Next steps

Learn more about Azure Stream Analytics and how to monitor the job you've created.

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Monitor Stream Analytics job with Azure portal](stream-analytics-monitoring.md)
