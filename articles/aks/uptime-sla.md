---
title: Azure Kubernetes Service (AKS) with Uptime SLA
description: Learn about the optional Uptime SLA offering for the Azure Kubernetes Service (AKS) API Server.
services: container-service
ms.topic: conceptual
ms.date: 05/19/2020
ms.custom: references_regions
---

# Azure Kubernetes Service (AKS) Uptime SLA

Uptime SLA is an optional feature to enable a financially backed, higher SLA for a cluster. Uptime SLA guarantees 99.95% availability of the Kubernetes API server endpoint for clusters that use [Availability Zones][availability-zones] and 99.9% of availability for clusters that don't use Availability Zones. AKS uses master node replicas across update and fault domains to ensure SLA requirements are met.

Customers needing an SLA to meet compliance requirements or require extending an SLA to their end-users should enable this feature. Customers with critical workloads that will benefit from a higher uptime SLA may also benefit. Using the Uptime SLA feature with Availability Zones enables a higher availability for the uptime of the Kubernetes API server.  

Customers can still create unlimited free clusters with a service level objective (SLO) of 99.5% and opt for the preferred SLO or SLA Uptime as needed.

> [!Important]
> For clusters with egress lockdown, see [limit egress traffic](limit-egress-traffic.md) to open appropriate ports.

## SLA terms and conditions

Uptime SLA is a paid feature and enabled per cluster. Uptime SLA pricing is determined by the number of discrete clusters, and not by the size of the individual clusters. You can view [Uptime SLA pricing details](https://azure.microsoft.com/pricing/details/kubernetes-service/) for more information.

## Before you begin

* The Azure CLI version 2.7.0 or later

## Creating a cluster with Uptime SLA

To create a new cluster with the Uptime SLA, you use the Azure CLI.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```
Use the [az aks create][az-aks-create] command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one node. Azure Monitor for containers is also enabled using the *--enable-addons monitoring* parameter.  This operation takes several minutes to complete.

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --uptime-sla --node-count 1 --enable-addons monitoring --generate-ssh-keys
```
After a few minutes, the command completes and returns JSON-formatted information about the cluster. The following JSON snippet shows the paid tier for the SKU, indicating your cluster is enabled with Uptime SLA.

```output
  },
  "sku": {
    "name": "Basic",
    "tier": "Paid"
  },
```

## Limitations

* Currently, cannot convert as existing cluster to enable the Uptime SLA.
* Currently, there is no way to remove Uptime SLA from an AKS cluster after creation with it enabled.  
* Private clusters aren't currently supported.

## Next steps

Use [Availability Zones][availability-zones] to increase high availability with your AKS cluster workloads.
Configure your cluster to [limit egress traffic](limit-egress-traffic.md).

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
[region-availability]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service

<!-- LINKS - Internal -->
[vm-skus]: ../virtual-machines/linux/sizes.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[faq]: ./faq.md
[availability-zones]: ./availability-zones.md
[az-aks-create]: /cli/azure/aks?view=azure-cli-latest#az-aks-create
[limit-egress-traffic]: ./limit-egress-traffic.md
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
