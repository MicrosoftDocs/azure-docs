---
title: Resource availability by region
description: Availability of compute and memory resources for the Azure Container Instances service in different Azure regions.
ms.topic: article
ms.date: 04/27/2020
ms.custom: references_regions

---
# Resource availability for Azure Container Instances in Azure regions

This article details the availability of Azure Container Instances compute, memory, and storage resources in Azure regions and by target operating system. For a general list of available regions for Azure Container Instances, see [available regions](https://azure.microsoft.com/regions/services/).

Values presented are the maximum resources available per deployment of a [container group](container-instances-container-groups.md). Values are current at time of publication.

> [!NOTE]
> Container groups created within these resource limits are subject to availability within the deployment region. When a region is under heavy load, you may experience a failure when deploying instances. To mitigate such a deployment failure, try deploying instances with lower resource settings, or try your deployment at a later time or in a different region with available resources.

For information about quotas and other limits in your deployments, see [Quotas and limits for Azure Container Instances](container-instances-quotas.md).

## Linux container groups

The following regions and maximum resources are available to container groups with Linux containers in general deployments, [Azure virtual network](container-instances-vnet.md) deployments, and deployments with [GPU resources](container-instances-gpu.md) (preview).

> [!IMPORTANT]
> The maximum resources in a region are different depending on your deployment. For example, a region may have a different maximum CPU and memory size in an Azure virtual network deployment than for a general deployment. That same region may also have a different set of maximum values for a deployment with GPU resources. Verify your deployment type before checking the below tables for the maximum values in your region.

| Region | Max CPU | Max Memory (GB) | VNET Max CPU | VNET Max Memory (GB) | Storage (GB) | GPU SKUs (preview) |
| -------- | :---: | :---: | :----: | :-----: | :-------: | :----: |
| Australia East | 4 | 16 | 4 | 16 | 50 | N/A |
| Brazil South | 4 | 16 | 2 | 8 | 50 | N/A |
| Canada Central | 4 | 16 | 4 | 16 | 50 | N/A |
| Central India | 4 | 16 | N/A | N/A | 50 | V100 |
| Central US | 4 | 16 | 4 | 16 | 50 | N/A |
| East Asia | 4 | 16 | 4 | 16 | 50 | N/A |
| East US | 4 | 16 | 4 | 16 | 50 | K80, P100, V100 |
| East US 2 | 4 | 16 | 4 | 16 | 50 | N/A |
| France Central | 4 | 16 | 4 | 16 | 50 | N/A |
| Japan East | 2 | 8 | 4 | 16 | 50 | N/A |
| Korea Central | 4 | 16 | N/A | N/A | 50 | N/A |
| North Central US | 2 | 3.5 | 4 | 16 | 50 | K80, P100, V100 |
| North Europe | 4 | 16 | 4 | 16 | 50 | K80 |
| South Central US | 4 | 16 | 4 | 16 | 50 | N/A |
| Southeast Asia | 4 | 16 | 4 | 16 | 50 | P100, V100 |
| South India | 4 | 16 | N/A | N/A | 50 | N/A |
| UK South | 4 | 16 | 4 | 16 | 50 | N/A |
| West Central US| 4 | 16 | 4 | 16 | 50 | N/A |
| West Europe | 4 | 16 | 4 | 16 | 50 | K80, P100, V100 |
| West US | 4 | 16 | 4 | 16 | 50 | N/A |
| West US 2 | 4 | 16 | 4 | 16 | 50 | K80, P100, V100 |

The following maximum resources are available to a container group deployed with [GPU resources](container-instances-gpu.md) (preview).

| GPU SKUs | GPU count | Max CPU | Max Memory (GB) | Storage (GB) |
| --- | --- | --- | --- | --- |
| K80 | 1 | 6 | 56 | 50 |
| K80 | 2 | 12 | 112 | 50 |
| K80 | 4 | 24 | 224 | 50 |
| P100, V100 | 1 | 6 | 112 | 50 |
| P100, V100 | 2 | 12 | 224 | 50 |
| P100, V100 | 4 | 24 | 448 | 50 |

## Windows container groups

The following regions and maximum resources are available to container groups with [supported and preview](container-instances-faq.md#what-windows-base-os-images-are-supported) Windows Server containers.

###  Windows Server 2016

> [!NOTE]
> See [Host and container version compatibility](/virtualization/windowscontainers/deploy-containers/update-containers#host-and-container-version-compatibility) for more information on 1B, 2B, and 3B hosts.

| Region | 1B/2B Max CPU | 1B/2B Max Memory (GB) |3B Max CPU | 3B Max Memory (GB) | Storage (GB) |
| -------- | :---: | :---: | :----: | :-----: | :-------: |
| Australia East | 2 | 8 | 2 | 3.5 | 20 |
| Brazil South | 4 | 16 | 4 | 16 | 20 |
| Canada Central | 2 | 3.5 | 2 | 3.5 | 20 |
| Central India | 2 | 3.5 | 2 | 3.5 | 20 |
| Central US | 2 | 3.5 | 2 | 3.5 | 20 |
| East Asia | 2 | 3.5 | 2 | 3.5 | 20 |
| East US | 4 | 16 | 2 | 8 | 20 |
| East US 2 | 2 | 3.5 | 4 | 16 | 20 |
| Japan East | 4 | 16 | 4 | 16 | 20 |
| Korea Central | 4 | 16 | 4 | 16 | 20 |
| North Central US | 4 | 16 | 4 | 16 | 20 |
| North Europe | 2 | 3.5 | 2 | 8 | 20 |
| South Central US | 2 | 3.5 | 2 | 3.5 | 20 |
| Southeast Asia | N/A | N/A | 2 | 3.5 | 20 |
| South India | 2 | 3.5 | 2 | 3.5 | 20 |
| UK South | 2 | 8 | 2 | 3.5 | 20 |
| West Central US | 4 | 16 | 4 | 16 | 20 |
| West Europe | 4 | 16 | 4 | 16 | 20 |
| West US | 4 | 16 | 2 | 8 | 20 |
| West US 2 | 2 | 3.5 | 2 | 3.5 | 20 |


### Windows Server 2019 LTSC

> [!NOTE]
> See [Host and container version compatibility](/virtualization/windowscontainers/deploy-containers/update-containers#host-and-container-version-compatibility) for more information on 1B, 2B, and 3B hosts.

| Region | 1B/2B Max CPU | 1B/2B Max Memory (GB) |3B Max CPU | 3B Max Memory (GB) | Storage (GB) |
| -------- | :---: | :---: | :----: | :-----: | :-------: |
| Australia East | 4 | 16 | 4 | 16 | 20 |
| Brazil South | 4 | 16 | 4 | 16 | 20 |
| Canada Central | 4 | 16 | 4 | 16 | 20 |
| Central India | 4 | 16 | 4 | 16 | 20 |
| Central US | 4 | 16 | 4 | 16 | 20 |
| East Asia | 4 | 16 | 4 | 16 | 20 |
| East US | 4 | 16 | 4 | 16 | 20 |
| East US 2 | 2 | 3.5 | 2 | 3.5 | 20 |
| France Central | 4 | 16 | 4 | 16 | 20 |
| Japan East | N/A | N/A | 4 | 16 | 20 |
| Korea Central | 4 | 16 | 4 | 16 | 20 |
| North Central US | 4 | 16 | 4 | 16 | 20 |
| North Europe | 4 | 16 | 4 | 16 | 20 |
| South Central US | 4 | 16 | 4 | 16 | 20 |
| Southeast Asia | 4 | 16 | 4 | 16 | 20 |
| South India | 4 | 16 | 4 | 16 | 20 |
| UK South | 4 | 16 | 4 | 16 | 20 |
| West Central US | 4 | 16 | 4 | 16 | 20 |
| West Europe | 4 | 16 | 4 | 16 | 20 |
| West US | 4 | 16 | 4 | 16 | 20 |
| West US 2 | 2 | 8 | 4 | 16 | 20 |

## Next steps

Let the team know if you'd like to see additional regions or increased resource availability at [aka.ms/aci/feedback](https://aka.ms/aci/feedback).

For information on troubleshooting container instance deployment, see [Troubleshoot deployment issues with Azure Container Instances](container-instances-troubleshooting.md).


[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
