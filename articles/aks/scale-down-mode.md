---
title: Use Scale-down Mode for your Azure Kubernetes Service (AKS) cluster
titleSuffix: Azure Kubernetes Service
description: Learn how to use Scale-down Mode in Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 08/21/2023
ms.author: qpetraroia
author: qpetraroia
---

# Use Scale-down Mode to delete/deallocate nodes in Azure Kubernetes Service (AKS)

By default, scale-up operations performed manually or by the cluster autoscaler require the allocation and provisioning of new nodes, and scale-down operations delete nodes. Scale-down Mode allows you to decide whether you would like to delete or deallocate the nodes in your Azure Kubernetes Service (AKS) cluster upon scaling down.

When an Azure VM is in the `Stopped` (deallocated) state, you will not be charged for the VM compute resources. However, you'll still need to pay for any OS and data storage disks attached to the VM. This also means that the container images will be preserved on those nodes. For more information, see [States and billing of Azure Virtual Machines][state-billing-azure-vm]. This behavior allows for faster operation speeds, as your deployment uses cached images. Scale-down Mode removes the need to pre-provision nodes and pre-pull container images, saving you compute cost.

## Before you begin

> [!WARNING]
> In order to preserve any deallocated VMs, you must set Scale-down Mode to Deallocate. That includes VMs that have been deallocated using IaaS APIs (Virtual Machine Scale Set APIs). Setting Scale-down Mode to Delete will remove any deallocate VMs.
> Once applied the deallocated mode and scale down operation occured, those nodes keep registered in APIserver and appear as NotReady state.

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

### Limitations

- [Ephemeral OS][ephemeral-os] disks aren't supported. Be sure to specify managed OS disks by including the argument `--node-osdisk-type Managed` when creating a cluster or node pool.

> [!NOTE]
> Previously, while Scale-down Mode was in preview, [spot node pools][spot-node-pool] were unsupported. Now that Scale-down Mode is Generally Available, this limitation no longer applies.

## Using Scale-down Mode to deallocate nodes on scale-down

By setting `--scale-down-mode Deallocate`, nodes will be deallocated during a scale-down of your cluster/node pool. All deallocated nodes are stopped. When your cluster/node pool needs to scale up, the deallocated nodes are started first before any new nodes are provisioned.

In this example, we create a new node pool with 20 nodes and specify that upon scale-down, nodes are to be deallocated using the argument `--scale-down-mode Deallocate`.

```azurecli-interactive
az aks nodepool add --node-count 20 --scale-down-mode Deallocate --node-osdisk-type Managed --max-pods 10 --name nodepool2 --cluster-name myAKSCluster --resource-group myResourceGroup
```

By scaling the node pool and changing the node count to 5, we'll deallocate 15 nodes.

```azurecli-interactive
az aks nodepool scale --node-count 5 --name nodepool2 --cluster-name myAKSCluster --resource-group myResourceGroup
```

To deallocate Windows nodes during scale-down, run the following command. The default behavior is consistent with Linux nodes, where nodes are [deleted during scale-down](#using-scale-down-mode-to-delete-nodes-on-scale-down).

```azurecli-interactive
az aks nodepool add --node-count 20 --scale-down-mode Deallocate --os-type Windows --node-osdisk-type Managed --max-pods 10 --name npwin2 --cluster-name myAKSCluster --resource-group myResourceGroup
```

### Deleting previously deallocated nodes

To delete your deallocated nodes, you can change your Scale-down Mode to `Delete` by setting `--scale-down-mode Delete`. The 15 deallocated nodes will now be deleted.

```azurecli-interactive
az aks nodepool update --scale-down-mode Delete --name nodepool2 --cluster-name myAKSCluster --resource-group myResourceGroup
```

> [!NOTE]
> Changing your scale-down mode from `Deallocate` to `Delete` then back to `Deallocate` will delete all deallocated nodes while keeping your node pool in `Deallocate` scale-down mode.

## Using Scale-down Mode to delete nodes on scale-down

The default behavior of AKS without using Scale-down Mode is to delete your nodes when you scale-down your cluster. With Scale-down Mode, this behavior can be explicitly achieved by setting `--scale-down-mode Delete`.

In this example, we create a new node pool and specify that our nodes will be deleted upon scale-down using the argument `--scale-down-mode Delete`. Scaling operations will be handled using the cluster autoscaler.

```azurecli-interactive
az aks nodepool add --enable-cluster-autoscaler --min-count 1 --max-count 10 --max-pods 10 --node-osdisk-type Managed --scale-down-mode Delete --name nodepool3 --cluster-name myAKSCluster --resource-group myResourceGroup
```

## Next steps

- To learn more about upgrading your AKS cluster, see [Upgrade an AKS cluster][aks-upgrade]
- To learn more about the cluster autoscaler, see [Automatically scale a cluster to meet application demands on AKS][cluster-autoscaler]

<!-- LINKS - Internal -->
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[aks-upgrade]: upgrade-cluster.md
[cluster-autoscaler]: cluster-autoscaler.md
[ephemeral-os]: concepts-storage.md#ephemeral-os-disk
[state-billing-azure-vm]: ../virtual-machines/states-billing.md
[spot-node-pool]: spot-node-pool.md
