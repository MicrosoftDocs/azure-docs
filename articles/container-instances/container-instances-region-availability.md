---
title: Azure Container Instances region and resource availability | Azure Docs
description: Discover which Azure regions support the deployment of container instances, and the CPU and memory limits for those instances.
services: container-instances
documentationcenter: ''
author: mmacy
manager: timlt
editor: ''
tags:
keywords: ''

ms.assetid:
ms.service: container-instances
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/31/2017
ms.author: marsma
ms.custom:
---

# Region availability for Azure Container Instances

During preview, Azure Container Instances are available in the following regions with the specified CPU and memory limits.

| Location | OS | CPU | Memory (GB) |
| -------- | -- | :---: | :-----------: |
| West Europe, West US, East US | Linux | 2 | 7 |
| West Europe, West US, East US | Windows | 2 | 3.5 |

## Resource availability

Container instances created within these resource limits are subject to availability within the deployment region. When a region is under heavy load, you may experience a failure when deploying instances.

To mitigate such a deployment failure, try deploying instances with lower CPU and memory settings, or try your deployment at a later time.

## Next steps

For more information on troubleshooting container instance deployment, see [Troubleshoot deployment issues with Azure Container Instances](container-instances-troubleshooting.md).