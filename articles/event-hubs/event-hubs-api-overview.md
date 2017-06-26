---
title: Azure Event Hubs API overview | Microsoft Docs
description: Overview of available Azure Event Hubs APIs
services: event-hubs
documentationcenter: na
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: 3f221a0c-182d-4e39-9f3d-3a3c16c5c6ed
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/03/2017
ms.author: sethm

---

# Available Event Hubs APIs

## Runtime APIs

The following is a listing of all currently available Azure Event Hubs runtime clients. While some of these libraries also include limited management functionality, there are also [specific libraries](#management-apis) dedicated to management operations. The core focus of these libraries is to send and receive messages from an event hub.

See [additional information](#additional-information) for more details on the current status of each runtime library.

| Language/Platform | Client package | EventProcessorHost package | Repository |
| --- | --- | --- | --- |
| .NET Standard | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.EventHubs/) | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.EventHubs.Processor/) | [GitHub](https://github.com/azure/azure-event-hubs-dotnet) |
| .NET Framework | [NuGet](https://www.nuget.org/packages/WindowsAzure.ServiceBus/) | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost/) | N/A |
| Java | [Maven](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-eventhubs%22) | [Maven](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-eventhubs-eph%22) | [GitHub](https://github.com/Azure/azure-event-hubs-java) |
| Node | [NPM](https://www.npmjs.com/package/azure-event-hubs) | N/A | [GitHub](https://github.com/Azure/azure-event-hubs-node) |
| C | N/A | N/A | [GitHub](https://github.com/Azure/azure-event-hubs-c) |

### Additional information

#### .NET
The .NET ecosystem has multiple runtimes, hence there are multiple .NET libraries for Event Hubs. The .NET Standard library can be run using either .NET Core or the .NET Framework, while the .NET Framework library can only be run in a .NET Framework environment. For more information on .NET Frameworks, see [framework versions](https://docs.microsoft.com/dotnet/articles/standard/frameworks#framework-versions).

#### Node

The Node.js library is currently in preview and is maintained as a side project by Microsoft employees and external contributors. All contributions including source code are welcome and will be reviewed.

## Management APIs

The following is a listing of all currently available management specific libraries. None of these libraries contain runtime operations, and are for the sole purpose of managing Event Hubs entities.

| Language/Platform | Management package | Repository |
| --- | --- | --- | --- |
| .NET Standard | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Management.EventHub) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/AutoRest/src/ResourceManagement/EventHub) |

## Next steps
You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an event hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)