---
title: Use Availability Zones in Azure Kubernetes Service (AKS)
description: Learn how to create a cluster that distributes nodes across availability zones in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 03/11/2019
ms.author: iainfou
---

# Create an Azure Kubernetes Service (AKS) cluster that uses Availability Zones

An Azure Kubernetes Service (AKS) cluster distributes resources such as the nodes and storage across logical sections of the underlying Azure compute infrastructure. This deployment model makes sure that the nodes run across separate update and fault domains in a single Azure datacenter. AKS clusters deployed with this default behavior provide a high level of availability to protect against a hardware failure or planned maintenance event.

To provide a higher level of availability to your applications, AKS clusters can be distributed across availability zones. These zones are physically separate datacenters within a given region. When the cluster components are distributed across multiple zones, your AKS cluster is able to tolerate a failure in one of those zones. Your applications and management operations continue to be available even if one entire datacenter has a problem.

This article shows you how to create an AKS cluster and distribute the node components across availability zones.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Before you begin

You need the Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

To create an AKS cluster that availability zones, first enable a feature flag on your subscription. To register the *AvailabilityZonePreview* feature flag, use the [az feature register][az-feature-register] command as shown in the following example:

```azurecli-interactive
az feature register --name AvailabilityZonePreview --namespace Microsoft.ContainerService
```

It takes a few minutes for the status to show *Registered*. You can check on the registration status using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AvailabilityZonePreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Preview limitations and region availability

AKS clusters can currently be created using availability zones in the following regions:

* East US 2
* North Europe
* Southeast Asia
* West Europe
* West US 2

While this feature is in preview, the following limitations apply when you create an AKS cluster using availability zones:

* You can't disable availability zones for an AKS cluster once it has been created.
* The node size (VM SKU) selected must be available across all availability zones.

### Azure disks limitations

Volumes that use Azure managed disks are currently not zonal resources. Pods rescheduled in a different zone from their original zone can't reattach their previous disk(s). It's recommended to run stateless workloads that don't require persistent storage that may come across zonal issues.

If you must run stateful workloads, use taints and tolerations in your pod specs to tell the Kubernetes scheduler to create pods in the same zone as your disks. Alternatively, use network-based storage such as Azure Files that can attach to pods as they're scheduled between zones.

## Overview of Availability Zones for AKS clusters

Availability Zones is a high-availability offering that protects your applications and data from datacenter failures. Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there’s a minimum of three separate zones in all enabled regions. The physical separation of Availability Zones within a region protects applications and data from datacenter failures. Zone-redundant services replicate your applications and data across Availability Zones to protect from single-points-of-failure.

For more information, see [What are Availability Zones in Azure?][az-overview].

AKS clusters that are deployed using availability zones can distribute nodes across multiple zones within a single region. For example, a cluster in the *East US 2* region can create nodes in all three availability zones in *East US 2*. This distribution of AKS cluster resources improves cluster availability as they're resilient to failure of a specific zone.

![AKS node distribution across availability zones](media/availability-zones/aks-availability-zones.png)

In a zone outage, the nodes can be rebalanced manually or using the cluster autoscaler. If a single zone becomes unavailable, your applications continue to run.

## Create an AKS cluster across availability zones

When you create a cluster using the [az aks create][az-aks-create] command, the *--agent-zones* parameter defines which zones an agent node is deployed into.

The following example creates a cluster named *myAKSCluster* in the resource group named *myResourceGroup*. A total of *3* nodes are created - one agent in zone *1*, one in *2*, and then one in *3*:

```azurecli-interactive
az group create --name myResourceGroup --location eastus2

az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --kubernetes-version 1.12.6 \
    --generate-ssh-keys \
    --node-count 3 \
    --agent-zones 1 2 3
```

## Next steps

This article detailed how to create an AKS cluster that uses availability zones. For more considerations on highly available clusters, see [Best practices for business continuity and disaster recovery in AKS][best-practices-bc-dr].

<!-- LINKS - external -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-overview]: ../availability-zones/az-overview.md
[best-practices-bc-dr]: operator-best-practices-multi-region.md