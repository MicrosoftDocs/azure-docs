---
title: Azure Container Instances resource availability
description: Availability of compute and memory resources for the Azure Container Instances service in different Azure regions.
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: overview
ms.date: 03/01/2019
ms.author: danlep
---
# Resource availability for Azure Container Instances in Azure regions

This article details the availability of Azure Container Instances compute and memory resources in Azure regions. 

Values presented are the maximum resources available per deployment of a [container group](container-instances-container-groups.md). Values are current at time of publication. For up-to-date information, use the [List Capabilities](/rest/api/container-instances/listcapabilities/listcapabilities) API. 

> [!NOTE]
> Container groups created within these resource limits are subject to availability within the deployment region. When a region is under heavy load, you may experience a failure when deploying instances. To mitigate such a deployment failure, try deploying instances with lower resource settings, or try your deployment at a later time.

For information about quotas and other limits in your deployments, see [Quotas and limits for Azure Container Instances](container-instances-quotas.md).

## Availability - General

| Location | OS | CPU | Memory (GB) |
| -------- | -- | :---: | :-----------: |
| Canada Central, Central US, East US 2, South Central US | Linux | 4 | 16 |
| East US, North Europe, West Europe, West US, West US 2 | Linux | 4 | 14 |
| Japan East | Linux | 2 | 8 |
| Australia East, Southeast Asia | Linux | 2 | 7 |
| Central India, East Asia, North Central US, South India | Linux | 2 | 3.5 |
| East US, West Europe, West US | Windows | 4 | 14 |
| Australia East, Canada Central, Central India, Central US, East Asia, East US 2, Japan East, North Central US, North Europe, South Central US, South India, Southeast Asia, West US 2 | Windows | 2 | 3.5 |

## Availability - Virtual network deployment (preview)

The following regions and resources are available to a container group deployed in an [Azure virtual network](container-instances-vnet.md) (preview),

[!INCLUDE [container-instances-vnet-limits](../../includes/container-instances-vnet-limits.md)]

## Availability - GPU resources (preview)

The following regions and resources are available to a container group deployed with [GPU resources](container-instances-gpu.md) (preview),

[!INCLUDE [container-instances-gpu-regions](../../includes/container-instances-gpu-regions.md)]
[!INCLUDE [container-instances-gpu-limits](../../includes/container-instances-gpu-limits.md)]

## Next steps

Let the team know if you'd like to see additional regions or increased resource availability at [aka.ms/aci/feedback](https://aka.ms/aci/feedback).

For information on troubleshooting container instance deployment, see [Troubleshoot deployment issues with Azure Container Instances](container-instances-troubleshooting.md).
