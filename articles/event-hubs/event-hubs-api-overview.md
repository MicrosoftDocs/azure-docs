---
title: Azure Event Hubs API overview | Microsoft Docs
description: This article provides an overview of available APIs (runtime and management) for using the Azure Event Hubs service.
services: event-hubs
documentationcenter: na
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid: 3f221a0c-182d-4e39-9f3d-3a3c16c5c6ed
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/02/2018
ms.author: shvija

---

# Available Event Hubs APIs

This article describes the set of available API clients you can use for managing Event Hubs resources.

## Runtime APIs

The following section describes all currently available Azure Event Hubs runtime clients. While some of these libraries also include limited management functionality, there are also [specific libraries](#management-apis) dedicated to management operations. The core focus of these libraries is to send and receive messages from an event hub.

For more information about the current status of each runtime library, see [additional information](#additional-information).

| Language/Platform | Client package | EventProcessorHost package | Repository |
| --- | --- | --- | --- |
| .NET Standard | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.EventHubs/) | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.EventHubs.Processor/) | [GitHub](https://github.com/azure/azure-event-hubs-dotnet) |
| .NET Framework | [NuGet](https://www.nuget.org/packages/WindowsAzure.ServiceBus/) | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost/) | N/A |
| Java | [Maven](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-eventhubs%22) | [Maven](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-eventhubs-eph%22) | [GitHub](https://github.com/Azure/azure-event-hubs-java) |
| Node | [NPM](https://www.npmjs.com/package/azure-event-hubs) | N/A | [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/eventhub/event-hubs) |
| C | N/A | N/A | [GitHub](https://github.com/Azure/azure-event-hubs-c) |

### Additional information

#### .NET

The .NET ecosystem has multiple runtimes, so there are multiple .NET libraries for Event Hubs. The .NET Standard library can be run using either .NET Core or the .NET Framework, while the .NET Framework library can only be run in a .NET Framework environment. For more information about .NET Framework versions, see [framework versions](https://docs.microsoft.com/dotnet/articles/standard/frameworks).

#### Node

The [Node.js library](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/eventhub/event-hubs) is currently in preview and is maintained as a side project by Microsoft employees and external contributors. All contributions including source code are welcome and will be reviewed.

## Management APIs

The following table lists all currently available management-specific libraries. None of these libraries contain runtime operations, and are for the sole purpose of managing Event Hubs entities.

| Language/Platform | Management package | Repository |
| --- | --- | --- |
| .NET Standard | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Management.EventHub) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/AutoRest/src/ResourceManagement/EventHub) |

## Next steps
You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an event hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)
