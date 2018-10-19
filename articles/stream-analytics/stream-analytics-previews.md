---
title: Azure Stream Analytics preview features
description: This article lists the Azure Stream Analytics features that are currently in preview.
services: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 10/05/2018
---

# Azure Stream Analytics preview features

This article summarizes all the features currently in preview for Azure Stream Analytics. Using preview features in a production environment isn't recommended.

## Public previews

The following features are in public preview. You can take advantage of these features today, but don't use them in your production environment.

### Azure Stream Analytics on IoT Edge

Azure Stream Analytics on IoT Edge allows developers to deploy near-real-time analytics on IoT Edge devices. For more information, see the [Azure Stream Analytics on IoT Edge](stream-analytics-edge.md) documentation.

### Integration with Azure Machine Learning

You can scale Stream Analytics jobs with Machine Learning (ML) functions. To learn more about how you can use ML functions in your Stream Analytics job, visit [Scale your Stream Analytics job with Azure Machine Learning functions](stream-analytics-scale-with-machine-learning-functions.md). Check out a real-world scenario with [Performing sentiment analysis by using Azure Stream Analytics and Azure Machine Learning](stream-analytics-machine-learning-integration-tutorial.md).

### Session windows

Stream Analytics has native support for windowing functions, enabling developers to author complex stream processing jobs with minimal effort. [Session windows](https://msdn.microsoft.com/azure/stream-analytics/reference/session-window-azure-stream-analytics) group events that arrive at similar times, filtering out periods of time where there's no data. To learn more about windowing functions, visit [Introduction to Stream Analytics windowing functions](stream-analytics-window-functions.md).

### Blob output partitioning by custom time

Azure Stream Analytics can output to Blob storage based on custom time attributes. For more information, visit [Custom DateTime path patterns for Azure Stream Analytics blob storage output](stream-analytics-custom-path-patterns-blob-storage-output.md).

### JavaScript user-defined aggregate

Azure Stream Analytics supports user-defined aggregates (UDA) written in JavaScript, which enable you to implement complex stateful business logic. Learn how to use UDAs from the [Azure Stream Analytics JavaScript user-defined aggregates](stream-analytics-javascript-user-defined-aggregates.md) documentation. 

### Live data testing in Visual Studio

Visual Studio tools for Azure Stream Analytics enhance the local testing feature that allows you to test you queries against live event streams from cloud sources such as Event Hub or IoT hub. Learn how to [Test live data locally using Azure Stream Analytics tools for Visual Studio](stream-analytics-live-data-local-testing.md).

### .NET user-defined functions on IoT Edge

With .NET standard user-defined functions, you can run .NET Standard code as part of your streaming pipeline. You can create simple C# classes or import full project and libraries. Full authoring and debugging experience is supported in Visual Studio. For more information, visit [Develop .NET Standard user-defined functions for Azure Stream Analytics Edge jobs](stream-analytics-edge-csharp-udf-methods.md).

## Private previews

The following features are in private preview. To access these previews, visit the Azure Stream Analytics private preview [sign up](https://aka.ms/ASApreview1) page.

### Anomaly Detection

Azure Stream Analytics introduces new machine learning models with support for *spike* and *dips* detection in addition to bi-directional, slow positive, and slow negative trends detection.

### C# custom deserializer for Azure Stream Analytics on IoT Edge

Developers can now implement custom deserializers in C# to deserialize events received by Azure Stream Analytics. Examples of formats that can be deserialized include Parquet, Protobuf, XML, or any binary format.

### Blob output partitioning by custom attribute

It is now possible to partition your Azure Stream Analytics output to Blob storage based on any column in your query.

### Managed identities for Azure resources authentication to Azure Data Lake Storage

You can now operationalize your real-time pipelines with managed identities for Azure resources based authentication while writing to Azure Data Lake Storage Gen1, allowing you to create jobs programmatically. For further information, visit [Use Managed identities for Azure resources to Authenticate Azure Stream Analytics Jobs to Azure Data Lake Storage Gen1 Output](stream-analytics-managed-identities-adls.md).

## Next steps

* [Eight new features in Azure Stream Analytics](https://azure.microsoft.com/blog/eight-new-features-in-azure-stream-analytics/)

* [4 new features now available in Azure Stream Analytics](https://azure.microsoft.com/blog/4-new-features-now-available-in-azure-stream-analytics/)
