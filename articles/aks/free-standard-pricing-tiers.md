---
title: Azure Kubernetes Service (AKS) Free and Standard pricing tiers for cluster management
description: Learn about the Azure Kubernetes Service (AKS) Free and Standard pricing tiers for cluster management
ms.topic: conceptual
ms.date: 02/17/2023
ms.custom: references_regions, devx-track-azurecli
---

# Free and Standard pricing tiers for Azure Kubernetes Service (AKS) cluster management

Azure Kubernetes Service (AKS) is now offering two pricing tiers for cluster management: the **Free tier** and the **Standard tier**.

> [!IMPORTANT]
>
> **Standard tier** is currently not available in Azure API 2023-01-01 due to a [critical bug](https://github.com/Azure/AKS/issues/3481). To enable the Uptime SLA feature in your cluster, you'll use the existing **Paid tier** and the `--uptime-sla` parameter.
>
> Alternatively, you can select the **Standard tier** or **Free tier** on Azure portal when creating or updating an AKS cluster.

|                  |Free tier|Standard tier|
|------------------|---------|--------|
|**When to use**|• You want to experiment with AKS at no extra cost <br> • You're new to AKS and Kubernetes|• You're running production or mission-critical workloads and need high availability and reliability <br> • You need a financially backed SLA|
|**Supported cluster types**|• Development clusters or small scale testing environments <br> • Clusters with fewer than 10 nodes|• Enterprise-grade or production workloads <br> • Clusters with up to 5,000 nodes|
|**Pricing**|• Free cluster management <br> • Pay-as-you-go for resources you consume|• Pay-as-you-go for resources you consume|
|**Feature comparison**|• Recommended for clusters with fewer than 10 nodes, but can support up to 1,000 nodes <br> • Includes all current AKS features|• Uptime SLA is enabled by default <br> • Greater cluster reliability and resources <br> • Can support up to 5,000 nodes in a cluster <br> • Includes all current AKS features

For more information on pricing, see the [AKS pricing details](https://azure.microsoft.com/pricing/details/kubernetes-service/).

## Uptime SLA terms and conditions

The Uptime SLA feature is included in the Paid tier and is enabled per cluster. For more information on pricing, see the [AKS pricing details](https://azure.microsoft.com/pricing/details/kubernetes-service/).

## Region availability

* Uptime SLA is available in public regions and Azure Government regions where [AKS is supported](https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service).
* Uptime SLA is available for [private AKS clusters][private-clusters] in all public regions where AKS is supported.

## Before you begin

[Azure CLI](/cli/azure/install-azure-cli) version 2.8.0 or later and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Create a new cluster in the Free tier or Paid tier

> [!IMPORTANT]
> `--tier standard` and `--tier free` are currently unavailable in Azure CLI 2.46.0 due to a [critical bug](https://github.com/Azure/AKS/issues/3481). To enable the Uptime SLA feature, use the commands below.

Use the Azure CLI to create a new cluster on an AKS pricing tier. You can create your cluster in an existing resource group or create a new one. To learn more about resource groups and working with them, see [managing resource groups using the Azure CLI][manage-resource-group-cli].

Use the [`az aks create`][az-aks-create] command to create an AKS cluster. The commands below show you how to create a new resource group named *myResourceGroup* and a cluster named *myAKSCluster* in that resource group in each tier.

```azurecli-interactive
# Create a new AKS cluster in the Free tier

az aks create --resource-group myResourceGroup --name myAKSCluster --no-uptime-sla

# Create a new AKS cluster in the Paid tier

az aks create --resource-group myResourceGroup --name myAKSCluster --uptime-sla
```

Once the deployment completes, it returns JSON-formatted information about your cluster:

```output
# Sample output for --no-uptime-sla

  },
  "sku": {
    "name": "Basic",
    "tier": "Free"
  },

# Sample output for --uptime-sla

  },
  "sku": {
    "name": "Base",
    "tier": "Paid"
  },
```

## Update the tier of an existing cluster

The following example uses the [`az aks update`][az-aks-update] command to update the existing cluster.

```azurecli-interactive
# Update an existing cluster to the Free tier

az aks update --resource-group myResourceGroup --name myAKSCluster --no-uptime-sla

# Update an existing cluster to the Standard tier

az aks update --resource-group myResourceGroup --name myAKSCluster --uptime-sla
```

This process takes several minutes to complete. When finished, the following example JSON snippet shows the Paid tier for the SKU, indicating your cluster is enabled with Uptime SLA.

```output
  },
  "sku": {
    "name": "Base",
    "tier": "Paid"
  },
```

## Next steps

* Use [Availability Zones][availability-zones] to increase high availability with your AKS cluster workloads.
* Configure your cluster to [limit egress traffic](limit-egress-traffic.md).

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