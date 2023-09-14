---
title: Resource availability & quota limits for ACI
description: Availability and quota limits of compute and memory resources for the Azure Container Instances service in different Azure regions.
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.topic: conceptual
ms.date: 1/19/2023
ms.custom: references_regions

---
# Resource availability & quota limits for ACI

This article details the availability and quota limits of Azure Container Instances compute, memory, and storage resources in Azure regions and by target operating system. For a general list of available regions for Azure Container Instances, see [available regions](https://azure.microsoft.com/regions/services/). For product feature availability in Azure regions, see [Region availability](container-instances-region-availability.md).

Values presented are the maximum resources available per deployment of a [container group](container-instances-container-groups.md). Values are current at time of publication. 

> [!NOTE] 
> Container groups created within these resource limits are subject to availability within the deployment region. When a region is under heavy load, you may experience a failure when deploying instances. To mitigate such a deployment failure, try deploying instances with lower resource settings, or try your deployment at a later time or in a different region with available resources. 

## Default Quota Limits 

All Azure services include certain default limits and quotas for resources and features. This section details the default quotas and limits for Azure Container Instances.  

Use the [List Usage](/rest/api/container-instances/2022-09-01/location/list-usage) API to review current quota usage in a region for a subscription. 

Certain default limits and quotas can be increased. To request an increase of one or more resources that support such an increase, please submit an [Azure support request][azure-support] (select "Quota" for **Issue type**). 

> [!IMPORTANT]  
> Not all limit increase requests are guaranteed to be approved.
> Deployments with GPU resources are not supported in an Azure virtual network deployment and are only available on Linux container groups.
> Using GPU resources (preview) is not fully supported yet and any support is provided on a best-effort basis.

### Unchangeable (Hard) Limits 

The following limits are default limits that can’t be increased through a quota request. Any quota increase requests for these limits will not be approved.  

| Resource | Actual Limit | 
| --- | :--- | 
| Number of containers per container group | 60 | 
| Number of volumes per container group | 20 | 
| Ports per IP | 5 | 
| Container instance log size - running instance | 4 MB | 
| Container instance log size - stopped instance | 16 KB or 1,000 lines | 


### Changeable Limits (Eligible for Quota Increases) 

| Resource | Actual Limit | 
| --- | :--- | 
| Standard sku container groups per region per subscription | 100 | 
| Standard sku cores (CPUs) per region per subscription | 100 |  
| Standard sku cores (CPUs) for V100 GPU per region per subscription | 0 | 
| Container group creates per hour |300<sup>1</sup> | 
| Container group creates per 5 minutes | 100<sup>1</sup> | 
| Container group deletes per hour | 300<sup>1</sup> | 
| Container group deletes per 5 minutes | 100<sup>1</sup> | 

## Standard Container Resources 

### Linux Container Groups 

By default, the following resources are available general purpose (standard core SKU) containers in general deployments and [Azure virtual network](container-instances-vnet.md) deployments) for Linux & Windows containers. 

| Max CPU | Max Memory (GB) | VNET Max CPU | VNET Max Memory (GB) | Storage (GB) | 
| :---: | :---: | :----: | :-----: | :-------: |
| 4 | 16 | 4 | 16 | 50 | 

For a general list of available regions for Azure Container Instances, see [available regions](https://azure.microsoft.com/regions/services/). 

### Windows Containers 

The following regions and maximum resources are available to container groups with [supported and preview](./container-instances-faq.yml) Windows Server containers. 

#### Windows Server 2022 LTSC 

| 3B Max CPU | 3B Max Memory (GB) | Storage (GB) | Availability Zone support | 
| :----: | :-----: | :-------: | 
| 4 | 16 | 20 | Y | 

#### Windows Server 2019 LTSC 

> [!NOTE] 
> 1B and 2B hosts have been deprecated for Windows Server 2019 LSTC. See [Host and container version compatibility](/virtualization/windowscontainers/deploy-containers/update-containers#host-and-container-version-compatibility) for more information on 1B, 2B, and 3B hosts. 

The following resources are available in all Azure Regions supported by Azure Container Instances. For a general list of available regions for Azure Container Instances, see [available regions](https://azure.microsoft.com/regions/services/). 

| 3B Max CPU | 3B Max Memory (GB) | Storage (GB) | Availability Zone support | 
| :----: | :-----: | :-------: | 
| 4 | 16 | 20 | Y | 

## Spot Container Resources (Preview)

The following maximum resources are available to a container group deployed using [Spot Containers](container-instances-spot-containers-overview.md) (preview). 

> [!NOTE]
> Spot Containers are only available in the following regions at this time: East US 2, West Europe, and West US.

| Max CPU | Max Memory (GB) | VNET Max CPU | VNET Max Memory (GB) | Storage (GB) | 
| :---: | :---: | :----: | :-----: | :-------: |
| 4 | 16 | N/A | N/A | 50 | 

## Confidential Container Resources (Preview)

The following maximum resources are available to a container group deployed using [Confidential Containers](container-instances-confidential-overview.md) (preview).

> [!NOTE]
> Confidential Containers are only available in the following regions at this time: East US, North Europe, West Europe, and West US.

| Max CPU | Max Memory (GB) | VNET Max CPU | VNET Max Memory (GB) | Storage (GB) | 
| :---: | :---: | :----: | :-----: | :-------: |
| 4 | 16 | 4 | 16 | 50 | 

## GPU Container Resources (Preview) 
> [!IMPORTANT]
> K80 and P100 GPU SKUs are retiring by August 31st, 2023. This is due to the retirement of the underlying VMs used: [NC Series](../virtual-machines/nc-series-retirement.md) and [NCv2 Series](../virtual-machines/ncv2-series-retirement.md) Although V100 SKUs will be available, it is receommended to use Azure Kubernetes Service instead. GPU resources are not fully supported and should not be used for production workloads. Use the following resources to migrate to AKS today: [How to Migrate to AKS](../aks/aks-migration.md).

> [!NOTE]
> Not all limit increase requests are guaranteed to be approved.
> Deployments with GPU resources are not supported in an Azure virtual network deployment and are only available on Linux container groups.
> Using GPU resources (preview) is not fully supported yet and any support is provided on a best-effort basis.

The following maximum resources are available to a container group deployed with [GPU resources](container-instances-gpu.md) (preview). 

| GPU SKUs | GPU count | Max CPU | Max Memory (GB) | Storage (GB) | 
| --- | --- | --- | --- | --- | 
| V100 | 1 | 6 | 112 | 50 | 
| V100 | 2 | 12 | 224 | 50 | 
| V100 | 4 | 24 | 448 | 50 | 

## Next steps 

Certain default limits and quotas can be increased. To request an increase of one or more resources that support such an increase, please submit an [Azure support request][azure-support] (select "Quota" for **Issue type**). 

Let the team know if you'd like to see additional regions or increased resource availability at [aka.ms/aci/feedback](https://aka.ms/aci/feedback). 

For information on troubleshooting container instance deployment, see [Troubleshoot deployment issues with Azure Container Instances](container-instances-troubleshooting.md) 

<!-- LINKS - External --> 

[az-region-support]: ../availability-zones/az-overview.md#regions 

[azure-support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest 

 

 
