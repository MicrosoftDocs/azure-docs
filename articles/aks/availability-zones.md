---
title: Use Availability Zones in Azure Kubernetes Service (AKS)
description: Learn how to create a cluster that distributes nodes across availability zones in Azure Kubernetes Service (AKS)
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 06/24/2019
ms.author: mlearned
---

# Create an Azure Kubernetes Service (AKS) cluster that uses Availability Zones

An Azure Kubernetes Service (AKS) cluster distributes resources such as the nodes and storage across logical sections of the underlying Azure compute infrastructure. This deployment model makes sure that the nodes run across separate update and fault domains in a single Azure datacenter. AKS clusters deployed with this default behavior provide a high level of availability to protect against a hardware failure or planned maintenance event.

To provide a higher level of availability to your applications, AKS clusters can be distributed across availability zones. These zones are physically separate datacenters within a given region. When the cluster components are distributed across multiple zones, your AKS cluster is able to tolerate a failure in one of those zones. Your applications and management operations continue to be available even if one entire datacenter has a problem.

This article shows you how to create an AKS cluster and distribute the node components across availability zones.

## Before you begin

You need the Azure CLI version 2.0.76 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Limitations and region availability

AKS clusters can currently be created using availability zones in the following regions:

* Central US
* East US 2
* East US
* France Central
* Japan East
* North Europe
* Southeast Asia
* UK South
* West Europe
* West US 2

The following limitations apply when you create an AKS cluster using availability zones:

* You can only enable availability zones when the cluster is created.
* Availability zone settings can't be updated after the cluster is created. You also can't update an existing, non-availability zone cluster to use availability zones.
* You can't disable availability zones for an AKS cluster once it has been created.
* The node size (VM SKU) selected must be available across all availability zones.
* Clusters with availability zones enabled require use of Azure Standard Load Balancers for distribution across zones.
* You must use Kubernetes version 1.13.5 or greater in order to deploy Standard Load Balancers.

AKS clusters that use availability zones must use the Azure load balancer *standard* SKU, which is the default value for the load balancer type. This load balancer type can only be defined at cluster create time. For more information and the limitations of the standard load balancer, see [Azure load balancer standard SKU limitations][standard-lb-limitations].

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

When you create a cluster using the [az aks create][az-aks-create] command, the `--zones` parameter defines which zones agent nodes are deployed into. The AKS control plane components for your cluster are also spread across zones in the highest available configuration when you create a cluster specifying the `--zones` parameter.

If you don't define any zones for the default agent pool when you create an AKS cluster, the AKS control plane components for your cluster will not use availability zones. You can add additional node pools using the [az aks nodepool add][az-aks-nodepool-add] command and specify `--zones` for those new agent nodes, however the control plane components remain without availability zone awareness. You can't change the zone awareness for a node pool or the AKS control plane components once they're deployed.

The following example creates an AKS cluster named *myAKSCluster* in the resource group named *myResourceGroup*. A total of *3* nodes are created - one agent in zone *1*, one in *2*, and then one in *3*. The AKS control plane components are also distributed across zones in the highest available configuration since they're defined as part of the cluster create process.

```azurecli-interactive
az group create --name myResourceGroup --location eastus2

az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --generate-ssh-keys \
    --vm-set-type VirtualMachineScaleSets \
    --load-balancer-sku standard \
    --node-count 3 \
    --zones 1 2 3
```

It takes a few minutes to create the AKS cluster.

## Verify node distribution across zones

When the cluster is ready, list the agent nodes in the scale set to see what availability zone they're deployed in.

First, get the AKS cluster credentials using the [az aks get-credentials][az-aks-get-credentials] command:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

Next, use the [kubectl describe][kubectl-describe] command to list the nodes in the cluster. Filter on the *failure-domain.beta.kubernetes.io/zone* value as shown in the following example:

```console
kubectl describe nodes | grep -e "Name:" -e "failure-domain.beta.kubernetes.io/zone"
```

The following example output shows the three nodes distributed across the specified region and availability zones, such as *eastus2-1* for the first availability zone and *eastus2-2* for the second availability zone:

```console
Name:       aks-nodepool1-28993262-vmss000000
            failure-domain.beta.kubernetes.io/zone=eastus2-1
Name:       aks-nodepool1-28993262-vmss000001
            failure-domain.beta.kubernetes.io/zone=eastus2-2
Name:       aks-nodepool1-28993262-vmss000002
            failure-domain.beta.kubernetes.io/zone=eastus2-3
```

As you add additional nodes to an agent pool, the Azure platform automatically distributes the underlying VMs across the specified availability zones.

## Next steps

This article detailed how to create an AKS cluster that uses availability zones. For more considerations on highly available clusters, see [Best practices for business continuity and disaster recovery in AKS][best-practices-bc-dr].

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-overview]: ../availability-zones/az-overview.md
[best-practices-bc-dr]: operator-best-practices-multi-region.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[standard-lb-limitations]: load-balancer-standard.md#limitations
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-aks-nodepool-add]: /cli/azure/ext/aks-preview/aks/nodepool#ext-aks-preview-az-aks-nodepool-add
[az-aks-get-credentials]: /cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials

<!-- LINKS - external -->
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
