---
title: Data streaming in Azure SQL Edge (Preview)
description: Learn about data streaming in Azure SQL Edge (Preview).
keywords:
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2020
---

# Data streaming in Azure SQL Edge (Preview)

Azure SQL Edge (Preview) provides the following options to implement data streaming: 

- Deploying Azure Stream Analytics edge jobs created in Azure. For more information, see [Deploy Azure Stream Analytics jobs](deploy-dacpac.md).
- Using T-SQL streaming to create streaming jobs in Azure SQL Edge, without the need to configure streaming jobs in Azure. 

Although it's possible to use both options to implement data streaming in Azure SQL Edge, you should use only one of them. When you're using both, there can be race conditions that affect the functioning of the data streaming operations.

T-SQL streaming is the focus of this article. It provides real-time data streaming, analytics, and event-processing to analyze and process high volumes of fast-streaming data from multiple sources, simultaneously. T-SQL streaming is built by using the same high-performance streaming engine that powers [Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-introduction) in Microsoft Azure. The feature supports a similar set of capabilities offered by Azure Stream Analytics running on the edge.

As with Stream Analytics, T-SQL Streaming recognizes patterns and relationships in information extracted from a number of IoT input sources, including devices, sensors, and applications. You can use these patterns to trigger actions and initiate workflows. For example, you can create alerts, feed information to a reporting or visualization solution, or store the data for later use. 

T-SQL streaming can help you:

* Analyze real-time telemetry streams from IoT devices.
* Use real-time analytics of data generated from autonomous and driverless vehicles.
* Use remote monitoring and predictive maintenance of high-value industrial or manufacturing assets.
* Use anomaly detection and pattern recognition of IoT sensor readings in an agriculture or an energy farm.

## How does T-SQL streaming work?

T-SQL streaming works in exactly the same manner as [Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-introduction#how-does-stream-analytics-work). For example, it uses the concept of streaming *jobs* for processing of real-time data streaming. 

A stream analytics job consists of:

- **Stream input**: This defines the connections to a data source to read the data stream from. Azure SQL Edge currently supports the following stream input types:
    - Edge Hub
    - Kafka (Support for Kafka inputs is currently only available on Intel/AMD64 versions of Azure SQL Edge.)

- **Stream output**: This defines the connections to a data source to write the data stream to. Azure SQL Edge currently supports the following stream output types
    - Edge Hub
    - SQL (The SQL output can be a local database within the instance of Azure SQL Edge, or a remote SQL Server or Azure SQL Database.) 
    - Azure Blob storage

- **Stream query**: This defines the transformation, aggregations, filter, sorting, and joins  to be applied to the input stream, before it's written to the stream output. The stream query is based on the same query language as that used by Stream Analytics. For more information, see [Stream Analytics Query Language](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference?).

> [!IMPORTANT]
> T-SQL streaming, unlike Stream Analytics, doesn't currently support [using reference data for lookups](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-use-reference-data) or [using UDF's and UDA's in a stream job](https://docs.microsoft.com/azure/stream-analytics/streaming-technologies#you-want-to-write-udfs-udas-and-custom-deserializers-in-a-language-other-than-javascript-or-c).

> [!NOTE]
> T-SQL streaming only supports a subset of the language surface area supported by Stream Analytics. For more information, see [Stream Analytics Query Language](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference?).

## Limitations and restrictions

The following limitations and restrictions apply to T-SQL streaming. 

- Only one streaming job can be active at any specific time. Jobs that are already running must be stopped before starting another job.
- Each streaming job execution is single-threaded. If the streaming job contains multiple queries, each query is evaluated in serial order.

## Next steps

- [Create a Stream Analytics job in Azure SQL Edge (Preview) ](create-stream-analytics-job.md)
- [Viewing metadata associated with stream jobs in Azure SQL Edge (Preview) ](streaming-catalog-views.md)
- [Create external stream](create-external-stream-transact-sql.md)