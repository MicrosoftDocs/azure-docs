---
title: Use ScaleDownMode for your Azure Kubernetes Service (AKS) cluster (preview)
titleSuffix: Azure Kubernetes Service
description: Learn how to use ScaleDownMode in Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 07/28/2021
ms.author: qpetraroia
author: qpetraroia

---

# Use Scale-Down-Mode to delete/deallocate your nodes in Azure Kubernetes Service (AKS) (preview)

Scale-Down-Mode allows you to decide whether you would like to delete or deallocate your nodes in your Azure Kubernetes Service (AKS) cluster. Before Scale-Down-Mode, scale operations would have to account for the time it takes for the cluster autoscaler to start up. You would also have to wait for the allocation and provisioning time of new nodes. By deallocating your nodes, your nodes will be stopped with their image cached. Allowing you to save on start times and costs as you no longer have to pre-provision nodes.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

### Install aks-preview CLI extension

You also need the *aks-preview* Azure CLI extension version 0.5.4 or later. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

## Default behavior: Deleting your nodes on scale-down

The default behavior of Azure Kubernetes Service (AKS) is to delete your nodes when you scale-down your cluster. To achieve this set `--scale-down-mode delete`.

In this example, we are adding cluster autoscaler to our cluster and making sure our nodes get deleted when we scale down.

```azurecli-interactive
 az aks create --enable-cluster-autoscaler --min-count 1 --max-count 100 --scale-down-mode delete --cluster-name myAKSCluster --resource-group myResourceGroup
```

In this example, we are adding cluster autoscaler to a node pool and making sure our nodes get deleted when we scale down.
```azurecli-interactive
az aks nodepool add --enable-cluster-autoscaler --min-count 1 --max-count 100 --scale-down-mode delete --node-pool nodepool1 --cluster-name myAKSCluster --resource-group myResourceGroup
```

## Deallocating your nodes manually

By setting `--scale-down-mode deallocate` you will be able to deallocate your nodes, when you decide to scale-down your cluster/node pool. All deallocated nodes are stopped, this means that when your cluster/node pool needs to scale up, all deallocated nodes will be started first before deciding to provision new nodes.

```azurecli-interactive
az aks nodepool add --node-count 50 --scale-down-policy deallocate --node-pool nodepool1 --cluster-name myAKSCluster --resource-group myResourceGroup
```

By updating the node pool and changing the nodes to 5, we will deallocate 45 nodes.

```azurecli-interactive
az aks nodepool update --node-count 5 --node-pool nodepool1 --cluster-name myAKSCluster --resource-group myResourceGroup --no-wait
```

To delete your deallocated nodes, you can change your scale-down-mode to delete by setting `--scale-down-mode delete`. The 45 deallocated nodes will now be deleted.

```azurecli-interactive
az aks nodepool update --scale-down-mode delete --node-pool nodepool1 --cluster-name myAKSCluster --resource-group myResourceGroup
```

## Next steps

- To get started with upgrading your AKS cluster, see [Upgrade an AKS cluster][aks-upgrade]

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
