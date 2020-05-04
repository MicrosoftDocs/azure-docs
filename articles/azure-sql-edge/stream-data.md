---
title: Data streaming in Azure SQL Edge Preview
description: Learn about data streaming in Azure SQL Edge
keywords:
services: sql-database-edge
ms.service: sql-database-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 04/28/2020
---

# Data streaming in Azure SQL Edge Preview

Azure SQL Edge Preview introduces support for a new feature, **T-SQL Streaming**, which provides real-time data streaming, analytics, and event-processing to analyze and process high volumes of fast streaming data from multiple sources simultaneously. *T-SQL Streaming* is built using the same high performance streaming engine that powers [Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-introduction) in Microsoft Azure, and supports the same set of capabilities offered by Azure Stream Analytics running on the edge.

> [!NOTE]
> Azure SQL Edge is currently in Preview, which means the T-SQL Streaming feature is also under preview and should NOT be used in production or pre-production environments.

As with Azure Stream Analytics, T-SQL Streaming enables recognition of patterns and relationships in information extracted from a number of IoT input sources including devices, sensors, and applications. These patterns can be used to trigger actions and initiate workflows such creating alerts, feeding information to a reporting or visualization solution, or storing the data for later usage. The following scenarios are examples of when you can use T-SQL Streaming can be used

* Analyze real-time telemetry streams from IoT devices
* Real-time Analytics of data generated from autonomous and driverless vehicles.
* Remote monitoring and predictive maintenance of high value industrial or manufacturing assets
* Anomaly detection and/or pattern recognition of IoT sensor readings in an agriculture or an energy farm

## How does T-SQL Streaming work?

T-SQL Streaming works in exactly the same manner as [Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-introduction#how-does-stream-analytics-work), i.e. it uses the concept of streaming jobs for processing of real-time data streaming. A stream analytics job, consists of

- Stream Input - A Stream input defines the connections to a data source to read the data stream from. Azure SQL Edge, currently supports the following stream input types
    * Edge Hub
    * Kafka - Support for Kafka inputs is currently only available on Intel/AMD64 versions of Azure SQL Edge.

- Stream Output - A Stream output defines the connections to a data source to write the data stream to. Azure SQL Edge currently supports the following stream output types
    * Edge Hub
    * SQL - The SQL output can be a local database within the SQL Edge instance or a remote SQL Server or Azure SQL Database. 
    * Azure Blob Storage

- Stream Query - The stream query defines the transformation, aggregations, filter, sorting, and joins that needs to be applied to the input stream before it's written to the stream output. The stream query is based on the same query language used by Azure Stream Analytics. For more information on Azure Stream Analytics query language, refer [Stream Analytics Query Language](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference?).

> [!IMPORTANT]
> T-SQL Streaming, unlike Azure Stream Analytics, currently does not support [using reference data for lookups](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-use-reference-data) or [using UDF's and UDA's in stream job](https://docs.microsoft.com/azure/stream-analytics/streaming-technologies#you-want-to-write-udfs-udas-and-custom-deserializers-in-a-language-other-than-javascript-or-c).

> [!NOTE]
> T-SQL Streaming only supports a subset of language surface area supported by Azure Stream Analytics. For more information on Azure Stream Analytics query language, refer [Stream Analytics Query Language](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference?).

## Limitations and Restrictions

The following limitations and restrictions apply to SQL Streaming. 

- Only one streaming job can be active at any give time. Users will have to stop and already executing job before starting another job.
- Each streaming job execution is single threaded. If the streaming job contains multiple queries, each query will be evaluated in serial order.

## Next Steps

[Create a Stream Analytics job in Azure SQL Edge Preview](create-stream-analytics-job.md)
[Start, Stop, Drop a stream analytics job in Azure SQL Edge Preview](overview.md)
[Viewing metadata associated with stream jobs in Azure SQL Edge Preview](overview.md)
[Create External Stream](overview.md)