---
title: Overview of Azure Stream Analytics
description: Learn about Stream Analytics, a managed service that helps you analyze streaming data from the Internet of Things (IoT) in real-time.
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: overview
ms.custom: mvc
ms.date: 10/9/2020
#Customer intent: "What is Azure Stream Analytics and why should I care? As an IT Pro or developer, how do I use Stream Analytics to perform analytics on data streams?".
---

# What is Azure Stream Analytics?

Azure Stream Analytics is a real-time analytics and complex event-processing engine that is designed to analyze and process high volumes of fast streaming data from multiple sources simultaneously. Patterns and relationships can be identified in information extracted from a number of input sources including devices, sensors, clickstreams, social media feeds, and applications. These patterns can be used to trigger actions and initiate workflows such as creating alerts, feeding information to a reporting tool, or storing transformed data for later use. Also, Stream Analytics is available on Azure IoT Edge runtime, enabling to process data on IoT devices. 

The following scenarios are examples of when you can use Azure Stream Analytics:

* Analyze real-time telemetry streams from IoT devices
* Web logs/clickstream analytics
* Geospatial analytics for fleet management and driverless vehicles
* Remote monitoring and predictive maintenance of high value assets
* Real-time analytics on Point of Sale data for inventory control and anomaly detection

## How does Stream Analytics work?

An Azure Stream Analytics job consists of an input, query, and an output. Stream Analytics ingests data from Azure Event Hubs (including Azure Event Hubs from Apache Kafka), Azure IoT Hub, or Azure Blob Storage. The query, which is based on SQL query language, can be used to easily filter, sort, aggregate, and join streaming data over a period of time. You can also extend this SQL language with JavaScript and C# user defined functions (UDFs). You can easily adjust the event ordering options and duration of time windows when preforming aggregation operations through simple language constructs and/or configurations.

Each job has one or several outputs for the transformed data, and you can control what happens in response to the information you've analyzed. For example, you can:

* Send data to services such as Azure Functions, Service Bus Topics or Queues to trigger communications or custom workflows downstream.
* Send data to a Power BI dashboard for real-time dashboarding.
* Store data in other Azure storage services (e.g. Azure Data Lake, Azure Synapse Analytics, etc.) to train a machine learning model based on historical data or perform batch analytics.

The following image shows how data is sent to Stream Analytics, analyzed, and sent for other actions like storage or presentation:

![Stream Analytics intro pipeline](./media/stream-analytics-introduction/stream-analytics-e2e-pipeline.png)

## Key capabilities and benefits

Azure Stream Analytics is designed to be easy to use, flexible, reliable, and scalable to any job size. It is available across multiple Azure regions, and run on IoT Edge or Azure Stack.

## Ease of getting started

Azure Stream Analytics is easy to start. It only takes a few clicks to connect to multiple sources and sinks, creating an end-to-end pipeline. Stream Analytics can connect to [Azure Event Hubs](../event-hubs/index.yml) and [Azure IoT Hub](../iot-hub/index.yml) for streaming data ingestion, as well as [Azure Blob storage](../storage/common/storage-introduction.md) to ingest historical data. Job input can also include static or slow-changing reference data from Azure Blob storage or [SQL Database](stream-analytics-use-reference-data.md#azure-sql-database) that you can join to streaming data to perform lookup operations.

Stream Analytics can route job output to many storage systems such as [Azure Blob storage](../storage/common/storage-introduction.md), [Azure SQL Database](/azure/sql-database/), [Azure Data Lake Store](../data-lake-store/index.yml), and [Azure CosmosDB](../cosmos-db/introduction.md). You can also run batch analytics on stream outpust with Azure Synapse Analytics or HDInsight, or you can send the output to another service, like Event Hubs for consumption or [Power BI](/power-bi/) for real-time visualization.

For the entire list of Stream Analytics outputs, see [Understand outputs from Azure Stream Analytics](stream-analytics-define-outputs.md).

## Programmer productivity

Azure Stream Analytics uses a SQL query language that has been augmented with powerful temporal constraints to analyze data in motion. You can also create jobs by using developer tools like Azure PowerShell, Azure CLI, [Stream Analytics Visual Studio tools](stream-analytics-tools-for-visual-studio-install.md), the [Stream Analytics Visual Studio Code extension](quick-create-visual-studio-code.md), or Azure Resource Manager templates. Using developer tools allows you to develop transformation queries offline and use the [CI/CD pipeline](stream-analytics-tools-for-visual-studio-cicd.md) to submit jobs to Azure.

The Stream Analytics query language allows to perform CEP (Complex Event Procssing) by offering a wide array of functions for analyzing streaming data. This query language supports simple data manipulation, aggregation and analytics functions, [geospatial functions](./stream-analytics-geospatial-functions.md), [pattern matching](/stream-analytics-query/match-recognize-stream-analytics) and [anomaly detection](./stream-analytics-machine-learning-anomaly-detection.md). You can edit queries in the portal or using our development tools, and test them using sample data that is extracted from a live stream.

You can extend the capabilities of the query language by defining and invoking additional functions. You can define function calls in the Azure Machine Learning to take advantage of Azure Machine Learning solutions, and integrate JavaScript or C# user-defined functions (UDFs) or user-defined aggregates to perform complex calculations as part a Stream Analytics query.

## Fully managed

Azure Stream Analytics is a fully managed (PaaS) offering on Azure. You don't have to provision any hardware or infrastructure, update OS or software. Azure Stream Analytics fully manages your job, so you can focus on your business logic and not on the infrastructure.


## Run in the cloud or on the intelligent edge

Azure Stream Analytics can run in the cloud, for large-scale analytics, or run on IoT Edge or Azure Stack for ultra-low latency analytics. Azure Stream Analytics uses the same tools and query language on both cloud and the edge, enabling developers to build truly hybrid architectures for stream processing. 

## Low total cost of ownership

As a cloud service, Stream Analytics is optimized for cost. There are no upfront costs involved - you only pay for the [streaming units you consume](stream-analytics-streaming-unit-consumption.md). There is no commitment or cluster provisioning required, and you can scale the job up or down based on your business needs.

## Mission-critical ready

Azure Stream Analytics is available across multiple regions worldwide and is designed to run mission-critical workloads by supporting reliability, security and compliance requirements.

### Reliability

Azure Stream Analytics guarantees exactly-once event processing and at-least-once delivery of events, so events are never lost. Exactly-once processing is guaranteed with selected output as described in [Event Delivery Guarantees](/stream-analytics-query/event-delivery-guarantees-azure-stream-analytics).

Azure Stream Analytics has built-in recovery capabilities in case the delivery of an event fails. Stream Analytics also provides built-in checkpoints to maintain the state of your job and provides repeatable results.

As a managed service, Stream Analytics guarantees event processing with a 99.9% availability at a minute level of granularity. For more information, see the [Stream Analytics SLA](https://azure.microsoft.com/support/legal/sla/stream-analytics/v1_0/) page. 

### Security

In terms of security, Azure Stream Analytics encrypts all incoming and outgoing communications and supports TLS 1.2. Built-in checkpoints are also encrypted. Stream Analytics doesn't store the incoming data since all processing is done in-memory. 
Stream Analytics also supports Azure Virtual Networks (VNET) when running a job in a [Stream Analytics Cluster](./cluster-overview.md).

### Compliance

Azure Stream Analytics follows multiple compliance certifications as described in the [overview of Azure compliance](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942). 

## Performance

Stream Analytics can process millions of events every second and it can deliver results with ultra low latencies. It allows you to scale-up and scale-out to handle large real-time and complex event processing applications. Stream Analytics supports higher performance by partitioning, allowing complex queries to be parallelized and executed on multiple streaming nodes. Azure Stream Analytics is built on [Trill](https://github.com/Microsoft/Trill), a high-performance in-memory streaming analytics engine developed in collaboration with Microsoft Research.

## Next steps

You now have an overview of Azure Stream Analytics. Next, you can dive deep and create your first Stream Analytics job:

* [Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md).
* [Create a Stream Analytics job by using Azure PowerShell](stream-analytics-quick-create-powershell.md).
* [Create a Stream Analytics job by using Visual Studio](stream-analytics-quick-create-vs.md).
* [Create a Stream Analytics job by using Visual Studio Code](quick-create-visual-studio-code.md).