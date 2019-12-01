---
title: Azure Stream Analytics preview features
description: This article lists the Azure Stream Analytics features that are currently in preview.
services: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 10/30/2019
---

# Azure Stream Analytics preview features

This article summarizes all the features currently in preview for Azure Stream Analytics. Using preview features in a production environment isn't recommended.

## Public previews

The following features are in public preview. You can take advantage of these features today, but don't use them in your production environment.

### Online scaling

With online scaling, you are not required to stop your job if you need to change the SU allocation. You can increase or decrease the SU capacity of a running job without having to stop it. This builds on the customer promise of long-running mission-critical pipelines that Stream Analytics offers today. For more information, see [Configure Azure Stream Analytics Streaming Units](stream-analytics-streaming-unit-consumption.md#configure-stream-analytics-streaming-units-sus).

### C# custom de-serializers
Developers can leverage the power of Azure Stream Analytics to process data in Protobuf, XML, or any custom format. You can implement [custom de-serializers](custom-deserializer-examples.md) in C#, which can then be used to de-serialize events received by Azure Stream Analytics.

### Extensibility with C# custom code

Developers creating Stream Analytics modules in the cloud or on IoT Edge can write or reuse custom C# functions and invoke them directly in the query through [user-defined functions](stream-analytics-edge-csharp-udf-methods.md).

### Managed Identity authentication with Power BI

Azure Stream Analytics offers full support for Managed Identity based authentication with Power BI for a dynamic dashboarding experience.

### Anomaly Detection

Azure Stream Analytics' machine learning models have support for *spike* and *dips* detection in addition to bi-directional, slow positive, and slow negative trends detection. For more information, visit [Anomaly detection in Azure Stream Analytics](stream-analytics-machine-learning-anomaly-detection.md).

### Debug query steps in Visual Studio

You can easily preview the intermediate row set on a data diagram when doing local testing in Azure Stream Analytics tools for Visual Studio. 

### Local testing with live data in Visual Studio Code

You can test your queries against live data on your local machine before submitting the job to Azure. Each testing iteration takes less than two to three seconds on average, resulting in a very efficient development process.

### Visual Studio Code for Azure Stream Analytics

Azure Stream Analytics jobs can be authored in Visual Studio Code. See our [VS Code getting started tutorial](https://docs.microsoft.com/azure/stream-analytics/quick-create-vs-code).


### Anomaly Detection

Azure Stream Analytics introduces new machine learning models with support for *spike* and *dips* detection in addition to bi-directional, slow positive, and slow negative trends detection. For more information, visit [Anomaly detection in Azure Stream Analytics](stream-analytics-machine-learning-anomaly-detection.md).


### Integration with Azure Machine Learning

You can scale Stream Analytics jobs with Machine Learning (ML) functions. To learn more about how you can use ML functions in your Stream Analytics job, visit [Scale your Stream Analytics job with Azure Machine Learning functions](stream-analytics-scale-with-machine-learning-functions.md). Check out a real-world scenario with [Performing sentiment analysis by using Azure Stream Analytics and Azure Machine Learning](stream-analytics-machine-learning-integration-tutorial.md).


### Live data testing in Visual Studio

Visual Studio tools for Azure Stream Analytics enhance the local testing feature that allows you to test you queries against live event streams from cloud sources such as Event Hub or IoT hub. Learn how to [Test live data locally using Azure Stream Analytics tools for Visual Studio](stream-analytics-live-data-local-testing.md).


### .NET user-defined functions on IoT Edge

With .NET standard user-defined functions, you can run .NET Standard code as part of your streaming pipeline. You can create simple C# classes or import full project and libraries. Full authoring and debugging experience is supported in Visual Studio. For more information, visit [Develop .NET Standard user-defined functions for Azure Stream Analytics Edge jobs](stream-analytics-edge-csharp-udf-methods.md).

## Other previews

The following features are also available in preview on request.

### Real-time high performance scoring with custom ML models managed by Azure Machine Learning

Azure Stream Analytics supports high-performance, real-time scoring by leveraging custom pre-trained Machine Learning models managed by Azure Machine Learning, and hosted in Azure Kubernetes Service (AKS) or Azure Container Instances (ACI), using a workflow that does not require you to write code. [Sign up](https://aka.ms/asapreview1) for preview

### Support for Azure Stack
This feature enabled on the Azure IoT Edge runtime, leverages custom Azure Stack features, such as native support for local inputs and outputs running on Azure Stack (for example Event Hubs, IoT Hub, Blob Storage). This new integration enables you to build hybrid architectures that can analyze your data close to where it is generated, lowering latency and maximizing insights.
This feature enables you to build hybrid architectures that can analyze your data close to where it is generated, lowering latency and maximizing insights. You must [sign up](https://aka.ms/asapreview1) for this preview.
