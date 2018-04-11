---
title: Overview of Service Fabric and containers | Microsoft Docs
description: An overview of Service Fabric and the use of containers to deploy microservice applications. This article provides an overview of how containers can be used and the available capabilities in Service Fabric.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: c98b3fcb-c992-4dd9-b67d-2598a9bf8aab
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/11/2018
ms.author: ryanwi

---
# View logs for a Service Fabric container service
Azure Service Fabric is a container orchestrator and supports containers on both Linux and Windows.


Azure Service Fabric is an [orchestrator](service-fabric-cluster-resource-manager-introduction.md) of services across a cluster of machines, with years of usage and optimization in massive scale services at Microsoft. Services can be developed in many ways, from using the [Service Fabric programming models](service-fabric-choose-framework.md) to deploying [guest executables](service-fabric-guest-executables-introduction.md). By default, Service Fabric deploys and activates these services as processes. Processes provide the fastest activation and highest density usage of the resources in a cluster. Service Fabric can also deploy services in container images. Importantly, you can mix services in processes and services in containers in the same application.   


![Service Fabric platform][Image1]


## Next steps

[Image1]: media/service-fabric-containers-view-logs/view-container-logs-sfx.png
