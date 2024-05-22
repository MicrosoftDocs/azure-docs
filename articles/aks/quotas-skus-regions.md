---
title: Limits for resources, SKUs, and regions in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn about the default quotas, restricted node VM SKU sizes, and region availability of the Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 01/12/2024
author: nickomang
ms.author: nickoman

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

VM sizes with fewer than two CPUs may not be used with AKS.
Each node in an AKS cluster contains a fixed amount of compute resources such as vCPU and memory. If an AKS node contains insufficient compute resources, pods might fail to run correctly. To ensure that the required *kube-system* pods and your applications can reliably be scheduled, **don't use [B series VMs][b-series-vm] and the following VM SKUs in AKS on system node pools**:

- Standard_A0
- Standard_A1
- Standard_A1_v2
- Standard_F1
- Standard_F1s

For more information on VM types and their compute resources, see [Sizes for virtual machines in Azure][vm-skus].

## Supported container image sizes

AKS doesn't set a limit on the container image size. However, it's important to understand that the larger the container image, the higher the memory demand. This could potentially exceed resource limits or the overall available memory of worker nodes. By default, memory for VM size Standard_DS2_v2 for an AKS cluster is set to 7 GiB.

When a container image is very large (1 TiB or more), kubelet might not be able to pull it from your container registry to a node due to lack of disk space.

## Region availability

For the latest list of where you can deploy and run clusters, see [AKS region availability][region-availability].

## Cluster configuration presets in the Azure portal

When you create a cluster using the Azure portal, you can choose a preset configuration to quickly customize based on your scenario. You can modify any of the preset values at any time.

| Preset                      | Description                                                            |
|-----------------------------|------------------------------------------------------------------------|
| Production Standard         | Best for most applications serving production traffic with AKS recommended best practices. |
| Dev/Test                    | Best for developing new workloads or testing existing workloads. |
| Production Economy          | Best for serving production traffic in a cost conscious way if your workloads can tolerate interruptions. |
| Production Enterprise       | Best for serving production traffic with rigorous permissions and hardened security. |

|                              | Production Standard |Dev/Test|Production Economy|Production Enterprise|
|------------------------------|---------|--------|--------|--------|
|**System node pool node size**|Standard_D8ds_v5 |Standard_DS2_v2|Standard_D8ds_v5|Standard_D16ds_v5|
|**System node pool autoscaling range**|2-5 nodes|2-100 nodes|2-5 nodes|2-5 nodes|
|**User node pool node size**|Standard_D8ds_v5|-|Standard_D8as_v4|Standard_D8ds_v5|
|**User node pool autoscaling range**|2-100 nodes|-|-|2-100 nodes|
|**Private cluster**|-|-|-|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|
|**Availability zones**|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|-|-|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|
|**Azure Policy**|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|-|-|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|
|**Azure Monitor**|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|-|-|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|
|**Secrets store CSI driver**|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|-|-|:::image type="icon" source="./media/quotas-skus-regions/yes-icon.svg":::|
|**Network configuration**|Azure CNI|Kubenet|Azure CNI|Azure CNI|
|**Network configuration**|Calico|Calico|Calico|Calico|
|**Authentication and Authorization**|Local accounts with Kubernetes RBAC|Local accounts with Kubernetes RBAC|Azure AD Authentication with Azure RBAC|Azure AD authentication with Azure RBAC|


## Next steps

You can increase certain default limits and quotas. If your resource supports an increase, request the increase through an [Azure support request][azure-support] (for **Issue type**, select **Quota**).

<!-- LINKS - External -->
[azure-support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
[region-availability]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service

<!-- LINKS - Internal -->
[vm-skus]: ../virtual-machines/sizes.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[b-series-vm]: ../virtual-machines/sizes-b-series-burstable.md


