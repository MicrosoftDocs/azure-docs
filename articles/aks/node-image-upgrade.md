---
title: Upgrade Azure Kubernetes Service (AKS) node images 
description: Learn how to upgrade the images on AKS cluster nodes and node pools.
author: laurenhughes
ms.author: lahugh
ms.service: container-service
ms.topic: conceptual
ms.date: 06/08/2020
---

# Preview - Azure Kubernetes Service (AKS) node image upgrades

AKS supports upgrading the images on a node so you're up to date with the newest OS and runtime updates. AKS provides one new image per week with the latest updates, so it's beneficial to upgrade your node's images regularly for the latest features, including Linux or Windows patches. This article shows you how to upgrade AKS cluster node images as well as how to update node pool images without upgrading the version of Kubernetes.

If you're interested in learning about the latest images provided by AKS, see the [AKS release notes](https://github.com/Azure/AKS/releases) for more details.

For information on upgrading the Kubernetes version for your cluster, see [Upgrade an AKS cluster][upgrade-cluster].

## Register the node image upgrade preview feature

To use the node image upgrade feature during the preview period, you need to register the feature.

```azurecli
# Register the preview feature
az feature register --namespace "Microsoft.ContainerService" --name "NodeImageUpgradePreview"
```

It will take several minutes for the registration to complete. Use the following command to verify the feature is registered:

```azurecli
# Verify the feature is registered:
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/NodeImageUpgradePreview')].{Name:name,State:properties.state}"
```

During preview, you need the *aks-preview* CLI extension to use node image upgrade. Use the [az extension add][az-extension-add] command, and then check for any available updates using the [az extension update][az-extension-update] command:

```azurecli
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

## Upgrade all nodes in all node pools

Upgrading the node image is done with `az aks upgrade`. To upgrade the node image, use the following command:

```azurecli
az aks upgrade \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-image-only
```

During the upgrade, check the status of the node images with the following `kubectl` command to get the labels and filter out the current node image information:

```azurecli
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.kubernetes\.azure\.com\/node-image-version}{"\n"}{end}'
```

When the upgrade is complete, use `az aks show` to get the updated node pool details. The current node image is shown in the `nodeImageVersion` property.

```azurecli
az aks show \
    --resource-group myResourceGroup \
    --name myAKSCluster
```

## Upgrade a specific node pool

Upgrading the image on a node pool is similar to upgrading the image on a cluster.

To update the OS image of the node pool without performing a Kubernetes cluster upgrade, use the `--node-image-only` option in the following example:

```azurecli
az aks nodepool upgrade \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --node-image-only
```

During the upgrade, check the status of the node images with the following `kubectl` command to get the labels and filter out the current node image information:

```azurecli
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.kubernetes\.azure\.com\/node-image-version}{"\n"}{end}'
```

When the upgrade is complete, use `az aks nodepool show` to get the updated node pool details. The current node image is shown in the `nodeImageVersion` property.

```azurecli
az aks nodepool show \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool
```

## Upgrade node images with node surge

To speed up the node image upgrade process, you can upgrade your node images using a customizable node surge value. By default, AKS uses one additional node to configure upgrades.

If you'd like to increase the speed of upgrades, use the `--max-surge` value to configure the number of nodes to be used for upgrades so they complete faster. To learn more about the trade-offs of various `--max-surge` settings, see [Customize node surge upgrade][max-surge].

The following command sets the max surge value for performing a node image upgrade:

```azurecli
az aks nodepool upgrade \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --max-surge 33% \
    --node-image-only \
    --no-wait
```

During the upgrade, check the status of the node images with the following `kubectl` command to get the labels and filter out the current node image information:

```azurecli
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.kubernetes\.azure\.com\/node-image-version}{"\n"}{end}'
```

Use `az aks nodepool show` to get the updated node pool details. The current node image is shown in the `nodeImageVersion` property.

```azurecli
az aks nodepool show \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool
```

## Next steps

- See the [AKS release notes](https://github.com/Azure/AKS/releases) for information about the latest node images.
- Learn how to upgrade the Kubernetes version with [Upgrade an AKS cluster][upgrade-cluster].
- [Apply security and kernel updates to Linux nodes in Azure Kubernetes Service (AKS)][security-update]
- Learn more about multiple node pools and how to upgrade node pools with [Create and manage multiple node pools][use-multiple-node-pools].

<!-- LINKS - internal -->
[upgrade-cluster]: upgrade-cluster.md
[security-update]: node-updates-kured.md
[use-multiple-node-pools]: use-multiple-node-pools.md
[max-surge]: upgrade-cluster.md#customize-node-surge-upgrade-preview
