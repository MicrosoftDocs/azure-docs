---
title: Understand inputs for Azure Stream Analytics
description: This article describe the concept of inputs in an Azure Stream Analytics job, comparing streaming input to reference data input.
services: stream-analytics
author: jseb225
ms.author: jeanb
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 06/11/2019
---

# Understand inputs for Azure Stream Analytics

Azure Stream Analytics jobs connect to one or more data inputs. Each input defines a connection to an existing data source. Stream Analytics accepts data incoming from several kinds of event sources including Event Hubs, IoT Hub, and Blob storage. The inputs are referenced by name in the streaming SQL query that you write for each job. In the query, you can join multiple inputs to blend data or compare streaming data with a lookup to reference data, and pass the results to outputs. 

Stream Analytics has first-class integration with three kinds of resources as inputs:
- [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/)
- [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) 
- [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) 

These input resources can live in the same Azure subscription as your Stream Analytics job, or from a different subscription.

You can use the [Azure portal](stream-analytics-quick-create-portal.md#configure-job-input),  [Azure PowerShell](https://docs.microsoft.com/powershell/module/az.streamanalytics/New-azStreamAnalyticsInput), [.NET API](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.streamanalytics.inputsoperationsextensions), [REST API](https://docs.microsoft.com/rest/api/streamanalytics/stream-analytics-input), and [Visual Studio](stream-analytics-tools-for-visual-studio-install.md) to create, edit, and test Stream Analytics job inputs.

## Stream and reference inputs
As data is pushed to a data source, it's consumed by the Stream Analytics job and processed in real time. Inputs are divided into two types: data stream inputs and reference data inputs.

### Data stream input
A data stream is an unbounded sequence of events over time. Stream Analytics jobs must include at least one data stream input. Event Hubs, IoT Hub, and Blob storage are supported as data stream input sources. Event Hubs are used to collect event streams from multiple devices and services. These streams might include social media activity feeds, stock trade information, or data from sensors. IoT Hubs are optimized to collect data from connected devices in Internet of Things (IoT) scenarios.  Blob storage can be used as an input source for ingesting bulk data as a stream, such as log files.  

For more information about streaming data inputs, see [Stream data as input into Stream Analytics](stream-analytics-define-inputs.md)

### Reference data input
Stream Analytics also supports input known as *reference data*. Reference data is either completely static or changes slowly. It is typically used to perform correlation and lookups. For example, you might join data in the data stream input to data in the reference data, much as you would perform a SQL join to look up static values. Azure Blob storage and Azure SQL Database are currently supported as input sources for reference data. Reference data source blobs have a limit of up to 300 MB in size, depending on the query complexity and allocated Streaming Units (see the [Size limitation](stream-analytics-use-reference-data.md#size-limitation) section of the reference data documentation for more details).

For more information about reference data inputs, see [Using reference data for lookups in Stream Analytics](stream-analytics-use-reference-data.md)

## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
