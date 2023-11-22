---
title: Limits for resources, SKUs, and regions in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn about the default quotas, restricted node VM SKU sizes, and region availability of the Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 03/07/2023
---

# Quotas, virtual machine size restrictions, and region availability in Azure Kubernetes Service (AKS)

All Azure services set default limits and quotas for resources and features, including usage restrictions for certain virtual machine (VM) SKUs.

This article details the default resource limits for Azure Kubernetes Service (AKS) resources and the availability of AKS in Azure regions.

## Service quotas and limits

[!INCLUDE [container-service-limits](../../includes/container-service-limits.md)]

## Provisioned infrastructure

All other network, compute, and storage limitations apply to the provisioned infrastructure. For the relevant limits, see [Azure subscription and service limits](../azure-resource-manager/management/azure-subscription-service-limits.md).

> [!IMPORTANT]
> When you upgrade an AKS cluster, extra resources are temporarily consumed. These resources include available IP addresses in a virtual network subnet or virtual machine vCPU quota.
>
> For Windows Server containers, you can perform an upgrade operation to apply the latest node updates. If you don't have the available IP address space or vCPU quota to handle these temporary resources, the cluster upgrade process will fail. For more information on the Windows Server node upgrade process, see [Upgrade a node pool in AKS][nodepool-upgrade].

## Supported VM sizes

The list of supported VM sizes in AKS is evolving with the release of new VM SKUs in Azure. Please follow the [AKS release notes](https://github.com/Azure/AKS/releases) to stay informed of new supported SKUs.

## Restricted VM sizes

VM sizes with less than two CPUs may not be used with AKS.

Each node in an AKS cluster contains a fixed amount of compute resources such as vCPU and memory. If an AKS node contains insufficient compute resources, pods might fail to run correctly. To ensure the required *kube-system* pods and your applications can be reliably scheduled, AKS requires nodes use VM sizes with at least two CPUs.

For more information on VM types and their compute resources, see [Sizes for virtual machines in Azure][vm-skus].

## Supported container image sizes

AKS doesn't set a limit on the container image size. However, it's important to understand that the larger the container image, the higher the memory demand. This could potentially exceed resource limits or the overall available memory of worker nodes. By default, memory for VM size Standard_DS2_v2 for an AKS cluster is set to 7 GiB.

When a container image is very large (1 TiB or more), kubelet might not be able to pull it from your container registry to a node due to lack of disk space.

## Region availability

For the latest list of where you can deploy and run clusters, see [AKS region availability][region-availability].

## Cluster configuration presets in the Azure portal

When you create a cluster using the Azure portal, you can choose a preset configuration to quickly customize based on your scenario. You can modify any of the preset values at any time.

| Preset           | Description                                                            |
|------------------|------------------------------------------------------------------------|
| Standard         | Best if you're not sure what to choose. Works well with most applications. |
| Dev/Test         | Best for experimenting with AKS or deploying a test application. |
| Cost-optimized   | Best for reducing costs on production workloads that can tolerate interruptions. |
| Batch processing | Best for machine learning, compute-intensive, and graphics-intensive workloads. Suited for applications requiring fast scale-up and scale-out of the cluster. |
| Hardened access  | Best for large enterprises that need full control of security and stability. |


|                              |Standard |Dev/Test|Cost-optimized|Batch processing|Hardened access|
|------------------------------|---------|--------|--------|--------|--------|
|**System node pool node size**|DS2_v2   |B4ms|B4ms|D4s_v3|D4s_v3|
|**User node pool node size**|-   |-|B4ms|NC6s_v3|D4s_v3|
|**Cluster autoscaling**|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|-|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|
|**Private cluster**|-|-|-|-|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|
|**Availability zones**|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|-|-|-|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|
|**Azure Policy**|-|-|-|-|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|
|**Azure Monitor**|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|-|-|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|


## Next steps

You can increase certain default limits and quotas. If your resource supports an increase, request the increase through an [Azure support request][azure-support] (for **Issue type**, select **Quota**).

<!-- LINKS - External -->
[azure-support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
[region-availability]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service

<!-- LINKS - Internal -->
[vm-skus]: ../virtual-machines/sizes.md
[nodepool-upgrade]: manage-node-pools.md#upgrade-a-single-node-pool
