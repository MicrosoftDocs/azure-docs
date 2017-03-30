---
title: Using the REST API to access Azure Mobile Engagement Service APIs
description: Describes how to use the Mobile Engagement REST APIs to access Azure Mobile Engagement Service APIs
services: mobile-engagement
documentationcenter: mobile
author: wesmc7777
manager: erikre
editor: ''

ms.assetid: e8df4897-55ee-45df-b41e-ff187e3d9d12
ms.service: mobile-engagement
ms.workload: mobile
ms.tgt_pltfrm: mobile-multiple
ms.devlang: dotnet
ms.topic: article
ms.date: 10/05/2016
ms.author: wesmc;ricksal

---
# Using REST to access Azure Mobile Engagement Service APIs
Azure Mobile Engagement provides the [Azure Mobile Engagement REST API](https://msdn.microsoft.com/library/azure/mt683754.aspx) for you to manage Devices, Reach/Push campaigns etc.

If you do not want to use the REST APIs directly, we also provide a [Swagger file](https://github.com/Azure/azure-rest-api-specs/blob/master/arm-mobileengagement/2014-12-01/swagger/mobile-engagement.json) that you can use with tools to generate SDKs for your preferred language. We recommend using the [AutoRest](https://github.com/Azure/AutoRest) tool to generate your SDK from our Swagger file. We have created a .NET SDK in a similar manner which allows you to interact with these APIs using a C# wrapper and you don't have to do the authentication token negotiation and refresh yourself. See [Service API .NET SDK Sample](mobile-engagement-dotnet-sdk-service-api.md) to learn how to use the .net SDK for API
