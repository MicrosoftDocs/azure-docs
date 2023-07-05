---
title: Use proximity placement groups to reduce latency for Azure Kubernetes Service (AKS) clusters
description: Learn how to use proximity placement groups to reduce latency for your Azure Kubernetes Service (AKS) cluster workloads.
ms.topic: article
ms.date: 06/19/2023
---

# Use proximity placement groups to reduce latency for Azure Kubernetes Service (AKS) clusters

> [!NOTE]
> When using proximity placement groups on AKS, colocation only applies to the agent nodes. Node to node and the corresponding hosted pod to pod latency is improved. The colocation doesn't affect the placement of a cluster's control plane.

When deploying your application in Azure, you can create network latency by spreading virtual machine (VM) instances across regions or availability zones, which may impact the overall performance of your application. A proximity placement group is a logical grouping used to make sure Azure compute resources are physically located close to one another. Some applications, such as gaming, engineering simulations, and high-frequency trading (HFT) require low latency and tasks that can complete quickly. For similar high-performance computing (HPC) scenarios, consider using [proximity placement groups](../virtual-machines/co-location.md#proximity-placement-groups) (PPG) for your cluster's node pools.

## Before you begin

This article requires Azure CLI version 2.14 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### Limitations

* A proximity placement group can map to only *one* availability zone.
* A node pool must use Virtual Machine Scale Sets to associate a proximity placement group.
* A node pool can associate a proximity placement group at node pool create time only.

## Node pools and proximity placement groups

The first resource you deploy with a proximity placement group attaches to a specific data center. Any extra resources you deploy with the same proximity placement group are colocated in the same data center. Once all resources using the proximity placement group are stopped (deallocated) or deleted, it's no longer attached.

* You can associate multiple node pools with a single proximity placement group.
* You can only associate a node pool with a single proximity placement group.

### Configure proximity placement groups with availability zones

> [!NOTE]
> While proximity placement groups require a node pool to use only *one* availability zone, the [baseline Azure VM SLA of 99.9%](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_9/) is still in effect for VMs in a single zone.

Proximity placement groups are a node pool concept and associated with each individual node pool. Using a PPG resource has no impact on AKS control plane availability, which can impact how you should design your cluster with zones. To ensure a cluster is spread across multiple zones, we recommend using the following design:

* Provision a cluster with the first system pool using *three* zones and no proximity placement group associated to ensure the system pods land in a dedicated node pool, which spreads across multiple zones.
* Add extra user node pools with a unique zone and proximity placement group associated to each pool. An example is *nodepool1* in zone one and PPG1, *nodepool2* in zone two and PPG2, and *nodepool3* in zone 3 with PPG3. This configuration ensures that, at a cluster level, nodes are spread across multiple zones and each individual node pool is colocated in the designated zone with a dedicated PPG resource.

## Create a new AKS cluster with a proximity placement group

Accelerated networking greatly improves networking performance of virtual machines. Ideally, use proximity placement groups with accelerated networking. By default, AKS uses accelerated networking on [supported virtual machine instances](../virtual-network/accelerated-networking-overview.md?toc=/azure/virtual-machines/linux/toc.json#limitations-and-constraints), which include most Azure virtual machine with two or more vCPUs.

1. Create an Azure resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location centralus
    ```

2. Create a proximity placement group using the [`az ppg create`][az-ppg-create] command. Make sure to note the ID value in the output.

    ```azurecli-interactive
    az ppg create -n myPPG -g myResourceGroup -l centralus -t standard
    ```

    The command produces an output similar to the following example output, which includes the *ID* value you need for upcoming CLI commands.

    ```output
    {
      "availabilitySets": null,
      "colocationStatus": null,
      "id": "/subscriptions/yourSubscriptionID/resourceGroups/myResourceGroup/providers/Microsoft.Compute/proximityPlacementGroups/myPPG",
      "location": "centralus",
      "name": "myPPG",
      "proximityPlacementGroupType": "Standard",
      "resourceGroup": "myResourceGroup",
      "tags": {},
      "type": "Microsoft.Compute/proximityPlacementGroups",
      "virtualMachineScaleSets": null,
      "virtualMachines": null
    }
    ```

3. Create an AKS cluster using the [`az aks create`][az-aks-create] command and replace the *myPPGResourceID* value with your proximity placement group resource ID from the previous step.

    ```azurecli-interactive
    az aks create \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --ppg myPPGResourceID
    ```

## Add a proximity placement group to an existing cluster

You can add a proximity placement group to an existing cluster by creating a new node pool. You can then optionally migrate existing workloads to the new node pool and delete the original node pool.

Use the same proximity placement group that you created earlier to ensure agent nodes in both node pools in your AKS cluster are physically located in the same data center.

* Create a new node pool using the [`az aks nodepool add`][az-aks-nodepool-add] command and replace the *myPPGResourceID* value with your proximity placement group resource ID.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name mynodepool \
        --node-count 1 \
        --ppg myPPGResourceID
    ```

## Clean up

* Delete the Azure resource group along with its resources using the [`az group delete`][az-group-delete] command.

    ```azurecli-interactive
    az group delete --name myResourceGroup --yes --no-wait
    ```

## Next steps

Learn more about [proximity placement groups][proximity-placement-groups].

<!-- LINKS - Internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
[proximity-placement-groups]: ../virtual-machines/co-location.md#proximity-placement-groups
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[az-group-create]: /cli/azure/group#az_group_create
[az-group-delete]: /cli/azure/group#az_group_delete
[az-ppg-create]: /cli/azure/ppg#az_ppg_create
