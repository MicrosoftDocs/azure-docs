---
title: Process real-time IoT data streams with Azure Stream Analytics
description: IoT sensor tags and data streams with stream analytics and real-time data processing
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: how-to
ms.date: 08/15/2023
---
# Process real-time IoT data streams with Azure Stream Analytics

In this article, you learn how to create stream-processing logic to gather data from Internet of Things (IoT) devices. You use a real-world Internet of Things (IoT) use case to demonstrate how to build your solution quickly and economically.

## Prerequisites

* Create a free [Azure subscription](https://azure.microsoft.com/pricing/free-trial/).
* Download sample query and data files from [GitHub](https://aka.ms/azure-stream-analytics-get-started-iot).

## Scenario

Contoso, a company in the industrial automation space, has automated its manufacturing process. The machinery in this plant has sensors that are capable of emitting streams of data in real time. In this scenario, a production floor manager wants to have real-time insights from the sensor data to look for patterns and take actions on them. You can use Stream Analytics Query Language (SAQL) over the sensor data to find interesting patterns from the incoming stream of data.

In this example, the data is generated from a Texas Instruments sensor tag device. The payload of the data is in JSON format as shown in the following sample snippet:

```json
{
    "time": "2016-01-26T20:47:53.0000000",  
    "dspl": "sensorE",  
    "temp": 123,  
    "hmdt": 34  
}  
```

In a real-world scenario, you could have hundreds of these sensors generating events as a stream. Ideally, a gateway device would run code to push these events to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/) or [Azure IoT Hubs](https://azure.microsoft.com/services/iot-hub/). Your Stream Analytics job would ingest these events from Event Hubs or IoT Hubs and run real-time analytics queries against the streams. Then, you could send the results to one of the [supported outputs](stream-analytics-define-outputs.md).

For ease of use, this getting started guide provides a sample data file, which was captured from real sensor tag devices. You can run queries on the sample data and see results. In subsequent tutorials, you learn how to connect your job to inputs and outputs and deploy them to the Azure service.

## Create a Stream Analytics job

1. Navigate to the [Azure portal](https://portal.azure.com).
1. On the left navigation menu, select **All services**, select **Analytics**, hover the mouse over **Stream Analytics jobs**, and then select **Create**.
   
    :::image type="content" source="./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-02.png" alt-text="Screenshot that shows the selection of Create button for a Stream Analytics job." lightbox="./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-02.png":::
1. On the **New Stream Analytics job** page, follow these steps: 
    1. For **Subscription**, select your **Azure subscription**.
    1. For **Resource group**, select an existing resource group or create a resource group.
    1. For **Name**, enter a unique name for the Stream Analytics job. 
    1. Select the **Region** in which you want to deploy the Stream Analytics job. Use the same location for your resource group and all resources to increase the processing speed and reduce costs. 
    1. Select **Review + create**.    
   
        :::image type="content" source="./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-03.png" alt-text="Screenshot that shows the New Stream Analytics job page.":::
1. On the **Review + create** page, review settings, and select **Create**. 
1. After the deployment succeeds, select **Go to resource** to navigate to the **Stream Analytics job** page for your Stream Analytics job. 

## Create an Azure Stream Analytics query
After your job is created, write a query. You can test queries against sample data without connecting an input or output to your job.

1. Download the [HelloWorldASA-InputStream.json](https://github.com/Azure/azure-stream-analytics/blob/master/Samples/GettingStarted/HelloWorldASA-InputStream.json) from GitHub. 
1. On the **Azure Stream Analytics job** page in the Azure portal, select **Query** under **Job topology** from the left menu. 
1. Select **Upload sample input**, select the `HelloWorldASA-InputStream.json` file you downloaded, and select **OK**. 

    :::image type="content" source="./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-05.png" alt-text="Screenshot that shows the **Query** page with **Upload sample input** selected." lightbox="./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-05.png":::
1. Notice that a preview of the data is automatically populated in the **Input preview** table.

    :::image type="content" source="./media/stream-analytics-get-started-with-iot-devices/input-preview.png" alt-text="Screenshot that shows sample input data in the Input preview tab.":::

### Query: Archive your raw data

The simplest form of query is a pass-through query that archives all input data to its designated output. This query is the default query populated in a new Azure Stream Analytics job.

1. In the **Query** window, enter the following query, and then select **Test query** on the toolbar. 

    ```sql
    SELECT
        *
    INTO
        youroutputalias
    FROM
        yourinputalias
    ```
2. View the results in the **Test results** tab in the bottom pane.

    :::image type="content" source="./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-07.png" alt-text="Screenshot that shows the sample query and its results.":::

### Query: Filter the data based on a condition

Let's update the query to filter the results based on a condition. For example, the following query shows events that come from `sensorA`."

1. Update the query with the following sample:

    ```sql
    SELECT 
        time,
        dspl AS SensorName,
        temp AS Temperature,
        hmdt AS Humidity
    INTO
       youroutputalias
    FROM
        yourinputalias
    WHERE dspl='sensorA'
    ```
2. Select **Test query** to see the results of the query.

    :::image type="content" source="./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-08.png" alt-text="Screenshot that shows the query results with the filter.":::

### Query: Alert to trigger a business workflow

Let's make our query more detailed. For every type of sensor, we want to monitor average temperature per 30-second window and display results only if the average temperature is above 100 degrees.

1. Update the query to: 

    ```sql
    SELECT 
        System.Timestamp AS OutputTime,
        dspl AS SensorName,
        Avg(temp) AS AvgTemperature
    INTO
       youroutputalias
    FROM
        yourinputalias TIMESTAMP BY time
    GROUP BY TumblingWindow(second,30),dspl
    HAVING Avg(temp)>100
    ```
1. Select **Test query** to see the results of the query. 

    :::image type="content" source="./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-10.png" alt-text="Screenshot that shows the query with a tumbling window.":::

    You should see results that contain only 245 rows and names of sensors where the average temperate is greater than 100. This query groups the stream of events by **dspl**, which is the sensor name, over a **Tumbling Window** of 30 seconds. Temporal queries must state how you want time to progress. By using the **TIMESTAMP BY** clause, you have specified the **OUTPUTTIME** column to associate times with all temporal calculations. For detailed information, read about [Time Management](/stream-analytics-query/time-management-azure-stream-analytics) and [Windowing functions](/stream-analytics-query/windowing-azure-stream-analytics).

### Query: Detect absence of events

How can we write a query to find a lack of input events? Let's find the last time that a sensor sent data and then didn't send events for the next 5 seconds.

1. Update the query to: 

    ```sql
    SELECT 
        t1.time,
        t1.dspl AS SensorName
    INTO
       youroutputalias
    FROM
        yourinputalias t1 TIMESTAMP BY time
    LEFT OUTER JOIN yourinputalias t2 TIMESTAMP BY time
    ON
        t1.dspl=t2.dspl AND
        DATEDIFF(second,t1,t2) BETWEEN 1 and 5
    WHERE t2.dspl IS NULL
    ```
2. Select **Test query** to see the results of the query. 

    :::image type="content" source="./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-11.png" alt-text="Screenshot that shows the query that detects absence of events.":::


    Here we use a **LEFT OUTER** join to the same data stream (self-join). For an **INNER** join, a result is returned only when a match is found.  For a **LEFT OUTER** join, if an event from the left side of the join is unmatched, a row that has NULL for all the columns of the right side is returned. This technique is useful to find an absence of events. For more information, see [JOIN](/stream-analytics-query/join-azure-stream-analytics).

## Conclusion

The purpose of this article is to demonstrate how to write different Stream Analytics Query Language queries and see results in the browser. However, this article is just to get you started. Stream Analytics supports various inputs and outputs and can even use functions in Azure Machine Learning to make it a robust tool for analyzing data streams. For more information about how to write queries, read the article about [common query patterns](stream-analytics-stream-analytics-query-patterns.md).
