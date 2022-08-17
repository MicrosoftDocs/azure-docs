---
title: Azure Kubernetes Service (AKS) with Uptime SLA
description: Learn about the optional Uptime SLA offering for the Azure Kubernetes Service (AKS) API Server.
services: container-service
ms.topic: conceptual
ms.date: 06/29/2022
ms.custom: references_regions, devx-track-azurecli
---

# Azure Kubernetes Service (AKS) Uptime SLA

Uptime SLA is a tier to enable a financially backed, higher SLA for an AKS cluster. Clusters with Uptime SLA, also referred to as [Paid SKU tier][paid-sku-tier] in AKS REST APIs, come with greater amount of control plane resources and automatically scale to meet the load of your cluster. Uptime SLA guarantees 99.95% availability of the Kubernetes API server endpoint for clusters that use [Availability Zones][availability-zones], and 99.9% of availability for clusters that don't use Availability Zones. AKS uses master node replicas across update and fault domains to ensure SLA requirements are met.

AKS recommends use of Uptime SLA in production workloads to ensure availability of control plane components. By contrast, clusters on the **Free SKU tier** support fewer replicas and limited resources for the control plane and are not suitable for production workloads.

You can still create unlimited number of free clusters with a service level objective (SLO) of 99.5% and opt for the preferred SLO.

> [!IMPORTANT]
> For clusters with egress lockdown, see [limit egress traffic](limit-egress-traffic.md) to open appropriate ports.

## Region availability

* Uptime SLA is available in public regions and Azure Government regions where [AKS is supported](https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service).
* Uptime SLA is available for [private AKS clusters][private-clusters] in all public regions where AKS is supported.

## SLA terms and conditions

Uptime SLA is a paid feature and is enabled per cluster. Uptime SLA pricing is determined by the number of discrete clusters, and not by the size of the individual clusters. You can view [Uptime SLA pricing details](https://azure.microsoft.com/pricing/details/kubernetes-service/) for more information.

## Before you begin

[Azure CLI](/cli/azure/install-azure-cli) version 2.8.0 or later and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Creating a new cluster with Uptime SLA

To create a new cluster with the Uptime SLA, you use the Azure CLI. Create a new cluster in an existing resource group or create a new one. To learn more about resource groups and working with them, see [managing resource groups using the Azure CLI][manage-resource-group-cli].

Use the [az aks create][az-aks-create] command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one node enables the Uptime SLA. This operation takes several minutes to complete:

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --uptime-sla --node-count 1
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster. The following example output of the JSON snippet shows the paid tier for the SKU, indicating your cluster is enabled with Uptime SLA:

```output
  },
  "sku": {
    "name": "Basic",
    "tier": "Paid"
  },
```

## Modify an existing cluster to use Uptime SLA

You can update your existing clusters to use Uptime SLA.

> [!NOTE]
> Updating your cluster to enable the Uptime SLA does not disrupt its normal operation or impact its availability.

The following command uses the [az aks update][az-aks-update] command to update the existing cluster:

```azurecli-interactive
# Update an existing cluster to use Uptime SLA
az aks update --resource-group myResourceGroup --name myAKSCluster --uptime-sla
```

This process takes several minutes to complete. When finished, the following example JSON snippet shows the paid tier for the SKU, indicating your cluster is enabled with Uptime SLA:

```output
  },
  "sku": {
    "name": "Basic",
    "tier": "Paid"
  },
```

## Opt out of Uptime SLA

At any time you can opt out of using the Uptime SLA by updating your cluster to change it back to the free tier.

> [!NOTE]
> Updating your cluster to stop using the Uptime SLA does not disrupt its normal operation or impact its availability.

The following command uses the [az aks update][az-aks-update] command to update the existing cluster:

```azurecli-interactive
 az aks update --resource-group myResourceGroup --name myAKSCluster --no-uptime-sla
```

This process takes several minutes to complete.

## Next steps

- Use [Availability Zones][availability-zones] to increase high availability with your AKS cluster workloads.
- Configure your cluster to [limit egress traffic](limit-egress-traffic.md).

<!-- LINKS - External -->
[azure-support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
[region-availability]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service

<!-- LINKS - Internal -->
[vm-skus]: ../virtual-machines/sizes.md
[paid-sku-tier]: /rest/api/aks/managed-clusters/create-or-update#managedclusterskutier
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[manage-resource-group-cli]: ../azure-resource-manager/management/manage-resource-groups-cli.md
[faq]: ./faq.md
[availability-zones]: ./availability-zones.md
[az-aks-create]: /cli/azure/aks?#az_aks_create
[limit-egress-traffic]: ./limit-egress-traffic.md
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-group-delete]: /cli/azure/group#az_group_delete
[private-clusters]: private-clusters.md
[install-azure-cli]: /cli/azure/install-azure-cli