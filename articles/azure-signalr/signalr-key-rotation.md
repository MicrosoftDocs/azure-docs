---
title: Access Key Rotation for Azure SignalR Service
description: An overview on why customer needs to routinely rotate the access keys and how to do it with portal GUI and CLI.
author: sffamily
ms.service: signalr
ms.topic: overview
ms.date: 09/13/2018
ms.author: zhshang
---
# Access Key Rotation for Azure SignalR Service

## Why rotating the Access Keys?

For security reason and compliance requirement, it is highly recommended to routinely rotate the access keys, by regenerating them for Azure SignalR Service instances, and updating your application configurations that use these Access Keys through connection strings.

## How to regenerate Access Keys?

Login to Azure Portal, find the Keys section from the Azure SignalR Service instance you want to regenerate the keys, and regenerate keys by clicking on it. A new key and corresponding connection string will be created.

![Regenerate Keys]
(media/signalr-key-rotation/regenerate-keys.png)

With Azure SignalR Service, the server-side component of ASP.NET Core SignalR is hosted in Azure. However, since the technology is built on top of ASP.NET Core, you have the ability to run your actual web application on multiple platforms (Windows, Linux, and MacOS) while hosting with [Azure App Service](../app-service/app-service-web-overview.md), [IIS](https://docs.microsoft.com/aspnet/core/host-and-deploy/iis/index), [Nginx](https://docs.microsoft.com/aspnet/core/host-and-deploy/linux-nginx), [Apache](https://docs.microsoft.com/aspnet/core/host-and-deploy/linux-apache), [Docker](https://docs.microsoft.com/aspnet/core/host-and-deploy/docker/index). You can also use self-hosting in your own process.

If the goals for your application include: supporting the latest functionality for updating web clients with real-time content updates, running across multiple platforms (Azure, Windows, Linux, and macOS), and hosting in different environments, then the best choice could be leveraging the Azure SignalR Service.

## Updating configurations with new connection strings

It is still a valid approach to deploy your own Azure web app supporting ASP.NET Core SignalR as a backend component to your overall web application.

One of the key reasons to use the Azure SignalR Service is simplicity. With Azure SignalR Service, you don't need to handle problems like performance, scalability, availability. These issues are handled for you with a 99.9% service-level agreement.

Also, WebSockets are typically the preferred technique to support real-time content updates. However, load balancing a large number of persistent WebSocket connections becomes a complicated problem to solve as you scale. Common solutions leverage: DNS load balancing, hardware load balancers, and software load balancing. Azure SignalR Service handles this problem for you.

Another reason may be you have no requirements to actually host a web application at all. The logic of your web application may leverage [Serverless computing](https://azure.microsoft.com/overview/serverless-computing/). For example, maybe your code is only hosted and executed on demand with [Azure Functions](https://docs.microsoft.com/azure/azure-functions/) triggers. This scenario can be tricky because your code only runs on-demand and doesn't maintain long connections with clients. Azure SignalR Service can handle this situation since the service already manages connections for you. See the [overview on how to use SignalR Service with Azure Functions](signalr-overview-azure-functions.md) for more details.

## Forced Access Key regeneration

Under certain circumstances, the Azure SignalR Service may enforce a mandatory Access Key regeneration and notify customer via email and portal notification. If you received this communication or encountered service failure due to access key, please login to the Azure Portal and find the new connection string, and update the application configuration accordingly. 

## Next steps

* [Quickstart: Create a chat room with Azure SignalR](signalr-quickstart-dotnet-core.md)