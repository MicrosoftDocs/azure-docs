---
title: Introduction to Azure Stream Analytics
description: Learn about Azure Stream Analytics, a managed service that helps you analyze streaming data from the Internet of Things (IoT) in real time.
ms.service: azure-stream-analytics
ms.topic: overview
ms.custom: mvc
ms.date: 02/05/2026
#Customer intent: What is Azure Stream Analytics and why should I care? As an IT Pro or developer, how do I use Stream Analytics to perform analytics on data streams?
---

# Welcome to Azure Stream Analytics

Azure Stream Analytics is a fully managed stream processing engine that analyzes and processes large volumes of streaming data with submillisecond latencies. You can build a streaming data pipeline by using Stream Analytics to identify patterns and relationships in data that originates from various input sources including applications, devices, sensors, clickstreams, and social media feeds. Then, use these patterns to trigger actions and initiate workflows such as raising alerts, feeding information to a reporting tool, or storing transformed data for later use. Stream Analytics is also available on the Azure IoT Edge runtime, which enables you to process data directly from IoT devices. 

Here are a few example scenarios where you can use Stream Analytics:

- Anomaly detection in sensor data to detect spikes, dips, and slow positive and negative changes.
- Geo-spatial analytics for fleet management and driverless vehicles.
- Remote monitoring and predictive maintenance of high value assets.
- Clickstream analytics to determine customer behavior.
- Analyze real-time telemetry streams and logs from applications and IoT devices.

:::image type="content" source="./media/stream-analytics-introduction/stream-analytics-pipeline-overview.png" alt-text="Diagram that shows the stages Ingest, Analyze, and Deliver stages of a streaming pipeline." lightbox="./media/stream-analytics-introduction/stream-analytics-pipeline-overview.png":::

The following sections provide information about key capabilities and benefits of using Azure Stream Analytics.

## Fully managed service

Stream Analytics is a fully managed (PaaS) offering on Azure. You don't have to provision any hardware or infrastructure, update OS, or software. Stream Analytics fully manages your job, so you can focus on your business logic and not on the infrastructure.

## Ease of use 

Stream Analytics is easy to start. It takes only a few clicks to create an end-to-end streaming data pipeline that connects to multiple sources and sinks. 

You can create a Stream Analytics job that connects to Azure Event Hubs and Azure IoT Hub for streaming data ingestion, and Azure Blob storage or Azure Data Lake Storage Gen2 to ingest historical data. The input for the Stream Analytics job can also include static or slow-changing reference data from Azure Blob storage or SQL Database that you can join with streaming data to perform lookup operations. For more information on Stream Analytics **inputs**, see [Stream data as input into Stream Analytics](stream-analytics-define-inputs.md). 

You can route output from a Stream Analytics job to many storage systems such as Azure Blob storage, Azure SQL Database, Azure Data Lake Store, and Azure Cosmos DB. You can also run batch analytics on stream outputs by using Azure Synapse Analytics or HDInsight, or you can send the output to another service, like Event Hubs for consumption or Power BI for real-time visualization. For the entire list of Stream Analytics **outputs**, see [Understand outputs from Stream Analytics](stream-analytics-define-outputs.md).

The Stream Analytics no-code editor offers a no-code experience that enables you to develop Stream Analytics jobs effortlessly, using drag-and-drop functionality, without having to write any code. It further simplifies Stream Analytics job development experience. To learn more about the no-code editor, see [No-code stream processing in Stream Analytics](./no-code-stream-processing.md).

## Programmer productivity

Stream Analytics uses a SQL query language that's augmented with powerful temporal constraints to analyze data in motion. You can [create a Stream Analytics job using the Azure portal](stream-analytics-quick-create-portal.md). You can also create jobs by using developer tools such as the following ones:

- [Visual Studio Code](quick-create-visual-studio-code.md)
- [Visual Studio](stream-analytics-quick-create-vs.md)
- [Azure CLI](quick-create-azure-cli.md)
- [Azure PowerShell](stream-analytics-quick-create-powershell.md)
- [Bicep](quick-create-bicep.md)
- [Azure Resource Manager templates](quick-create-azure-resource-manager.md)
- [Terraform](quick-create-terraform.md)

Developer tools allow you to develop transformation queries offline and use the CI/CD pipeline to submit jobs to Azure.

The Stream Analytics query language allows you to perform Complex Event Processing (CEP) by offering a wide array of functions for analyzing streaming data. This query language supports simple data manipulation, aggregation and analytics functions, geospatial functions, pattern matching, and anomaly detection. You can edit queries in the portal or by using development tools, and test them by using sample data that is extracted from a live stream.

You can extend the capabilities of the query language by defining and invoking additional functions. You can define function calls in Azure Machine Learning to take advantage of Azure Machine Learning solutions, and integrate JavaScript or C# user-defined functions (UDFs) or user-defined aggregates to perform complex calculations as part of a Stream Analytics query.


## Run in the cloud or on the intelligent edge

Stream Analytics can run in the cloud, for large-scale analytics, or run on IoT Edge or Azure Stack for ultra-low latency analytics. Stream Analytics uses the same tools and query language on both cloud and the edge, enabling developers to build truly hybrid architectures for stream processing. 

## Low total cost of ownership

As a cloud service, Stream Analytics is optimized for cost. There are no upfront costs - you only pay for the [streaming units you consume](stream-analytics-streaming-unit-consumption.md). There's no commitment or cluster provisioning required, and you can scale the job up or down based on your business needs.


Stream Analytics is available across multiple regions worldwide and is designed to run mission-critical workloads by supporting reliability, security, and compliance requirements.

### Reliability

Stream Analytics guarantees exactly once event processing and at-least-once delivery of events, so events are never lost. Exactly once processing is guaranteed with selected output as described in [Event Delivery Guarantees](/stream-analytics-query/event-delivery-guarantees-azure-stream-analytics).

Stream Analytics has built-in recovery capabilities in case the delivery of an event fails. Stream Analytics also provides built-in checkpoints to maintain the state of your job and provides repeatable results.

For enhanced reliability, Stream Analytics in [availability zone](/azure/reliability/availability-zones-overview)-enabled regions automatically distributes job resources across multiple zones without extra configuration or cost. This zone-redundant deployment ensures that your streaming jobs continue processing even if an entire availability zone becomes unavailable, providing protection against zone-level infrastructure failures.

For more information on how Stream Analytics supports availability zones, and multiregion disaster recovery options, see [Reliability in Stream Analytics](/azure/reliability/reliability-stream-analytics).


As a managed service, Stream Analytics guarantees event processing with a 99.9% availability at a minute level of granularity. 

### Security

In terms of security, Stream Analytics encrypts all incoming and outgoing communications and supports Transport Layer Security (TLS) 1.2. Built-in checkpoints are also encrypted. Stream Analytics doesn't store the incoming data since all processing is done in-memory. Stream Analytics also supports Azure Virtual Networks when running a job in a [Stream Analytics Cluster](./cluster-overview.md).


## Performance

Stream Analytics can process millions of events every second and it can deliver results with ultra low latencies. It allows you to [scale out](stream-analytics-autoscale.md) to adjust to your workloads. Stream Analytics supports higher performance by partitioning, allowing complex queries to be parallelized and executed on multiple streaming nodes. Stream Analytics is built on [Trill](https://github.com/Microsoft/Trill), a high-performance in-memory streaming analytics engine developed in collaboration with Microsoft Research.

## Next steps

Try Stream Analytics by using a free Azure subscription.

> [!div class="nextstepaction"]
> [Try Stream Analytics](https://azure.microsoft.com/services/stream-analytics/)

You now have an overview of Stream Analytics. Next, you can dive deeper and create your first Stream Analytics job:

* [Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Create a Stream Analytics job by using Azure PowerShell](stream-analytics-quick-create-powershell.md)
* [Create a Stream Analytics job by using Visual Studio](stream-analytics-quick-create-vs.md)
* [Create a Stream Analytics job by using Visual Studio Code](quick-create-visual-studio-code.md)
