---
title: Limits for resources, SKUs, regions
titleSuffix: Azure Kubernetes Service
description: Learn about the default quotas, restricted node VM SKU sizes, and region availability of the Azure Kubernetes Service (AKS).
services: container-service
ms.topic: conceptual
ms.date: 03/25/2021

---
# Quotas, virtual machine size restrictions, and region availability in Azure Kubernetes Service (AKS)

All Azure services set default limits and quotas for resources and features, including usage restrictions for certain virtual machine (VM) SKUs.

This article details the default resource limits for Azure Kubernetes Service (AKS) resources and the availability of AKS in Azure regions.

## Service quotas and limits

[!INCLUDE [container-service-limits](../../includes/container-service-limits.md)]

## Provisioned infrastructure

All other network, compute, and storage limitations apply to the provisioned infrastructure. For the relevant limits, see [Azure subscription and service limits](../azure-resource-manager/management/azure-subscription-service-limits.md).

> [!IMPORTANT]
> When you upgrade an AKS cluster, extra resources are temporarily consumed. These resources include include available IP addresses in a virtual network subnet or virtual machine vCPU quota. 
>
> For Windows Server containers, you can perform an upgrade operation to apply the latest node updates. If you don't have the available IP address space or vCPU quota to handle these temporary resources, the cluster upgrade process will fail. For more information on the Windows Server node upgrade process, see [Upgrade a node pool in AKS][nodepool-upgrade].

## Restricted VM sizes

Each node in an AKS cluster contains a fixed amount of compute resources such as vCPU and memory. If an AKS node contains insufficient compute resources, pods might fail to run correctly. To ensure the required *kube-system* pods and your applications can  be reliably scheduled, **don't use the following VM SKUs in AKS**:

- Standard_A0
- Standard_A1
- Standard_A1_v2
- Standard_B1ls
- Standard_B1s
- Standard_B1ms
- Standard_F1
- Standard_F1s
- Standard_A2
- Standard_D1
- Standard_D1_v2
- Standard_DS1
- Standard_DS1_v2

For more information on VM types and their compute resources, see [Sizes for virtual machines in Azure][vm-skus].

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

## Next steps

You can increase certain default limits and quotas. If your resource supports an increase, request the increase through an [Azure support request][azure-support] (for **Issue type**, select **Quota**).

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
[region-availability]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service

<!-- LINKS - Internal -->
[vm-skus]: ../virtual-machines/sizes.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
