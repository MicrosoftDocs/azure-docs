---
title: Overview of Azure Stream Analytics
description: Learn about Stream Analytics, a managed service that helps you analyze streaming data from the Internet of Things (IoT) in real-time.
services: stream-analytics
author: jseb225
ms.author: jeanb
manager: kfile
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: overview
ms.workload: data-services
ms.custom: mvc
ms.date: 03/27/2018
#Customer intent: "What is Azure Stream Analytics and why should I care? As a IT Pro or developer, how do I use Stream Analytics to perform analytics on data streams?".

---

# What is Stream Analytics?

Azure Stream Analytics is an event-processing engine that allows you to examine high volumes of data streaming from devices. Incoming data can be from devices, sensors, web sites, social media feeds, applications, and more. It also supports extracting information from data streams, identifying patterns, and relationships. You can then use these patterns to trigger other actions downstream, like alerts, feed information to a reporting tool, or store it for later use.

Following are some examples where Azure Stream Analytics can be used: 

* Internet of Things(IoT) Sensor fusion and real-time analytics on device telemetry
* Web logs/clickstream analytics
* Geospatial analytics for fleet management and driverless vehicles
* Remote monitoring and predictive maintenance of hi-value assets
* Real-time analytics on Point of Sale data for inventory control and anomaly detection

## How does Stream Analytics work?

Azure Stream Analytics starts with a source of streaming data that is ingested into Azure Event Hub, Azure IoT Hub or from a data store like Azure Blob Storage. To examine the streams, you create a Stream Analytics job that specifies the input source that streams data. The job also specifies a transformation query that defines how to look for data, patterns, or relationships. The transformation query leverages a SQL-like query language that is used to filter, sort, aggregate, and join streaming data over a period of time. When executing the job, you can adjust the event ordering options, and duration of time windows when performing aggregation operations.

After analyzing the incoming data, you specify an output for the transformed data, and you can control what to do in response to the information you've analyzed. For example, you can take actions like:

* Send data to a monitored queue to trigger custom workflows downstream.
* Send data to Power BI dashboard for real-time visualization.
* Archive data to other Azure storage services.

The following image illustrates the Stream Analytics pipeline, Your Stream Analytics job can use all or a selected set of inputs and outputs. This image shows how data is sent to Stream Analytics, analyzed, and sent for other actions like storage, or presentation:

![Stream Analytics pipeline](./media/stream-analytics-introduction/stream_analytics_intro_pipeline.png)

## Key capabilities and benefits

Azure Stream Analytics is designed to be easy to use, flexible, reliable, and scalable to any job size. It is available across multiple datacenters as well as sovereign clouds. Following image illustrates the key capabilities of Azure Stream Analytics:

![Stream Analytics key capabilities](./media/stream-analytics-introduction/stream_analytics_key_capabilities.png)

## Ease of getting started

Azure Stream Analytics is easy to get started. It only takes few clicks to connect to multiple sources, sinks and to create an end to end pipeline. Stream Analytics can connect to [Azure Event Hubs](https://docs.microsoft.com/azure/event-hubs/), [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/) for streaming data ingestion. It can also connect to [Azure Blob storage](https://docs.microsoft.com/azure/storage/storage-introduction) service to ingest historical data. It can combine data from event hubs with other data sources and processing engines. Job input can also include reference data that is static or slow-changing data and you can join streaming data to this reference data to perform lookup operations.

Stream Analytics can route job output to many storage systems such as [Azure Blob](https://docs.microsoft.com/azure/storage/storage-introduction), [Azure SQL Database](https://docs.microsoft.com/azure/sql-database/), [Azure Data Lake Stores](https://docs.microsoft.com/azure/data-lake-store/), or [Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/introduction). After storing, you can run batch analytics with Azure HDInsight or send the output to another service such as event hubs for consumption or to [Power BI](https://docs.microsoft.com/power-bi/) for real-time visualization by using Power Bi streaming API.

## Programmer Productivity

Azure Stream Analytics uses a simple SQL based query language that has been augmented with powerful temporal constraints to analyze data in motion. To define job transformations, you use a simple, declarative [Stream Analytics query language](https://msdn.microsoft.com/library/azure/dn834998.aspx) that lets you author complex temporal queries and analytics using simple SQL constructs. Stream Analytics query language is consistent to the SQL language, familiarity with SQL language is sufficient to get started with creating jobs. You can also create jobs by using developer tools like Azure PowerShell, [Stream Analytics Visual Studio tools](stream-analytics-tools-for-visual-studio-install.md), or Azure Resource Manager templates. Using developer tools allow you to develop transformation queries offline and use the [CI/CD pipeline](stream-analytics-tools-for-visual-studio-cicd.md) to submit jobs to Azure. 

The Stream Analytics query language offers a wide array of functions for analyzing and processing the streaming data. This query language supports simple data manipulation, aggregation functions to complex geo-spatial functions. You can edit queries in the portal, and test them using sample data that is extracted from the live stream.

You can extend the capabilities of the query language by defining and invoking additional functions. You can define function calls in the Azure Machine Learning service to take advantage of Azure Machine Learning solutions and integrate JavaScript user-defined functions (UDFs) or user-defined aggregates to perform complex calculations as part a Stream Analytics query.

## Fully managed 

Azure Stream Analytics is a fully managed serverless (PaaS) offering on Azure. Which means you don’t have to provision any hardware or manage clusters to run your jobs. Azure Stream Analytics fully manages your job, by taking care of setting up complex compute clusters in the cloud and the performance tuning necessary to run the job. Integration with Azure Event Hubs and Azure IoT Hub allows jobs to ingest millions of events per second coming from connected devices, clickstreams, and log files, to name a few. Using the partitioning feature of event hubs, you can partition computations into logical steps, each with the ability to be further partitioned to increase scalability.

## Low Total Cost of Ownership

As a cloud service, Stream Analytics is optimized for cost. There are no upfront costs involved, you only pay for the [streaming units you consume](stream-analytics-streaming-unit-consumption.md), and the amount of data processed. There is no commitment or cluster provisioning required. You can scale the job up or down your steaming jobs based on your business needs. 

## Reliability 

As a managed service, Stream Analytics guarantees event processing with a 99.9% availability, helps prevent data loss, and provides business continuity refer to the [Stream Analytics SLA](https://azure.microsoft.com/support/legal/sla/stream-analytics/v1_0/) page for more details. Stream Analytics can process millions of events every second and it can deliver results with low latency.
Stream Analytics guarantees exactly once event processing and at least once delivery of events. It has built-in recovery capabilities in case the delivery of an event fails. Stream Analytics can internally maintain the state of your job, you can start a job from its last output time, provides repeatable results by providing same results all the time. This feature of Stream Analytics enables you to go back in time and investigate computations when doing root-cause analysis. 

## Performance

Azure Stream Analytics is optimized for high performance, it can process streaming data and perform in memory computations. It allows you to scale-up or scale-down to handle real-time and complex event processing applications. Stream Analytics supports performance by partitioning. A complex query can be parallelized and executed on multiple streaming nodes. 

## Next steps

You now have an overview of Azure Stream Analytics. Next, you can dive deep and create your first Stream Analytics job:

* [Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md).
* [Create a Stream Analytics job by using Azure PowerShell](stream-analytics-quick-create-powershell.md).
