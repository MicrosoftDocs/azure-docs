---
title: Understand inputs for Azure Stream Analytics
description: This article describes the concept of inputs in an Azure Stream Analytics job, comparing streaming input to reference data input.
ms.service: stream-analytics
author: enkrumah
ms.author: ebnkruma
ms.topic: conceptual
ms.date: 02/28/2023
---
# Understand inputs for Azure Stream Analytics

Azure Stream Analytics jobs connect to one or more data inputs. Each input defines a connection to an existing data source. Stream Analytics accepts data incoming from several kinds of event sources including Event Hubs, IoT Hub, and Blob storage. The inputs are referenced by name in the streaming SQL query that you write for each job. In the query, you can join multiple inputs to blend data or compare streaming data with a lookup to reference data, and pass the results to outputs. 

Stream Analytics has first-class integration with four kinds of resources as inputs:
- [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/)
- [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) 
- [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) 
- [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) 

These input resources can live in the same Azure subscription as your Stream Analytics job, or from a different subscription.

You can use the [Azure portal](stream-analytics-quick-create-portal.md#configure-job-input),  [Azure PowerShell](/powershell/module/az.streamanalytics/New-azStreamAnalyticsInput), [.NET API](/dotnet/api/microsoft.azure.management.streamanalytics.inputsoperationsextensions), [REST API](/rest/api/streamanalytics/2020-03-01/inputs), [Visual Studio](stream-analytics-tools-for-visual-studio-install.md), and [Visual Studio Code](./quick-create-visual-studio-code.md) to create, edit, and test Stream Analytics job inputs.

> [!NOTE] 
> We strongly recommend using [**Stream Analytics tools for Visual Studio Code**](./quick-create-visual-studio-code.md) for best local development experience. There are known feature gaps in Stream Analytics tools for Visual Studio 2019 (version 2.6.3000.0) and it won't be improved going forward.

## Stream and reference inputs
As data is pushed to a data source, it's consumed by the Stream Analytics job and processed in real time. Inputs are divided into two types:

- Data stream inputs
- Reference data inputs.

### Data stream input
A data stream is an unbounded sequence of events over time. Stream Analytics jobs must include at least one data stream input. Event Hubs, IoT Hub, Azure Data Lake Storage Gen2 and Blob storage are supported as data stream input sources. Event Hubs is used to collect event streams from multiple devices and services. These streams might include social media activity feeds, stock trade information, or data from sensors. IoT Hubs are optimized to collect data from connected devices in Internet of Things (IoT) scenarios.  Blob storage can be used as an input source for ingesting bulk data as a stream, such as log files.  

For more information about streaming data inputs, see [Stream data as input into Stream Analytics](stream-analytics-define-inputs.md)

### Reference data input
Stream Analytics also supports input known as *reference data*. Reference data is either completely static or changes slowly. It's typically used to perform correlation and lookups. For example, you might join data in the data stream input to data in the reference data, much as you would perform a SQL join to look up static values. Azure Blob storage, Azure Data Lake Storage Gen2, and Azure SQL Database are currently supported as input sources for reference data. Reference data source blobs have a limit of up to 300 MB in size, depending on the query complexity and allocated Streaming Units. For more information, see the [Size limitation](stream-analytics-use-reference-data.md#size-limitation) section of the reference data documentation.

For more information about reference data inputs, see [Using reference data for lookups in Stream Analytics](stream-analytics-use-reference-data.md)

## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)