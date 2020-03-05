---
title: High Availability for Azure Kubernetes Service (AKS) control plane with Paid SKU SLA
description: Learn about high availability SLA of the Azure Kubernetes Service (AKS) control plane.
services: container-service
ms.topic: conceptual
ms.date: 03/05/2020
---

# AKS Paid SKU SLA

When used with Availability Zones, this offering allows you to achieve 99.95 % availablity for the AKS cluster API server. If you do not use Availability Zones, you can achieve 99.9 % availablity.

> [!Important]
> The SLA Agreement is for the API server endpoint availability, and not related to AKS control plane availability or performance.

## Region Availability

Paid SKU SLA is available in the following regions:

* Australia East
* Canada Central
* EAST US
* EAST US - 2
* SOUTH CENTRAL US
* WEST US2

## Prerequisites

* The Azure CLI version TODO or later.

## Creating a cluster with Paid SKU SLA

To create a new cluster with the Paid SKU SLA, you use the Azure CLI.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create an AKS cluster with Paid SKU SLA 

Use the [az aks create][az-aks-create] command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one node. Azure Monitor for containers is also enabled using the *--enable-addons monitoring* parameter.  This will take several minutes to complete.

> [!NOTE]
> When creating an AKS cluster a second resource group is automatically created to store the AKS resources. For more information see [Why are two resource groups created with AKS?](https://docs.microsoft.com/azure/aks/faq#why-are-two-resource-groups-created-with-aks)

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 1 --enable-addons monitoring --generate-ssh-keys --enable-paid-sku TODO to verify command
```
After a few minutes, the command completes and returns JSON-formatted information about the cluster.


## Removing Paid SKU SLA from a cluster

TODO

## Existing clusters

Currently there is no way to add Paid SKU SLA to an existing AKS cluster.

## AKS service-level agreement for non Paid SKU SLA

In a service-level agreement (SLA), the provider agrees to reimburse the customer for the cost of the service if the published service level isn't met. Since AKS is free, no cost is available to reimburse, so AKS has no formal SLA. However, AKS seeks to maintain availability of at least 99.5 percent for the Kubernetes API server.

It is important to recognize the distinction between AKS service availability which refers to uptime of the Kubernetes control plane and the availability of your specific workload which is running on Azure Virtual Machines. Although the control plane may be unavailable if the control plane is not ready, your cluster workloads running on Azure VMs can still function. Given Azure VMs are paid resources they are backed by a financial SLA. Read [here for more details](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_8/) on the Azure VM SLA and how to increase that availability with features like [Availability Zones][availability-zones].

## Billing details

The Paid SKU reimbursements will be performed on a monthly basis.  

## Next steps

Use [availability zones](availability-zones) to increase high availability with your AKS cluster workloads.

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
[region-availability]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service

<!-- LINKS - Internal -->
[vm-skus]: ../virtual-machines/linux/sizes.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[fag]: ./faq.md
[availability-zones]: ./availability-zones.md

