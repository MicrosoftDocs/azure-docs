---
title: Azure Stream Analytics preview features
description: This article lists the Azure Stream Analytics features that are currently in preview.
services: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/29/2019
---

# Azure Stream Analytics preview features

This article summarizes all the features currently in preview for Azure Stream Analytics. Using preview features in a production environment isn't recommended.

## Public previews

The following features are in public preview. You can take advantage of these features today, but don't use them in your production environment.

### One-click integration with Event Hubs 
With this integration, you will now be able to visualize incoming data and start to write a Stream Analytics query with one click from the Event Hub portal. Once your query is ready, you will be able to productize it in few clicks and start to get real-time insights. This will significantly reduce the time and cost to develop real-time analytics solutions. Documentation is available [here](https://docs.microsoft.com/azure/event-hubs/process-data-azure-stream-analytics).

### Visual Studio Code for Azure Stream Analytics

Azure Stream Analytics jobs can be authored in Visual Studio Code. See our [VS Code getting started tutorial](https://docs.microsoft.com/azure/stream-analytics/quick-create-vs-code).

### Anomaly Detection

Azure Stream Analytics introduces new machine learning models with support for *spike* and *dips* detection in addition to bi-directional, slow positive, and slow negative trends detection. For more information, visit [Anomaly detection in Azure Stream Analytics](stream-analytics-machine-learning-anomaly-detection.md).

### Integration with Azure Machine Learning

You can scale Stream Analytics jobs with Machine Learning (ML) functions. To learn more about how you can use ML functions in your Stream Analytics job, visit [Scale your Stream Analytics job with Azure Machine Learning functions](stream-analytics-scale-with-machine-learning-functions.md). Check out a real-world scenario with [Performing sentiment analysis by using Azure Stream Analytics and Azure Machine Learning](stream-analytics-machine-learning-integration-tutorial.md).

### JavaScript user-defined aggregate

Azure Stream Analytics supports user-defined aggregates (UDA) written in JavaScript, which enable you to implement complex stateful business logic. Learn how to use UDAs from the [Azure Stream Analytics JavaScript user-defined aggregates](stream-analytics-javascript-user-defined-aggregates.md) documentation. 

### Live data testing in Visual Studio

Visual Studio tools for Azure Stream Analytics enhance the local testing feature that allows you to test you queries against live event streams from cloud sources such as Event Hub or IoT hub. Learn how to [Test live data locally using Azure Stream Analytics tools for Visual Studio](stream-analytics-live-data-local-testing.md).

### .NET user-defined functions on IoT Edge

With .NET standard user-defined functions, you can run .NET Standard code as part of your streaming pipeline. You can create simple C# classes or import full project and libraries. Full authoring and debugging experience is supported in Visual Studio. For more information, visit [Develop .NET Standard user-defined functions for Azure Stream Analytics Edge jobs](stream-analytics-edge-csharp-udf-methods.md).

## Other previews

The following features are also available in preview on request.

### C# custom deserializer for Azure Stream Analytics on IoT Edge and Cloud

Developers can implement custom deserializers in C# to deserialize events received by Azure Stream Analytics. Examples of formats that can be deserialized include Parquet, Protobuf, XML, or any binary format. Sign up for this preview [here](https://aka.ms/asapreview1).

### Support for Azure Stack
This feature enabled on the Azure IoT Edge runtime, leverages custom Azure Stack features, such as native support for local inputs and outputs running on Azure Stack (for example Event Hubs, IoT Hub, Blob Storage). This new integration enables you to build hybrid architectures that can analyze your data close to where it is generated, lowering latency and maximizing insights.
Sign up for this preview [here](https://aka.ms/asapreview1).

