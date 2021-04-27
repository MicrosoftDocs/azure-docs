---
title: Use availability zones in Azure Kubernetes Service (AKS)
description: Learn how to create a cluster that distributes nodes across availability zones in Azure Kubernetes Service (AKS)
services: container-service
ms.custom: fasttrack-edit, references_regions, devx-track-azurecli
ms.topic: article
ms.date: 03/16/2021

---

# Create an Azure Kubernetes Service (AKS) cluster that uses availability zones

An Azure Kubernetes Service (AKS) cluster distributes resources such as nodes and storage across logical sections of underlying Azure infrastructure. This deployment model when using availability zones, ensures nodes in a given availability zone are physically separated from those defined in another availability zone. AKS clusters deployed with multiple availability zones configured across a cluster provide a higher level of availability to protect against a hardware failure or a planned maintenance event.

By defining node pools in a cluster to span multiple zones, nodes in a given node pool are able to continue operating even if a single zone has gone down. Your applications can continue to be available even if there is a physical failure in a single datacenter if orchestrated to tolerate failure of a subset of nodes.

This article shows you how to create an AKS cluster and distribute the node components across availability zones.

## Before you begin

You need the Azure CLI version 2.0.76 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Limitations and region availability

AKS clusters can currently be created using availability zones in the following regions:

* Australia East
* Brazil South
* Canada Central
* Central US
* East US 
* East US 2
* France Central
* Germany West Central
* Japan East
* North Europe
* Southeast Asia
* South Central US
* UK South
* US Gov Virginia
* West Europe
* West US 2

The following limitations apply when you create an AKS cluster using availability zones:

* You can only define availability zones when the cluster or node pool is created.
* Availability zone settings can't be updated after the cluster is created. You also can't update an existing, non-availability zone cluster to use availability zones.
* The chosen node size (VM SKU) selected must be available across all availability zones selected.
* Clusters with availability zones enabled require use of Azure Standard Load Balancers for distribution across zones. This load balancer type can only be defined at cluster create time. For more information and the limitations of the standard load balancer, see [Azure load balancer standard SKU limitations][standard-lb-limitations].

### Azure disks limitations

Volumes that use Azure managed disks are currently not zone-redundant resources. Volumes cannot be attached across zones and must be co-located in the same zone as a given node hosting the target pod.

Kubernetes is aware of Azure availability zones since version 1.12. You can deploy a PersistentVolumeClaim object referencing an Azure Managed Disk in a multi-zone AKS cluster and [Kubernetes will take care of scheduling](https://kubernetes.io/docs/setup/best-practices/multiple-zones/#storage-access-for-zones) any pod that claims this PVC in the correct availability zone.

## Overview of availability zones for AKS clusters

Availability zones are a high-availability offering that protects your applications and data from datacenter failures. Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there's always more than one zone in all zone enabled regions. The physical separation of availability zones within a region protects applications and data from datacenter failures.

For more information, see [What are availability zones in Azure?][az-overview].

AKS clusters that are deployed using availability zones can distribute nodes across multiple zones within a single region. For example, a cluster in the *East US 2* region can create nodes in all three availability zones in *East US 2*. This distribution of AKS cluster resources improves cluster availability as they're resilient to failure of a specific zone.

![AKS node distribution across availability zones](media/availability-zones/aks-availability-zones.png)

If a single zone becomes unavailable, your applications continue to run if the cluster is spread across multiple zones.

## Create an AKS cluster across availability zones

When you create a cluster using the [az aks create][az-aks-create] command, the `--zones` parameter defines which zones agent nodes are deployed into. The control plane components such as etcd or the API are spread across the available zones in the region if you define the `--zones` parameter at cluster creation time. The specific zones which the control plane components are spread across are independent of what explicit zones are selected for the initial node pool.

If you don't define any zones for the default agent pool when you create an AKS cluster, control plane components are not guaranteed to spread across availability zones. You can add additional node pools using the [az aks nodepool add][az-aks-nodepool-add] command and specify `--zones` for new nodes, but it will not change how the control plane has been spread across zones. Availability zone settings can only be defined at cluster or node pool create-time.

The following example creates an AKS cluster named *myAKSCluster* in the resource group named *myResourceGroup*. A total of *3* nodes are created - one agent in zone *1*, one in *2*, and then one in *3*.

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

When deciding what zone a new node should belong to, a given AKS node pool will use a [best effort zone balancing offered by underlying Azure Virtual Machine Scale Sets][vmss-zone-balancing]. A given AKS node pool is considered "balanced" if each zone has the same number of VMs or +\- 1 VM in all other zones for the scale set.

## Verify node distribution across zones

When the cluster is ready, list the agent nodes in the scale set to see what availability zone they're deployed in.

First, get the AKS cluster credentials using the [az aks get-credentials][az-aks-get-credentials] command:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

Next, use the [kubectl describe][kubectl-describe] command to list the nodes in the cluster and filter on the *failure-domain.beta.kubernetes.io/zone* value. The following example is for a Bash shell.

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

Note that in newer Kubernetes versions (1.17.0 and later), AKS is using the newer label `topology.kubernetes.io/zone` in addition to the deprecated `failure-domain.beta.kubernetes.io/zone`. You can get the same result as above with by running the following script:

```console
kubectl get nodes -o custom-columns=NAME:'{.metadata.name}',REGION:'{.metadata.labels.topology\.kubernetes\.io/region}',ZONE:'{metadata.labels.topology\.kubernetes\.io/zone}'
```

Which will give you a more succinct output:

```console
NAME                                REGION   ZONE
aks-nodepool1-34917322-vmss000000   eastus   eastus-1
aks-nodepool1-34917322-vmss000001   eastus   eastus-2
aks-nodepool1-34917322-vmss000002   eastus   eastus-3
```

## Verify pod distribution across zones

As documented in [Well-Known Labels, Annotations and Taints][kubectl-well_known_labels], Kubernetes uses the `failure-domain.beta.kubernetes.io/zone` label to automatically distribute pods in a replication controller or service across the different zones available. In order to test this, you can scale up your cluster from 3 to 5 nodes, to verify correct pod spreading:

```azurecli-interactive
az aks scale \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 5
```

When the scale operation completes after a few minutes, the command `kubectl describe nodes | grep -e "Name:" -e "failure-domain.beta.kubernetes.io/zone"` in a Bash shell should give an output similar to this sample:

```console
Name:       aks-nodepool1-28993262-vmss000000
            failure-domain.beta.kubernetes.io/zone=eastus2-1
Name:       aks-nodepool1-28993262-vmss000001
            failure-domain.beta.kubernetes.io/zone=eastus2-2
Name:       aks-nodepool1-28993262-vmss000002
            failure-domain.beta.kubernetes.io/zone=eastus2-3
Name:       aks-nodepool1-28993262-vmss000003
            failure-domain.beta.kubernetes.io/zone=eastus2-1
Name:       aks-nodepool1-28993262-vmss000004
            failure-domain.beta.kubernetes.io/zone=eastus2-2
```

We now have two additional nodes in zones 1 and 2. You can deploy an application consisting of three replicas. We will use NGINX as an example:

```console
kubectl create deployment nginx --image=mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
kubectl scale deployment nginx --replicas=3
```

By viewing nodes where your pods are running, you see pods are running on the nodes corresponding to three different availability zones. For example, with the command `kubectl describe pod | grep -e "^Name:" -e "^Node:"` in a Bash shell you would get an output similar to this:

```console
Name:         nginx-6db489d4b7-ktdwg
Node:         aks-nodepool1-28993262-vmss000000/10.240.0.4
Name:         nginx-6db489d4b7-v7zvj
Node:         aks-nodepool1-28993262-vmss000002/10.240.0.6
Name:         nginx-6db489d4b7-xz6wj
Node:         aks-nodepool1-28993262-vmss000004/10.240.0.8
```

As you can see from the previous output, the first pod is running on node 0, which is located in the availability zone `eastus2-1`. The second pod is running on node 2, which corresponds to `eastus2-3`, and the third one in node 4, in `eastus2-2`. Without any additional configuration, Kubernetes is spreading the pods correctly across all three availability zones.

## Next steps

This article detailed how to create an AKS cluster that uses availability zones. For more considerations on highly available clusters, see [Best practices for business continuity and disaster recovery in AKS][best-practices-bc-dr].

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-overview]: ../availability-zones/az-overview.md
[best-practices-bc-dr]: operator-best-practices-multi-region.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[standard-lb-limitations]: load-balancer-standard.md#limitations
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-aks-nodepool-add]: /cli/azure/ext/aks-preview/aks/nodepool#ext-aks-preview-az-aks-nodepool-add
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[vmss-zone-balancing]: ../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#zone-balancing

<!-- LINKS - external -->
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-well_known_labels]: https://kubernetes.io/docs/reference/labels-annotations-taints/
