---
title: Azure Kubernetes Service (AKS) Free and Standard pricing tiers for control plane management
description: Learn about the Azure Kubernetes Service (AKS) Free and Standard pricing tiers for control plane management
services: container-service
ms.topic: conceptual
ms.date: 12/02/2022
ms.custom: references_regions, devx-track-azurecli
---

# Free and Standard pricing tiers for Azure Kubernetes Service (AKS) control plane management

Azure Kubernetes Service (AKS) is now offering two pricing tiers for control plane management: the **Free tier** and the **Standard tier**.

|                  |Free tier|Standard tier|
|------------------|---------|--------|
|**When to use**|• You want to experiment with AKS at no additional cost and with no additional risks <br> • You're new to AKS and Kubernetes|• You're running production or mission-critical workloads and need high availability and reliability <br> * You need a financially backed SLA|
|**Supported cluster types**|• Development clusters or small scale testing environments <br> • Clusters with less than ten nodes|• Enterprise-grade or production workloads <br> • Clusters with up to 5,000 nodes|
|**Pricing**|• Free basic cluster management <br> • Pay-as-you-go for resources you consume|• $0.10 per cluster per hour for greater scaling and performance support <br> • Pay-as-you-go for resources you consume|
|**Feature comparison**|• Recommended for clusters with less than ten nodes, but can support up to 1,000 nodes <br> • Includes all current AKS features|• [Uptime SLA](#uptime-sla-feature) <br> • Greater control plane reliability and resources <br> • Can support up to 5,000 nodes in a cluster <br> • Includes all current AKS features

You can still create an unlimited number of free clusters with a service level objective (SLO) of 99.5% and opt for the preferred SLO.

> [!IMPORTANT]
> For clusters with egress lockdown, see [limit egress traffic](limit-egress-traffic.md) to open appropriate ports.

## Uptime SLA

> [!IMPORTANT]
>
> Uptime SLA has been repositioned as a feature of the Standard pricing tier. The estimated length of the transition process is six months. During this time, you're still able to use both the new and old SKUs, however, you'll be notified via email to begin using the new SKU name and API versions before the transition process ends. Once the process is complete, the old SKU names, API versions, and deployment parameters for Uptime SLA will be removed, and a three year breaking change for API changes will be introduced.

The Uptime SLA feature in the Standard pricing tier enables a financially backed, higher SLA for your AKS clusters. Clusters in the Standard tier come with a greater amount of control plane resources and provide automatic scaling. The Uptime SLA feature guarantees 99.95% availability of the Kubernetes API server endpoint for clusters using [Availability Zones][availability-zones], and 99.9% of availability for clusters that aren't using Availability Zones. AKS uses main node replicas across update and fault domains to ensure the SLA requirements are met.

### Uptime SLA terms and conditions

The Uptime SLA feature is included in the Standard tier and is enabled per cluster. The pricing is $0.10 per cluster per hour. See the [AKS pricing details](https://azure.microsoft.com/pricing/details/kubernetes-service/) for more information.

## Region availability

* Uptime SLA is available in public regions and Azure Government regions where [AKS is supported](https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service).
* Uptime SLA is available for [private AKS clusters][private-clusters] in all public regions where AKS is supported.

## Before you begin

[Azure CLI](/cli/azure/install-azure-cli) version 2.8.0 or later and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Creating a new cluster in the Free tier or Standard tier

Use the Azure CLI to create a new cluster in the Free tier or Standard tier. You can create your cluster in an existing resource group or create a new one. To learn more about resource groups and working with them, see [managing resource groups using the Azure CLI][manage-resource-group-cli].

Use the [`az aks create`][az-aks-create] command to create an AKS cluster. The commands below show you how to create a new resource group named *myResourceGroup* and a cluster named *myAKSCluster* in that resource group - one in the Free tier and one in the Standard tier.

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --tier standard --node-count 1
az aks create --resource-group myResourceGroup --name myAKSCluster --tier free
```

> [!NOTE]
>
> The `--tier standard` parameter corresponds to the existing `--uptime-sla` parameter. The `--tier free` parameter corresponds to the existing `--no-uptime-sla` parameter.

Once the deployment completes, it returns JSON-formatted information about your cluster. The following example output of the JSON snippet shows the Standard tier for the SKU, indicating your cluster is in the Standard tier and enabled with Uptime SLA:

```output
  },
  "sku": {
    "name": "Basic",
    "tier": "Standard"
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