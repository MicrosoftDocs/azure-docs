---
title: Overview of Azure Service Fabric Mesh
description: An overview of Azure Service Fabric Mesh. With Service Fabric Mesh, you can deploy and scale your application without worrying about the infrastructure needs of your application.
services: Azure Service Fabric Mesh
keywords: 
author: TylerMSFT
ms.author: twhitney
ms.date: 04/30/2018
ms.topic: overview
ms.service: service-fabric-mesh
manager: timlt
#Customer intent: As a developer, I need a high-level, technically focused understanding of Service Fabric Mesh, so I can determine if it's something that I (or my company) want to use.
---

# What is Service Fabric Mesh?

Service Fabric Mesh is a server-less platform that runs on top of [Service Fabric][service-fabric-overview] and is hosted on Microsoft Azure. With Service Fabric Mesh, you can run and scale your microservices without worrying about the infrastructure powering it. Contrast this to pure [Service Fabric][service-fabric-overview] where you not only manage your services, but you also manage the cluster running your services. Service Fabric Mesh automatically allocates the infrastructure needed by your microservices, and also handles infrastructure failures, making sure your services are highly-available.

You worry about your code, Azure takes care of the hardware.

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Microservices

Service Fabric Mesh runs **Service Fabric Applications**, a set of resource definitions that make up one or more microservices. Each microservice is defined by a container image, CPU and memory requirements, and the network settings. You only need to specify the limits of the resources your applications and microservices need; Azure handles all of the infrastructure setup for you.

You can deploy your Service Fabric Application locally to the Service Fabric Mesh cluster emulator, or to Service Fabric Mesh on Azure. **Visual Studio** can be used to develop and debug your application locally and on Azure. The **Azure CLI** can be used to deploy your microservices to Azure.

If you have a monolithic application, you can easily host the entire application in a single container on Service Fabric Mesh. This makes it easy to port an application to the cloud even though it may not have been designed for the cloud. As time permits, you can break up the monolithic app into smaller, self-contained microservices. 

Your microservices can be independently scaled and updated within the Service Fabric Application. This means that you can iterate on specific portions of your application without impacting other services.

## Stateful services

Storing persistent or temporary data for your applications and services is important. Service Fabric Mesh has you covered with [Azure Files](/storage/files/storage-files-introduction) or the built-in Service Fabric local storage. 

<!-- THIS IS NOT YET AVAILABLE ON NUGET
You can also take advantage of the Service Fabric runtime that Service Fabric Mesh runs on by adding reference to the Service Fabric Reliable Collections [NuGet package](xxxxxxxxxxx) to your code projects. For more information about reliable collections, see [Introduction to Reliable Collections](../service-fabric/service-fabric-reliable-services-reliable-collections.md).
-->

## Next steps

It only takes a few steps to deploy a sample project with the Azure CLI. For more information, see [Deploy a container](service-fabric-mesh-quickstart-deploy-container.md). 

If you're using Visual Studio, try the [Create an ASP.NET Core website](service-fabric-mesh-tutorial-create-dotnetcore.md) tutorial.



<!-- Links -->

[service-fabric-overview]: ../service-fabric/service-fabric-overview.md