---
title: Azure Web PubSub samples - app scenarios
titleSuffix: Azure Web PubSub
description: A list of code samples showing how Web PubSub is used in a wide variety of web applications 
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.topic: sample
ms.date: 05/15/2023
ms.custom: mode-ui, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: azure-web-pubsub-samples-app-scenarios
---
# Azure Web PubSub samples - app scenarios

Bi-directional, low-latency and real-time data exchange between clients and server was a *nice-to-have* feature, but now end users expect this behavior **by default**. Azure Web PubSub is used in a wide range of industries, powering applications like  
- dashboard for real-time monitoring in finance, retail and manufacturing
- cross-platform chat room in health care and social networking
- competitive bidding in online auctions, 
- collaborative coauthoring in modern work applications
- and a lot more

Here's a list of code samples written by Azure Web PubSub team and the community. To have your project featured here, consider submitting a Pull Request.

::: zone pivot="method-csharp"
| App scenario                                        | Industry          | 
| --------------------------------------------------- | ----------------- |
| [Unity multiplayer gaming](https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp/unity-multiplayer-sample) | Gaming | 
| [Chat app with persistent storage](https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp/chatapp-withstorage) | Gaming | 
::: zone-end

::: zone pivot="method-javascript"
| App scenario                                        | Industry          | 
| --------------------------------------------------- | ----------------- |
| [Cross-platform chat](https://github.com/Azure/azure-webpubsub/blob/main/samples/csharp/chatapp/Startup.cs#L29) | Social | 
| [Collaborative code editor](https://github.com/Azure/azure-webpubsub/blob/main/samples/csharp/chatapp/Startup.cs#L29) | Modern work | 
::: zone-end

::: zone pivot="method-java"
| App scenario                                        | Industry          |   
| --------------------------------------------------- | ----------------- | 
| [Chat app](https://github.com/Azure/azure-webpubsub/tree/main/samples/java/chatapp) | Social | 
::: zone-end

::: zone pivot="method-python"
| App scenario                                        | Industry          | 
| --------------------------------------------------- | ----------------- |
| [Chat app](https://github.com/Azure/azure-webpubsub/tree/main/samples/python/chatapp) | Social | 
::: zone-end
