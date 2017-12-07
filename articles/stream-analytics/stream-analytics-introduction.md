---
title: Introduction to Stream Analytics | Microsoft Docs
description: Learn about Stream Analytics, a managed service that helps you analyze streaming data from the Internet of Things (IoT) in real-time.
keywords: analytics as a service, managed services, stream processing, streaming analytics, what is stream analytics
services: stream-analytics
documentationcenter: ''
author: samacha
manager: jhubbard
editor: cgronlun

ms.assetid: 613c9b01-d103-46e0-b0ca-0839fee94ca8
ms.service: stream-analytics
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 10/17/2017
ms.author: samacha

---

# What is Stream Analytics?

Azure Stream Analytics is a managed event-processing engine set up real-time analytic computations on streaming data. The data can come from devices, sensors, web sites, social media feeds, applications, infrastructure systems, and more. 

Use Stream Analytics to examine high volumes of data streaming from devices or processes, extract information from that data stream, identify patterns, trends, and relationships. Use those patterns to trigger other processes or actions, like alerts, automation workflows, feed information to a reporting tool, or store it for later investigation. 

Some examples:

* Stock-trading analysis and alerts.
* Fraud detection, data, and identify protections. 
* Embedded sensor and actuator analysis.
* Web clickstream analytics.

## How does Stream Analytics work?

This diagram illustrates the Stream Analytics pipeline, showing how data is ingested, analyzed, and then sent for presentation or action. 

![Stream Analytics pipeline](./media/stream-analytics-introduction/stream_analytics_intro_pipeline.png)

Stream Analytics starts with a source of streaming data. The data can be ingested into Azure from a device using an Azure event hub or IoT hub. The data can also be pulled from a data store like Azure Blob Storage. 

To examine the stream, you create a Stream Analytics *job* that specifies from where the data comes. The job also specifies a *transformation*;how to look for data, patterns, or relationships. For this task, Stream Analytics supports a SQL-like query language to  filter, sort, aggregate, and join streaming data over a time period.

Finally, the job specifies an output for that transformed data. You control what to do in response to the information you've analyzed. For example, in response to analysis, you might:

* Send a command to change device settings. 
* Send data to a monitored queue for further action based on findings. 
* Send data to a Power BI dashboard.
* Send data to storage like Data Lake Store, Azure SQL Database, or Azure Blob storage.

You can adjust the number of events processed per second while the job is running. You can also produce diagnostic logs for troubleshooting.

## Key capabilities and benefits

Stream Analytics is designed to be easy to use, flexible, and scalable to any job size.

### Connect inputs and outputs

Stream Analytics connects directly to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/) and [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) for stream ingestion, and to [Azure Blob storage service](https://docs.microsoft.com/azure/storage/storage-introduction#blob-storage-accounts) to ingest historical data. Combine data from event hubs with Stream Analytics with other data sources and processing engines. Job input can also include reference data (static or slow-changing data). You can join streaming data to this reference data to perform lookup operations the same way you would with database queries.

Route Stream Analytics job output in many directions. Write to storage like Azure Blob, Azure SQL Database, Azure Data Lake Stores, or Azure Cosmos DB. From there, you could run batch analytics with Azure HDInsight. Or send the output to another service for consumption by another process, such as event hubs, Azure Service Bus, queues, or to Power BI for visualization.

### Simple to use

To define transformations, you use a simple, declarative [Stream Analytics query language](https://msdn.microsoft.com/library/azure/dn834998.aspx) that lets you create sophisticated analyses with no programming. The query language takes streaming data as its input. You can then filter and sort the data, aggregate values, perform calculations, join data (within a stream or to reference data), and use geospatial functions. You can edit queries in the portal, using IntelliSense and syntax checking, and you can test queries using sample data that you can extract from the live stream.

### Extensible query language

You can extend the capabilities of the query language by defining and invoking additional functions. You can define function calls in the Azure Machine Learning service to take advantage of Azure Machine Learning solutions. You can also integrate JavaScript user-defined functions (UDFs) in order to perform complex calculations as part a Stream Analytics query.

### Scalable

Stream Analytics can handle up to 1 GB of incoming data per second. Integration with [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/) and [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) allows jobs to ingest millions of events per second coming from connected devices, clickstreams, and log files, to name a few. Using the partition feature of event hubs, you can partition computations into logical steps, each with the ability to be further partitioned to increase scalability.

### Low cost

As a cloud service, Stream Analytics is optimized for cost. Pay based on streaming-unit usage and the amount of data processed. Usage is derived based on the volume of events processed and the amount of compute power provisioned within the job cluster.

### Reliable

As a managed service, Stream Analytics helps prevent data loss and provides business continuity. If failures occur, the service provides built-in recovery capabilities. With the ability to internally maintain state, the service provides repeatable results ensuring it is possible to archive events and reapply processing in the future, always getting the same results. This enables you to go back in time and investigate computations when doing root-cause analysis, what-if analysis, and so on.

## Next steps

* Get started by [experimenting with inputs and queries from IoT devices](stream-analytics-get-started-with-azure-stream-analytics-to-process-data-from-iot-devices.md).
* Build an [end-to-end Stream Analytics solution](stream-analytics-real-time-fraud-detection.md) that examines telephone metadata to look for fraudulent calls.
* Find answers to your Stream Analytics questions in the [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics).

