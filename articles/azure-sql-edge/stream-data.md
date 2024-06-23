---
title: Data streaming in Azure SQL Edge
description: Learn about data streaming in Azure SQL Edge.
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: conceptual
---
# Data streaming in Azure SQL Edge

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

Azure SQL Edge provides a native implementation of data streaming capabilities called Transact-SQL (T-SQL) streaming. It provides real-time data streaming, analytics, and event-processing to analyze and process high volumes of fast-streaming data from multiple sources, simultaneously. T-SQL streaming is built by using the same high-performance streaming engine that powers [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md) in Microsoft Azure. The feature supports a similar set of capabilities offered by Azure Stream Analytics running on the edge.

As with Stream Analytics, T-SQL Streaming recognizes patterns and relationships in information extracted from several IoT input sources, including devices, sensors, and applications. You can use these patterns to trigger actions and initiate workflows. For example, you can create alerts, feed information to a reporting or visualization solution, or store the data for later use.

T-SQL streaming can help you:

- Analyze real-time telemetry streams from IoT devices.
- Use real-time analytics of data generated from autonomous and driverless vehicles.
- Use remote monitoring and predictive maintenance of high-value industrial or manufacturing assets.
- Use anomaly detection and pattern recognition of IoT sensor readings in an agriculture or an energy farm.

## How does T-SQL streaming work?

T-SQL streaming works in exactly the same manner as [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md). For example, it uses the concept of streaming *jobs* for processing of real-time data streaming.

A stream analytics job consists of:

- **Stream input**: This defines the connections to a data source to read the data stream from. Azure SQL Edge currently supports the following stream input types:
  - Edge Hub
  - Kafka (Support for Kafka inputs is currently only available on Intel/AMD64 versions of Azure SQL Edge.)

- **Stream output**: This defines the connections to a data source to write the data stream to. Azure SQL Edge currently supports the following stream output types
  - Edge Hub
  - SQL (The SQL output can be a local database within the instance of Azure SQL Edge, or a remote SQL Server or Azure SQL Database.)

- **Stream query**: This defines the transformation, aggregations, filter, sorting, and joins  to be applied to the input stream, before it's written to the stream output. The stream query is based on the same query language as that used by Stream Analytics. For more information, see [Stream Analytics Query Language](/stream-analytics-query/stream-analytics-query-language-reference).

> [!IMPORTANT]  
> T-SQL streaming, unlike Stream Analytics, doesn't currently support [using reference data for lookups](../stream-analytics/stream-analytics-use-reference-data.md) or [using UDF's and UDA's in a stream job](../stream-analytics/streaming-technologies.md#you-want-to-write-udfs-udas-and-custom-deserializers-in-a-language-other-than-javascript-or-c).

> [!NOTE]  
> T-SQL streaming only supports a subset of the language surface area supported by Stream Analytics. For more information, see [Stream Analytics Query Language](/stream-analytics-query/stream-analytics-query-language-reference).

## Limitations

The following limitations and restrictions apply to T-SQL streaming.

- Only one streaming job can be active at any specific time. Jobs that are already running must be stopped before starting another job.
- Each streaming job execution is single-threaded. If the streaming job contains multiple queries, each query is evaluated in serial order.
- When you stopped a streaming job in Azure SQL Edge, there may be some delay before the next streaming job can be started. This delay is introduced because the underlying streaming process needs to be stopped in response to the stop job request and then restarted in response to the start job request.
- T-SQL Streaming upto 32 partitions for a kafka stream. Attempts to configure a higher partition count results in an error.

## Next steps

- [Create a Stream Analytics job in Azure SQL Edge](create-stream-analytics-job.md)
- [Viewing metadata associated with stream jobs in Azure SQL Edge](streaming-catalog-views.md)
- [Create external stream](create-external-stream-transact-sql.md)
