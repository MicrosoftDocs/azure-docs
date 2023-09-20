---
title: Resource availability by region
description: Availability of compute and memory resources for the Azure Container Instances service in different Azure regions.
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.topic: conceptual
ms.date: 05/23/2023
ms.custom: references_regions

---
# Resource availability for Azure Container Instances in Azure regions

This article details the availability of Azure Container Instances compute, memory, storage resources, and product features in Azure regions and by target operating system. For a general list of available regions for Azure Container Instances, see [available regions](https://azure.microsoft.com/regions/services/).

Values presented are the maximum resources available per deployment of a [container group](container-instances-container-groups.md). Values are current at time of publication.

> [!NOTE]
> Container groups created within these resource limits are subject to availability within the deployment region. When a region is under heavy load, you may experience a failure when deploying instances. To mitigate such a deployment failure, try deploying instances with lower resource settings, or try your deployment at a later time or in a different region with available resources.

For information about quotas and other limits in your deployments, see [Quotas and limits for Azure Container Instances](container-instances-resource-and-quota-limits.md).

## Linux container groups

The following regions and maximum resources are available to container groups with Linux containers in general deployments, [Azure virtual network](container-instances-vnet.md) deployments, and deployments with [GPU resources](container-instances-gpu.md) (preview).

> [!IMPORTANT]
> The maximum resources in a region are different depending on your deployment. For example, a region may have a different maximum CPU and memory size in an Azure virtual network deployment than for a general deployment. That same region may also have a different set of maximum values for a deployment with GPU resources. Verify your deployment type before checking the below tables for the maximum values in your region.

> [!NOTE]
> Some regions don't support availability zones (denoted by a 'N/A' in the table), and some regions have availability zones, but ACI doesn't currently leverage the capability (denoted by an 'N' in the table). For more information, see [Azure regions with availability zones][az-region-support].

| Region | Max CPU | Max memory (GB) | VNET max CPU | VNET max memory (GB) | Storage (GB) | GPU SKUs (preview) | Availability Zone support | Confidential SKU | Spot containers (preview) |
| -------- | :---: | :---: | :----: | :-----: | :-------: | :----: | :----: | :----: | :----: |
| Australia East | 4 | 16 | 4 | 16 | 50 | N/A | Y | N | N |
| Australia Southeast | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| Brazil South | 4 | 16 | 4 | 16 | 50 | N/A | Y | N | N |
| Canada Central | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| Canada East | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| Central India | 4 | 16 | 4 | 16 | 50 | V100 | N | N | N |
| Central US | 4 | 16 | 4 | 16 | 50 | N/A | Y | N | N |
| East Asia | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| East US | 4 | 16 | 4 | 16 | 50 | K80, P100, V100 | Y | Y | N |
| East US 2 | 4 | 16 | 4 | 16 | 50 | N/A | Y | N | Y |
| France Central | 4 | 16 | 4 | 16 | 50 | N/A | Y| N | N |
| Germany West Central | 4 | 16 | 4 | 16 | 50 | N/A | Y | N | N |
| Japan East | 4 | 16 | 4 | 16 | 50 | N/A | Y | N | N |
| Japan West | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| Jio India West | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| Korea Central | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| North Central US | 4 | 16 | 4 | 16 | 50 | K80, P100, V100 | N | N | N |
| North Europe | 4 | 16 | 4 | 16 | 50 | K80 | Y | Y | N |
| Norway East | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| Norway West | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| South Africa North | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| South Central US | 4 | 16 | 4 | 16 | 50 | V100 | Y | N | N |
| South India | 4 | 16 | 4 | 16 | 50 | K80 | N | N | N |
| Southeast Asia | 4 | 16 | 4 | 16 | 50 | P100, V100 | Y | N | N |
| Sweden Central | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| Sweden South | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| Switzerland North | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| Switzerland West | 4 | 16 | N/A | N/A | 50 | N/A | N | N | N |
| UAE North | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| UK South | 4 | 16 | 4 | 16 | 50 | N/A | Y | N | N | 
| UK West | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| West Central US| 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |
| West Europe | 4 | 16 | 4 | 16 | 50 | K80, P100, V100 | Y | Y | Y |
| West India | 4 | 16 | N/A | N/A | 50 | N/A | N | N | N |
| West US | 4 | 16 | 4 | 16 | 50 | N/A | N | Y | Y |
| West US 2 | 4 | 16 | 4 | 16 | 50 | K80, P100, V100 | Y | N | N |
| West US 3 | 4 | 16 | 4 | 16 | 50 | N/A | N | N | N |

The following maximum resources are available to a container group deployed with [GPU resources](container-instances-gpu.md) (preview).

> [!IMPORTANT]
> At this time, deployments with GPU resources are not supported in an Azure virtual network deployment and are only available on Linux container groups.

| GPU SKUs | GPU count | Max CPU | Max Memory (GB) | Storage (GB) |
| --- | --- | --- | --- | --- |
| K80 | 1 | 6 | 56 | 50 |
| K80 | 2 | 12 | 112 | 50 |
| K80 | 4 | 24 | 224 | 50 |
| P100, V100 | 1 | 6 | 112 | 50 |
| P100, V100 | 2 | 12 | 224 | 50 |
| P100, V100 | 4 | 24 | 448 | 50 |

## Windows container groups

The following regions and maximum resources are available to container groups with [supported and preview](./container-instances-faq.yml) Windows Server containers.

> [!IMPORTANT]
> At this time, deployments with Windows container groups are not supported in an Azure virtual network deployment.

> [!IMPORTANT] 
> At this time, Windows container groups are not supported with Confidential containers on Azure Container Instances.

### Windows Server 2016

> [!NOTE]
> 1B and 2B hosts have been deprecated for Windows Server 2016. See [Host and container version compatibility](/virtualization/windowscontainers/deploy-containers/update-containers#host-and-container-version-compatibility) for more information on 1B, 2B, and 3B hosts.

| Region |3B Max CPU | 3B Max Memory (GB) | Storage (GB) |
| -------- | :----: | :-----: | :-------: |
| Australia East | 2 | 8 | 20 |
| Brazil South | 4 | 16 | 20 |
| Canada Central  | 2 | 3.5 | 20 |
| Central India | 2 | 3.5 | 20 |
| Central US | 2 | 3.5 | 20 |
| East Asia | 2 | 3.5 | 20 |
| East US | 2 | 8 | 20 |
| East US 2 | 4 | 16 | 20 |
| Japan East | 4 | 16 | 20 |
| Korea Central | 4 | 16 | 20 |
| North Central US | 4 | 16 | 20 |
| North Europe | 2 | 8 | 20 |
| South Central US | 2 | 8 | 20 |
| Southeast Asia | 2 | 3.5 | 20 |
| South India | 2 | 3.5 | 20 |
| UK South | 2 | 3.5 | 20 |
| West Central US | 2 | 8 | 20 |
| West Europe | 4 | 16 | 20 |
| West US | 2 | 8 | 20 |
| West US 2 | 2 | 3.5 | 20 |

### Windows Server 2019 LTSC

> [!NOTE]
> 1B and 2B hosts have been deprecated for Windows Server 2019 LTSC. See [Host and container version compatibility](/virtualization/windowscontainers/deploy-containers/update-containers#host-and-container-version-compatibility) for more information on 1B, 2B, and 3B hosts.

| Region | 3B Max CPU | 3B Max Memory (GB) | Storage (GB) | Availability Zone support |
| -------- | :----: | :-----: | :-------: |
| Australia East | 4 | 16 | 20 | Y |
| Brazil South | 4 | 16 | 20 | Y |
| Canada Central | 4 | 16 | 20 | N |
| Central India | 4 | 16 | 20 | N |
| Central US | 4 | 16 | 20 | Y |
| East Asia | 4 | 16 | 20 | N |
| East US | 4 | 16 | 20 | Y |
| East US 2 | 4 | 16 | 20 | Y |
| France Central | 4 | 16 | 20 | Y |
| Japan East | 4 | 16 | 20 | Y |
| Korea Central | 4 | 16 | 20 | N |
| North Central US | 4 | 16 | 20 | N |
| North Europe | 4 | 16 | 20 | Y |
| South Central US | 4 | 16 | 20 | Y |
| Southeast Asia | 4 | 16 | 20 | Y |
| South India | 4 | 16 | 20 | N |
| UK South | 4 | 16 | 20 | Y |
| West Central US | 4 | 16 | 20 | N |
| West Europe | 4 | 16 | 20 | Y |
| West US | 4 | 16 | 20 | N |
| West US 2 | 4 | 16 | 20 | Y |
| West US 3| 4 | 16 | 20 | Y |

## Next steps

Let the team know if you'd like to see more regions or increased resource availability at [aka.ms/aci/feedback](https://aka.ms/aci/feedback).

For information on troubleshooting container instance deployment, see [Troubleshoot deployment issues with Azure Container Instances](container-instances-troubleshooting.md).


[azure-support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
[az-region-support]: ../availability-zones/az-overview.md#regions
