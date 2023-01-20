---
title: Azure Kubernetes Service (AKS) Free and Standard pricing tiers for control plane management
description: Learn about the Azure Kubernetes Service (AKS) Free and Standard pricing tiers for control plane management
services: container-service
ms.topic: conceptual
ms.date: 01/20/2023
ms.custom: references_regions, devx-track-azurecli
---

# Free and Standard pricing tiers for Azure Kubernetes Service (AKS) control plane management

Azure Kubernetes Service (AKS) is now offering two pricing tiers for control plane management: the **Free tier** and the **Standard tier**.

|                  |Free tier|Standard tier|
|------------------|---------|--------|
|**When to use**|• You want to experiment with AKS at no extra cost <br> • You're new to AKS and Kubernetes|• You're running production or mission-critical workloads and need high availability and reliability <br> • You need a financially backed SLA|
|**Supported cluster types**|• Development clusters or small scale testing environments <br> • Clusters with fewer than 10 nodes|• Enterprise-grade or production workloads <br> • Clusters with up to 5,000 nodes|
|**Pricing**|• Free basic cluster management <br> • Pay-as-you-go for resources you consume|• $0.10 per cluster per hour for greater scaling and performance support <br> • Pay-as-you-go for resources you consume|
|**Feature comparison**|• Recommended for clusters with fewer than 10 nodes, but can support up to 1,000 nodes <br> • Includes all current AKS features|• Uptime SLA is enabled by default <br> • Greater control plane reliability and resources <br> • Can support up to 5,000 nodes in a cluster <br> • Includes all current AKS features

> [!NOTE]
> You can still create an unlimited number of free clusters with a service level objective (SLO) of 99.5% and opt for the preferred SLO.

For clusters with egress lockdown, see [limit egress traffic](limit-egress-traffic.md) to open appropriate ports.

## Uptime SLA

> [!IMPORTANT]
>
> Uptime SLA has been repositioned as a default feature included with the Standard tier.
>
> The repositioning will result in the following API changes:
>
> |         |Prior to 2023-01-01 API|Starting from 2023-01-01 API| Starting from 2023-07-01 API|
> |----------|-----------|------------|------------|
> |ManagedClusterSKUName|"Basic"|"Basic" <br> "Base"|"Base"|
> |ManagedClusterSKUTier|"Free" <br> "Paid"|"Free" <br> "Paid" <br> "Standard"|"Free" <br> "Standard"|
>
> "Basic" and "Paid" will be removed in the 2023-07-01 API version, and this will be a breaking change in API version 2023-07-01 or newer. If you use automated scripts, CD pipelines, ARM templates, Terraform, or other third-party tooling that relies on the above parameters, please be sure to make the necessary changes before upgrading to the 2023-07-01 or newer API version. From API version 2023-01-01 and newer, you can start transitioning to the new API parameters "Base" and "Standard".
>

The Uptime SLA feature in the Standard tier enables a financially backed, higher SLA for your AKS clusters. Clusters in the Standard tier come with a greater amount of control plane resources and provide automatic scaling. The Uptime SLA feature guarantees 99.95% availability of the Kubernetes API server endpoint for clusters using [Availability Zones][availability-zones], and 99.9% of availability for clusters that aren't using Availability Zones. AKS uses main node replicas across update and fault domains to ensure the SLA requirements are met.

### Uptime SLA terms and conditions

The Uptime SLA feature is included in the Standard tier and is enabled per cluster. The pricing is $0.10 per cluster per hour. For more information, see the [AKS pricing details](https://azure.microsoft.com/pricing/details/kubernetes-service/).

## Region availability

* Uptime SLA is available in public regions and Azure Government regions where [AKS is supported](https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service).
* Uptime SLA is available for [private AKS clusters][private-clusters] in all public regions where AKS is supported.

## Before you begin

[Azure CLI](/cli/azure/install-azure-cli) version 2.8.0 or later and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Creating a new cluster in the Free tier or Standard tier

Use the Azure CLI to create a new cluster in the *Free tier* or *Standard tier*. You can create your cluster in an existing resource group or create a new one. To learn more about resource groups and working with them, see [managing resource groups using the Azure CLI][manage-resource-group-cli].

Use the [`az aks create`][az-aks-create] command to create an AKS cluster. The commands below show you how to create a new resource group named *myResourceGroup* and a cluster named *myAKSCluster* in that resource group in each tier.

```azurecli-interactive
# Create a new AKS cluster in the Free tier

az aks create --resource-group myResourceGroup --name myAKSCluster --no-uptime-sla --node-count 1

# Create a new AKS cluster in the Standard tier

az aks create --resource-group myResourceGroup --name myAKSCluster `--uptime-sla`
```

> [!NOTE]
>
> The outputs to `--no-uptime-sla` and `--uptime-sla` correspond to API properties prior to the 2023-01-01 API version. Starting in Azure CLI 2.46.0:
>
> * `--tier free` will correspond to the existing `--no-uptime-sla` parameter.
> * `--tier standard` will correspond to the existing `--uptime-sla` parameter.
> * The CLI output will correspond to API properties: "Base" for ManagedClusterSKUName and "Free" or "Standard" for ManagerClusterSKUTier.
>

Once the deployment completes, it returns JSON-formatted information about your cluster. The following example output of the JSON snippet shows the *Standard tier* for the SKU, indicating your cluster is in the *Standard tier* and enabled with Uptime SLA.

```output
  },
  "sku": {
    "name": "Base",
    "tier": "Standard"
  },
```

The following example output of the JSON snippet shows the *Free tier* for the SKU, indicating your cluster is in the *Free tier* and enabled with Uptime SLA.

```output
  },
  "sku": {
    "name": "Base",
    "tier": "Free"
  },
```

## Update the tier of an existing cluster

The following example uses the [`az aks update`][az-aks-update] command to update the existing cluster.

```azurecli-interactive
# Update an existing cluster to the Free tier

az aks update --resource-group myResourceGroup --name myAKSCluster --tier free

# Update an existing cluster to the Standard tier

az aks update --resource-group myResourceGroup --name myAKSCluster --tier standard
```

This process takes several minutes to complete. When finished, the following example JSON snippet shows the paid tier for the SKU, indicating your cluster is enabled with Uptime SLA.

```output
  },
  "sku": {
    "name": "Base",
    "tier": "Standard"
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