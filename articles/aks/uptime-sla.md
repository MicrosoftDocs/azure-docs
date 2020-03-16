---
title: Azure Kubernetes Service (AKS) high availability with Uptime SLA
description: Learn about the optional high availability Uptime SLA offering for the Azure Kubernetes Service (AKS) API Server.
services: container-service
ms.topic: conceptual
ms.date: 03/11/2020
---

# Azure Kubernetes Service (AKS) Uptime SLA

When used with Availability Zones, this **optional** offering allows you to achieve 99.95% availability for the AKS cluster API server. If you do not use Availability Zones, you can achieve 99.9% availability. AKS uses master node replicas across update and fault domains to ensure SLA requirements are met.

> [!Important]
> For clusters with egress lockdown, see [limit egress traffic](limit-egress-traffic.md) to open appropriate ports for Uptime SLA.

## Region Availability

Uptime SLA is available in the following regions:

* Australia East
* Canada Central
* EAST US
* EAST US - 2
* SOUTH CENTRAL US
* WEST US2

## Prerequisites

* The Azure CLI version 2.7.0 or later

## SLA terms and conditions

Uptime SLA pricing is determined by the number of clusters, and not by the size of the clusters. You can view [Uptime SLA pricing details](https://azure.microsoft.com/pricing/details/kubernetes-service/) for more information.

## Creating a cluster with Uptime SLA

To create a new cluster with the Uptime SLA, you use the Azure CLI and the preview extension.

### Install aks-preview CLI extension

To set the cluster autoscaler settings profile, you need the *aks-preview* CLI extension version TODO or higher. Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, then check for any available updates using the [az extension update][az-extension-update] command:

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```
Use the [az aks create][az-aks-create] command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one node. Azure Monitor for containers is also enabled using the *--enable-addons monitoring* parameter.  This operation takes several minutes to complete.

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --uptime-sla --node-count 1 --enable-addons monitoring --generate-ssh-keys
```
After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## AKS clusters without Uptime SLA

Uptime SLA is an **optional paid service.** For clusters that do not use Uptime SLA, AKS strives to provide an SLA objective of at least 99.5 percent uptime for the Kubernetes API server.

The [Azure Kubernetes Service SLA](https://azure.microsoft.com/support/legal/sla/kubernetes-service/v1_0/) relies on the SLA for Virtual Machines. You can increase the VM availability with features like [Availability Zones][availability-zones].

For mission-critical workloads, use **Uptime SLA and Availability Zones** to increase availability for the API server of your AKS clusters.

## Limitations

* You can't currently add Uptime SLA to existing clusters.
* Currently, there is no way to remove Uptime SLA from an AKS cluster.  

## Next steps

Use [Availability Zones][availability-zones] to increase high availability with your AKS cluster workloads.

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
