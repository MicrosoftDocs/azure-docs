---
title: Data streaming in Azure SQL Edge (Preview)
description: Learn about data streaming in Azure SQL Edge (Preview)
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

Azure SQL Edge (Preview) provides two different options to implement data streaming. 

1. Deploying Azure Streaming Analytics Edge jobs created in Azure. For more information on how to deploy Azure Streaming Analytics Edge jobs in Azure SQL Edge refer [Deploy Azure Stream Analytics Jobs](deploy-dacpac.md).
2. Using the new **T-SQL Streaming** feature to create streaming jobs in SQL Edge, without the need to configure streaming jobs in Azure. 

While its possible to use both options to implement data streaming in SQL Edge, it is highly recommended to use only one. When using both, there may be possible race conditions which impact the functioning of the data streaming operations.

The rest of this document refers to the new feature, **T-SQL Streaming**, which provides real-time data streaming, analytics, and event-processing to analyze and process high volumes of fast streaming data from multiple sources simultaneously. *T-SQL Streaming* is built using the same high performance streaming engine that powers [Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-introduction) in Microsoft Azure, and supports a similar set of capabilities offered by Azure Stream Analytics running on the edge.

As with Azure Stream Analytics, T-SQL Streaming enables recognition of patterns and relationships in information extracted from a number of IoT input sources including devices, sensors, and applications. These patterns can be used to trigger actions and initiate workflows such as creating alerts, feeding information to a reporting or visualization solution, or storing the data for later use. 

The following scenarios are examples of when you can use T-SQL Streaming:

* Analyze real-time telemetry streams from IoT devices.
* Real-time Analytics of data generated from autonomous and driverless vehicles.
* Remote monitoring and predictive maintenance of high value industrial or manufacturing assets.
* Anomaly detection and/or pattern recognition of IoT sensor readings in an agriculture or an energy farm.

## How does T-SQL Streaming work?

T-SQL Streaming works in exactly the same manner as [Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-introduction#how-does-stream-analytics-work), for example, it uses the concept of streaming jobs for processing of real-time data streaming. 

A stream analytics job, consists of:

- Stream Input - A Stream input defines the connections to a data source to read the data stream from. Azure SQL Edge currently supports the following stream input types:
    - Edge Hub
    - Kafka - Support for Kafka inputs is currently only available on Intel/AMD64 versions of Azure SQL Edge.

- Stream Output - A Stream output defines the connections to a data source to write the data stream to. Azure SQL Edge currently supports the following stream output types
    - Edge Hub
    - SQL - The SQL output can be a local database within the SQL Edge instance or a remote SQL Server or Azure SQL Database. 
    - Azure Blob Storage

- Stream Query - The stream query defines the transformation, aggregations, filter, sorting, and joins that needs to be applied to the input stream before it's written to the stream output. The stream query is based on the same query language used by Azure Stream Analytics. For more information on Azure Stream Analytics query language, refer [Stream Analytics Query Language](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference?).

> [!IMPORTANT]
> T-SQL Streaming, unlike Azure Stream Analytics, currently does not support [using reference data for lookups](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-use-reference-data) or [using UDF's and UDA's in stream job](https://docs.microsoft.com/azure/stream-analytics/streaming-technologies#you-want-to-write-udfs-udas-and-custom-deserializers-in-a-language-other-than-javascript-or-c).

> [!NOTE]
> T-SQL Streaming only supports a subset of the language surface area supported by Azure Stream Analytics. For more information on Azure Stream Analytics query language, see [Stream Analytics Query Language](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference?).

## Limitations and restrictions

The following limitations and restrictions apply to T-SQL Streaming. 

- Only one streaming job can be active at any give time. Jobs that are already executing must be stopped before starting another job.
- Each streaming job execution is single threaded. If the streaming job contains multiple queries, each query will be evaluated in serial order.

## Next steps

- [Create a Stream Analytics job in Azure SQL Edge (Preview) ](create-stream-analytics-job.md)
- [Viewing metadata associated with stream jobs in Azure SQL Edge (Preview) ](streaming-catalog-views.md)
- [Create External Stream](create-external-stream-transact-sql.md)