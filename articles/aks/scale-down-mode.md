---
title: Use Scale-down Mode for your Azure Kubernetes Service (AKS) cluster (preview)
titleSuffix: Azure Kubernetes Service
description: Learn how to use Scale-down Mode in Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 09/01/2021
ms.author: qpetraroia
author: qpetraroia
---

# Use Scale-down Mode to delete/deallocate nodes in Azure Kubernetes Service (AKS) (preview)

By default, scale-up operations performed manually or by the cluster autoscaler require the allocation and provisioning of new nodes, and scale-down operations delete nodes. Scale-down Mode allows you to decide whether you would like to delete or deallocate the nodes in your Azure Kubernetes Service (AKS) cluster upon scaling down. 

When an Azure VM is in the `Stopped` (deallocated) state, you will not be charged for the VM compute resources. However, you will still need to pay for any OS and data storage disks attached to the VM. This also means that the container images will be preserved on those nodes. For more information, see [States and billing of Azure Virtual Machines][state-billing-azure-vm]. This behavior allows for faster operation speeds, as your deployment leverages cached images. Scale-down Mode allows you to no longer have to pre-provision nodes and pre-pull container images, saving you compute cost.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you begin

> [!WARNING]
> In order to preserve any deallocated VMs, you must set Scale-down Mode to Deallocate. That includes VMs that have been deallocated using IaaS APIs (Virtual Machine Scale Set APIs). Setting Scale-down Mode to Delete will remove any deallocate VMs.

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

### Limitations

- [Ephemeral OS][ephemeral-os] disks are not supported. Be sure to specify managed OS disks via `--node-osdisk-type Managed` when creating a cluster or node pool.
- [Spot node pools][spot-node-pool] are not supported.

### Install aks-preview CLI extension

You also need the *aks-preview* Azure CLI extension version 0.5.30 or later. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Register the `AKS-ScaleDownModePreview` preview feature

To use the feature, you must also enable the `AKS-ScaleDownModePreview` feature flag on your subscription.

Register the `AKS-ScaleDownModePreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "AKS-ScaleDownModePreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AKS-ScaleDownModePreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Using Scale-down Mode to deallocate nodes on scale-down

By setting `--scale-down-mode Deallocate`, nodes will be deallocated during a scale-down of your cluster/node pool. All deallocated nodes are stopped. When your cluster/node pool needs to scale up, the deallocated nodes will be started first before any new nodes are provisioned.

In this example, we create a new node pool with 20 nodes and specify that upon scale-down, nodes are to be deallocated via `--scale-down-mode Deallocate`.

```azurecli-interactive
az aks nodepool add --node-count 20 --scale-down-mode Deallocate --node-osdisk-type Managed --max-pods 10 --name nodepool2 --cluster-name myAKSCluster --resource-group myResourceGroup
```

By scaling the node pool and changing the node count to 5, we will deallocate 15 nodes.

```azurecli-interactive
az aks nodepool scale --node-count 5 --name nodepool2 --cluster-name myAKSCluster --resource-group myResourceGroup
```

### Deleting previously deallocated nodes

To delete your deallocated nodes, you can change your Scale-down Mode to `Delete` by setting `--scale-down-mode Delete`. The 15 deallocated nodes will now be deleted.

```azurecli-interactive
az aks nodepool update --scale-down-mode Delete --name nodepool2 --cluster-name myAKSCluster --resource-group myResourceGroup
```

> [!NOTE]
> Changing your scale-down mode from `Deallocate` to `Delete` then back to `Deallocate` will delete all deallocated nodes while keeping your node pool in `Deallocate` scale-down mode.

## Using Scale-down Mode to delete nodes on scale-down

The default behavior of AKS without using Scale-down Mode is to delete your nodes when you scale-down your cluster. Using Scale-down Mode, this can be explicitly achieved by setting `--scale-down-mode Delete`.

In this example, we create a new node pool and specify that our nodes will be deleted upon scale-down via `--scale-down-mode Delete`. Scaling operations will be handled via the cluster autoscaler.

```azurecli-interactive
az aks nodepool add --enable-cluster-autoscaler --min-count 1 --max-count 10 --max-pods 10 --node-osdisk-type Managed --scale-down-mode Delete --name nodepool3 --cluster-name myAKSCluster --resource-group myResourceGroup
```

## Next steps

- To learn more about upgrading your AKS cluster, see [Upgrade an AKS cluster][aks-upgrade]
- To learn more about the cluster autoscaler, see [Automatically scale a cluster to meet application demands on AKS][cluster-autoscaler]

<!-- LINKS - Internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-aks-install-cli]: /cli/azure/aks#az_aks_install_cli
[az-provider-register]: /cli/azure/provider#az_provider_register
[aks-upgrade]: upgrade-cluster.md
[cluster-autoscaler]: cluster-autoscaler.md
[ephemeral-os]: cluster-configuration.md#ephemeral-os
[state-billing-azure-vm]: ../virtual-machines/states-billing.md
[spot-node-pool]: spot-node-pool.md