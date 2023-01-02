---
title: Azure Stream Analytics preview features
description: This article lists the Azure Stream Analytics features that are currently in preview
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 06/10/2022
---

# Azure Stream Analytics preview features

This article summarizes all the features currently in preview for Azure Stream Analytics. Using preview features in a production environment isn't recommended.

## C# custom de-serializers
Developers can leverage the power of Azure Stream Analytics to process data in Protobuf, XML, or any custom format. You can implement [custom de-serializers](custom-deserializer-examples.md) in C#, which can then be used to de-serialize events received by Azure Stream Analytics.

## Extensibility with C# custom code

Developers creating Stream Analytics modules in the cloud or on IoT Edge can write or reuse custom C# functions and invoke them directly in the query through [user-defined functions](stream-analytics-edge-csharp-udf-methods.md).

## Debug queries locally using job diagram in Visual Studio Code

You can use the job diagram while testing your query locally to examine the intermediate result set and metrics for each step.

## Explore jobs in Visual Studio Code

Stream Analytics Explorer in Visual Studio Code Extension gives developers a lightweight experience for managing their Stream Analytics jobs. In the Stream Analytics Explorer, you can easily manage your jobs, view job diagram, and debug in Job Monitor.
