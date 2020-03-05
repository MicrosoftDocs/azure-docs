---
title: High Availability for Azure Kubernetes Service (AKS) API server with Uptime SLA
description: Learn about the high availability Uptime SLA offering for the Azure Kubernetes Service (AKS) API Server.
services: container-service
ms.topic: conceptual
ms.date: 03/05/2020
---

# Azure Kubernetes Service (AKS) Uptime SLA

When used with Availability Zones, this offering allows you to achieve 99.95% availability for the AKS cluster API server. If you do not use Availability Zones, you can achieve 99.9% availability. AKS uses master node replicas across update and fault domains to ensure SLA requirements are met.

> [!Important]
> The SLA Agreement is for the API server endpoint availability, and is not related to AKS control plane availability or it's performance.

## Region Availability

Uptime SLA is available in the following regions:

* Australia East
* Canada Central
* EAST US
* EAST US - 2
* SOUTH CENTRAL US
* WEST US2

## Prerequisites

* The Azure CLI version TODO or later.

## AKS service-level-agreement

In a service-level agreement (SLA), the provider agrees to reimburse the customer for the cost of the service if the published service level isn't met. Since AKS is free, no cost is available to reimburse for clusters not using Uptime SLA, so AKS has no formal SLA. However, AKS seeks to maintain availability of at least 99.5 percent for the Kubernetes API server.

It is important to recognize the distinction between AKS service availability which refers to uptime of the Kubernetes API server and the availability of your specific workload which is running on Azure Virtual Machines. Although the API server may be unavailable if the API server is not ready, your cluster workloads running on Azure VMs can still function. Given Azure VMs are paid resources they are backed by a [financial SLA for VMs](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_8/). You can increase the VM availability with features like [Availability Zones][availability-zones].

For mission-critical workloads, use Uptime SLA and Availability Zones to increase availability for the API server of your AKS clusters.

## Creating a cluster with Uptime SLA

To create a new cluster with the Uptime SLA, you use the Azure CLI.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```
Use the [az aks create][az-aks-create] command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one node. Azure Monitor for containers is also enabled using the *--enable-addons monitoring* parameter.  This will take several minutes to complete.

> [!NOTE]
> When creating an AKS cluster a second resource group is automatically created to store the AKS resources. For more information see [Why are two resource groups created with AKS?](https://docs.microsoft.com/azure/aks/faq#why-are-two-resource-groups-created-with-aks)

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 1 --enable-addons monitoring --generate-ssh-keys --enable-paid-sku TODO to verify command
```
After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Add Uptime SLA to existing clusters

You can't currently add Uptime SLA to existing clusters.

## Removing Uptime SLA from a cluster

Currently there is no way to remove Uptime SLA from an AKS cluster.

TODO

## Billing and refunds

The Uptime SLA reimbursements will be performed on a monthly basis. The billing unit is calculated TODO per cluster/hour. TODO legal?

## Next steps

Use [Availability Zones](availability-zones) to increase high availability with your AKS cluster workloads.

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
[region-availability]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service

<!-- LINKS - Internal -->
[vm-skus]: ../virtual-machines/linux/sizes.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[faq]: ./faq.md
[availability-zones]: ./availability-zones.md
[az-aks-create]: /cli/azure/aks?view=azure-cli-latest#az-aks-create

