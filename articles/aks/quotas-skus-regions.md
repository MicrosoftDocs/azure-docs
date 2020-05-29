---
title: Limits for resources, SKUs, regions
titleSuffix: Azure Kubernetes Service
description: Learn about the default quotas, restricted node VM SKU sizes, and region availability of the Azure Kubernetes Service (AKS).
services: container-service
ms.topic: conceptual
ms.date: 04/09/2019

---
# Quotas, virtual machine size restrictions, and region availability in Azure Kubernetes Service (AKS)

All Azure services set default limits and quotas for resources and features. Certain virtual machine (VM) SKUs are also restricted for use.

This article details the default resource limits for Azure Kubernetes Service (AKS) resources and the availability of AKS in Azure regions.

## Service quotas and limits

[!INCLUDE [container-service-limits](../../includes/container-service-limits.md)]

## Provisioned infrastructure

All other network, compute, and storage limitations apply to the provisioned infrastructure. For the relevant limits, see [Azure subscription and service limits](../azure-resource-manager/management/azure-subscription-service-limits.md).

> [!IMPORTANT]
> When you upgrade an AKS cluster, additional resources are temporarily consumed. These resources include available IP addresses in a virtual network subnet, or virtual machine vCPU quota. If you use Windows Server containers, the only endorsed approach to apply the latest updates to the nodes is to perform an upgrade operation. A failed cluster upgrade process may indicate that you don't have the available IP address space or vCPU quota to handle these temporary resources. For more information on the Windows Server node upgrade process, see [Upgrade a node pool in AKS][nodepool-upgrade].

## Restricted VM sizes

Each node in an AKS cluster contains a fixed amount of compute resources such as vCPU and memory. If an AKS node contains insufficient compute resources, pods might fail to run correctly. To ensure that the required *kube-system* pods and your applications can reliably be scheduled, **don't use the following VM SKUs in AKS**:

- Standard_A0
- Standard_A1
- Standard_A1_v2
- Standard_B1s
- Standard_B1ms
- Standard_F1
- Standard_F1s

For more information on VM types and their compute resources, see [Sizes for virtual machines in Azure][vm-skus].

## Region availability

For the latest list of where you can deploy and run clusters, see [AKS region availability][region-availability].

## Next steps

Certain default limits and quotas can be increased. If your resource supports an increase, request the increase through an [Azure support request][azure-support] (for **Issue type**, select **Quota**).

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
[region-availability]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service

<!-- LINKS - Internal -->
[vm-skus]: ../virtual-machines/linux/sizes.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
