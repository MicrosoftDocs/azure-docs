---
title: Find Azure Service Fabric Mesh samples | Microsoft Docs
description: Learn how to find different Service Fabric Mesh sample applications.
services: service-fabric-mesh
keywords:  
author: v-vasuke
ms.author: v-vasuke
ms.date: 12/03/2018
ms.topic: conceptual
ms.service: service-fabric-mesh
manager: chakdan
#Customer intent: Choose a prepared sample project that most closely mirrors my goals. 
---

# Find Service Fabric Mesh Samples

This table outlines the available Service Fabric Mesh sample applications. The source code in these examples shows how to achieve a particular scenario using the Service Fabric Resource Model.

For more information about deploying templates directly to Azure, see the [sample template GitHub page.](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/README.md)

|Sample Template|Scenario Description|Source Code|Developer Tools|
|------------|--------------------|----------|----------------------|
| [Hello World App](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/templates/helloworld) | Static webpage hosted in a container. For Linux it uses nginx, for Windows IIS | [Source Code](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/helloworld) | No requirements |
| [Counter App for Azure File Volumes](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/templates/counter/readme.md) | Store state by mounting Azure Files based volume inside the container. <br><br> **Note:** This template requires an Azure Files file share to already be provisioned [Instructions](https://docs.microsoft.com/azure/storage/files/storage-how-to-create-file-share) | [Source Code](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/counter) | Visual Studio Mesh Tooling |
| [TodoListApp](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/templates/todolist) | Create an application with a frontend and backend service that uses DNS-based resolution. Used as a tutorial [here](https://docs.microsoft.com/azure/service-fabric-mesh/service-fabric-mesh-tutorial-create-dotnetcore) | [Source Code](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/todolistapp) | Visual Studio Mesh Tooling |
| [Visual Objects App](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/templates/visualobjects) | Scale and upgrade microservices within an application. | [Source Code](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/visualobjects) |  Visual Studio Mesh Tooling |
| [Voting App](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/templates/voting) | Create an application with a frontend and backend service that uses DNS-based resolution | [Source Code](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/votingapp) | Visual Studio Mesh Tooling for the Windows version, VS Code / dotnet cli can be used for the Linux version |
| [Counter App for Service Fabric Reliable Volumes](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/templates/counter/readme.sfreliablevolume.md)| Store state by mounting Service Fabric Reliable Disk based volume inside the container.| [Source Code](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/counter) | Visual Studio Mesh Tooling |
