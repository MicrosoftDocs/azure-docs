---
title: Azure Kubernetes Service (AKS) high availability with Uptime SLA
description: Learn about the optional high availability Uptime SLA offering for the Azure Kubernetes Service (AKS) API Server.
services: container-service
ms.topic: conceptual
ms.date: 03/11/2020
---

# Azure Kubernetes Service (AKS) Uptime SLA

Uptime SLA is an optional feature on AKS to provide higher SLA guarantees for customers. The higher availability is for Kubernetes API server endpoint. When used with Availability Zones, this **optional** offering allows you to achieve 99.95% availability for the AKS cluster API server. If you do not use Availability Zones, you can achieve 99.9% availability. AKS uses master node replicas across update and fault domains to ensure SLA requirements are met. 

Customers needing SLA for compliance reasons or extending SLA's to their customers should turn on this feature. Customers with critical workloads who need higher availability with an option of SLA benefit from enabling this feature. Enable the feature with Availablity Zones to obtain higher availability of the Kubernetes API server.  

Customers can create unlimited free clusters with a service level objective (SLO) of 99.5%.

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

To create a new cluster with the Uptime SLA, you use the Azure CLI.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```
Use the [az aks create][az-aks-create] command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one node. Azure Monitor for containers is also enabled using the *--enable-addons monitoring* parameter.  This operation takes several minutes to complete.

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --uptime-sla --node-count 1 --enable-addons monitoring --generate-ssh-keys
```
After a few minutes, the command completes and returns JSON-formatted information about the cluster.

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
