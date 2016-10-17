<properties
	pageTitle="Get started with Azure Stream Analytics to process data from IoT devices. | Microsoft Azure"
	description="IoT sensor tags and data streams with stream analytics and real-time data processing"
    keywords="iot solution, get started with iot"
	services="stream-analytics"
	documentationCenter=""
	authors="jeffstokes72"
	manager="jhubbard"
	editor="cgronlun"
/>

<tags
	ms.service="stream-analytics"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.tgt_pltfrm="na"
	ms.workload="data-services"
	ms.date="09/26/2016"
	ms.author="jeffstok"
/>

# Get started with Azure Stream Analytics to process data from IoT devices

In this tutorial, you will learn how to create stream-processing logic to gather data from Internet of Things (IoT) devices. We will use a real-world, Internet of Things (IoT) use case to demonstrate how to build your solution quickly and economically.

## Prerequisites

-   [Azure subscription](https://azure.microsoft.com/pricing/free-trial/)
-   Sample query and data files downloadable from [GitHub](https://aka.ms/azure-stream-analytics-get-started-iot)

## Scenario

Contoso, which is a company in the industrial automation space, has completely automated its manufacturing process. The machinery in this plant has sensors that are capable of emitting streams of data in real time. In this scenario, a production floor manager wants to have real-time insights from the sensor data to look for patterns and take actions on them. We will use the Stream Analytics Query Language (SAQL) over the sensor data to find interesting patterns from the incoming stream of data.

Here data is being generated from a Texas Instruments sensor tag device.

![Texas Instruments sensor tag](./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-01.jpg)

The payload of the data is in JSON format and looks like the following:


	{
    	"time": "2016-01-26T20:47:53.0000000",  
	    "dspl": "sensorE",  
    	"temp": 123,  
	    "hmdt": 34  
	}  

In a real-world scenario, you could have hundreds of these sensors generating events as a stream. Ideally, a gateway device would run code to push these events to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/) or [Azure IoT Hubs](https://azure.microsoft.com/services/iot-hub/). Your Stream Analytics job would ingest these events from Event Hubs and run real-time analytics queries against the streams. Then, you could send the results to one of the [supported outputs](stream-analytics-define-outputs.md).

For ease of use, this getting started guide provides a sample data file, which was captured from real sensor tag devices. You can run queries on the sample data and see results. In subsequent tutorials, you will learn how to connect your job to inputs and outputs and deploy them to the Azure service.

## Create a Stream Analytics job

1. In the [Azure portal](http://manage.windowsazure.com), click **STREAM ANALYTICS**, and then click **NEW** in the lower-left corner of the page to create a new analytics job.

	![Create a new Stream Analytics job](./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-02.png)

2. Click **QUICK CREATE**.

3. For the **REGIONAL MONITORING STORAGE ACCOUNT** setting, click **CREATE NEW STORAGE ACCOUNT**, and give it a unique name. Azure Stream Analytics will use this account to store monitoring information for all your future jobs.

	> [AZURE.NOTE] You should create this storage account only once per region. This storage will be shared across all Stream Analytics jobs that are created in that region.

4. Click **CREATE STREAM ANALYTICS JOB** at the bottom of the page.

	![Storage account configuration](./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-03.jpg)

## Azure Stream Analytics query

Click the **QUERY** tab to go to the Query Editor. The **QUERY** tab contains a T-SQL query that performs the transformation over the incoming event data.

## Archive your raw data

The simplest form of query is a pass-through query that archives all input data to its designated output.

![Archive job query](./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-04.png)

Now, download the sample data file from [GitHub](https://aka.ms/azure-stream-analytics-get-started-iot) to a location on your computer. Paste the query from the PassThrough.txt file. Click the **Test** button, and then select the HelloWorldASA-InputStream.json data file from your downloaded location.

![Test button in Stream Analytics](./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-05.png)

![Test input stream](./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-06.png)

You can see the results of the query in the browser as shown in the following screenshot.

![Test results](./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-07.png)

## Filter the data based on a condition

Let’s try to filter the results based on a condition. We would like to show results for only those events that come from “sensorA.” The query is in the Filtering.txt file.

![Filtering a data stream](./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-08.png)

Note that the case-sensitive query compares a string value. Click the **Rerun** button to execute the query. The query should return 389 rows out of 1860 events.

![Second output results from query test](./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-09.png)

## Alert to trigger a business workflow

Let's make our query more detailed. For every type of sensor, we want to monitor average temperature per 30-second window and display results only if the average temperature is above 100 degrees. We will write the following query and then click **Rerun** to see the results. The query is in the ThresholdAlerting.txt file.

![30-second filter query](./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-10.png)

You should now see results that contain only 245 rows and names of sensors where the average temperate is greater than 100. This query groups the stream of events by **dspl**, which is the sensor name, over a **Tumbling Window** of 30 seconds. Temporal queries must state how we want time to progress. By using the **TIMESTAMP BY** clause, we have specified the **OUTPUTTIME** column to associate times with all temporal calculations. For detailed information, read the MSDN articles about [Time Management](https://msdn.microsoft.com/library/azure/mt582045.aspx) and [Windowing functions](https://msdn.microsoft.com/library/azure/dn835019.aspx).

![Temp over 100](./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-11.png)

## Detect absence of events

How can we write a query to find a lack of input events? Let’s find the last time that a sensor sent data and then did not send events for the next minute. The query is in the AbsenseOfEvent.txt file.

![Detect absence of events](./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-12.png)

Here we use a **LEFT OUTER** join to the same data stream (self-join). For an **INNER** join, a result is returned only when a match is found.  For a **LEFT OUTER** join, if an event from the left side of the join is unmatched, a row that has NULL for all the columns of the right side is returned. This technique is very useful to find an absence of events. See our MSDN documentation for more information about [JOIN](https://msdn.microsoft.com/library/azure/dn835026.aspx).

![Join results](./media/stream-analytics-get-started-with-iot-devices/stream-analytics-get-started-with-iot-devices-13.png)

## Conclusion

The purpose of this tutorial is to demonstrate how to write different Stream Analytics Query Language queries and see results in the browser. However, this is just getting started. You can do so much more with Stream Analytics. Stream Analytics supports a variety of inputs and outputs and can even use functions in Azure Machine Learning to make it a robust tool for analyzing data streams. You can start to explore more about Stream Analytics by using our [learning map](https://azure.microsoft.com/documentation/learning-paths/stream-analytics/). For more information about how to write queries, read the article about [common query patterns](./stream-analytics-stream-analytics-query-patterns.md).
