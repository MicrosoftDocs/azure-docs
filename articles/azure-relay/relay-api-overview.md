---
title: Azure Relay API overview | Microsoft Docs
description: This article provides an overview of available Azure Relay APIs (.NET Standard, .NET Framework, Node.js, etc.)
ms.topic: article
ms.date: 06/23/2020
---

# Available Relay APIs

## Runtime APIs

The following table lists all currently available Relay runtime clients.

The [additional information](#additional-information) section contains more information about the status of each runtime library.

| Language/Platform | Available feature | Client package | Repository |
| --- | --- | --- | --- |
| .NET Standard | Hybrid Connections | [Microsoft.Azure.Relay](https://www.nuget.org/packages/Microsoft.Azure.Relay/) | [GitHub](https://github.com/azure/azure-relay-dotnet) |
| .NET Framework | WCF Relay | [WindowsAzure.ServiceBus](https://www.nuget.org/packages/WindowsAzure.ServiceBus/) | N/A |
| Node | Hybrid Connections | [WebSockets: `hyco-ws`](https://www.npmjs.com/package/hyco-ws)<br/>[WebSockets: `hyco-websocket`](https://www.npmjs.com/package/hyco-websocket)<br/>[HTTP Requests: `hyco-https`](https://www.npmjs.com/package/hyco-https) | [GitHub](https://github.com/Azure/azure-relay-node) |

### Additional information

#### .NET

The .NET ecosystem has multiple runtimes, hence there are multiple .NET
libraries for the Relay. The .NET Standard library can be run using either
.NET Core or the .NET Framework, while the .NET Framework library can only be
run in a .NET Framework environment. For more information on .NET Frameworks,
see [framework versions](/dotnet/articles/standard/frameworks).

The .NET Framework library only supports the WCF programming model and relies
on a proprietary binary protocol based on the WCF `net.tcp` transport. This
protocol and library is maintained for backwards compatibility with existing
applications.

The .NET Standard library is based on the open protocol definition for the
Hybrid Connections Relay that builds on HTTP and WebSockets. The library
supports a stream abstraction over WebSockets and a simple request-response API
gesture for answering HTTP requests. The [Web
API](https://github.com/Azure/azure-relay-dotnet) sample shows how to integrate
Hybrid Connections with ASP.NET Core for web services.

#### Node.js

The Hybrid Connections modules listed in the table above replace or amend
existing Node.js modules with alternative implementations that listen on
the Azure Relay service instead of the local networking stack.

The `hyco-https` module amends and partially overrides the core Node.js modules
`http` and `https`, providing an HTTPS listener implementation that is
compatible with many existing Node.js modules and applications that rely on
these core modules.

The `hyco-ws` and `hyco-websocket` modules amend the popular `ws` and `websocket`
modules for Node.js, providing alternate listener implementations that enable
modules and applications relying on either module to work behind the Hybrid
Connections Relay.

Details about those modules can be found in the
[azure-relay-node](https://github.com/Azure/azure-relay-node) GitHub
repository.

## Next steps

To learn more about Azure Relay, visit these links:
* [What is Azure Relay?](relay-what-is-it.md)
* [Relay FAQ](relay-faq.md)
