---
title: Monitoring and diagnostics in Azure Service Fabric Mesh applications | Microsoft Docs
description: Learn about monitoring and diagnosing application in Service Fabric Mesh on Azure.
services: service-fabric-mesh
documentationcenter: .net
author: srrengar
manager: timlt
editor: ''
ms.assetid: 
ms.service: service-fabric-mesh
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/22/2018
ms.author: srrengar
ms.custom: mvc, devcenter 

---

# Monitoring and diagnostics
Azure Service Fabric Mesh is a fully managed service that enables developers to deploy microservices applications without managing virtual machines, storage, or networking. Monitoring and diagnostics for Service Fabric Mesh is categorized into three main types of diagnostics data:

- Application logs - these are defined as the logs from your containerized applications, based on how you have instrumented your application (e.g. docker logs)
- Platform events - events from the Mesh platform relevant to your container operation, currently including container activation, deactivation, and termination.
- Container metrics - resource utilization and performance metrics for your containers (docker stats)

This article discusses the monitoring and diagnostics options for the latest preview version available.

## Application logs

You can view your docker logs from your deployed containers, on a per container basis. In the Service Fabric Mesh application model, each container is a code package in your application. To see the associated logs with a code package, use the following command:

```cli
az mesh code-package-log get --resource-group <nameOfRG> --app-name <nameOfApp> --service-name <nameOfService> --replica-name <nameOfReplica> --code-package-name <nameOfCodePackage>
```

> [!NOTE]
> You can use the "az mesh servicereplica" command to get the replica name. Replica names are incrementing numbers from 0.*

Here is what this looks like for seeing the logs from the VotingWeb.Code container from the voting application:

```cli
az mesh code-package-log get --resource-group <nameOfRG> --application-name SbzVoting --service-name VotingWeb --replica-name 0 --code-package-name VotingWeb.Code
```

## Next steps
To learn more about Service Fabric Mesh, read the overview:
- [Service Fabric Mesh overview](service-fabric-mesh-overview.md)
