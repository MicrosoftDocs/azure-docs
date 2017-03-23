---
title: Azure Relay API overview | Microsoft Docs
description: Overview of available Azure Relay APIs
services: event-hubs
documentationcenter: na
author: jtaubensee
manager: timlt
editor: ''

ms.assetid: fdaa1d2b-bd80-4e75-abb9-0c3d0773af2d
ms.service: service-bus-relay
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/15/2017
ms.author: jotaub
---

# Available Relay APIs

## Runtime APIs

The following is a listing of all currently available Relay runtime clients. While some of these libraries also include limited management functionality, there are also [specific libraries](#management-apis) dedicated to management operations.

See [additional information](#additional-information) for more details on the status of each runtime library.

| Language/Platform | Available feature | Client package | Repository |
| --- | --- | --- | --- |
| .NET Standard | Hybrid Connections | [Microsoft.Azure.Relay](https://www.nuget.org/packages/Microsoft.Azure.Relay/) | [GitHub](https://github.com/azure/azure-relay-dotnet) |
| .NET Framework | WCF Relay | [WindowsAzure.ServiceBus](https://www.nuget.org/packages/WindowsAzure.ServiceBus/) | N/A |
| Node | Hybrid Connections | [hyco-ws](https://www.npmjs.com/package/hyco-ws)<br/>[hyco-websocket](https://www.npmjs.com/package/hyco-websocket) | [GitHub](https://github.com/Azure/azure-relay-node) |

### Additional information

#### .NET
The .NET ecosystem has multiple runtimes, hence there are multiple .NET libraries for Event Hubs. The .NET Standard library can be run using either .NET Core or the .NET Framework, while the .NET Framework library can only be run in a .NET Framework environment. For more information on .NET Frameworks, see [framework versions.](https://docs.microsoft.com/dotnet/articles/standard/frameworks#framework-versions)

## Management APIs

The following is a listing of all currently available Relay management-specific libraries. None of these libraries contain runtime operations, and are for the sole purpose of managing Relay entities.

| Language/Platform | Management package | Repository |
| --- | --- | --- |
| .NET Standard | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Management.Relay) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/AutoRest/src/ResourceManagement/Relay) |

## Next steps
To learn more about Azure Relay, visit these links:
* [What is Azure Relay?](relay-what-is-it.md)
* [Relay FAQ](relay-faq.md)