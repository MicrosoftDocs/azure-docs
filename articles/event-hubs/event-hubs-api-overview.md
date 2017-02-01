---
title: Event Hubs API overview | Microsoft Docs
description: Overview of available Event Hubs APIs
services: event-hubs
documentationcenter: na
author: jtaubensee
manager: timlt
editor: ''

ms.assetid: 3f221a0c-182d-4e39-9f3d-3a3c16c5c6ed
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/31/2017
ms.author: jotaub
---

# Available Event Hubs APIs

## Runtime APIs

The following is a listing of all currently available Event Hubs runtime clients. While some of these libraries also include limited management functionality, there are also [specific libraries](##-Management-APIs) dedicated to management operations. The core focus of these libraries is to send and receive messages from an Event Hub.

See [additional information](###-Additional-information) for more details on the current status of each runtime library.

| Language/Platform | Client package | EventProcessorHost package | Repository |
| --- | --- | --- | --- |
| .NET Standard | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.EventHubs/) | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.EventHubs.Processor/) | [GitHub](https://github.com/azure/azure-event-hubs-dotnet) |
| .NET Framework | [NuGet](https://www.nuget.org/packages/WindowsAzure.ServiceBus/) | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost/) | N/A |
| Java | [Maven](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-eventhubs%22) | [Maven](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-eventhubs-eph%22) | [GitHub](https://github.com/Azure/azure-event-hubs-java) |
| Node | [NPM](https://www.npmjs.com/package/azure-event-hubs) | N/A | [GitHub](https://github.com/Azure/azure-event-hubs-node) |
| C | N/A | N/A | [GitHub](https://github.com/Azure/azure-event-hubs-c) |

### Additional information

#### .NET

// Something about .NET standard vs .NET Framework here

#### Node

// Something about this project being in preview and not currently supported

## Management APIs

The following is a listing of all currently available management specific libraries. None of these libraries contain runtime operations, and are for the sole purpose of managing Event Hubs entities.

| Language/Platform | Management package | Repository |
| --- | --- | --- | --- |
| .NET Standard | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Management.EventHub) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/AutoRest/src/ResourceManagement/EventHub) |