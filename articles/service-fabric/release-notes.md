---
title: Azure Service Fabric releases
description: Release notes for the latest features and improvements in Service Fabric.
author: athinanthny
manager: chackdan
ms.author: atsenthi
ms.date: 6/10/2019
ms.topic: conceptual
ms.service: service-fabric
hide_comments: true
hideEdit: true
---

# Service Fabric releases

| <a href="https://github.com/Azure/Service-Fabric-Troubleshooting-Guides" target="blank">Troubleshooting Guides</a> 
| <a href="https://github.com/Azure/service-fabric-issues" target="blank">Issue Tracking</a> 
| <a href="https://docs.microsoft.com/azure/service-fabric/service-fabric-support" target="blank">Support Options</a> 
| <a href="https://docs.microsoft.com/azure/service-fabric/service-fabric-versions" target="blank">Supported Versions</a> 
| <a href="https://azure.microsoft.com/resources/samples/?service=service-fabric&sort=0" target="blank">Code Samples</a>

This article provides more information on the latest releases and updates to the Service Fabric runtime and SDKs.

## **What's new in Service Fabric**

### Service Fabric 6.5

The latest Service Fabric release includes supportability, reliability, performance improvements, new features, bug fixes, and enhancements to ease cluster and application lifecycle management.

> [!IMPORTANT]
> Service Fabric 6.5 is the final release with Service Fabric tools support in Visual Studio 2015. Customers are advised to move to [Visual Studio 2019](https://visualstudio.microsoft.com/vs/compare/) going forward.

Here's what's new in Service Fabric 6.5:

- Patch Orchestration Application (POA) version 1.4.0 includes many self-diagnostic improvements. Customers of POA are recommended to move to this version.

- Service Fabric Explorer now includes the applications that you have uploaded to image store.

- [EventStore Service is enabled by default](service-fabric-visualizing-your-cluster.md#event-store) for Service Fabric 6.5 clusters unless you have opted out.

- Added [replica lifecycle events](service-fabric-diagnostics-event-generation-operational.md#replica-events) for stateful services.

- Better visibility of seed node status, including cluster-level warnings if a seed node is unhealthy (*Down*, *Removed* or *Unknown*).

- [Service Fabric Application Disaster Recovery Tool](https://github.com/Microsoft/Service-Fabric-AppDRTool) allows users of Service Fabric stateful services to get back live soon in case the primary cluster encounters a disaster. The tool constantly synchronizes the data from the application running on the primary cluster on the standby application on secondary using periodic backup and restore.

- Visual Studio support for [publishing .NET Core apps to Linux-based clusters](service-fabric-how-to-publish-linux-app-vs.md).

- [Azure Service Fabric CLI (SFCTL)](https://docs.microsoft.com/azure/service-fabric/service-fabric-cli) will be installed automatically for Service Fabric 6.5 (and later versions) when you upgrade or create a new Linux cluster on Azure.

- [SFCTL](https://docs.microsoft.com/azure/service-fabric/service-fabric-cli) is installed by default on MacOS/Linux OneBox clusters.

- General machine bootstrap script is provided to set up prerequisites for Service Fabric Linux nodes for deployment & upgrade scenarios.

## Previous versions

### Service Fabric 6.4 releases

| Release date | Release | More info |
|---|---|---|
| November 30, 2018 | [Azure Service Fabric 6.4 (RTO)](https://blogs.msdn.microsoft.com/azureservicefabric/2018/11/30/azure-service-fabric-6-4-release/)  | [Release notes](https://msdnshared.blob.core.windows.net/media/2018/12/Service-Fabric-6.4-Release.pdf)|
| December 12, 2018 | [Azure Service Fabric 6.4 refresh for Windows clusters (CU2)](https://blogs.msdn.microsoft.com/azureservicefabric/2018/12/12/azure-service-fabric-6-4-refresh-for-windows-clusters/)  | [Release notes](https://msdnshared.blob.core.windows.net/media/2018/12/Links.pdf)  |
| February 4, 2019 | [Azure Service Fabric 6.4 CU3](https://blogs.msdn.microsoft.com/azureservicefabric/2019/02/04/azure-service-fabric-6-4-refresh-release/) | [Release notes](https://msdnshared.blob.core.windows.net/media/2019/02/Service-Fabric-6.4CU3-Release-Notes.pdf) |
| March 4, 2019 | [Azure Service Fabric 6.4 CU4](https://blogs.msdn.microsoft.com/azureservicefabric/2019/03/12/azure-service-fabric-6-4-refresh-release-2/) | [Release notes](https://msdnshared.blob.core.windows.net/media/2019/03/Service-Fabric-6.4CU4-Release-Notes.pdf)
| April 8, 2019 | [Azure Service Fabric 6.4 CU5](https://blogs.msdn.microsoft.com/azureservicefabric/2019/04/08/azure-service-fabric-6-4-refresh-release-5/) | [Release notes](https://msdnshared.blob.core.windows.net/media/2019/04/Service-Fabric-6.4CU5-ReleaseNotes3.pdf)
| May 2, 2019 | [Azure Service Fabric 6.4 CU6](https://blogs.msdn.microsoft.com/azureservicefabric/2019/05/02/azure-service-fabric-6-4-refresh-release-3/) | [Release notes](https://msdnshared.blob.core.windows.net/media/2019/05/Service-Fabric-64CU6-Release-Notes-V2.pdf)
| May 28, 2019 | [Azure Service Fabric 6.4 CU7](https://blogs.msdn.microsoft.com/azureservicefabric/2019/05/28/azure-service-fabric-6-4-refresh-release-4/) | [Release notes](https://msdnshared.blob.core.windows.net/media/2019/05/Service_Fabric_64CU7_Release_Notes1.pdf)
