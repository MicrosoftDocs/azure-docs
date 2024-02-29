---
title: include file
description: include file
services: functions
author: craigshoemaker
manager: mijacobs
ms.service: azure-functions
ms.topic: include
ms.date: 01/28/2020
ms.author: cshoe
ms.custom: include file
---

<a name="azure-storage-sdk-version-in-functions-1x"></a>
In Functions 1.x, the Storage triggers and bindings use version 7.2.1 of the Azure Storage SDK ([WindowsAzure.Storage](https://www.nuget.org/packages/WindowsAzure.Storage/7.2.1) NuGet package). If you reference a different version of the Storage SDK, and you bind to a Storage SDK type in your function signature, the Functions runtime may report that it can't bind to that type. The solution is to make sure your project references [WindowsAzure.Storage 7.2.1](https://www.nuget.org/packages/WindowsAzure.Storage/7.2.1).
