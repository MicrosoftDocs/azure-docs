---
title: Azure Kubernetes Service (AKS) with Uptime SLA
description: Learn about the optional Uptime SLA offering for the Azure Kubernetes Service (AKS) API Server.
services: container-service
ms.topic: conceptual
ms.date: 01/08/2021
ms.custom: references_regions, devx-track-azurecli
---

# Azure Kubernetes Service (AKS) Uptime SLA

Uptime SLA is an optional feature to enable a financially backed, higher SLA for a cluster. Uptime SLA guarantees 99.95% availability of the Kubernetes API server endpoint for clusters that use [Availability Zones][availability-zones] and 99.9% of availability for clusters that don't use Availability Zones. AKS uses master node replicas across update and fault domains to ensure SLA requirements are met.

Customers needing an SLA to meet compliance requirements or require extending an SLA to their end users should enable this feature. Customers with critical workloads that will benefit from a higher uptime SLA may also benefit. Using the Uptime SLA feature with Availability Zones enables a higher availability for the uptime of the Kubernetes API server.  

Customers can still create unlimited free clusters with a service level objective (SLO) of 99.5% and opt for the preferred SLO or SLA Uptime as needed.

> [!Important]
> For clusters with egress lockdown, see [limit egress traffic](limit-egress-traffic.md) to open appropriate ports.

## Region availability

* Uptime SLA is available in public regions and Azure Government regions where [AKS is supported](https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service).
* Uptime SLA is available for [private AKS clusters][private-clusters] in all public regions where AKS is supported.

## SLA terms and conditions

Uptime SLA is a paid feature and enabled per cluster. Uptime SLA pricing is determined by the number of discrete clusters, and not by the size of the individual clusters. You can view [Uptime SLA pricing details](https://azure.microsoft.com/pricing/details/kubernetes-service/) for more information.

## Before you begin

* Install the [Azure CLI](/cli/azure/install-azure-cli) version 2.8.0 or later

## Creating a new cluster with Uptime SLA

To create a new cluster with the Uptime SLA, you use the Azure CLI.

The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
# Create a resource group
az group create --name myResourceGroup --location eastus
```
Use the [`az aks create`][az-aks-create] command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one node. This operation takes several minutes to complete:

```azurecli-interactive
# Create an AKS cluster with uptime SLA
az aks create --resource-group myResourceGroup --name myAKSCluster --uptime-sla --node-count 1
```
After a few minutes, the command completes and returns JSON-formatted information about the cluster. The following JSON snippet shows the paid tier for the SKU, indicating your cluster is enabled with Uptime SLA:

```output
  },
  "sku": {
    "name": "Basic",
    "tier": "Paid"
  },
```

## Modify an existing cluster to use Uptime SLA

You can optionally update your existing clusters to use Uptime SLA.

If you created an AKS cluster with the previous steps, delete the resource group:

```azurecli-interactive
# Delete the existing cluster by deleting the resource group 
az group delete --name myResourceGroup --yes --no-wait
```

Create a new resource group:

```azurecli-interactive
# Create a resource group
az group create --name myResourceGroup --location eastus
```

Create a new cluster, and don't use Uptime SLA:

```azurecli-interactive
# Create a new cluster without uptime SLA
az aks create --resource-group myResourceGroup --name myAKSCluster--node-count 1
```

Use the [`az aks update`][az-aks-update] command to update the existing cluster:

```azurecli-interactive
# Update an existing cluster to use Uptime SLA
 az aks update --resource-group myResourceGroup --name myAKSCluster --uptime-sla
 ```

 The following JSON snippet shows the paid tier for the SKU, indicating your cluster is enabled with Uptime SLA:

 ```output
  },
  "sku": {
    "name": "Basic",
    "tier": "Paid"
  },
  ```

## Opt out of Uptime SLA

You can update your cluster to change to the free tier and opt out of Uptime SLA.

```azurecli-interactive
# Update an existing cluster to opt out of Uptime SLA
 az aks update --resource-group myResourceGroup --name myAKSCluster --no-uptime-sla
 ```

## Clean up

To avoid charges, clean up any resources you created. To delete the cluster, use the [`az group delete`][az-group-delete] command to delete the AKS resource group:

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```


## Next steps

Use [Availability Zones][availability-zones] to increase high availability with your AKS cluster workloads.

Configure your cluster to [limit egress traffic](limit-egress-traffic.md).

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
[region-availability]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service

<!-- LINKS - Internal -->
[vm-skus]: ../virtual-machines/sizes.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[faq]: ./faq.md
[availability-zones]: ./availability-zones.md
[az-aks-create]: /cli/azure/aks?#az_aks_create
[limit-egress-traffic]: ./limit-egress-traffic.md
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-group-delete]: /cli/azure/group#az_group_delete
[private-clusters]: private-clusters.md
